'use client';

import React from 'react';
import { AnalysisReport } from '@/lib/types';
import { formatStraightLineDistance } from '@/lib/geo/distance';
import {
  CheckCircle2,
  ExternalLink,
  ShieldCheck,
  Printer,
  Compass,
  AlertTriangle,
  Info,
  Building2,
  TrendingUp,
} from 'lucide-react';
import { ContextualHelp } from '@/components/onboarding/ContextualHelp';

interface OpportunityReportViewProps {
  report: AnalysisReport;
  onNavigateToExplorer: () => void;
}

export function OpportunityReportView({
  report,
  onNavigateToExplorer,
}: OpportunityReportViewProps) {
  const { hub, metrics, opportunityHypothesis, themeBreakdown, listings } = report;

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  const confidenceBadgeColor =
    metrics.evidenceConfidence === 'high'
      ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
      : metrics.evidenceConfidence === 'moderate'
      ? 'bg-teal-50 text-teal-800 border-teal-300'
      : metrics.evidenceConfidence === 'cautious'
      ? 'bg-amber-50 text-amber-800 border-amber-300'
      : 'bg-rose-50 text-rose-800 border-rose-300';

  return (
    <article className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8 space-y-8 print:p-0 print:space-y-6">
      {/* 1. DOSSIER CLASSIFICATION MASTHEAD */}
      <header className="border-b border-stone-200 pb-6 print:pb-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="rounded-md bg-stone-900 px-2.5 py-1 font-mono text-[11px] font-bold text-white uppercase tracking-widest">
              Market Intelligence Dossier
            </span>
            <span className="font-mono text-xs text-stone-500">
              Corridor Ref: {hub.id.toUpperCase()}
            </span>
          </div>

          <div className="flex items-center gap-2 print:hidden">
            <button
              onClick={onNavigateToExplorer}
              className="inline-flex items-center gap-1.5 rounded-xl border border-stone-300 bg-white px-3.5 py-2 text-xs font-semibold text-stone-700 shadow-2xs hover:bg-stone-50 transition-colors cursor-pointer"
            >
              <Compass className="h-4 w-4 text-teal-700" />
              <span>Interactive Map</span>
            </button>
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 rounded-xl bg-stone-900 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-stone-800 transition-colors cursor-pointer"
            >
              <Printer className="h-4 w-4 text-stone-300" />
              <span>Print Dossier</span>
            </button>
          </div>
        </div>

        <div className="mt-4">
          <h1 className="font-serif text-3xl sm:text-4xl font-extrabold tracking-tight text-stone-900 leading-tight">
            {hub.name} Accommodation Opportunity Briefing
          </h1>
          <p className="mt-1.5 text-sm sm:text-base text-stone-600 font-sans">
            Spatial distribution, supply saturation, and recurring tenant friction within a{' '}
            <strong className="font-mono text-stone-800">{report.radiusKm} km</strong> Haversine straight-line radius of{' '}
            <span className="text-stone-800">{hub.landmark}</span>, {hub.cityName}.
          </p>
        </div>

        {/* Telemetry pill row */}
        <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-stone-500 font-mono">
          <div>
            Retrieved:{' '}
            <span className="font-semibold text-stone-700">
              {new Date(report.retrievedAt).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              })}
            </span>
          </div>
          <div>
            Data Engine:{' '}
            <span className="font-semibold text-stone-700">
              SerpApi Google Maps & Reviews
            </span>
          </div>
          <div>
            Evidence Grade:{' '}
            <span className={`px-1.5 py-0.2 rounded font-bold uppercase ${confidenceBadgeColor}`}>
              {metrics.evidenceConfidence}
            </span>
          </div>
        </div>
      </header>

      {/* Partial Coverage Notice if applicable */}
      {report.searchCoverage === 'partial' && (
        <section aria-label="Partial search coverage notice" className="rounded-2xl border border-amber-300 bg-amber-50/90 p-4 text-xs text-amber-900 shadow-2xs flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold">Partial Search Coverage Alert:</span>{' '}
            <span className="text-amber-800">
              {report.partialCoverageNote ||
                'One or more targeted queries failed during data retrieval. Market results reflect partial coverage rather than a complete search scan.'}
            </span>
          </div>
        </section>
      )}

      {/* 2. CORE EXECUTIVE HYPOTHESIS (data-tour="report-hypothesis") */}
      <section
        data-tour="report-hypothesis"
        aria-label="Core opportunity hypothesis and strategic takeaways"
        className="rounded-3xl border border-stone-300 bg-white p-6 sm:p-8 shadow-xs"
      >
        <div className="flex items-center gap-2">
          <span className="rounded-md bg-stone-100 px-2 py-0.5 font-mono text-[10px] font-bold text-stone-700 uppercase tracking-widest border border-stone-200">
            Synthesis Thesis
          </span>
          <ContextualHelp
            title="Opportunity Hypothesis Methodology"
            content="A directional synthesis combining observed supply clusters, distance decay, and recurring tenant complaints. Serves as an analytical starting hypothesis requiring field validation."
          />
        </div>

        <h2 className="mt-3 font-serif text-2xl sm:text-3xl font-bold text-stone-900 leading-snug">
          {opportunityHypothesis.headline}
        </h2>

        <p className="mt-3 text-sm sm:text-base text-stone-700 leading-relaxed font-sans">
          {opportunityHypothesis.summary}
        </p>

        {/* 2-Pillar Matrix: Observed Telemetry vs Directional Hypotheses */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-stone-200">
          {/* Pillar 1: Empirically Observed Search Telemetry */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-stone-900 font-serif font-bold text-base">
              <Building2 className="h-4 w-4 text-teal-700" />
              <span>Empirically Observed Telemetry</span>
            </div>
            <p className="text-xs text-stone-500">
              Directly grounded in retrieved SerpApi listings and public review text.
            </p>
            <ul className="space-y-2 text-xs text-stone-700 pt-1">
              {opportunityHypothesis.actionableInsights.map((insight, idx) => (
                <li key={idx} className="flex items-start gap-2.5">
                  <span className="font-mono text-teal-700 font-bold mt-0.5">•</span>
                  <span className="leading-relaxed">{insight}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Pillar 2: Directional Operator Hypotheses */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-stone-900 font-serif font-bold text-base">
              <TrendingUp className="h-4 w-4 text-teal-700" />
              <span>Directional Operator Hypotheses</span>
            </div>
            <p className="text-xs text-stone-500">
              Commercial recommendations requiring on-the-ground field verification.
            </p>
            <ul className="space-y-2 text-xs text-stone-700 pt-1">
              {opportunityHypothesis.recommendedFocusAreas.map((area, idx) => (
                <li key={idx} className="flex items-start gap-2.5">
                  <CheckCircle2 className="h-4 w-4 text-teal-700 shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{area}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* 3. SPATIAL ACCESS GRADIENTS (TABLE/MATRIX VIEW) */}
      <section aria-label="Spatial supply pockets and distance gradients">
        <div className="flex items-baseline justify-between">
          <div>
            <h3 className="font-serif text-xl sm:text-2xl font-bold text-stone-900">
              Spatial Supply Pockets & Distance Gradients
            </h3>
            <p className="text-xs text-stone-500 mt-1">
              Concentration of discovered accommodations mapped against Haversine straight-line distance bands
            </p>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
          {opportunityHypothesis.targetPockets.map((pocket, idx) => (
            <div
              key={idx}
              className="rounded-2xl border border-stone-200 bg-white p-5 shadow-2xs hover:border-stone-300 transition-colors"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-teal-800">
                  {pocket.distanceBand}
                </span>
                <span className="font-mono text-[10px] text-stone-400 uppercase">
                  Pocket 0{idx + 1}
                </span>
              </div>
              <h4 className="mt-2 font-serif text-base font-bold text-stone-900">
                {pocket.name}
              </h4>
              <p className="mt-2 text-xs text-stone-600 leading-relaxed font-sans">
                {pocket.observation}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 4. EVIDENCE RIGOR & RECURRING TENANT FRICTION */}
      <section aria-label="Evidence coverage and dissatisfaction severity matrix" className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 7 Cols: Tenant Complaint Severity Ledger */}
        <div className="lg:col-span-7 rounded-2xl border border-stone-200 bg-white p-5 sm:p-6 shadow-2xs">
          <div className="flex items-baseline justify-between">
            <h3 className="font-serif text-lg font-bold text-stone-900">
              Public Review Dissatisfaction Matrix
            </h3>
            <span className="font-mono text-[11px] text-stone-500">
              {metrics.totalReviewsAnalyzed} reviews evaluated
            </span>
          </div>
          <p className="text-xs text-stone-500 mt-0.5">
            Recurrence and severity of tenant pain points in public Google Maps reviews
          </p>

          <div className="mt-4 divide-y divide-stone-100">
            {themeBreakdown.slice(0, 6).map((theme) => (
              <div
                key={theme.category}
                className="py-3 flex items-start justify-between gap-4 text-xs"
              >
                <div className="space-y-0.5">
                  <div className="font-semibold text-stone-900">{theme.label}</div>
                  <div className="text-[11px] text-stone-500 line-clamp-1">
                    {theme.impactSummary}
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <span
                    className={`rounded-md px-2 py-0.5 font-mono text-[10px] font-bold ${
                      theme.severity === 'high'
                        ? 'bg-rose-100 text-rose-800'
                        : theme.severity === 'medium'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-stone-100 text-stone-700'
                    }`}
                  >
                    {theme.negativeCount} reports
                  </span>
                  <span className="font-mono text-stone-600 font-semibold w-10 text-right">
                    {theme.frequencyPercentage}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right 5 Cols: Evidence Strength & Confidence Card */}
        <div className="lg:col-span-5 rounded-2xl border border-stone-200 bg-stone-50/80 p-5 sm:p-6 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-stone-900 font-serif font-bold text-base">
              <ShieldCheck className="h-4 w-4 text-teal-700" />
              <span>Evidence Strength & Provenance</span>
            </div>

            <div className="mt-4 space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] font-semibold text-stone-500 uppercase tracking-wider">
                  Confidence Grade
                </span>
                <span
                  className={`rounded-md border px-2 py-0.5 font-mono text-xs font-bold uppercase ${confidenceBadgeColor}`}
                >
                  {metrics.evidenceConfidence}
                </span>
              </div>
              <p className="text-xs text-stone-600 mt-2 leading-relaxed font-sans">
                {metrics.confidenceReason}
              </p>
            </div>

            {/* Structured telemetry ledger */}
            <div className="mt-5 pt-4 border-t border-stone-200 space-y-2 font-mono text-xs">
              <div className="flex justify-between">
                <span className="text-stone-500">Data Source:</span>
                <span className="font-semibold text-stone-800 uppercase">
                  {report.dataSource.replace('_', ' ')}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Discovered Units:</span>
                <span className="font-semibold text-stone-800">
                  {metrics.listingsInRadius}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Units with Public Reviews:</span>
                <span className="font-semibold text-stone-800">
                  {metrics.listingsWithReviewsCount} / {metrics.listingsInRadius}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Reviews Analyzed:</span>
                <span className="font-semibold text-stone-800">
                  {metrics.totalReviewsAnalyzed}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Avg Rating (Rated Units):</span>
                <span className="font-semibold text-stone-800">
                  {metrics.averageRating !== null ? `★ ${metrics.averageRating}` : 'N/A'}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-6 rounded-xl bg-white p-3 border border-stone-200 text-[11px] text-stone-500 leading-relaxed font-sans">
            Grounded in actual <strong>SerpApi Google Maps & Reviews</strong> response payloads with deduplication and unpenalized missing ratings.
          </div>
        </div>
      </section>

      {/* 5. DISCOVERED ACCOMMODATIONS LEDGER TABLE */}
      <section aria-label="Discovered accommodation inventory ledger">
        <div className="flex items-baseline justify-between">
          <div>
            <h3 className="font-serif text-xl sm:text-2xl font-bold text-stone-900">
              Discovered Competing Accommodations ({listings.length})
            </h3>
            <p className="text-xs text-stone-500 mt-1">
              Public listings discovered within the active {report.radiusKm} km straight-line perimeter
            </p>
          </div>
        </div>

        <div className="mt-4 overflow-x-auto rounded-2xl border border-stone-200 bg-white shadow-2xs">
          <table className="min-w-full divide-y divide-stone-200 text-left text-xs">
            <thead className="bg-stone-50 font-mono text-[11px] text-stone-600 uppercase tracking-wider">
              <tr>
                <th scope="col" className="px-4 py-3 font-semibold">Accommodation</th>
                <th scope="col" className="px-4 py-3 font-semibold">Straight-line Dist.</th>
                <th scope="col" className="px-4 py-3 font-semibold">Public Rating</th>
                <th scope="col" className="px-4 py-3 font-semibold">Reviews</th>
                <th scope="col" className="px-4 py-3 font-semibold">Identified Friction Themes</th>
                <th scope="col" className="px-4 py-3 font-semibold text-right">Maps Link</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 text-stone-700">
              {listings.map((item) => (
                <tr key={item.id} className="hover:bg-stone-50/70 transition-colors">
                  <td className="px-4 py-3">
                    <div className="font-semibold text-stone-900">{item.title}</div>
                    <div className="text-[11px] text-stone-500 truncate max-w-xs">
                      {item.address}
                    </div>
                  </td>
                  <td className="px-4 py-3 font-mono font-medium text-teal-800">
                    {formatStraightLineDistance(item.distanceKm)}
                  </td>
                  <td className="px-4 py-3 font-mono">
                    {item.rating !== null ? (
                      <span className="inline-flex items-center gap-1 font-semibold text-stone-900">
                        ★ {item.rating.toFixed(1)}
                      </span>
                    ) : (
                      <span className="text-[11px] text-stone-400">Unrated</span>
                    )}
                  </td>
                  <td className="px-4 py-3 font-mono text-stone-600">{item.reviewCount}</td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      {item.dominantComplaints && item.dominantComplaints.length > 0 ? (
                        item.dominantComplaints.map((c) => (
                          <span
                            key={c}
                            className="rounded bg-rose-50 px-1.5 py-0.5 font-mono text-[10px] font-medium text-rose-800 border border-rose-200"
                          >
                            {c}
                          </span>
                        ))
                      ) : (
                        <span className="text-[11px] text-stone-400">No major themes</span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right">
                    {item.link ? (
                      <a
                        href={item.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 font-semibold text-teal-800 hover:text-teal-900 hover:underline"
                      >
                        <span>View</span>
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    ) : (
                      <span className="text-stone-400">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* 6. METHODOLOGY SCOPE & GOVERNANCE DISCLAIMERS */}
      <footer className="rounded-2xl border border-stone-200 bg-stone-50/90 p-5 sm:p-6 text-xs text-stone-600 space-y-2.5">
        <h4 className="font-serif font-bold text-stone-900 flex items-center gap-2 text-sm">
          <Info className="h-4 w-4 text-stone-500" />
          <span>Research Methodology Scope & Governance Limitations</span>
        </h4>
        <ul className="list-disc pl-5 space-y-1.5 leading-relaxed font-sans">
          {report.limitations.map((lim, idx) => (
            <li key={idx}>{lim}</li>
          ))}
        </ul>
      </footer>
    </article>
  );
}
