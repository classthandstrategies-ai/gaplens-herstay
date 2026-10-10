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
      /\b(dirty|filthy|unhygienic|uncleaned|stinking|smelly|stink|stench|foul\s+smell|bad\s+smell)\b/i,
      /\b(cockroach(es)?|bedbug(s)?|roach(es)?|pests?|insects?|mold|mould|dusty|stained)\b/i,
      /\b(washroom|bathroom|toilet)s?\s+(is|was|are)?\s*(extremely\s+|very\s+)?(dirty|bad|not\s+clean|terrible|horrible|disgusting|uncleaned|filthy)/i,
      /\b(no\s+cleaning|never\s+cleaned|rarely\s+cleaned|cleaning\s+not\s+done|nobody\s+cleans|not\s+cleaned\s+daily)\b/i,
      /\bcleaning\s+(is\s+|was\s+)?(rare|irregular|poor|bad|worst|terrible)/i,
      /\b(clogged|choked)\s+(drain|pipe|toilet|bathroom)\b/i,
    ],
    positiveKeywords: [
      /\b(clean|hygienic|spotless|neat|well\s+maintained|tidy|cleaned\s+daily|cleaned\s+regularly)\b/i,
    ],
  },
  {
    category: 'management',
    label: 'Management & Deposits',
    description: 'Issues regarding deposit non-refunds, rude wardens, sudden rent hikes, or delayed responses.',
    negativeKeywords: [
      /\b(deposit|advance)\s+(is\s+|was\s+|will\s+be\s+)?(not|never|refused|won't|denied)\s*(refunded|returned|given\s+back)/i,
      /\b(did\s+not|didn't|refused\s+to|won't|never)\s*(refund|return|give\s+back)\s*(the\s+|my\s+)?(security\s+)?(deposit|advance|money)/i,
      /\b(no|zero)\s+deposit\s+refund\b/i,
      /\b(deposit|advance)\s*(not\s+returned|not\s+refunded|fraud|stolen|issues?|disputes?)/i,
      /\bdeducted\s+.*(deposit|money|amount|charges)/i,
      /\b(rude|unprofessional|arrogant|careless|irresponsible|money\s*minded|greedy|hostile|harsh|abusive)\s+(owner|warden|manager|management|landlord|caretaker|staff)/i,
      /\b(owner|warden|manager|caretaker|landlord|staff|management)\s+(is|was|are)?\s*(extremely\s+|very\s+)?(rude|worst|harsh|abusive|money\s*minded|greedy|unhelpful|unprofessional|pathetic)/i,
      /\b(worst|poor|pathetic|terrible|bad)\s+management\b/i,
    ],
    positiveKeywords: [
      /\b(helpful|cooperative|friendly|caring|polite|supportive|kind)\s+(owner|warden|manager|management|caretaker|staff)/i,
      /\bdeposit\s+(refunded|returned|smoothly|on\s+time)/i,
    ],
  },
  {
    category: 'food',
    label: 'Food Quality & Timings',
    description: 'Feedback on meal taste, lack of variety, stale ingredients, digestive issues, or inflexible dinner timings.',
    negativeKeywords: [
      /\b(bad|poor|worst|pathetic|terrible|horrible|tasteless|bland|oily|unhealthy|stale|cold|inedible|disgusting|spoiled)\s+(quality\s+)?food\b/i,
      /\bfood\s+(quality\s+)?(is|was|provided\s+is|provided\s+was|tastes)?\s*(extremely\s+|very\s+|really\s+)?(bad|worst|poor|pathetic|terrible|horrible|tasteless|bland|oily|unhealthy|repetitive|stale|cold|inedible|disgusting|not\s+good|unbearable)/i,
      /\b(major\s+issues?|issues?|problems?|complaints?)\s+(about|with|regarding)\s+(the\s+)?food\b/i,
      /\b(food\s+poisoning|stomach\s+ache|fell\s+sick\s+due\s+to\s+food|got\s+sick\s+from\s+food)\b/i,
      /\bwatery\s+(dal|curry|sambar|rasam)\b/i,
      /\b(no|lack\s+of)\s+variety\s+(in\s+food|in\s+meals)?\b/i,
      /\b(dinner|breakfast|lunch|food|mess)\s+timings?\s+(are\s+)?(too\s+)?(strict|rigid|inflexible)/i,
      /\binsects?\s+in\s+(the\s+)?food\b/i,
    ],
    positiveKeywords: [
      /\b(tasty|delicious|homely|good|healthy|hygienic|great|yummy)\s+food\b/i,
      /\bfood\s+(is|was)?\s*(good|nice|decent|homely|great|tasty|delicious)/i,
    ],
  },
  {
    category: 'amenities',
    label: 'Essential Amenities & WiFi',
    description: 'Failures in high-speed WiFi, geysers, power backup, washing machines, or water shortages.',
    negativeKeywords: [
      /\b(wifi|internet|network|connection)\s+(is\s+|was\s+)?(extremely\s+|very\s+)?(slow|poor|bad|terrible|pathetic|down|not\s+working|weak|dropping|issues?|problems?)\b/i,
      /\b(no|poor|slow|terrible|pathetic|weak|bad|unreliable)\s+(wifi|internet|network|broadband|connection)\b/i,
      /\b(power\s*cut|power\s*cuts|power\s*failure|outage|outages)\b/i,
      /\b(no|without)\s+(power\s*backup|electricity|current|generator)\b/i,
      /\b(power\s*backup|generator|electricity)\s+(is\s+|was\s+)?(not\s+working|unavailable|absent|poor)\b/i,
      /\b(geyser|water\s*heater)\s+(is\s+|was\s+)?(not\s+working|broken|damaged|faulty|off)/i,
      /\b(no|lack\s+of)\s+hot\s+water\b/i,
      /\bhot\s+water\s+(is\s+|was\s+)?(not\s+coming|not\s+available|stops?|issues?)\b/i,
      /\b(no|shortage\s+of|scarcity\s+of|lack\s+of)\s+water\b/i,
      /\bwater\s+(shortage|problem|problems|issues?|cuts?|scarcity|not\s+coming|stops?)\b/i,
      /\b(washing\s+machine|geyser|lift|elevator|ac|air\s*conditioner|cooler|refrigerator|fridge|water\s+purifier|ro|filter)\s+(is\s+|was\s+)?(not\s+working|damaged|broken|faulty|out\s+of\s+order)/i,
      /\b(broken|faulty|damaged)\s+(washing\s+machine|geyser|lift|elevator|ac|fridge)/i,
    ],
    positiveKeywords: [
      /\b(fast|high\s*speed|good|reliable|strong)\s+(wifi|internet)\b/i,
      /\b(wifi|internet)\s+(is\s+|was\s+)?(fast|good|reliable|great)\b/i,
      /\b(24\/7|continuous|uninterrupted)\s+(hot\s+water|power\s*backup|electricity|water\s*supply)\b/i,
    ],
  },
  {
    category: 'maintenance',
    label: 'Repairs & Maintenance',
    description: 'Sluggish response to plumbing leaks, electrical failures, wall seepage, or broken locks.',
    negativeKeywords: [
      /\b(leakage|seepage|broken\s+pipe|pipe\s+leakage|plumbing\s+issues?|plumbing\s+problems?|paint\s+peeling)\b/i,
      /\b(tap|flush|switch|door\s*lock|lock|window)\s+(is\s+|was\s+)?(broken|faulty|damaged|leaking|not\s+working)/i,
      /\b(broken|leaking)\s+(tap|flush|switch|pipe|lock)\b/i,
      /\b(no\s+one|nobody|never)\s+(repairs|fixes|attends\s+to|resolves)\b/i,
      /\b(repair|repairs|maintenance)\s+(is\s+|was\s+)?(slow|delayed|ignored|terrible|poor|bad|worst|pathetic)/i,
      /\b(poor|worst|terrible|pathetic|lack\s+of|no)\s+maintenance\b/i,
      /\btakes?\s+(weeks|days|months)\s+to\s+fix\b/i,
      /\bcomplaints?\s+(are\s+|were\s+)?(ignored|unaddressed|not\s+addressed|unresolved)\b/i,
    ],
    positiveKeywords: [
      /\b(prompt|quick|fast|good|regular)\s+(maintenance|repairs?|service)\b/i,
      /\bwell\s+maintained\b/i,
      /\bissues?\s+(resolved|fixed)\s+(quickly|promptly|immediately)\b/i,
    ],
  },
  {
    category: 'privacy',
    label: 'Curfew & Personal Privacy',
    description: 'Disruptions by unscheduled staff entry, overly intrusive gate restrictions, or lack of personal space.',
    negativeKeywords: [
      /\b(strict|rigid|harsh|early)\s+(curfews?|timings?|rules?|restrictions?|entry\s+time)\b/i,
      /\b(curfew|timings?|rules?)\s+(is|are|was|were)?\s*(too\s+|very\s+)?(strict|rigid|harsh|early)\b/i,
      /\b(gate|doors?)\s+(is\s+|gets?\s+)?locked\s+(at|early|by)\b/i,
      /\b(warden|caretaker|cleaning\s+staff|owner|staff|landlord)\s+(enters?|barges?|walks?|comes?)\s+(in\s+)?without\s+(knocking|permission|informing)/i,
      /\b(no|zero|lack\s+of)\s+privacy\b/i,
      /\b(intrusive|interfering|suffocating|disturbing|no\s+personal\s+space|feels?\s+like\s+a?\s*jail)\b/i,
      /\b(no|not\s+allowed)\s+(guests?|friends?|visitors?|parents?)\b/i,
      /\b(guests?|friends?|visitors?|parents?)\s+(are\s+)?not\s+allowed\b/i,
    ],
    positiveKeywords: [
      /\b(peaceful|private|spacious|independent|homely\s+feel|comfortable\s+space|good\s+privacy)\b/i,
      /\bflexible\s+(timings?|rules?|curfew)\b/i,
      /\bno\s+curfew\b/i,
    ],
  },
  {
    category: 'transport',
    label: 'Transit & Walking Accessibility',
    description: 'Distance to main tech park gates, lack of autos/buses, poorly paved access lanes, or isolated approaches.',
    negativeKeywords: [
      /\b(too\s+far|far\s+away|distant|isolated|remote|hard\s+to\s+reach|difficult\s+to\s+(reach|commute|access))\b/i,
      /\b(far|distant)\s+(from|to)\s+(tech\s*park|office|main\s*road|bus\s*stop|metro|gate|workplace)/i,
      /\b(no|hard\s+to\s+get|difficult\s+to\s+find)\s+(autos?|buses?|cabs?|uber|ola|transport)\b/i,
      /\b(cab|auto|uber|ola)\s+(drivers?\s+)?(refuse|cancel|charges?\s+extra|not\s+available)\b/i,
      /\b(long\s+walk|walk\s+is\s+too\s+long|tiring\s+walk)\b/i,
      /\b(dark|poorly\s+lit)\s+(road|street|lane|approach|area)\b/i,
      /\b(road|street|lane|approach)\s+(outside\s+)?(is\s+|was\s+)?(very\s+)?dark\b/i,
      /\b(no\s+street\s*lights?|street\s*lights?\s+(not\s+working|broken|absent))\b/i,
      /\b(muddy\s+road|bad\s+road|broken\s+road|potholes|waterlogged)\b/i,
    ],
    positiveKeywords: [
      /\b(walking\s+distance|walkable|very\s+close|near|accessible|convenient\s+location|prime\s+location)\b/i,
      /\b(close|near)\s+to\s+(the\s+)?(gate|office|tech\s*park|main\s*road|metro|bus\s*stop)\b/i,
      /\beasy\s+(commute|transport|access|connectivity)\b/i,
    ],
  },
  {
    category: 'pricing',
    label: 'Rent Transparency & Value',
    description: 'Hidden electricity per-unit rates, sudden maintenance surcharges, or overpriced double/triple sharing.',
    negativeKeywords: [
      /\b(overpriced|costly|too\s+costly|too\s+expensive|expensive|exorbitant|waste\s+of\s+money)\b/i,
      /\brent\s+(is\s+|was\s+)?(too\s+)?(high|expensive|costly|steep|unreasonable)\b/i,
      /\b(high|higher|steep)\s+rent\b/i,
      /\bnot\s+worth\s+(the\s+)?(rent|money|price|amount|cost)\b/i,
      /\b(hidden|extra|unexpected|arbitrary|unreasonable|additional)\s+(charges?|fees?|costs?|bills?|deductions?)\b/i,
      /\b(huge|high|exorbitant|commercial)\s+(electricity\s+bill|meter\s+bill|power\s+bill)\b/i,
      /\b(commercial|per\s+unit)\s+(electricity|meter|rate)\b/i,
      /\b(sudden|abrupt|frequent)\s+rent\s+hike\b/i,
      /\bhike(d)?\s+(the\s+)?rent\b/i,
    ],
    positiveKeywords: [
      /\b(reasonable|affordable|worth\s+the\s+money|worth\s+the\s+rent|worth\s+every\s+penny|value\s+for\s+money|fair\s+rent|budget\s+friendly|pocket\s+friendly)\b/i,
      /\b(rent|price)\s+(is\s+|was\s+)?(reasonable|affordable|fair|decent|cheap)\b/i,
    ],
  },
  {
    category: 'safety',
    label: 'Reviewer-Reported Security Notes',
    description: 'Unverified reviewer statements concerning nighttime security guards, CCTV status, or deserted lanes.',
    negativeKeywords: [
      /\b(not\s+safe|feels?\s+unsafe|felt\s+unsafe|unsafe\s+(for\s+women|at\s+night|area|environment|location|place))\b/i,
      /\b(no|without)\s+(security|guard|watchman|cctv|cameras?)\b/i,
      /\b(security|guard|watchman)\s+(is\s+|was\s+)?(sleeping|absent|missing|not\s+there|careless|unresponsive)\b/i,
      /\b(cctv|camera|cameras)\s+(is\s+|are\s+)?(not\s+working|broken|damaged|absent|off|faulty)\b/i,
      /\b(broken|damaged)\s+(lock|main\s+gate|door\s+lock|latch)\b/i,
      /\b(harassment|eve\s+teasing|catcalling|drunk\s+men|creepy\s+(men|people)|suspicious\s+people)\b/i,
      /\b(scary|frightening|creepy|deserted)\s+(at\s+night|lane|road|street|area)\b/i,
    ],
    positiveKeywords: [
      /\b(safe|secure|24\/7\s+security|active\s+guard|cctv\s+coverage|gated|feel\s+safe|felt\s+safe|safe\s+for\s+women)\b/i,
    ],
  },
];

