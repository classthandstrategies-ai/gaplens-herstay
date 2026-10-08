/**
 * Core domain contracts for GapLens - HerStay Intelligence
 */

export type CityKey = 'bengaluru' | 'pune' | 'hyderabad';

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface EmploymentHub {
  id: string;
  name: string;
  cityKey: CityKey;
  cityName: string;
  landmark: string;
  coordinates: Coordinates;
  defaultRadiusKm: number;
  maxRadiusKm: number;
  primaryQueries: string[];
  description: string;
  notableEmployers: string[];
}

export type ThemeCategory =
  | 'hygiene'
  | 'transport'
  | 'privacy'
  | 'management'
  | 'amenities'
  | 'food'
  | 'maintenance'
  | 'pricing'
  | 'safety';

export interface ThemeSnippet {
  text: string;
  category: ThemeCategory;
  sentiment: 'negative' | 'neutral' | 'positive';
  placeTitle: string;
  placeId: string;
  author: string;
  date?: string;
  isUnverifiedSafetyMention?: boolean;
}

export interface ReviewItem {
  id: string;
  author: string;
  rating: number | null;
  text: string;
  date?: string;
  link?: string;
  extractedThemes?: ThemeCategory[];
}

export interface PlaceListing {
  id: string;
  dataId?: string;
  placeId?: string;
  title: string;
  address: string;
  rating: number | null; // null represents unrated/unknown rating
  reviewCount: number;
  coordinates: Coordinates;
  distanceKm: number; // Straight-line distance in km from hub
  link?: string;
  thumbnail?: string;
  phone?: string;
  price?: string;
  category?: string;
  reviewsSample?: ReviewItem[];
  themeFrictionScore?: number;
  dominantComplaints?: ThemeCategory[];
}

export interface ThemeAggregate {
  category: ThemeCategory;
  label: string;
  description: string;
  negativeCount: number;
  positiveCount: number;
  frequencyPercentage: number;
  severity: 'high' | 'medium' | 'low';
  representativeSnippets: ThemeSnippet[];
  impactSummary: string;
}

export interface MarketGapHypothesis {
  headline: string;
  opportunityType: 'quality_upgrade' | 'accessibility_pocket' | 'management_deficit' | 'underserved_premium';
  summary: string;
  actionableInsights: string[];
  recommendedFocusAreas: string[];
  targetPockets: Array<{
    name: string;
    distanceBand: string;
    observation: string;
  }>;
}

export interface MarketMetrics {
  totalListingsFound: number;
  listingsInRadius: number;
  listingsWithReviewsCount: number; // Distinct properties with analyzed reviews
  ratedListingsCount: number; // Distinct properties with verified public rating
  totalReviewsAnalyzed: number;
  averageRating: number | null; // null if no rated properties exist
  medianReviewCount: number;
  supplyDensityKm2: number;
  supplyVisibility: 'high' | 'moderate' | 'sparse';
  reviewFrictionIndex: number; // 0 - 100
  evidenceConfidence: 'high' | 'moderate' | 'cautious' | 'insufficient';
  confidenceReason: string;
}

export interface AnalysisReport {
  id: string;
  hub: EmploymentHub;
  radiusKm: number;
  retrievedAt: string;
  dataSource: 'live_serpapi' | 'cached_serpapi' | 'illustrative_sample';
  apiLatencyMs?: number;
  metrics: MarketMetrics;
  listings: PlaceListing[];
  themeBreakdown: ThemeAggregate[];
  opportunityHypothesis: MarketGapHypothesis;
  limitations: string[];
}

export interface AnalysisRequestPayload {
  hubId: string;
  radiusKm: number;
  forceRefresh?: boolean;
}

export interface AnalysisResponseEnvelope {
  success: boolean;
  data?: AnalysisReport;
  error?: string;
  details?: string;
  code?: 'KEY_MISSING' | 'RATE_LIMITED' | 'NETWORK_ERROR' | 'INVALID_PARAMS' | 'OK';
}
