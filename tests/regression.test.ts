import { describe, it, expect } from 'vitest';
import {
  computeMarketMetrics,
  generateOpportunityHypothesis,
  buildAnalysisReport,
} from '../lib/analysis/gapEngine';
import { deduplicateListings } from '../lib/serpapi/client';
import { getHubById } from '../lib/markets/data';
import { PlaceListing, MarketMetrics } from '../lib/types';
import { checkRateLimit } from '../lib/rateLimit';

describe('Regression: Data Integrity & Evidence Guardrails', () => {
  const dummyHub = {
    id: 'manyata-tech-park-blr',
    name: 'Manyata Tech Park',
    cityKey: 'bengaluru' as const,
    cityName: 'Bengaluru',
    landmark: 'Nagawara',
    coordinates: { lat: 13.0475, lng: 77.622 },
    defaultRadiusKm: 3.5,
    maxRadiusKm: 8.0,
    primaryQueries: ['ladies PG near Manyata'],
    description: 'Tech park',
    notableEmployers: ['IBM'],
  };

  it('handles listings with missing ratings without substituting fake defaults', () => {
    const unratedListings: PlaceListing[] = [
      {
        id: 'p1',
        title: 'Unrated Stay 1',
        address: 'Nagawara',
        rating: null,
        reviewCount: 0,
        coordinates: { lat: 13.048, lng: 77.621 },
        distanceKm: 0.2,
      },
      {
        id: 'p2',
        title: 'Unrated Stay 2',
        address: 'Hebbal',
        rating: null,
        reviewCount: 0,
        coordinates: { lat: 13.05, lng: 77.623 },
        distanceKm: 0.5,
      },
    ];

    const metrics = computeMarketMetrics(unratedListings, 3.5, [], 0);
    expect(metrics.averageRating).toBeNull();
    expect(metrics.ratedListingsCount).toBe(0);
    expect(metrics.listingsInRadius).toBe(2);
  });

  it('calculates average rating only from properties with valid ratings', () => {
    const mixedListings: PlaceListing[] = [
      {
        id: 'p1',
        title: 'Rated Stay',
        address: 'Nagawara',
        rating: 4.0,
        reviewCount: 10,
        coordinates: { lat: 13.048, lng: 77.621 },
        distanceKm: 0.2,
      },
      {
        id: 'p2',
        title: 'Unrated Stay',
        address: 'Hebbal',
        rating: null,
        reviewCount: 0,
        coordinates: { lat: 13.05, lng: 77.623 },
        distanceKm: 0.5,
      },
    ];

    const metrics = computeMarketMetrics(mixedListings, 3.5, [], 0);
    expect(metrics.averageRating).toBe(4.0);
    expect(metrics.ratedListingsCount).toBe(1);
  });

  it('flags confidence as insufficient when review coverage is sparse across properties', () => {
    // 10 reviews but concentrated on only ONE property
    const singlePropertyReviews: PlaceListing[] = [
      {
        id: 'p1',
        title: 'Single Reviewed PG',
        address: 'Nagawara',
        rating: 4.2,
        reviewCount: 10,
        coordinates: { lat: 13.048, lng: 77.621 },
        distanceKm: 0.3,
        reviewsSample: [
          { id: 'r1', author: 'A', rating: 4, text: 'Decent stay' },
          { id: 'r2', author: 'B', rating: 3, text: 'Okay stay' },
          { id: 'r3', author: 'C', rating: 4, text: 'Good stay' },
          { id: 'r4', author: 'D', rating: 3, text: 'Fine stay' },
        ],
      },
      {
        id: 'p2',
        title: 'Unreviewed PG 2',
        address: 'Nagawara',
        rating: null,
        reviewCount: 0,
        coordinates: { lat: 13.049, lng: 77.622 },
        distanceKm: 0.4,
      },
    ];

    const metrics = computeMarketMetrics(singlePropertyReviews, 3.5, [], 4);
    expect(metrics.listingsWithReviewsCount).toBe(1);
    expect(metrics.evidenceConfidence).toBe('insufficient');
    expect(metrics.confidenceReason).toContain('only 1 property/properties have review coverage');
  });

  it('does not manufacture claims or hypotheses when there are zero complaints', () => {
    const metrics = computeMarketMetrics([], 3.5, [], 0);
    const hypothesis = generateOpportunityHypothesis(dummyHub, metrics, [], []);
    expect(hypothesis.headline).toContain('Insufficient Search Evidence');
    expect(hypothesis.summary).toContain('do not provide enough reviews');
    expect(hypothesis.targetPockets).toHaveLength(0);
  });

  it('correctly rejects invalid hub IDs without fallback', () => {
    const invalid = getHubById('non-existent-market');
    expect(invalid).toBeUndefined();

    const valid = getHubById('manyata-tech-park-blr');
    expect(valid).toBeDefined();
    expect(valid?.cityName).toBe('Bengaluru');
  });

  it('deduplicates listings with matching IDs and coordinate proximity', () => {
    const duplicates: PlaceListing[] = [
      {
        id: 'place_abc',
        placeId: 'ChIJ_123',
        title: 'Green Stay Ladies PG',
        address: 'Nagawara',
        rating: 4.1,
        reviewCount: 20,
        coordinates: { lat: 13.0475, lng: 77.622 },
        distanceKm: 0.1,
      },
      {
        id: 'place_abc_dup',
        placeId: 'ChIJ_123', // Same placeId
        title: 'Green Stay Ladies PG',
        address: 'Nagawara Main Rd',
        rating: 4.1,
        reviewCount: 20,
        coordinates: { lat: 13.0475, lng: 77.622 },
        distanceKm: 0.1,
      },
      {
        id: 'place_diff',
        placeId: 'ChIJ_999',
        title: 'Unique PG',
        address: 'Hebbal',
        rating: 3.8,
        reviewCount: 15,
        coordinates: { lat: 13.055, lng: 77.61 },
        distanceKm: 1.5,
      },
    ];

    const deduped = deduplicateListings(duplicates);
    expect(deduped).toHaveLength(2);
    expect(deduped.map((d) => d.id)).toContain('place_abc');
    expect(deduped.map((d) => d.id)).toContain('place_diff');
  });

  it('preserves unknown review rating as null throughout analysis without defaulting to 3', () => {
    const listingWithNullReviewRating: PlaceListing = {
      id: 'p_null_rev',
      title: 'Hostel with unrated review',
      address: 'Nagawara',
      rating: 4.0,
      reviewCount: 1,
      coordinates: { lat: 13.048, lng: 77.621 },
      distanceKm: 0.2,
      reviewsSample: [
        {
          id: 'r_unknown',
          author: 'Anonymous',
          rating: null, // explicitly null
          text: 'Clean and peaceful environment with good security.',
        },
      ],
    };

    const report = buildAnalysisReport(
      dummyHub,
      3.5,
      [listingWithNullReviewRating],
      'illustrative_sample'
    );

    // The review sample on the listing must preserve rating as null
    expect(report.listings[0].reviewsSample?.[0].rating).toBeNull();
  });

  it('assigns zero friction penalty to unrated properties (missing rating != negative feedback)', () => {
    const unratedPlace: PlaceListing = {
      id: 'p_unrated_clean',
      title: 'Brand New PG Without Online Rating',
      address: 'Nagawara Main Rd',
      rating: null,
      reviewCount: 0,
      coordinates: { lat: 13.048, lng: 77.621 },
      distanceKm: 0.2,
      reviewsSample: [],
    };

    const report = buildAnalysisReport(
      dummyHub,
      3.5,
      [unratedPlace],
      'illustrative_sample'
    );

    // Without complaints and with missing rating, friction score should be 0, NOT 10
    expect(report.listings[0].themeFrictionScore).toBe(0);
  });

  it('recalibrates confidence: 21 reviews across 8 of 24 properties is evaluated as moderate, not high', () => {
    // 24 discovered listings, but only 8 have review samples (33% coverage ratio)
    const twentyFourListings: PlaceListing[] = Array.from({ length: 24 }, (_, i) => ({
      id: `pg_${i}`,
      title: `PG Listing ${i}`,
      address: 'Nagawara',
      rating: 4.2,
      reviewCount: 20,
      coordinates: { lat: 13.048 + i * 0.001, lng: 77.621 },
      distanceKm: 0.2 + i * 0.05,
      reviewsSample:
        i < 8
          ? [
              {
                id: `rev_${i}_1`,
                author: `User ${i}`,
                rating: 4,
                text: 'Decent stay with clean rooms.',
              },
              {
                id: `rev_${i}_2`,
                author: `User ${i} B`,
                rating: 4,
                text: 'Helpful caretaker.',
              },
            ]
          : [],
    }));

    const metrics = computeMarketMetrics(twentyFourListings, 3.5, [], 21);

    expect(metrics.listingsInRadius).toBe(24);
    expect(metrics.listingsWithReviewsCount).toBe(8);
    expect(metrics.totalReviewsAnalyzed).toBe(21);
    // Crucial check: 33% coverage must NOT be classified as high confidence
    expect(metrics.evidenceConfidence).toBe('moderate');
    expect(metrics.confidenceReason).toContain('33% of discovered supply');
    expect(metrics.confidenceReason).toContain('directional patterns across sampled facilities rather than a comprehensive market census');
  });

  it('produces an inconclusive finding headline when zero negative review themes are detected', () => {
    // 8 properties with reviews, 21 reviews total, but zero negative complaint themes
    const validPositiveThemes = [
      {
        category: 'hygiene' as const,
        label: 'Cleanliness & Hygiene',
        description: 'Sanitation',
        negativeCount: 0,
        positiveCount: 15,
        frequencyPercentage: 0,
        severity: 'low' as const,
        representativeSnippets: [],
        impactSummary: 'Mentioned negatively in 0 reviewer account(s).',
      },
    ];

    const metrics: MarketMetrics = {
      totalListingsFound: 24,
      listingsInRadius: 24,
      listingsWithReviewsCount: 8,
      ratedListingsCount: 24,
      totalReviewsAnalyzed: 21,
      averageRating: 4.5,
      medianReviewCount: 50,
      supplyDensityKm2: 0.6,
      supplyVisibility: 'high',
      reviewFrictionIndex: 0,
      evidenceConfidence: 'moderate',
      confidenceReason: 'Moderate sample coverage',
    };

    const listings: PlaceListing[] = [
      {
        id: 'p1',
        title: 'PG 1',
        address: 'Nagawara',
        rating: 4.8,
        reviewCount: 30,
        coordinates: { lat: 13.048, lng: 77.621 },
        distanceKm: 0.8,
      },
      {
        id: 'p2',
        title: 'PG 2',
        address: 'Nagawara',
        rating: 4.7,
        reviewCount: 25,
        coordinates: { lat: 13.049, lng: 77.622 },
        distanceKm: 1.0,
      },
    ];

    const hypothesis = generateOpportunityHypothesis(dummyHub, metrics, validPositiveThemes, listings);

    // MUST NOT assert a quality, hygiene, or management deficit
    expect(hypothesis.headline).toContain('Inconclusive Deficit Evidence');
    expect(hypothesis.headline).not.toContain('Quality & Hygiene Deficit');
    expect(hypothesis.headline).not.toContain('Management Transparency Opening');
    expect(hypothesis.summary).toContain('Evidence is currently inconclusive regarding a service or hygiene deficit');
    expect(hypothesis.actionableInsights).toContain('A quality, hygiene, or management deficit cannot be supported without further on-the-ground tenant surveys.');
  });

  it('correctly tracks and flags partial search coverage when one query fails', () => {
    const report = buildAnalysisReport(
      dummyHub,
      3.5,
      [],
      'live_serpapi',
      250,
      '2026-10-08T12:00:00.000Z',
      'partial',
      'Partial search coverage: 1 of 2 targeted search queries succeeded.'
    );

    expect(report.searchCoverage).toBe('partial');
    expect(report.partialCoverageNote).toBe('Partial search coverage: 1 of 2 targeted search queries succeeded.');
    expect(report.limitations[0]).toContain('Partial search coverage');
  });

  it('enforces rate limiting after maximum allowed requests in a window', () => {
    const testIp = '198.51.100.42';
    // Send 15 requests
    for (let i = 0; i < 15; i++) {
      expect(checkRateLimit(testIp)).toBe(false);
    }
    // 16th request must be rate-limited
    expect(checkRateLimit(testIp)).toBe(true);
  });
});
