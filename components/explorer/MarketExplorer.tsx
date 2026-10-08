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
import {
  Search,
  MapPin,
  RefreshCw,
  Sliders,
  Building2,
  ChevronRight,
} from 'lucide-react';

// Dynamic import for Leaflet to prevent SSR window reference error
const DynamicPropertyMap = dynamic(() => import('./PropertyMap'), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center rounded-xl border border-slate-200 bg-slate-100 p-8 text-center text-xs text-slate-500">
      <RefreshCw className="h-5 w-5 animate-spin text-teal-600 mb-2" />
      <span>Loading Interactive Geographic Map...</span>
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
    if (sortBy === 'rating') return b.rating - a.rating;
    return 0;
  });

  const confidenceBadgeColor =
    initialReport.metrics.evidenceConfidence === 'high'
      ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
      : initialReport.metrics.evidenceConfidence === 'moderate'
      ? 'bg-teal-50 text-teal-800 border-teal-200'
      : initialReport.metrics.evidenceConfidence === 'cautious'
      ? 'bg-amber-50 text-amber-800 border-amber-200'
      : 'bg-rose-50 text-rose-800 border-rose-200';

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 space-y-6">
      {/* Top Notification / Data Provenance Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
        <div className="flex items-start gap-3">
          <div className="rounded-lg bg-teal-50 p-2 text-teal-700 shrink-0">
            <Building2 className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-slate-900">
                Active Market: {initialReport.hub.name} ({initialReport.hub.cityName})
              </h2>
              <span className="rounded bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-700">
                {initialReport.radiusKm} km radius
              </span>
            </div>
            <p className="mt-0.5 text-xs text-slate-500">
              Examining {initialReport.metrics.listingsInRadius} accommodations & {initialReport.metrics.totalReviewsAnalyzed} sampled resident reviews
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onNavigateToReport}
            className="inline-flex items-center gap-1.5 rounded-lg bg-teal-600 px-3 py-1.5 text-xs font-semibold text-white shadow-xs hover:bg-teal-700 transition-colors"
          >
            <span>View Opportunity Report</span>
            <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Main Grid: Controls + Map & Listings */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Filter & Market Selector Sidebar (4 Cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Sliders className="h-4 w-4 text-teal-600" />
              <span>Market & Radius Filters</span>
            </h3>

            {/* City Selection */}
            <div className="mt-4">
              <label className="text-xs font-semibold text-slate-700">Target Metropolitan Hub</label>
              <div className="mt-1.5 grid grid-cols-3 gap-1.5">
                {(['bengaluru', 'pune', 'hyderabad'] as CityKey[]).map((city) => (
                  <button
                    key={city}
                    onClick={() => handleCityChange(city)}
                    className={`rounded-lg py-2 px-1 text-xs font-semibold capitalize transition-all ${
                      selectedCity === city
                        ? 'bg-slate-900 text-white shadow-xs'
                        : 'border border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {city}
                  </button>
                ))}
              </div>
            </div>

            {/* Employment Hub Selection */}
            <div className="mt-4">
              <label className="text-xs font-semibold text-slate-700">Employment Anchor Park</label>
              <select
                value={selectedHubId}
                onChange={(e) => setSelectedHubId(e.target.value)}
                className="mt-1.5 block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-medium text-slate-900 shadow-xs focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
              >
                {hubsInCity.map((hub) => (
                  <option key={hub.id} value={hub.id}>
                    {hub.name}
                  </option>
                ))}
              </select>
              <p className="mt-1 text-[11px] text-slate-500 leading-tight">
                {activeHub.landmark}
              </p>
            </div>

            {/* Radius Slider */}
            <div className="mt-4">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-700">Analysis Radius</span>
                <span className="font-mono font-bold text-teal-700">
                  {radiusKm.toFixed(1)} km (straight-line)
                </span>
              </div>
              <input
                type="range"
                min="1.0"
                max={activeHub.maxRadiusKm}
                step="0.5"
                value={radiusKm}
                onChange={(e) => setRadiusKm(parseFloat(e.target.value))}
                className="mt-2 w-full accent-teal-600"
              />
              <div className="mt-1 flex justify-between text-[10px] text-slate-400">
                <span>1.0 km (Walking corridor)</span>
                <span>{activeHub.maxRadiusKm} km (Transit perimeter)</span>
              </div>
            </div>

            {/* Primary Action Button */}
            <button
              onClick={handleTriggerAnalysis}
              disabled={isLoading}
              className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-slate-800 disabled:opacity-50 transition-all"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin text-teal-400" />
                  <span>Scanning Market Data...</span>
                </>
              ) : (
                <>
                  <Search className="h-4 w-4 text-teal-400" />
                  <span>Analyze Accommodation Supply</span>
                </>
              )}
            </button>
          </div>

          {/* Quick Hub Context Card */}
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-xs">
            <h4 className="font-bold text-slate-800 flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5 text-teal-600" />
              <span>Hub Intelligence Context</span>
            </h4>
            <p className="mt-1 text-slate-600 leading-relaxed">{activeHub.description}</p>
            <div className="mt-3">
              <span className="font-semibold text-slate-700">Major Tenant Companies:</span>
              <div className="mt-1.5 flex flex-wrap gap-1">
                {activeHub.notableEmployers.map((emp) => (
                  <span
                    key={emp}
                    className="rounded bg-white px-2 py-0.5 text-[10px] font-medium text-slate-700 border border-slate-200"
                  >
                    {emp}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Content Area: KPIs + Map/List (8 Cols) */}
        <div className="lg:col-span-8 space-y-4">
          {/* Top KPI Summary Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="rounded-xl border border-slate-200 bg-white p-3.5 shadow-xs">
              <span className="text-[11px] font-semibold text-slate-500 uppercase">
                Listings Found
              </span>
              <div className="mt-1 flex items-baseline gap-1.5">
                <span className="text-xl font-bold text-slate-900">
                  {initialReport.metrics.listingsInRadius}
                </span>
                <span className="text-[10px] font-medium text-teal-700 capitalize">
                  {initialReport.metrics.supplyVisibility} supply
                </span>
              </div>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-3.5 shadow-xs">
              <span className="text-[11px] font-semibold text-slate-500 uppercase">
                Reviews Sampled
              </span>
              <div className="mt-1 flex items-baseline gap-1.5">
                <span className="text-xl font-bold text-slate-900">
                  {initialReport.metrics.totalReviewsAnalyzed}
                </span>
                <span className="text-[10px] font-medium text-slate-500">
                  med. {initialReport.metrics.medianReviewCount}
                </span>
              </div>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-3.5 shadow-xs">
              <span className="text-[11px] font-semibold text-slate-500 uppercase">
                Review Friction Index
              </span>
              <div className="mt-1 flex items-baseline gap-1.5">
                <span className="text-xl font-bold text-slate-900">
                  {initialReport.metrics.reviewFrictionIndex}
                </span>
                <span className="text-[10px] text-slate-500">/ 100</span>
              </div>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-3.5 shadow-xs">
              <span className="text-[11px] font-semibold text-slate-500 uppercase">
                Evidence Confidence
              </span>
              <div className="mt-1">
                <span
                  className={`inline-block rounded-md border px-2 py-0.5 text-xs font-bold capitalize ${confidenceBadgeColor}`}
                >
                  {initialReport.metrics.evidenceConfidence}
                </span>
              </div>
            </div>
          </div>

          {/* Mobile View Switcher */}
          <div className="flex sm:hidden rounded-lg bg-slate-200 p-1">
            <button
              onClick={() => setMobileTab('map')}
              className={`flex-1 py-1.5 text-center text-xs font-semibold rounded-md ${
                mobileTab === 'map' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
              }`}
            >
              Interactive Map
            </button>
            <button
              onClick={() => setMobileTab('list')}
              className={`flex-1 py-1.5 text-center text-xs font-semibold rounded-md ${
                mobileTab === 'list' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
              }`}
            >
              Accommodation List ({initialReport.listings.length})
            </button>
          </div>

          {/* Split Map & Property Results Pane */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            {/* Map Column (7 Cols on desktop) */}
            <div
              className={`h-[420px] md:h-[540px] md:col-span-7 ${
                mobileTab === 'map' ? 'block' : 'hidden md:block'
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

            {/* Listings Column (5 Cols on desktop) */}
            <div
              className={`h-[420px] md:h-[540px] md:col-span-5 flex flex-col rounded-xl border border-slate-200 bg-slate-50/50 p-3 ${
                mobileTab === 'list' ? 'block' : 'hidden md:flex'
              }`}
            >
              {/* Listings Header & Sort */}
              <div className="flex items-center justify-between pb-2.5 border-b border-slate-200 px-1">
                <span className="text-xs font-bold text-slate-800">
                  {initialReport.listings.length} Discovered Properties
                </span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as 'distance' | 'friction' | 'rating')}
                  className="rounded-md border border-slate-300 bg-white px-2 py-1 text-[11px] font-medium text-slate-700"
                >
                  <option value="distance">Sort: Nearest</option>
                  <option value="friction">Sort: Highest Friction</option>
                  <option value="rating">Sort: Top Rating</option>
                </select>
              </div>

              {/* Scrollable list */}
              <div className="mt-2.5 flex-1 overflow-y-auto space-y-2.5 pr-1">
                {sortedListings.length === 0 ? (
                  <div className="rounded-xl border border-dashed border-slate-300 p-8 text-center text-xs text-slate-500">
                    No accommodations discovered within {initialReport.radiusKm} km radius. Try expanding the search perimeter.
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
          </div>
        </div>
      </div>

      {/* Review Theme Intelligence Breakdown Section */}
      <ThemeChart
        themes={initialReport.themeBreakdown}
        totalReviewsAnalyzed={initialReport.metrics.totalReviewsAnalyzed}
      />

      {/* Selected Property Detail Modal */}
      <PropertyDetailModal
        listing={selectedProperty}
        hub={initialReport.hub}
        onClose={() => setSelectedProperty(null)}
      />
    </div>
  );
}
