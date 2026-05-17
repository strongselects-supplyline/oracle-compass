# ethanpayton.com — Wix Editor Playbook
**Updated:** May 16, 2026  
**Site:** ethanpayton.com · ID: `6e19f805-b455-4c85-b581-da22c9845a24`  
**Open editor:** https://manage.wix.com/dashboard/6e19f805-b455-4c85-b581-da22c9845a24/home → click **Edit Site**

~~T7 (dark aesthetic)~~ — SKIPPED  
~~T1 (hero tagline)~~ — SKIPPED  
~~T2 (SEO metadata)~~ — SKIPPED  
~~T5 (email capture)~~ — SKIPPED  

Active tasks: **T4, T3, T6, T8, T9, T10**. Save after each page before switching.

---

## T4 — Spotify Embed (Homepage)

**Where:** Editor → Home page

> ⚠️ The existing Wix Music player (fan pay-to-download) stays untouched. This embed is additional — place it in a new section, not on top of the existing music widget.

1. Click **Add Elements** (+) → **Embed** → **Embed a Widget** (or "HTML iFrame")
2. Paste this code:
   ```html
   <iframe style="border-radius:12px" src="https://open.spotify.com/embed/artist/6sSplYhHRhkvRqLptcFYMn?utm_source=generator&theme=0" width="100%" height="352" frameBorder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>
   ```
3. Resize to full column width
4. Position wherever makes sense on the page — separate from the Wix Music player

---

## T3 — Social Bar Links

**Where:** Editor → click the social bar/icons element (usually in header or footer)

1. Click on the social bar component
2. **Add icon:** Spotify
   - Icon: Spotify logo (select from Wix icon library)
   - Link: `https://open.spotify.com/artist/6sSplYhHRhkvRqLptcFYMn`
3. **Keep:**
   - Instagram → `https://www.instagram.com/babybluepayton/`
   - YouTube → `https://www.youtube.com/channel/UCetnc53fzPjfan7uR2RotKA/featured`
4. **Delete:** Twitter icon (click icon → Delete)

---

## T6 — Footer

**Where:** Editor → scroll to bottom → click footer text

1. Click the copyright text element
2. **Replace** `©2020 by Ethan Payton. Proudly created with Wix.com` with:
   ```
   © 2026 Ethan Payton LLC · Distance Over Time
   ```
   > Site is on Premium — go to **Editor → Settings → Remove Wix Ads** if the Wix badge persists separately.

---

## T8 — Music Page (/music)

**Where:** Editor → Pages menu → Music

1. Add a **Text** heading: `MUSIC`
2. Add a **Text** body element:
   ```
   East Side Love — out now
   all lovE EP — May 29, 2026
   Green Light · Sweet Frustration · SEE ME · East Side Love · Want U 2
   ```
3. Add Spotify embed (same iframe as T4):
   ```html
   <iframe style="border-radius:12px" src="https://open.spotify.com/embed/artist/6sSplYhHRhkvRqLptcFYMn?utm_source=generator&theme=0" width="100%" height="352" frameBorder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>
   ```
4. Add two **Button** elements:
   - `Spotify` → `https://open.spotify.com/artist/6sSplYhHRhkvRqLptcFYMn`
   - `YouTube` → `https://www.youtube.com/channel/UCetnc53fzPjfan7uR2RotKA`

---

## T9 — Hide Stale Nav Pages

**Where:** Editor → Pages panel (left sidebar)

1. Right-click **Tour** → **Hide from Menu**
2. Right-click **Videos** → **Hide from Menu**
3. Nav should show: **Home**, **Music**, **About** only

---

## T10 — About Page (/about)

**Where:** Editor → Pages → About

1. Keep `DISTANCE OVER TIME` heading exactly as-is
2. Find `Step by step.` → **replace** with:
   ```
   Hearing In Color.
   ```
3. Nothing else changes.

---

## WHEN DONE

**Save** in editor → come back here and say "publish it" — I'll trigger publish via the Wix API and verify the live site.

---

## VERIFICATION (post-publish)

- [ ] Spotify embed on homepage (alongside existing music player)
- [ ] Spotify in social bar
- [ ] Twitter removed from social bar
- [ ] Footer: `© 2026 Ethan Payton LLC · Distance Over Time`
- [ ] /music page: tracklist + embed + streaming buttons
- [ ] Tour and Videos hidden from nav
- [ ] About page: `Hearing In Color.` (not "Step by step.")
- [ ] No `©2020` anywhere
