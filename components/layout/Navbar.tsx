'use client';

import React from 'react';
import { Compass, FileText, BookOpen, Sparkles } from 'lucide-react';

interface NavbarProps {
  activeTab: 'explorer' | 'report' | 'methodology';
  setActiveTab: (tab: 'explorer' | 'report' | 'methodology') => void;
  dataSource?: 'live_serpapi' | 'cached_serpapi' | 'illustrative_sample';
  onReplayTour?: () => void;
}

export function Navbar({ activeTab, setActiveTab, dataSource, onReplayTour }: NavbarProps) {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#E8E6DF] bg-[#FBFBFA]/90 backdrop-blur-md transition-colors">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-3 sm:px-6 lg:px-8">
        {/* Brand identity: Architectural / Editorial */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          <button
            onClick={() => setActiveTab('explorer')}
            className="group flex items-center gap-2.5 text-left focus:outline-none cursor-pointer"
          >
            <div className="flex h-9 w-9 sm:h-9.5 sm:w-9.5 items-center justify-center rounded-lg bg-[#121518] text-[#14B8A6] shadow-xs ring-1 ring-black/10 transition-transform group-hover:scale-[1.02]">
              <Compass className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5 sm:gap-2">
                <span className="font-serif text-lg sm:text-xl font-bold tracking-tight text-[#121518]">
                  GapLens
                </span>
                <span className="rounded bg-[#E6F4F2] px-1.5 py-0.5 text-[10px] sm:text-[11px] font-bold tracking-wider text-[#0C4A44] border border-[#0C4A44]/20 uppercase">
                  HerStay
                </span>
              </div>
              <p className="hidden text-[11px] text-[#6B7280] font-medium tracking-tight sm:block">
                Women&apos;s Accommodation Market Intelligence
              </p>
            </div>
          </button>
        </div>

        {/* Navigation items: Tactile segmented selector */}
        <nav className="flex items-center rounded-xl bg-[#F0EEE6] p-1 border border-[#E2DFD4] shadow-2xs">
          <button
            onClick={() => setActiveTab('explorer')}
            title="Market Explorer"
            aria-label="Market Explorer"
            className={`flex items-center gap-1.5 rounded-lg px-2.5 sm:px-3 py-1.5 text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'explorer'
                ? 'bg-[#121518] text-white shadow-xs'
                : 'text-[#4B5563] hover:text-[#121518] hover:bg-black/5'
            }`}
          >
            <Compass className="h-3.5 w-3.5" />
            <span className="hidden md:inline">Market </span>
            <span>Explorer</span>
          </button>

          <button
            onClick={() => setActiveTab('report')}
            title="Opportunity Dossier"
            aria-label="Opportunity Dossier"
            className={`flex items-center gap-1.5 rounded-lg px-2.5 sm:px-3 py-1.5 text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'report'
                ? 'bg-[#121518] text-white shadow-xs'
                : 'text-[#4B5563] hover:text-[#121518] hover:bg-black/5'
            }`}
          >
            <FileText className="h-3.5 w-3.5" />
            <span className="hidden md:inline">Opportunity </span>
            <span>Dossier</span>
          </button>

          <button
            onClick={() => setActiveTab('methodology')}
            title="Methodology"
            aria-label="Methodology"
            className={`flex items-center gap-1.5 rounded-lg px-2.5 sm:px-3 py-1.5 text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'methodology'
                ? 'bg-[#121518] text-white shadow-xs'
                : 'text-[#4B5563] hover:text-[#121518] hover:bg-black/5'
            }`}
          >
            <BookOpen className="h-3.5 w-3.5" />
            <span>Methodology</span>
          </button>
        </nav>

        {/* Right side: Replay Tour Trigger & Telemetry Status Badge */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {onReplayTour && (
            <button
              data-tour-trigger="true"
              onClick={onReplayTour}
              className="flex items-center gap-1 sm:gap-1.5 rounded-lg border border-[#D5D1C5] bg-white p-1.5 sm:px-2.5 sm:py-1 text-xs font-semibold text-[#374151] shadow-2xs hover:bg-[#F6F5F0] hover:text-[#0C4A44] transition-colors cursor-pointer"
              title="How to Use (Guided Tour)"
            >
              <Sparkles className="h-3.5 w-3.5 text-[#0C4A44]" />
              <span className="hidden sm:inline">How to Use</span>
            </button>
          )}

          {dataSource === 'live_serpapi' && (
            <div className="flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-800 border border-emerald-600/25">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Live SerpApi</span>
            </div>
          )}
          {dataSource === 'cached_serpapi' && (
            <div className="flex items-center gap-1.5 rounded-full bg-teal-50 px-2.5 py-1 text-[11px] font-semibold text-teal-800 border border-teal-600/25">
              <span className="h-2 w-2 rounded-full bg-teal-600" />
              <span>Cached SerpApi</span>
            </div>
          )}
          {(!dataSource || dataSource === 'illustrative_sample') && (
            <div className="flex items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-1 text-[11px] font-semibold text-amber-900 border border-amber-500/25">
              <span className="h-2 w-2 rounded-full bg-amber-500" />
              <span className="hidden sm:inline">Illustrative Baseline</span>
              <span className="sm:hidden">Sample</span>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
