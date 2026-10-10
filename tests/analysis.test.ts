import { describe, it, expect } from 'vitest';
import { calculateHaversineDistanceKm, isWithinRadius } from '../lib/geo/distance';
import { extractReviewThemes } from '../lib/analysis/themeExtractor';
import { buildAnalysisReport } from '../lib/analysis/gapEngine';
import { EMPLOYMENT_HUBS } from '../lib/markets/data';
import { getSampleListingsForHub } from '../lib/sample/sampleData';

describe('Geo & Distance Engine', () => {
  it('accurately calculates distance between known points', () => {
    // Manyata Main Gate (13.0475, 77.6220) to Nagawara junction (~13.0435, 77.6272)
    const hub = { lat: 13.0475, lng: 77.622 };
    const near = { lat: 13.0435, lng: 77.6272 };
    const dist = calculateHaversineDistanceKm(hub, near);
    expect(dist).toBeGreaterThan(0.5);
    expect(dist).toBeLessThan(1.0);
  });

  it('correctly filters coordinates within radius', () => {
    const hub = { lat: 13.0475, lng: 77.622 };
    const inside = { lat: 13.0489, lng: 77.6205 }; // ~0.2km
    const outside = { lat: 12.9716, lng: 77.5946 }; // MG Road, ~10km away
    expect(isWithinRadius(hub, inside, 2.0)).toBe(true);
    expect(isWithinRadius(hub, outside, 2.0)).toBe(false);
  });
});

