# REBOOT OS — Sonnet Execution Spec

## What This Is

A build spec for Sonnet to produce the **Civilization Reboot Kit**: a comprehensive offline archive + navigable HTML index that organizes all human knowledge needed to restart society from solo survival through nation-building. Ethan keeps this on an SSD in a Faraday bag with a Raspberry Pi + solar panel.

## What Sonnet Builds

**Two deliverables:**

1. **`REBOOT_OS_ARCHIVE_INDEX.md`** — The master reference document. Every source listed with: title, description, exact download URL, approximate file size, file format, and which tier it belongs to. This is the shopping list Ethan uses to populate the SSD.

2. **`reboot-os-terminal.html`** — A self-contained, offline-viewable HTML dashboard (single file, no CDN dependencies). Functions as the root `index.html` on the SSD. Dark theme. Sidebar nav with tier sections. Clickable folder structure. Search bar that filters entries. Runs on a Raspberry Pi browser (Chromium) with zero internet. Think Oracle Compass aesthetic but static — no frameworks, no build step, pure HTML/CSS/JS in one file.

---

## Tier Architecture

### Tier 0: The Terminal Itself
*Hardware + software to access everything else.*

Sources to catalog:
- **Raspberry Pi OS Lite** — headless image, ~500MB. URL: raspberrypi.com/software/operating-systems/
- **Kiwix Reader** — offline wiki/ZIM reader, ~50MB. URL: kiwix.org/en/downloads/kiwix-reader/
- **SumatraPDF (Linux alt: Evince)** — lightweight PDF reader for the Pi
- **Raspberry Pi setup guide** — pin diagram, SSH config, power requirements (5V/3A USB-C)
- Hardware BOM: Raspberry Pi 4/5 (8GB), 2TB SSD (Samsung T7 or similar), 20W–50W folding solar panel, 20,000mAh USB-C power bank, wired USB keyboard + mouse, 7" portable HDMI monitor or e-ink display, heavy-duty Faraday bag or sealed ammo can + Mylar liner + desiccant packs
- Total hardware cost estimate: ~$350–$500

Storage budget note in doc: "Tier 0: ~1GB | Tier 1: ~500MB | Tier 2: ~20GB | Tier 3: ~100GB | Tier 4: ~5GB | Buffer/personal files: ~75GB | Total: well within 2TB"

---

### Tier 1: Solo / Home — Survival & Stabilization
*Biological survival: calories, clean water, triage medicine, shelter, self-defense.*

Sources to catalog (include exact URLs, file sizes where known):

**Medical:**
- *Where There Is No Doctor* — Hesperian Foundation. Free PDF. ~20MB. hesperian.org/books/where-there-is-no-doctor/
- *Where There Is No Dentist* — Hesperian Foundation. Free PDF. ~10MB. hesperian.org/books/where-there-is-no-dentist/
- *Where Women Have No Doctor* — Hesperian Foundation. Free PDF. ~15MB.
- *A Book for Midwives* — Hesperian. Childbirth without hospitals.
- *Helping Children Who Are Deaf/Blind* — Hesperian. Disability care post-collapse.

**Survival & Field Craft:**
- US Army Survival Manual FM 21-76 — Public domain PDF. Water procurement, firecraft, shelter, navigation, signaling. ~5MB.
- Special Operations Forces Medical Handbook — Trauma, field surgery, pharmacology. ~15MB.
- SAS Survival Handbook (John Wiseman) — Climate-specific survival. NOTE: copyrighted, must be purchased. Include as "recommended purchase" not direct download.
- US Army Field Manual FM 5-103: Survivability — Fighting positions, protective construction.

**Water:**
- WHO guidelines for drinking-water quality — Free PDF from who.int. ~3MB.
- Biosand filter construction manual (CAWST) — cawst.org. Free.
- Solar water disinfection (SODIS) guide — sodis.ch.

**Food (Immediate):**
- Peterson Field Guide regional foraging references — NOTE: copyrighted, list as "recommended purchase."
- US Army Foraging manual excerpts (public domain sections).
- Basic snare/trap diagrams (FM 21-76 appendix covers this).

**Shelter:**
- US Army FM 5-34: Engineer Field Data — construction tables, load calculations.
- Earthbag building guides — open source, multiple sources.

**Communications (Personal):**
- ARRL Ham Radio License Manual basics — NOTE: copyrighted, list as recommended purchase. But include: FCC Part 97 rules (public domain), frequency allocation charts, Morse code reference sheets.
- Baofeng UV-5R programming guide (open source, widely available).

**Self-Defense:**
- FM 21-150: Combatives — US Army hand-to-hand. Public domain.
- Basic perimeter security and night watch rotation protocols.

