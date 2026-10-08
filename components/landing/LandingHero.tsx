'use client';

import React from 'react';
import {
  MapPin,
  MessageSquare,
  TrendingUp,
  ArrowRight,
} from 'lucide-react';

interface LandingHeroProps {
  onExplore: () => void;
  onSelectHub: (hubId: string) => void;
}

export function LandingHero({ onExplore, onSelectHub }: LandingHeroProps) {
  return (
    <div className="relative overflow-hidden bg-slate-50/50 py-12 sm:py-16 border-b border-slate-200">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto">
          {/* Eyebrow badge */}
          <div className="inline-flex items-center gap-2 rounded-full bg-teal-50 px-3 py-1 text-xs font-semibold text-teal-800 ring-1 ring-teal-600/20 mb-6">
            <span className="h-1.5 w-1.5 rounded-full bg-teal-600" />
            <span>SerpApi India Hackathon 2026 Submission</span>
          </div>

          {/* Hero headline */}
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 leading-[1.15]">
            Find where better women’s housing is needed.
          </h1>

          {/* Supporting copy */}
          <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto">
            Explore accommodation supply, resident feedback, and potential market gaps near major employment hubs — backed by live search evidence.
          </p>

          {/* Primary CTA and Market Quick-pickers */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={onExplore}
              className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-slate-900 px-6 py-3 text-sm font-bold text-white shadow-sm hover:bg-slate-800 transition-all"
            >
              <span>Explore a Market</span>
              <ArrowRight className="h-4 w-4 text-teal-400" />
            </button>
          </div>

          {/* Demonstration market pills */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-2 text-xs">
            <span className="text-slate-500 font-medium">Quick demonstration markets:</span>
            <button
              onClick={() => {
                onSelectHub('manyata-tech-park-blr');
                onExplore();
              }}
              className="inline-flex items-center gap-1 rounded-full border border-teal-200 bg-white px-3 py-1 text-xs font-semibold text-teal-800 hover:bg-teal-50 shadow-2xs"
            >
              <MapPin className="h-3 w-3 text-teal-600" />
              <span>Bengaluru → Manyata Tech Park</span>
            </button>

            <button
              onClick={() => {
                onSelectHub('hinjewadi-it-park-pune');
                onExplore();
              }}
              className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-50 shadow-2xs"
            >
              <MapPin className="h-3 w-3 text-slate-500" />
              <span>Pune → Hinjewadi</span>
            </button>

            <button
              onClick={() => {
                onSelectHub('gachibowli-financial-district-hyd');
                onExplore();
              }}
              className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-50 shadow-2xs"
            >
              <MapPin className="h-3 w-3 text-slate-500" />
              <span>Hyderabad → Gachibowli</span>
            </button>
          </div>
        </div>

        {/* 3 Core Product Capabilities */}
        <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs hover:border-teal-200 transition-all">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-50 text-teal-700 ring-1 ring-teal-600/20">
              <MapPin className="h-5 w-5" />
            </div>
            <h3 className="mt-4 text-base font-bold text-slate-900">
              1. Map Existing Supply
            </h3>
            <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
              Examine spatial density and straight-line proximity to office park gates across ladies PGs and hostels discovered via SerpApi Google Maps.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs hover:border-teal-200 transition-all">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-50 text-teal-700 ring-1 ring-teal-600/20">
              <MessageSquare className="h-5 w-5" />
            </div>
            <h3 className="mt-4 text-base font-bold text-slate-900">
              2. Understand Complaints
            </h3>
            <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
              Extract recurring resident friction across cleanliness, maintenance delays, deposit non-refunds, and transit hurdles from public reviews.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs hover:border-teal-200 transition-all">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-50 text-teal-700 ring-1 ring-teal-600/20">
              <TrendingUp className="h-5 w-5" />
            </div>
            <h3 className="mt-4 text-base font-bold text-slate-900">
              3. Identify Opportunity Zones
            </h3>
            <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
              Synthesize supply visibility, friction intensity, and walking proximity into actionable market theses for hostel operators and entrepreneurs.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
