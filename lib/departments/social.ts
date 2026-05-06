// lib/departments/social.ts
// Source: SOCIAL_COMMUNITY_PLAN.md (May 6, 2026)

export type CommunityTraceConfig = {
  dailyMinutes: number;
  frequency: string;
  dayTypes: string[]; // which day types trigger this
  actions: string[];
};

export const COMMUNITY_TRACE: CommunityTraceConfig = {
  dailyMinutes: 15,
  frequency: "Daily on BIZ days, optional on STUDIO days",
  dayTypes: ["BIZ DAY", "STUDIO + SAUNA DAY"],
  actions: [
    "Reply to 3-5 comments on your latest post (genuine, not emoji-only).",
    "DM 2-3 people who shared/saved your content (thank + personal note).",
    "Comment on 3-5 peer artist posts (substantive — 8+ words).",
    "Check story viewers → DM 1-2 new faces who watched multiple stories.",
    "15 min MAX. Set timer. Do not spiral into scrolling.",
  ],
};

// Unfollow program (Sunday ritual)
export const UNFOLLOW_PROGRAM = {
  currentRatio: "2200/2001", // as of May 6
  targetRatio: "4000/800",
  weeklyUnfollows: 50, // declining over 24 weeks
  dayOfWeek: 0, // Sunday
  instructions: [
    "Open IG → Following → Sort by 'Least Interacted With'.",
    "Unfollow 50 accounts (brands, dead accounts, non-engagers).",
    "NEVER unfollow: peer artists, superfans, real community members.",
    "Target: ratio flips visible in 4-6 weeks.",
    "Sunday ritual only. Do not do this other days.",
  ],
};

// DM Blitz protocol (release-adjacent)
export const DM_BLITZ = {
  triggerCondition: "Release within 3 days OR release within past 24 hours",
  tiers: [
    { name: "Core 50", description: "Top engagers — people who comment/save/share regularly", count: 50, message: "Personal + direct. 'Hey [name], just dropped [track]. You've been rocking with me — wanted you to hear it first. [link]'" },
    { name: "Warm 100", description: "Story viewers, likers, occasional commenters", count: 100, message: "Slightly less personal. 'New track just dropped — [track]. Think you'll love this one. [link]'" },
    { name: "Cold 50", description: "Mutual followers who haven't engaged yet", count: 50, message: "Introduction framing. 'Hey, been seeing you around. Just put out something new — [track]. Would love your thoughts. [link]'" },
  ],
};

// Superfan identification
export const SUPERFAN_CRITERIA = {
  identifiers: [
    "Saves 3+ posts in 30 days",
    "DM shares your content to others",
    "Comments on 50%+ of posts",
    "Stories mentions/tags you",
    "Attends live (when applicable)",
  ],
  reward: "Close Friends access (exclusive snippets, polls, early listens)",
  trackingMethod: "Manual — note top 50 in Notes app, update monthly",
};
