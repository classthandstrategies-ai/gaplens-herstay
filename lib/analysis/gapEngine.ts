import {
  AnalysisReport,
  EmploymentHub,
  MarketGapHypothesis,
  MarketMetrics,
  PlaceListing,
  ThemeAggregate,
  ThemeCategory,
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
  'Identified opportunities represent potential supply-quality market gaps indicated by friction in publicly available search data, not guaranteed commercial returns or demand forecasts.',
  'Rental rates and pricing indicators are noted only where publicly listed; rental affordability should be independently confirmed via primary market research.',
];

/**
 * Computes high-level market metrics with strict evidence grounding
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

  // Count how many distinct properties in this radius actually have review coverage
  const listingsWithReviewsCount = listings.filter(
    (l) => l.reviewsSample && l.reviewsSample.length > 0
  ).length;

  const propertyCoverageRatio =
    listingsInRadius > 0 ? listingsWithReviewsCount / listingsInRadius : 0;

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

  // Average rating calculated strictly from listings with verified public ratings
  const validRatings = listings
    .map((l) => l.rating)
    .filter((r): r is number => r !== null && typeof r === 'number' && r > 0);

  const ratedListingsCount = validRatings.length;
  const averageRating =
    ratedListingsCount > 0
      ? Math.round(
          (validRatings.reduce((acc, r) => acc + r, 0) / ratedListingsCount) * 10
        ) / 10
      : null;

  // Median review count among discovered listings
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

  // Evidence confidence rating accounting for review coverage breadth and property proportion
  let evidenceConfidence: 'high' | 'moderate' | 'cautious' | 'insufficient' =
    'cautious';
  let confidenceReason = '';

  if (listingsInRadius < 3 || listingsWithReviewsCount < 2 || totalReviewsSampled < 4) {
    evidenceConfidence = 'insufficient';
    confidenceReason = `Limited search evidence: only ${listingsWithReviewsCount} property/properties have review coverage in this radius (${totalReviewsSampled} reviews sampled across ${listingsInRadius} discovered listings). Findings should be treated as initial directional indicators requiring field validation.`;
  } else if (
    propertyCoverageRatio >= 0.55 &&
    listingsWithReviewsCount >= 8 &&
    totalReviewsSampled >= 30
  ) {
    evidenceConfidence = 'high';
    confidenceReason = `Substantial review coverage representing ${Math.round(
      propertyCoverageRatio * 100
    )}% of discovered properties (${listingsWithReviewsCount} of ${listingsInRadius}) with ${totalReviewsSampled} sampled resident reviews examined.`;
  } else if (listingsWithReviewsCount >= 3 && totalReviewsSampled >= 8) {
    evidenceConfidence = 'moderate';
    confidenceReason = `Moderate sample coverage: reviews analyzed across ${listingsWithReviewsCount} of ${listingsInRadius} properties (${Math.round(
      propertyCoverageRatio * 100
    )}% of discovered supply, ${totalReviewsSampled} reviews sampled). Observations highlight directional patterns across sampled facilities rather than a comprehensive market census.`;
  } else {
    evidenceConfidence = 'cautious';
    confidenceReason = `Selective review coverage: review evidence is available for ${listingsWithReviewsCount} of ${listingsInRadius} discovered properties (${Math.round(
      propertyCoverageRatio * 100
    )}% coverage, ${totalReviewsSampled} reviews sampled). Observations represent this sample rather than a comprehensive market census.`;
  }

  return {
    totalListingsFound: listings.length,
    listingsInRadius,
    listingsWithReviewsCount,
    ratedListingsCount,
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
 * Helper to extract unique dominant complaint tags from a list of properties
 */
