import { PlaceListing, ReviewItem, EmploymentHub } from '../types';
import { calculateHaversineDistanceKm, isWithinRadius } from '../geo/distance';

const SERPAPI_BASE_URL = 'https://serpapi.com/search.json';

// In-memory cache with 24-hour TTL to preserve API credits
interface CacheEntry<T> {
  data: T;
  cachedAt: number;
}

const CACHE_TTL_MS = 24 * 60 * 60 * 1000;
const memoryCache = new Map<string, CacheEntry<unknown>>();

export function getCached<T>(key: string): T | null {
  const entry = memoryCache.get(key) as CacheEntry<T> | undefined;
  if (!entry) return null;
  if (Date.now() - entry.cachedAt > CACHE_TTL_MS) {
    memoryCache.delete(key);
    return null;
  }
  return entry.data;
}

export function setCached<T>(key: string, data: T): void {
  memoryCache.set(key, { data, cachedAt: Date.now() });
}

/**
 * Checks if a valid SERPAPI_API_KEY is configured
 */
export function isSerpApiKeyConfigured(): boolean {
  const key = process.env.SERPAPI_API_KEY;
  return Boolean(key && key.trim().length > 5 && !key.includes('your_serpapi_api_key'));
}

/**
 * Normalizes and deduplicates listings returned by multiple search queries
 */
export function deduplicateListings(listings: PlaceListing[]): PlaceListing[] {
  const seenIds = new Set<string>();
  const seenTitles = new Map<string, PlaceListing>();
  const deduplicated: PlaceListing[] = [];

  for (const listing of listings) {
    const primaryId = listing.placeId || listing.dataId || listing.id;
    if (seenIds.has(primaryId)) {
      continue;
    }

    // Check title similarity + proximity fallback
    const normTitle = listing.title.toLowerCase().replace(/[^a-z0-9]/g, '');
    const existing = seenTitles.get(normTitle);
    if (existing) {
      const distBetween = calculateHaversineDistanceKm(
        existing.coordinates,
        listing.coordinates
      );
      if (distBetween < 0.15) {
        // Less than 150m apart with identical stripped name -> duplicate
        continue;
      }
    }

    seenIds.add(primaryId);
    seenTitles.set(normTitle, listing);
    deduplicated.push(listing);
  }

  return deduplicated;
}

/**
 * Fetches Google Maps listings for a specific query around the hub
 */
export async function searchGoogleMaps(
  query: string,
  hub: EmploymentHub,
  apiKey: string
): Promise<PlaceListing[]> {
  const cacheKey = `maps:${query}:${hub.coordinates.lat.toFixed(4)},${hub.coordinates.lng.toFixed(4)}`;
  const cached = getCached<PlaceListing[]>(cacheKey);
  if (cached) {
    return cached;
  }

  const url = new URL(SERPAPI_BASE_URL);
  url.searchParams.set('engine', 'google_maps');
  url.searchParams.set('q', query);
  url.searchParams.set('type', 'search');
  // Center search roughly on the employment hub coordinate with zoom level 14
  url.searchParams.set('ll', `@${hub.coordinates.lat},${hub.coordinates.lng},14z`);
  url.searchParams.set('api_key', apiKey);

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 18000);

  try {
    const res = await fetch(url.toString(), {
      signal: controller.signal,
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!res.ok) {
      const errText = await res.text().catch(() => '');
      throw new Error(`SerpApi Google Maps request failed [${res.status}]: ${errText.slice(0, 200)}`);
    }

    const data = await res.json();
    const results = (data.local_results || []) as Array<Record<string, unknown>>;

    const listings: PlaceListing[] = [];

    for (let i = 0; i < results.length; i++) {
      const item = results[i];
      const title = (item.title as string) || 'Unnamed Accommodation';
      const gps = item.gps_coordinates as { latitude?: number; longitude?: number } | undefined;

      // Ensure valid coordinates
      if (!gps || typeof gps.latitude !== 'number' || typeof gps.longitude !== 'number') {
        continue;
      }

      const coords = { lat: gps.latitude, lng: gps.longitude };
      const distanceKm = calculateHaversineDistanceKm(hub.coordinates, coords);

      const placeId = (item.place_id as string) || undefined;
      const dataId = (item.data_id as string) || undefined;
      const id = placeId || dataId || `serp-${i}-${coords.lat}-${coords.lng}`;

      // Extract inline user reviews if SerpApi bundled them
      const reviewsSample: ReviewItem[] = [];
      const userReviews = (item.user_reviews || item.reviews || []) as Array<Record<string, unknown>>;
      if (Array.isArray(userReviews)) {
        userReviews.slice(0, 4).forEach((rev, revIdx) => {
          const text = (rev.description || rev.snippet || rev.text || '') as string;
          if (text.trim().length > 10) {
            reviewsSample.push({
              id: `${id}-rev-${revIdx}`,
              author: (rev.username || rev.author || 'Google Reviewer') as string,
              rating: typeof rev.rating === 'number' ? rev.rating : 3,
              text,
              date: (rev.date || 'Recent') as string,
              link: (rev.link || item.link || '') as string,
            });
          }
        });
      }

      listings.push({
        id,
        placeId,
        dataId,
        title,
        address: (item.address as string) || `${hub.cityName}, India`,
        rating: typeof item.rating === 'number' ? item.rating : 3.5,
        reviewCount: typeof item.reviews === 'number' ? item.reviews : 0,
        coordinates: coords,
        distanceKm,
        link: (item.link as string) || undefined,
        thumbnail: (item.thumbnail as string) || undefined,
        phone: (item.phone as string) || undefined,
        price: (item.price as string) || undefined,
        category: (item.type as string) || "Women's PG / Hostel",
        reviewsSample,
      });
    }

    setCached(cacheKey, listings);
    return listings;
  } finally {
    clearTimeout(timeout);
  }
}

