# GapLens HerStay — 3-Minute Hackathon Demo Script & Submission Guide

This guide provides the exact demonstration walkthrough and spoken script for the **SerpApi India Hackathon 2026** submission video (under 3 minutes).

---

## 📹 Video Recording Guide (Total Time: ~2 min 45 sec)

### Segment 1: The Problem (0:00 – 0:20)
- **Visual**: Start on the GapLens homepage running locally at `http://localhost:3000` (or `https://gaplens-herstay.vercel.app`).
- **Narrative**:
  > *"When women relocate for work near major tech parks in India, finding housing that combines reasonable pricing, dependable hygiene, and privacy is a persistent challenge. Meanwhile, PG entrepreneurs lack empirical tools to identify neighborhoods where existing accommodations fall short of tenant expectations. A tech corridor might have dozens of hostels, but still suffer from a measurable quality gap. That is why we built **GapLens HerStay Intelligence**."*

### Segment 2: Market Selection (0:20 – 0:40)
- **Visual**: In the Market Explorer, select **Bengaluru**, choose **Manyata Tech Park**, and set the analysis radius to **3.5 km**.
- **Narrative**:
  > *"Here we select our demonstration market: Manyata Tech Park in North Bengaluru, anchored near Nagawara and Hebbal. We establish an analysis perimeter of 3.5 km straight-line radius around the main gate."*

### Segment 3: Live SerpApi Investigation (0:40 – 1:15)
- **Visual**: Click **Analyze Accommodation Supply**. Show the server-side SerpApi retrieval querying `google_maps` and `google_maps_reviews`.
- **Narrative**:
  > *"Clicking 'Analyze Accommodation Supply' executes our server-side SerpApi engine. Rather than relying on sponsored listings or static directories, GapLens runs targeted public Google Maps searches, deduplicates listings, computes spherical distances from the gate, and retrieves public reviewer feedback for discovered listings with intelligent server-side caching."*

### Segment 4: Geographic Supply & Review Evidence (1:15 – 1:55)
- **Visual**: Pan through the interactive Leaflet map markers. Click on discovered listings such as *New Sns Reddy Ladies Pg* (0.58 km straight-line) and *Good Lands PG For Ladies* (0.60 km straight-line). Open the **Inspect Evidence** modal to show verbatim public review snippets. Show the **Reviewer Feedback & Friction Breakdown** chart below.
- **Narrative**:
  > *"In seconds, GapLens identifies 24 discovered listings within the 3.5 km radius. We treat these as discovered public search listings rather than independently verified operating properties. Notice each pin displays public Google ratings or indicates unrated properties without substituting fake defaults. Clicking any listing reveals verbatim public reviewer feedback — highlighting specific friction signals such as washroom cleanliness, maintenance response times, or curfew notes. The Reviewer Feedback Breakdown categorizes these signals across 9 operational themes."*

### Segment 5: Evidence-Backed Opportunity Hypothesis (1:55 – 2:25)
- **Visual**: Click **View Opportunity Report**. Scroll through the core hypothesis, spatial distribution pockets, and competitor matrix.
- **Narrative**:
  > *"The Opportunity Report synthesizes this public search evidence into a structured market thesis. For Manyata, GapLens highlights a 'Quality & Hygiene Deficit' based on recurring feedback patterns across sampled public reviews. It breaks down spatial pockets — showing how supply clusters within 1.5 km of the gate versus the outer transit belts, giving operators a clear, data-grounded starting point for on-the-ground feasibility studies."*

### Segment 6: Architecture, Transparency & SerpApi Dependency (2:25 – 2:45)
- **Visual**: Switch to the **Methodology** tab. Show the pipeline architecture diagram and SerpApi attribution.
- **Narrative**:
  > *"GapLens is built on Next.js 16, TypeScript, Tailwind CSS, and Leaflet, powered directly by SerpApi's Google Maps and Reviews APIs. All distance calculations are direct straight-line calculations, and review snippets are framed as subjective public reviewer feedback, not confirmed resident testimony or verified operating claims. SerpApi enables us to transform unstructured public search listings into transparent market intelligence."*

---

## 🛠 Local Setup Instructions (For Recording Video Locally)

```bash
# 1. Clone the repository
git clone https://github.com/classthandstrategies-ai/gaplens-herstay.git
cd gaplens-herstay

# 2. Install dependencies
npm install

# 3. Add your SerpApi Key to .env.local
echo 'SERPAPI_API_KEY="your_serpapi_key_here"' > .env.local

# 4. Start local production build or development server
npm run build
npm run start
```
Open `http://localhost:3000` to record the walkthrough.

---

## 🚀 Live Submission Links

- **Live Production Application**: [https://gaplens-herstay.vercel.app](https://gaplens-herstay.vercel.app)
- **Public GitHub Repository**: [https://github.com/classthandstrategies-ai/gaplens-herstay](https://github.com/classthandstrategies-ai/gaplens-herstay)
- **Track**: Commerce & Market Intelligence
- **Deadline**: October 10, 2026, 23:59 IST
