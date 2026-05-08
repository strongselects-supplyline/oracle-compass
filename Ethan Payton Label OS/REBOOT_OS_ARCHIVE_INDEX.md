# REBOOT OS — MASTER ARCHIVE INDEX v1.0
*Last updated: 2026-05-06 | Total estimated storage: ~130GB | Hardware target: 2TB SSD*

---

## TIER 0 — THE TERMINAL
*Hardware + software to access everything else. Set this up first or nothing else works.*

**Storage budget: ~1GB**

### Software

| Title | Org | Format | Size | License | URL | Path |
|---|---|---|---|---|---|---|
| Raspberry Pi OS Lite | Raspberry Pi Foundation | IMG | ~500MB | Open Source | https://www.raspberrypi.com/software/operating-systems/ | `./00_Terminal/rpi-os-lite.img` |
| Kiwix Desktop (Linux ARM) | Kiwix | AppImage | ~50MB | GPL-3.0 | https://kiwix.org/en/downloads/kiwix-desktop/ | `./00_Terminal/kiwix-desktop-linux-arm.appimage` |
| Evince PDF Reader | GNOME | deb | ~5MB | GPL-2.0 | Via apt: `sudo apt install evince` | `./00_Terminal/INSTALL_NOTES.md` |
| Chromium Browser | Chromium | deb | ~80MB | BSD | Pre-installed on RPi OS / `sudo apt install chromium-browser` | `./00_Terminal/INSTALL_NOTES.md` |

### Hardware BOM

| Item | Model | Est. Cost |
|---|---|---|
| Single-board computer | Raspberry Pi 4 or 5 (8GB RAM) | $80–$100 |
| SSD | Samsung T7 2TB USB-C | $120–$150 |
| Solar panel | 20W–50W folding USB-C panel | $40–$80 |
| Power bank | 20,000mAh USB-C (65W PD) | $40–$60 |
| Keyboard | Wired USB (any) | $15–$25 |
| Mouse | Wired USB (any) | $10–$15 |
| Display | 7" portable HDMI monitor OR e-ink display | $50–$80 |
| EMP protection | Heavy-duty Faraday bag OR sealed ammo can + Mylar liner + desiccant packs | $20–$40 |
| **Total** | | **~$375–$550** |

### Setup Notes
- Power: RPi 4/5 requires 5V/3A USB-C. Most 20W+ power banks deliver this.
- SSH config: enable SSH before first boot by placing empty file named `ssh` in `/boot/` partition.
- Default login: user `pi`, password `raspberry` — change immediately.
- SSD mount: `sudo mount /dev/sda1 /mnt/reboot` — add to `/etc/fstab` for auto-mount.
- Browser: Open `file:///mnt/reboot/REBOOT_OS/index.html` to launch this dashboard.

---

## TIER 1 — SOLO / HOME
*Biological survival: calories, clean water, triage medicine, shelter, self-defense.*

**Storage budget: ~500MB**

### Medical

| Title | Org | Format | Size | License | URL | Path |
|---|---|---|---|---|---|---|
| Where There Is No Doctor | Hesperian Foundation | PDF | ~20MB | CC BY-SA | https://hesperian.org/books/where-there-is-no-doctor/ | `./01_Survival/Medical/where_there_is_no_doctor.pdf` |
| Where There Is No Dentist | Hesperian Foundation | PDF | ~10MB | CC BY-SA | https://hesperian.org/books/where-there-is-no-dentist/ | `./01_Survival/Medical/where_there_is_no_dentist.pdf` |
| Where Women Have No Doctor | Hesperian Foundation | PDF | ~15MB | CC BY-SA | https://hesperian.org/books-and-resources/books/ | `./01_Survival/Medical/where_women_have_no_doctor.pdf` |
| A Book for Midwives | Hesperian Foundation | PDF | ~12MB | CC BY-SA | https://hesperian.org/books-and-resources/books/ | `./01_Survival/Medical/a_book_for_midwives.pdf` |
| mhGAP Intervention Guide v2.0 | WHO | PDF | ~5MB | CC BY-NC-SA | https://www.who.int/publications/i/item/9789241549790 | `./01_Survival/Psychology/mhgap_intervention_guide.pdf` |
| SAS Survival Handbook | John Wiseman | — | — | **PURCHASE REQUIRED** | ISBN: 978-0062378071 | — |

