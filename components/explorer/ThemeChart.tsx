'use client';

import React, { useState } from 'react';
import { ThemeAggregate } from '@/lib/types';
import { ShieldAlert, Quote, Info, AlertCircle } from 'lucide-react';

interface ThemeChartProps {
  themes: ThemeAggregate[];
  totalReviewsAnalyzed: number;
  dataSource?: 'live_serpapi' | 'cached_serpapi' | 'illustrative_sample';
}

export function ThemeChart({ themes, totalReviewsAnalyzed, dataSource }: ThemeChartProps) {
  const [selectedThemeCategory, setSelectedThemeCategory] = useState<string | null>(
    themes[0]?.category || null
  );

  const activeTheme = themes.find((t) => t.category === selectedThemeCategory) || themes[0];
  const totalNegativeCount = themes.reduce((sum, t) => sum + t.negativeCount, 0);

  return (
    <div className="rounded-2xl border border-[#E8E6DF] bg-white p-5 sm:p-6 shadow-2xs">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-[#F0EEE6] pb-4">
        <div>
          <h3 className="font-serif text-lg sm:text-xl font-bold text-[#121518] flex items-center gap-2">
            <span>
              {dataSource === 'illustrative_sample'
                ? 'Demonstration Review Friction Telemetry'
                : 'Public Review Friction Telemetry'}
            </span>
            {dataSource === 'illustrative_sample' && (
              <span className="rounded bg-amber-100 px-2 py-0.5 font-mono text-[10px] font-bold text-amber-900 border border-amber-300 uppercase tracking-wider">
                Demo Sample
              </span>
            )}
          </h3>
          <p className="text-xs text-[#6B7280] mt-0.5 font-medium">
            {dataSource === 'illustrative_sample'
              ? `Illustrative dissatisfaction themes extracted from ${totalReviewsAnalyzed} calibrated demonstration review excerpts (Demo Mode)`
              : `Recurring dissatisfaction themes extracted from ${totalReviewsAnalyzed} sampled public Google reviews (unverified online feedback)`}
          </p>
        </div>

        <div className="flex items-center gap-3 text-xs text-[#6B7280]">
          <span className="flex items-center gap-1.5 font-medium">
            <span className="h-2 w-2 rounded-full bg-rose-500" />
            <span>High Severity</span>
          </span>
          <span className="flex items-center gap-1.5 font-medium">
            <span className="h-2 w-2 rounded-full bg-amber-500" />
            <span>Moderate Friction</span>
          </span>
        </div>
      </div>

      {/* Meaningful empty state: sampled reviews analyzed but zero negative complaints matched */}
      {totalReviewsAnalyzed > 0 && totalNegativeCount === 0 && (
        <div className="mt-4 rounded-xl border border-stone-200 bg-stone-50 p-4 text-xs text-stone-700 flex items-start gap-2.5">
          <Info className="h-4 w-4 shrink-0 text-stone-500 mt-0.5" />
          <div className="space-y-1">
            <p className="font-semibold text-stone-900">
              No matching negative themes detected in the {totalReviewsAnalyzed} sampled reviews. This does not establish that the properties are complaint-free.
            </p>
            <p className="text-[11px] text-stone-600 leading-relaxed">
              Discovered public feedback did not contain recurring complaints matching the 9 tracked operational categories. Further on-the-ground surveys are recommended.
            </p>
          </div>
        </div>
      )}

      {/* Meaningful empty state: zero reviews available in search perimeter */}
      {totalReviewsAnalyzed === 0 && (
        <div className="mt-4 rounded-xl border border-dashed border-stone-300 bg-stone-50/80 p-4 text-xs text-stone-700 flex items-start gap-2.5">
          <AlertCircle className="h-4 w-4 shrink-0 text-stone-400 mt-0.5" />
          <div className="space-y-1">
            <p className="font-semibold text-stone-900">
              No public review text available in the sampled properties within this search perimeter.
            </p>
            <p className="text-[11px] text-stone-600 leading-relaxed">
              Discovered accommodations currently have zero sampled text reviews or rely primarily on offline word-of-mouth. Friction telemetry cannot be evaluated without online review content.
            </p>
          </div>
        </div>
      )}

      {/* Main theme progress bars */}
      <div className="mt-5 grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-6 space-y-2">
          {themes.map((theme) => {
            const isSelected = selectedThemeCategory === theme.category;
            const barWidth =
              theme.negativeCount === 0 || theme.frequencyPercentage === 0
                ? 0
                : Math.min(100, Math.max(2, theme.frequencyPercentage * 2.2));

            const barColor =
              theme.severity === 'high'
                ? 'bg-rose-500'
                : theme.severity === 'medium'
                ? 'bg-amber-500'
                : 'bg-[#0C4A44]';

            return (
              <div
                key={theme.category}
                onClick={() => setSelectedThemeCategory(theme.category)}
                className={`cursor-pointer rounded-xl p-3 transition-all border ${
                  isSelected
                    ? 'border-[#121518] bg-[#F6F5F0] shadow-xs'
                    : 'border-transparent hover:border-[#D5D1C5] hover:bg-[#FBFBFA]'
                }`}
              >
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-[#121518]">{theme.label}</span>
                    {theme.category === 'safety' && (
                      <span className="rounded bg-amber-100 px-1.5 py-0.5 text-[9px] font-bold text-amber-900 border border-amber-300/60 uppercase tracking-wider">
                        Subjective
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 font-mono text-[#4B5563]">
                    <span className="font-bold text-[#121518]">{theme.negativeCount}</span>
                    <span className="text-[11px] text-[#9CA3AF]">
                      ({theme.frequencyPercentage}%)
                    </span>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-[#E5E3DC]">
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
        <div className="lg:col-span-6 rounded-xl border border-[#E8E6DF] bg-[#FBFBFA] p-4 sm:p-5">
          {activeTheme ? (
            <div>
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h4 className="font-serif text-base font-bold text-[#121518]">
                    {activeTheme.label}
                  </h4>
                  <p className="text-xs text-[#6B7280] mt-0.5 leading-relaxed font-medium">
                    {activeTheme.description}
                  </p>
                </div>
                <span
                  className={`rounded-full px-2.5 py-0.5 text-[11px] font-mono font-bold shrink-0 ${
                    activeTheme.severity === 'high'
                      ? 'bg-rose-50 text-rose-800 border border-rose-200'
                      : activeTheme.severity === 'medium'
                      ? 'bg-amber-50 text-amber-800 border border-amber-200'
                      : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                  }`}
                >
                  {activeTheme.negativeCount} Citation(s)
                </span>
              </div>

              {activeTheme.category === 'safety' && (
                <div className="mt-3.5 rounded-lg bg-amber-50/90 p-3 text-xs text-amber-900 border border-amber-200/80 flex items-start gap-2">
                  <ShieldAlert className="h-4 w-4 shrink-0 text-amber-700 mt-0.5" />
                  <p className="text-[11px] leading-relaxed">
                    <strong>Subjective Feedback Disclaimer:</strong> Mentions represent individual reviewer impressions (e.g. evening lighting, street presence). These are unverified public assertions from online reviews and do not represent confirmed resident testimony or official municipal audits.
                  </p>
                </div>
              )}

              {/* Citations List */}
              <div className="mt-4 space-y-2.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#9CA3AF]">
                  {dataSource === 'illustrative_sample'
                    ? 'Representative Demonstration Review Excerpts:'
                    : 'Representative Public Review Excerpts:'}
                </span>
                {activeTheme.representativeSnippets.length === 0 ? (
                  <div className="rounded-xl border border-dashed border-[#D5D1C5] p-5 text-center text-xs text-[#6B7280]">
                    {totalReviewsAnalyzed === 0
                      ? 'No public reviews were available to evaluate for this category in the current search perimeter.'
                      : totalNegativeCount === 0
                      ? `No matching negative quotes detected for ${activeTheme.label} across the ${totalReviewsAnalyzed} sampled reviews.`
                      : `No negative quotes detected for ${activeTheme.label} in the current sample.`}
                  </div>
                ) : (
                  activeTheme.representativeSnippets.map((snippet, idx) => (
                    <div
                      key={idx}
                      className="rounded-xl border border-[#E8E6DF] bg-white p-3.5 shadow-2xs text-xs"
                    >
                      <div className="flex items-start gap-2 text-[#374151] italic leading-relaxed">
                        <Quote className="h-3.5 w-3.5 shrink-0 text-[#9CA3AF] mt-0.5 rotate-180" />
                        <span>&ldquo;{snippet.text}&rdquo;</span>
                      </div>
                      <div className="mt-2 flex items-center justify-between text-[11px] text-[#6B7280] pt-2 border-t border-[#F0EEE6]">
                        <span className="font-semibold text-[#121518]">
                          {snippet.placeTitle}
                        </span>
                        <span className="font-mono text-[10px] text-stone-500">
                          {snippet.author} {snippet.date ? `• ${snippet.date}` : ''}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          ) : (
            <div className="text-center text-xs text-[#6B7280] py-8">
              Select a friction theme to inspect supporting review snippets.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
