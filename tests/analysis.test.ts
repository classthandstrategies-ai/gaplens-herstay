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
