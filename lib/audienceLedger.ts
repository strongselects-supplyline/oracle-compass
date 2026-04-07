// lib/audienceLedger.ts
// Audience Intelligence Engine — first-party CRM indexed by past.El's catalog.
// Populated manually during IG Community Sprint blocks on BIZ DAYs (Apr 25+).
//
// Data model: Track → Artist (all tiers) → Fan → Community Nodes → Friend Networks
// Storage: IndexedDB via compass_store. Key: 'audience_ledger'
// Stats are always computed, never stored — same pattern as killList.ts
//
// Built: Apr 7, 2026

import { getStoreValue, setStoreValue } from '@/lib/db';

// ── Types ────────────────────────────────────────────────────────────────────

export type ArtistTier = 'T1' | 'T2' | 'T3' | 'T4';

export type CommunityType = 'meme' | 'curator' | 'subthread' | 'brand' | 'event' | 'location' | 'other';

export type LedgerCommunity = {
  handle: string;           // e.g. "@soulectionmemes"
  type: CommunityType;
  reach?: number;           // follower count if visible in bio
  notes?: string;
};

export type LedgerFriend = {
  handle: string;
  city?: string;
  discoveredVia: string;    // which fan's page revealed them
  addedDate: string;
};

export type LedgerFan = {
  handle: string;
  name?: string;
  city?: string;
  contact?: string;         // snap/number/email if visible in bio
  sourceArtist: string;     // which artist's page you found them on
  addedDate: string;
  communities: LedgerCommunity[];   // pages/accounts they publicly engage with
  friendNetwork: LedgerFriend[];    // adjacent profiles from tagged posts/reposts
};

export type LedgerArtist = {
  name: string;
  igHandle?: string;        // manually verified from IG bio
  city?: string;            // from IG bio
  tier: ArtistTier;
  tracks: string[];         // track IDs from gorilla-geo (e.g. 'sweet_frustration')
  fans: LedgerFan[];
  lastSprinted?: string;    // ISO date — last time you ran a sprint block on this artist
  spotifyId?: string;       // from tier-classified.json if available
};

export type AudienceLedger = {
  version: number;
  lastUpdated: string;
  artists: LedgerArtist[];
};

// ── Computed stat types (never stored, always derived on read) ────────────────

export type CommunityNode = {
  handle: string;
  type: CommunityType;
  frequency: number;          // how many fans engage here (across all artists)
  reach?: number;
  connectedTracks: string[];  // which of your tracks' fan ecosystems surface this node
  connectedArtists: string[]; // which artist pages' fans engage with this community
};

export type CityNode = {
  city: string;
  artistCount: number;
  fanCount: number;
  total: number;
  tracks: string[];           // which tracks surfaced connections in this city
};

export type LedgerStats = {
  totalArtists: number;
  verifiedArtists: number;          // artists with confirmed igHandle
  totalFans: number;
  totalCommunityMentions: number;   // raw count (includes duplicates)
  totalCommunities: number;         // unique community handles
  citiesReached: number;
  topCities: CityNode[];
  topCommunities: CommunityNode[];  // sorted by frequency
  byTier: Record<ArtistTier, number>;
  byTrack: Record<string, { artists: number; fans: number; communities: number }>;
  crossTrackFans: Array<LedgerFan & { appearsIn: string[] }>; // fans in 2+ artist communities
};

// ── Storage ───────────────────────────────────────────────────────────────────

const LEDGER_KEY = 'audience_ledger';
const LEDGER_VERSION = 1;

function emptyLedger(): AudienceLedger {
  return {
    version: LEDGER_VERSION,
    lastUpdated: new Date().toISOString().split('T')[0],
    artists: [],
  };
}

// ── Core CRUD ─────────────────────────────────────────────────────────────────

export async function getLedger(): Promise<AudienceLedger> {
  const stored = await getStoreValue<AudienceLedger>(LEDGER_KEY);
  if (!stored) return emptyLedger();
  return stored;
}

export async function saveLedger(ledger: AudienceLedger): Promise<void> {
  const updated = { ...ledger, lastUpdated: new Date().toISOString().split('T')[0] };
  await setStoreValue(LEDGER_KEY, updated);
}

