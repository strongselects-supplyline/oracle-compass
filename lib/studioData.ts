/**
 * lib/studioData.ts
 * Pre-loaded 2026 release strategy data.
 * Ported from 2026-release-dashboard/src/data.js — READ-ONLY source.
 */

export type TrackStatus = 'unreleased' | 'uploaded' | 'single_live' | 'on_album' | 'album_live';

export interface Track {
    title: string;
    bpm: number | null;
    key: string;
    rbConf: number | null;
    sexy: number | null;
    chill: number | null;
    romantic: number | null;
    happy: number | null;
    uplifting: number | null;
    energetic: number | null;
    isrc: string;
    status: TrackStatus;
    releaseDate: string | null;
    pitchDeadline: string | null;
    isLeadSingle: boolean;
    leadRank: number | null;
}

export interface Project {
    id: string;
    name: string;
    color: string;
    emoji: string;
    role: string;
    trackCount: number;
    targetDate: string;
    tracks: Track[];
}

export interface Loosie {
    title: string;
    targetDate: string;
    notes: string;
    isrc: string;
    status: TrackStatus;
}

export interface TimelineEvent {
    date: string;
    label: string;
    project: string;
    type: 'single' | 'album' | 'loosie';
}

export const STATUSES: { value: TrackStatus; label: string; color: string }[] = [
    { value: 'unreleased', label: 'Unreleased', color: '#475569' },
    { value: 'uploaded', label: 'Uploaded', color: '#eab308' },
    { value: 'single_live', label: 'Single Live', color: '#22c55e' },
    { value: 'on_album', label: 'On Album', color: '#6366f1' },
    { value: 'album_live', label: 'Album Live', color: '#6ee7b7' },
];

const placeholderTracks = (prefix: string, count: number): Track[] =>
    Array.from({ length: count }, (_, i) => ({
        title: `${prefix} Track ${i + 1}`, bpm: null, key: '', rbConf: null, sexy: null,
        chill: null, romantic: null, happy: null, uplifting: null, energetic: null,
        isrc: '', status: 'unreleased', releaseDate: null, pitchDeadline: null,
        isLeadSingle: i === 0, leadRank: i === 0 ? 1 : null,
    }));

export const PROJECTS: Project[] = [
    {
        id: 'all-love', name: 'ALL LOVE', color: '#6ee7b7', emoji: '🔥',
        role: 'EP — 4-track drop Apr 24 (7 album tracks parked post-EP)', trackCount: 4, targetDate: '2026-04-24',
        tracks: [
            { title: 'I Like Girls', bpm: 107, key: 'F# min', rbConf: 0.74, sexy: 0.70, chill: 0.44, romantic: 0.32, happy: 0.35, uplifting: 0.34, energetic: 0.23, isrc: '', status: 'unreleased', releaseDate: null, pitchDeadline: null, isLeadSingle: false, leadRank: null },
            { title: 'SEE ME', bpm: 120, key: 'B min', rbConf: 0.68, sexy: 0.69, chill: 0.45, romantic: 0.46, happy: 0.50, uplifting: 0.46, energetic: 0.25, isrc: '', status: 'single_live', releaseDate: '2026-03-13', pitchDeadline: '2026-03-06', isLeadSingle: true, leadRank: 1 },
            { title: 'East Side Love', bpm: 98, key: 'C# min', rbConf: 0.59, sexy: 0.87, chill: 0.63, romantic: 0.62, happy: 0.38, uplifting: 0.05, energetic: 0.10, isrc: '', status: 'unreleased', releaseDate: '2026-04-03', pitchDeadline: '2026-03-27', isLeadSingle: true, leadRank: 2 },
            { title: 'Want U Bad', bpm: 114, key: 'G min', rbConf: 0.52, sexy: 0.56, chill: 0.65, romantic: 0.46, happy: 0.58, uplifting: 0.38, energetic: 0.12, isrc: '', status: 'unreleased', releaseDate: null, pitchDeadline: null, isLeadSingle: false, leadRank: null },
            { title: 'Green Light Patient', bpm: 104, key: '', rbConf: null, sexy: null, chill: null, romantic: null, happy: null, uplifting: null, energetic: null, isrc: '', status: 'unreleased', releaseDate: null, pitchDeadline: null, isLeadSingle: false, leadRank: null },
            { title: 'Luxury', bpm: 100, key: '', rbConf: null, sexy: null, chill: null, romantic: null, happy: null, uplifting: null, energetic: null, isrc: '', status: 'unreleased', releaseDate: null, pitchDeadline: null, isLeadSingle: false, leadRank: null },
            { title: 'Worth It', bpm: 97, key: 'F min', rbConf: 0.57, sexy: 0.79, chill: 0.57, romantic: 0.35, happy: 0.35, uplifting: 0.30, energetic: 0.15, isrc: '', status: 'unreleased', releaseDate: null, pitchDeadline: null, isLeadSingle: false, leadRank: null },
            { title: 'Sweet Frustration', bpm: 124, key: 'Bb min', rbConf: 0.25, sexy: 0.85, chill: 0.36, romantic: 0.37, happy: 0.69, uplifting: 0.58, energetic: 0.48, isrc: '', status: 'unreleased', releaseDate: '2026-04-10', pitchDeadline: '2026-04-03', isLeadSingle: true, leadRank: 3 },
            { title: 'Like I Did', bpm: 110, key: 'D min', rbConf: 0.57, sexy: 0.60, chill: 0.73, romantic: 0.63, happy: 0.69, uplifting: 0.29, energetic: 0.17, isrc: '', status: 'unreleased', releaseDate: '2026-04-17', pitchDeadline: '2026-04-10', isLeadSingle: true, leadRank: 4 },
            { title: 'Just Say So', bpm: 122, key: 'Bb min', rbConf: 0.60, sexy: 0.73, chill: 0.59, romantic: 0.57, happy: 0.56, uplifting: 0.44, energetic: 0.24, isrc: '', status: 'unreleased', releaseDate: null, pitchDeadline: null, isLeadSingle: false, leadRank: null },
            { title: 'Reconnect', bpm: 82, key: 'D maj', rbConf: 0.56, sexy: 0.88, chill: 0.52, romantic: 0.35, happy: 0.40, uplifting: 0.25, energetic: 0.12, isrc: '', status: 'unreleased', releaseDate: null, pitchDeadline: null, isLeadSingle: false, leadRank: null },
        ],
    },
    {
        id: 'all-love-deluxe', name: 'ALL LOVE DELUXE', color: '#fbbf24', emoji: '🎂',
        role: 'Companion / Disc 2, birthday drop', trackCount: 11, targetDate: '2026-04-28',
        tracks: placeholderTracks('Deluxe', 11),
    },
    {
        id: 'cream', name: 'CREAM', color: '#f472b6', emoji: '🔥',
        role: 'Summer statement', trackCount: 11, targetDate: '2026-07-10',
        tracks: placeholderTracks('CREAM', 11),
    },
    {
        id: 'freakshow', name: 'FREAKSHOW', color: '#c084fc', emoji: '🔥',
        role: 'Year-end closer', trackCount: 11, targetDate: '2026-10-23',
        tracks: [
            { title: 'Same Time', bpm: 108, key: 'C# min', rbConf: 0.78, sexy: 0.77, chill: 0.44, romantic: 0.39, happy: 0.53, uplifting: 0.52, energetic: 0.20, isrc: '', status: 'unreleased', releaseDate: '2026-10-03', pitchDeadline: '2026-09-25', isLeadSingle: true, leadRank: 1 },
            { title: 'Little Secret', bpm: 107, key: 'B min', rbConf: 0.70, sexy: 0.70, chill: 0.38, romantic: 0.39, happy: 0.45, uplifting: 0.35, energetic: 0.22, isrc: '', status: 'unreleased', releaseDate: '2026-10-17', pitchDeadline: '2026-10-10', isLeadSingle: true, leadRank: 2 },
            ...placeholderTracks('FREAKSHOW', 9),
        ],
    },
];

