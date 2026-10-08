'use client';

import React from 'react';
import {
  Search,
  Database,
  Layers,
  AlertTriangle,
  CheckCircle,
  Key,
} from 'lucide-react';

export function MethodologyView() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      {/* Title */}
      <div className="border-b border-slate-200 pb-5">
        <span className="rounded bg-teal-50 px-2.5 py-1 text-xs font-bold text-teal-800 border border-teal-200 uppercase">
          Transparency & Documentation
        </span>
        <h1 className="mt-2 text-2xl sm:text-3xl font-extrabold text-slate-900">
          GapLens Intelligence Methodology & Data Governance
        </h1>
        <p className="mt-1 text-sm text-slate-600">
          How public SerpApi search data is collected, deduplicated, analyzed, and cautious opportunity theses are formed.
        </p>
      </div>

      {/* Pipeline Architecture Diagram */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs">
        <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <Layers className="h-4 w-4 text-teal-600" />
          <span>The End-to-End Analysis Pipeline</span>
        </h2>
        <div className="mt-4 grid grid-cols-1 md:grid-cols-4 gap-3 text-xs">
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
            <span className="font-bold text-teal-700">1. Hub Resolution</span>
            <p className="mt-1 text-slate-600">
              Precise latitude/longitude coordinates anchored to verified tech park gates and transit junctions.
            </p>
          </div>
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
            <span className="font-bold text-teal-700">2. SerpApi Retrieval</span>
            <p className="mt-1 text-slate-600">
              Querying <code className="text-slate-800 font-mono">google_maps</code> & <code className="text-slate-800 font-mono">google_maps_reviews</code> with in-memory caching.
            </p>
          </div>
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
            <span className="font-bold text-teal-700">3. Deduplication & Geo Filter</span>
            <p className="mt-1 text-slate-600">
              Normalized ID merging and Haversine straight-line distance filtering against the selected radius.
            </p>
          </div>
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
            <span className="font-bold text-teal-700">4. Theme Synthesis</span>
            <p className="mt-1 text-slate-600">
              Deterministic sentiment extraction across 9 friction categories and confidence-weighted gap reporting.
            </p>
          </div>
        </div>
      </div>

      {/* What Data We Retrieve */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Search className="h-4 w-4 text-teal-600" />
            <span>Retrieved Signals (via SerpApi)</span>
          </h3>
          <ul className="mt-3 space-y-2 text-xs text-slate-600">
            <li className="flex items-start gap-2">
              <CheckCircle className="h-3.5 w-3.5 text-teal-600 shrink-0 mt-0.5" />
              <span><strong>Place Metadata:</strong> Business name, address, GPS coordinates, public Google rating, total review count, phone numbers, and Maps links.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="h-3.5 w-3.5 text-teal-600 shrink-0 mt-0.5" />
              <span><strong>Sample Reviews:</strong> Public textual user reviews, review dates, star ratings, and reviewer identifiers.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="h-3.5 w-3.5 text-teal-600 shrink-0 mt-0.5" />
              <span><strong>Spatial Metrics:</strong> Direct Haversine straight-line distance from the accommodation to the hub gate.</span>
            </li>
          </ul>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Database className="h-4 w-4 text-teal-600" />
            <span>Theme Taxonomy (9 Pillars)</span>
          </h3>
          <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-slate-600">
            <div className="rounded bg-slate-50 p-2">
              <strong>1. Cleanliness & Hygiene:</strong> Washroom sanitary state, pests, bedbugs, drainage.
            </div>
            <div className="rounded bg-slate-50 p-2">
              <strong>2. Management & Deposits:</strong> Non-refund of security, abrupt rent hikes, warden behavior.
            </div>
            <div className="rounded bg-slate-50 p-2">
              <strong>3. Food Quality:</strong> Taste, hygiene, repetitive menus, dining timings.
            </div>
            <div className="rounded bg-slate-50 p-2">
              <strong>4. Essential Amenities:</strong> High-speed WiFi, geysers, washing machines, power backup.
            </div>
            <div className="rounded bg-slate-50 p-2">
              <strong>5. Maintenance:</strong> Plumbing leaks, electrical fixtures, response delays.
            </div>
            <div className="rounded bg-slate-50 p-2">
              <strong>6. Curfew & Privacy:</strong> Unannounced staff entry, restrictive curfews, guest policy.
            </div>
            <div className="rounded bg-slate-50 p-2">
              <strong>7. Transit & Access:</strong> Walkability to hub, dark access lanes, auto availability.
            </div>
            <div className="rounded bg-slate-50 p-2">
              <strong>8. Rent Transparency:</strong> Hidden commercial electricity surcharges, value for money.
            </div>
          </div>
        </div>
      </div>

      {/* Critical Boundaries and Non-Claims */}
      <div className="rounded-xl border border-amber-200 bg-amber-50/60 p-6">
        <h3 className="text-sm font-bold text-amber-900 flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 text-amber-700" />
          <span>Core Methodological Boundaries & Non-Goals</span>
        </h3>
        <p className="mt-2 text-xs text-amber-800 leading-relaxed">
          GapLens identifies potential market openings using transparent search heuristics. To ensure responsible and accurate market analysis, the following rules are enforced:
        </p>
        <div className="mt-4 space-y-2 text-xs text-amber-900">
          <div className="flex items-start gap-2">
            <span className="font-bold">•</span>
            <span><strong>Sample, Not Census:</strong> Public Google Maps listings represent discoverable businesses; they do not represent an exhaustive register of all unregistered PG beds.</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="font-bold">•</span>
            <span><strong>Subjective Reviews, Not Legal Findings:</strong> Online reviews represent subjective personal accounts. They cannot verify physical occupancy or financial viability.</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="font-bold">•</span>
            <span><strong>No Defamatory or Unverified Safety Allegations:</strong> Safety-related reviews (e.g., lighting, guard presence) are labeled as unverified subjective feedback, never as verified municipal or police safety audits.</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="font-bold">•</span>
            <span><strong>Straight-Line Distance:</strong> Distances are strictly straight-line geodesic calculations and are explicitly documented as such—never labeled as travel time.</span>
          </div>
        </div>
      </div>

      {/* How to configure API key */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs space-y-3">
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <Key className="h-4 w-4 text-teal-600" />
          <span>Configuring SerpApi API Key</span>
        </h3>
        <p className="text-xs text-slate-600 leading-relaxed">
          To run live Google Maps and Google Maps Reviews API queries against any metropolitan market:
        </p>
        <div className="rounded-lg bg-slate-900 p-4 font-mono text-xs text-teal-300">
          <div className="text-slate-400"># In your local .env.local file:</div>
          <div>SERPAPI_API_KEY=&quot;your_serpapi_key_from_serpapi_com&quot;</div>
        </div>
        <p className="text-xs text-slate-500">
          When <code className="font-mono text-slate-700">SERPAPI_API_KEY</code> is absent or empty, GapLens automatically serves the calibrated illustrative dataset for Manyata Tech Park, Pune, and Hyderabad, maintaining complete interface interactivity without breaking.
        </p>
      </div>
    </div>
  );
}
