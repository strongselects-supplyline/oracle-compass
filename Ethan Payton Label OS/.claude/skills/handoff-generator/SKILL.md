---
name: Session Handoff Generator
description: Generate a standardized session handoff document for cross-AI continuity. Use when user says "generate handoff", "write handoff", or at the end of a significant work session.
---

# Session Handoff Generator

## When to Use
When Ethan says "generate handoff", "write handoff", or when a session has produced significant changes that need to be documented for continuity.

## Purpose
Handoffs ensure any AI (Claude, Antigravity/Gemini, or a fresh Claude session) can cold-start with full context. No reconstruction from memory. One read = complete picture.

## Output Format

```markdown
# SESSION HANDOFF — [Date] ([AI Name])

**Commit:** `[hash]` — [deploy status if applicable]. [N] files changed, [N] insertions.

---

## What Changed in [Project/System]

- **[Change 1]** — [description]
- **[Change 2]** — [description]
- **Added:** `[filename]` — [purpose]

---

## What Changed Outside [Project] (Filesystem)

| File | Change |
|------|--------|
| `path/to/file` | [Description of change] |
| `path/to/new-file` | **NEW** — [purpose] |

---

## Standing Corrections (if any)

**[Correction]** — [details]. Do not change this without explicit instruction from Ethan.

---

## Key Context Carried Forward

- **[Key point 1]**
- **[Key point 2]**
- **[Key point 3]**
```

## Instructions
1. Review everything that was changed, created, or discussed in this session.
2. Be specific about file paths, commit hashes, and version numbers.
3. Flag any corrections to previous AI hallucinations or errors.
4. Include standing rules that must persist across sessions.
5. Save to `brain/handoffs/handoff_[date].md`.

## Critical Rules
- **Never guess at file changes.** Only document what was actually changed and verified.
- **Always include the distributor reminder:** "Ethan uses Amuse, not DistroKid."
- **Version numbers matter.** Include them when referencing Oracle Compass or any versioned system.
- **Handoffs are permanent.** They're the canonical record. Don't overwrite previous handoffs — create new dated ones.
