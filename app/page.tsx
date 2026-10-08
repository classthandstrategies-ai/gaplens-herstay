'use client';

import React, { useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { LandingHero } from '@/components/landing/LandingHero';
import { MarketExplorer } from '@/components/explorer/MarketExplorer';
import { OpportunityReportView } from '@/components/report/OpportunityReportView';
import { MethodologyView } from '@/components/methodology/MethodologyView';
import { AnalysisReport, AnalysisResponseEnvelope } from '@/lib/types';
import { getDefaultHub, getHubById } from '@/lib/markets/data';
import { getSampleListingsForHub } from '@/lib/sample/sampleData';
import { buildAnalysisReport } from '@/lib/analysis/gapEngine';
import { isWithinRadius } from '@/lib/geo/distance';
import { AlertCircle, ExternalLink } from 'lucide-react';

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<'explorer' | 'report' | 'methodology'>('explorer');
  const [report, setReport] = useState<AnalysisReport>(() => {
    const defaultHub = getDefaultHub();
    const sampleListings = getSampleListingsForHub(defaultHub).filter((l) =>
      isWithinRadius(defaultHub.coordinates, l.coordinates, defaultHub.defaultRadiusKm)
    );
    return buildAnalysisReport(
      defaultHub,
      defaultHub.defaultRadiusKm,
      sampleListings,
      'illustrative_sample'
    );
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [statusNotice, setStatusNotice] = useState<{
    type: 'info' | 'warning' | 'error';
    message: string;
  } | null>(null);

  // Trigger analysis for a hub and radius
  const handleRunAnalysis = async (hubId: string, radiusKm: number) => {
    setIsLoading(true);
    setStatusNotice(null);

    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ hubId, radiusKm }),
      });

      const envelope: AnalysisResponseEnvelope = await res.json();

      if (envelope.success && envelope.data) {
        setReport(envelope.data);
        if (envelope.code === 'KEY_MISSING') {
          setStatusNotice({
            type: 'info',
            message:
              'Showing calibrated illustrative sample data for this hub. To run live public Google Maps & Reviews searches, add SERPAPI_API_KEY to your environment.',
          });
        } else if (envelope.code === 'NETWORK_ERROR') {
          setStatusNotice({
            type: 'warning',
            message: envelope.error || 'Live search encountered an issue; displaying baseline data.',
          });
        } else {
          setStatusNotice({
            type: 'info',
            message: `Successfully retrieved ${envelope.data.metrics.listingsInRadius} listings using SerpApi.`,
          });
        }
      } else {
        setStatusNotice({
          type: 'error',
          message: envelope.error || 'Failed to complete analysis.',
        });
      }
    } catch (err: unknown) {
      console.error('Failed to run analysis:', err);
      // Fallback locally
      const targetHub = getHubById(hubId) || getDefaultHub();
      const sampleListings = getSampleListingsForHub(targetHub).filter((l) =>
        isWithinRadius(targetHub.coordinates, l.coordinates, radiusKm)
      );
      const fallbackReport = buildAnalysisReport(
        targetHub,
        radiusKm,
        sampleListings,
        'illustrative_sample'
      );
      setReport(fallbackReport);
      setStatusNotice({
        type: 'warning',
        message: 'Network error communicating with analysis endpoint. Showing local illustrative data.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectHubFromHero = (hubId: string) => {
    const hub = getHubById(hubId);
    if (hub) {
      handleRunAnalysis(hub.id, hub.defaultRadiusKm);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      {/* Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        dataSource={report.dataSource}
      />

      {/* Optional Notification Toast */}
      {statusNotice && (
        <div
          className={`border-b px-4 py-2.5 text-xs font-medium transition-all ${
            statusNotice.type === 'error'
              ? 'bg-rose-50 border-rose-200 text-rose-800'
              : statusNotice.type === 'warning'
              ? 'bg-amber-50 border-amber-200 text-amber-800'
              : 'bg-teal-50 border-teal-200 text-teal-800'
          }`}
        >
          <div className="mx-auto max-w-7xl flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{statusNotice.message}</span>
            </div>
            <button
              onClick={() => setStatusNotice(null)}
              className="text-xs underline hover:opacity-75"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1">
        {activeTab === 'explorer' && (
          <>
            <LandingHero
              onExplore={() => {
                const el = document.getElementById('market-explorer-anchor');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              onSelectHub={handleSelectHubFromHero}
            />
            <div id="market-explorer-anchor">
              <MarketExplorer
                initialReport={report}
                onRunAnalysis={handleRunAnalysis}
                isLoading={isLoading}
                onNavigateToReport={() => setActiveTab('report')}
              />
            </div>
          </>
        )}

        {activeTab === 'report' && (
          <OpportunityReportView
            report={report}
            onNavigateToExplorer={() => setActiveTab('explorer')}
          />
        )}

        {activeTab === 'methodology' && <MethodologyView />}
      </main>

      {/* Product Footer */}
      <footer className="border-t border-slate-200 bg-white py-8 text-xs text-slate-500">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <div className="font-bold text-slate-800">GapLens — HerStay Intelligence</div>
            <p className="mt-0.5">
              SerpApi India Hackathon 2026 • Commerce & Market Intelligence Track
            </p>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <button
              onClick={() => setActiveTab('methodology')}
              className="hover:text-slate-900 underline"
            >
              Methodology & Limitations
            </button>
            <a
              href="https://serpapi.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-slate-900 inline-flex items-center gap-1"
            >
              <span>Powered by SerpApi</span>
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
