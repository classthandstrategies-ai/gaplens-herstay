import {
  AnalysisReport,
  EmploymentHub,
  MarketGapHypothesis,
  MarketMetrics,
  PlaceListing,
  ThemeAggregate,
} from '../types';
import { extractReviewThemes } from './themeExtractor';

/**
 * Standard methodology limitations disclaimer
 */
export const METHODOLOGY_LIMITATIONS: string[] = [
  'Maps search results represent a discoverable public sample of accommodations, not an exhaustive registry of all available beds or unregistered PG facilities.',
  'Online reviews represent subjective resident and visitor feedback and cannot verify physical vacancy rates, financial health, or formal legal compliance.',
  'Security and safety mentions in customer reviews are unverified personal assertions and do not constitute an official municipal or police security audit.',
  'Distances shown are direct straight-line spherical calculations from the primary hub coordinate and do not reflect peak-hour road traffic or transit detours.',
  'Identified opportunities represent potential supply-quality market gaps indicated by friction in publicly available search data, not guaranteed commercial returns.',
];

/**
 * Computes high-level market metrics
 */
export function computeMarketMetrics(
  listings: PlaceListing[],
  radiusKm: number,
  themeAggregates: ThemeAggregate[],
  totalReviewsSampled: number
): MarketMetrics {
  const listingsInRadius = listings.length;
  const areaKm2 = Math.PI * radiusKm * radiusKm;
  const supplyDensityKm2 =
    listingsInRadius > 0 ? Math.round((listingsInRadius / areaKm2) * 100) / 100 : 0;

  let supplyVisibility: 'high' | 'moderate' | 'sparse' = 'sparse';
  if (listingsInRadius >= 18) supplyVisibility = 'high';
  else if (listingsInRadius >= 7) supplyVisibility = 'moderate';

  // Calculate weighted friction index based on negative complaints frequency
  const totalNegativeMentions = themeAggregates.reduce(
    (sum, t) => sum + t.negativeCount,
    0
  );

  const reviewFrictionIndex =
    totalReviewsSampled > 0
      ? Math.min(
          100,
          Math.round((totalNegativeMentions / (totalReviewsSampled * 1.5)) * 100)
        )
      : 0;

  // Average rating
  const ratings = listings.map((l) => l.rating).filter((r) => r > 0);
  const averageRating =
    ratings.length > 0
      ? Math.round(
          (ratings.reduce((acc, r) => acc + r, 0) / ratings.length) * 10
        ) / 10
      : 0;

  // Median review count
  const sortedReviewCounts = listings
    .map((l) => l.reviewCount)
    .sort((a, b) => a - b);
  const mid = Math.floor(sortedReviewCounts.length / 2);
  const medianReviewCount =
    sortedReviewCounts.length === 0
      ? 0
      : sortedReviewCounts.length % 2 !== 0
      ? sortedReviewCounts[mid]
      : Math.round(
          (sortedReviewCounts[mid - 1] + sortedReviewCounts[mid]) / 2
        );

  // Evidence confidence rating
  let evidenceConfidence: 'high' | 'moderate' | 'cautious' | 'insufficient' =
    'cautious';
  let confidenceReason = '';

  if (listingsInRadius < 3 || totalReviewsSampled < 5) {
    evidenceConfidence = 'insufficient';
    confidenceReason =
      'Fewer than 3 verified listings or 5 sampled reviews retrieved in this radius. Conclusions are tentative.';
  } else if (listingsInRadius >= 12 && totalReviewsSampled >= 25) {
    evidenceConfidence = 'high';
    confidenceReason = `Robust evidence base: ${listingsInRadius} verified listings and ${totalReviewsSampled} sampled resident reviews examined.`;
  } else if (listingsInRadius >= 6 && totalReviewsSampled >= 12) {
    evidenceConfidence = 'moderate';
    confidenceReason = `Moderate evidence: ${listingsInRadius} listings and ${totalReviewsSampled} reviews within ${radiusKm} km radius.`;
  } else {
    evidenceConfidence = 'cautious';
    confidenceReason = `Limited sample size (${listingsInRadius} listings, ${totalReviewsSampled} reviews). Treat findings as directional indicators.`;
  }

  return {
    totalListingsFound: listings.length,
    listingsInRadius,
    totalReviewsAnalyzed: totalReviewsSampled,
    averageRating,
    medianReviewCount,
    supplyDensityKm2,
    supplyVisibility,
    reviewFrictionIndex,
    evidenceConfidence,
    confidenceReason,
  };
}