export async function addArtist(artist: Partial<LedgerArtist> & { name: string; tier: ArtistTier; tracks: string[] }): Promise<void> {
  const ledger = await getLedger();
  const existing = ledger.artists.find(a => a.name.toLowerCase() === artist.name.toLowerCase());
  if (existing) {
    // Merge tracks if already present
    const mergedTracks = Array.from(new Set([...existing.tracks, ...artist.tracks]));
    existing.tracks = mergedTracks;
    if (artist.igHandle) existing.igHandle = artist.igHandle;
    if (artist.city) existing.city = artist.city;
    if (artist.spotifyId) existing.spotifyId = artist.spotifyId;
  } else {
    ledger.artists.push({
      fans: [],
      ...artist,
    });
  }
  await saveLedger(ledger);
}

export async function updateArtist(name: string, updates: Partial<LedgerArtist>): Promise<void> {
  const ledger = await getLedger();
  const idx = ledger.artists.findIndex(a => a.name.toLowerCase() === name.toLowerCase());
  if (idx === -1) return;
  ledger.artists[idx] = { ...ledger.artists[idx], ...updates };
  await saveLedger(ledger);
}

export async function addFan(artistName: string, fan: Omit<LedgerFan, 'communities' | 'friendNetwork' | 'addedDate'>): Promise<void> {
  const ledger = await getLedger();
  const artist = ledger.artists.find(a => a.name.toLowerCase() === artistName.toLowerCase());
  if (!artist) return;
  const existing = artist.fans.find(f => f.handle.toLowerCase() === fan.handle.toLowerCase());
  if (existing) return; // no duplicates
  artist.fans.push({
    ...fan,
    sourceArtist: artistName,
    addedDate: new Date().toISOString().split('T')[0],
    communities: [],
    friendNetwork: [],
  });
  await saveLedger(ledger);
}

export async function addCommunityToFan(
  artistName: string,
  fanHandle: string,
  community: LedgerCommunity
): Promise<void> {
  const ledger = await getLedger();
  const artist = ledger.artists.find(a => a.name.toLowerCase() === artistName.toLowerCase());
  if (!artist) return;
  const fan = artist.fans.find(f => f.handle.toLowerCase() === fanHandle.toLowerCase());
  if (!fan) return;
  const exists = fan.communities.find(c => c.handle.toLowerCase() === community.handle.toLowerCase());
  if (!exists) fan.communities.push(community);
  await saveLedger(ledger);
}

export async function addQuickCommunity(community: LedgerCommunity & { sourceArtist: string }): Promise<void> {
  // Add a community node directly to an artist's first fan, or create a sentinel fan entry
  // Used when you spot a community while browsing without a specific fan to attach it to
  const ledger = await getLedger();
  const artist = ledger.artists.find(a => a.name.toLowerCase() === community.sourceArtist.toLowerCase());
  if (!artist) return;

  // Attach to existing sentinel or create one
  const SENTINEL = '__community_node__';
  let sentinel = artist.fans.find(f => f.handle === SENTINEL);
  if (!sentinel) {
    sentinel = {
      handle: SENTINEL,
      sourceArtist: community.sourceArtist,
      addedDate: new Date().toISOString().split('T')[0],
      communities: [],
      friendNetwork: [],
    };
    artist.fans.push(sentinel);
  }
  const exists = sentinel.communities.find(c => c.handle.toLowerCase() === community.handle.toLowerCase());
  if (!exists) sentinel.communities.push(community);
  await saveLedger(ledger);
}

export async function addFriendToFan(
  artistName: string,
  fanHandle: string,
  friend: Omit<LedgerFriend, 'addedDate'>
): Promise<void> {
  const ledger = await getLedger();
  const artist = ledger.artists.find(a => a.name.toLowerCase() === artistName.toLowerCase());
  if (!artist) return;
  const fan = artist.fans.find(f => f.handle.toLowerCase() === fanHandle.toLowerCase());
  if (!fan) return;
  const exists = fan.friendNetwork.find(fr => fr.handle.toLowerCase() === friend.handle.toLowerCase());
  if (!exists) fan.friendNetwork.push({ ...friend, addedDate: new Date().toISOString().split('T')[0] });
  await saveLedger(ledger);
}

export async function markArtistSprinted(name: string): Promise<void> {
  await updateArtist(name, { lastSprinted: new Date().toISOString().split('T')[0] });
}

export async function removeArtistFan(artistName: string, fanHandle: string): Promise<void> {
  const ledger = await getLedger();
  const artist = ledger.artists.find(a => a.name.toLowerCase() === artistName.toLowerCase());
  if (!artist) return;
  artist.fans = artist.fans.filter(f => f.handle !== fanHandle);
  await saveLedger(ledger);
}

