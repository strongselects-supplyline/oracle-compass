import type { ReactNode } from "react";

export const VALID_SLUGS = [
  "90-day-roadmap",
  "wartime-rhythm",
  "the-protocol",
  "sovereignty-stack",
  "body-codex",
  "rank-scroll",
  "mudra-system",
  "frequency-key",
  "waking-mind",
  "mixing-codex",
  "vocal-codex",
  "spotify-ads",
];

// ═══════════════════════════════════════════════════════════════
// Helper components for reuse across doctrine pages
// ═══════════════════════════════════════════════════════════════

function Header({ tag, title, sub }: { tag: string; title: string; sub: string }) {
  return (
    <div className="scroll-page-header">
      <div className="scroll-page-tag">{tag}</div>
      <h1 className="scroll-page-title">{title}</h1>
      <p className="scroll-page-sub">{sub}</p>
    </div>
  );
}

function Callout({ type, icon, children }: { type: string; icon: string; children: ReactNode }) {
  return (
    <div className={`scroll-callout sc-${type}`}>
      <span className="scroll-callout-icon">{icon}</span>
      <div className="scroll-callout-body">{children}</div>
    </div>
  );
}

function Step({ num, title, desc }: { num: number; title: string; desc: string }) {
  return (
    <div className="scroll-pstep">
      <div className="scroll-pstep-num">{num}</div>
      <div className="scroll-pstep-body">
        <div className="scroll-pstep-title">{title}</div>
        <div className="scroll-pstep-desc">{desc}</div>
      </div>
    </div>
  );
}