**Psychological:**
- Crisis counseling field guide (WHO mhGAP Intervention Guide) — free from WHO. Critical for managing trauma, grief, psychosis in austere environments.

**Total Tier 1: ~500MB**

---

### Tier 2: Commune / Neighborhood — Infrastructure & Agriculture
*Sustainable production. Feeding 10–50 people. Building tools. Basic trade.*

Sources to catalog:

**Agriculture & Food Production:**
- CD3WD Project archive — Thousands of PDFs on agriculture, forestry, water, construction. ~15GB total. Archive available via archive.org (search "cd3wd"). Sonnet: note that this is the single largest Tier 2 download and covers most subtopics below.
- Appropedia offline dump — appropriate technology wiki. Available as ZIM file via Kiwix. ~1GB.
- *The New Self-Sufficient Gardener* (John Seymour) — NOTE: copyrighted, list as recommended purchase.
- Seed saving guides — Seed Savers Exchange has free resources. seedsavers.org.
- Composting & soil building (multiple open-source PDFs in CD3WD).
- Livestock basics: chickens, goats, rabbits (CD3WD covers extensively).

**Construction:**
- Open Source Ecology Global Village Construction Set — Full CAD files + build instructions for 50 machines. opensourceecology.org. ~2GB.
  - Key machines to highlight: compressed earth brick press, tractor (LifeTrac), 3D printer, sawmill, wind turbine, micro-house, bakery oven, well-drilling rig.
- Earthship construction principles (Michael Reynolds) — NOTE: some copyrighted, but basic thermal mass / earth-sheltered principles are widely documented in open sources.
- Cob/adobe/rammed earth building techniques — multiple free PDFs.

**Water & Sanitation:**
- Well drilling manual (UNICEF/WHO) — free.
- Composting toilet designs — Joseph Jenkins *Humanure Handbook* has free excerpts. Full text is copyrighted.
- Rainwater harvesting guides (CAWST, multiple free PDFs).
- Basic plumbing with PVC/bamboo/clay pipe.

**Energy (Micro-scale):**
- Small-scale solar panel wiring guides (12V/24V systems).
- Micro-hydro turbine construction (if near running water) — Practical Action technical briefs, free. practicalaction.org.
- Wood gasification basics — open source.
- Biogas digester construction — multiple free PDFs (CD3WD).

**Preservation & Storage:**
- USDA Complete Guide to Home Canning — public domain. nchfp.uga.edu. ~5MB.
- Smoking, salting, drying, fermentation techniques.
- Root cellar construction.

**Textile & Clothing:**
- Basic spinning, weaving, leather tanning (CD3WD covers).
- Shoe/boot repair and construction basics.

**Trade & Barter:**
- Historical barter systems reference.
- Basic ledger accounting (double-entry bookkeeping fundamentals).

**Total Tier 2: ~20GB**

---

### Tier 3: Towns / Cities — Industry & Manufacturing
*Light industry, power grids, chemistry, mass communication, education systems.*

Sources to catalog:

**The Knowledge Base (Encyclopedic):**
- Full English Wikipedia with images — Kiwix ZIM file. ~95GB. download.kiwix.org. THIS IS THE BACKBONE OF TIER 3. Contains chemistry, physics, metallurgy, history, medicine, engineering, mathematics.
- Project Gutenberg — 60,000+ public domain books. Available as Kiwix ZIM. ~60GB with all books, ~3GB text-only.
- StackExchange offline dump — Kiwix ZIM. Covers programming, engineering, science, homesteading Q&A. ~15GB for select sites (HomeImprovement, DIY, Gardening, Chemistry, Physics, Engineering, Survival).
- Wikibooks offline — Kiwix ZIM. Textbook-quality content on math, science, languages. ~2GB.

**Metallurgy & Smithing:**
- Blacksmithing fundamentals — multiple public domain texts (Practical Blacksmithing by M.T. Richardson, 1889, on archive.org).
- Blast furnace and cupola construction for iron smelting.
- Basic steel alloy recipes and heat treatment charts.