### Survival & Field Craft

| Title | Org | Format | Size | License | URL | Path |
|---|---|---|---|---|---|---|
| US Army Survival Manual FM 21-76 | US Army | PDF | ~5MB | Public Domain | https://archive.org/details/armysurvivalmanual | `./01_Survival/Field_Craft/fm_21-76_survival.pdf` |
| Special Operations Forces Medical Handbook | US Army | PDF | ~15MB | Public Domain | https://archive.org/details/SpecialOperationsForcesMedicalHandbook | `./01_Survival/Medical/sof_medical_handbook.pdf` |
| FM 5-103: Survivability | US Army | PDF | ~8MB | Public Domain | https://archive.org/details/FM5-103 | `./01_Survival/Shelter/fm_5-103_survivability.pdf` |
| FM 21-150: Combatives | US Army | PDF | ~10MB | Public Domain | https://archive.org/details/FM21-150 | `./01_Survival/Defense/fm_21-150_combatives.pdf` |
| FM 5-34: Engineer Field Data | US Army | PDF | ~10MB | Public Domain | https://archive.org/details/FM5-34 | `./01_Survival/Shelter/fm_5-34_engineer_field_data.pdf` |

### Water

| Title | Org | Format | Size | License | URL | Path |
|---|---|---|---|---|---|---|
| WHO Guidelines for Drinking-Water Quality (4th ed.) | WHO | PDF | ~3MB | CC BY-NC-SA | https://www.who.int/publications/i/item/9789241549950 | `./01_Survival/Water/who_drinking_water_guidelines.pdf` |
| Biosand Filter Construction Manual | CAWST | PDF | ~8MB | CC BY | https://resources.cawst.org/design-guide/biosand-filter | `./01_Survival/Water/biosand_filter_manual.pdf` |
| SODIS Solar Water Disinfection Guide | SODIS/Eawag | PDF | ~3MB | Open | https://www.sodis.ch/methode/anwendung/ausbildungsmaterial/index_EN | `./01_Survival/Water/sodis_guide.pdf` |

### Food

| Title | Org | Format | Size | License | URL | Path |
|---|---|---|---|---|---|---|
| Peterson Field Guides (regional foraging) | Peterson | — | — | **PURCHASE REQUIRED** | ISBN varies by region | — |
| Foraging references (FM 21-76 Appendix F) | US Army | PDF | — | Public Domain | Included in FM 21-76 above | `./01_Survival/Food/` *(see FM 21-76)* |

### Communications

| Title | Org | Format | Size | License | URL | Path |
|---|---|---|---|---|---|---|
| FCC Part 97 Amateur Radio Rules | FCC | PDF | ~1MB | Public Domain | https://www.ecfr.gov/current/title-47/chapter-I/subchapter-D/part-97 | `./01_Survival/Communications/fcc_part97_amateur_radio.pdf` |
| US Frequency Allocation Chart | NTIA | PDF | ~2MB | Public Domain | https://www.ntia.gov/page/us-frequency-allocation-chart | `./01_Survival/Communications/us_frequency_allocation.pdf` |
| Morse Code Reference Sheet | Public Domain | PDF | ~100KB | Public Domain | https://archive.org/details/morse-code-reference | `./01_Survival/Communications/morse_code_reference.pdf` |
| Baofeng UV-5R Programming Guide | Community | PDF | ~2MB | Open | https://archive.org/details/baofeng-uv5r-manual | `./01_Survival/Communications/baofeng_uv5r_guide.pdf` |
| ARRL Ham Radio License Manual | ARRL | — | — | **PURCHASE REQUIRED** | ISBN: 978-1625951373 | — |

