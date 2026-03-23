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
        ],
        isNot: [
            "Hype culture. Never 'fire', 'banger', 'slaps'",
            "Trend-chasing. No drill aesthetics, no trap-era SoundCloud",
            "Loud. Restraint is the brand.",
            "Meme-adjacent. The music is not content.",
            "Self-deprecating. Confidence is quiet, not absent.",
            "Over-polished mainstream R&B",
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
            sonic: ["Bryson Tiller", "6LACK", "PARTYNEXTDOOR", "Daniel Caesar", "SZA", "Jhené Aiko"],
            aesthetic: ["Daniel Caesar", "Frank Ocean", "Brent Faiyaz", "SZA"],
            labelModel: ["pgLang", "XO", "OVO", "Dreamville"],
        },
    },

    hardRules: [
        "No cover art outside the approved palette",
        "No collabs announced publicly before Ethan approves final creative",
        "Spotify editorial pitches always written in third person",
        "Merch never announced before design files exist",
        "No posting that breaks lowercase convention without explicit CEO approval",
    ],
} as const;

export type BrandVoice = typeof BRAND_VOICE;
