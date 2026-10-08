'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import {
  AnalysisReport,
  PlaceListing,
  CityKey,
} from '@/lib/types';
import { EMPLOYMENT_HUBS } from '@/lib/markets/data';
import { PropertyCard } from './PropertyCard';
import { PropertyDetailModal } from './PropertyDetailModal';
import { ThemeChart } from './ThemeChart';
import { ContextualHelp } from '@/components/onboarding/ContextualHelp';
import {
  Search,
  MapPin,
  RefreshCw,
  Building2,
  AlertTriangle,
  SlidersHorizontal,
  FileText,
  ArrowUpRight,
} from 'lucide-react';

// Dynamic import for Leaflet to prevent SSR window reference error
const DynamicPropertyMap = dynamic(() => import('./PropertyMap'), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full flex-col items-center justify-center rounded-2xl border border-stone-200 bg-stone-100/70 p-8 text-center text-xs text-stone-500">
      <RefreshCw className="h-5 w-5 animate-spin text-teal-700 mb-2" />
      <span className="font-mono text-stone-700 font-medium">Initializing Spatial Map Canvas...</span>
      <span className="text-[11px] text-stone-400 mt-1">Projecting Haversine perimeter and discovered nodes</span>
    </div>
  ),
});

interface MarketExplorerProps {
  initialReport: AnalysisReport;
  onRunAnalysis: (hubId: string, radiusKm: number) => Promise<void>;
  isLoading: boolean;
  onNavigateToReport: () => void;
}

