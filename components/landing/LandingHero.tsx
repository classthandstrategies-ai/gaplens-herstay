'use client';

import React from 'react';
import {
  MapPin,
  ArrowRight,
} from 'lucide-react';

interface LandingHeroProps {
  onExplore: () => void;
  onSelectHub: (hubId: string) => void;
}

export function LandingHero({ onExplore, onSelectHub }: LandingHeroProps) {
  return (
    <section className="relative overflow-hidden bg-[#F6F5F0] py-10 sm:py-14 border-b border-[#E8E6DF]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto">
          {/* Eyebrow badge */}
          <div className="inline-flex items-center gap-2 rounded-full bg-[#E6F4F2] px-3.5 py-1 text-xs font-semibold text-[#0C4A44] border border-[#0C4A44]/25 mb-4">
            <span className="h-1.5 w-1.5 rounded-full bg-[#0C4A44]" />
            <span className="tracking-wide uppercase text-[11px] font-bold">
              Commerce & Market Intelligence Track • SerpApi Hackathon 2026
            </span>
          </div>

          {/* Hero headline in editorial display serif */}
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[#121518] leading-[1.12]">
            Discover where better women’s housing is needed.
          </h1>

          {/* Supporting copy */}
          <p className="mt-3.5 text-sm sm:text-base text-[#4B5563] leading-relaxed max-w-2xl mx-auto font-medium">
            GapLens identifies underserved women’s PG and hostel markets near major employment corridors by analyzing spatial supply, straight-line distance clusters, and public reviewer friction through SerpApi.
          </p>

          {/* Quick-Jump Market Selector Buttons */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-2 sm:gap-2.5">
            <span className="text-[11px] uppercase tracking-wider text-[#6B7280] font-bold w-full sm:w-auto block mb-1 sm:mb-0">
              Corridor Intelligence:
            </span>

            <button
              onClick={() => {
                onSelectHub('manyata-tech-park-blr');
                onExplore();
              }}
              className="inline-flex items-center gap-1.5 rounded-xl border border-[#D5D1C5] bg-white px-3.5 py-2 text-xs font-semibold text-[#121518] shadow-2xs hover:border-[#0C4A44] hover:bg-[#FBFBFA] transition-all cursor-pointer group"
            >
              <MapPin className="h-3.5 w-3.5 text-[#0C4A44]" />
              <span>Bengaluru → Manyata Tech Park</span>
              <ArrowRight className="h-3 w-3 text-[#9CA3AF] group-hover:text-[#0C4A44] group-hover:translate-x-0.5 transition-all" />
            </button>

            <button
              onClick={() => {
                onSelectHub('hinjewadi-it-park-pune');
                onExplore();
              }}
              className="inline-flex items-center gap-1.5 rounded-xl border border-[#D5D1C5] bg-white px-3.5 py-2 text-xs font-semibold text-[#121518] shadow-2xs hover:border-[#0C4A44] hover:bg-[#FBFBFA] transition-all cursor-pointer group"
            >
              <MapPin className="h-3.5 w-3.5 text-[#6B7280]" />
              <span>Pune → Hinjewadi</span>
              <ArrowRight className="h-3 w-3 text-[#9CA3AF] group-hover:text-[#0C4A44] group-hover:translate-x-0.5 transition-all" />
            </button>

            <button
              onClick={() => {
                onSelectHub('gachibowli-financial-district-hyd');
                onExplore();
              }}
              className="inline-flex items-center gap-1.5 rounded-xl border border-[#D5D1C5] bg-white px-3.5 py-2 text-xs font-semibold text-[#121518] shadow-2xs hover:border-[#0C4A44] hover:bg-[#FBFBFA] transition-all cursor-pointer group"
            >
              <MapPin className="h-3.5 w-3.5 text-[#6B7280]" />
              <span>Hyderabad → Gachibowli</span>
              <ArrowRight className="h-3 w-3 text-[#9CA3AF] group-hover:text-[#0C4A44] group-hover:translate-x-0.5 transition-all" />
            </button>
          </div>
        </div>

        {/* 3 Core Analytical Pillars: High-density horizontal ribbon, not generic bloated cards */}
        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-4 pt-8 border-t border-[#E2DFD4]">
          <div className="flex items-start gap-3 p-3 rounded-xl bg-white/60 border border-[#E8E6DF]/80">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#E6F4F2] text-[#0C4A44] shrink-0 font-bold text-xs">
              01
            </div>
            <div>
              <h3 className="text-xs font-bold text-[#121518] tracking-tight uppercase">
                Spatial Supply Mapping
              </h3>
              <p className="mt-1 text-xs text-[#525966] leading-relaxed">
                Examine inventory density and Haversine straight-line distance relative to anchor office gates.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 rounded-xl bg-white/60 border border-[#E8E6DF]/80">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-50 text-amber-800 shrink-0 font-bold text-xs border border-amber-200/50">
              02
            </div>
            <div>
              <h3 className="text-xs font-bold text-[#121518] tracking-tight uppercase">
                Public Reviewer Friction
              </h3>
              <p className="mt-1 text-xs text-[#525966] leading-relaxed">
                Extract recurring dissatisfaction themes in hygiene, security rules, and maintenance from Google reviews.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 rounded-xl bg-white/60 border border-[#E8E6DF]/80">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-800 shrink-0 font-bold text-xs border border-emerald-200/50">
              03
            </div>
            <div>
              <h3 className="text-xs font-bold text-[#121518] tracking-tight uppercase">
                Actionable Market Dossier
              </h3>
              <p className="mt-1 text-xs text-[#525966] leading-relaxed">
                Synthesize empirical search data into an evidence-backed starting thesis for property operators.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