export const LOOSIES: Loosie[] = [
    { title: 'Loosie 1', targetDate: '2026-05-09', notes: 'Palette cleanser', isrc: '', status: 'unreleased' },
    { title: 'Loosie 2', targetDate: '2026-05-23', notes: 'Set up CREAM energy', isrc: '', status: 'unreleased' },
    { title: 'Loosie 3', targetDate: '2026-08-01', notes: 'Keep presence', isrc: '', status: 'unreleased' },
    { title: 'Loosie 4', targetDate: '2026-08-22', notes: 'Transition to FREAKSHOW', isrc: '', status: 'unreleased' },
    { title: 'Loosie 5', targetDate: '2026-09-12', notes: 'Build anticipation', isrc: '', status: 'unreleased' },
    { title: 'Loosie 6', targetDate: '2026-11-13', notes: 'Post-FREAKSHOW', isrc: '', status: 'unreleased' },
];

export const TIMELINE_EVENTS: TimelineEvent[] = [
    { date: '2026-03-13', label: 'SEE ME', project: 'all-love', type: 'single' },
    { date: '2026-04-03', label: 'East Side Love', project: 'all-love', type: 'single' },
    { date: '2026-04-10', label: 'Sweet Frustration', project: 'all-love', type: 'single' },
    { date: '2026-04-17', label: 'Like I Did', project: 'all-love', type: 'single' },
    { date: '2026-04-24', label: 'ALL LOVE EP', project: 'all-love', type: 'album' },
    { date: '2026-04-11', label: 'Deluxe Single', project: 'all-love-deluxe', type: 'single' },
    { date: '2026-04-28', label: 'DELUXE 🎂', project: 'all-love-deluxe', type: 'album' },
    { date: '2026-05-09', label: 'L1', project: 'loosies', type: 'loosie' },
    { date: '2026-05-23', label: 'L2', project: 'loosies', type: 'loosie' },
    { date: '2026-06-13', label: 'CREAM S1', project: 'cream', type: 'single' },
    { date: '2026-07-03', label: 'CREAM S2', project: 'cream', type: 'single' },
    { date: '2026-07-10', label: 'CREAM', project: 'cream', type: 'album' },
    { date: '2026-08-01', label: 'L3', project: 'loosies', type: 'loosie' },
    { date: '2026-08-22', label: 'L4', project: 'loosies', type: 'loosie' },
    { date: '2026-09-12', label: 'L5', project: 'loosies', type: 'loosie' },
    { date: '2026-10-03', label: 'Same Time', project: 'freakshow', type: 'single' },
    { date: '2026-10-17', label: 'Little Secret', project: 'freakshow', type: 'single' },
    { date: '2026-10-23', label: 'FREAKSHOW', project: 'freakshow', type: 'album' },
    { date: '2026-11-13', label: 'L6', project: 'loosies', type: 'loosie' },
];
