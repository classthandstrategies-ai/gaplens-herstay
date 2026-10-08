import { TourStep } from './types';

export const TOUR_STEPS: TourStep[] = [
  {
    id: 'market-filters',
    stepNumber: 1,
    totalSteps: 5,
    title: 'Choose Market & Radius',
    subtitle: 'Targeting tech corridor employment anchors',
    description:
      'Select a high-density employment hub (such as Whitefield, Hitec City, or Hinjawadi). Adjust the straight-line radius slider (1.0 to 5.0 km) to establish your target search zone around the anchor.',
    targetSelector: '[data-tour="market-filters"]',
    targetTab: 'explorer',
    position: 'right',
    keyInsight:
      'Distances are Euclidean straight-line estimates from the anchor point, capturing immediate walking and auto-rickshaw commute corridors.',
    actionHint: 'Customize city, employment hub, and search radius anytime.',
  },
  {
    id: 'analyze-btn',
    stepNumber: 2,
    totalSteps: 5,
    title: 'Scan Discovered Supply',
    subtitle: 'Live SerpApi search vs calibrated sample',
    description:
      'Clicking "Analyze Accommodation Supply" queries Google Maps and Places via SerpApi to discover public women’s PGs, hostels, and co-living facilities. During this tour, no live API credits are consumed.',
    targetSelector: '[data-tour="analyze-btn"]',
    targetTab: 'explorer',
    position: 'bottom',
    keyInsight:
      'Only public listings discovered via search engines are evaluated. Unlisted independent hostels require local field auditing.',
    actionHint: 'In production, this scans real-time places and review feeds.',
  },
  {
    id: 'property-map-area',
    stepNumber: 3,
    totalSteps: 5,
    title: 'Explore Discovered Supply',
    subtitle: 'Interactive map and accommodation listings',
    description:
      'Inspect the spatial distribution of accommodations relative to the tech park. Click any map marker or property card to view discovered distance, pricing tier, public ratings, and listed amenities.',
    targetSelector: '[data-tour="property-map-area"]',
    targetTab: 'explorer',
    position: 'left',
    keyInsight:
      'Public Google Maps listings are treated as discovered search results, not independently certified or verified operating facilities.',
    actionHint: 'Use the sort dropdown to rank by distance, friction, or rating.',
  },
  {
    id: 'friction-breakdown',
    stepNumber: 4,
    totalSteps: 5,
    title: 'Understand Public Feedback',
    subtitle: 'Structured review sentiment & friction themes',
    description:
      'GapLens parses public Google reviews across discovered properties to categorize recurring friction (hygiene, maintenance, security perceptions, curfews, and food). Evidence confidence indicates how many properties have review coverage.',
    targetSelector: '[data-tour="friction-breakdown"]',
    targetTab: 'explorer',
    position: 'top',
    keyInsight:
      'Online reviews reflect subjective public feedback. Confidence grades distinguish preliminary signals from dense coverage.',
    actionHint: 'Click any theme bar to see specific quote snippets and frequency.',
  },
  {
    id: 'report-hypothesis',
    stepNumber: 5,
    totalSteps: 5,
    title: 'Actionable Market Hypothesis',
    subtitle: 'Evidence-backed thesis for property operators',
    description:
      'GapLens synthesizes supply density, distance gradients, and friction signals into a directional opportunity dossier. This highlights underserved micro-markets and tenant pain points that better accommodations could solve.',
    targetSelector: '[data-tour="report-hypothesis"]',
    targetTab: 'report',
    position: 'bottom',
    keyInsight:
      'This dossier provides an evidence-backed starting hypothesis for market research, not a guaranteed commercial outcome or substitute for on-the-ground validation.',
    actionHint: 'Ready to discover opportunities in other tech hubs? Click "Start Exploring".',
  },
];
