// scripts/matrix-analyzer.ts
import fs from 'fs';
import path from 'path';

/**
 * MATRIX ANALYZER: Phase 2
 * Processes raw metadata and identifies the "Core Drive" artists based on playlist overlap.
 */

const INPUT_FILE = path.join(__dirname, '../lib/matrix/metadata_raw.json');
const OUTPUT_FILE = path.join(__dirname, '../lib/matrix/core_drive_results.json');

interface Track {
  artist: string;
  name: string;
  id?: string | null;
}

interface PlaylistResult {
  url: string;
  playlistId: string;
  tracks: Track[];
}

async function main() {
  if (!fs.existsSync(INPUT_FILE)) {
    console.error(`Raw metadata not found. Run scraper first.`);
    process.exit(1);
  }

  const data: PlaylistResult[] = JSON.parse(fs.readFileSync(INPUT_FILE, 'utf-8'));
  const artistFreq: Record<string, { count: number; tracks: {name: string, id: string | null}[]; playlists: string[] }> = {};

  for (const playlist of data) {
    for (const track of playlist.tracks) {
      if (!artistFreq[track.artist]) {
        artistFreq[track.artist] = { count: 0, tracks: [], playlists: [] };
      }
      artistFreq[track.artist].count += 1;
      const trackExists = artistFreq[track.artist].tracks.some(t => typeof t === 'string' ? t === track.name : t.name === track.name);
      if (!trackExists) {
        artistFreq[track.artist].tracks.push({ name: track.name, id: track.id || null } as any);
      }
      if (!artistFreq[track.artist].playlists.includes(playlist.playlistId)) {
        artistFreq[track.artist].playlists.push(playlist.playlistId);
      }
    }
  }

  const coreDrive = Object.entries(artistFreq)
    .filter(([_, data]) => data.count > 1) // Crossover threshold
    .map(([artist, data]) => ({
      artist,
      overlapCount: data.count,
      representativeTracks: data.tracks,
      playlistCount: data.playlists.length
    }))
    .sort((a, b) => b.overlapCount - a.overlapCount);

  console.log(`Found ${coreDrive.length} Core Drive candidates.`);
  
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(coreDrive, null, 2));
  console.log(`Analysis saved to ${OUTPUT_FILE}`);
}

main();
