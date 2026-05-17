# SONNET_WIX_SPEC — ethanpayton.com Overhaul

**Generated:** May 16, 2026  
**Site ID:** `6e19f805-b455-4c85-b581-da22c9845a24`  
**Executor:** Sonnet via Wix MCP + Chrome editor fallback  

---

## CORRECTIONS FROM ETHAN

- "past.El" is INTERNAL ONLY — never public-facing on this site
- "Distance Over Time" is correct — it's the publishing company. NOT stale.
- "Ethan Payton LLC" is the record label/media company
- Bio paragraph stays as-is — do NOT rewrite
- Hero focus = East Side Love (what's streaming NOW)
- Strong Selects merch pivot noted but NOT part of this spec

---

## EXECUTION TASKS

Site ID for all Wix API calls: `6e19f805-b455-4c85-b581-da22c9845a24`

---

### TASK 1: Update Homepage Hero/Tagline

**Replace** the hero heading "Distance Over Time." with:

```
Ethan Payton · Hearing In Color
Milwaukee R&B · Distance Over Time
```

**Below tagline, add CTA line:**
```
East Side Love — streaming now
```

With a linked button to: `https://open.spotify.com/artist/6sSplYhHRhkvRqLptcFYMn`

**Do NOT touch** the bio paragraph ("My name is Ethan Payton and I make music.").

**Method:** Search `SearchWixRESTDocumentation` for "update page content" or "rich content". If editor-only, open `https://editor.wix.com` via Chrome, select the hero text element, replace text, save.

---

### TASK 2: Update Site SEO Metadata

**Page title:** `Ethan Payton | Hearing In Color`  
**Meta description:** `Milwaukee R&B. Distance Over Time. East Side Love streaming now. all lovE EP — May 29.`  
**og:title:** `Ethan Payton | Hearing In Color`  
**og:description:** `Milwaukee R&B. Distance Over Time. East Side Love streaming now.`

**Method:**
```
Tool: SearchWixRESTDocumentation
searchTerm: "SEO settings update meta tags page"
reason: "Update homepage SEO title and meta description"
```
Then call the appropriate API endpoint with the values above.

---

### TASK 3: Add Spotify to Social Bar + Remove Twitter

**ADD:**
- Spotify: `https://open.spotify.com/artist/6sSplYhHRhkvRqLptcFYMn`

**KEEP:**
- Instagram: `https://www.instagram.com/babybluepayton/`
- YouTube: `https://www.youtube.com/channel/UCetnc53fzPjfan7uR2RotKA/featured`

**REMOVE:**
- Twitter (dead/unused)

**Method:** Search for "social links" or "site properties" in Wix REST docs. If editor-only, open editor → click social bar → add Spotify icon/link, delete Twitter icon.

---

### TASK 4: Embed Spotify Player on Homepage

**Place below the hero tagline, above the bio section.**

**Embed (dark theme, artist page):**
```html
<iframe style="border-radius:12px" src="https://open.spotify.com/embed/artist/6sSplYhHRhkvRqLptcFYMn?utm_source=generator&theme=0" width="100%" height="352" frameBorder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>
```

**Method:** In Wix Editor, add an "Embed / HTML" widget. Paste the iframe code above. Position below hero, above bio.

---

### TASK 5: Add Email Capture Section

**Placement:** Below the Spotify embed, above the contact form. Full-width dark section.

**Heading:** `HEAR IT FIRST`  
**Subtext:** `New music. Release dates. No spam. Just sound.`  
**Button:** `I'M IN`  
**Email field placeholder:** `your email`

**Implementation:** Use Wix's native "Subscribe" form element (Wix Forms). In the editor:
1. Add Section → Subscribe
2. Set heading to "HEAR IT FIRST"
3. Set description to "New music. Release dates. No spam. Just sound."
4. Set button text to "I'M IN"
5. Set background to #0a0a0a
6. Set text color to #f5f5f5
7. Set button color to #d4af37

If ConvertKit gets set up later, swap this for a ConvertKit embed. For now, Wix native form captures emails to Wix Contacts.

---

### TASK 6: Fix Footer

**Replace:** `©2020 by Ethan Payton. Proudly created with Wix.com`  
**With:** `© 2026 Ethan Payton LLC · Distance Over Time`

**Note:** Removing "Proudly created with Wix.com" requires a Premium plan. If on free plan, just update the year and company name — the Wix badge will remain until upgraded.

**Method:** In editor, click footer text, replace with new copy.

---

### TASK 7: Apply Dark Aesthetic (Site-Wide)

**Do this FIRST before other visual tasks.**

**Colors:**
- Site background: `#0a0a0a`
- Text primary: `#f5f5f5`
- Accent/buttons: `#d4af37` (gold)
- Secondary background: `#1a1a2e` (dark navy, for section alternation)
- Link hover: `#c9a961`

**Typography:**
- Headings: Georgia (or site's existing serif), letter-spacing 2px
- Body: system sans-serif, light weight

**Method:** In Wix Editor → Site Design → Colors & Fonts. Set the color palette to the hex values above. Change default heading font to Georgia. Apply globally.

---

### TASK 8: Update Music Page (/music)

**Currently empty.** Add:

**Heading:** `MUSIC`

**Content:**
```
East Side Love — out now

all lovE EP — May 29, 2026
Green Light · Sweet Frustration · SEE ME · East Side Love · Want U 2
```

**Add Spotify artist embed (same as Task 4 iframe, dark theme).**

**Add streaming link buttons:**
- Spotify: `https://open.spotify.com/artist/6sSplYhHRhkvRqLptcFYMn`
- YouTube: `https://www.youtube.com/channel/UCetnc53fzPjfan7uR2RotKA`

**Method:** In editor, navigate to Music page, add text + HTML embed + button elements.

---

### TASK 9: Hide Stale Nav Pages

**Hide from navigation (do NOT delete):**
- `/tour` — no shows booked
- `/videos` — empty, YouTube link covers it

**Keep visible:**
- Home
- Music
- About

**Method:** In editor → Pages panel → right-click Tour → "Hide from menu." Same for Videos.

---

### TASK 10: Update About Page (/about)

**Keep** "DISTANCE OVER TIME" heading (it's the pub co — correct).

**Replace** "Step by step." with:
```
Hearing In Color.
```

That's it. Don't over-explain. The about page stays minimal.

---

### TASK 11: Publish

**After all edits are saved in editor:**

```
Tool: SearchWixRESTDocumentation
searchTerm: "publish site"
reason: "Publish site after content and design updates"
```

Then call:
```
Tool: ManageWixSite
url: [endpoint from docs]
method: POST
```

---

## EXECUTION ORDER

1. **Task 7** — Dark aesthetic (everything visual depends on this)
2. **Task 1** — Hero tagline
3. **Task 4** — Spotify embed
4. **Task 5** — Email capture
5. **Task 2** — SEO metadata
6. **Task 3** — Social bar links
7. **Task 6** — Footer
8. **Task 8** — Music page
9. **Task 9** — Hide stale pages
10. **Task 10** — About page
11. **Task 11** — Publish

---

## BLOCKERS

| Blocker | Tasks Affected | Resolution |
|---------|---------------|------------|
| Visual edits need Wix Editor (not API) | 1, 4, 5, 6, 7, 8, 9, 10 | Connect Chrome → editor.wix.com |
| Free plan = Wix branding in footer | 6 | Upgrade to Premium or accept badge |
| No ConvertKit account yet | 5 | Use Wix native form; swap later |

---

## VERIFICATION (post-publish)

Fetch `https://www.ethanpayton.com` and confirm:
- [ ] Dark background (#0a0a0a or similar)
- [ ] Hero reads "Ethan Payton · Hearing In Color / Milwaukee R&B · Distance Over Time"
- [ ] "East Side Love — streaming now" visible with Spotify link
- [ ] Spotify embed present (dark theme)
- [ ] Spotify in social bar
- [ ] Twitter removed from social bar
- [ ] Email signup section visible with "HEAR IT FIRST"
- [ ] Footer says "© 2026 Ethan Payton LLC"
- [ ] /music page has tracklist + embed
- [ ] Tour and Videos hidden from nav
- [ ] No "©2020" anywhere
- [ ] Word "Artist" alone does NOT appear
- [ ] Meta description contains "Milwaukee R&B" and "East Side Love"
