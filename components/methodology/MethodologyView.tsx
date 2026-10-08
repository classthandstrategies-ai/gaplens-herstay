'use client';

import React from 'react';
import {
  Search,
  Database,
  Layers,
  AlertTriangle,
  CheckCircle2,
  Key,
} from 'lucide-react';

export function MethodologyView() {
  return (
    <article className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      {/* 1. Header */}
      <header className="border-b border-stone-200 pb-5">
        <div className="flex items-center gap-2">
          <span className="rounded-md bg-stone-100 px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wider text-stone-700 border border-stone-200">
            Transparency & Governance
          </span>
          <span className="font-mono text-xs text-stone-500">
            Version 2.0 • SerpApi India Hackathon 2026
          </span>
        </div>
        <h1 className="mt-2 font-serif text-3xl sm:text-4xl font-extrabold tracking-tight text-stone-900">
          Research Methodology & Evidence Governance
        </h1>
        <p className="mt-1.5 text-sm sm:text-base text-stone-600 font-sans">
          How public SerpApi search data is collected, deduplicated, analyzed, and synthesized into cautious operator hypotheses.
        </p>
      </header>

      {/* 2. Pipeline Architecture Diagram */}
      <section aria-label="Analysis pipeline" className="rounded-3xl border border-stone-200 bg-white p-6 sm:p-7 shadow-2xs">
        <h2 className="font-serif text-lg font-bold text-stone-900 flex items-center gap-2">
          <Layers className="h-4 w-4 text-teal-700" />
          <span>The End-to-End Analysis Pipeline</span>
        </h2>
        <div className="mt-4 grid grid-cols-1 md:grid-cols-4 gap-3 text-xs">
          <div className="rounded-2xl border border-stone-200 bg-stone-50/70 p-4">
            <span className="font-mono text-xs font-bold text-teal-800 uppercase tracking-wider">
              1. Hub Resolution
            </span>
            <p className="mt-1 text-stone-600 leading-relaxed font-sans">
              Geographic coordinates anchored to tech corridor gates and transit junctions.
            </p>
          </div>
          <div className="rounded-2xl border border-stone-200 bg-stone-50/70 p-4">
            <span className="font-mono text-xs font-bold text-teal-800 uppercase tracking-wider">
              2. SerpApi Ingestion
            </span>
            <p className="mt-1 text-stone-600 leading-relaxed font-sans">
              Querying <code className="font-mono text-stone-800 font-semibold">google_maps</code> &amp; reviews with server-side caching.
            </p>
          </div>
          <div className="rounded-2xl border border-stone-200 bg-stone-50/70 p-4">
            <span className="font-mono text-xs font-bold text-teal-800 uppercase tracking-wider">
              3. Spatial Deduplication
            </span>
            <p className="mt-1 text-stone-600 leading-relaxed font-sans">
              Place ID deduplication and Haversine straight-line distance filtering.
            </p>
          </div>
          <div className="rounded-2xl border border-stone-200 bg-stone-50/70 p-4">
            <span className="font-mono text-xs font-bold text-teal-800 uppercase tracking-wider">
              4. Friction Synthesis
            </span>
            <p className="mt-1 text-stone-600 leading-relaxed font-sans">
              Deterministic sentiment extraction across 9 friction categories with confidence grading.
            </p>
          </div>
        </div>
      </section>

      {/* 3. What Data We Retrieve & 9 Pillars */}
      <section aria-label="Retrieved signals and taxonomy" className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="rounded-3xl border border-stone-200 bg-white p-6 shadow-2xs">
          <h3 className="font-serif text-base font-bold text-stone-900 flex items-center gap-2">
            <Search className="h-4 w-4 text-teal-700" />
            <span>Retrieved Search Signals (via SerpApi)</span>
          </h3>
          <ul className="mt-4 space-y-3 text-xs text-stone-600 font-sans">
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="h-4 w-4 text-teal-700 shrink-0 mt-0.5" />
              <span>
                <strong className="text-stone-900">Place Metadata:</strong> Business name, address, coordinates, public rating, total review count, phone numbers, and Maps links.
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="h-4 w-4 text-teal-700 shrink-0 mt-0.5" />
              <span>
                <strong className="text-stone-900">Sample Reviews:</strong> Public user comments, review timestamps, star ratings, and author names.
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="h-4 w-4 text-teal-700 shrink-0 mt-0.5" />
              <span>
                <strong className="text-stone-900">Spatial Geometry:</strong> Haversine straight-line distance between accommodation coordinates and the employment hub anchor.
              </span>
            </li>
          </ul>
        </div>

        <div className="rounded-3xl border border-stone-200 bg-white p-6 shadow-2xs">
          <h3 className="font-serif text-base font-bold text-stone-900 flex items-center gap-2">
            <Database className="h-4 w-4 text-teal-700" />
            <span>Tenant Friction Taxonomy (9 Pillars)</span>
          </h3>
          <div className="mt-4 grid grid-cols-2 gap-2 text-xs text-stone-600 font-sans">
            <div className="rounded-xl bg-stone-50 p-2.5 border border-stone-100">
              <strong className="text-stone-900">1. Hygiene:</strong> Sanitary conditions, washrooms, pests.
            </div>
            <div className="rounded-xl bg-stone-50 p-2.5 border border-stone-100">
              <strong className="text-stone-900">2. Management:</strong> Deposit refund, sudden rent hikes.
            </div>
            <div className="rounded-xl bg-stone-50 p-2.5 border border-stone-100">
              <strong className="text-stone-900">3. Food Quality:</strong> Hygiene, repetitive menus, dining timings.
            </div>
            <div className="rounded-xl bg-stone-50 p-2.5 border border-stone-100">
              <strong className="text-stone-900">4. Amenities:</strong> WiFi bandwidth, geysers, power backup.
            </div>
            <div className="rounded-xl bg-stone-50 p-2.5 border border-stone-100">
              <strong className="text-stone-900">5. Maintenance:</strong> Plumbing leaks, electrical fixtures.
            </div>
            <div className="rounded-xl bg-stone-50 p-2.5 border border-stone-100">
              <strong className="text-stone-900">6. Curfews:</strong> Staff entry, curfews, visitor policies.
            </div>
            <div className="rounded-xl bg-stone-50 p-2.5 border border-stone-100">
              <strong className="text-stone-900">7. Transit:</strong> Walkability to hub, unlit corridors.
            </div>
            <div className="rounded-xl bg-stone-50 p-2.5 border border-stone-100">
              <strong className="text-stone-900">8. Pricing:</strong> Hidden utility charges, value for money.
            </div>
          </div>
        </div>
      </section>

      {/* 4. Critical Boundaries and Non-Claims */}
      <section aria-label="Governance boundaries and disclaimers" className="rounded-3xl border border-amber-200 bg-amber-50/60 p-6 sm:p-7">
        <h3 className="font-serif text-base font-bold text-amber-950 flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 text-amber-700" />
          <span>Core Methodological Boundaries &amp; Non-Goals</span>
        </h3>
        <p className="mt-2 text-xs text-amber-900 leading-relaxed font-sans">
          GapLens identifies potential market openings using transparent search heuristics. To ensure responsible and accurate market analysis, the following rules are strictly enforced:
        </p>
        <div className="mt-4 space-y-2.5 text-xs text-amber-950 font-sans">
          <div className="flex items-start gap-2">
            <span className="font-bold text-amber-700">•</span>
            <span>
              <strong className="text-amber-950">Sample, Not Census:</strong> Public Google Maps listings represent discoverable businesses; they do not represent an exhaustive register of all unregistered PG beds.
            </span>
          </div>
          <div className="flex items-start gap-2">
            <span className="font-bold text-amber-700">•</span>
            <span>
              <strong className="text-amber-950">Subjective Reviews, Not Legal Findings:</strong> Online reviews represent subjective personal accounts. They cannot verify physical occupancy or financial viability.
            </span>
          </div>
          <div className="flex items-start gap-2">
            <span className="font-bold text-amber-700">•</span>
            <span>
              <strong className="text-amber-950">No Defamatory or Unverified Safety Allegations:</strong> Safety-related reviews (e.g., lighting, guard presence) are labeled as unverified subjective feedback, never as verified municipal or police safety audits.
            </span>
          </div>
          <div className="flex items-start gap-2">
            <span className="font-bold text-amber-700">•</span>
            <span>
              <strong className="text-amber-950">Straight-Line Distance:</strong> Distances are strictly straight-line geodesic calculations and are explicitly documented as such—never labeled as travel time.
            </span>
          </div>
        </div>
      </section>

      {/* 5. How to configure API key */}
      <section aria-label="SerpApi configuration" className="rounded-3xl border border-stone-200 bg-white p-6 sm:p-7 shadow-2xs space-y-3">
        <h3 className="font-serif text-base font-bold text-stone-900 flex items-center gap-2">
          <Key className="h-4 w-4 text-teal-700" />
          <span>Configuring SerpApi API Key</span>
        </h3>
        <p className="text-xs text-stone-600 leading-relaxed font-sans">
          To run live Google Maps and Google Maps Reviews API queries against any metropolitan market:
        </p>
        <div className="rounded-2xl bg-stone-900 p-4 font-mono text-xs text-teal-300">
          <div className="text-stone-400"># In your local .env.local file:</div>
          <div>SERPAPI_API_KEY=&quot;your_serpapi_key_from_serpapi_com&quot;</div>
        </div>
        <p className="text-xs text-stone-500 font-sans">
          When <code className="font-mono text-stone-800 font-semibold">SERPAPI_API_KEY</code> is absent or empty, GapLens automatically serves the calibrated illustrative dataset for Manyata Tech Park, Hinjewadi, and Gachibowli, maintaining complete interface interactivity without breaking.
        </p>
      </section>
    </article>
  );
}
