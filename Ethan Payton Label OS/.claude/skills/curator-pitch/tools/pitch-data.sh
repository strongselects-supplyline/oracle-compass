#!/bin/bash
# Extract pitch-relevant data for a track from the catalog matrix
TRACK="$1"
if [ -z "$TRACK" ]; then
  echo "Usage: pitch-data.sh <track-slug>"
  echo "Examples: see-me, east-side-love, green-light, sweet-frustration, want-u-2"
  exit 1
fi
MATRIX="brain/catalog_intelligence_matrix.json"
echo "=== PITCH DATA FOR: $TRACK ==="
# Use node to parse JSON reliably
node -e "
const fs = require('fs');
const data = JSON.parse(fs.readFileSync('$MATRIX', 'utf8'));
const tracks = data.tracks || data.catalog?.tracks || [];
const track = Array.isArray(tracks) ? tracks.find(t => t.slug === '$TRACK' || t.title?.toLowerCase().includes('$TRACK'.replace(/-/g,' '))) : null;
if (!track) { console.log('Track not found. Available:', tracks.map(t=>t.slug||t.title).join(', ')); process.exit(1); }
console.log('Title:', track.title);
console.log('BPM:', track.audio?.bpm || track.cyanite?.bpm || 'unknown');
console.log('Key:', track.audio?.key || track.cyanite?.key || 'unknown');
console.log('Mode:', track.audio?.mode || track.cyanite?.mode || 'unknown');
console.log('R&B score:', track.cyanite?.genre_tags?.rnb || track.audio?.rnb || 'unknown');
console.log('Sexy score:', track.cyanite?.mood_tags?.sexy || track.audio?.sexy || 'unknown');
console.log('Chill score:', track.cyanite?.mood_tags?.chill || track.audio?.chill || 'unknown');
console.log('Comparable artists:', JSON.stringify(track.core_drive?.top_neighbors || track.comparable_artists || []));
console.log('Lane:', track.lane || track.cluster || 'unknown');
console.log('Editorial targets:', JSON.stringify(track.editorial_targets || []));
"
