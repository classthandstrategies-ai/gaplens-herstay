'use client';

import React from 'react';
import { AnalysisReport } from '@/lib/types';
import { formatStraightLineDistance } from '@/lib/geo/distance';
import {
  Target,
  CheckCircle,
  ExternalLink,
  ShieldCheck,
  MapPin,
  Printer,
  Compass,
  Info,
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

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      {/* Report Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="rounded bg-teal-50 px-2.5 py-1 text-xs font-bold text-teal-800 border border-teal-200 uppercase tracking-wide">
              Market Intelligence Dossier
            </span>
            <span className="text-xs text-slate-500">
              Retrieved {new Date(report.retrievedAt).toLocaleDateString()} at{' '}
              {new Date(report.retrievedAt).toLocaleTimeString()}
            </span>
          </div>
          <h1 className="mt-2 text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
            {hub.name} Accommodation Opportunity Report
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            Evaluated within a {report.radiusKm} km straight-line radius around {hub.landmark},{' '}
            {hub.cityName}.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onNavigateToExplorer}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-700 shadow-xs hover:bg-slate-50"
          >
            <Compass className="h-4 w-4" />
            <span>Market Map</span>
          </button>
          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 rounded-lg bg-slate-900 px-3 py-2 text-xs font-semibold text-white shadow-xs hover:bg-slate-800"
          >
            <Printer className="h-4 w-4" />
            <span>Print Dossier</span>
          </button>
        </div>
      </div>

      {/* Partial Coverage Alert */}
      {report.searchCoverage === 'partial' && (
        <div className="rounded-xl border border-amber-300 bg-amber-50 p-4 text-xs text-amber-900 shadow-xs flex items-start gap-3">
          <Info className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold">Partial Search Coverage Alert:</span>{' '}
            <span>
              {report.partialCoverageNote ||
                'One or more targeted search queries failed during data retrieval. Market results reflect partial coverage rather than a complete search scan.'}
            </span>
          </div>
        </div>
      )}

      {/* Primary Thesis / Executive Hypothesis Box */}
      <div
        data-tour="report-hypothesis"
        className="rounded-2xl border-2 border-teal-600/30 bg-gradient-to-br from-teal-50/50 via-white to-slate-50 p-6 shadow-sm"
      >
        <div className="flex items-center gap-2 text-teal-800 font-bold text-xs uppercase tracking-wider">
          <Target className="h-4 w-4 text-teal-600" />
          <span>Core Opportunity Hypothesis</span>
          <ContextualHelp
            title="Market Opportunity Hypothesis"
            content="A directional synthesis of supply concentration, geographical proximity, and recurring tenant friction. Serves as an empirical baseline requiring on-the-ground validation before capital deployment."
          />
        </div>
        <h2 className="mt-2 text-xl sm:text-2xl font-bold text-slate-900 leading-snug">
          {opportunityHypothesis.headline}
        </h2>
        <p className="mt-3 text-sm text-slate-700 leading-relaxed">
          {opportunityHypothesis.summary}
        </p>

        {/* Actionable Strategy Points */}
        <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-3 pt-4 border-t border-teal-100">
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
              Empirical Market Friction Signals
            </h4>
            <ul className="space-y-1.5 text-xs text-slate-700">
              {opportunityHypothesis.actionableInsights.map((insight, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-teal-600 font-bold mt-0.5">•</span>
                  <span>{insight}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
              Recommended Operator Focus Areas
            </h4>
            <ul className="space-y-1.5 text-xs text-slate-700">
              {opportunityHypothesis.recommendedFocusAreas.map((area, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <CheckCircle className="h-3.5 w-3.5 text-teal-600 shrink-0 mt-0.5" />
                  <span>{area}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Target Spatial Pockets Analysis */}
      <div>
        <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <MapPin className="h-5 w-5 text-teal-600" />
          <span>Spatial Supply Pockets & Geographic Distribution</span>
        </h3>
        <p className="text-xs text-slate-500 mt-0.5">
          Evaluating straight-line accessibility relative to major entrance gates of {hub.name}
        </p>

        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
          {opportunityHypothesis.targetPockets.map((pocket, idx) => (
            <div
              key={idx}
              className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs"
            >
              <div className="text-xs font-semibold text-teal-700">
                {pocket.distanceBand}
              </div>
              <h4 className="mt-1 font-bold text-slate-900 text-sm">{pocket.name}</h4>
              <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                {pocket.observation}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Evidence Base Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Recurring Complaint Severity Matrix */}
        <div className="lg:col-span-2 rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
          <h3 className="text-base font-bold text-slate-900">
            Tenant Complaint Severity Matrix
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Frequency of recurring dissatisfaction themes in public Google reviews
          </p>

          <div className="mt-4 space-y-3">
            {themeBreakdown.slice(0, 6).map((theme) => (
              <div
                key={theme.category}
                className="flex items-center justify-between border-b border-slate-100 pb-2.5 text-xs"
              >
                <div>
                  <div className="font-semibold text-slate-800">{theme.label}</div>
                  <div className="text-[11px] text-slate-500 line-clamp-1">
                    {theme.impactSummary}
                  </div>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span
                    className={`rounded-md px-2 py-0.5 text-[10px] font-bold ${
                      theme.severity === 'high'
                        ? 'bg-rose-100 text-rose-800'
                        : theme.severity === 'medium'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    {theme.negativeCount} reports
                  </span>
                  <span className="font-mono text-slate-600 font-medium">
                    {theme.frequencyPercentage}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right 1 Col: Evidence Confidence & Coverage */}
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-5 shadow-xs flex flex-col justify-between">
          <div>
            <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-teal-600" />
              <span>Evidence Strength</span>
            </h4>
            <div className="mt-3">
              <div className="text-xs text-slate-500 font-medium">Confidence Level</div>
              <div className="mt-1 text-lg font-bold capitalize text-slate-900">
                {metrics.evidenceConfidence}
              </div>
              <p className="mt-1 text-xs text-slate-600 leading-relaxed">
                {metrics.confidenceReason}
              </p>
            </div>

            <div className="mt-4 pt-4 border-t border-slate-200/80 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Data Source:</span>
                <span className="font-semibold text-slate-800 capitalize">
                  {report.dataSource.replace('_', ' ')}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Discovered Units:</span>
                <span className="font-semibold text-slate-800">
                  {metrics.listingsInRadius}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Properties with Reviews:</span>
                <span className="font-semibold text-slate-800">
                  {metrics.listingsWithReviewsCount} of {metrics.listingsInRadius}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Total Reviews Analyzed:</span>
                <span className="font-semibold text-slate-800">
                  {metrics.totalReviewsAnalyzed}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Avg Rating (Rated Stays):</span>
                <span className="font-semibold text-slate-800">
                  {metrics.averageRating !== null ? `★ ${metrics.averageRating}` : 'N/A'}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-6 rounded-lg bg-white p-3 border border-slate-200 text-[11px] text-slate-500">
            Powered by <strong>SerpApi Google Maps & Reviews API</strong> with server-side deduplication.
          </div>
        </div>
      </div>

      {/* Discovered Accommodations Matrix */}
      <div>
        <h3 className="text-lg font-bold text-slate-900">
          Discovered Competing Properties ({listings.length})
        </h3>
        <p className="text-xs text-slate-500 mt-0.5">
          Public accommodations detected within the selected straight-line perimeter
        </p>

        <div className="mt-4 overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-xs">
          <table className="min-w-full divide-y divide-slate-200 text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-semibold">
              <tr>
                <th className="px-4 py-3">Property Name</th>
                <th className="px-4 py-3">Straight-line Dist.</th>
                <th className="px-4 py-3">Public Rating</th>
                <th className="px-4 py-3">Reviews</th>
                <th className="px-4 py-3">Identified Friction</th>
                <th className="px-4 py-3 text-right">Source</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {listings.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="px-4 py-3">
                    <div className="font-semibold text-slate-900">{item.title}</div>
                    <div className="text-[11px] text-slate-500 truncate max-w-xs">
                      {item.address}
                    </div>
                  </td>
                  <td className="px-4 py-3 font-medium text-teal-700">
                    {formatStraightLineDistance(item.distanceKm)}
                  </td>
                  <td className="px-4 py-3">
                    {item.rating !== null ? (
                      <span className="inline-flex items-center gap-1 font-semibold text-slate-900">
                        ★ {item.rating.toFixed(1)}
                      </span>
                    ) : (
                      <span className="text-[11px] text-slate-400 font-medium">Unrated</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-slate-600">{item.reviewCount}</td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      {item.dominantComplaints && item.dominantComplaints.length > 0 ? (
                        item.dominantComplaints.map((c) => (
                          <span
                            key={c}
                            className="rounded bg-rose-50 px-1.5 py-0.5 text-[10px] font-medium text-rose-700"
                          >
                            {c}
                          </span>
                        ))
                      ) : (
                        <span className="text-[11px] text-slate-400">No major clusters</span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right">
                    {item.link ? (
                      <a
                        href={item.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-teal-700 hover:underline font-medium"
                      >
                        <span>View</span>
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    ) : (
                      <span className="text-slate-400">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Limitations and Disclaimers Section */}
      <div className="rounded-xl border border-slate-200 bg-slate-50 p-5 text-xs text-slate-600 space-y-2">
        <h4 className="font-bold text-slate-900 flex items-center gap-2">
          <Info className="h-4 w-4 text-slate-500" />
          <span>Methodology Scope & Disclaimers</span>
        </h4>
        <ul className="list-disc pl-5 space-y-1 leading-relaxed">
          {report.limitations.map((lim, idx) => (
            <li key={idx}>{lim}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
