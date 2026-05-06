// lib/departments/marketing.ts
// Source: MARKETING_PAID_STRATEGY.md (May 6, 2026)

export type SpendTrigger = {
  id: string;
  channel: "meta" | "spotify_marquee" | "spotify_showcase" | "discovery_mode";
  condition: string;
  metric: string;
  threshold: number;
  budget: number;
  instructions: string[];
};

export const BUDGET_RULES = {
  monthlyCap: 250, // $250 hard ceiling
  incomePercentage: 0.15, // 15% of income MAXIMUM
  testBudget: 50, // $50 per test
  killThreshold: { costPerStream: 0.10 }, // Kill ad if CPS > $0.10
  neverSpendWithout: "Organic signal confirmation (sends/reach ≥ 3% OR velocity 100+/day)",
};

export const SPEND_TRIGGERS: SpendTrigger[] = [
  {
    id: "meta-reel-ad",
    channel: "meta",
    condition: "Reel achieves sends-per-reach ≥ 3% organically",
    metric: "sends_per_reach",
    threshold: 0.03,
    budget: 50,
    instructions: [
      "ONLY boost reels that already have organic proof (3%+ sends/reach).",
      "Meta Ads Manager → Create → Traffic campaign.",
      "Audience: Lookalike 1% (from IG engagers) + Interest-based split.",
      "Budget: $50 test, 3 days, $16.67/day.",
      "Destination: Smart Link (NOT direct Spotify link). Pixel on smart link.",
      "Kill criteria: Cost per stream > $0.10 after 48 hrs → kill immediately.",
      "Scale criteria: CPS < $0.05 → double budget for 3 more days.",
    ],
  },
  {
    id: "spotify-marquee",
    channel: "spotify_marquee",
    condition: "Release week only. Minimum $100 budget.",
    metric: "release_week",
    threshold: 1,
    budget: 100,
    instructions: [
      "Spotify for Artists → Campaign Kit → Marquee.",
      "Audience: 'Previously Engaged' (people who've listened before).",
      "Budget: $100 minimum (Spotify's floor).",
      "Expected: $0.30-$0.70 per click, ~15% stream-through rate.",
      "Only use on EP release (May 15) and first vault single (May 30).",
      "Do NOT use on every single — reserve for highest-conviction drops.",
    ],
  },
  {
    id: "spotify-showcase",
    channel: "spotify_showcase",
    condition: "Track has 7-day save rate > 3% AND is past release week",
    metric: "save_rate_7day",
    threshold: 0.03,
    budget: 50,
    instructions: [
      "Spotify for Artists → Campaign Kit → Showcase.",
      "Use for catalog tracks that prove momentum post-release.",
      "Budget: $50 per burst (3-7 days).",
      "Expected: $0.15-$0.50 per click.",
      "Monitors 'intent rate' (how many click → play → save).",
    ],
  },
  {
    id: "discovery-mode",
    channel: "discovery_mode",
    condition: "Track save rate > 3% for 7+ days",
    metric: "save_rate_sustained",
    threshold: 0.03,
    budget: 0, // $0 upfront — 30% royalty trade
    instructions: [
      "Spotify for Artists → Campaign Kit → Discovery Mode.",
      "Toggle ON for tracks with sustained save rate > 3%.",
      "Cost: 30% royalty reduction on Discovery Mode plays.",
      "Benefit: +50% saves, +44% playlist adds (Spotify's claimed stats).",
      "This is FREE in cash terms. Use aggressively on proven tracks.",
      "Turn OFF if save rate drops below 2% for 14 days.",
    ],
  },
];

// Campaign calendar (hardcoded for current release cycle)
export const CAMPAIGN_CALENDAR: { date: string; track: string; actions: string[] }[] = [
  { date: "2026-05-15", track: "ALL LOVE EP", actions: ["Marquee ($100)", "Meta Reel Ad if sends/reach ≥ 3%"] },
  { date: "2026-05-22", track: "ALL LOVE EP", actions: ["Check 7-day save rates per track", "Activate Discovery Mode on 3%+ tracks", "Showcase on best-performing EP track"] },
  { date: "2026-05-30", track: "Like I Did", actions: ["Marquee ($100)", "Meta Reel Ad if organic proof exists"] },
  { date: "2026-06-06", track: "Like I Did", actions: ["Discovery Mode if save rate holds", "Showcase if warranted"] },
  { date: "2026-06-13", track: "I Like Girls", actions: ["Meta Reel Ad ($50 test ONLY if organic proof)"] },
  { date: "2026-06-27", track: "Worth It", actions: ["Meta Reel Ad ($50 test ONLY if organic proof)"] },
  { date: "2026-07-11", track: "Just Say So", actions: ["Meta Reel Ad ($50 test ONLY if organic proof)"] },
  { date: "2026-07-25", track: "Reconnect", actions: ["Meta Reel Ad ($50 test ONLY if organic proof)"] },
];
