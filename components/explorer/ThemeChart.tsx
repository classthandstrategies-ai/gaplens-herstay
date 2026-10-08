'use client';

import React, { useState } from 'react';
import { ThemeAggregate } from '@/lib/types';
import { ShieldAlert } from 'lucide-react';

interface ThemeChartProps {
  themes: ThemeAggregate[];
  totalReviewsAnalyzed: number;
}

export function ThemeChart({ themes, totalReviewsAnalyzed }: ThemeChartProps) {
  const [selectedThemeCategory, setSelectedThemeCategory] = useState<string | null>(
    themes[0]?.category || null
  );

  const activeTheme = themes.find((t) => t.category === selectedThemeCategory) || themes[0];

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-slate-100 pb-4">
        <div>
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <span>Resident Friction Breakdown</span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Recurring dissatisfaction themes extracted from {totalReviewsAnalyzed} sampled resident reviews
          </p>
        </div>

        <div className="flex items-center gap-3 text-xs text-slate-500">
          <span className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-sm bg-rose-500" />
            <span>High Severity</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-sm bg-amber-500" />
            <span>Moderate Friction</span>
          </span>
        </div>
      </div>

      {/* Main theme progress bars */}
      <div className="mt-4 grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-6 space-y-2.5">
          {themes.map((theme) => {
            const isSelected = selectedThemeCategory === theme.category;
            const barWidth = Math.min(100, Math.max(8, theme.frequencyPercentage * 2.2));

            const barColor =
              theme.severity === 'high'
                ? 'bg-rose-500'
                : theme.severity === 'medium'
                ? 'bg-amber-500'
                : 'bg-teal-500';

            return (
              <div
                key={theme.category}
                onClick={() => setSelectedThemeCategory(theme.category)}
                className={`cursor-pointer rounded-lg p-2.5 transition-all border ${
                  isSelected
                    ? 'border-slate-900 bg-slate-50 shadow-sm'
                    : 'border-transparent hover:border-slate-200 hover:bg-slate-50/60'
                }`}
              >
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5">
                    <span className="font-semibold text-slate-800">{theme.label}</span>
                    {theme.category === 'safety' && (
                      <span className="rounded bg-amber-100 px-1.5 py-0.2 text-[9px] font-bold text-amber-800">
                        Subjective
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 font-mono text-slate-600">
                    <span className="font-bold text-slate-900">{theme.negativeCount}</span>
                    <span className="text-[11px] text-slate-400">
                      ({theme.frequencyPercentage}%)
                    </span>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-slate-100">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${barColor}`}
                    style={{ width: `${barWidth}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected Theme Evidence Drawer */}
        <div className="lg:col-span-6 rounded-xl border border-slate-200 bg-slate-50/80 p-4">
          {activeTheme ? (
            <div>
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-slate-900">
                    {activeTheme.label}
                  </h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {activeTheme.description}
                  </p>
                </div>
                <span
                  className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold ${
                    activeTheme.severity === 'high'
                      ? 'bg-rose-100 text-rose-800'
                      : activeTheme.severity === 'medium'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-teal-100 text-teal-800'
                  }`}
                >
                  {activeTheme.negativeCount} Negative Citation(s)
                </span>
              </div>

              {activeTheme.category === 'safety' && (
                <div className="mt-3 rounded-lg bg-amber-50 p-2.5 text-xs text-amber-800 border border-amber-200 flex items-start gap-2">
                  <ShieldAlert className="h-4 w-4 shrink-0 text-amber-600 mt-0.5" />
                  <p>
                    <strong>Subjective Feedback Disclaimer:</strong> Mentions in this category represent individual reviewer observations (e.g. evening lighting, street presence). These are unverified public assertions and do not represent verified safety findings or official municipal audits.
                  </p>
                </div>
              )}

              {/* Citations List */}
              <div className="mt-3 space-y-2.5">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                  Representative Source Citations:
                </span>
                {activeTheme.representativeSnippets.length === 0 ? (
                  <div className="rounded-lg border border-dashed border-slate-200 p-4 text-center text-xs text-slate-500">
                    No negative quotes detected for this category in the current sample.
                  </div>
                ) : (
                  activeTheme.representativeSnippets.map((snippet, idx) => (
                    <div
                      key={idx}
                      className="rounded-lg border border-slate-200 bg-white p-3 shadow-xs text-xs"
                    >
                      <div className="flex items-center justify-between text-[11px] text-slate-500 pb-1.5 border-b border-slate-100">
                        <span className="font-semibold text-slate-800 truncate">
                          {snippet.placeTitle}
                        </span>
                        <span>{snippet.author}</span>
                      </div>
                      <blockquote className="mt-2 text-slate-700 italic leading-relaxed">
                        “{snippet.text}”
                      </blockquote>
                    </div>
                  ))
                )}
              </div>
            </div>
          ) : (
            <div className="text-center text-xs text-slate-500 py-10">
              Select a theme on the left to inspect verbatim reviewer citations.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