---

## TIER 2 — COMMUNE / NEIGHBORHOOD
*Sustainable production. Feeding 10–50 people. Building tools. Basic trade.*

**Storage budget: ~20GB**

### Agriculture & Food Production

| Title | Org | Format | Size | License | URL | Path |
|---|---|---|---|---|---|---|
| CD3WD Project Archive | Ken Dart | ZIP (multiple) | ~15GB | Public Domain | https://archive.org/search?query=cd3wd | `./02_Infrastructure/Agriculture/cd3wd/` |
| Appropedia ZIM (offline wiki) | Appropedia / Kiwix | ZIM | ~1GB | CC BY-SA | https://wiki.kiwix.org/wiki/Content_in_all_languages | `./02_Infrastructure/Agriculture/appropedia.zim` |
| Seed Saving Guide | Seed Savers Exchange | PDF | ~5MB | Open | https://seedsavers.org/learn | `./02_Infrastructure/Agriculture/seed_saving_guide.pdf` |
| The New Self-Sufficient Gardener | John Seymour | — | — | **PURCHASE REQUIRED** | ISBN: 978-1405331463 | — |

### Construction

| Title | Org | Format | Size | License | URL | Path |
|---|---|---|---|---|---|---|
| Global Village Construction Set | Open Source Ecology | ZIP (CAD+docs) | ~2GB | CC BY-SA | https://wiki.opensourceecology.org/wiki/Global_Village_Construction_Set | `./02_Infrastructure/Construction/gvcs/` |
| Earthbag Building Guide | Cal-Earth / Community | PDF | ~10MB | Open | https://calearth.org/building-designs | `./02_Infrastructure/Construction/earthbag_building_guide.pdf` |
| Cob Building Handbook | multiple sources | PDF | ~5MB | Open | https://archive.org/search?query=cob+building | `./02_Infrastructure/Construction/cob_building_handbook.pdf` |

**GVCS Key Machines (highlight in dashboard):**
Compressed Earth Brick Press · LifeTrac Tractor · 3D Printer · Sawmill · Wind Turbine · Micro-house · Bakery Oven · Well-Drilling Rig

### Water & Sanitation

| Title | Org | Format | Size | License | URL | Path |
|---|---|---|---|---|---|---|
| UNICEF/WHO Well Drilling Manual | UNICEF | PDF | ~5MB | Open | https://www.unicef.org/wash/files/WASHTech_handdrilling_Manual_FINAL.pdf | `./02_Infrastructure/Water_Sanitation/unicef_well_drilling.pdf` |
| Rainwater Harvesting Manual | CAWST | PDF | ~8MB | CC BY | https://resources.cawst.org/ | `./02_Infrastructure/Water_Sanitation/rainwater_harvesting.pdf` |
| Humanure Handbook (excerpts) | Joseph Jenkins | PDF | Excerpts | **PURCHASE REQUIRED (full text)** | https://humanurehandbook.com — free excerpts at site | `./02_Infrastructure/Water_Sanitation/humanure_excerpts.pdf` |

### Energy (Micro-scale)

| Title | Org | Format | Size | License | URL | Path |
|---|---|---|---|---|---|---|
| Micro-Hydro Turbine Technical Briefs | Practical Action | PDF | ~3MB | Open | https://practicalaction.org/knowledge-centre/resources/ | `./02_Infrastructure/Energy/micro_hydro_turbine.pdf` |
| Small Solar 12V/24V Wiring Guide | Community (multiple) | PDF | ~5MB | Open | https://archive.org/search?query=off+grid+solar+wiring | `./02_Infrastructure/Energy/small_solar_wiring.pdf` |
| Biogas Digester Construction | CD3WD / FAO | PDF | ~8MB | Public Domain | Included in CD3WD archive | `./02_Infrastructure/Energy/` *(see CD3WD)* |

