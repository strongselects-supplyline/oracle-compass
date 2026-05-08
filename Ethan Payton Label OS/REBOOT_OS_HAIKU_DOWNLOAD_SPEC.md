# REBOOT OS — Haiku Download Script Spec

## What You Are

You are Haiku, writing a bash download script. No judgment calls. No architecture decisions. Parse the index, extract URLs, output a script.

## Input

Read `REBOOT_OS_ARCHIVE_INDEX.md` in this same directory. It contains every source for the Reboot OS archive, organized by tier (0–5). Each entry has: title, organization, URL, format, file size estimate, license status, and target SSD path.

## Output

One file: `reboot_os_download.sh` — saved to this same directory.

## Script Requirements

### Arguments
- `$1` = target root directory (e.g., `/Volumes/MySSD/REBOOT_OS/` or `./REBOOT_OS/`)
- If no argument provided, print usage and exit: `Usage: bash reboot_os_download.sh /path/to/target/`

### Step 1: Create Folder Tree
Create the full directory structure under `$1`:
```
$1/
├── 00_Terminal/
├── 01_Survival/
│   ├── Medical/
│   ├── Water/
│   ├── Shelter/
│   ├── Food/
│   ├── Defense/
│   └── Psychology/
├── 02_Infrastructure/
│   ├── Agriculture/
│   ├── Construction/
│   ├── Energy/
│   ├── Water_Sanitation/
│   ├── Preservation/
│   └── Trade/
├── 03_Industry/
│   ├── Encyclopedia/
│   ├── Metallurgy/
│   ├── Chemistry/
│   ├── Power/
│   ├── Communications/
│   ├── Medicine_Advanced/
│   └── Education/
├── 04_Governance/
│   ├── Constitutions/
│   ├── Conflict_Resolution/
│   ├── Economics/
│   ├── History/
│   ├── Philosophy/
│   └── Defense/
└── 05_Renaissance/
    ├── Mathematics/
    ├── Science/
    ├── Art/
    └── Language/
```
Use `mkdir -p` for all directories.

### Step 2: Download Free Sources

For every source in the archive index that is NOT marked "PURCHASE REQUIRED" or "copyrighted":
- Download using `wget --continue --timeout=60 --tries=3` to the correct subdirectory
- Use the SSD path from the index to determine target directory
- If the index doesn't specify an exact filename, derive one from the URL or title (lowercase, underscores, no spaces)

### Step 3: Download Order

Download in this exact sequence (largest first to get the long downloads running early):
1. Wikipedia English ZIM file (~95GB)
2. CD3WD archive (~15GB)
3. Khan Academy Lite ZIM (~15GB)
4. Project Gutenberg ZIM (~60GB full / ~3GB text-only — default to text-only, add commented-out line for full)
5. StackExchange ZIM files (~15GB)
6. Wikibooks ZIM (~2GB)
7. Wiktionary ZIM (~5GB)
8. Appropedia ZIM (~1GB)
9. Open Source Ecology CAD files (~2GB)
10. All remaining PDFs and small files (group by tier)

### Step 4: Skip Copyrighted Items

For every PURCHASE REQUIRED source, do NOT attempt download. Instead echo to both terminal and log:
```
[SKIP] "Title" — PURCHASE REQUIRED. Buy physical copy.
```

### Step 5: Logging

Log everything to `$1/download_log.txt`:
- Start timestamp
- Each download: `[OK]` or `[FAIL]` + title + URL + file size + timestamp
- Each skip: `[SKIP]` + title + reason
- End timestamp
- Summary: total downloaded, total skipped, total failed, total size

### Script Style Rules

- Add `#!/bin/bash` shebang
- Add `set -e` at top (exit on error) — BUT wrap each `wget` in an `if` so one failure doesn't kill the whole script
- Use a helper function for downloads:
  ```bash
  download() {
      local url="$1"
      local dest="$2"
      local title="$3"
      if wget --continue --timeout=60 --tries=3 -O "$dest" "$url" 2>>"$LOG"; then
          echo "[OK] $title → $dest" | tee -a "$LOG"
          ((SUCCESS++))
      else
          echo "[FAIL] $title — $url" | tee -a "$LOG"
          ((FAILED++))
      fi
  }
  ```
- Use a skip function:
  ```bash
  skip() {
      local title="$1"
      echo "[SKIP] $title — PURCHASE REQUIRED" | tee -a "$LOG"
      ((SKIPPED++))
  }
  ```
- Print a progress header before each tier: `echo "=== TIER 1: SURVIVAL ===" | tee -a "$LOG"`
- At the end, print summary to terminal and log

### Do NOT:
- Download anything copyrighted
- Use `curl` (use `wget` for `--continue` resume support)
- Require any dependencies beyond `wget` and `bash` (both available on any Linux/Mac)
- Add any commentary, explanations, or markdown to the script — it's a script, not a document
- Make any architectural decisions — just parse the index and translate URLs to wget commands
- Hardcode any absolute paths — everything is relative to `$1`

### Verification

After writing the script, do a dry-run check:
- Confirm every URL in the index that is free/open-source has a corresponding `download()` call
- Confirm every PURCHASE REQUIRED item has a `skip()` call
- Confirm the folder tree matches the spec above
- Confirm the script is executable (`chmod +x` note in comments)

## That's It

Parse the index. Write the script. No creativity needed.
