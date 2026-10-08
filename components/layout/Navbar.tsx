'use client';

import React from 'react';
import { Compass, FileText, Info } from 'lucide-react';

interface NavbarProps {
  activeTab: 'explorer' | 'report' | 'methodology';
  setActiveTab: (tab: 'explorer' | 'report' | 'methodology') => void;
  dataSource?: 'live_serpapi' | 'cached_serpapi' | 'illustrative_sample';
}

export function Navbar({ activeTab, setActiveTab, dataSource }: NavbarProps) {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white/95 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand identity */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveTab('explorer')}
            className="flex items-center gap-2.5 text-left focus:outline-none"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-teal-400 shadow-sm ring-1 ring-slate-800">
              <Compass className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold tracking-tight text-slate-900">
                  GapLens
                </span>
                <span className="rounded-full bg-teal-50 px-2 py-0.5 text-xs font-semibold text-teal-800 ring-1 ring-teal-600/20">
                  HerStay
                </span>
              </div>
              <p className="hidden text-xs text-slate-500 sm:block">
                Location intelligence for women’s accommodation
              </p>
            </div>
          </button>
        </div>

        {/* Navigation items */}
        <nav className="flex items-center gap-1 sm:gap-2">
          <button
            onClick={() => setActiveTab('explorer')}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
              activeTab === 'explorer'
                ? 'bg-slate-900 text-white'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <Compass className="h-4 w-4" />
            <span>Market Explorer</span>
          </button>

          <button
            onClick={() => setActiveTab('report')}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
              activeTab === 'report'
                ? 'bg-slate-900 text-white'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <FileText className="h-4 w-4" />
            <span>Opportunity Report</span>
          </button>

          <button
            onClick={() => setActiveTab('methodology')}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
              activeTab === 'methodology'
                ? 'bg-slate-900 text-white'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <Info className="h-4 w-4" />
            <span className="hidden sm:inline">Methodology</span>
          </button>
        </nav>

        {/* Data source status badge */}
        <div className="flex items-center gap-2">
          {dataSource === 'live_serpapi' && (
            <div className="flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-800 ring-1 ring-emerald-600/20">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Live SerpApi</span>
            </div>
          )}
          {dataSource === 'cached_serpapi' && (
            <div className="flex items-center gap-1.5 rounded-full bg-teal-50 px-2.5 py-1 text-xs font-medium text-teal-800 ring-1 ring-teal-600/20">
              <span className="h-2 w-2 rounded-full bg-teal-500" />
              <span>Cached SerpApi</span>
            </div>
          )}
          {(!dataSource || dataSource === 'illustrative_sample') && (
            <div className="flex items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-800 ring-1 ring-amber-600/20">
              <span className="h-2 w-2 rounded-full bg-amber-500" />
              <span className="hidden sm:inline">Illustrative Sample</span>
              <span className="sm:hidden">Sample</span>
            </div>
          )}

          <div className="hidden lg:flex items-center gap-1 rounded-md bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
            <span>SerpApi Hackathon 2026</span>
          </div>
        </div>
      </div>
    </header>
  );
}