/**
 * Derives a cautious, evidence-grounded market gap hypothesis
 */
export function generateOpportunityHypothesis(
  hub: EmploymentHub,
  metrics: MarketMetrics,
  themeAggregates: ThemeAggregate[],
  listings: PlaceListing[]
): MarketGapHypothesis {
  if (metrics.evidenceConfidence === 'insufficient') {
    return {
      headline: `Insufficient Search Evidence Near ${hub.name}`,
      opportunityType: 'quality_upgrade',
      summary: `Current public listings within the search perimeter do not provide enough reviews to formulate an evidence-backed market conclusion. Expanding radius or verifying unlisted hostels is advised.`,
      actionableInsights: [
        'Conduct physical field survey across secondary arterial access roads.',
        'Investigate whether accommodation providers rely on offline word-of-mouth rather than Google Maps listings.',
      ],
      recommendedFocusAreas: ['Initial field reconnaissance'],
      targetPockets: [],
    };
  }

  // Top complaint categories
  const topComplaints = themeAggregates
    .filter((t) => t.negativeCount > 0)
    .slice(0, 3);

  const primaryComplaint = topComplaints[0];
  const secondaryComplaint = topComplaints[1];

  // Distances breakdown
  const closeListings = listings.filter((l) => l.distanceKm <= 1.5);
  const midListings = listings.filter(
    (l) => l.distanceKm > 1.5 && l.distanceKm <= 3.0
  );
  const outerListings = listings.filter((l) => l.distanceKm > 3.0);

  // Formulate specific thesis based on data
  let headline = '';
  let opportunityType: MarketGapHypothesis['opportunityType'] = 'quality_upgrade';
  const insights: string[] = [];
  const focusAreas: string[] = [];

  if (
    primaryComplaint &&
    (primaryComplaint.category === 'hygiene' || primaryComplaint.category === 'maintenance')
  ) {
    opportunityType = 'quality_upgrade';
    headline = `Quality & Hygiene Deficit: Prime Opening for Professionalized Women's Living near ${hub.name}`;
    insights.push(
      `Recurring resident friction centers heavily on ${primaryComplaint.label.toLowerCase()} (${primaryComplaint.negativeCount} mentions, ${primaryComplaint.frequencyPercentage}% friction frequency).`
    );
    if (secondaryComplaint) {
      insights.push(
        `Secondary dissatisfaction stems from ${secondaryComplaint.label.toLowerCase()} (${secondaryComplaint.negativeCount} complaints).`
      );
    }
    focusAreas.push('Scheduled, professionalized housekeeping and hygiene SLAs');
    focusAreas.push('Transparent, tech-enabled maintenance ticketing for plumbing and electrical faults');
  } else if (
    primaryComplaint &&
    primaryComplaint.category === 'management'
  ) {
    opportunityType = 'management_deficit';
    headline = `Management & Trust Deficit: Opportunity for Transparent, Contract-Governed Stays near ${hub.name}`;
    insights.push(
      `Tenant accounts highlight frequent management friction regarding deposit refunds, abrupt notices, or unaddressed grievances (${primaryComplaint.negativeCount} complaints).`
    );
    focusAreas.push('Escrow/guaranteed deposit refund timelines documented in signed digital agreements');
    focusAreas.push('Dedicated women community managers rather than absentee property owners');
  } else if (closeListings.length < 3 && outerListings.length > 5) {
    opportunityType = 'accessibility_pocket';
    headline = `Last-Mile Proximity Void: Significant Supply Cluster Pushed Beyond Comfortable Walk to ${hub.name}`;
    insights.push(
      `Only ${closeListings.length} accommodation(s) exist within 1.5 km straight-line radius of the main gates, while ${outerListings.length} cluster farther out.`
    );
    focusAreas.push('Securing long-lease residential properties within direct walking corridors');
    focusAreas.push('Dedicated shuttle van loops aligned with night and evening shift rotations');
  } else {
    opportunityType = 'underserved_premium';
    headline = `Modern Workforce Value Gap: Demand for Full-Amenity Accommodations near ${hub.name}`;
    insights.push(
      `While supply visibility is ${metrics.supplyVisibility} (${listings.length} discovered places), average rating sits at ${metrics.averageRating}/5 with noticeable friction across basic amenities and food quality.`
    );
    focusAreas.push('High-speed dual-ISP internet with full power backup for hybrid workers');
    focusAreas.push('Nutritious, multi-regional meal planning and flexible dining windows');
  }

  // Define target pockets based on actual listings distribution
  const targetPockets = [
    {
      name: `Immediate Hub Perimeter (< 1.5 km)`,
      distanceBand: '0.0 - 1.5 km (straight-line)',
      observation:
        closeListings.length === 0
          ? 'Near-total absence of mapped women accommodations; prime candidate for premium micro-living.'
          : `${closeListings.length} properties detected. Key complaints reflect high density and aging plumbing.`,
    },
    {
      name: `Transit Corridor Belt (1.5 - 3.0 km)`,
      distanceBand: '1.5 - 3.0 km (straight-line)',
      observation: `${midListings.length} properties discovered. Balanced distance, but tenant reviews emphasize evening transit and auto-rickshaw availability issues.`,
    },
  ];

  if (outerListings.length > 0) {
    targetPockets.push({
      name: `Secondary Feeder Enclave (> 3.0 km)`,
      distanceBand: '3.0+ km (straight-line)',
      observation: `${outerListings.length} properties located here. Offers lower real-estate lease costs, but requires scheduled private transit shuttles to compete effectively.`,
    });
  }

  const summary = `Based on an examination of ${metrics.listingsInRadius} discovered accommodations and ${metrics.totalReviewsAnalyzed} sampled resident reviews around ${hub.name}, current supply exhibits a measurable quality gap in ${primaryComplaint ? primaryComplaint.label.toLowerCase() : 'facilities and consistency'}. Operators who deliver dependable hygiene, transparent deposit policies, and reliable connectivity can capture dissatisfied demand currently paying equivalent rates for substandard infrastructure.`;

  return {
    headline,
    opportunityType,
    summary,
    actionableInsights: insights,
    recommendedFocusAreas: focusAreas,
    targetPockets,
  };
}