**Chemistry (Applied):**
- Soap and lye manufacturing.
- Penicillin synthesis from bread mold (Dartnell's *The Knowledge* covers this — NOTE: copyrighted book, list as recommended purchase, but the basic Fleming method is public domain science).
- Gunpowder composition and safe handling (historical, widely documented).
- Fertilizer (Haber process basics for advanced communities; composting for everyone else).
- Glass making (sand + soda ash + lime, furnace temps).
- Paper making.
- Basic dye and ink production.

**Power (Grid-scale):**
- Hydroelectric dam micro-to-small scale engineering.
- Steam engine construction (multiple public domain Victorian-era texts on archive.org).
- Wind turbine (larger than Tier 2 micro-scale) — Hugh Piggott designs are open source.
- Basic electrical grid wiring: AC/DC, transformers, wire gauging.

**Communications (Community-scale):**
- Mesh networking with LoRa radios — open source documentation. meshtastic.org.
- Printing press construction (movable type).
- Semaphore and flag signaling systems.
- Basic telephone/intercom wiring.

**Medicine (Advanced):**
- WHO Model List of Essential Medicines — free PDF.
- Basic surgical technique manuals (public domain military medical texts).
- Dental extraction and basic prosthetics.
- Herbal medicine pharmacopoeia (multiple open-source references).
- Vaccination history and principles (for when biomanufacturing becomes possible).

**Education:**
- Khan Academy Lite — available as Kiwix ZIM. Math, science, computing. ~15GB.
- Basic curriculum frameworks for K-8 education.
- Literacy teaching methods (phonics-based, works cross-language).

**Total Tier 3: ~100GB (Wikipedia alone is ~95GB; everything else fits in ~30GB)**

---

### Tier 4: States / Nations — Governance, Law & Philosophy
*Preventing internal collapse. The layer everyone forgets. Most important long-term.*

Sources to catalog:

**Constitutional & Governance Templates:**
- US Constitution + Bill of Rights + all amendments — public domain. Include Federalist Papers (Hamilton/Madison/Jay). ~2MB total.
- The Great Law of Peace (Gayanashagowa) — Iroquois Confederacy constitution. Decentralized confederal model. Multiple public domain translations. Key concept: chiefs serve at pleasure of clan mothers (built-in accountability mechanism).
- Swiss Federal Constitution — Model for canton-level direct democracy and subsidiarity. Available in English, public domain.
- Magna Carta — foundational rights document.
- English Bill of Rights 1689.
- Universal Declaration of Human Rights (UN, 1948) — public domain.
- Robert's Rules of Order (public domain editions pre-1915 on archive.org) — meeting governance.

**Conflict Resolution:**
- Restorative justice frameworks — multiple free academic PDFs.
- Community mediation training manuals (free from various peace-building orgs).
- Truth and reconciliation commission case studies (South Africa model).
- Basic arbitration and property dispute protocols.

**Economics & Resource Management:**
- *The Wealth of Nations* (Adam Smith) — public domain.
- *Capital* (Marx) — public domain. Include not as ideology but as diagnostic tool for labor exploitation patterns.
- Elinor Ostrom's commons governance principles (8 rules for managing shared resources without tragedy-of-the-commons collapse) — academic papers, some open access.
- Local currency and mutual credit systems (historical examples: Wörgl experiment, Ithaca Hours).
- Double-entry bookkeeping (Luca Pacioli's original, public domain).
- Basic property registry and land title systems.

**Historical Collapse Case Studies:**
- *The Decline and Fall of the Roman Empire* (Gibbon) — public domain, archive.org.
- Jared Diamond's *Collapse* — NOTE: copyrighted, list as recommended purchase. But summarize the key variables: deforestation, soil depletion, hostile neighbors, loss of trade partners, cultural rigidity.
- Easter Island, Maya, Norse Greenland, Khmer Empire — Wikipedia offline covers these extensively.
- Hyperinflation case studies: Weimar Republic, Zimbabwe, Venezuela — Wikipedia covers.
- Rwanda genocide: how neighbor turned on neighbor — lessons on early warning signs of communal violence.

**Philosophy & Ethics:**
- Marcus Aurelius *Meditations* — public domain. Stoic crisis leadership.
- *Tao Te Ching* (Lao Tzu) — public domain translations. Governance through non-coercion.
- Aristotle *Politics* — public domain. City-state formation theory.
- John Locke *Two Treatises of Government* — public domain. Natural rights foundation.

**Military & Security (Defensive):**
- Sun Tzu *The Art of War* — public domain.
- Basic militia organization and community defense protocols.
- Geneva Conventions (simplified) — rules of engagement even in austere conditions.
- Fortification basics (FM 5-103 from Tier 1 extends here).

**Psychology & Social Cohesion:**
- Group dynamics and leadership in crisis (multiple free military leadership manuals).
- Conflict de-escalation techniques.
- Ceremony and ritual as social binding agents (anthropological perspective).
- Basic census and population tracking methods.

**Total Tier 4: ~5GB (mostly text-heavy, small files)**

---

### Tier 5: Renaissance — Science, Art & Long-Term Flourishing
*Once survival is handled and governance is stable, rebuild culture and push forward.*

Sources to catalog:

**Mathematics:**
- Euclid's *Elements* — public domain. Foundation of geometry.
- Full math curriculum through calculus (Khan Academy ZIM covers this).
- Statistics and probability basics (critical for agriculture planning, public health).

**Science (Theoretical):**
- Newton's *Principia* — public domain.
- Darwin's *On the Origin of Species* — public domain.
- Basic periodic table with element properties and extraction methods.
- Astronomy: star charts for navigation + calendar keeping + planting seasons.

**Art & Music:**
- Basic instrument construction (drums, string instruments, flutes — multiple free guides).
- Drawing and illustration fundamentals (public domain art instruction texts on archive.org).
- Typography and book binding.
- Architecture: proportion, load-bearing, aesthetic principles (Vitruvius *De Architectura*, public domain).

**Language:**
- Basic dictionaries and grammar guides for top 10 world languages (Kiwix has Wiktionary ZIM, ~5GB).
- Rosetta Stone concept: parallel texts in multiple languages for translation bootstrapping.

**Total Tier 5: ~10GB (mostly covered by Wikipedia + Gutenberg + Khan Academy already in Tier 3)**

---

## HTML Dashboard Spec (`reboot-os-terminal.html`)

### Requirements:
- **Single file.** No external dependencies. No CDN. No frameworks. Pure HTML + CSS + JS.
- **Dark theme.** Black/dark gray background, light text. Accent color: amber/gold (#D4A017 or similar — survival/tactical feel, not tech startup).
- **Layout:** Fixed left sidebar with tier navigation (Tier 0–5). Main content area shows selected tier's contents as a structured, collapsible folder tree.
- **Search:** Text input at top that filters all entries across all tiers in real-time (JS string matching on title + description).
- **Each entry shows:** Title, one-line description, format badge (PDF/ZIM/CAD/TXT), estimated file size, and a relative file path (e.g., `./01_Medical/where_there_is_no_doctor.pdf`).
- **Folder structure mirrors this tree:**
  ```
  /REBOOT_OS/
  ├── index.html          ← this dashboard
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
  │   ├── Encyclopedia/     ← Wikipedia ZIM, Gutenberg, StackExchange
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
- **Print-friendly:** CSS @media print that strips dark theme for paper output (if someone needs to print a directory listing).
- **No interactivity beyond search and collapse/expand.** This runs on a Raspberry Pi Chromium — keep it light.
- **Footer:** "Reboot OS v1.0 — Offline Civilization Archive" + last-updated date.

### Design notes for Sonnet:
- Aesthetic should feel like a terminal/military field manual, not a modern web app. Monospace font for data. Sans-serif for headers.
- Use CSS grid or flexbox, no tables.
- Collapsible sections use `<details>/<summary>` elements (native HTML, no JS needed for collapse).
- Search uses a simple `input` event listener filtering `querySelectorAll` on entry elements.
- Total file size target: under 50KB.

---

## Sonnet Instructions

1. **First deliverable:** Create `REBOOT_OS_ARCHIVE_INDEX.md` in the workspace folder. This is the master shopping list. Every source from every tier, with: title, author/org, URL, format, file size estimate, license status (public domain / open source / copyrighted — purchase required), and a one-line description. Organize by tier, then by subcategory. Include a "Weekend Download Checklist" section at the end with the exact sequence of downloads (largest first: Wikipedia ZIM, then CD3WD, then everything else).

2. **Second deliverable:** Create `reboot-os-terminal.html` in the workspace folder. The offline dashboard per the spec above. Populate it with all entries from the index. Each entry should have the relative file path it would live at on the SSD, so Ethan can use the folder structure as his guide when organizing downloads.

3. **Verification step:** After building both files, open `reboot-os-terminal.html` in a browser to confirm it renders, search works, all tiers are navigable, and the dark theme displays correctly. Fix any issues.

4. **Tone of the index doc:** Direct, terse, no fluff. This is a field manual, not a blog post. Each entry is a line item, not a paragraph.

5. **Do NOT use any CDN or external resources in the HTML file.** Everything inline. This must work with zero internet.

6. **Copyright handling:** Clearly mark copyrighted sources as "PURCHASE REQUIRED" and do not provide direct download links for them. Only provide direct URLs for public domain and open-source materials.

---

## Why This Matters

The grid is a single point of failure for all of human knowledge. This archive is insurance. The organizational structure — scaling from solo to nation — is the part that doesn't exist anywhere else. Most survival archives are flat dumps of PDFs. This one has *transition architecture*: the knowledge you need at each tier explicitly supports the jump to the next one. That's the value-add.
