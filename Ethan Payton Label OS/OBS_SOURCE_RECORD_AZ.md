# OBS Source Record Setup — A to Z

Your sources: **Facecam** · **FL Playlist** · **FL Mixer** · **Composite Audio**

---

## STEP 1: Run the folder script (Terminal, 10 sec)

```
bash "/Users/ethanpayton/.gemini/antigravity/scratch/oracle-compass/Ethan Payton Label OS/setup_content_studio_ssd.sh"
```

You should see "DONE" and the folder tree is created on LaCie. Move on.

---

## STEP 2: Install Source Record plugin (5 min)

1. Open browser → go to https://github.com/exeldro/obs-source-record/releases
2. Download the latest `.pkg` for macOS
3. Double-click the .pkg → install
4. **Quit OBS completely** (Cmd+Q)
5. Reopen OBS

---

## STEP 3: Set OBS recording output path (2 min)

1. OBS menu bar → **Settings** → **Output**
2. Click **Recording** tab
3. Set **Recording Path** to: `/Volumes/LaCie/Content_Studio/sessions`
4. Set **Recording Format** to: `MKV` (we remux later if needed)
5. Set **Filename Formatting** to: `%CCYY-%MM-%DD_%hh-%mm/composite`
6. Click **Apply**

This makes OBS auto-create a dated folder per session with composite.mkv inside it.

---

## STEP 4: Set up audio tracks (2 min)

1. Still in **Settings** → **Output** → **Recording** tab
2. Under **Audio Track**, make sure **Track 1** is checked
3. Go to **Settings** → **Audio**
4. Your mic should be on **Mic/Auxiliary Audio** (Track 1)
5. Your desktop audio (FL Studio output) should be on **Desktop Audio**
6. Click **Apply** → **OK**

Your composite audio.wav will have both mixed. That's fine — that's what you record now.

---

## STEP 5: Add Source Record filter to Facecam (3 min)

1. In your OBS **Sources** panel, find your facecam source
2. **Right-click** it → **Filters**
3. Click the **+** button at the bottom left → select **Source Record**
4. Name it `facecam-record`
5. In the filter settings:
   - **Path:** `/Volumes/LaCie/Content_Studio/sessions`
   - **Filename Formatting:** `%CCYY-%MM-%DD_%hh-%mm/sources/facecam`
   - **Recording Format:** `MKV`
   - Check **"Record when main output is recording"**
6. Click **Close**

---

## STEP 6: Add Source Record filter to FL Playlist (2 min)

1. Find your FL Playlist window capture source
2. **Right-click** → **Filters** → **+** → **Source Record**
3. Name it `playlist-record`
4. Settings:
   - **Path:** `/Volumes/LaCie/Content_Studio/sessions`
   - **Filename Formatting:** `%CCYY-%MM-%DD_%hh-%mm/sources/playlist`
   - **Recording Format:** `MKV`
   - Check **"Record when main output is recording"**
5. Click **Close**

---

## STEP 7: Add Source Record filter to FL Mixer (2 min)

1. Find your FL Mixer window capture source
2. **Right-click** → **Filters** → **+** → **Source Record**
3. Name it `mixer-record`
4. Settings:
   - **Path:** `/Volumes/LaCie/Content_Studio/sessions`
   - **Filename Formatting:** `%CCYY-%MM-%DD_%hh-%mm/sources/mixer`
   - **Recording Format:** `MKV`
   - Check **"Record when main output is recording"**
5. Click **Close**

---

## STEP 8: Test it (2 min)

1. Hit **Start Recording** in OBS
2. Do anything for 30 seconds — move the mouse, talk, click around FL
3. Hit **Stop Recording**
4. Open Finder → navigate to `/Volumes/LaCie/Content_Studio/sessions/`
5. You should see a folder like `2026-05-04_14-30/` containing:

```
2026-05-04_14-30/
├── composite.mkv          ← full OBS canvas
└── sources/
    ├── facecam.mkv         ← just your face
    ├── playlist.mkv        ← just the FL Playlist
    └── mixer.mkv           ← just the FL Mixer
```

6. **Play each file** independently. Verify they're isolated.
7. If all 4 files are there and clean → you're done. Delete the test folder.

---

## STEP 9: Rename convention (ongoing, 10 sec per session)

After every session, rename the auto-generated folder from `2026-05-04_14-30` to something meaningful:

- `2026-05-04_GL-vocals`
- `2026-05-04_SF-mixdown`
- `2026-05-05_WU2-arrangement`

This is how Content Studio identifies your sessions in the Library UI.

---

## DONE

Total time: ~20 minutes. One-time setup. Every recording session from now on automatically creates the source-first folder structure that Content Studio reads from.

**After this:** the audio.wav file from OBS will land alongside composite.mkv (OBS puts it in the same folder). If OBS doesn't separate it automatically, you can extract it post-session with: `ffmpeg -i composite.mkv -vn -acodec pcm_s16le audio.wav` — but test first, OBS might handle it.
