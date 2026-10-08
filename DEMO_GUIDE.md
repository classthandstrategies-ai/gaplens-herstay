# GapLens HerStay — 3-Minute Hackathon Demo Script & Submission Guide

This guide provides the exact demonstration walkthrough and spoken script for the **SerpApi India Hackathon 2026** submission video (under 3 minutes).

---

## 📹 Video Recording Guide (Total Time: ~2 min 50 sec)

### Segment 1: The Problem (0:00 – 0:20)
- **Visual**: Start on the GapLens homepage at `http://localhost:3000` (or `https://gaplens-herstay.vercel.app`).
- **Narrative**:
  > *"When women relocate for work near major tech parks in India, finding housing that balances reasonable pricing, safety, dependable hygiene, and privacy is a persistent challenge. Meanwhile, PG entrepreneurs lack evidence-backed tools to spot where existing accommodations are failing residents. A tech corridor might have dozens of hostels, but still suffer from a deep quality gap. That's why we built **GapLens HerStay Intelligence**."*

### Segment 2: Market Selection (0:20 – 0:40)
- **Visual**: Scroll to the Market Explorer. Select **Bengaluru**, choose **Manyata Tech Park**, and adjust the radius slider to **3.5 km**.
- **Narrative**:
  > *"Here we select our demonstration market: Manyata Tech Park in North Bengaluru, which employs over 150,000 professionals across companies like IBM, Cognizant, and Target. We set our analysis perimeter to a 3.5 km straight-line radius around the main gate."*

### Segment 3: Live SerpApi Investigation (0:40 – 1:15)
- **Visual**: Click the **Analyze Accommodation Supply** button. Show the live query status, which calls SerpApi's `google_maps` and `google_maps_reviews` engines.
- **Narrative**:
  > *"Clicking 'Analyze Accommodation Supply' triggers our server-side SerpApi engine. Rather than relying on static or sponsored listings, GapLens queries real-time Google Maps search data, deduplicates multi-query listings, verifies coordinate boundaries, and retrieves authentic resident reviews with intelligent 24-hour caching."*

### Segment 4: Geographic Map, Listings & Verbatim Review Evidence (1:15 – 1:55)
- **Visual**: Pan through the interactive Leaflet map markers. Click on accommodations near Nagawara and Thanisandra Main Road. Open the **Inspect Evidence** modal to show verbatim resident quotes. Show the **Resident Friction Breakdown** chart below.
- **Narrative**:
  > *"In seconds, GapLens maps 24 verified accommodations. Each marker shows public Google ratings and straight-line distance to the office park gate. When we inspect individual properties, we can read actual reviewer quotes — surfacing recurring complaints like bathroom hygiene, unannounced warden entry, or unrefunded security deposits. The Resident Friction Breakdown aggregates these complaints into 9 critical operational categories."*

### Segment 5: The Opportunity Dossier (1:55 – 2:25)
- **Visual**: Click **View Opportunity Report** (or navigate to the Opportunity Report tab). Scroll through the core hypothesis, spatial distribution pockets, and competitor matrix.
- **Narrative**:
  > *"Next, the Opportunity Report synthesizes this public search evidence into an actionable business hypothesis. For Manyata, GapLens reveals a 'Quality & Hygiene Deficit' — meaning demand is high, but existing options suffer from maintenance friction. It identifies specific spatial pockets within 1.5 km of the gate where premium, well-managed women's housing can easily capture dissatisfied tenants paying equivalent rates for substandard infrastructure."*

### Segment 6: Architecture & Attribution (2:25 – 2:50)
- **Visual**: Click on the **Methodology** tab. Show the pipeline architecture diagram and SerpApi attribution.
- **Narrative**:
  > *"GapLens is powered by SerpApi's Maps and Reviews APIs, built on Next.js 16, TypeScript, Tailwind CSS, and Leaflet. All distance calculations are spherical straight-line calculations, and tenant quotes are ethically framed as subjective reviewer feedback rather than verified allegations. GapLens turns public search data into evidence-backed market intelligence."*

---

## 🚀 Live Links for Submission

- **Live Production Application**: [https://gaplens-herstay.vercel.app](https://gaplens-herstay.vercel.app)
- **GitHub Repository**: [https://github.com/classthandstrategies-ai/gaplens-herstay](https://github.com/classthandstrategies-ai/gaplens-herstay)
- **Track**: Commerce & Market Intelligence
- **Deadline**: October 10, 2026, 23:59 IST