describe('Theme Extraction Engine', () => {
  it('extracts hygiene complaints correctly', () => {
    const reviews = [
      {
        text: 'The bathrooms are very dirty and cockroach infestation is bad.',
        author: 'Tester 1',
        rating: 1,
        placeTitle: 'Hostel A',
        placeId: 'p1',
      },
    ];
    const { themeAggregates, allSnippets } = extractReviewThemes(reviews);
    const hygiene = themeAggregates.find((t) => t.category === 'hygiene');
    expect(hygiene).toBeDefined();
    expect(hygiene?.negativeCount).toBe(1);
    expect(allSnippets[0].category).toBe('hygiene');
    expect(allSnippets[0].sentiment).toBe('negative');
  });

  it('marks safety mentions with unverified reviewer disclaimer', () => {
    const reviews = [
      {
        text: 'The approach road had no street lights and felt unsafe at night with no security guard.',
        author: 'Tester 2',
        rating: 2,
        placeTitle: 'Hostel B',
        placeId: 'p2',
      },
    ];
    const { themeAggregates, allSnippets } = extractReviewThemes(reviews);
    const safety = themeAggregates.find((t) => t.category === 'safety');
    expect(safety).toBeDefined();
    expect(safety?.negativeCount).toBe(1);
    const safetySnippet = allSnippets.find((s) => s.category === 'safety');
    expect(safetySnippet?.isUnverifiedSafetyMention).toBe(true);
  });

  it('identifies management and deposit issues', () => {
    const reviews = [
      {
        text: 'The owner refused to return my security deposit and was very rude.',
        author: 'Tenant X',
        rating: 1,
        placeTitle: 'Hostel C',
        placeId: 'p3',
      },
    ];
    const { themeAggregates } = extractReviewThemes(reviews);
    const mgmt = themeAggregates.find((t) => t.category === 'management');
    expect(mgmt?.negativeCount).toBe(1);
  });

  it('extracts natural language complaints across all 9 operational categories', () => {
    const testCases: Array<{ category: string; text: string }> = [
      { category: 'hygiene', text: 'The bathroom is dirty and full of cockroaches.' },
      { category: 'management', text: 'Caretaker was very rude and refused to refund security deposit.' },
      { category: 'food', text: 'There are major issues with the food and quality provided is extremely poor.' },
      { category: 'amenities', text: 'The wifi is slow and geyser is not working in winter.' },
      { category: 'maintenance', text: 'Broken tap in washroom and pipe leakage was never repaired.' },
      { category: 'privacy', text: 'Strict timings and gate is locked at 9pm with zero privacy.' },
      { category: 'transport', text: 'The road outside is dark and too far from tech park.' },
      { category: 'pricing', text: 'Rent is too high and costly with unexpected extra charges.' },
      { category: 'safety', text: 'Felt unsafe for women at night and no security guard on duty.' },
    ];

    for (const { category, text } of testCases) {
      const { themeAggregates } = extractReviewThemes([
        {
          text,
          author: 'Auditor',
          rating: 1,
          placeTitle: 'Test Stay',
          placeId: 'ts1',
        },
      ]);
      const theme = themeAggregates.find((t) => t.category === category);
      expect(theme).toBeDefined();
      expect(theme?.negativeCount).toBeGreaterThanOrEqual(1);
    }
  });

  it('respects negation and does NOT flag negated complaints as negative friction', () => {
    const negatedReviews = [
      {
        text: 'The room was very clean and not dirty at all. No cockroaches found in the kitchen.',
        author: 'Tenant 1',
        rating: 5,
        placeTitle: 'Safe Stay',
        placeId: 's1',
      },
      {
        text: 'Food was not bad at all. I had no complaints about the food.',
        author: 'Tenant 2',
        rating: 4,
        placeTitle: 'Foodie Stay',
        placeId: 's2',
      },
      {
        text: 'Wifi is fast and not slow. We had no problem with wifi.',
        author: 'Tenant 3',
        rating: 5,
        placeTitle: 'Tech Stay',
        placeId: 's3',
      },
      {
        text: 'Deposit was refunded smoothly and owner is not rude.',
        author: 'Tenant 4',
        rating: 5,
        placeTitle: 'Friendly Stay',
        placeId: 's4',
      },
      {
        text: 'Rent is not expensive or overpriced; worth every penny.',
        author: 'Tenant 5',
        rating: 5,
        placeTitle: 'Value Stay',
        placeId: 's5',
      },
      {
        text: 'The lane is well lit and never felt unsafe; 24/7 security present.',
        author: 'Tenant 6',
        rating: 5,
        placeTitle: 'Secure Stay',
        placeId: 's6',
      },
    ];

    const { themeAggregates } = extractReviewThemes(negatedReviews);
    for (const theme of themeAggregates) {
      expect(theme.negativeCount).toBe(0);
      expect(theme.representativeSnippets.filter((s) => s.sentiment === 'negative')).toHaveLength(0);
    }
  });

  it('correctly attributes positive reviews without false complaint matches', () => {
    const positiveReview = [
      {
        text: 'Spotless clean rooms, helpful owner, delicious food, fast wifi, well maintained property, peaceful space, walkable to gate, reasonable rent, and felt very safe.',
        author: 'Happy Tenant',
        rating: 5,
        placeTitle: 'Best PG',
        placeId: 'p_best',
      },
    ];
    const { themeAggregates } = extractReviewThemes(positiveReview);
    const totalNegative = themeAggregates.reduce((sum, t) => sum + t.negativeCount, 0);
    expect(totalNegative).toBe(0);
    const positiveThemes = themeAggregates.filter((t) => t.positiveCount > 0);
    expect(positiveThemes.length).toBeGreaterThan(4);
  });

  it('ignores unmatched neutral text without manufacturing complaints', () => {
    const neutralReview = [
      {
        text: 'I stayed here for two nights while visiting Bengaluru on business trip.',
        author: 'Neutral Visitor',
        rating: 3,
        placeTitle: 'Mid Stay',
        placeId: 'p_mid',
      },
    ];
    const { themeAggregates, allSnippets } = extractReviewThemes(neutralReview);
    const totalNegative = themeAggregates.reduce((sum, t) => sum + t.negativeCount, 0);
    const totalPositive = themeAggregates.reduce((sum, t) => sum + t.positiveCount, 0);
    expect(totalNegative).toBe(0);
    expect(totalPositive).toBe(0);
    expect(allSnippets).toHaveLength(0);
  });

  it('handles empty reviews array gracefully with zero negative counts and zero percentages', () => {
    const { themeAggregates, allSnippets, placeThemes } = extractReviewThemes([]);
    expect(themeAggregates).toHaveLength(9);
    for (const theme of themeAggregates) {
      expect(theme.negativeCount).toBe(0);
      expect(theme.positiveCount).toBe(0);
      expect(theme.frequencyPercentage).toBe(0);
      expect(theme.representativeSnippets).toHaveLength(0);
    }
    expect(allSnippets).toHaveLength(0);
    expect(placeThemes.size).toBe(0);
  });

  it('does NOT convert negative star ratings without review text into complaint citations', () => {
    const starOnlyReviews = [
      {
        text: '',
        author: 'Silent Reviewer 1',
        rating: 1, // 1 star but no text
        placeTitle: 'Silent Stay',
        placeId: 'p_silent',
      },
      {
        text: '   ',
        author: 'Silent Reviewer 2',
        rating: 2, // 2 stars with whitespace
        placeTitle: 'Silent Stay',
        placeId: 'p_silent',
      },
    ];
    const { themeAggregates, allSnippets } = extractReviewThemes(starOnlyReviews);
    for (const theme of themeAggregates) {
      expect(theme.negativeCount).toBe(0);
      expect(theme.representativeSnippets).toHaveLength(0);
    }
    expect(allSnippets).toHaveLength(0);
  });
});

describe('Gap Engine Intelligence', () => {
  it('generates consistent report metrics for sample dataset', () => {
    const manyata = EMPLOYMENT_HUBS[0];
    const sampleListings = getSampleListingsForHub(manyata);
    const report = buildAnalysisReport(
      manyata,
      3.5,
      sampleListings,
      'illustrative_sample'
    );

    expect(report.hub.name).toBe('Manyata Tech Park');
    expect(report.dataSource).toBe('illustrative_sample');
    expect(report.listings.length).toBeGreaterThan(0);
    expect(report.themeBreakdown.length).toBeGreaterThan(0);
    expect(report.opportunityHypothesis.headline).toBeDefined();
    expect(report.opportunityHypothesis.summary).toContain('Manyata Tech Park');
    expect(report.limitations.length).toBeGreaterThan(0);
  });
});