### Preservation & Storage

| Title | Org | Format | Size | License | URL | Path |
|---|---|---|---|---|---|---|
| USDA Complete Guide to Home Canning | USDA/NCHFP | PDF | ~5MB | Public Domain | https://nchfp.uga.edu/publications/publications_usda.html | `./02_Infrastructure/Preservation/usda_home_canning.pdf` |

### Trade

| Title | Org | Format | Size | License | URL | Path |
|---|---|---|---|---|---|---|
| Double-Entry Bookkeeping Fundamentals | Public Domain | PDF | ~2MB | Public Domain | https://archive.org/search?query=double+entry+bookkeeping | `./02_Infrastructure/Trade/double_entry_bookkeeping.pdf` |

---

## TIER 3 — TOWNS / CITIES
*Light industry, power grids, chemistry, mass communication, education systems.*

**Storage budget: ~100GB (Wikipedia ZIM alone: ~95GB)**

### Encyclopedia (The Knowledge Base)

| Title | Org | Format | Size | License | URL | Path |
|---|---|---|---|---|---|---|
| Wikipedia (English, with images) | Wikimedia / Kiwix | ZIM | ~95GB | CC BY-SA | https://download.kiwix.org/zim/wikipedia/ | `./03_Industry/Encyclopedia/wikipedia_en_all.zim` |
| Project Gutenberg (all books) | Gutenberg / Kiwix | ZIM | ~60GB (w/images) / ~3GB (text) | Public Domain | https://download.kiwix.org/zim/gutenberg/ | `./03_Industry/Encyclopedia/gutenberg_en_all.zim` |
| StackExchange Offline (select sites) | SE / Kiwix | ZIM | ~15GB | CC BY-SA | https://download.kiwix.org/zim/stack_exchange/ | `./03_Industry/Encyclopedia/stackexchange_selected.zim` |
| Wikibooks (English) | Wikimedia / Kiwix | ZIM | ~2GB | CC BY-SA | https://download.kiwix.org/zim/wikibooks/ | `./03_Industry/Encyclopedia/wikibooks_en_all.zim` |
| The Knowledge (Lewis Dartnell) | Dartnell | — | — | **PURCHASE REQUIRED** | ISBN: 978-0143127048 | — |

*StackExchange sites to prioritize: HomeImprovement, DIY, Gardening, Chemistry, Physics, Engineering, Survival, Cooking*

### Metallurgy & Smithing

| Title | Org | Format | Size | License | URL | Path |
|---|---|---|---|---|---|---|
| Practical Blacksmithing (4 vols., 1889) | M.T. Richardson | PDF | ~30MB | Public Domain | https://archive.org/search?query=practical+blacksmithing+richardson | `./03_Industry/Metallurgy/practical_blacksmithing_richardson.pdf` |

### Chemistry (Applied)

| Title | Org | Format | Size | License | URL | Path |
|---|---|---|---|---|---|---|
| Soap Making Reference (historical) | Public Domain | PDF | ~3MB | Public Domain | https://archive.org/search?query=soap+making+lye+historical | `./03_Industry/Chemistry/soap_making.pdf` |
| Glass Making Techniques | Public Domain | PDF | ~2MB | Public Domain | https://archive.org/search?query=glass+making+historical | `./03_Industry/Chemistry/glass_making.pdf` |
| Paper Making Manual | Public Domain | PDF | ~3MB | Public Domain | https://archive.org/search?query=paper+making+historical | `./03_Industry/Chemistry/paper_making.pdf` |

*Note: Penicillin synthesis (Fleming method), gunpowder composition, and fertilizer basics are covered in Wikipedia offline (Tier 3 Encyclopedia).*

### Power (Grid-scale)

