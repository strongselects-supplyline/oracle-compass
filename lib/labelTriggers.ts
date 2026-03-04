// lib/labelTriggers.ts
// These fire automatically. Ethan never has to initiate them.

export const LABEL_TRIGGERS = {

    // Fires when: Oracle release status changes to "upload_pending"
    // Fires: Marketing Director (14-day rollout) + PR Agent (all copy) + Ops checklist
    ON_RELEASE_LOGGED: "upload_pending",

    // Fires when: Cycle board track → "done"
    // Fires: A&R Agent (sonic positioning, sequencing recommendation)
    ON_TRACK_COMPLETED: "done",

    // Fires when: Content Factory V3 writes a new file to /output
    // Fires: PR Agent (generates caption variants for the render)
    // Implementation: file watcher via Vercel serverless or manual "I just ran CF" button in Label UI
    ON_CONTENT_FACTORY_RENDER: "new_render",

    // Fires when: Oracle release status changes to "live"
    // Fires: Post-release sequence (days +1, +3, +7 content prompts)
    ON_RELEASE_LIVE: "live",

    // Vercel Cron — Monday 6:00 AM CT
    // Fires: A&R Weekly Cultural Briefing (Spotify New Music Friday analysis)
    WEEKLY_CULTURAL_BRIEFING: "0 11 * * 1", // UTC = 6am CT

    // Vercel Cron — Sunday 11:00 PM CT
    // Fires: Operations compliance audit across all registry items
    WEEKLY_COMPLIANCE_AUDIT: "0 4 * * 1", // UTC = 11pm CT Sunday
} as const;