export function MarketExplorer({
  initialReport,
  onRunAnalysis,
  isLoading,
  onNavigateToReport,
}: MarketExplorerProps) {
  const [selectedCity, setSelectedCity] = useState<CityKey>(initialReport.hub.cityKey);
  const [selectedHubId, setSelectedHubId] = useState<string>(initialReport.hub.id);
  const [radiusKm, setRadiusKm] = useState<number>(initialReport.radiusKm);
  const [selectedProperty, setSelectedProperty] = useState<PlaceListing | null>(null);
  const [mobileTab, setMobileTab] = useState<'map' | 'list'>('map');
  const [sortBy, setSortBy] = useState<'distance' | 'friction' | 'rating'>('distance');
  const [showAnchorIntel, setShowAnchorIntel] = useState<boolean>(false);

  const hubsInCity = EMPLOYMENT_HUBS.filter((h) => h.cityKey === selectedCity);
  const activeHub = EMPLOYMENT_HUBS.find((h) => h.id === selectedHubId) || initialReport.hub;

  const handleCityChange = (city: CityKey) => {
    setSelectedCity(city);
    const firstInCity = EMPLOYMENT_HUBS.find((h) => h.cityKey === city);
    if (firstInCity) {
      setSelectedHubId(firstInCity.id);
      setRadiusKm(firstInCity.defaultRadiusKm);
    }
  };

  const handleTriggerAnalysis = async () => {
    await onRunAnalysis(selectedHubId, radiusKm);
  };

  // Sort listings
  const sortedListings = [...initialReport.listings].sort((a, b) => {
    if (sortBy === 'distance') return a.distanceKm - b.distanceKm;
    if (sortBy === 'friction') return (b.themeFrictionScore || 0) - (a.themeFrictionScore || 0);
    if (sortBy === 'rating') return (b.rating ?? -1) - (a.rating ?? -1);
    return 0;
  });

  const confidenceBadgeColor =
    initialReport.metrics.evidenceConfidence === 'high'
      ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
      : initialReport.metrics.evidenceConfidence === 'moderate'
      ? 'bg-teal-50 text-teal-800 border-teal-300'
      : initialReport.metrics.evidenceConfidence === 'cautious'
      ? 'bg-amber-50 text-amber-800 border-amber-300'
      : 'bg-rose-50 text-rose-800 border-rose-300';

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 space-y-5">
      {/* 1. TOP COMMAND & FILTER DOCK (Mobbin Linear / Airbnb style) */}
      <section
        data-tour="market-filters"
        aria-label="Market search filters and corridor parameters"
        className="rounded-2xl border border-stone-200/90 bg-white/95 p-4 sm:p-5 shadow-xs backdrop-blur-xs"
      >
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          {/* Left: Metro & Hub Selectors */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Metro pills */}
            <div className="flex items-center rounded-xl bg-stone-100/90 p-1 border border-stone-200/70">
              {(['bengaluru', 'pune', 'hyderabad'] as CityKey[]).map((city) => (
                <button
                  key={city}
                  onClick={() => handleCityChange(city)}
                  className={`rounded-lg px-3 py-1.5 text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                    selectedCity === city
                      ? 'bg-stone-900 text-white shadow-xs'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  {city}
                </button>
              ))}
            </div>

            {/* Employment Hub Select */}
            <div className="relative min-w-[220px]">
              <label htmlFor="hub-select" className="sr-only">
                Employment Anchor Hub
              </label>
              <select
                id="hub-select"
                value={selectedHubId}
                onChange={(e) => setSelectedHubId(e.target.value)}
                className="w-full appearance-none rounded-xl border border-stone-300 bg-white py-2 pl-3.5 pr-8 text-xs font-semibold text-stone-900 shadow-2xs hover:border-stone-400 focus:border-teal-700 focus:outline-hidden focus:ring-1 focus:ring-teal-700 cursor-pointer"
              >
                {hubsInCity.map((hub) => (
                  <option key={hub.id} value={hub.id}>
                    {hub.name}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2.5 text-stone-400">
                <SlidersHorizontal className="h-3.5 w-3.5" />
              </div>
            </div>

            {/* Hub Context Toggle */}
            <button
              onClick={() => setShowAnchorIntel(!showAnchorIntel)}
              className="inline-flex items-center gap-1.5 rounded-xl border border-stone-200 bg-stone-50 px-3 py-2 text-xs font-medium text-stone-700 hover:bg-stone-100 transition-colors cursor-pointer"
            >
              <Building2 className="h-3.5 w-3.5 text-teal-700" />
              <span>Anchor Profile</span>
              <span className="rounded bg-stone-200 px-1.5 py-0.2 font-mono text-[10px] text-stone-700">
                {activeHub.notableEmployers.length}
              </span>
            </button>
          </div>

          {/* Right: Haversine Radius & Primary Action */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 lg:gap-5">
            {/* Radius slider with tabular numeral readout */}
            <div className="flex items-center gap-3">
              <div className="flex flex-col">
                <div className="flex items-center gap-1">
                  <span className="text-[11px] font-medium text-stone-500 uppercase tracking-wider">
                    Radius
                  </span>
                  <ContextualHelp
                    title="Haversine Straight-Line Radius"
                    content="Calculates great-circle distance from the anchor park coordinates. Real travel distance depends on pedestrian gates, road layouts, and traffic."
                  />
                </div>
                <span className="font-mono text-xs font-bold text-teal-800">
                  {radiusKm.toFixed(1)} km <span className="text-[10px] font-normal text-stone-400">(straight-line)</span>
                </span>
              </div>
              <input
                type="range"
                min="1.0"
                max={activeHub.maxRadiusKm}
                step="0.5"
                value={radiusKm}
                onChange={(e) => setRadiusKm(parseFloat(e.target.value))}
                className="w-28 sm:w-36 accent-teal-700 cursor-pointer"
                aria-label="Analysis radius in kilometers"
              />
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-2">
              <button
                data-tour="analyze-btn"
                onClick={handleTriggerAnalysis}
                disabled={isLoading}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-stone-900 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-stone-800 disabled:opacity-50 transition-all cursor-pointer"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="h-3.5 w-3.5 animate-spin text-teal-400" />
                    <span>Scanning SerpApi...</span>
                  </>
                ) : (
                  <>
                    <Search className="h-3.5 w-3.5 text-teal-400" />
                    <span>Scan Supply</span>
                  </>
                )}
              </button>

              <button
                onClick={onNavigateToReport}
                className="inline-flex items-center gap-1.5 rounded-xl border border-stone-300 bg-white px-3.5 py-2 text-xs font-semibold text-stone-800 shadow-2xs hover:bg-stone-50 transition-colors cursor-pointer"
              >
                <FileText className="h-3.5 w-3.5 text-teal-700" />
                <span className="hidden sm:inline">Opportunity Dossier</span>
                <span className="sm:hidden">Dossier</span>
                <ArrowUpRight className="h-3 w-3 text-stone-400" />
              </button>
            </div>
          </div>
        </div>

        {/* Collapsible Anchor Corridor Profile */}
        {showAnchorIntel && (
          <div className="mt-4 pt-4 border-t border-stone-200/80 grid grid-cols-1 md:grid-cols-12 gap-3 text-xs">
            <div className="md:col-span-4">
              <span className="font-semibold text-stone-900 block">Anchor Landmark</span>
              <p className="text-stone-600 mt-0.5">{activeHub.landmark}</p>
            </div>
            <div className="md:col-span-5">
              <span className="font-semibold text-stone-900 block">Corridor Description</span>
              <p className="text-stone-600 mt-0.5 leading-relaxed">{activeHub.description}</p>
            </div>
            <div className="md:col-span-3">
              <span className="font-semibold text-stone-900 block">Notable Employers</span>
              <div className="mt-1 flex flex-wrap gap-1">
                {activeHub.notableEmployers.map((emp) => (
                  <span
                    key={emp}
                    className="rounded-md bg-stone-100 px-1.5 py-0.5 font-mono text-[10px] text-stone-700 border border-stone-200"
                  >
                    {emp}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}
      </section>

      {/* 2. TELEMETRY RIBBON (Mobbin Amplitude high-density strip) */}
      <section
        aria-label="Live market telemetry summary"
        className="rounded-2xl border border-stone-200 bg-white shadow-2xs overflow-hidden"
      >
        {initialReport.searchCoverage === 'partial' && (
          <div className="border-b border-amber-200 bg-amber-50/90 px-4 py-2.5 text-xs text-amber-900 flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0" />
            <span className="font-semibold">Partial Search Coverage:</span>
            <span className="text-amber-800">
              {initialReport.partialCoverageNote ||
                'One targeted query failed during SerpApi retrieval. Displayed accommodations represent partial market coverage.'}
            </span>
          </div>
        )}

        <div className="grid grid-cols-2 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-stone-200/80">
          {/* Discovered Accommodations */}
          <div className="p-3.5 sm:p-4">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[11px] font-semibold text-stone-500 uppercase tracking-wider">
                Supply Identified
              </span>
              <span className="rounded bg-stone-100 px-1.5 py-0.5 text-[10px] font-medium text-stone-600 capitalize">
                {initialReport.metrics.supplyVisibility} visibility
              </span>
            </div>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-stone-900">
                {initialReport.metrics.listingsInRadius}
              </span>
              <span className="text-xs text-stone-500 font-sans">
                within {initialReport.radiusKm} km
              </span>
            </div>
          </div>

          {/* Reviews Analyzed */}
          <div className="p-3.5 sm:p-4">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[11px] font-semibold text-stone-500 uppercase tracking-wider">
                Public Reviews
              </span>
              <span className="font-mono text-[10px] text-stone-400">
                {initialReport.metrics.listingsWithReviewsCount} / {initialReport.metrics.listingsInRadius} places
              </span>
            </div>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-stone-900">
                {initialReport.metrics.totalReviewsAnalyzed}
              </span>
              <span className="text-xs text-stone-500 font-sans">
                sampled comments
              </span>
            </div>
          </div>

          {/* Friction Index */}
          <div className="p-3.5 sm:p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1">
                <span className="font-mono text-[11px] font-semibold text-stone-500 uppercase tracking-wider">
                  Friction Index
                </span>
                <ContextualHelp
                  title="Tenant Friction Index"
                  content="0–100 composite severity score measuring recurrence of complaints (hygiene, maintenance, security, food, curfews) across public reviews. Missing ratings are preserved as null and not penalized."
                />
              </div>
              <span className="font-mono text-[10px] text-stone-400">/ 100</span>
            </div>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-stone-900">
                {initialReport.metrics.reviewFrictionIndex}
              </span>
              <span className="text-xs text-stone-500 font-sans">
                composite friction
              </span>
            </div>
          </div>

          {/* Evidence Confidence */}
          <div className="p-3.5 sm:p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1">
                <span className="font-mono text-[11px] font-semibold text-stone-500 uppercase tracking-wider">
                  Evidence Confidence
                </span>
                <ContextualHelp
                  title="Evidence Confidence Rating"
                  content="Derived from review density and listing coverage. Prevents over-generalizing findings when only a fraction of properties have public review feedback."
                />
              </div>
            </div>
            <div className="mt-1.5 flex items-center gap-2">
              <span
                className={`inline-block rounded-md border px-2.5 py-0.5 font-mono text-xs font-bold uppercase tracking-wider ${confidenceBadgeColor}`}
              >
                {initialReport.dataSource === 'illustrative_sample'
                  ? 'DEMO SAMPLE'
                  : initialReport.metrics.evidenceConfidence}
              </span>
              <span className="text-[11px] text-stone-500 truncate max-w-[130px]">
                {initialReport.dataSource === 'illustrative_sample'
                  ? 'illustrative sample'
                  : initialReport.dataSource.replace('_', ' ')}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. MOBILE VIEW TOGGLE */}
      <div className="flex sm:hidden rounded-xl bg-stone-200/90 p-1 border border-stone-300">
        <button
          onClick={() => setMobileTab('map')}
          className={`flex-1 py-1.5 text-center text-xs font-semibold rounded-lg transition-all ${
            mobileTab === 'map' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-600'
          }`}
        >
          Interactive Spatial Map
        </button>
        <button
          onClick={() => setMobileTab('list')}
          className={`flex-1 py-1.5 text-center text-xs font-semibold rounded-lg transition-all ${
            mobileTab === 'list' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-600'
          }`}
        >
          Accommodations ({initialReport.listings.length})
        </button>
      </div>

      {/* 4. EXPANSIVE MAP & LISTING SPLIT WORKSPACE (Mobbin Airbnb style) */}
      <section
        data-tour="property-map-area"
        aria-label="Interactive map and discovered accommodation listings"
        className="grid grid-cols-1 lg:grid-cols-12 gap-4"
      >
        {/* Map Canvas (7 cols on large desktop) */}
        <div
          className={`lg:col-span-7 h-[460px] sm:h-[560px] lg:h-[640px] rounded-2xl overflow-hidden border border-stone-200/90 bg-white shadow-xs ${
            mobileTab === 'map' ? 'block' : 'hidden sm:block'
          }`}
        >
          <DynamicPropertyMap
            hub={initialReport.hub}
            radiusKm={initialReport.radiusKm}
            listings={initialReport.listings}
            selectedProperty={selectedProperty}
            onSelectProperty={(prop) => setSelectedProperty(prop)}
          />
        </div>

        {/* Accommodation Stream Panel (5 cols on large desktop) */}
        <div
          className={`lg:col-span-5 h-[460px] sm:h-[560px] lg:h-[640px] flex flex-col rounded-2xl border border-stone-200/90 bg-stone-50/60 p-3.5 shadow-xs ${
            mobileTab === 'list' ? 'block' : 'hidden sm:flex'
          }`}
        >
          {/* Header & Sort Controls */}
          <div className="flex items-center justify-between pb-3 border-b border-stone-200 px-1">
            <div>
              <span className="font-serif text-sm font-bold text-stone-900">
                Discovered Accommodations
              </span>
              <span className="ml-2 font-mono text-[11px] text-stone-500 font-medium">
                ({initialReport.listings.length})
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              <label htmlFor="sort-select" className="sr-only">
                Sort accommodations
              </label>
              <select
                id="sort-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'distance' | 'friction' | 'rating')}
                className="rounded-lg border border-stone-300 bg-white px-2.5 py-1 text-[11px] font-semibold text-stone-700 shadow-2xs hover:border-stone-400 focus:outline-hidden cursor-pointer"
              >
                <option value="distance">Sort: Nearest</option>
                <option value="friction">Sort: Friction Index</option>
                <option value="rating">Sort: Top Rating</option>
              </select>
            </div>
          </div>

          {/* Scrollable Listings Stream */}
          <div className="mt-3 flex-1 overflow-y-auto space-y-2.5 pr-1 focus:outline-hidden" tabIndex={0} aria-label="Discovered accommodation list">
            {sortedListings.length === 0 ? (
              <div className="rounded-xl border border-dashed border-stone-300 p-8 text-center text-xs text-stone-500">
                <MapPin className="h-6 w-6 text-stone-400 mx-auto mb-2" />
                <p className="font-semibold text-stone-700">No accommodations discovered</p>
                <p className="mt-1 text-stone-500">
                  Zero public listings found within {initialReport.radiusKm} km straight-line radius.
                  Try increasing the radius slider above.
                </p>
              </div>
            ) : (
              sortedListings.map((listing) => (
                <PropertyCard
                  key={listing.id}
                  listing={listing}
                  isSelected={selectedProperty?.id === listing.id}
                  onSelect={() => setSelectedProperty(listing)}
                />
              ))
            )}
          </div>
        </div>
      </section>

      {/* 5. REVIEW FRICTION & DISSATISFACTION MATRIX */}
      <section
        data-tour="friction-breakdown"
        aria-label="Public review sentiment and friction breakdown"
      >
        <ThemeChart
          themes={initialReport.themeBreakdown}
          totalReviewsAnalyzed={initialReport.metrics.totalReviewsAnalyzed}
        />
      </section>

      {/* 6. INSPECTOR MODAL */}
      <PropertyDetailModal
        listing={selectedProperty}
        hub={initialReport.hub}
        onClose={() => setSelectedProperty(null)}
      />
    </div>
  );
}