| Title | Org | Format | Size | License | URL | Path |
|---|---|---|---|---|---|---|
| Steam Engine Construction (Victorian texts) | Public Domain | PDF | ~20MB | Public Domain | https://archive.org/search?query=steam+engine+construction+historical | `./03_Industry/Power/steam_engine_historical.pdf` |
| Hugh Piggott Wind Turbine Design | Hugh Piggott | PDF | ~10MB | Open (CC) | https://scoraigwind.co.uk/ | `./03_Industry/Power/piggott_wind_turbine.pdf` |

### Communications (Community-scale)

| Title | Org | Format | Size | License | URL | Path |
|---|---|---|---|---|---|---|
| Meshtastic / LoRa Mesh Networking Docs | Meshtastic | PDF/HTML | ~5MB | Apache 2.0 | https://meshtastic.org/docs/ | `./03_Industry/Communications/meshtastic_docs.pdf` |
| Semaphore & Flag Signaling Systems | Public Domain | PDF | ~2MB | Public Domain | https://archive.org/search?query=flag+signaling+semaphore | `./03_Industry/Communications/flag_semaphore_signaling.pdf` |

### Medicine (Advanced)

| Title | Org | Format | Size | License | URL | Path |
|---|---|---|---|---|---|---|
| WHO Model List of Essential Medicines (23rd ed.) | WHO | PDF | ~1MB | Open | https://www.who.int/publications/i/item/WHO-MHP-HPS-EML-2023.02 | `./03_Industry/Medicine_Advanced/who_essential_medicines.pdf` |
| Herbal Medicine Pharmacopoeia | WHO | PDF | ~10MB | Open | https://www.who.int/medicines/publications/pharmacopoeia/en/ | `./03_Industry/Medicine_Advanced/herbal_medicine_pharmacopoeia.pdf` |

### Education

| Title | Org | Format | Size | License | URL | Path |
|---|---|---|---|---|---|---|
| Khan Academy Lite | Khan Academy / Kiwix | ZIM | ~15GB | CC BY-NC-SA | https://download.kiwix.org/zim/khan_academy/ | `./03_Industry/Education/khan_academy.zim` |

---

## TIER 4 — STATES / NATIONS
*Preventing internal collapse. The layer everyone forgets. Most important long-term.*

**Storage budget: ~5GB (mostly small text files)**

### Constitutions & Governance Templates

| Title | Org | Format | Size | License | URL | Path |
|---|---|---|---|---|---|---|
| US Constitution + Bill of Rights + Amendments | US Gov | TXT/PDF | ~200KB | Public Domain | https://constitution.congress.gov/ | `./04_Governance/Constitutions/us_constitution_full.pdf` |
| The Federalist Papers | Hamilton/Madison/Jay | PDF | ~3MB | Public Domain | https://archive.org/details/federalistpaper00madigoog | `./04_Governance/Constitutions/federalist_papers.pdf` |
| The Great Law of Peace (Gayanashagowa) | Iroquois Confederacy | PDF | ~500KB | Public Domain | https://archive.org/search?query=great+law+of+peace+iroquois | `./04_Governance/Constitutions/great_law_of_peace.pdf` |
| Swiss Federal Constitution (English) | Swiss Confederation | PDF | ~500KB | Public Domain | https://www.fedlex.admin.ch/eli/cc/1999/404/en | `./04_Governance/Constitutions/swiss_federal_constitution.pdf` |
| Magna Carta (1215, English translation) | Public Domain | PDF | ~100KB | Public Domain | https://archive.org/details/magnacarta | `./04_Governance/Constitutions/magna_carta.pdf` |
| English Bill of Rights 1689 | Public Domain | PDF | ~100KB | Public Domain | https://archive.org/search?query=english+bill+of+rights+1689 | `./04_Governance/Constitutions/english_bill_of_rights_1689.pdf` |
| Universal Declaration of Human Rights | UN | PDF | ~200KB | Public Domain | https://www.un.org/en/about-us/universal-declaration-of-human-rights | `./04_Governance/Constitutions/udhr.pdf` |
| Robert's Rules of Order (1915 ed.) | Henry Robert | PDF | ~5MB | Public Domain | https://archive.org/details/robertsrulesofor00robe_0 | `./04_Governance/Constitutions/roberts_rules_of_order.pdf` |

