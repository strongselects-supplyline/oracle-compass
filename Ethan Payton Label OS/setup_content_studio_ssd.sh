#!/bin/bash
# ============================================================
# Content Studio — SSD Setup (Ethan's actual sources)
# Sources: facecam + FL Playlist + FL Mixer + composite audio
# Run: bash setup_content_studio_ssd.sh
# ============================================================

SSD="/Volumes/LaCie"

if [ ! -d "$SSD" ]; then
  echo "❌ LaCie SSD not found at $SSD — plug it in and retry."
  exit 1
fi

echo "✅ LaCie found. Creating Content Studio architecture..."

# Core folders
mkdir -p "$SSD/Content_Studio/sessions"
mkdir -p "$SSD/Content_Studio/phone"
mkdir -p "$SSD/Content_Studio/b-roll/city"
mkdir -p "$SSD/Content_Studio/b-roll/studio"
mkdir -p "$SSD/Content_Studio/b-roll/lifestyle"
mkdir -p "$SSD/Content_Studio/exports/ig-reels"
mkdir -p "$SSD/Content_Studio/exports/tiktok"
mkdir -p "$SSD/Content_Studio/exports/yt-shorts"
mkdir -p "$SSD/Content_Studio/exports/twitter"
mkdir -p "$SSD/Content_Studio/exports/archive"
mkdir -p "$SSD/Content_Studio/cache/whisper"
mkdir -p "$SSD/Content_Studio/cache/vision"
mkdir -p "$SSD/Content_Studio/calibration"
mkdir -p "$SSD/Content_Studio/templates"

# Test session folder (so you can verify OBS output structure)
mkdir -p "$SSD/Content_Studio/sessions/_test-session/sources"

# Seed reference_reels.json
cat > "$SSD/Content_Studio/calibration/reference_reels.json" << 'EOF'
{
  "_note": "Replace these 5 examples with real Reels you want to replicate. Remove _fill_in when done.",
  "reels": [
    { "_fill_in": true, "url": "", "artist": "", "hook_timing_sec": 0, "what_makes_it_work": "" },
    { "_fill_in": true, "url": "", "artist": "", "hook_timing_sec": 0, "what_makes_it_work": "" },
    { "_fill_in": true, "url": "", "artist": "", "hook_timing_sec": 0, "what_makes_it_work": "" },
    { "_fill_in": true, "url": "", "artist": "", "hook_timing_sec": 0, "what_makes_it_work": "" },
    { "_fill_in": true, "url": "", "artist": "", "hook_timing_sec": 0, "what_makes_it_work": "" }
  ]
}
EOF

# Seed edit templates
for tmpl in all-love-ep vault-single freestyle behind-the-scenes phone-vibe; do
  cat > "$SSD/Content_Studio/templates/$tmpl.json" << TMPLEOF
{ "name": "$tmpl", "jutsu": "all-love", "default_layout": "face_dominant", "captions": true }
TMPLEOF
done

echo ""
echo "============================================================"
echo "✅ DONE. Folder tree created at $SSD/Content_Studio/"
echo "============================================================"
echo ""
echo "Now open OBS and follow the A-Z checklist."
echo ""