const NEGATION_PREFIX =
  /\b(no|not|never|without|zero|free\s+of|hardly|scarcely|didn't|did\s+not|doesn't|does\s+not|don't|do\s+not|won't|wasn't|isn't|aren't|hardly\s+any)\s+(\w+\s+){0,2}$/i;

/**
 * Checks whether a keyword match within a sentence is preceded by a negation word
 * within the same clause (bounded by punctuation or contrastive conjunctions).
 */
function isNegated(text: string, matchIndex: number): boolean {
  const preceding = text.slice(0, matchIndex);
  // Isolate the immediate clause by splitting on clause boundaries (commas, semicolons, dashes, contrastive conjunctions)
  const clause = preceding.split(/[,;:|—\-]|\b(but|however|although|yet|though)\b/i).pop() || '';
  return NEGATION_PREFIX.test(clause.trim() + ' ');
}

/**
 * Splits text into individual sentences for contextual snippet extraction
 */
function splitIntoSentences(text: string): string[] {
  if (!text || !text.trim()) return [];
  const raw = text
    .split(/(?<=[.?!])\s+|\n+/)
    .map((s) => s.trim())
    .filter((s) => s.length >= 5);
  return raw.length > 0 ? raw : [text.trim()];
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
    // If review has empty or non-text content, skip extraction (do NOT infer complaints from star ratings)
    if (!review.text || !review.text.trim()) {
      return;
    }

    const sentences = splitIntoSentences(review.text);
    const matchedCategoriesForReview = new Set<ThemeCategory>();

    THEME_DEFINITIONS.forEach((def) => {
      let isNegative = false;
      let isPositive = false;
      let matchedSentence = '';

      // Check negative patterns in sentences
      for (const sentence of sentences) {
        for (const pattern of def.negativeKeywords) {
          const m = pattern.exec(sentence);
          if (m && !isNegated(sentence, m.index)) {
            isNegative = true;
            matchedSentence = sentence;
            break;
          }
        }
        if (isNegative) break;
      }

      // Fallback check against full review text if not matched in sentences
      if (!isNegative) {
        for (const pattern of def.negativeKeywords) {
          const m = pattern.exec(review.text);
          if (m && !isNegated(review.text, m.index)) {
            isNegative = true;
            matchedSentence =
              sentences.find((s) => pattern.test(s)) ||
              (review.text.length > 140 ? review.text.slice(0, 140) + '...' : review.text);
            break;
          }
        }
      }

      // Check positive keywords if not already negative
      if (!isNegative) {
        for (const sentence of sentences) {
          for (const pattern of def.positiveKeywords) {
            const m = pattern.exec(sentence);
            if (m && !isNegated(sentence, m.index)) {
              isPositive = true;
              matchedSentence = sentence;
              break;
            }
          }
          if (isPositive) break;
        }

        if (!isPositive) {
          for (const pattern of def.positiveKeywords) {
            const m = pattern.exec(review.text);
            if (m && !isNegated(review.text, m.index)) {
              isPositive = true;
              matchedSentence =
                sentences.find((s) => pattern.test(s)) ||
                (review.text.length > 140 ? review.text.slice(0, 140) + '...' : review.text);
              break;
            }
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