### Conflict Resolution

| Title | Org | Format | Size | License | URL | Path |
|---|---|---|---|---|---|---|
| Restorative Justice Handbook | UN/UNODC | PDF | ~3MB | Open | https://www.unodc.org/pdf/criminal_justice/Handbook_on_Restorative_Justice_Programmes.pdf | `./04_Governance/Conflict_Resolution/restorative_justice_handbook.pdf` |
| Community Mediation Training Manual | various | PDF | ~5MB | Open | https://archive.org/search?query=community+mediation+training | `./04_Governance/Conflict_Resolution/community_mediation_manual.pdf` |

### Economics & Resource Management

| Title | Org | Format | Size | License | URL | Path |
|---|---|---|---|---|---|---|
| The Wealth of Nations | Adam Smith | PDF | ~5MB | Public Domain | https://archive.org/details/WealthOfNationsAdamSmith | `./04_Governance/Economics/wealth_of_nations.pdf` |
| Capital Vol. I | Karl Marx | PDF | ~8MB | Public Domain | https://archive.org/details/capitalcritiqueo00marx | `./04_Governance/Economics/capital_vol1_marx.pdf` |
| Governing the Commons | Elinor Ostrom | — | — | **PURCHASE REQUIRED** | ISBN: 978-1107569782 | — |
| Pacioli's Summa (Double-entry accounting, 1494) | Luca Pacioli | PDF | ~2MB | Public Domain | https://archive.org/search?query=pacioli+summa+de+arithmetica | `./04_Governance/Economics/pacioli_summa_double_entry.pdf` |

*Ostrom's 8 commons governance rules are summarized in Wikipedia (Elinor Ostrom article) — covered by Tier 3 Wikipedia ZIM.*

### Historical Collapse Case Studies

| Title | Org | Format | Size | License | URL | Path |
|---|---|---|---|---|---|---|
| Decline and Fall of the Roman Empire (Gibbon) | Edward Gibbon | PDF | ~30MB | Public Domain | https://archive.org/details/declineandfallof00gibb | `./04_Governance/History/gibbon_decline_fall_roman_empire.pdf` |
| Collapse (Diamond) | Jared Diamond | — | — | **PURCHASE REQUIRED** | ISBN: 978-0143117001 | — |

*Easter Island, Maya, Norse Greenland, Khmer Empire, Weimar hyperinflation, Zimbabwe, Venezuela, Rwanda — all covered in Wikipedia ZIM (Tier 3).*

### Philosophy & Ethics

| Title | Org | Format | Size | License | URL | Path |
|---|---|---|---|---|---|---|
| Meditations (Marcus Aurelius) | Marcus Aurelius | PDF | ~1MB | Public Domain | https://archive.org/details/meditationsofmar00marc | `./04_Governance/Philosophy/marcus_aurelius_meditations.pdf` |
| Tao Te Ching (multiple translations) | Lao Tzu | PDF | ~500KB | Public Domain | https://archive.org/search?query=tao+te+ching+lao+tzu | `./04_Governance/Philosophy/tao_te_ching.pdf` |
| Politics (Aristotle) | Aristotle | PDF | ~2MB | Public Domain | https://archive.org/details/politicsofarist00arisuoft | `./04_Governance/Philosophy/aristotle_politics.pdf` |
| Two Treatises of Government | John Locke | PDF | ~2MB | Public Domain | https://archive.org/details/twotreatisesofgo00lock | `./04_Governance/Philosophy/locke_two_treatises.pdf` |

### Military & Security (Defensive)