/**
 * Builds the full comprehensive analysis report
 */
export function buildAnalysisReport(
  hub: EmploymentHub,
  radiusKm: number,
  rawListings: PlaceListing[],
  dataSource: 'live_serpapi' | 'cached_serpapi' | 'illustrative_sample',
  apiLatencyMs?: number,
  retrievedAt?: string
): AnalysisReport {
  // Flatten all review items from listings
  const allReviews: Array<{
    text: string;
    author: string;
    rating: number;
    date?: string;
    placeTitle: string;
    placeId: string;
  }> = [];

  rawListings.forEach((listing) => {
    if (listing.reviewsSample && listing.reviewsSample.length > 0) {
      listing.reviewsSample.forEach((rev) => {
        allReviews.push({
          text: rev.text,
          author: rev.author,
          rating: rev.rating,
          date: rev.date,
          placeTitle: listing.title,
          placeId: listing.id,
        });
      });
    }
  });

  const { themeAggregates, placeThemes } = extractReviewThemes(allReviews);

  // Annotate listings with extracted theme complaints
  const enrichedListings: PlaceListing[] = rawListings.map((listing) => {
    const dominantComplaints = placeThemes.get(listing.id) || [];
    const frictionScore = Math.min(
      100,
      dominantComplaints.length * 20 + Math.max(0, (4.5 - listing.rating) * 20)
    );

    return {
      ...listing,
      dominantComplaints,
      themeFrictionScore: Math.round(frictionScore),
    };
  });

  const metrics = computeMarketMetrics(
    enrichedListings,
    radiusKm,
    themeAggregates,
    allReviews.length
  );

  const opportunityHypothesis = generateOpportunityHypothesis(
    hub,
    metrics,
    themeAggregates,
    enrichedListings
  );

  const timestamp = retrievedAt || '2026-10-08T12:00:00.000Z';

  return {
    id: `report-${hub.id}-${radiusKm}km-${dataSource}`,
    hub,
    radiusKm,
    retrievedAt: timestamp,
    dataSource,
    apiLatencyMs,
    metrics,
    listings: enrichedListings,
    themeBreakdown: themeAggregates,
    opportunityHypothesis,
    limitations: METHODOLOGY_LIMITATIONS,
  };
}
