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
        isrc: "", // ISRC pending from Amuse — update once received
        releaseDate: "2026-03-13",
        ascap: "pending",
        mlc: "pending",
        soundExchange: "complete",
        songtrust: "pending",
        copyrightOffice: "not_started",
        instrumentalRendered: false,
        splitSheetSigned: false,
        collaborators: [],
        notes: "Master + cover art submitted to Amuse Mar 12. Going live Mar 13. ISRC pending from Amuse — update and complete ASCAP/MLC/Songtrust registrations once received. Verify Songtrust login post-UMG.",
    },
    {
        title: "ESL",
        isrc: "",
        releaseDate: "2026-03-20",
        ascap: "not_started",
        mlc: "not_started",
        soundExchange: "complete",
        songtrust: "not_started",
        copyrightOffice: "not_started",
        instrumentalRendered: false,
        splitSheetSigned: false,
        collaborators: [],
        notes: "",
    },
    {
        title: "Sweet Frustration",
        isrc: "",
        releaseDate: "2026-03-27",
        ascap: "not_started",
        mlc: "not_started",
        soundExchange: "complete",
        songtrust: "not_started",
        copyrightOffice: "not_started",
        instrumentalRendered: false,
        splitSheetSigned: false,
        collaborators: [],
        notes: "",
    },
    {
        title: "I Like Girls",
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
        notes: "Album-only track (intro). Still needs full PRO registration before Apr 10.",
    },
    {
        title: "Like I Did",
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
        notes: "Final single before album drop.",
    },
    // ALL LOVE album tracks: add each as they complete production
];

// Operations agent Oracle escalation rules:
// - ascap/mlc/songtrust not "complete" within 7 days of release → AMBER decree
// - instrumentalRendered: false within 14 days of release → AMBER decree
// - ANY not_started item within 3 days of release → RED decree
// - copyright_office not_started within 90 days of release → AMBER decree (rolling)
