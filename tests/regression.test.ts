import { describe, it, expect } from 'vitest';
import {
  computeMarketMetrics,
  generateOpportunityHypothesis,
} from '../lib/analysis/gapEngine';
import { deduplicateListings } from '../lib/serpapi/client';
import { getHubById } from '../lib/markets/data';
import { PlaceListing } from '../lib/types';

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
});