// ── Query Functions ───────────────────────────────────────────────────────────

export async function getLedgerStats(): Promise<LedgerStats> {
  const ledger = await getLedger();
  const artists = ledger.artists;

  const byTier: Record<ArtistTier, number> = { T1: 0, T2: 0, T3: 0, T4: 0 };
  const byTrack: Record<string, { artists: number; fans: number; communities: number }> = {};
  const cityMap = new Map<string, CityNode>();
  const communityMap = new Map<string, CommunityNode>();
  const fanTrackMap = new Map<string, string[]>(); // fanHandle → tracks they appeared in

  let totalFans = 0;
  let totalCommunityMentions = 0;
  let verifiedArtists = 0;

  for (const artist of artists) {
    // Tier counts
    byTier[artist.tier]++;
    if (artist.igHandle) verifiedArtists++;

    // Track aggregation
    for (const trackId of artist.tracks) {
      if (!byTrack[trackId]) byTrack[trackId] = { artists: 0, fans: 0, communities: 0 };
      byTrack[trackId].artists++;
    }

    // City — artist
    if (artist.city) {
      const city = normalizeCity(artist.city);
      if (!cityMap.has(city)) cityMap.set(city, { city, artistCount: 0, fanCount: 0, total: 0, tracks: [] });
      const node = cityMap.get(city)!;
      node.artistCount++;
      node.total++;
      for (const t of artist.tracks) {
        if (!node.tracks.includes(t)) node.tracks.push(t);
      }
    }

    // Fans
    const realFans = artist.fans.filter(f => f.handle !== '__community_node__');
    totalFans += realFans.length;
    for (const trackId of artist.tracks) byTrack[trackId].fans += realFans.length;

    for (const fan of realFans) {
      // Cross-track detection
      const key = fan.handle.toLowerCase();
      if (!fanTrackMap.has(key)) fanTrackMap.set(key, []);
      for (const t of artist.tracks) {
        if (!fanTrackMap.get(key)!.includes(t)) fanTrackMap.get(key)!.push(t);
      }

      // City — fan
      if (fan.city) {
        const city = normalizeCity(fan.city);
        if (!cityMap.has(city)) cityMap.set(city, { city, artistCount: 0, fanCount: 0, total: 0, tracks: [] });
        const node = cityMap.get(city)!;
        node.fanCount++;
        node.total++;
        for (const t of artist.tracks) {
          if (!node.tracks.includes(t)) node.tracks.push(t);
        }
      }

      // Communities
      for (const community of fan.communities) {
        totalCommunityMentions++;
        for (const trackId of artist.tracks) byTrack[trackId].communities++;
        const cKey = community.handle.toLowerCase();
        if (!communityMap.has(cKey)) {
          communityMap.set(cKey, {
            handle: community.handle,
            type: community.type,
            frequency: 0,
            reach: community.reach,
            connectedTracks: [],
            connectedArtists: [],
          });
        }
        const cNode = communityMap.get(cKey)!;
        cNode.frequency++;
        if (community.reach && !cNode.reach) cNode.reach = community.reach;
        for (const t of artist.tracks) {
          if (!cNode.connectedTracks.includes(t)) cNode.connectedTracks.push(t);
        }
        if (!cNode.connectedArtists.includes(artist.name)) cNode.connectedArtists.push(artist.name);
      }
    }

    // Sentinel fan communities (quick-adds not attached to a specific fan)
    const sentinel = artist.fans.find(f => f.handle === '__community_node__');
    if (sentinel) {
      for (const community of sentinel.communities) {
        totalCommunityMentions++;
        const cKey = community.handle.toLowerCase();
        if (!communityMap.has(cKey)) {
          communityMap.set(cKey, {
            handle: community.handle,
            type: community.type,
            frequency: 0,
            reach: community.reach,
            connectedTracks: [],
            connectedArtists: [],
          });
        }
        const cNode = communityMap.get(cKey)!;
        cNode.frequency++;
        if (community.reach && !cNode.reach) cNode.reach = community.reach;
        for (const t of artist.tracks) {
          if (!cNode.connectedTracks.includes(t)) cNode.connectedTracks.push(t);
        }
      }
    }
  }

  // Cross-track fans: appeared in fan lists of 2+ different tracks
  const crossTrackFans: Array<LedgerFan & { appearsIn: string[] }> = [];
  for (const [handle, tracks] of fanTrackMap.entries()) {
    if (tracks.length >= 2) {
      const fan = findFanByHandle(artists, handle);
      if (fan) crossTrackFans.push({ ...fan, appearsIn: tracks });
    }
  }

  const topCities = Array.from(cityMap.values()).sort((a, b) => b.total - a.total).slice(0, 10);
  const topCommunities = Array.from(communityMap.values()).sort((a, b) => b.frequency - a.frequency).slice(0, 20);

  return {
    totalArtists: artists.length,
    verifiedArtists,
    totalFans,
    totalCommunityMentions,
    totalCommunities: communityMap.size,
    citiesReached: cityMap.size,
    topCities,
    topCommunities,
    byTier,
    byTrack,
    crossTrackFans,
  };
}