function Bench({ text }: { text: ReactNode }) {
  return (
    <div className="scroll-bench">
      <div className="scroll-bench-check">✓</div>
      <div className="scroll-bench-text">{text}</div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// DOCTRINE CONTENT — Each page ported from sovereign_scroll.html
// ═══════════════════════════════════════════════════════════════

function RoadmapPage() {
  return (
    <>
      <Header tag="The Plan · Arc 1→3" title="90-Day Roadmap" sub="April 18 → July 17, 2026. Three releases. One catalog. Compounding data." />
      <h2 className="scroll-h3">Overview — Three Arcs</h2>
      <div className="scroll-table-wrap"><table className="scroll-table"><thead><tr><th>Arc</th><th>Dates</th><th>Release</th><th>Pop Target</th><th>Sovereignty</th></tr></thead><tbody>
        <tr><td><span className="stp-badge badge-gold">Arc 1 — EP</span></td><td>Apr 18 – May 17</td><td>ALL LOVE EP (5 trk) · Apr 25</td><td>21 → 25</td><td>Wk 1 Honeymoon → Flatline</td></tr>
        <tr><td><span className="stp-badge badge-blue">Arc 2 — Album</span></td><td>May 18 – Jun 16</td><td>ALL LOVE (11 trk) · May 19-20</td><td>25 → 30</td><td>Emotions Return</td></tr>
        <tr><td><span className="stp-badge badge-purple">Arc 3 — Deluxe</span></td><td>Jun 17 – Jul 17</td><td>ALL LOVE DELUXE (22 trk) · ~Jul 1</td><td>30 → 35</td><td>Compounding</td></tr>
      </tbody></table></div>
      <Callout type="important" icon="⚡"><strong>The meta-pattern:</strong> Each release re-ignites the algorithm. Album uses EP&apos;s ISRCs (data carries over). Deluxe uses album&apos;s ISRCs. One catalog, three events, zero lost data.</Callout>
      <h2 className="scroll-h3">Key Dates</h2>
      <div className="scroll-table-wrap"><table className="scroll-table"><thead><tr><th>Date</th><th>Event</th></tr></thead><tbody>
        <tr><td>Mon Apr 21</td><td>Amuse upload (EP)</td></tr>
        <tr><td style={{color:"#e05545",fontWeight:700}}>Fri Apr 25</td><td><strong>EP DROPS</strong> (Uranus enters Gemini)</td></tr>
        <tr><td>Apr 26 – May 7</td><td>THE FLATLINE (lowest motivation)</td></tr>
        <tr><td>Tue Apr 28</td><td>Birthday (Flatline day 4 — keep personal)</td></tr>
        <tr><td>Thu May 7</td><td>Flatline ends (emotions return)</td></tr>
        <tr><td>Sun May 17</td><td>Album upload deadline</td></tr>
        <tr><td style={{color:"#4d9de0",fontWeight:700}}>Wed May 20</td><td><strong>ALBUM DROPS</strong></td></tr>
        <tr><td>Sun Jun 14</td><td>Deluxe upload deadline</td></tr>
        <tr><td style={{color:"#9b72cf",fontWeight:700}}>Fri Jun 19</td><td><strong>DELUXE DROPS</strong></td></tr>
        <tr><td>Fri Jul 10</td><td>CREAM decision point</td></tr>
        <tr><td style={{color:"#d4a843",fontWeight:700}}>Fri Jul 17</td><td><strong>90-DAY REVIEW</strong></td></tr>
      </tbody></table></div>
    </>
  );
}

function WartimePage() {
  return (
    <>
      <Header tag="90-Day Sovereign Action Schematic · April 6 → July 5, 2026" title="Wartime Rhythm" sub="&quot;The algorithm won't build your career. You will.&quot;" />
      <h2 className="scroll-h3">Part I — Who You Are</h2>
      <div className="scroll-card scroll-card-left"><div className="scroll-card-title" style={{marginBottom:8}}>The Artist Definition</div>
        <p className="scroll-p">You are not a content creator who makes music. You are a <strong>recording artist who uses content as distribution infrastructure</strong>. The music is the primary object. Everything else is world-building in service of it.</p>
        <p className="scroll-p">Your sonic identity is verified, not claimed: <em>High Danceability / Low Energy</em> — the cocktail hour pocket. Sexy ({">"}0.76), Chill ({">"}0.56), Happy ({">"}0.49). This is the Cyanite data.</p>
      </div>
      <Callout type="tip" icon="🎯"><strong>The Troy Taylor Standard:</strong> &quot;How many times you gonna sing that?&quot; — Obsessive repetition is not perfectionism. It is the refusal to let a great song settle for a good take.</Callout>
      <h2 className="scroll-h3">Part V — The 90-Day Arc</h2>
      <div className="scroll-grid-3">
        <div className="scroll-grid-card" style={{borderTop:"3px solid #e05545"}}><div className="scroll-gc-title" style={{color:"#e05545"}}>Phase 1 · THE SPRINT</div><div className="scroll-gc-desc">Apr 6–24 (18 days). 4 actions/day. Hard time limits.</div></div>
        <div className="scroll-grid-card" style={{borderTop:"3px solid #3ecf71"}}><div className="scroll-gc-title" style={{color:"#3ecf71"}}>Phase 2 · THE COMPOUND</div><div className="scroll-gc-desc">Apr 25–May 31 (37 days). Serotonin takes over. CREAM pre-production.</div></div>
        <div className="scroll-grid-card" style={{borderTop:"3px solid #4d9de0"}}><div className="scroll-gc-title" style={{color:"#4d9de0"}}>Phase 3 · THE SUMMER</div><div className="scroll-gc-desc">Jun 1–Jul 5 (35 days). Data-informed launch. CREAM executes what ALL LOVE proved.</div></div>
      </div>
      <h2 className="scroll-h3">Part VIII — North Star Metrics</h2>
      <div className="scroll-metrics-grid">
        <div className="scroll-metric-card"><span className="scroll-metric-val">1,600+</span><div className="scroll-metric-lbl">Spotify Followers · Apr 24</div></div>
        <div className="scroll-metric-card"><span className="scroll-metric-val">2,500+</span><div className="scroll-metric-lbl">Spotify Followers · Jul 5</div></div>
        <div className="scroll-metric-card"><span className="scroll-metric-val">3%+</span><div className="scroll-metric-lbl">Save Rate · SF Target</div></div>
        <div className="scroll-metric-card"><span className="scroll-metric-val">4%+</span><div className="scroll-metric-lbl">Save Rate · CREAM Target</div></div>
        <div className="scroll-metric-card"><span className="scroll-metric-val">500+</span><div className="scroll-metric-lbl">EP First-Week Streams</div></div>
        <div className="scroll-metric-card"><span className="scroll-metric-val">$1,800</span><div className="scroll-metric-lbl">DoorDash Monthly Target</div></div>
      </div>
      <Callout type="important" icon="🔑"><strong>The Single Lever:</strong> Save rate → Discover Weekly → algorithm → organic growth. Every content decision exists to drive saves.</Callout>
      <h2 className="scroll-h3">Part IX — Anti-Drift Rules (14 Load-Bearing Walls)</h2>
      <div className="scroll-card scroll-card-left">
        <ol style={{paddingLeft:20}}>
          <li className="scroll-p"><strong>Never trust claimed file writes.</strong> Verify against the live filesystem.</li>
          <li className="scroll-p"><strong>Software work is open as needed</strong> — permitted when it directly serves the active release cycle.</li>
          <li className="scroll-p"><strong>Kill List is the single source of truth for daily priorities.</strong></li>
          <li className="scroll-p"><strong>Builder-avoidance loops are neurochemical, not laziness.</strong></li>
          <li className="scroll-p"><strong>Before any collaboration, splits in writing before production begins.</strong></li>
          <li className="scroll-p"><strong>Don&apos;t reset the clock.</strong> 94 days is the target.</li>
        </ol>
      </div>
    </>
  );
}

function ProtocolPage() {
  return (
    <>
      <Header tag="Sovereignty · Initiated Apr 17, 2026" title="The Protocol" sub="The commitment architecture. Designed to compound over 90 days into an identity shift — from musician to full creative director." />
      <h2 className="scroll-h3">Phase Timeline</h2>
      <div className="scroll-stack">
        <div className="scroll-stack-level"><div className="scroll-stack-title"><span>Week 1 (Apr 17–24) · THE HONEYMOON</span><span className="stp-badge badge-green">Now</span></div><div className="scroll-stack-desc">Motivation is high. Lock in the morning routines. Stay structural. You are installing, not performing.</div></div>
        <div className="scroll-stack-level"><div className="scroll-stack-title"><span>Weeks 2–3 (Apr 25–May 7) · THE FLATLINE</span><span className="stp-badge badge-red">Critical</span></div><div className="scroll-stack-desc">Dopamine recalibration. 80% of protocol failures happen here. <strong>Do not measure results in this window. Just show up.</strong></div></div>
        <div className="scroll-stack-level"><div className="scroll-stack-title">Weeks 4–6 (May 8–28) · EMOTIONS RETURN</div><div className="scroll-stack-desc">Feelings come back louder. Music gets better. Motivation returns grounded in demonstrated identity.</div></div>
        <div className="scroll-stack-level sc-highlight"><div className="scroll-stack-title">Weeks 7–12 (Jun – mid Jul) · COMPOUNDING</div><div className="scroll-stack-desc">The identity shift locks in. The new behavior IS you. Creative output accelerates.</div></div>
      </div>
      <h2 className="scroll-h3">Trigger Replacement Architecture</h2>
      <div className="scroll-table-wrap"><table className="scroll-table"><thead><tr><th>Trigger / Old Behavior</th><th>Replacement</th></tr></thead><tbody>
        <tr><td>Phone after 10 PM → scroll</td><td>Phone in another room. Tomorrow&apos;s task on paper.</td></tr>
        <tr><td>Boredom → pornography</td><td>Jnana mudra + breath of fire. Then create something.</td></tr>
        <tr><td>Stress spike → cannabis</td><td>Box breathing 4-4-4-4 + Shuni mudra. Walk.</td></tr>
        <tr><td>Creative block → avoidance</td><td>Kapalabhati (30 rounds). Set timer for 5 min. Start anyway.</td></tr>
        <tr><td>Loneliness → stimulus seeking</td><td>Call partner. Record a voice memo. Sit with it.</td></tr>
      </tbody></table></div>
      <Callout type="warning" icon="⚠️"><strong>The Void:</strong> A moment where a trigger fires and nothing is queued. Fix is structural: phone in another room after 10 PM, tomorrow&apos;s first task written before bed.</Callout>
    </>
  );
}

function SovereigntyStackPage() {
  return (
    <>
      <Header tag="Sovereignty · Physical Practice Manual" title="The Sovereignty Stack" sub="The How-To Scroll. 10 practices covering breathwork, somatic check-ins, movement, and metabolic rules." />
      <h2 className="scroll-h3">Practice 01: Jnana Mudra + OM Activation <span className="stp-badge badge-gold">90 sec</span></h2>
      <Callout type="important" icon="🔑"><strong>The Captain&apos;s Chair Ignition.</strong> First thing after drinking water. Replaces the doom-scroll.</Callout>
      <Step num={1} title="Find Your Seat" desc="Sit upright on the edge of your bed or a chair. Spine straight but not rigid. Feet flat on the floor." />
      <Step num={2} title="Jnana Mudra — The Connection" desc="Touch the tip of your index finger to the tip of your thumb on each hand, forming a circle. Palms face upward on knees." />
      <Step num={3} title="Close Eyes & Breathe In" desc="Close your eyes. Take one full breath in through the nose." />
      <Step num={4} title="Chant the OM" desc='On the exhale, chant "OM" (pronounced AUM — three sounds blending). Feel the vibration physically.' />
      <Step num={5} title="Mula Bandha — The Root Lock" desc="Gently engage the pelvic floor muscles. Hold this light contraction through the entire OM. This is not a clench — it's a lift." />
      <Step num={6} title="Repeat" desc="3–5 OMs total. After the final OM, sit in silence for 10 seconds. Open your eyes." />
      <hr className="scroll-hr" />
      <h2 className="scroll-h3">Practice 02: Nadi Shodhana <span className="stp-badge badge-blue">5 min</span></h2>
      <Callout type="note" icon="ℹ️"><strong>Alternate Nostril Breathing.</strong> Balances the autonomic nervous system. The single most effective breathwork for ADHD executive function.</Callout>
      <Step num={1} title="Right Hand: Vishnu Mudra" desc="Fold index + middle finger into your palm. Use thumb to close right nostril, ring finger for left." />
      <Step num={2} title="The Breathing Cycle" desc="Close right → Inhale left 4 counts → Hold both 4 → Exhale right 4 → Inhale right 4 → Hold both 4 → Exhale left 4. That is ONE round." />
      <Step num={3} title="Duration" desc="Repeat for 5 minutes (~8–10 rounds). After final round, take 3 natural breaths." />
      <hr className="scroll-hr" />
      <h2 className="scroll-h3">Practice 07: Barrett Body Budget Rules <span className="stp-badge badge-red">Standing Protocol</span></h2>
      <div className="scroll-card scroll-card-left">
        <ol style={{paddingLeft:20}}>
          <li className="scroll-p"><strong>Sleep:</strong> Lights out 10:30 PM. Dopamine receptors upregulate, neuroplasticity happens.</li>
          <li className="scroll-p"><strong>Caffeine Cutoff:</strong> 1:00 PM. After 1 PM you&apos;re stealing from tomorrow.</li>
          <li className="scroll-p"><strong>Protein Pre-Session:</strong> Eggs, oats, banana. Skipping crashes executive function at hour 3.</li>
          <li className="scroll-p"><strong>Hydration for Vocals:</strong> Room-temp water 2–4 HOURS before tracking.</li>
          <li className="scroll-p"><strong>No Dairy 2 Hours Before Vocals.</strong></li>
          <li className="scroll-p"><strong>Fruit Over Sugar:</strong> Banana first. Every time.</li>
          <li className="scroll-p"><strong>Mid-Session Fuel at the Desk.</strong></li>
          <li className="scroll-p"><strong>Sunday Meal Prep:</strong> 30–45 min. Rice, chicken thighs, boiled eggs, PB&amp;J. $38–48 at Aldi.</li>
        </ol>
      </div>
    </>
  );
}

function BodyCodexPage() {
  return (
    <>
      <Header tag="Sovereignty · Physical" title="Sovereign Body Codex" sub="Full kinetic chain diagnostic. Bilateral knee history, pelvic floor, upper chain, somatic signal decoder, and phase-locked movement progressions." />
      <h2 className="scroll-h3">Section I — Lower Chain Diagnostic</h2>
      <div className="scroll-card scroll-card-left"><div className="scroll-card-head"><div className="scroll-card-title">Right Knee — Meniscal History</div><span className="stp-badge badge-green">Recovered</span></div>
        <p className="scroll-p">Multiple surgeries over ~5 years. Fully recovered as of April 2026. Currently in active fascial and muscular re-activation.</p>
        <div className="scroll-table-wrap"><table className="scroll-table"><thead><tr><th>Rule</th><th>Protocol</th></tr></thead><tbody>
          <tr><td>Squat Depth</td><td>No below-parallel until Phase 2 (Anbu) and only after 6+ consecutive green checks.</td></tr>
          <tr><td>Single-Leg</td><td>Yellow/Red pre-movement = no single-leg work that day.</td></tr>
          <tr><td>Plyometrics</td><td>Not available until Kage rank minimum.</td></tr>
        </tbody></table></div>
      </div>
      <div className="scroll-card scroll-card-left sc-orange"><div className="scroll-card-head"><div className="scroll-card-title">Left Knee — Infrapatellar Fat Pad (Hoffa&apos;s)</div><span className="stp-badge badge-gold">Permanent Protocol</span></div>
        <p className="scroll-p">Fat pad compression injury. <strong>Permanent protocol adjustment</strong>, not temporary.</p>
        <div className="scroll-table-wrap"><table className="scroll-table"><thead><tr><th>Rule</th><th>Protocol</th></tr></thead><tbody>
          <tr><td>Full Extension</td><td>Never lock out under load. Stop 10–15° before full extension. Permanent.</td></tr>
          <tr><td>Kneeling</td><td>Available. Animal flow and knees-over-toes work completed. Mat on hard surfaces.</td></tr>
        </tbody></table></div>
      </div>
      <h2 className="scroll-h3">Section III — Somatic Signal Decoder</h2>
      <div className="scroll-table-wrap"><table className="scroll-table"><thead><tr><th>Signal Type</th><th>Characteristics</th><th>Response</th></tr></thead><tbody>
        <tr><td style={{color:"#e05545"}}>Real Pain</td><td>Sharp, localized, bright. Increases with movement.</td><td><strong>Stop. Don&apos;t train. 48+ hours.</strong></td></tr>
        <tr><td style={{color:"#e8944a"}}>Somatized Stress</td><td>Dull, diffuse, moves around. Decreases within 5 min of pelvic floor unlock breath.</td><td><strong>Continue gently. Movement helps.</strong></td></tr>
        <tr><td style={{color:"#4d9de0"}}>Detox Spike</td><td>Rises in waves, timed with craving cycles.</td><td><strong>Rest. Hydration. Protein.</strong></td></tr>
      </tbody></table></div>
      <Callout type="tip" icon="✅"><strong>The 5-Minute Test:</strong> Lie down. Elevate both legs. 10 pelvic floor unlock breaths. Same signal? → Real pain. Decreased? → Somatized stress. Shifted? → Detox spike.</Callout>
    </>
  );
}

function RankScrollPage() {
  return (
    <>
      <Header tag="Sovereignty · Progression · The Complete Path" title="The Sovereign Rank Scroll" sub="Jonin → God of Shinobi. Six tiers of mastery. All dates locked. Benchmarks objective." />
      <h2 className="scroll-h3">The Rank Structure</h2>
      <div className="scroll-table-wrap"><table className="scroll-table"><thead><tr><th>Rank</th><th>Timeline</th><th>Definition</th><th>Status</th></tr></thead><tbody>
        <tr><td><span className="stp-badge badge-gold">JONIN</span></td><td>Now (Apr 8)</td><td>Elite specialist. Execute in silence.</td><td style={{color:"#3ecf71"}}>✓ CURRENT</td></tr>
        <tr><td><span className="stp-badge badge-blue">ANBU</span></td><td>June 1, 2026</td><td>Black ops specialist. Operating in shadows.</td><td>—</td></tr>
        <tr><td><span className="stp-badge badge-purple">KAGE</span></td><td>July 5, 2026</td><td>Sovereign leader. Zero external dependency.</td><td>—</td></tr>
        <tr><td><span className="stp-badge badge-red">S-RANK</span></td><td>October 2026</td><td>The Disruptor. You engineer placement.</td><td>—</td></tr>
        <tr><td><span className="stp-badge badge-orange">LEGENDARY SANNIN</span></td><td>April 2027</td><td>Cultural Pillar. Multi-era survivor.</td><td>—</td></tr>
        <tr><td><span className="stp-badge badge-gold">GOD OF SHINOBI</span></td><td>December 2027</td><td>Paradigm Shifter. You BUILD the ecosystem.</td><td>—</td></tr>
      </tbody></table></div>
      <h2 className="scroll-h3">Jonin → Anbu Benchmarks</h2>
      <div className="scroll-card scroll-card-left">
        <Bench text={<><strong>ALL LOVE EP Released</strong> — April 24, 2026. First-week data collected.</>} />
        <Bench text={<><strong>Three Tracks Live on Spotify</strong> — Sweet Frustration, East Side Love, Like I Did.</>} />
        <Bench text={<><strong>Save Rate 3%+</strong> — Achieved on at least 1 track.</>} />
        <Bench text={<><strong>Gorilla Geo Activated</strong> — DM outreach running 3–5 messages/day.</>} />
        <Bench text={<><strong>Sobriety Day 60</strong> — Clock not reset.</>} />
        <Bench text={<><strong>Content Factory Output</strong> — 3+ assets/week consistently.</>} />
        <Bench text={<><strong>DoorDash Revenue</strong> — $1,800/month for April AND May confirmed.</>} />
      </div>
    </>
  );
}

function MudraPage() {
  return (
    <>
      <Header tag="Mind + Body · Hand Seals" title="The Mudra System" sub="State-diagnosis → hand seal → breathwork → body position. Five states, five protocols." />
      <h2 className="scroll-h3">Quick Reference — State → Protocol</h2>
      <div className="scroll-grid-2">
        <div className="scroll-grid-card"><div className="scroll-gc-title" style={{color:"#fb923c"}}>01 · Lethargy</div><div className="scroll-gc-desc"><strong>Prana Mudra</strong> — ring + pinky to thumb<br/>Breath: Kapalabhati · Gaze UP</div></div>
        <div className="scroll-grid-card"><div className="scroll-gc-title" style={{color:"#f472b6"}}>02 · Lust / Excess</div><div className="scroll-gc-desc"><strong>Brahma Mudra</strong> — fists, thumbs tucked<br/>Breath: Sitali · Gaze DOWN</div></div>
        <div className="scroll-grid-card"><div className="scroll-gc-title" style={{color:"#fbbf24"}}>03 · Fear / Doubt</div><div className="scroll-gc-desc"><strong>Abhaya + Prithvi</strong><br/>Breath: Box Breathing 4-4-4-4 · Gaze WIDE</div></div>
        <div className="scroll-grid-card"><div className="scroll-gc-title" style={{color:"#f87171"}}>04 · Rage</div><div className="scroll-gc-desc"><strong>Shuni</strong> (middle to thumb) or <strong>Kali</strong> (index blades up)<br/>Breath: 4-8 long exhale · Gaze DOWN</div></div>
        <div className="scroll-grid-card"><div className="scroll-gc-title" style={{color:"#3ecf8e"}}>05 · Flow / Create</div><div className="scroll-gc-desc"><strong>Jnana Mudra</strong> — index to thumb, palms up<br/>Breath: Nadi Shodhana · Gaze SOFT</div></div>
        <div className="scroll-grid-card"><div className="scroll-gc-title" style={{color:"#9b72cf"}}>Universal Add-On</div><div className="scroll-gc-desc"><strong>Mula Bandha</strong> — pelvic floor contraction<br/>Pairs with any state. Anchors the energy.</div></div>
      </div>
      <h2 className="scroll-h3">State 01 — Lethargy / Depletion</h2>
      <div className="scroll-state-card sc-lethargy">
        <div className="scroll-state-label">State 01</div>
        <div className="scroll-state-name" style={{color:"#fb923c"}}>LETHARGY / DEPLETION</div>
        <div className="scroll-state-desc">Can&apos;t get started, heavy, foggy, no motivation. Engine at 10%.</div>
        <div className="scroll-mudra-block"><div className="scroll-mudra-name">PRANA MUDRA <span className="stp-badge badge-gold">Primary</span></div>
          <ul className="scroll-steps"><li>Ring + pinky fingertips to thumb tip. Index and middle extend straight.</li><li>Palms face upward on knees. Both hands.</li></ul>
        </div>
        <p className="scroll-p"><strong>Breathwork:</strong> Kapalabhati — 30 sharp exhales through nose, passive inhales. 3 rounds.<br/><strong>Body:</strong> Stand up. Gaze up at 45°. Shoulders back.<br/><strong>Hold:</strong> 3–5 min or until energized.</p>
      </div>
      <h2 className="scroll-h3">State 05 — Flow / Creative Access</h2>
      <div className="scroll-state-card sc-flow">
        <div className="scroll-state-label">State 05</div>
        <div className="scroll-state-name" style={{color:"#3ecf8e"}}>FLOW / CREATIVE STATE</div>
        <div className="scroll-state-desc">Clear mind, body settled, creative ideas arriving without effort. This is the target state.</div>
        <div className="scroll-mudra-block"><div className="scroll-mudra-name">JNANA MUDRA <span className="stp-badge badge-green">Primary</span></div>
          <ul className="scroll-steps"><li>Index fingertip to thumb tip, forming a circle. Other three fingers extend.</li><li>Palms face upward on knees. Both hands.</li></ul>
        </div>
        <p className="scroll-p"><strong>Breathwork:</strong> Nadi Shodhana — 5 rounds alternate nostril breathing.<br/><strong>Body:</strong> Soft gaze. Spine tall but relaxed. Flow is maintained by removing friction, not adding effort.</p>
      </div>
    </>
  );
}

function FrequencyPage() {
  return (
    <>
      <Header tag="Mind + Body · Frequency Science · The Sage Production System" title="Frequency × Key × Entrainment" sub="How sound frequency interfaces with the human nervous system — and how to embed this science into music production." />
      <h2 className="scroll-h3">Chapter 1 — Brainwave States</h2>
      <div className="scroll-table-wrap"><table className="scroll-table"><thead><tr><th>Brainwave</th><th>Hz</th><th>State</th><th>Musical Parallel</th></tr></thead><tbody>
        <tr><td>Delta</td><td>0.5–4</td><td>Deep sleep, healing</td><td>Below audible — felt as deep rumble</td></tr>
        <tr><td>Theta</td><td>4–8</td><td>Deep meditation, REM</td><td>The state R&amp;B listeners enter during late-night sessions</td></tr>
        <tr><td>Alpha</td><td>8–13</td><td>Relaxed alertness</td><td>The &quot;driving with good music&quot; state</td></tr>
        <tr><td>Beta</td><td>13–30</td><td>Active thinking</td><td>Music pulls listeners OUT of this</td></tr>
        <tr><td>Gamma</td><td>30–100</td><td>Peak cognition, insight</td><td>40 Hz = low E1 on bass</td></tr>
      </tbody></table></div>
      <Callout type="note" icon="🎵"><strong>65–80 BPM is the sweet spot.</strong> That range puts the brain into Theta/Alpha — the state for deep emotional processing. That&apos;s when they save, playlist-add, and share.</Callout>
      <h2 className="scroll-h3">Chapter 3 — The Solfeggio Scale</h2>
      <div className="scroll-table-wrap"><table className="scroll-table"><thead><tr><th>Hz</th><th>Key</th><th>Effect</th></tr></thead><tbody>
        <tr><td>396</td><td><strong>G major/minor</strong></td><td>Liberating Guilt &amp; Fear — most emotionally felt key</td></tr>
        <tr><td>528</td><td><strong>C major</strong></td><td>&quot;The Love Frequency&quot; — DNA repair</td></tr>
        <tr><td>639</td><td><strong>Eb major</strong></td><td>Connecting — harmonizes interpersonal bonds</td></tr>
        <tr><td>741</td><td><strong>F# major</strong></td><td>Expression — clears throat, self-expression</td></tr>
      </tbody></table></div>
      <Callout type="important" icon="🔑"><strong>The Practical Rule:</strong> Never force a song into a key just for frequency. Write in whatever key feels right. Then layer the target frequency as a production element.</Callout>
    </>
  );
}

function WakingMindPage() {
  return (
    <>
      <Header tag="Mind + Body · Metacognition" title="The Waking Mind Protocol" sub="Metacognition is not &quot;thinking about thinking&quot; — it is the capacity that reaches into and rewires the operating system beneath conscious thought." />
      <h2 className="scroll-h3">The 3-System Model</h2>
      <div className="scroll-table-wrap"><table className="scroll-table"><thead><tr><th>System</th><th>Layer</th><th>What It Does</th></tr></thead><tbody>
        <tr><td>System 1</td><td>Automatic</td><td>Fast, unconscious, habitual. Low ceiling.</td></tr>
        <tr><td>System 2</td><td>Working Memory</td><td>Deliberate, effortful, fact-based.</td></tr>
        <tr><td>System 3</td><td>Metacognitive</td><td>Symbols referring to your OWN mental states. Can reach into and rewire S1 &amp; S2. <strong>No ceiling.</strong></td></tr>
      </tbody></table></div>
      <h2 className="scroll-h3">System 3 Activation Interrupts</h2>
      <div className="scroll-table-wrap"><table className="scroll-table"><thead><tr><th>Trigger</th><th>S3 Interrupt</th></tr></thead><tbody>
        <tr><td>Feeling scattered</td><td>&quot;What is my mind doing right now?&quot; — wait for the answer.</td></tr>
        <tr><td>Stuck in a session</td><td>Rate mental state 1–10. Rate again in 60 seconds.</td></tr>
        <tr><td>About to react</td><td>Name the emotion: &quot;I&apos;m in a threat state.&quot;</td></tr>
        <tr><td>Low energy spiral</td><td>Is this body signal (interoception) or thought loop?</td></tr>
        <tr><td>Distraction pull</td><td>&quot;What does my distraction tell me about what I&apos;m avoiding?&quot;</td></tr>
      </tbody></table></div>
      <Callout type="purple" icon="🧬"><strong>The Fractal Principle:</strong> The system works the same at every zoom level. Each session mirrors the sprint logic. Each sprint mirrors the full 90-day arc. Rigidity is pathological. The system breathes.</Callout>
    </>
  );
}

function MixingPage() {
  return (
    <>
      <Header tag="Studio · End-to-End Audio Production" title="Sovereign Mixing Codex" sub="The complete 9-stage protocol from textured sample production through final master." />
      <h2 className="scroll-h3">Phase 1 — Gain Staging &amp; Bus Architecture</h2>
      <div className="scroll-table-wrap"><table className="scroll-table"><thead><tr><th>Bus</th><th>Contains</th><th>Fader Start</th></tr></thead><tbody>
        <tr><td>DRUMS</td><td>Kick, snare, hats, percs, 808</td><td>-6dB</td></tr>
        <tr><td>BASS</td><td>Sub, bass synth, 808 bus</td><td>-8dB</td></tr>
        <tr><td>LEAD VOX</td><td>Main vocal, doubles</td><td>-6dB</td></tr>
        <tr><td>BG VOX</td><td>Harmonies, ad-libs</td><td>-10dB</td></tr>
        <tr><td>INSTRUMENTS</td><td>Keys, pads, guitars, samples</td><td>-8dB</td></tr>
        <tr><td>FX</td><td>Risers, transitions, textures</td><td>-12dB</td></tr>
      </tbody></table></div>
      <Callout type="important" icon="🎛️"><strong>Apollo Hardware Chain:</strong> TLM 103 → VT-737sp → CL 1B → C-Vox → Auto-Tune RT → Studer A800 → FL Studio master at -18dBFS headroom</Callout>
      <h2 className="scroll-h3">Phases 3–8 — The LUFS Ladder</h2>
      <div className="scroll-stack">
        <div className="scroll-stack-level"><div className="scroll-stack-title">Phase 3 · Compression Architecture</div><div className="scroll-stack-desc">CL 1B (vocal glue, 2:1), FG-116 (transient control, 4:1 fast), SSL G Bus (mix bus, 2:1 slow). <strong>3 compressors max per bus.</strong></div></div>
        <div className="scroll-stack-level"><div className="scroll-stack-title">Phase 4 · EQ Sculpting</div><div className="scroll-stack-desc">Subtractive first. High-pass everything except kick/808 at 80Hz. Cut before you boost. 2–5kHz presence shelf on lead vocal.</div></div>
        <div className="scroll-stack-level"><div className="scroll-stack-title">Phase 5 · Saturation (3 Stages Max)</div><div className="scroll-stack-desc">Stage 1: Apollo Studer A800. Stage 2: Lead bus tape emulation. Stage 3: SSL Inflator. <strong>Never more than 3 saturation stages.</strong></div></div>
        <div className="scroll-stack-level"><div className="scroll-stack-title">Phase 6 · Spatial Design</div><div className="scroll-stack-desc">Keep lead vocal CENTER and DRY — width around it, not on it.</div></div>
        <div className="scroll-stack-level"><div className="scroll-stack-title">Phase 7 · Automation</div><div className="scroll-stack-desc">Volume rides on lead vocal phrase by phrase. The mix should breathe.</div></div>
        <div className="scroll-stack-level sc-highlight"><div className="scroll-stack-title">Phase 8 · Master Chain &amp; Export</div><div className="scroll-stack-desc">SSL G Bus → Ozone 12 → G-Clip → True Peak Limiter (-0.3dB). Final target: -7 LUFS. Export: 24-bit / 44.1kHz. <strong>Cyanite verification before upload.</strong></div></div>
      </div>
      <h2 className="scroll-h3">Cyanite Verification Targets</h2>
      <div className="scroll-table-wrap"><table className="scroll-table"><thead><tr><th>Parameter</th><th>Target</th><th>Why</th></tr></thead><tbody>
        <tr><td>Sexy</td><td>{">"}0.76</td><td>The past.El sonic pocket. Non-negotiable.</td></tr>
        <tr><td>Chill</td><td>{">"}0.56</td><td>Late-night, intimate, cocktail-hour energy.</td></tr>
        <tr><td>Happy</td><td>{">"}0.49</td><td>Warmth without sadness.</td></tr>
        <tr><td>Danceability</td><td>High</td><td>Groove that moves the body.</td></tr>
        <tr><td>Energy</td><td>Low</td><td>The contradiction that makes the sound distinctive.</td></tr>
      </tbody></table></div>
    </>
  );
}

function VocalPage() {
  return (
    <>
      <Header tag="Studio · Vocal Somatic Diagnostic" title="S-Rank Vocal Codex" sub="The Pre-Flight Somatic Matrix, warmup sequences, recording protocols, and cool-down routines." />
      <h2 className="scroll-h3">Pre-Flight Somatic Matrix (Full)</h2>
      <div className="scroll-card scroll-card-left"><div className="scroll-card-title" style={{marginBottom:8}}>The 6-Point Checklist</div>
        <ol style={{paddingLeft:20}}>
          <li className="scroll-p"><strong>Breath:</strong> 5 deep breaths. Stomach full. Hold 4 counts. Release slow.</li>
          <li className="scroll-p"><strong>Posture:</strong> Spine tall. Shoulders back. Chin level.</li>
          <li className="scroll-p"><strong>Jaw Release:</strong> Massage the masseter. Open and close slowly.</li>
          <li className="scroll-p"><strong>Throat Softness:</strong> Hum. Feel vibration in chest and sinuses.</li>
          <li className="scroll-p"><strong>Hydration Check:</strong> 8 oz water. Wait 2 minutes.</li>
          <li className="scroll-p"><strong>Sobriety Acknowledgment:</strong> State sobriety day out loud.</li>
        </ol>
        <p className="scroll-p"><strong>Total time: 5–7 minutes.</strong> Non-negotiable before every vocal take.</p>
      </div>
      <h2 className="scroll-h3">Session Rules</h2>
      <div className="scroll-table-wrap"><table className="scroll-table"><thead><tr><th>Rule</th><th>Protocol</th></tr></thead><tbody>
        <tr><td>Max session length</td><td>3 hours. After that, vocal fatigue degrades quality.</td></tr>
        <tr><td>Break frequency</td><td>15-min break every 45 min. Hydrate. Walk. Don&apos;t scroll.</td></tr>
        <tr><td>Comp strategy</td><td>3–5 takes per section. Best take = &quot;A&quot;. Comping = Frankensteining A-takes.</td></tr>
        <tr><td>Cool-down</td><td>Practice 06 (lip trills, humming, hydration). Non-negotiable.</td></tr>
      </tbody></table></div>
      <Callout type="important" icon="🎤"><strong>&quot;You can&apos;t edit emotion.&quot;</strong> If the take has the story, take it even if pitch isn&apos;t perfect. Over-tuning strips the natural inflections that make a vocal human.</Callout>
      <h2 className="scroll-h3">Vocal Stack Build Order</h2>
      <div className="scroll-card scroll-card-left sc-green"><div className="scroll-card-head"><div className="scroll-card-title">Vocal Stack Build Order</div><span className="stp-badge badge-green">Reference</span></div>
        <ol style={{paddingLeft:20}}>
          <li className="scroll-p"><strong>Lead comp</strong> — select best takes across multiple runs</li>
          <li className="scroll-p"><strong>Timing alignment</strong> (Melodyne) — tighten, don&apos;t grid-lock</li>
          <li className="scroll-p"><strong>Light tuning</strong> — preserve natural bends</li>
          <li className="scroll-p"><strong>Unison doubles</strong> — add width and thickness</li>
          <li className="scroll-p"><strong>Lyrical harmonies</strong> — follow melody, support emotion</li>
          <li className="scroll-p"><strong>Textural pad harmonies</strong> (oohs, mm&apos;s) — create space</li>
          <li className="scroll-p"><strong>Ad libs</strong> — spontaneous moments</li>
          <li className="scroll-p"><strong>Creative chops / throws / ear candy</strong></li>
        </ol>
      </div>
    </>
  );
}

function SpotifyAdsPage() {
  return (
    <>
      <Header tag="Business · Sage-Level Paid Growth Playbook" title="Spotify Ads Mastery" sub="Comprehensive ad strategy verified against live adsmanager.spotify.com interface. Real CPMs, real targeting fields, real scripts." />
      <Callout type="important" icon="✓"><strong>Verified against live Ethan Payton LLC Spotify Ads Manager account · March 31, 2026.</strong></Callout>
      <h2 className="scroll-h3">Part 1 — Auction vs. Reserved</h2>
      <div className="scroll-grid-2">
        <div className="scroll-grid-card" style={{border:"2px solid #3ecf71"}}><div className="scroll-gc-title" style={{color:"#3ecf71"}}>✓ AUCTION — Use This</div><div className="scroll-gc-desc"><strong>~$18/day minimum · Dynamic CPM</strong><br/>Audio CPM: $8.43–$9.38. Display CPM: $4.35–$4.88. Budget is flexible — pause, adjust, reallocate anytime.</div></div>
        <div className="scroll-grid-card"><div className="scroll-gc-title" style={{color:"rgba(255,255,255,0.3)"}}>RESERVED — Come Back at $5K+</div><div className="scroll-gc-desc"><strong>$5,000 lifetime minimum.</strong> Not the right tool for stream growth at any budget level.</div></div>
      </div>
      <h2 className="scroll-h3">Part 3 — Unlocking &quot;Streams&quot; Delivery Goal</h2>
      <Callout type="warning" icon="⚠️"><strong>Clicks ≠ Streams.</strong> Streams optimization finds people who listen 30+ sec → the full engagement signal the algorithm needs. <strong>Streams is ALWAYS superior.</strong></Callout>
      <Step num={1} title='Find "Your content on Spotify"' desc="In Ad Set setup, click Music." />
      <Step num={2} title='Search "Ethan Payton"' desc="Select your artist profile. This declares you own the content." />
      <Step num={3} title='Select "Streams" delivery goal' desc="Switches the algorithm to optimize for listening behavior." />
      <Step num={4} title="Set Bid at $9.50 (midpoint)" desc="Your account range: $8.27–$9.92. Lower after 48 hrs if spend moves too fast." />
      <h2 className="scroll-h3">Part 4 — Targeting (Field-by-Field)</h2>
      <div className="scroll-table-wrap"><table className="scroll-table"><thead><tr><th>Field</th><th>Setting</th><th>Why</th></tr></thead><tbody>
        <tr><td>Country</td><td><strong>United States</strong></td><td>Entire data set is US-based.</td></tr>
        <tr><td>City Targeting</td><td><strong>Denver, Minneapolis, Dallas</strong></td><td>Tier 1 organic markets.</td></tr>
        <tr><td>Age</td><td><strong>18–34</strong></td><td>Primary streaming demo.</td></tr>
        <tr><td>Fan Bases</td><td><strong>6LACK, Bryson Tiller, PND, Daniel Caesar, Smino</strong></td><td>Core Drive S-tier matches.</td></tr>
      </tbody></table></div>
      <h2 className="scroll-h3">Part 7 — KPIs After Launch</h2>
      <div className="scroll-metrics-grid">
        <div className="scroll-metric-card"><span className="scroll-metric-val">&lt;$0.30</span><div className="scroll-metric-lbl">Cost Per Stream</div></div>
        <div className="scroll-metric-card"><span className="scroll-metric-val">15%+</span><div className="scroll-metric-lbl">Stream Rate</div></div>
        <div className="scroll-metric-card"><span className="scroll-metric-val">20%+</span><div className="scroll-metric-lbl">Save Rate During Campaign</div></div>
        <div className="scroll-metric-card"><span className="scroll-metric-val">3–5×</span><div className="scroll-metric-lbl">Frequency / Person / Week</div></div>
        <div className="scroll-metric-card"><span className="scroll-metric-val">$8–10</span><div className="scroll-metric-lbl">Actual CPM</div></div>
        <div className="scroll-metric-card"><span className="scroll-metric-val">+20%</span><div className="scroll-metric-lbl">MAL Delta (7-day)</div></div>
      </div>
    </>
  );
}

// ═══════════════════════════════════════════════════════════════
// SLUG → CONTENT MAP
// ═══════════════════════════════════════════════════════════════

const CONTENT_MAP: Record<string, () => ReactNode> = {
  "90-day-roadmap": RoadmapPage,
  "wartime-rhythm": WartimePage,
  "the-protocol": ProtocolPage,
  "sovereignty-stack": SovereigntyStackPage,
  "body-codex": BodyCodexPage,
  "rank-scroll": RankScrollPage,
  "mudra-system": MudraPage,
  "frequency-key": FrequencyPage,
  "waking-mind": WakingMindPage,
  "mixing-codex": MixingPage,
  "vocal-codex": VocalPage,
  "spotify-ads": SpotifyAdsPage,
};

export function getDoctrineContent(slug: string): ReactNode | null {
  const Component = CONTENT_MAP[slug];
  if (!Component) return null;
  return <Component />;
}
