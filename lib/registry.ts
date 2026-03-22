export type RegistrationStatus = "complete" | "pending" | "not_started";

export type TrackRegistry = {
    title: string;
    isrc: string;
    upc?: string;
    releaseDate: string;
    ascap: RegistrationStatus;
    mlc: RegistrationStatus;
    soundExchange: RegistrationStatus;
    songtrust: RegistrationStatus;
    copyrightOffice: RegistrationStatus;
    instrumentalRendered: boolean;
    splitSheetSigned: boolean;
    collaborators: string[];
    notes: string;
};

// Ethan writes to this file after completing each registration.
// The Operations agent reads it. No API ever writes to this file.
// NOTE: Songtrust is now owned by UMG (Downtown acquisition closed Feb 21, 2026).
// Verify login credentials still work before relying on Songtrust registrations.

export const REGISTRY: TrackRegistry[] = [
    {
        title: "SEE ME",
        isrc: "", // ISRC pending from Amuse — human task: pull from Amuse app and update here
        releaseDate: "2026-03-13",
        ascap: "pending",
        mlc: "pending",
        soundExchange: "complete",
        songtrust: "pending",
        copyrightOffice: "not_started",
        instrumentalRendered: false,
        splitSheetSigned: false,
        collaborators: [],
        notes: "Live Mar 13. ISRC pending from Amuse — update then complete ASCAP/MLC/Songtrust. Verify Songtrust login post-UMG acquisition.",
    },
    {
        title: "East Side Love",
        isrc: "",
        releaseDate: "2026-04-03",
        ascap: "not_started",
        mlc: "not_started",
        soundExchange: "complete",
        songtrust: "not_started",
        copyrightOffice: "not_started",
        instrumentalRendered: false,
        splitSheetSigned: false,
        collaborators: [],
        notes: "EP single 2. Upload to Amuse by Mar 30. Drops Apr 3.",
    },
    {
        title: "Sweet Frustration",
        isrc: "",
        releaseDate: "2026-04-10",
        ascap: "not_started",
        mlc: "not_started",
        soundExchange: "complete",
        songtrust: "not_started",
        copyrightOffice: "not_started",
        instrumentalRendered: false,
        splitSheetSigned: false,
        collaborators: [],
        notes: "EP single 3. Upload to Amuse by Apr 6. Drops Apr 10. Needs mix/master — target close Apr 1.",
    },
    {
        title: "Like I Did",
        isrc: "",
        releaseDate: "2026-04-17",
        ascap: "not_started",
        mlc: "not_started",
        soundExchange: "complete",
        songtrust: "not_started",
        copyrightOffice: "not_started",
        instrumentalRendered: false,
        splitSheetSigned: false,
        collaborators: [],
        notes: "EP single 4 (final single before EP drop). Upload to Amuse by Apr 13. Drops Apr 17. Needs mix/master — target close Apr 1.",
    },
    // ── PARKED TRACKS (post-EP release TBD) ──
    // These are NOT on the EP. Kill List does NOT surface tasks for these.
    // Production is a stretch goal. Registration happens post-EP.
    {
        title: "I Like Girls",
        isrc: "",
        releaseDate: "", // TBD — post-EP release
        ascap: "not_started",
        mlc: "not_started",
        soundExchange: "not_started",
        songtrust: "not_started",
        copyrightOffice: "not_started",
        instrumentalRendered: false,
        splitSheetSigned: false,
        collaborators: [],
        notes: "PARKED. Post-EP release TBD.",
    },
    {
        title: "Want U Bad",
        isrc: "",
        releaseDate: "",
        ascap: "not_started",
        mlc: "not_started",
        soundExchange: "not_started",
        songtrust: "not_started",
        copyrightOffice: "not_started",
        instrumentalRendered: false,
        splitSheetSigned: false,
        collaborators: [],
        notes: "PARKED. Post-EP release TBD.",
    },
    {
        title: "Green Light Patient",
        isrc: "",
        releaseDate: "",
        ascap: "not_started",
        mlc: "not_started",
        soundExchange: "not_started",
        songtrust: "not_started",
        copyrightOffice: "not_started",
        instrumentalRendered: false,
        splitSheetSigned: false,
        collaborators: [],
        notes: "PARKED. Post-EP release TBD.",
    },
    {
        title: "Luxury",
        isrc: "",
        releaseDate: "",
        ascap: "not_started",
        mlc: "not_started",
        soundExchange: "not_started",
        songtrust: "not_started",
        copyrightOffice: "not_started",
        instrumentalRendered: false,
        splitSheetSigned: false,
        collaborators: [],
        notes: "PARKED. Post-EP release TBD.",
    },
    {
        title: "Worth It",
        isrc: "",
        releaseDate: "",
        ascap: "not_started",
        mlc: "not_started",
        soundExchange: "not_started",
        songtrust: "not_started",
        copyrightOffice: "not_started",
        instrumentalRendered: false,
        splitSheetSigned: false,
        collaborators: [],
        notes: "PARKED. Post-EP release TBD.",
    },
    {
        title: "Just Say So",
        isrc: "",
        releaseDate: "",
        ascap: "not_started",
        mlc: "not_started",
        soundExchange: "not_started",
        songtrust: "not_started",
        copyrightOffice: "not_started",
        instrumentalRendered: false,
        splitSheetSigned: false,
        collaborators: [],
        notes: "PARKED. Post-EP release TBD.",
    },
    {
        title: "Reconnect",
        isrc: "",
        releaseDate: "",
        ascap: "not_started",
        mlc: "not_started",
        soundExchange: "not_started",
        songtrust: "not_started",
        copyrightOffice: "not_started",
        instrumentalRendered: false,
        splitSheetSigned: false,
        collaborators: [],
        notes: "PARKED. Post-EP release TBD.",
    },
    {
        title: "ALL LOVE (EP)",
        isrc: "",
        upc: "", // EP needs UPC (not ISRC) — check Amuse after upload
        releaseDate: "2026-04-24",
        ascap: "not_started",
        mlc: "not_started",
        soundExchange: "not_started",
        songtrust: "not_started",
        copyrightOffice: "not_started",
        instrumentalRendered: false, // N/A for EP entity but keeps type consistent
        splitSheetSigned: false,
        collaborators: [],
        notes: "EP entity. Upload to Amuse by Apr 14. Drops Apr 24. Needs: EP cover art, track sequencing, UPC, EP-level Spotify editorial pitch.",
    },
];

// Operations agent Oracle escalation rules:
// - ascap/mlc/songtrust not "complete" within 7 days of release → AMBER decree
// - instrumentalRendered: false within 14 days of release → AMBER decree
// - ANY not_started item within 3 days of release → RED decree
// - copyright_office not_started within 90 days of release → AMBER decree (rolling)