export async function getUntouched(tier?: ArtistTier): Promise<LedgerArtist[]> {
  const ledger = await getLedger();
  return ledger.artists
    .filter(a => !a.lastSprinted && (!tier || a.tier === tier))
    .sort((a, b) => tierPriority(a.tier) - tierPriority(b.tier));
}

export async function queryByCity(city: string): Promise<{ artists: LedgerArtist[]; fans: LedgerFan[] }> {
  const ledger = await getLedger();
  const normalized = normalizeCity(city);
  const matchArtists = ledger.artists.filter(a => a.city && normalizeCity(a.city) === normalized);
  const matchFans: LedgerFan[] = [];
  for (const artist of ledger.artists) {
    for (const fan of artist.fans) {
      if (fan.handle !== '__community_node__' && fan.city && normalizeCity(fan.city) === normalized) {
        matchFans.push(fan);
      }
    }
  }
  return { artists: matchArtists, fans: matchFans };
}

export async function queryByTrack(trackId: string): Promise<LedgerArtist[]> {
  const ledger = await getLedger();
  return ledger.artists.filter(a => a.tracks.includes(trackId));
}

export async function queryByCommunity(handle: string): Promise<{ fans: LedgerFan[]; artists: LedgerArtist[] }> {
  const ledger = await getLedger();
  const fans: LedgerFan[] = [];
  const artistNames = new Set<string>();
  for (const artist of ledger.artists) {
    for (const fan of artist.fans) {
      if (fan.communities.some(c => c.handle.toLowerCase() === handle.toLowerCase())) {
        fans.push(fan);
        artistNames.add(artist.name);
      }
    }
  }
  const artists = ledger.artists.filter(a => artistNames.has(a.name));
  return { fans, artists };
}

export async function getTopCommunities(limit = 10): Promise<CommunityNode[]> {
  const stats = await getLedgerStats();
  return stats.topCommunities.slice(0, limit);
}

export async function getCrossTrackFans(): Promise<Array<LedgerFan & { appearsIn: string[] }>> {
  const stats = await getLedgerStats();
  return stats.crossTrackFans;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function normalizeCity(city: string): string {
  return city.trim().toLowerCase().replace(/\s+/g, ' ');
}

function tierPriority(tier: ArtistTier): number {
  return { T4: 0, T3: 1, T2: 2, T1: 3 }[tier];
}

function findFanByHandle(artists: LedgerArtist[], handle: string): LedgerFan | undefined {
  for (const artist of artists) {
    const fan = artist.fans.find(f => f.handle.toLowerCase() === handle);
    if (fan) return fan;
  }
  return undefined;
}

// ── Track label helpers (matches gorilla-geo IDs) ─────────────────────────────

export const TRACK_LABELS: Record<string, string> = {
  see_me: 'SEE ME',
  east_side_love: 'East Side Love',
  sweet_frustration: 'Sweet Frustration',
  like_i_did: 'Like I Did',
  i_like_girls: 'I Like Girls',
  just_say_so: 'Just Say So',
  origami: 'Origami',
  dance_with_him: 'Dance With Him',
};

export const TIER_COLORS: Record<ArtistTier, string> = {
  T4: 'text-amber-400',
  T3: 'text-blue-400',
  T2: 'text-purple-400',
  T1: 'text-red-400',
};

export const TIER_BG: Record<ArtistTier, string> = {
  T4: 'bg-amber-400/10 border-amber-400/20',
  T3: 'bg-blue-400/10 border-blue-400/20',
  T2: 'bg-purple-400/10 border-purple-400/20',
  T1: 'bg-red-400/10 border-red-400/20',
};
