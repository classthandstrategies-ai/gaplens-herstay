import { Coordinates } from '../types';

/**
 * Earth radius in kilometers (WGS-84 mean radius)
 */
const EARTH_RADIUS_KM = 6371.0088;

/**
 * Converts degrees to radians
 */
function toRadians(degrees: number): number {
  return (degrees * Math.PI) / 180;
}

/**
 * Calculates straight-line spherical distance between two coordinates
 * using the Haversine formula.
 *
 * NOTE: Always communicate this value as "straight-line distance".
 * Never label or present this as road commute time or road transit distance.
 */
export function calculateHaversineDistanceKm(
  coord1: Coordinates,
  coord2: Coordinates
): number {
  const lat1Rad = toRadians(coord1.lat);
  const lat2Rad = toRadians(coord2.lat);
  const deltaLat = toRadians(coord2.lat - coord1.lat);
  const deltaLng = toRadians(coord2.lng - coord1.lng);

  const sinDeltaLatHalf = Math.sin(deltaLat / 2);
  const sinDeltaLngHalf = Math.sin(deltaLng / 2);

  const a =
    sinDeltaLatHalf * sinDeltaLatHalf +
    Math.cos(lat1Rad) * Math.cos(lat2Rad) * sinDeltaLngHalf * sinDeltaLngHalf;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  const distance = EARTH_RADIUS_KM * c;
  // Round to two decimal places
  return Math.round(distance * 100) / 100;
}

/**
 * Formats a distance in kilometers with explicit straight-line indicator
 */
export function formatStraightLineDistance(distanceKm: number): string {
  if (distanceKm < 1) {
    const meters = Math.round(distanceKm * 1000);
    return `${meters} m (straight-line)`;
  }
  return `${distanceKm.toFixed(1)} km (straight-line)`;
}

/**
 * Checks if a coordinate is strictly within a radial threshold in km
 */
export function isWithinRadius(
  center: Coordinates,
  target: Coordinates,
  radiusKm: number
): boolean {
  return calculateHaversineDistanceKm(center, target) <= radiusKm;
}

/**
 * Computes rough bounding box for geographic queries
 */
export function getBoundingBox(center: Coordinates, radiusKm: number) {
  const latDelta = radiusKm / 111.0; // ~111km per degree latitude
  const lngDelta = radiusKm / (111.0 * Math.cos(toRadians(center.lat)));

  return {
    north: center.lat + latDelta,
    south: center.lat - latDelta,
    east: center.lng + lngDelta,
    west: center.lng - lngDelta,
  };
}