| Title | Org | Format | Size | License | URL | Path |
|---|---|---|---|---|---|---|
| The Art of War | Sun Tzu | PDF | ~500KB | Public Domain | https://archive.org/details/theartofwar00suntgoog | `./04_Governance/Defense/sun_tzu_art_of_war.pdf` |
| Geneva Conventions (simplified summary) | ICRC | PDF | ~2MB | Open | https://www.icrc.org/en/document/geneva-conventions-1949-additional-protocols | `./04_Governance/Defense/geneva_conventions_summary.pdf` |

---

## TIER 5 — RENAISSANCE
*Once survival is handled and governance is stable, rebuild culture and push forward.*

**Storage budget: ~10GB (mostly already covered by Tier 3 ZIMs)**

### Mathematics

| Title | Org | Format | Size | License | URL | Path |
|---|---|---|---|---|---|---|
| Euclid's Elements (Heath translation) | Euclid / T.L. Heath | PDF | ~5MB | Public Domain | https://archive.org/details/thirteenbookseu00heibgoog | `./05_Renaissance/Mathematics/euclid_elements.pdf` |

*Full math curriculum through calculus: covered by Khan Academy ZIM (Tier 3).*
*Statistics and probability: covered by Wikipedia ZIM (Tier 3).*

### Science (Theoretical)

| Title | Org | Format | Size | License | URL | Path |
|---|---|---|---|---|---|---|
| Principia Mathematica | Isaac Newton | PDF | ~10MB | Public Domain | https://archive.org/details/newtonspmathema00newtrich | `./05_Renaissance/Science/newton_principia.pdf` |
| On the Origin of Species (1st ed., 1859) | Charles Darwin | PDF | ~3MB | Public Domain | https://archive.org/details/onoriginofspecie00darw | `./05_Renaissance/Science/darwin_origin_of_species.pdf` |
| Periodic Table (extended, with extraction methods) | Multiple | PDF | ~2MB | Public Domain | https://archive.org/search?query=periodic+table+reference | `./05_Renaissance/Science/periodic_table_reference.pdf` |
| Star Charts + Navigation / Planting Calendar | Multiple | PDF | ~5MB | Public Domain | https://archive.org/search?query=star+chart+navigation | `./05_Renaissance/Science/star_charts_navigation.pdf` |

### Art & Music

| Title | Org | Format | Size | License | URL | Path |
|---|---|---|---|---|---|---|
| De Architectura (Vitruvius) | Vitruvius | PDF | ~5MB | Public Domain | https://archive.org/details/vitruviustenbook00vitr | `./05_Renaissance/Art/vitruvius_de_architectura.pdf` |
| Drawing & Illustration Fundamentals (historical) | Public Domain | PDF | ~10MB | Public Domain | https://archive.org/search?query=drawing+instruction+historical | `./05_Renaissance/Art/drawing_fundamentals.pdf` |
| Instrument Construction Guides | Public Domain | PDF | ~5MB | Open | https://archive.org/search?query=instrument+making+flute+drum | `./05_Renaissance/Art/instrument_construction.pdf` |

### Language

| Title | Org | Format | Size | License | URL | Path |
|---|---|---|---|---|---|---|
| Wiktionary ZIM (all languages) | Wikimedia / Kiwix | ZIM | ~5GB | CC BY-SA | https://download.kiwix.org/zim/wiktionary/ | `./05_Renaissance/Language/wiktionary_all.zim` |

---

## ITEMS REQUIRING PURCHASE
*Buy these before loading the drive. They fill critical gaps not covered by free sources.*