function getDominantComplaintsFromListings(listings: PlaceListing[]): ThemeCategory[] {
  const categories = new Set<ThemeCategory>();
  listings.forEach((l) => {
    if (l.dominantComplaints) {
      l.dominantComplaints.forEach((c) => categories.add(c));
    }
  });
  return Array.from(categories);
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
      summary: `Current public listings within the search perimeter do not provide enough reviews (${metrics.totalReviewsAnalyzed} review(s) across ${metrics.listingsWithReviewsCount} property/properties) to formulate an evidence-backed market conclusion. Expanding radius or verifying unlisted hostels is advised.`,
      actionableInsights: [
        'Conduct physical field survey across secondary arterial access roads to verify unlisted accommodations.',
        'Investigate whether accommodation providers rely on offline word-of-mouth rather than Google Maps listings.',
      ],
      recommendedFocusAreas: ['Initial field reconnaissance and offline operator surveys'],
      targetPockets: [],
    };
  }

  // Distances breakdown
  const closeListings = listings.filter((l) => l.distanceKm <= 1.5);
  const midListings = listings.filter(
    (l) => l.distanceKm > 1.5 && l.distanceKm <= 3.0
  );
  const outerListings = listings.filter((l) => l.distanceKm > 3.0);

  // Construct target pockets based on real property distribution and observed complaints
  const closeComplaints = getDominantComplaintsFromListings(closeListings);
  const midComplaints = getDominantComplaintsFromListings(midListings);
  const outerComplaints = getDominantComplaintsFromListings(outerListings);

  const targetPockets = [
    {
      name: `Immediate Hub Perimeter (< 1.5 km)`,
      distanceBand: '0.0 - 1.5 km (straight-line)',
      observation:
        closeListings.length === 0
          ? 'No discoverable women accommodations mapped within 1.5 km straight-line; potential corridor for closer walk-to-work options subject to local zoning.'
          : `${closeListings.length} properties detected within 1.5 km. ${
              closeComplaints.length > 0
                ? `Associated review friction includes: ${closeComplaints.join(', ')}.`
                : 'Limited negative friction clusters detected in sampled reviews for this belt.'
            }`,
    },
    {
      name: `Transit Corridor Belt (1.5 - 3.0 km)`,
      distanceBand: '1.5 - 3.0 km (straight-line)',
      observation: `${midListings.length} properties discovered in this middle perimeter. ${
        midComplaints.length > 0
          ? `Sampled resident reviews note friction in: ${midComplaints.join(', ')}.`
          : 'Represents balanced distance; public reviews show standard residential feedback.'
      }`,
    },
  ];

  if (outerListings.length > 0) {
    targetPockets.push({
      name: `Outer Feeder Belt (> 3.0 km)`,
      distanceBand: '3.0+ km (straight-line)',
      observation: `${outerListings.length} properties located beyond 3.0 km. ${
        outerComplaints.length > 0
          ? `Sampled reviews reflect: ${outerComplaints.join(', ')}.`
          : 'Located farther from the primary gate; tenant access depends heavily on local road connectivity and transit.'
      }`,
    });
  }

  // Top complaint categories that have actual negative mentions
  const topComplaints = themeAggregates
    .filter((t) => t.negativeCount > 0)
    .slice(0, 3);

  const primaryComplaint = topComplaints[0];
  const secondaryComplaint = topComplaints[1];

  // Critical guardrail: If zero negative complaint themes are detected, DO NOT manufacture
  // a quality, hygiene, or management deficit headline!
  if (topComplaints.length === 0) {
    let zeroThemeHeadline = '';
    let zeroThemeType: MarketGapHypothesis['opportunityType'] = 'underserved_premium';
    const zeroThemeInsights: string[] = [];
    const zeroThemeFocusAreas: string[] = [];

    if (closeListings.length < 2 && outerListings.length >= 4) {
      zeroThemeType = 'accessibility_pocket';
      zeroThemeHeadline = `Spatial Distribution Imbalance: Accommodation Supply Concentrated in Outer Belts near ${hub.name}`;
      zeroThemeInsights.push(
        `While sampled reviews reflect neutral or positive feedback without recurring complaint themes, geographic supply is skewed: only ${closeListings.length} place(s) mapped within 1.5 km versus ${outerListings.length} place(s) beyond 3.0 km.`
      );
      zeroThemeInsights.push(
        'Zero negative complaint clusters were detected across analyzed reviews in this market.'
      );
      zeroThemeFocusAreas.push('Evaluating physical property availability closer to primary office gates');
      zeroThemeFocusAreas.push('Assessing tenant transit options connecting outer clusters to hub facilities');
    } else {
      zeroThemeType = 'underserved_premium';
      zeroThemeHeadline = `Inconclusive Deficit Evidence: No Recurring Negative Themes Detected near ${hub.name}`;
      zeroThemeInsights.push(
        `Analysis of ${metrics.totalReviewsAnalyzed} review(s) across ${metrics.listingsWithReviewsCount} property/properties yielded zero recurring complaint clusters in hygiene, management, or maintenance.`
      );
      zeroThemeInsights.push(
        'Public search feedback reflects predominantly positive or neutral resident commentary.'
      );
      zeroThemeInsights.push(
        'A quality, hygiene, or management deficit cannot be supported without further on-the-ground tenant surveys.'
      );
      zeroThemeFocusAreas.push('Conducting direct tenant interviews to probe unlisted friction points');
      zeroThemeFocusAreas.push('Verifying physical occupancy rates and pricing models independently');
    }

    const zeroThemeSummary = `Based on an examination of ${metrics.listingsInRadius} discovered accommodations and ${metrics.totalReviewsAnalyzed} sampled resident reviews around ${hub.name}, public search data reveals no significant recurring negative feedback or complaint themes. Evidence is currently inconclusive regarding a service or hygiene deficit; further primary research is recommended before pursuing quality-upgrade positioning.`;

    return {
      headline: zeroThemeHeadline,
      opportunityType: zeroThemeType,
      summary: zeroThemeSummary,
      actionableInsights: zeroThemeInsights,
      recommendedFocusAreas: zeroThemeFocusAreas,
      targetPockets,
    };
  }

  // Formulate specific thesis strictly grounded in observed negative complaint data
  let headline = '';
  let opportunityType: MarketGapHypothesis['opportunityType'] = 'quality_upgrade';
  const insights: string[] = [];
  const focusAreas: string[] = [];

  if (
    primaryComplaint &&
    (primaryComplaint.category === 'hygiene' || primaryComplaint.category === 'maintenance')
  ) {
    opportunityType = 'quality_upgrade';
    headline = `Quality & Hygiene Deficit: Potential Opening for Professionalized Living near ${hub.name}`;
    insights.push(
      `Recurring resident feedback indicates friction in ${primaryComplaint.label.toLowerCase()} (${primaryComplaint.negativeCount} negative mention(s) across sampled reviews).`
    );
    if (secondaryComplaint) {
      insights.push(
        `Secondary friction noted in ${secondaryComplaint.label.toLowerCase()} (${secondaryComplaint.negativeCount} mention(s)).`
      );
    }
    focusAreas.push('Scheduled housekeeping protocols with documented cleanliness standards');
    focusAreas.push('Clear maintenance ticketing and response tracking for plumbing and electrical fixtures');
  } else if (
    primaryComplaint &&
    primaryComplaint.category === 'management'
  ) {
    opportunityType = 'management_deficit';
    headline = `Management Transparency Opening: Demand for Structured Tenant Agreements near ${hub.name}`;
    insights.push(
      `Sampled reviews highlight tenant dissatisfaction regarding deposit return timelines, abrupt notices, or communication responsiveness (${primaryComplaint.negativeCount} mention(s)).`
    );
    focusAreas.push('Written digital agreements with clear deposit refund terms and explicit timelines');
    focusAreas.push('Designated resident community managers with transparent dispute resolution');
  } else if (closeListings.length < 3 && outerListings.length > 5) {
    opportunityType = 'accessibility_pocket';
    headline = `Last-Mile Proximity Void: Accommodation Cluster Concentrated Beyond Immediate Walk to ${hub.name}`;
    insights.push(
      `Only ${closeListings.length} accommodation(s) discovered within 1.5 km straight-line radius of the main gates, while ${outerListings.length} cluster farther out.`
    );
    focusAreas.push('Investigating property leasing feasibility within direct walking corridors to main entry gates');
    focusAreas.push('Evaluating scheduled shuttle transit for accommodations located in outer belts');
  } else {
    opportunityType = 'underserved_premium';
    headline = `Accommodation Quality Gap: Potential for Modern Women's Living near ${hub.name}`;
    const avgRatingText = metrics.averageRating !== null ? `average rating of ${metrics.averageRating}/5` : 'unrated / mixed ratings';
    insights.push(
      `Discovered supply visibility is ${metrics.supplyVisibility} (${listings.length} places), with an ${avgRatingText} across rated properties.`
    );
    if (primaryComplaint) {
      insights.push(
        `Review friction is most visible in ${primaryComplaint.label.toLowerCase()} (${primaryComplaint.negativeCount} mention(s)).`
      );
    }
    focusAreas.push('High-reliability broadband connectivity with secondary power backup');
    focusAreas.push('Multi-regional meal planning and flexible dining access windows');
  }

  const primaryComplaintLabel = primaryComplaint ? primaryComplaint.label.toLowerCase() : 'service consistency';
  const summary = `Based on an examination of ${metrics.listingsInRadius} discovered accommodations and ${metrics.totalReviewsAnalyzed} sampled resident reviews around ${hub.name}, public search data indicates a potential quality-improvement opportunity in ${primaryComplaintLabel}. Operators who prioritize dependable cleanliness standards, transparent agreements, and reliable amenities can address documented resident friction observed across current offerings in this market.`;

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
  retrievedAt?: string,
  searchCoverage: 'complete' | 'partial' = 'complete',
  partialCoverageNote?: string
): AnalysisReport {
  // Flatten all review items from listings, preserving null review ratings
  const allReviews: Array<{
    text: string;
    author: string;
    rating: number | null;
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
          rating: typeof rev.rating === 'number' ? rev.rating : null,
          date: rev.date,
          placeTitle: listing.title,
          placeId: listing.id,
        });
      });
    }
  });

  const { themeAggregates, placeThemes } = extractReviewThemes(allReviews);

  // Annotate listings with extracted theme complaints and safely handle nullable ratings
  const enrichedListings: PlaceListing[] = rawListings.map((listing) => {
    const dominantComplaints = placeThemes.get(listing.id) || [];
    // Missing ratings incur NO artificial penalty; missing information does not imply negative feedback
    const ratingPenalty =
      listing.rating !== null ? Math.max(0, (4.5 - listing.rating) * 20) : 0;
    const frictionScore = Math.min(100, dominantComplaints.length * 20 + ratingPenalty);

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
  const limitations = [...METHODOLOGY_LIMITATIONS];
  if (searchCoverage === 'partial' && partialCoverageNote) {
    limitations.unshift(partialCoverageNote);
  }

  return {
    id: `report-${hub.id}-${radiusKm}km-${dataSource}`,
    hub,
    radiusKm,
    retrievedAt: timestamp,
    dataSource,
    apiLatencyMs,
    searchCoverage,
    partialCoverageNote,
    metrics,
    listings: enrichedListings,
    themeBreakdown: themeAggregates,
    opportunityHypothesis,
    limitations,
  };
}
