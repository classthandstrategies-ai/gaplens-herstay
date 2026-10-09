import { ThemeCategory, ThemeSnippet, ThemeAggregate } from '../types';

interface ThemeDefinition {
  category: ThemeCategory;
  label: string;
  description: string;
  negativeKeywords: RegExp[];
  positiveKeywords: RegExp[];
}

const THEME_DEFINITIONS: ThemeDefinition[] = [
  {
    category: 'hygiene',
    label: 'Cleanliness & Hygiene',
    description: 'Complaints about washrooms, pest infestations, garbage, unwashed sheets, or stinking drains.',
    negativeKeywords: [
      /\b(dirty|unhygienic|smelly|stink|cockroach|cockroaches|bedbug|bedbugs|pest|pests|dusty|clogged|mold|filthy|stained)\b/i,
      /\b(washroom|bathroom|toilet)\s+(is|was|are)?\s*(dirty|bad|not clean|terrible|horrible|disgusting|uncleaned)/i,
      /\bno\s+cleaning\b/i,
      /\bcleaning\s+(is\s+)?(rare|irregular|poor|bad)/i,
    ],
    positiveKeywords: [
      /\b(clean|hygienic|spotless|neat|well maintained|tidy|regularly cleaned)\b/i,
    ],
  },
  {
    category: 'management',
    label: 'Management & Deposits',
    description: 'Issues regarding deposit non-refunds, rude wardens, sudden rent hikes, or delayed responses.',
    negativeKeywords: [
      /\b(deposit|advance)\s+(is|was)?\s*(not|never|refused|didn't|did not|won't)?\s*(refunded|returned|given back)/i,
      /\b(refused|denied|did not|didn't)\s+(to\s+)?(return|refund|give back)\s+(the\s+|my\s+)?(security\s+)?(deposit|advance)/i,
      /\b(rude|unprofessional|arrogant|careless|irresponsible|money minded|greedy)\s+(owner|warden|manager|management|landlord|caretaker)/i,
      /\b(owner|warden|manager|caretaker|landlord)\s+(is|was)?\s*(rude|worst|harsh|abusive|money minded)/i,
      /\bno\s+deposit\s+refund\b/i,
      /\bdeducted\s+(unnecessary|extra|huge)\s+(charges|money|amount)/i,
    ],
    positiveKeywords: [
      /\b(helpful|cooperative|friendly|caring|polite|supportive)\s+(owner|warden|manager|management|caretaker)/i,
      /\bdeposit\s+(refunded|returned|smooth)/i,
    ],
  },
  {
    category: 'food',
    label: 'Food Quality & Timings',
    description: 'Feedback on meal taste, lack of variety, stale ingredients, digestive issues, or inflexible dinner timings.',
    negativeKeywords: [
      /\bfood\s+(is|was)?\s*(bad|worst|tasteless|terrible|horrible|oily|unhealthy|repetitive|stale|cold|inedible)/i,
      /\b(bad|poor|worst|pathetic)\s+quality\s+food\b/i,
      /\b(food poisoning|sick|stomach ache)\b/i,
      /\bwatery\s+(dal|curry|sambar)\b/i,
      /\bno\s+variety\b/i,
    ],
    positiveKeywords: [
      /\b(tasty|delicious|homely|good|healthy|hygienic)\s+food\b/i,
      /\bfood\s+(is|was)?\s*(good|nice|decent|homely|great)/i,
    ],
  },
  {
    category: 'amenities',
    label: 'Essential Amenities & WiFi',
    description: 'Failures in high-speed WiFi, geysers, power backup, washing machines, or water shortages.',
    negativeKeywords: [
      /\b(no|poor|slow|terrible|pathetic)\s+(wifi|internet|network|connection)\b/i,
      /\b(no|frequent)\s+(power cut|electricity|power backup|hot water|water shortage|water problem)\b/i,
      /\b(washing machine|geyser|lift|ac|cooler|refrigerator|fridge)\s+(not working|damaged|broken|faulty)/i,
      /\bwater\s+(issues|shortage|cuts|not coming)/i,
    ],
    positiveKeywords: [
      /\b(fast|good|reliable)\s+(wifi|internet)\b/i,
      /\b(24\/7|continuous)\s+(hot water|power backup|electricity|water supply)\b/i,
      /\bgood\s+amenities\b/i,
    ],
  },
  {
    category: 'maintenance',
    label: 'Repairs & Maintenance',
    description: 'Sluggish response to plumbing leaks, electrical failures, wall seepage, or broken locks.',
    negativeKeywords: [
      /\b(leakage|seepage|tap broken|broken pipe|plumbing issue|switch broken|paint peeling)\b/i,
      /\b(no one|nobody|never)\s+(repairs|fixes|attends to|resolves)\b/i,
      /\b(repair|maintenance)\s+(is\s+)?(slow|delayed|ignored|terrible|poor)/i,
      /\btakes?\s+(weeks|days|months)\s+to\s+fix\b/i,
    ],
    positiveKeywords: [
      /\b(prompt|quick|fast)\s+(maintenance|repair|service)\b/i,
      /\bwell\s+maintained\b/i,
    ],
  },
  {
    category: 'privacy',
    label: 'Curfew & Personal Privacy',
    description: 'Disruptions by unscheduled staff entry, overly intrusive gate restrictions, or lack of personal space.',
    negativeKeywords: [
      /\b(warden|caretaker|cleaning staff|owner)\s+(enters?|barges?|walks?)\s+without\s+(knocking|permission|informing)/i,
      /\b(no privacy|zero privacy|disturbing|interfering|intrusive|strict curfews?|suffocating)\b/i,
      /\bno\s+guests?\s+allowed\b/i,
      /\bvery\s+strict\s+(rules|restrictions|timings)\b/i,
    ],
    positiveKeywords: [
      /\b(peaceful|private|spacious|independent|homely feel|comfortable space)\b/i,
      /\bflexible\s+(timings|rules)\b/i,
    ],
  },
  {
    category: 'transport',
    label: 'Transit & Walking Accessibility',
    description: 'Distance to main tech park gates, lack of autos/buses, poorly paved access lanes, or isolated approaches.',
    negativeKeywords: [
      /\b(far|too far|distant|isolated|remote|difficult to reach)\s+(from|to)\s+(tech park|office|main road|bus stop|metro|gate)/i,
      /\b(no auto|no bus|cab drivers refuse|hard to get cabs?|dark lane|muddy road)\b/i,
      /\blong\s+walk\b/i,
      /\bno\s+street\s*lights?\b/i,
    ],
    positiveKeywords: [
      /\b(walking distance|very close|near|accessible|walkable|convenient location)\s+(to|from)\s+(gate|office|tech park|main road)\b/i,
      /\bprime\s+location\b/i,
    ],
  },
  {
    category: 'pricing',
    label: 'Rent Transparency & Value',
    description: 'Hidden electricity per-unit rates, sudden maintenance surcharges, or overpriced double/triple sharing.',
    negativeKeywords: [
      /\b(overpriced|expensive|not worth|hidden charges|huge electricity bill|commercial electricity rate|extra money|ripoff)\b/i,
      /\bhigher\s+rent\b/i,
      /\bhike(d)?\s+the\s+rent\b/i,
    ],
    positiveKeywords: [
      /\b(reasonable|affordable|worth the money|value for money|fair rent|budget friendly)\b/i,
    ],
  },
  {
    category: 'safety',
    label: 'Reviewer-Reported Security Notes',
    description: 'Unverified reviewer statements concerning nighttime security guards, CCTV status, or deserted lanes.',
    negativeKeywords: [
      /\b(security guard\s+(sleeping|absent|not there|missing)|no guard|cctv not working|broken lock|felt unsafe|scary at night|deserted road|harassment)\b/i,
      /\bno\s+security\b/i,
      /\bunsafe\s+area\b/i,
    ],
    positiveKeywords: [
      /\b(safe|secure|24\/7 security|active guard|working cctv|gated|feel safe)\b/i,
    ],
  },
];

/**
 * Splits text into individual sentences for contextual snippet extraction
 */
function splitIntoSentences(text: string): string[] {
  if (!text) return [];
  return text
    .split(/(?<=[.?!])\s+|\n+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 15);
}

/**
 * Categorizes and extracts theme mentions from a list of reviews
 */
export function extractReviewThemes(
  reviews: Array<{
    text: string;
    author: string;
    rating: number | null;
    date?: string;
    placeTitle: string;
    placeId: string;
  }>
): {
  themeAggregates: ThemeAggregate[];
  placeThemes: Map<string, ThemeCategory[]>;
  allSnippets: ThemeSnippet[];
} {
  const snippets: ThemeSnippet[] = [];
  const placeThemes = new Map<string, Set<ThemeCategory>>();

  const categoryStats = new Map<
    ThemeCategory,
    { negative: number; positive: number; snippets: ThemeSnippet[] }
  >();

  THEME_DEFINITIONS.forEach((def) => {
    categoryStats.set(def.category, {
      negative: 0,
      positive: 0,
      snippets: [],
    });
  });

  reviews.forEach((review) => {
    const sentences = splitIntoSentences(review.text);
    const matchedCategoriesForReview = new Set<ThemeCategory>();

    THEME_DEFINITIONS.forEach((def) => {
      let isNegative = false;
      let isPositive = false;
      let matchedSentence = '';

      // Check negative keywords
      for (const pattern of def.negativeKeywords) {
        if (pattern.test(review.text)) {
          isNegative = true;
          // Find matching sentence
          matchedSentence =
            sentences.find((s) => pattern.test(s)) ||
            review.text.slice(0, 140) + '...';
          break;
        }
      }

      // Check positive keywords if not already negative
      if (!isNegative) {
        for (const pattern of def.positiveKeywords) {
          if (pattern.test(review.text)) {
            isPositive = true;
            matchedSentence =
              sentences.find((s) => pattern.test(s)) ||
              review.text.slice(0, 140) + '...';
            break;
          }
        }
      }

      if (isNegative || isPositive) {
        matchedCategoriesForReview.add(def.category);

        const currentStat = categoryStats.get(def.category)!;
        if (isNegative) currentStat.negative += 1;
        if (isPositive) currentStat.positive += 1;

        const snippetItem: ThemeSnippet = {
          text: matchedSentence || review.text,
          category: def.category,
          sentiment: isNegative ? 'negative' : 'positive',
          placeTitle: review.placeTitle,
          placeId: review.placeId,
          author: review.author,
          date: review.date,
          // CRITICAL: Explicitly flag safety mentions as unverified subjective feedback
          isUnverifiedSafetyMention: def.category === 'safety',
        };

        currentStat.snippets.push(snippetItem);
        snippets.push(snippetItem);
      }
    });

    if (matchedCategoriesForReview.size > 0) {
      if (!placeThemes.has(review.placeId)) {
        placeThemes.set(review.placeId, new Set<ThemeCategory>());
      }
      matchedCategoriesForReview.forEach((cat) => {
        placeThemes.get(review.placeId)!.add(cat);
      });
    }
  });

  const totalReviews = Math.max(reviews.length, 1);

  const themeAggregates: ThemeAggregate[] = THEME_DEFINITIONS.map((def) => {
    const stat = categoryStats.get(def.category)!;
    const frequencyPercentage = Math.round((stat.negative / totalReviews) * 100);

    let severity: 'high' | 'medium' | 'low' = 'low';
    if (frequencyPercentage >= 25 || stat.negative >= 5) severity = 'high';
    else if (frequencyPercentage >= 10 || stat.negative >= 2) severity = 'medium';

    let impactSummary = `Mentioned negatively in ${stat.negative} reviewer account(s).`;
    if (def.category === 'safety') {
      impactSummary = `${stat.negative} subjective public review(s) noted evening lighting or guard absence. (Unverified online feedback; not an official safety finding).`;
    }

    return {
      category: def.category,
      label: def.label,
      description: def.description,
      negativeCount: stat.negative,
      positiveCount: stat.positive,
      frequencyPercentage,
      severity,
      // Sample representative negative snippets first
      representativeSnippets: stat.snippets
        .sort((a, b) => (a.sentiment === 'negative' && b.sentiment !== 'negative' ? -1 : 1))
        .slice(0, 6),
      impactSummary,
    };
  }).sort((a, b) => b.negativeCount - a.negativeCount);

  const placeThemesArray = new Map<string, ThemeCategory[]>();
  placeThemes.forEach((cats, id) => {
    placeThemesArray.set(id, Array.from(cats));
  });

  return {
    themeAggregates,
    placeThemes: placeThemesArray,
    allSnippets: snippets,
  };
}