/**
 * Fetches sample reviews for a specific place using SerpApi Google Maps Reviews API
 */
export async function fetchPlaceReviews(
  dataIdOrPlaceId: string,
  apiKey: string
): Promise<ReviewItem[]> {
  const cacheKey = `reviews:${dataIdOrPlaceId}`;
  const cached = getCached<ReviewItem[]>(cacheKey);
  if (cached) {
    return cached;
  }

  const url = new URL(SERPAPI_BASE_URL);
  url.searchParams.set('engine', 'google_maps_reviews');
  url.searchParams.set('data_id', dataIdOrPlaceId);
  url.searchParams.set('api_key', apiKey);
  url.searchParams.set('sort_by', 'newestFirst');

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);

  try {
    const res = await fetch(url.toString(), {
      signal: controller.signal,
      headers: { 'Accept': 'application/json' },
    });

    if (!res.ok) {
      return [];
    }

    const data = await res.json();
    const rawReviews = (data.reviews || []) as Array<Record<string, unknown>>;
    const reviews: ReviewItem[] = [];

    for (let i = 0; i < Math.min(rawReviews.length, 6); i++) {
      const item = rawReviews[i];
      const user = item.user as { name?: string } | undefined;
      const extractedSnippetObj = item.extracted_snippet as { original?: string } | undefined;
      const snippet = (item.snippet || extractedSnippetObj?.original || item.text || '') as string;

      if (snippet && snippet.trim().length > 10) {
        reviews.push({
          id: `rev-${dataIdOrPlaceId}-${i}`,
          author: user?.name || 'Resident Reviewer',
          rating: typeof item.rating === 'number' ? item.rating : 3,
          text: snippet,
          date: (item.date as string) || 'Recent',
          link: (item.link as string) || undefined,
        });
      }
    }

    setCached(cacheKey, reviews);
    return reviews;
  } catch {
    return [];
  } finally {
    clearTimeout(timeout);
  }
}

/**
 * Orchestrates a complete market investigation using SerpApi
 */
export async function executeMarketSearch(
  hub: EmploymentHub,
  radiusKm: number,
  apiKey: string
): Promise<{ listings: PlaceListing[]; isCached: boolean }> {
  const allListings: PlaceListing[] = [];
  let wasCached = true;

  // Run up to 2 targeted queries to stay within reasonable credit bounds
  const queriesToRun = hub.primaryQueries.slice(0, 2);

  for (const q of queriesToRun) {
    const cacheKey = `maps:${q}:${hub.coordinates.lat.toFixed(4)},${hub.coordinates.lng.toFixed(4)}`;
    if (!getCached(cacheKey)) {
      wasCached = false;
    }
    try {
      const res = await searchGoogleMaps(q, hub, apiKey);
      allListings.push(...res);
    } catch (err) {
      console.warn(`Query failed for "${q}":`, err);
    }
  }

  // Deduplicate and filter by actual radius
  const deduped = deduplicateListings(allListings);
  const inRadius = deduped
    .filter((l) => isWithinRadius(hub.coordinates, l.coordinates, radiusKm))
    .sort((a, b) => a.distanceKm - b.distanceKm);

  // For places missing reviews, fetch reviews for the top 5 places to enrich themes
  const enrichedListings: PlaceListing[] = [];
  for (let i = 0; i < inRadius.length; i++) {
    const listing = inRadius[i];
    if (
      (!listing.reviewsSample || listing.reviewsSample.length === 0) &&
      listing.dataId &&
      i < 5
    ) {
      try {
        const fetched = await fetchPlaceReviews(listing.dataId, apiKey);
        enrichedListings.push({
          ...listing,
          reviewsSample: fetched,
        });
      } catch {
        enrichedListings.push(listing);
      }
    } else {
      enrichedListings.push(listing);
    }
  }

  return {
    listings: enrichedListings,
    isCached: wasCached,
  };
}
