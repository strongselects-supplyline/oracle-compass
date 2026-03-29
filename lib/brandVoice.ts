export const BRAND_VOICE = {
    entity: "past.El noir Records",
    artist: "Ethan Payton",
    location: "Lake Geneva, Wisconsin",
    coordinates: "42.5917° N, 88.4334° W",

    identity: {
        is: [
            "Late-night confidence — grooves without trying too hard",
            "Confessional, not performative",
            "Analog warmth in a digital world",
            "Midwestern solitude with cosmopolitan taste",
            "35mm grain — imperfect, intimate, real",
            "The sound of 3AM decisions you don't regret",
            "Slow-burn. The music finds you, you don't chase it.",
            "Full-spectrum R&B — bedroom to dance floor in one EP",
        ],
        isNot: [
            "Hype culture. Never 'fire', 'banger', 'slaps'",
            "Trend-chasing. No drill aesthetics, no trap-era SoundCloud",
            "Loud. Restraint is the brand.",
            "Meme-adjacent. The music is not content.",
            "Self-deprecating. Confidence is quiet, not absent.",
            "Over-polished mainstream R&B",
            "One-lane. The data proves range — 90 to 124 BPM, TrapSoul to House-R&B.",
        ],
    },

    voice: {
        rules: [
            "Lowercase by default in all social copy",
            "No exclamation marks. Ever.",
            "No hype words: fire, banger, lit, slaps, vibes, immaculate",
            "Specificity beats vagueness: '3AM in Lake Geneva' > 'late night vibes'",
            "Social captions: 1–3 lines max. Restraint.",
            "Dates stated plainly: 'friday.' not 'THIS FRIDAY 🔥'",
            "Maximum one emoji per post, only when it adds meaning",
            "Third-person bio: always 'Ethan Payton', never 'EP'",
            "The word 'vibe' is banned in all PR copy",
        ],
        onBrand: [
            "recorded this at 3am. wasn't planning on it.",
            "SEE ME — friday.",
            "this one took a long time to finish. it's done now.",
            "lake geneva, wi. 42° north.",
            "the ep is called ALL LOVE. april 24.",
            "same artist. different universe.",
        ],
        offBrand: [
            "NEW SINGLE OUT NOW!!! 🔥🔥🔥",
            "The vibes are immaculate",
            "Can't wait for you to hear this banger",
            "Dropping this fire record Friday!",
        ],
    },

    aesthetics: {
        palette: {
            primary: "#1a4a2e",    // Deep Emerald
            accent: "#d4a853",     // Warm Gold / Amber
            background: "#0a0a1a", // Deep Navy / Midnight
            highlight: "#f5f0e8",  // Soft Cream
            forbidden: ["neon", "hot pink", "primary red", "#ffffff"],
        },
        visual: [
            "35mm film grain — always grain, never clean digital",
            "Low light, golden hour, automobile interior",
            "Intimate spaces: studios, cars, living rooms",
            "Earth tones in wardrobe: greens, browns, creams",
            "No white backgrounds on merch or cover art",
            "Typography: minimal, weighted, tight tracking",
        ],
        references: {
            // Sonic Identity Map v4 — cross-release verified (March 24, 2026)
            // Data: 5,912 tracks analyzed across 72+ playlists, 4/4 EP tracks processed
            sonic: {
                // Permanent anchors — appear across 3+ release analyses
                permanentAnchors: ["Drake", "Bryson Tiller", "PARTYNEXTDOOR", "The Weeknd"],
                // Strong recurring — appear across 2+ releases
                recurring: ["Ty Dolla $ign", "Chris Brown", "Jhené Aiko", "Don Toliver", "Frank Ocean", "SZA", "6LACK"],
                // Per-track primary anchors
                perTrack: {
                    "SEE ME": { anchors: ["6LACK", "Drake", "Bryson Tiller", "PARTYNEXTDOOR"], lane: "Dark TrapSoul / OVO", bpm: 120 },
                    "East Side Love": { anchors: ["Bryson Tiller", "Drake", "Chris Brown", "PARTYNEXTDOOR"], lane: "Classic R&B Crossover", bpm: 98 },
                    "Like I Did": { anchors: ["Summer Walker", "T-Pain", "Ty Dolla $ign", "Eric Bellinger"], lane: "Modern TrapSoul Bounce", bpm: 110 },
                    "Sweet Frustration": { anchors: ["KAYTRANADA", "GoldLink", "Syd", "Channel Tres"], lane: "House-R&B / Electronic Soul", bpm: 124 },
                },
            },
            aesthetic: ["dvsn", "Snoh Aalegra", "Brent Faiyaz", "Giveon"],
            labelModel: ["OVO", "LVRN", "Dreamville"],
        },
    },

    // Flywheel strategy — verified March 24, 2026
    flywheel: {
        philosophy: "Top 2% Globally, Top 20% US. Exploit global positioning where conversions are cheap, let the algorithm promote upstream into saturated US pools.",
        tiers: {
            extendedDrive: "Niche underground + international audiences. Low CPC, high retention. Trains the algorithm.",
            midTier: "Cyanite seed matches. Algorithm validates sonic profile here.",
            coreDrive: "S-Tier pools (Drake, Bryson Tiller, KAYTRANADA). Algorithm graduates track here after engagement baseline established.",
        },
    },

    hardRules: [
        "No cover art outside the approved palette",
        "No collabs announced publicly before Ethan approves final creative",
        "Spotify editorial pitches always written in third person",
        "Merch never announced before design files exist",
        "No posting that breaks lowercase convention without explicit CEO approval",
        "Never lead copy with another artist's name — lead with the feeling, let the sound prove the comparison",
    ],
} as const;

export type BrandVoice = typeof BRAND_VOICE;
