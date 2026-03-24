// scripts/matrix-scraper.ts
import fs from 'fs';
import path from 'path';

/**
 * MATRIX SCRAPER: Phase 1
 * Ingests a list of Spotify Playlist URLs and scrapes basic metadata (Track/Artist).
 * 
 * Instructions:
 * 1. Place links in lib/matrix/links.txt (one per line).
 * 2. Run: npx ts-node scripts/matrix-scraper.ts
 */

const INPUT_FILE = path.join(__dirname, '../lib/matrix/links.txt');
const OUTPUT_FILE = path.join(__dirname, '../lib/matrix/metadata_raw.json');

async function scrapePlaylist(url: string) {
  console.log(`Scraping: ${url}`);
  // In a real environment, we'd use an API or a sub-agent.
  // For this script, we'll mark the metadata for another agent/human to verify.
  return {
    url,
    playlistId: url.split('/').pop()?.split('?')[0] || 'unknown',
    timestamp: new Date().toISOString(),
    tracks: [] // Placeholder for sub-agent population
  };
}

async function main() {
  if (!fs.existsSync(INPUT_FILE)) {
    console.error(`Input file not found: ${INPUT_FILE}`);
    process.exit(1);
  }

  const links = fs.readFileSync(INPUT_FILE, 'utf-8').split('\n').filter(l => l.trim().startsWith('http'));

  const results = [];
  for (const link of links) {
    results.push(await scrapePlaylist(link));
  }

  const dir = path.dirname(OUTPUT_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(results, null, 2));
  console.log(`Saved raw metadata to ${OUTPUT_FILE}`);
}

main();