| Title | Author | Why Critical | ISBN / Notes |
|---|---|---|---|
| SAS Survival Handbook | John "Lofty" Wiseman | Climate-specific survival techniques, comprehensive field craft | 978-0062378071 |
| The Knowledge | Lewis Dartnell | Best single narrative on civilizational restart sequences | 978-0143127048 |
| Peterson Field Guide (your region) | Roger Tory Peterson | Local foraging — what's edible in YOUR area | Varies by region |
| ARRL Ham Radio License Manual | ARRL | Complete radio licensing and operating guide | 978-1625951373 |
| Governing the Commons | Elinor Ostrom | The definitive framework for managing shared resources | 978-1107569782 |
| Collapse | Jared Diamond | Why societies fail — pattern recognition for governance | 978-0143117001 |
| The New Self-Sufficient Gardener | John Seymour | Most comprehensive homestead food production guide | 978-1405331463 |
| Humanure Handbook (full text) | Joseph Jenkins | Complete composting toilet system | 978-0964425835 |

**Estimated purchase cost: ~$150–$200 for all 8 books**

---

## WEEKEND DOWNLOAD CHECKLIST
*Largest files first. Run these downloads in sequence — don't try to run all simultaneously.*

### Session 1 — The Big ZIMs (~175GB, plan for 2–3 days on fast connection)
- [ ] Wikipedia English (all, with images) — ~95GB — `download.kiwix.org/zim/wikipedia/`
- [ ] Project Gutenberg (all books, with images) — ~60GB — `download.kiwix.org/zim/gutenberg/`
- [ ] Khan Academy — ~15GB — `download.kiwix.org/zim/khan_academy/`
- [ ] StackExchange (selected sites) — ~15GB — `download.kiwix.org/zim/stack_exchange/`

### Session 2 — Infrastructure Archives (~18GB)
- [ ] CD3WD Archive — ~15GB — search archive.org for "cd3wd"
- [ ] Open Source Ecology GVCS — ~2GB — opensourceecology.org
- [ ] Appropedia ZIM — ~1GB — `download.kiwix.org/zim/`

### Session 3 — Wikibooks + Wiktionary (~7GB)
- [ ] Wikibooks English — ~2GB — `download.kiwix.org/zim/wikibooks/`
- [ ] Wiktionary (all languages) — ~5GB — `download.kiwix.org/zim/wiktionary/`

### Session 4 — Small PDFs (~500MB, fast)
- [ ] All Hesperian Foundation books (4 titles) — hesperian.org
- [ ] FM 21-76 + FM 5-103 + FM 5-34 + FM 21-150 — archive.org
- [ ] SOF Medical Handbook — archive.org
- [ ] WHO Water Guidelines + mhGAP Guide + Essential Medicines — who.int
- [ ] CAWST Biosand Filter + Rainwater Harvesting — cawst.org
- [ ] SODIS Guide — sodis.ch
- [ ] USDA Complete Canning Guide — nchfp.uga.edu
- [ ] US Constitution + Federalist Papers + UDHR + Magna Carta — archive.org / official sources
- [ ] Meshtastic Docs — meshtastic.org
- [ ] All public domain philosophy texts (Marcus Aurelius, Locke, Aristotle, Tao Te Ching)
- [ ] Gibbon's Decline and Fall — archive.org
- [ ] Practical Blacksmithing (Richardson) — archive.org
- [ ] Newton Principia + Darwin Origin + Euclid Elements — archive.org
- [ ] Vitruvius De Architectura — archive.org
- [ ] FCC Part 97 + Frequency Chart + Morse Reference + Baofeng Guide
- [ ] Hugh Piggott Wind Turbine Design — scoraigwind.co.uk
- [ ] Practical Action Micro-Hydro Briefs — practicalaction.org
- [ ] Robert's Rules of Order (1915) — archive.org
- [ ] UNICEF Well Drilling Manual
- [ ] Sun Tzu Art of War — archive.org
- [ ] Geneva Conventions summary — icrc.org

### Session 5 — Verify & Organize
- [ ] Open `index.html` in browser — confirm all tiers load
- [ ] Spot-check 10 random file paths against actual SSD folder structure
- [ ] Purchase and add physical books (store in waterproof bag with drive)

---

*REBOOT OS v1.0 — Offline Civilization Archive | ethan payton / past.El*
