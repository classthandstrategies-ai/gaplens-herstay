# GapLens — HerStay Intelligence

> **Discover where better women's housing is needed.**  
> *Commerce & Market Intelligence Track — SerpApi India Hackathon 2026*

[![Next.js](https://img.shields.io/badge/Next.js-16.4-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-v4-38bdf8?logo=tailwindcss)](https://tailwindcss.com/)
[![SerpApi](https://img.shields.io/badge/Powered%20By-SerpApi-blueviolet)](https://serpapi.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-teal.svg)](LICENSE)

---

## 1. Product Overview & The Problem

Women moving to metropolitan hubs for employment frequently face severe hurdles finding accommodation that combines convenient location, reliable facilities, fair pricing, personal privacy, hygiene, and responsive management.

Meanwhile, PG entrepreneurs and hostel operators lack empirical, location-specific intelligence to identify neighborhoods where existing offerings fail to meet tenant expectations. A tech corridor can host dozens of PGs while still suffering from deep market gaps.

The gap is rarely just a shortage of beds. It is often:
- **Last-Mile Transit Friction**: Accommodations clustered beyond comfortable walking distance from office gates.
- **Hygiene Deficits Noted in Public Feedback**: Unclean washrooms, persistent pests, and ignored cleanliness complaints.
- **Deposit Refund Friction**: Arbitrary deposit deductions and lack of transparent contracts noted by reviewers.
- **Curfew & Personal Privacy Concerns**: Inflexible gate restrictions or intrusions reported by past occupants.
- **Maintenance & Utilities Downtime**: Chronic Wi-Fi drops, geyser failures, and erratic water supply.

**GapLens HerStay Intelligence** examines these potential gaps by turning public Google Maps and Google Maps Reviews data via **SerpApi** into structured market opportunity reports.

> **Important Boundary & Data Integrity:** Google Maps businesses represent **discovered public search listings**, not independently audited or verified operating properties. Google reviews represent **subjective public reviewer feedback**, not confirmed resident testimony or formal allegations. GapLens never presents online review feedback as verified factual allegations or formal municipal/police safety audits.

---

## 2. Why Existing Listing Tools Fail This Problem

Existing platforms (e.g. MagicBricks, Housing.com, 99acres) are designed for **tenant consumer discovery**, not **market opportunity discovery**:
1. **Sponsored Bias**: They highlight sponsored or paying properties rather than exposing quality deficits.
2. **No Friction Aggregation**: They don't cluster textual reviews into recurring complaint categories (e.g. hygiene vs. deposits vs. transit).
3. **No Spatial Opportunity Synthesis**: They cannot compute relative supply density against major corporate employment gates to tell an operator where better options are needed.

GapLens aggregates discoverable public search listings and review evidence to quantify where potential quality and management gaps exist.

---

## 3. Real SerpApi Architecture

GapLens uses SerpApi as its core data foundation:

```
┌────────────────────────┐
│  Target Employment Hub  │ (e.g., Manyata Tech Park, Hinjewadi, Gachibowli)
└───────────┬────────────┘
            │
            ▼
┌────────────────────────┐
│   Geodesic Anchoring   │ (Verified gate coordinates & Haversine boundary)
└───────────┬────────────┘
            │
            ▼
┌────────────────────────┐
│   SerpApi Google Maps  │ Engine: `google_maps`
│      Search Engine     │ Queries: "ladies PG near Manyata Tech Park", etc.
└───────────┬────────────┘
            │
            ▼
┌────────────────────────┐
│ Place Deduplication &  │ Multi-query deduplication by ID, coordinates & title
│    Radius Filtering    │ Straight-line spherical distance calculation
└───────────┬────────────┘
            │
            ▼
┌────────────────────────┐
│ SerpApi Maps Reviews   │ Engine: `google_maps_reviews`
│    Sampling Engine     │ Sampling public reviewer feedback text & dates
└───────────┬────────────┘
            │
            ▼
┌────────────────────────┐
│ Deterministic Friction │ 9-Pillar Theme Taxonomy (Hygiene, Management,
│   Extraction Engine    │ Food, Amenities, Maintenance, Privacy, Transit, etc.)
└───────────┬────────────┘
            │
            ▼
┌────────────────────────┐
│   Market Opportunity   │ Supply Visibility + Review Friction Index +
│    Report Generator    │ Spatial Distribution Pockets + Evidence Confidence
└────────────────────────┘
```

### SerpApi Endpoints Used:
1. **Google Maps API** (`engine: 'google_maps'`):
   - Retrieves public search listings, coordinates, title, address, rating, review count, and place identifiers.
   - Queries are centered on the employment anchor coordinate using `ll` parameter (e.g. `@13.0475,77.6220,14z`).
2. **Google Maps Reviews API** (`engine: 'google_maps_reviews'`):
   - Retrieves public reviewer feedback snippets for discovered listings using `data_id`.
   - Analyzed for recurring friction themes.

### API Engineering & Reliability:
- **Server-Side Security**: `SERPAPI_API_KEY` is strictly server-side and never exposed to the client.
- **In-Memory Caching (24h TTL)**: Prevents redundant SerpApi credit consumption for identical queries.
- **Graceful Baseline Mode**: When `SERPAPI_API_KEY` is not configured, GapLens automatically serves a calibrated illustrative dataset for demonstration without crashing.
- **Transparent Provenance**: The interface clearly indicates whether data is `live_serpapi`, `cached_serpapi`, or `illustrative_sample`.

---

## 4. Key Interactive Capabilities

- **Metropolitan & Hub Selection**:
  - Bengaluru: Manyata Tech Park (Primary Demonstration Market)
  - Pune: Hinjewadi Rajiv Gandhi Infotech Park
  - Hyderabad: Gachibowli Financial District
- **Analysis Radius Slider**: Adjustable straight-line distance perimeter from 1.0 km to 8.0+ km.
- **Interactive Leaflet Map**:
  - Custom SVG markers with live rating color codes.
  - Visual radius perimeter circle.
  - Property popups with straight-line distance, ratings, and friction tags.
- **Evidence Inspector Modal**:
  - Verbatim public review quotes with author attribution and review dates.
  - Direct links to Google Maps source listings.
- **Reviewer Feedback & Friction Breakdown**:
  - Interactive distribution of feedback across 9 categories.
  - Representative quotation drawer with unverified reviewer feedback disclaimers.
- **Executive Opportunity Report**:
  - Export/print-friendly dossier with spatial pocket observations and competitor matrices.

---

## 5. Local Setup & Quickstart

### Prerequisites
- Node.js v20+ or v24+
- npm v10+

### Installation

```bash
# Clone the repository
git clone https://github.com/classthandstrategies-ai/gaplens-herstay.git
cd gaplens-herstay

# Install dependencies
npm install

# (Optional) Set up your SerpApi Key for live public scanning
cp .env.example .env.local
# Add your key to .env.local:
# SERPAPI_API_KEY="your_serpapi_api_key_here"

# Run tests
npm run test

# Run linter
npm run lint

# Build production bundle
npm run build

# Start local server
npm run start
# Or start development server:
# npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 6. Demonstration Scenario (3-Minute Walkthrough)

| Timestamp | Video Section | Action & Narrative |
|---|---|---|
| **0:00 - 0:20** | **Problem Statement** | Explain why women moving for work struggle to find quality accommodation near tech parks, and why entrepreneurs need search-backed evidence of underserved pockets. |
| **0:20 - 0:40** | **Select Manyata Tech Park** | Launch GapLens, select **Bengaluru → Manyata Tech Park**, and set a 3.5 km analysis radius. |
| **0:40 - 1:15** | **Run Market Investigation** | Click **Analyze Accommodation Supply**. Show the server-side SerpApi Maps & Reviews pipeline query in action. |
| **1:15 - 1:55** | **Explore Map & Evidence** | Pan through the Leaflet map pins, click properties in Nagawara/Thanisandra, inspect verbatim review quotes detailing plumbing and hygiene complaints. |
| **1:55 - 2:25** | **Opportunity Dossier** | Switch to **Opportunity Report**. Showcase the generated market gap hypothesis, spatial distribution pockets, and complaint severity matrix. |
| **2:25 - 2:50** | **Architecture & SerpApi Dependency** | Highlight the transparent SerpApi integration, in-memory caching, straight-line distance formulas, and ethical reviewer disclaimers. |

---

## 7. Automated Testing & Verification

GapLens includes unit and integration tests using **Vitest**:

```bash
npm run test
```

Test coverage includes:
- Spherical Haversine distance calculations.
- Strict radial inclusion/exclusion boundaries.
- Deterministic regex review theme classification (hygiene, management, food, wifi, etc.).
- Enforcement of unverified reviewer disclaimers on safety-related mentions.
- End-to-end report generation metrics and confidence scoring.

---

## 8. Methodology Scope & Limitations

1. **Discovered Public Listings**: Google Maps businesses represent discovered public search listings; they are not independently verified or audited operating properties, nor do they represent an exhaustive census of unregistered accommodation facilities.
2. **Subjective Public Feedback**: Google Maps reviews represent subjective public reviewer feedback, not confirmed resident testimony, physical occupancy data, financial health audits, or legal compliance checks.
3. **No Defamatory or Formal Safety Findings**: Safety-related comments are categorized as unverified personal opinions of online reviewers, never as formal police or municipal safety findings.
4. **Straight-Line Distance**: All distances are spherical straight-line distances from anchor gates, clearly distinguished from driving or transit commute times.

---

## 9. AI Tools & Technologies Disclosure

- **Framework**: Next.js 16 (App Router), React 19, TypeScript
- **Styling**: Tailwind CSS v4, Lucide React
- **Mapping**: Leaflet, React-Leaflet, OpenStreetMap
- **Search Data**: SerpApi (`google_maps`, `google_maps_reviews`)
- **Code Assistance**: Built with pair-programming assistance from Antigravity (Google DeepMind Advanced Agentic Coding).

---

## 10. License

This project is licensed under the [MIT License](LICENSE).
