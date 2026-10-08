/**
 * In-memory sliding window rate limiter for public analysis endpoints.
 * Protects against automated credit consumption and scraping loops.
 */

const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute sliding window
const MAX_REQUESTS_PER_WINDOW = 15; // Max 15 requests/min per IP

const requestHistory = new Map<string, number[]>();

export function checkRateLimit(ip: string, maxRequests = MAX_REQUESTS_PER_WINDOW): boolean {
  const now = Date.now();
  const timestamps = requestHistory.get(ip) || [];
  const validTimestamps = timestamps.filter((t) => now - t < RATE_LIMIT_WINDOW_MS);

  if (validTimestamps.length >= maxRequests) {
    requestHistory.set(ip, validTimestamps);
    return true; // Exceeded limit -> rate limited
  }

  validTimestamps.push(now);
  requestHistory.set(ip, validTimestamps);
  return false; // Allowed
}

export function resetRateLimits(): void {
  requestHistory.clear();
}
