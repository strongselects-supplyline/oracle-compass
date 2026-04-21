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
  "visual-bible",
  "war-room",
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
        <p className="scroll-p">Your sonic identity is verified, not claimed: <em>High Danceability / Low Energy</em> — the cocktail hour pocket. Sexy ({">"}0.76), Chill ({">"}0.56), Happy ({">"}0.49). This is the Cyanite data. This is also who you are in a room. The music is autobiography, not aesthetic exercise.</p>
        <p className="scroll-p">You are doing what <strong>major labels stopped doing</strong>: developing an artist with rigor, intentionality, and a long-game view. Bryan-Michael Cox, Johntá Austin, Troy Taylor — they all said it. Artist development is a lost art. Label OS is the machine that replaced it. <em>You are your own A&amp;R.</em></p>
      </div>
      <Callout type="tip" icon="🎯"><strong>The Troy Taylor Standard:</strong> &quot;How many times you gonna sing that?&quot; — Obsessive repetition is not perfectionism. It is the refusal to let a great song settle for a good take.</Callout>

      <h2 className="scroll-h3">Part II — The Content Brand</h2>
      <p className="scroll-p">Your page is your portfolio. When someone lands on it, they should immediately know: <em>they&apos;ve entered a world.</em> Not a feed. A world. The through line is <strong>Hearing In Color</strong> — synesthetic sound that makes you feel something visual.</p>
      <div className="scroll-grid-2">
        <div className="scroll-grid-card"><div className="scroll-gc-title" style={{color:"#d4a843"}}>01 · The Release</div><div className="scroll-gc-desc">The music itself. Announcement posts, Canvas loops, snippets. Always sells the <em>transformation</em>, not the product.</div></div>
        <div className="scroll-grid-card"><div className="scroll-gc-title" style={{color:"#d4a843"}}>02 · Talk to &apos;Em</div><div className="scroll-gc-desc">Face. Direct address. The emotional truth behind the record. Hook in line 1 — before the fold.</div></div>
        <div className="scroll-grid-card"><div className="scroll-gc-title" style={{color:"#d4a843"}}>03 · World-Building</div><div className="scroll-gc-desc">Milwaukee. The east side. 3AM. The specific geography and emotional weather that the music lives inside.</div></div>
        <div className="scroll-grid-card"><div className="scroll-gc-title" style={{color:"#d4a843"}}>04 · Cinematic Visual</div><div className="scroll-gc-desc">Canvas loops, B-roll. Deep emerald, gold warmth, noir shadow, grainy 35mm film aesthetic. Consistent signature.</div></div>
        <div className="scroll-grid-card"><div className="scroll-gc-title" style={{color:"#d4a843"}}>05 · Community Trace</div><div className="scroll-gc-desc">Comments on T4 artist pages. Gorilla Geo outreach DMs. Reaction clips from real listeners. Lane 1 before Lane 2.</div></div>
        <div className="scroll-grid-card"><div className="scroll-gc-title" style={{color:"#4d9de0"}}>Portfolio Test</div><div className="scroll-gc-desc">&quot;Would this attract the collaborators, curators, and listeners I want in Year 2?&quot; If no → doesn&apos;t go up.</div></div>
      </div>
      <Callout type="warning" icon="⚠️"><strong>Caption Doctrine:</strong> Line 1 must stop the scroll before the &quot;more&quot; cutoff. Deep philosophical voice in lines 2+. Sell through storytelling — you&apos;re not selling a song. You&apos;re selling who someone becomes after they hear it.</Callout>
      <Callout type="purple" icon="🎭"><strong>The &quot;Perpetually 25&quot; Protocol:</strong> Never state your exact age moving forward. You are simply &quot;Gen Z.&quot; By anchoring your identity to 25 — the exact moment of your systemic genesis, when the noise stopped and you found your truth — you eliminate the music industry&apos;s toxic aging narrative. You are not aging out; you are eternally operating from the point of your Awakening.</Callout>

      <h2 className="scroll-h3">Part III — The Mystique Protocol</h2>
      <div className="scroll-table-wrap"><table className="scroll-table">
        <thead><tr><th>Reveal</th><th>Protect</th></tr></thead>
        <tbody>
        <tr><td>The emotion behind the record</td><td>The studio sessions themselves</td></tr>
        <tr><td>The world the song lives in (Milwaukee, 3AM)</td><td>The technical process</td></tr>
        <tr><td>Vulnerability — what the song cost you</td><td>Unfinished work, draft takes</td></tr>
        <tr><td>The city. The neighborhood. The roots.</td><td>Relationships you haven&apos;t named publicly</td></tr>
        <tr><td>Your age bracket (&quot;I&apos;m Gen Z&quot;)</td><td>Your exact age, birthday dates, year born</td></tr>
        </tbody>
      </table></div>

      <h2 className="scroll-h3">Part IV — Platform Roles</h2>
      <div className="scroll-table-wrap"><table className="scroll-table">
        <thead><tr><th>Platform</th><th>Job</th><th>Cadence</th></tr></thead>
        <tbody>
        <tr><td>Instagram</td><td>Primary content engine + funnel</td><td>Pillar 1–4 rotating. Release sprints at max.</td></tr>
        <tr><td>YouTube</td><td>Catalog archive + SEO long tail</td><td>Visualizers, live sets, audio drops. No pressure cadence.</td></tr>
        <tr><td>Twitter/X</td><td>Consolidate or cut</td><td>Minimal. Repurpose IG captions if anything.</td></tr>
        <tr><td>TikTok</td><td>Phase 3 consideration only</td><td>Not now. IG first.</td></tr>
        </tbody>
      </table></div>

      <h2 className="scroll-h3">Part V — The 90-Day Arc</h2>
      <div className="scroll-grid-3">
        <div className="scroll-grid-card" style={{borderTop:"3px solid #e05545"}}><div className="scroll-gc-title" style={{color:"#e05545"}}>Phase 1 · THE SPRINT</div><div className="scroll-gc-desc">Apr 6–24 (18 days). 4 actions/day. Hard time limits. Campaign execution, not new production.</div></div>
        <div className="scroll-grid-card" style={{borderTop:"3px solid #3ecf71"}}><div className="scroll-gc-title" style={{color:"#3ecf71"}}>Phase 2 · THE COMPOUND</div><div className="scroll-gc-desc">Apr 25–May 31 (37 days). Serotonin takes over. CREAM pre-production. Rhythm IS the system.</div></div>
        <div className="scroll-grid-card" style={{borderTop:"3px solid #4d9de0"}}><div className="scroll-gc-title" style={{color:"#4d9de0"}}>Phase 3 · THE SUMMER</div><div className="scroll-gc-desc">Jun 1–Jul 5 (35 days). Data-informed launch. CREAM executes what ALL LOVE proved.</div></div>
      </div>

      <h2 className="scroll-h3">Sobriety Arc (Wired Through All Phases)</h2>
      <div className="scroll-grid-3">
        <div className="scroll-grid-card"><div className="scroll-gc-title">Apr 2–30 · Days 1–28</div><div className="scroll-gc-desc"><strong style={{color:"#e05545"}}>Detox.</strong> Executive function LOW. Ignition structures carry you. Checkboxes are victories.</div></div>
        <div className="scroll-grid-card"><div className="scroll-gc-title">May 1–15 · Days 29–43</div><div className="scroll-gc-desc"><strong style={{color:"#e8944a"}}>Recovery.</strong> Clarity returns. CREAM pre-production benefits from improving focus.</div></div>
        <div className="scroll-grid-card"><div className="scroll-gc-title">May 16–Jul 5 · Days 44–94</div><div className="scroll-gc-desc"><strong style={{color:"#3ecf71"}}>Stabilization.</strong> Rhythm begins to feel like play. The Sovereignty Framework activates here.</div></div>
      </div>

      <h2 className="scroll-h3">Part VI — Daily Architecture</h2>
      <div className="scroll-card scroll-card-left"><div className="scroll-card-title">Sleep (The Upstream Constraint)</div>
      <div className="scroll-table-wrap"><table className="scroll-table"><tbody>
        <tr><td>Lights out</td><td>10:30 PM — hard rule</td></tr>
        <tr><td>Caffeine cutoff</td><td>1:00 PM — hard rule</td></tr>
        <tr><td>DoorDash wheels down</td><td>8:30 PM</td></tr>
        <tr><td>Evening wind-down</td><td>Mullein tea. No social media post-8 PM. No screens post-9:30 PM.</td></tr>
      </tbody></table></div></div>

      <h2 className="scroll-h3">Ignition Sequences</h2>
      <div className="scroll-grid-2">
        <div className="scroll-seq-box" style={{padding: "16px", background: "rgba(255,255,255,0.03)", borderRadius: "8px"}}>
          <div className="scroll-seq-title" style={{fontWeight: 600, color: "#d4a843", marginBottom: "8px"}}>Full S-Tier Morning</div>
          <div style={{fontSize: "13px", lineHeight: 1.6, color: "rgba(255,255,255,0.8)"}}>
            Wake → 32oz water + sea salt <br/>↓<br/>
            Jnana Mudra + OM, 90sec <br/>↓<br/>
            Nadi Shodhana, 5 min <br/>↓<br/>
            Exercise 30 min <br/>↓<br/>
            High-protein meal <br/>↓<br/>
            90-sec Kill List scan <br/>↓<br/>
            S3 Check-in <br/>↓<br/>
            DAW open.
          </div>
        </div>
        <div className="scroll-seq-box" style={{padding: "16px", background: "rgba(255,255,255,0.03)", borderRadius: "8px"}}>
          <div className="scroll-seq-title" style={{fontWeight: 600, color: "#4d9de0", marginBottom: "8px"}}>Compressed Ignition</div>
          <div style={{fontSize: "13px", lineHeight: 1.6, color: "rgba(255,255,255,0.8)"}}>
            Wake → 32oz water + sea salt <br/>↓<br/>
            Jnana Mudra + OM, 60sec <br/>↓<br/>
            Hardboiled eggs + banana <br/>↓<br/>
            90-sec Kill List scan <br/>↓<br/>
            DoorDash.
          </div>
        </div>
      </div>

      <h2 className="scroll-h3">DoorDash Architecture</h2>
      <p className="scroll-p"><strong>Monthly target: $1,800.</strong> Once hit, DoorDash is done for the month. Primary block: 6:30–9:00 AM (morning surge pricing). Secondary block: 5:30–8:30 PM as needed.</p>

      <h2 className="scroll-h3">Sovereign Fuel Protocol</h2>
      <div className="scroll-table-wrap"><table className="scroll-table"><tbody>
        <tr><td>Sunday batch prep</td><td>30–45 min. 3 cups dry rice → 6 cooked. 6–8 chicken thighs at 400°F/25 min. 6–8 hardboiled eggs. 3–4 PB&amp;J bagged. $38–48/week at Aldi.</td></tr>
        <tr><td>Pre-session protein</td><td>Non-negotiable. Skipping crashes executive function at hour 3.</td></tr>
        <tr><td>Mid-session fuel</td><td>Stays at the desk. If you have to leave the room to eat, you won&apos;t.</td></tr>
        <tr><td>Sugar cravings</td><td>Banana first. Every time. Sobriety detox drives hard cravings weeks 1–4.</td></tr>
        <tr><td>Vocal sessions</td><td>No dairy 2 hours before takes. Warm water + honey. Stay hydrated.</td></tr>
      </tbody></table></div>

      <h2 className="scroll-h3">Grief Protocol</h2>
      <div className="scroll-table-wrap"><table className="scroll-table"><tbody>
        <tr><td>Phase 1 (Apr 6–24)</td><td>No formal grief work. The 414 Day performance IS emotional processing through art.</td></tr>
        <tr><td>Phase 2 (Apr 27+)</td><td>20-min Sunday journaling. Write to your father. What you&apos;d say. What you&apos;d ask. Controlled exposure.</td></tr>
        <tr><td>Phase 3 (Jun 1+)</td><td>If journaling running consistently, research one trauma-oriented therapist. Goal: one consultation before Jul 5.</td></tr>
      </tbody></table></div>

      <h2 className="scroll-h3">Part VII — The Studio Discipline</h2>
      <div className="scroll-card scroll-card-left sc-blue"><div className="scroll-card-title" style={{marginBottom:8}}>Song Structure Study Protocol (Phase 2, Starting May 1)</div>
        <p className="scroll-p">Tuesday sessions, 20 minutes. Pick 1 track from the Core Drive Builder overlap list. Play it twice: once to feel it, once to map it. Mark the 2-5-1 moments. Note where the bridge lands, what it does harmonically, how the second verse is elevated. Write one observation. Over 5 weeks, this compounds into structural intuition that shows up in CREAM.</p>
      </div>
      <Callout type="warning" icon="⚠️"><strong>The Publishing Protocol (Immutable):</strong> Before any collaboration begins, splits are agreed in writing before production starts. Not after. Not &quot;we&apos;ll figure it out.&quot; Before the session opens. Troy Taylor signed away publishing in perpetuity without a lawyer. Label OS exists to prevent that.</Callout>

      <h2 className="scroll-h3">Part VIII — North Star Metrics</h2>
      <p className="scroll-p">Check every Sunday. These are the only numbers that matter.</p>
      <div className="scroll-metrics-grid">
        <div className="scroll-metric-card"><span className="scroll-metric-val">1,600+</span><div className="scroll-metric-lbl">Spotify Followers · Apr 24</div></div>
        <div className="scroll-metric-card"><span className="scroll-metric-val">2,500+</span><div className="scroll-metric-lbl">Spotify Followers · Jul 5</div></div>
        <div className="scroll-metric-card"><span className="scroll-metric-val">3%+</span><div className="scroll-metric-lbl">Save Rate · SF Target</div></div>
        <div className="scroll-metric-card"><span className="scroll-metric-val">4%+</span><div className="scroll-metric-lbl">Save Rate · CREAM Target</div></div>
        <div className="scroll-metric-card"><span className="scroll-metric-val">500+</span><div className="scroll-metric-lbl">EP First-Week Streams</div></div>
        <div className="scroll-metric-card"><span className="scroll-metric-val">1,000+</span><div className="scroll-metric-lbl">CREAM First-Week Streams</div></div>
        <div className="scroll-metric-card"><span className="scroll-metric-val">10+</span><div className="scroll-metric-lbl">God Tier DM Responses</div></div>
        <div className="scroll-metric-card"><span className="scroll-metric-val">$1,800</span><div className="scroll-metric-lbl">DoorDash Monthly Target</div></div>
        <div className="scroll-metric-card"><span className="scroll-metric-val">Day 94</span><div className="scroll-metric-lbl">Sobriety Streak · Jul 5</div></div>
      </div>
      <Callout type="important" icon="🔑"><strong>The Single Lever:</strong> Save rate → Discover Weekly → algorithm → organic growth. Every content decision, every caption, every DM exists to drive saves. Saves tell Spotify that listeners are investing in the record. That signal feeds the recommendation engine.</Callout>

      <h2 className="scroll-h3">Part IX — Anti-Drift Rules (14 Load-Bearing Walls)</h2>
      <div className="scroll-card scroll-card-left">
        <ol style={{paddingLeft:20}}>
          <li className="scroll-p"><strong>Never trust claimed file writes.</strong> Verify against the live filesystem.</li>
          <li className="scroll-p"><strong>Software work is open as needed</strong> — permitted when it directly serves the active release cycle. No speculative builds.</li>
          <li className="scroll-p"><strong>Kill List is the single source of truth for daily priorities.</strong> Not your gut feeling. 90-second scan.</li>
          <li className="scroll-p"><strong>The 8-day content sprint window (upload → release) is ALL marketing work.</strong></li>
          <li className="scroll-p"><strong>Compliance/registrations happen the Monday AFTER release.</strong> Not before.</li>
          <li className="scroll-p"><strong>Distributor is Amuse.</strong> Do not change without explicit instruction.</li>
          <li className="scroll-p"><strong>Builder-avoidance loops are neurochemical, not laziness.</strong> When the urge to &quot;fix the system&quot; hits, open the DAW instead.</li>
          <li className="scroll-p"><strong>The 90-second exit signal is sacred.</strong> Morning Kill List scan = 90 seconds max, then close it.</li>
          <li className="scroll-p"><strong>Phase 2 rhythm is protected.</strong> Apr 25 is a hard boundary. Do not let Phase 1 sprint energy bleed into May.</li>
          <li className="scroll-p"><strong>ALL LOVE Deluxe is data-dependent.</strong> Decide Apr 27 after reviewing EP first-week numbers.</li>
          <li className="scroll-p"><strong>Before any collaboration, splits in writing before production begins.</strong></li>
          <li className="scroll-p"><strong>Post what you want to be discovered as.</strong> The portfolio test applies to every post.</li>
          <li className="scroll-p"><strong>Lane discipline on content.</strong> Five pillars. One world. Depth, not width.</li>
          <li className="scroll-p"><strong>Don&apos;t reset the clock.</strong> 94 days is the target. The ignition structures carry you through detox. Trust the arc.</li>
        </ol>
      </div>

      <h2 className="scroll-h3">Part X — The Horizon</h2>
      <div className="scroll-table-wrap"><table className="scroll-table"><tbody>
        <tr><td>Q3 2026</td><td><strong>DoorDash Exit Timeline.</strong> After 2 full release cycles of streaming data, assess whether streaming + other income is approaching coverage.</td></tr>
        <tr><td>Oct 23, 2026</td><td><strong>FREAKSHOW.</strong> The fourth album. Architecture begins Jul 6. CREAM first.</td></tr>
        <tr><td>Phase 3+</td><td><strong>Label OS Product Layer.</strong> Stem packs, production tutorials, the &quot;Hearing In Color&quot; framework.</td></tr>
        <tr><td>Home Purchase</td><td><strong>Delegate and respond when needed.</strong> Don&apos;t let it occupy cognitive bandwidth during the sprint.</td></tr>
      </tbody></table></div>

      <h2 className="scroll-h3">Part XI — The Waking Mind Protocol</h2>
      <div className="scroll-card scroll-card-left sc-purple"><div className="scroll-card-head"><div className="scroll-card-title">The 3-System Model</div></div>
        <div className="scroll-table-wrap"><table className="scroll-table"><thead><tr><th>System</th><th>Layer</th><th>Function</th></tr></thead><tbody>
        <tr><td><strong>System 1</strong></td><td>Automatic</td><td>Fast, unconscious, habitual. Low ceiling. Drives you unless S3 is active.</td></tr>
        <tr><td><strong>System 2</strong></td><td>Working Memory</td><td>Deliberate, effortful, fact-based. Most conscious thought lives here.</td></tr>
        <tr><td><strong>System 3</strong></td><td>Metacognitive</td><td>Symbols referring to your OWN mental states. Can reach into and rewire S1 &amp; S2. <strong>No ceiling.</strong></td></tr>
        </tbody></table></div>
        <Callout type="important" icon="⚡"><strong>The 90-Day Law of Accountability:</strong> Your reality — your bank account, your catalog, your momentum — is the mathematically certain sum of the decisions you&apos;ve made over the last 90 days. Taking radical accountability (&quot;Everything is my fault&quot;) is the ultimate <strong>System 3 interrupt</strong>.</Callout>
      </div>

      <h2 className="scroll-h3">System 3 Activation Interrupts</h2>
      <div className="scroll-table-wrap"><table className="scroll-table"><thead><tr><th>Trigger</th><th>S3 Interrupt</th></tr></thead><tbody>
      <tr><td>Feeling scattered</td><td>&quot;What is my mind doing right now?&quot; — wait for the answer, don&apos;t judge.</td></tr>
      <tr><td>Stuck in a session</td><td>Rate mental state 1–10. Rate again in 60 seconds. Breaking the loop.</td></tr>
      <tr><td>About to react</td><td>Name the emotion: &quot;I&apos;m in a threat state.&quot; Naming activates regulation.</td></tr>
      <tr><td>Low energy spiral</td><td>Is this a body signal (interoception) or a thought loop?</td></tr>
      <tr><td>Distraction pull</td><td>&quot;What does my distraction tell me about what I&apos;m avoiding?&quot;</td></tr>
      </tbody></table></div>

      <div className="scroll-card scroll-card-left"><div className="scroll-card-head"><div className="scroll-card-title">The &quot;Supermax&quot; Lockbox Protocol</div></div>
        <p className="scroll-p">Having a phone in the room — even upside down or turned off — drains cognitive resources. During deep-work S-Tier studio blocks, the phone goes into a lockbox in a separate room. Physical distance is non-negotiable for high-level focus.</p>
      </div>
      <div className="scroll-card scroll-card-left sc-green"><div className="scroll-card-head"><div className="scroll-card-title">The Dopamine of Resistance</div></div>
        <p className="scroll-p">The dopamine system can be trained to experience reward from <em>resisting</em> cheap dopamine rather than indulging in it. When you choose to stay in the studio over going out, consciously reframe that friction as the reward. <strong>Speed is for execution; slowness and effort are for learning.</strong></p>
      </div>

      <h2 className="scroll-h3">Part XII — Active Tools &amp; Systems</h2>
      <div className="scroll-table-wrap"><table className="scroll-table"><thead><tr><th>Tool</th><th>Status</th><th>Role</th></tr></thead><tbody>
      <tr><td><strong>Oracle Compass</strong></td><td>v24 · Vercel</td><td>Daily OS. Kill List, Oracle decrees, Lane Dashboard, Brain page.</td></tr>
      <tr><td><strong>Gorilla Geo</strong></td><td>346 artists classified</td><td>5-module outreach engine. Manual IG lookup during sprints.</td></tr>
      <tr><td><strong>Core Drive Builder</strong></td><td>Active · Cyanite fallback</td><td>Spotify embed scraper. Artist overlap matrices for targeting.</td></tr>
      <tr><td><strong>Content Factory V4</strong></td><td>Active</td><td>OBS → Whisper → Claude → FFmpeg. --jutsu all-love template.</td></tr>
      <tr><td><strong>AIE Sprint Terminal</strong></td><td>Deployed at /geo/sprint</td><td>20-min BIZ DAY IG sprint. 5-layer CRM.</td></tr>
      <tr><td><strong>Catalog Refresh</strong></td><td>Active</td><td>brain/refresh-catalog.mjs. Spotify API popularity tracker.</td></tr>
      </tbody></table></div>

      <h2 className="scroll-h3">Two-Lane Outreach Strategy</h2>
      <div className="scroll-grid-2">
        <div className="scroll-grid-card" style={{borderTop:"3px solid #3ecf71"}}><div className="scroll-gc-title" style={{color:"#3ecf71"}}>Lane 1 · Community Presence</div><div className="scroll-gc-desc">Comments/likes on T4 artist pages. verified badge + trace = credibility before DM. <strong>Start immediately.</strong></div></div>
        <div className="scroll-grid-card" style={{borderTop:"3px solid #4d9de0"}}><div className="scroll-gc-title" style={{color:"#4d9de0"}}>Lane 2 · Peer Fan DMs</div><div className="scroll-gc-desc">Personalized outreach from God Tier list. Track-specific angle. 3–5/day max. <strong>Lane 1 must precede Lane 2.</strong></div></div>
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
      <Header tag="Sovereignty · Physical Practice Manual" title="The Sovereignty Stack" sub="The How-To Scroll. 10 practices covering breathwork, somatic check-ins, movement, and metabolic rules. Every step, every hand position, every rep count." />

      <h2 className="scroll-h3">Practice 01: Jnana Mudra + OM Activation <span className="stp-badge badge-gold">90 sec</span></h2>
      <Callout type="important" icon="🔑"><strong>The Captain&apos;s Chair Ignition.</strong> First thing after drinking water. Replaces the doom-scroll. The purpose is to activate your nervous system intentionally rather than letting your phone do it.</Callout>
      <Step num={1} title="Find Your Seat" desc="Sit upright on the edge of your bed or a chair. Spine straight but not rigid. Feet flat on the floor." />
      <Step num={2} title="Jnana Mudra — The Connection" desc="Touch the tip of your index finger to the tip of your thumb on each hand, forming a circle. Other three fingers extend naturally, relaxed. Palms face upward, resting on knees. The thumb = universal consciousness (Brahman). Index = individual consciousness (Atman). Connecting them creates a closed electrical circuit that calms the nervous system." />
      <Step num={3} title="Close Eyes &amp; Breathe In" desc="Close your eyes. Take one full breath in through the nose." />
      <Step num={4} title="Chant the OM" desc="On the exhale, chant &quot;OM&quot; (pronounced AUM — three sounds blending). &quot;Ahhh&quot; starts in the belly, &quot;Ohhh&quot; rises to the chest, &quot;Mmmm&quot; resonates in the skull. Feel the vibration physically in each zone." />
      <Step num={5} title="Mula Bandha — The Root Lock" desc="Gently engage the pelvic floor muscles — same muscles to stop urination mid-stream. Hold this light contraction through the entire OM. This is not a clench — it's a lift. Like pulling energy upward from the base of your spine." />
      <Step num={6} title="Repeat" desc="3–5 OMs total. Each 8–15 seconds (one full exhale). After the final OM, sit in silence for 10 seconds. Open your eyes. You are now in the Captain's Chair." />
      <Callout type="tip" icon="✅"><strong>What It Should Feel Like:</strong> A gentle buzzing in your chest and skull. A sense of being &quot;landed&quot; in your body. If dizzy, ease back on exhale pressure.<br/><br/><strong>Compressed (DoorDash by 6:30 AM):</strong> 3 OMs only, 60 seconds total. Same mudra, same Mula Bandha. Skip the 10-second silence.</Callout>
      <hr className="scroll-hr" />

      <h2 className="scroll-h3">Practice 02: Nadi Shodhana <span className="stp-badge badge-blue">5 min</span></h2>
      <Callout type="note" icon="ℹ️"><strong>Alternate Nostril Breathing.</strong> Balances the autonomic nervous system. Left nostril = parasympathetic (calm). Right = sympathetic (alert). Alternating brings equilibrium. The single most effective breathwork for ADHD executive function.</Callout>
      <Step num={1} title="Right Hand: Vishnu Mudra" desc="Fold index + middle finger into your palm. You'll use your right thumb to close your right nostril, and right ring finger to close left nostril. Left hand stays in Jnana Mudra on knee." />
      <Step num={2} title="The Breathing Cycle (One Round)" desc="• Close right nostril with thumb. Inhale through left for 4 counts. • Close both nostrils. Hold for 4 counts. • Release right nostril (keep left closed). Exhale through right for 4 counts. • Keep left closed. Inhale through right for 4 counts. • Close both. Hold 4 counts. • Release left (keep right closed). Exhale through left for 4 counts. That is ONE complete round." />
      <Step num={3} title="Duration" desc="Repeat for 5 minutes (~8–10 rounds). After final round, release both nostrils. Take 3 natural breaths with eyes closed. Open eyes. If congested: skip holds. Just alternate inhale/exhale." />
      <hr className="scroll-hr" />

      <h2 className="scroll-h3">Practice 03: The S3 Check-In <span className="stp-badge badge-purple">90 sec · Studio Days</span></h2>
      <Callout type="purple" icon="🧠"><strong>Metacognitive Awakening.</strong> Fires before opening the DAW. Prevents autopilot sessions. Hold <strong>Dhyana Mudra</strong>: right hand in left palm, both facing up, thumbs lightly touching to form an oval. Rest in your lap.</Callout>
      <Step num={1} title="System 1: Sensation" desc="&quot;What is my BODY doing right now?&quot; Don't think the answer. FEEL it. Notice chest, gut, jaw, shoulders. Is there tension? Ease? Heaviness?" />
      <Step num={2} title="System 2: Cognition" desc="&quot;What am I trying to hold in working memory right now?&quot; DoorDash income? A lyric idea? Anxiety about the release? Just name it." />
      <Step num={3} title="System 3: Metacognition" desc="&quot;Am I monitoring or controlling right now?&quot; Watching your mind (healthy) vs. forcing it (counterproductive). The question itself activates S3." />
      <Step num={4} title="The Sentence" desc="&quot;I am [state]. I will [intention today].&quot; Examples: &quot;I am scattered. I will focus on one vocal take at a time.&quot; / &quot;I am numb. I will start with warmups and let the session wake me up.&quot;" />
      <Callout type="tip" icon="✅"><strong>Barrett's Interoception Model:</strong> Your brain makes predictions. When they're wrong, you feel discomfort. Naming the state (&quot;I am anxious&quot;) updates the prediction. The body settles because the brain is no longer surprised by the sensation.</Callout>
      <hr className="scroll-hr" />

      <h2 className="scroll-h3">Practice 04: The 90-Second Kill List Scan <span className="stp-badge badge-gold">90 sec</span></h2>
      <Step num={1} title="Open → Read → Close" desc="Open Oracle Compass → Kill List. Read ONLY the RED (urgent) items. Don't open them. Don't start solving them. Just read the titles. Ask: &quot;Which one is the single most important today?&quot; Close the app. That one thing is your Action 1." />
      <Callout type="warning" icon="⚠️"><strong>The 90-Second Exit Rule:</strong> If still scrolling at 90 seconds, close the app regardless. ADHD hyperfocus turns &quot;quick check&quot; into an hour. The hard exit prevents this.</Callout>
      <hr className="scroll-hr" />

      <h2 className="scroll-h3">Practice 05: Pre-Flight Somatic Matrix <span className="stp-badge badge-orange">90 sec · Before Recording</span></h2>
      <p className="scroll-p">A 6-point biometric scan, 5 seconds before the red light.</p>
      <Step num={1} title="Feet &amp; Knees" desc="Feet rooted? Knees slightly bent? Locked knees paralyze the pelvic floor and cut off breath support." />
      <Step num={2} title="Intercostal Anchor" desc="Hands on lower ribs. Breathe in. Ribs expanding OUTWARD (laterally)? If shoulders rise or chest puffs, you're breathing wrong." />
      <Step num={3} title="C-Spine Posture" desc="String pulling crown toward ceiling. Chin drops slightly — parallel to floor. Back of neck feels LONG. This opens the larynx." />
      <Step num={4} title="Jaw Check" desc="Let jaw hang open. Thumb under chin in soft triangle. Say &quot;Ah.&quot; That muscle must stay SOFT and spongy. If it hardens, root tongue is choking your airway." />
      <Step num={5} title="Soft Palate" desc="Create the beginning of a yawn — that slight lift at the back of your mouth. Hold it there. Don't full-yawn. Just the first 20% of lift. That's your soft palate opening the resonance chamber." />
      <Step num={6} title="Mental Override" desc="&quot;Acknowledge the block. Channel the frequency.&quot; Then hit record." />
      <hr className="scroll-hr" />

      <h2 className="scroll-h3">Practice 06: Post-Session Cool-Down <span className="stp-badge badge-green">3 min · After Recording</span></h2>
      <Step num={1} title="Lip Trills" desc="Close lips loosely, exhale to buzz. Start at comfortable high pitch, slide slowly DOWN to lowest note. Repeat 5–6 times, each starting slightly lower." />
      <Step num={2} title="Humming" desc="30 seconds of gentle humming on a comfortable pitch. Feel vibration in chest." />
      <Step num={3} title="Hydrate" desc="Room-temperature water. After recording, laryngeal muscles are engorged with blood. If you just stop, they stiffen overnight." />
      <hr className="scroll-hr" />

      <h2 className="scroll-h3">Practice 07: Barrett Body Budget Rules <span className="stp-badge badge-red">Standing Protocol</span></h2>
      <p className="scroll-p">These aren&apos;t practices — they&apos;re rules. Violate these and everything falls apart.</p>
      <div className="scroll-card scroll-card-left">
        <ol style={{paddingLeft:20}}>
          <li className="scroll-p"><strong>Sleep:</strong> Lights out 10:30 PM. Dopamine receptors upregulate, neuroplasticity happens, vocal cords recover.</li>
          <li className="scroll-p"><strong>Caffeine Cutoff:</strong> 1:00 PM. 6-hour half-life. After 1 PM you&apos;re stealing from tomorrow.</li>
          <li className="scroll-p"><strong>Protein Pre-Session:</strong> Eggs, oats, banana. Tyrosine = dopamine precursor. Skipping crashes executive function at hour 3.</li>
          <li className="scroll-p"><strong>Hydration for Vocals:</strong> Room-temp water 2–4 HOURS before tracking. Water right before does nothing for your cords.</li>
          <li className="scroll-p"><strong>No Dairy 2 Hours Before Vocals:</strong> Coats the folds, creates mucus drag. Warm water + honey instead.</li>
          <li className="scroll-p"><strong>Fruit Over Sugar:</strong> Banana first. Every time. Sobriety detox drives hard cravings weeks 1–4.</li>
          <li className="scroll-p"><strong>Mid-Session Fuel at the Desk:</strong> If you have to leave the room to eat, you won&apos;t do it. PB&amp;J stays at the workstation.</li>
          <li className="scroll-p"><strong>Sunday Meal Prep:</strong> 30–45 min. Rice, chicken thighs, boiled eggs, PB&amp;J sandwiches bagged. $38–48 at Aldi.</li>
        </ol>
      </div>
      <hr className="scroll-hr" />

      <h2 className="scroll-h3">Practice 08: Lower Chain Activation Protocol <span className="stp-badge badge-orange">8–10 min · Daily</span></h2>
      <Callout type="note" icon="🧘"><strong>Mudra Pairing: Prithvi Mudra</strong> — ring fingertip to thumb tip, other fingers extended, palms face upward on knees. Earth element. Grounding. Release the mudra during Wall Sit and Standing Protocol when hands are free.</Callout>
      <Step num={1} title="Somatic Check First (10 sec)" desc="Stand with eyes closed. Feel both knees. Dull background tension (normal) = proceed. Sharp or bright = stop, don't train today. Stress wave with breath = continue gently." />
      <Step num={2} title="Calf + Achilles Release (2 min)" desc="Sit, legs extended. Foam roller/lacrosse ball on calf from Achilles up to back of knee in slow passes. Pause 5 full breaths on any spot that &quot;catches.&quot; The calf is the first domino in pelvic floor tension." />
      <Step num={3} title="Hamstring Fascial Breath (2 min)" desc="Seated, one leg extended, foot flexed. Deep inhale — feel hamstring lengthen AWAY from sitting bone. Exhale, let it soften. 6 times per leg. This is NOT a stretch. You're breathing space into the tissue." />
      <Step num={4} title="Hip Flexor Floor Release (2 min)" desc="Low lunge — back knee on floor, front foot flat. Torso upright. Do NOT push forward. Breathe and let gravity open the hip. 90-second hold per side. The psoas + iliacus attach to the lumbar spine and pull the pelvic floor into lock when tight — releasing them is the master key." />
      <Step num={5} title="Pelvic Floor Unlock Breath (2 min)" desc="Lie on back, knees bent, feet flat. Inhale into belly — lower back presses floor, pelvic floor drops and OPENS like an umbrella opening downward. On exhale, it rises naturally. Repeat 10x. This is the passive unlock — no Mula Bandha here." />
      <Step num={6} title="Wall Sit Activation (1 min)" desc="Back flat against wall. Slide down until thighs parallel or slightly above — never below parallel (meniscal protocol). Hold 30–60 sec. If sensation behind kneecap, come up 15 degrees." />
      <Step num={7} title="Unlocked Knees Standing Protocol" desc="Stand up. Consciously unlock knees — soft bend. Weight across all four corners of each foot. This is now your default standing position — in the vocal booth, waiting for DoorDash, at the stove." />
      <Callout type="warning" icon="⚠️"><strong>Knee Flare Protocol:</strong> If knee spikes: stop, lie on back, elevate on pillow. Do 10 pelvic floor unlock breaths. Ask: am I in pain or in stress? Wait 5 min. Decreased = somatized. Holds/increases = rest today.<br/><br/><strong>Compressed (5 min):</strong> Skip calf release. Steps 3+4+5+7 only.</Callout>

      <hr className="scroll-hr" />

      <h2 className="scroll-h3">Practice 09: Upper Chain Posture Reset <span className="stp-badge badge-blue">5 min · Post-DoorDash/Pre-Studio</span></h2>
      <Callout type="note" icon="🧘"><strong>Mudra: Prana Mudra at Step 6 only.</strong> Ring + pinky to thumb, other two extended. Palms forward at sides during Wall Stand Reset. Hands are occupied during Steps 1–5.</Callout>
      <Step num={1} title="Cervical Spine Decompress (1 min)" desc="Drop chin toward chest gently. Slowly roll right ear to right shoulder (30 sec), return, left side (30 sec). No full neck rolls. You're creating traction, not rotation." />
      <Step num={2} title="Door Frame Row (1 min)" desc="Grip both sides of doorway at chest height. Lean back. Pull chest toward frame, squeezing shoulder blades together. Hold 2 sec at top. 10–12 reps. Directly counteracts rolled-shoulder collapse." />
      <Step num={3} title="Floor Prone Angel (1 min)" desc="Lie face down. Arms out in &quot;T,&quot; palms down. Raise both arms 2–3 inches off floor. Hold 5 sec, lower. 8 reps. Forehead stays down. Mid-back muscles that were switched off will fire up." />
      <Step num={4} title="Pike Push-Up (1 min)" desc="Push-up position, walk feet toward hands until hips high (inverted V). Bend elbows, lower head toward floor, push back up. 6–8 reps. Builds posterior delts and upper trap for effortless &quot;string-from-crown&quot; posture." />
      <Step num={5} title="Jaw-Neck Decoupling (1 min)" desc="Thumb in soft triangle under chin. Rotate head left and right while keeping jaw COMPLETELY relaxed. Tissue under thumb must stay soft and spongy throughout. If it hardens, you're carrying neck tension in your jaw — that kills Appoggio support." />
      <Step num={6} title="Wall Stand Reset (30 sec)" desc="Back flat against wall: heels, calves, glutes, upper back, and back of skull all touching. Hold 30 sec. Walk away carrying this position. Form Prana Mudra here." />
      <Callout type="tip" icon="✅"><strong>Post-DoorDash minimum:</strong> Steps 1 → 2 → 6 (3 min). The steering wheel locks C-spine, rounds shoulders, collapses lower back. Entering the booth without reset = compromised instrument.<br/><br/><strong>Compressed (2 min):</strong> Door Frame Row + Wall Stand Reset only.</Callout>

      <hr className="scroll-hr" />

      <h2 className="scroll-h3">Practice 10: The 30-Minute Movement Block <span className="stp-badge badge-green">30 min · Post-Breakfast</span></h2>
      <Callout type="note" icon="🧘"><strong>Mudra Arc:</strong> Pre-movement: Prithvi (ring to thumb, 3 breaths). During: None — hands active. Post (final 60 sec): Dhyana Mudra (right hand in left, palms up, thumbs touching). Eyes closed. 3 breaths. This is the neuroplastic window.</Callout>
      <Step num={1} title="Pre-Movement Check (3 Breaths)" desc="Scan: right knee, left knee front, lower back, pelvic floor. Traffic light: Green = full session. Yellow = reduced ROM, no single-leg. Red = Practice 08 only, no movement block today." />
      <Step num={2} title="Phase 1 — Jonin → Anbu: Bodyweight Foundation" desc="Circuit (3 rounds, 45 sec work / 15 sec rest): Wall Sit (parallel+) · Floor Prone Angels (8 reps, 5-sec holds) · Pike Push-Ups (6–8 reps) · Door Frame Rows (12 reps) · Dead Bug (6 reps/side) · Supported Split Squat (2-inch depth only, right knee: stop if tracking issues)" />
      <Step num={3} title="Phase 2 — Anbu → Kage: Tai Chi Enters" desc="Add 10-min Yang-style short form (24 movements). Most therapeutic movement for post-surgical knees. Increase wall sit depth +5 degrees only if right knee green for 3 consecutive weeks." />
      <Step num={4} title="Phase 3 — Kage → S-Rank: Capoeira Ginga Returns" desc="Ginga footwork only, no kicks/acrobatics. Right knee must be consistently green 6+ weeks before ginga begins. The body REMEMBERS this pattern from childhood in Milwaukee." />
      <Step num={5} title="Phase 4 — S-Rank → God of Shinobi: Muay Thai Clinch" desc="Standing clinch and pad work — not full sparring. Most structurally sound entry for post-surgical knees. Instructor required." />

      <Callout type="important" icon="⚡"><strong>Non-Negotiable:</strong> Every rep starts with breath. Inhale to prepare, exhale to exert. If you can't breathe, you're going too hard. This is CNS-protective training, not performance training.<br/><br/><strong>Left Knee Rule (permanent):</strong> Never lock out under load. Stop 10–15° before full extension. Kneeling is fine.<br/><br/><strong>Minimum Viable Session (10 min):</strong> 3-breath check + Dead Bug (3 min) + Door Frame Row (2 min) + Wall Sit (2 min) + Floor Prone Angel (2 min) + Wall Stand Reset (1 min).</Callout>

      <h2 className="scroll-h3">Quick Reference Cards</h2>
      <div className="scroll-seq-box" style={{padding: "16px", background: "rgba(255,255,255,0.03)", borderRadius: "8px", marginBottom: "16px"}}>
        <div className="scroll-seq-title" style={{fontWeight: 600, color: "var(--text)", marginBottom: "8px"}}>Full S-Tier Morning</div>
        <div style={{fontSize: "14px", lineHeight: 1.6, color: "var(--text)"}}>Wake → 32oz water + sea salt → Practice 01 (Jnana + OM, 90sec) → Practice 02 (Nadi Shodhana, 5min) → Practice 08 compressed (Lower Chain, 5min) → Practice 09 compressed (Upper Chain, 2min) → Protein meal → Practice 10 (Movement, 30min) → Practice 04 (Kill List, 90sec) → Practice 03 (S3 Check-in, studio days) → DAW open</div>
      </div>
      <div className="scroll-seq-box" style={{padding: "16px", background: "rgba(255,255,255,0.03)", borderRadius: "8px", marginBottom: "16px"}}>
        <div className="scroll-seq-title" style={{fontWeight: 600, color: "var(--text)", marginBottom: "8px"}}>Compressed Ignition (DoorDash by 6:30 AM)</div>
        <div style={{fontSize: "14px", lineHeight: 1.6, color: "var(--text)"}}>Wake → 32oz water + sea salt → Practice 01 compressed (3 OMs, 60sec) → Protein meal (hardboiled eggs + banana) → Practice 04 (Kill List, 90sec) → DoorDash</div>
      </div>
      <div className="scroll-seq-box" style={{padding: "16px", background: "rgba(255,255,255,0.03)", borderRadius: "8px", marginBottom: "16px"}}>
        <div className="scroll-seq-title" style={{fontWeight: 600, color: "var(--text)", marginBottom: "8px"}}>Post-DoorDash Reset (Before Studio)</div>
        <div style={{fontSize: "14px", lineHeight: 1.6, color: "var(--text)"}}>Practice 09 compressed (C-Spine + Door Frame Row + Wall Stand, 3min) → Practice 03 (S3 Check-in, 90sec) → Practice 05 (Pre-Flight Somatic Matrix) → Record</div>
      </div>
      <div className="scroll-seq-box" style={{padding: "16px", background: "rgba(255,255,255,0.03)", borderRadius: "8px", marginBottom: "16px"}}>
        <div className="scroll-seq-title" style={{fontWeight: 600, color: "var(--text)", marginBottom: "8px"}}>Minimum Viable Day (Everything Hurts)</div>
        <div style={{fontSize: "14px", lineHeight: 1.6, color: "var(--text)"}}>Practice 01 compressed (3 OMs) → Practice 10 MVS (10min) → Practice 07 (Barrett Body Budget Rules)</div>
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
      <Callout type="important" icon="✓"><strong>Verified against live Ethan Payton LLC Spotify Ads Manager account · March 31, 2026.</strong> All CPM ranges, budget minimums, and UI structure sourced from live account screenshots.</Callout>

      <h2 className="scroll-h3">Part 1 — Auction vs. Reserved</h2>
      <div className="scroll-grid-2">
        <div className="scroll-grid-card" style={{border:"2px solid #3ecf71"}}><div className="scroll-gc-title" style={{color:"#3ecf71"}}>✓ AUCTION — Use This</div><div className="scroll-gc-desc"><strong>~$18/day minimum · Dynamic CPM</strong><br/>Audio CPM: $8.43–$9.38. Display CPM: $4.35–$4.88. Spotify&apos;s algorithm finds the right audience within your targeting. Budget is flexible — pause, adjust, reallocate anytime. This is the tool for all independent campaigns at your current scale.</div></div>
        <div className="scroll-grid-card"><div className="scroll-gc-title" style={{color:"rgba(255,255,255,0.4)"}}>RESERVED — Come Back at $5K+</div><div className="scroll-gc-desc"><strong>$5,000 lifetime minimum · Fixed $10.00 CPM</strong><br/>Pre-book guaranteed impressions. Delivery goal = impressions only. No performance optimization. This is a major label brand awareness tool. Not the right tool for stream growth at any budget level.</div></div>
      </div>
      <Callout type="tip" icon="✅"><strong>You will never use Reserved.</strong> Even at $5K budget, Auction is superior for music growth — the algorithm optimizes toward streams and engagement, while Reserved just passively delivers impressions at a flat rate.</Callout>

      <h2 className="scroll-h3">Part 2 — Ad Formats (Real CPMs)</h2>
      <div className="scroll-grid-3">
        <div className="scroll-grid-card" style={{borderTop:"3px solid #3ecf71"}}><div className="scroll-gc-title">🎵 Audio Ad</div><div className="scroll-gc-desc"><strong style={{color:"#4d9de0"}}>CPM: $8.43–$9.38</strong><br/>Plays during music sessions. Ears open, mentally receptive. Highest attention context. <strong>Use this for ALL LOVE.</strong></div></div>
        <div className="scroll-grid-card"><div className="scroll-gc-title">📱 Display Ad</div><div className="scroll-gc-desc"><strong style={{color:"#9b72cf"}}>CPM: $4.35–$4.88</strong><br/>Visual banner. Half the CPM of audio but lower intent. Use as secondary format only for profile visits.</div></div>
        <div className="scroll-grid-card"><div className="scroll-gc-title">🎬 Video Ad</div><div className="scroll-gc-desc"><strong style={{color:"rgba(255,255,255,0.4)"}}>CPM: Varies</strong><br/>Plays when Spotify open on screen. Worth testing in campaign 2 if you have a Canvas loop or lyric video clip.</div></div>
      </div>

      <h2 className="scroll-h3">Part 3 — Unlocking &quot;Streams&quot; Delivery Goal (CRITICAL)</h2>
      <Callout type="warning" icon="⚠️"><strong>Clicks ≠ Streams.</strong> Clicks optimization finds people who click → many bounce after 5 sec. Streams optimization finds people who listen 30+ sec → the full engagement signal the algorithm needs. <strong>Streams is ALWAYS superior for music promotion.</strong></Callout>
      <Step num={1} title="Find &quot;Your content on Spotify&quot;" desc="In the Ad Set setup, find the toggle: Podcast · Music. Click Music." />
      <Step num={2} title="Search &quot;Ethan Payton&quot;" desc="In &quot;Search for artists&quot; field, type Ethan Payton and select your artist profile. This declares you own the content you're promoting." />
      <Step num={3} title="Select &quot;Streams&quot; delivery goal" desc="Once your artist content is linked, &quot;Streams&quot; unlocks in the Delivery section. Select it. This switches the algorithm to optimize for listening behavior." />
      <Step num={4} title="Set Bid at $9.50 (midpoint)" desc="Your account range: $8.27–$9.92. Start upper-middle. Lower after 48 hrs if spend moves too fast. Bump to $9.92 if delivery is slow." />
      <Callout type="tip" icon="🌱"><strong>What this does to your algorithm:</strong> Every paid stream adds a listener to the model of &quot;who listens to Ethan Payton.&quot; That model influences organic Discover Weekly recommendations — the paid campaign seeds the organic algorithm. <strong>Every stream you buy via ads has compounding organic value.</strong></Callout>

      <h2 className="scroll-h3">Part 4 — Targeting (Field-by-Field)</h2>
      <div className="scroll-table-wrap"><table className="scroll-table"><thead><tr><th>Field</th><th>Setting</th><th>Why</th></tr></thead><tbody>
        <tr><td>Country</td><td><strong>United States</strong></td><td>Entire data set is US-based. No international until MAL {">"} 10K.</td></tr>
        <tr><td>City Targeting</td><td><strong>Denver, Minneapolis, Dallas</strong></td><td>Tier 1 organic markets. Leave one ad set WITHOUT city targeting to discover new cities.</td></tr>
        <tr><td>Age</td><td><strong>18–34</strong></td><td>Primary streaming demo. Default 13–65+ is too wide to optimize.</td></tr>
        <tr><td>Gender</td><td><strong>All</strong></td><td>Don&apos;t filter. Let the algorithm find who engages. Check S4A after campaign for movement.</td></tr>
        <tr><td>Interests</td><td><strong>R&amp;B, Soul, Alternative R&amp;B</strong></td><td>Genre receptiveness signal. Stacks with Fan bases.</td></tr>
        <tr><td>Fan Bases</td><td><strong>6LACK, Bryson Tiller, PND, Daniel Caesar, Smino</strong></td><td>Core Drive S-tier matches. Algorithm identifies active streamers of these artists.</td></tr>
        <tr><td>Language</td><td><strong>English</strong></td><td>Ensure ad is heard by listeners who understand lyrics.</td></tr>
        <tr><td>Device</td><td><strong>All (iOS, Android, Desktop)</strong></td><td>No reason to exclude at this budget.</td></tr>
      </tbody></table></div>
      <Callout type="note" icon="ℹ️"><strong>Stacking Strategy:</strong> Interests + Fan bases are both in &quot;Detailed targeting&quot; — NOT mutually exclusive. Layer <strong>R&amp;B interest + 6LACK/Tiller fan base</strong> in one ad set. This creates an AND condition — tighter, higher-intent audience. Reach shrinks but stream rate climbs.</Callout>

      <h2 className="scroll-h3">Part 5 — Budget Ladder</h2>
      <h3 className="scroll-h3" style={{fontSize: 16, marginTop: 16}}>EP Launch ($50 total)</h3>
      <div className="scroll-table-wrap"><table className="scroll-table"><thead><tr><th>City</th><th>Budget</th><th>Rationale</th></tr></thead><tbody>
        <tr><td>Denver</td><td>$20</td><td>#1 organic city (372 listeners)</td></tr>
        <tr><td>Minneapolis</td><td>$15</td><td>#2 organic (323 listeners)</td></tr>
        <tr><td>Dallas</td><td>$15</td><td>#3 organic (241 listeners)</td></tr>
      </tbody></table></div>
      <h3 className="scroll-h3" style={{fontSize: 16, marginTop: 16}}>Album Launch ($250 total · Expand to 10 cities)</h3>
      <div className="scroll-table-wrap"><table className="scroll-table"><thead><tr><th>City</th><th>Budget</th></tr></thead><tbody>
        <tr><td>Denver</td><td>$40</td></tr><tr><td>Minneapolis</td><td>$30</td></tr><tr><td>Dallas</td><td>$25</td></tr><tr><td>Chicago</td><td>$25</td></tr><tr><td>Calgary</td><td>$20</td></tr><tr><td>Toronto</td><td>$20</td></tr><tr><td>Charlotte</td><td>$20</td></tr><tr><td>Phoenix</td><td>$20</td></tr><tr><td>NYC</td><td>$25</td></tr><tr><td>LA</td><td>$25</td></tr>
      </tbody></table></div>
      <p className="scroll-p"><strong>Marquee ($100–150):</strong> Full-screen notification to entire listener base. Album release day. One shot.<br/><strong>Meta Ads ($50–100):</strong> Video ad (15–30 sec) → Spotify link. Brent Faiyaz / SZA / 6LACK / Daniel Caesar fans. Instagram only.</p>

      <h2 className="scroll-h3">Part 6 — Audio Creative Specs + The Script</h2>
      <div className="scroll-table-wrap"><table className="scroll-table"><thead><tr><th>Spec</th><th>Requirement</th></tr></thead><tbody>
        <tr><td>Audio Length</td><td>30 seconds max</td></tr>
        <tr><td>File Format</td><td>MP3, OGG, or WAV</td></tr>
        <tr><td>File Size</td><td>1MB maximum</td></tr>
        <tr><td>Loudness</td><td>-16 LUFS · -2.0 dBTP true peak</td></tr>
        <tr><td>Word Count</td><td>65 words max (for natural pace)</td></tr>
        <tr><td>Companion Image</td><td>640×640px · JPEG or PNG · 200KB max</td></tr>
        <tr><td>CTA Button</td><td>&quot;Listen Now&quot; (recommended)</td></tr>
        <tr><td>Destination</td><td>Direct Spotify track link (NOT artist profile — reduce friction)</td></tr>
      </tbody></table></div>

      <h3 className="scroll-h3" style={{fontSize: 16, marginTop: 16}}>The 30-Second Ad Script</h3>
      <div className="scroll-seq-box" style={{padding: "16px", background: "rgba(255,255,255,0.03)", borderRadius: "8px"}}>
        <div className="scroll-seq-title" style={{fontWeight: 600, color: "var(--text)", marginBottom: "8px"}}>ALL LOVE EP · 30-Second Audio Ad · ~55 words · Record in one take</div>
        <div style={{fontSize: "14px", lineHeight: 1.6, color: "var(--text)"}}>
        <strong style={{color:"rgba(255,255,255,0.4)"}}>0:00</strong> — [Instrumental opens at ~15% volume — 2 full seconds before voice]<br/>
        <strong style={{color:"rgba(255,255,255,0.4)"}}>0:02</strong> — &quot;I made this one about a feeling most people don&apos;t say out loud.&quot;<br/>
        <strong style={{color:"rgba(255,255,255,0.4)"}}>0:08</strong> — &quot;That feeling of being right there — and still not being seen.&quot;<br/>
        <strong style={{color:"rgba(255,255,255,0.4)"}}>0:13</strong> — [Music comes up — let the hook play for 12 seconds. Trust the song.]<br/>
        <strong style={{color:"rgba(255,255,255,0.4)"}}>0:25</strong> — &quot;ALL LOVE EP. I&apos;m Ethan Payton. Save it if it stays with you.&quot;<br/>
        <strong style={{color:"rgba(255,255,255,0.4)"}}>0:29</strong> — [Music fades to silence over 1 second]
        </div>
      </div>
      <Callout type="note" icon="🎯"><strong>Why &quot;Save&quot; is the CTA:</strong> Save is the highest-intent algorithmic signal. It tells Spotify the listener is investing in the record. That signal feeds Discover Weekly directly. It&apos;s not &quot;stream it again&quot; — it&apos;s &quot;I&apos;m keeping this.&quot;</Callout>

      <h2 className="scroll-h3">Part 7 — KPIs After Launch</h2>
      <div className="scroll-metrics-grid">
        <div className="scroll-metric-card"><span className="scroll-metric-val">&lt;$0.30</span><div className="scroll-metric-lbl">Cost Per Stream</div></div>
        <div className="scroll-metric-card"><span className="scroll-metric-val">15%+</span><div className="scroll-metric-lbl">Stream Rate</div></div>
        <div className="scroll-metric-card"><span className="scroll-metric-val">20%+</span><div className="scroll-metric-lbl">Save Rate During Campaign</div></div>
        <div className="scroll-metric-card"><span className="scroll-metric-val">3–5×</span><div className="scroll-metric-lbl">Frequency / Person / Week</div></div>
        <div className="scroll-metric-card"><span className="scroll-metric-val">$8–10</span><div className="scroll-metric-lbl">Actual CPM</div></div>
        <div className="scroll-metric-card"><span className="scroll-metric-val">+20%</span><div className="scroll-metric-lbl">MAL Delta (7-day)</div></div>
      </div>
      <Callout type="important" icon="📊"><strong>Day 7 Check:</strong> Ads Manager → Reports → compare ad sets by cost-per-stream. Pause worst performer, shift budget to winner. Open S4A → Audience → if % female moved up 1–2 points, contextual targeting is working.</Callout>

      <h2 className="scroll-h3">Part 8 — Ad ↔ Release Waterfall</h2>
      <Step num={1} title="EP drops + campaign launches same day" desc="Organic release discovery + paid reach hit simultaneously. Algorithm reads multi-source traffic as stronger demand signal." />
      <Step num={2} title="Days 1–7 — Algorithm learns from paid streams" desc="Fan base targeting (6LACK, Tiller) trains the algorithm. Bleeds into organic Discover Weekly 2–4 weeks later." />
      <Step num={3} title="Day 7 — Restructure" desc="Pause weakest ad set. Shift budget to winner. Audience data from campaign 1 informs campaign 2 targeting — you're not guessing anymore." />
      <Step num={4} title="Post-campaign — Write the data brief" desc="Best ad set, actual CPM, cost per stream, save rate, gender movement, new cities discovered. This doc is the foundation for every future campaign. By campaign 3, you have a precision system." />
      <Callout type="important" icon="⚡"><strong>The Single Lever:</strong> Ads drive listeners → listeners who save become Discover Weekly seeds → DW drives organic growth. Ads are the primer, not the engine. Music quality + save rate is the engine. Each cycle compounds — the sage move is running these consistently and reading the data each time.</Callout>
    </>
  );
}

// ═══════════════════════════════════════════════════════════════
// Visual Bible — Light Boy Doctrine · Anchor: SEE ME
// Source: past-el-visual-bible.html (Apr 20, 2026)
// ═══════════════════════════════════════════════════════════════

function VisualBiblePage() {
  return (
    <>
      <Header tag="Visual Brand Bible · v1" title="Light Boy" sub="Darkness as ground. A single warm luminous event. A silhouette that identifies." />

      <Callout type="important" icon="⚡"><strong>Central thesis:</strong> Every past.El visual is a variation on the same sentence — <em>night around a lit thing</em>. The streetlamp halo on the SEE ME cover is not an album art choice; it&apos;s the brand&apos;s literal operating system made visible.</Callout>

      <h2 className="scroll-h3">Anchor — SEE ME</h2>
      <div className="scroll-table-wrap"><table className="scroll-table"><tbody>
        <tr><td><strong>Key / BPM</strong></td><td>B minor · 120 BPM</td></tr>
        <tr><td><strong>Duration</strong></td><td>2:40 · Dark TrapSoul</td></tr>
        <tr><td><strong>Mood</strong></td><td>Sexy 0.89 (highest on EP) · Romantic 0.46 · Chill 0.45</td></tr>
        <tr><td><strong>Lane</strong></td><td>Drake / 6LACK / Bryson Tiller axis · Alt-R&amp;B / Trap / Melodic Rap</td></tr>
      </tbody></table></div>

      <h2 className="scroll-h3">Four Worlds — Aesthetic System</h2>
      <div className="scroll-grid-2">
        <div className="scroll-grid-card"><div className="scroll-gc-title" style={{color:"#d4a843"}}>01 · Intimate / Ghibli</div><div className="scroll-gc-desc">2700K warm window key · low contrast · soft bloom · <strong>Sweet Frustration · Like I Did · Want U Bad</strong></div></div>
        <div className="scroll-grid-card"><div className="scroll-gc-title" style={{color:"#d4a843"}}>02 · Cosmic / Starfield</div><div className="scroll-gc-desc">Single source on deep navy · halation · silhouette-forward · <strong>SEE ME · East Side Love · Luxury</strong></div></div>
        <div className="scroll-grid-card"><div className="scroll-gc-title" style={{color:"#d4a843"}}>03 · Retro Anime / Painted</div><div className="scroll-gc-desc">90s VHS cel · rust+gold on navy · painted rim light · <strong>I Like Girls · Green Light Patient · Just Say So</strong></div></div>
        <div className="scroll-grid-card"><div className="scroll-gc-title" style={{color:"#d4a843"}}>04 · Threshold / Truman</div><div className="scroll-gc-desc">Backlit figure at a boundary · cream halo edges · scale play · <strong>Reconnect · Worth It · album intro/outro</strong></div></div>
      </div>

      <h2 className="scroll-h3">Shot Vocabulary</h2>
      <div className="scroll-table-wrap"><table className="scroll-table"><thead><tr><th>Term</th><th>Meaning</th></tr></thead><tbody>
        <tr><td>Halation</td><td>Warm bloom around bright edges — film emulsion leak.</td></tr>
        <tr><td>Halo Backlight</td><td>Single source behind the figure. The <em>SEE ME</em> streetlamp.</td></tr>
        <tr><td>Warm Overexpose</td><td>Let the key source clip. The highlight is sacred.</td></tr>
        <tr><td>Silhouette Rule</td><td>If the outline doesn&apos;t read at 10% size, the shot doesn&apos;t ship.</td></tr>
        <tr><td>Scale Play</td><td>Figure small against sky · or huge against a tiny lit object. Never medium-always.</td></tr>
        <tr><td>Color State</td><td>Each track shifts navy toward emerald, rust, or gold. Palette stays fixed.</td></tr>
      </tbody></table></div>

      <h2 className="scroll-h3">Bedroom ILM — 7-Stage Pipeline</h2>
      <Step num={1} title="Capture" desc="Permanent Capture corner. ZV-E1 or iPhone 16 Pro · Godox SL-60W · navy backdrop · 5600K fixed. Zero setup friction." />
      <Step num={2} title="Mask" desc="DaVinci Resolve Magic Mask (free). Clean matte off the navy cloth. Output: ProRes 4444 alpha + clean plate." />
      <Step num={3} title="Generate Background" desc="Higgsfield Cinema Studio 2.5 (aggregates Kling / Veo / Runway / Sora). One prompt library per World." />
      <Step num={4} title="Composite" desc="DaVinci Fusion (free). Match perspective + ground plane. Edge-lock or it floats." />
      <Step num={5} title="Relight" desc="SwitchLight Pro. Add the single warm source — the Light Boy stage. One source per shot, always." />
      <Step num={6} title="Grade + Grain" desc="Dehancer Pro ($179 one-time). Kodak 2383 or Fuji 8553. Navy-shifted midtones, gold-shifted highlights. The anti-slop stage." />
      <Step num={7} title="Multiply" desc="One master → 9 exports (reel/square/horizontal/GIF/quote/thumb/behind-scene/cover variant/sync preview). Haiku handles captions." />

      <h2 className="scroll-h3">Tool Stack — Authoritative</h2>
      <div className="scroll-table-wrap"><table className="scroll-table"><thead><tr><th>Tool</th><th>Role</th><th>Cost</th></tr></thead><tbody>
        <tr><td>DaVinci Resolve (Free)</td><td>Edit · color · Fusion · Magic Mask</td><td>$0</td></tr>
        <tr><td>Higgsfield Cinema Studio 2.5</td><td>AI video generation · all 4 models</td><td>$19/mo</td></tr>
        <tr><td>Dehancer Pro (plugin)</td><td>35mm emulation · grain · halation</td><td>$179 once</td></tr>
        <tr><td>SwitchLight Pro</td><td>AI relighting · stage 05</td><td>$9/mo</td></tr>
        <tr><td>Claude Haiku API</td><td>Caption / prompt / export loop batch</td><td>~$5/mo</td></tr>
      </tbody></table></div>
      <Callout type="tip" icon="🎯"><strong>Content Factory integration:</strong> Four new <code>--jutsu</code> flags are live in <code>content-factory-v4/scripts/process.mjs</code> — <code>cosmic</code>, <code>ghibli</code>, <code>retro</code>, <code>threshold</code>. Each matches the World&apos;s color grade + font + caption palette.</Callout>

      <h2 className="scroll-h3">Sync Lanes — ALL LOVE</h2>
      <div className="scroll-table-wrap"><table className="scroll-table"><thead><tr><th>Target</th><th>Fit</th><th>Tracks</th></tr></thead><tbody>
        <tr><td>A24 / Neon trailers</td><td>★★★★★</td><td>SEE ME · East Side Love</td></tr>
        <tr><td>HBO prestige drama (Euphoria-adj)</td><td>★★★★★</td><td>SEE ME</td></tr>
        <tr><td>Nike / Jordan Brand</td><td>★★★★</td><td>East Side Love</td></tr>
        <tr><td>Netflix YA romance</td><td>★★★★</td><td>Sweet Frustration · Like I Did</td></tr>
        <tr><td>Apple device launches</td><td>★★★</td><td>Luxury · Worth It</td></tr>
        <tr><td>FIFA / NBA 2K</td><td>★★★</td><td>I Like Girls · Green Light Patient</td></tr>
      </tbody></table></div>

      <h2 className="scroll-h3">Anti-Patterns — Never Ship</h2>
      <Bench text={<><strong>More than one dominant source</strong> — that&apos;s Marvel, not past.El.</>} />
      <Bench text={<><strong>Raw AI video without Dehancer grade</strong> — that&apos;s slop, not aesthetic.</>} />
      <Bench text={<><strong>Bright / high-saturation palettes</strong> — brand is navy-ground, not pop-candy.</>} />
      <Bench text={<><strong>Figure centered at medium-scale with medium light</strong> — no <em>middle</em> anywhere.</>} />
      <Bench text={<><strong>Silhouettes that don&apos;t read at 10% thumb size</strong> — the thumbnail test is sacred.</>} />

      <Callout type="note" icon="📄"><strong>Full deck:</strong> <code>/Users/ethanpayton/past-el-visual-bible.html</code> — open locally for the printable/framable version with palette swatches + shot mood boards.</Callout>
    </>
  );
}

// ═══════════════════════════════════════════════════════════════
// War Room — Spatial Blueprint for the Bedroom Command Center
// Source: past-el-war-room.html (Apr 20, 2026)
// ═══════════════════════════════════════════════════════════════

function WarRoomPage() {
  return (
    <>
      <Header tag="War Room · Spatial Blueprint" title="The Rebuild" sub="One room trying to do five jobs → four zones that each own one mode." />

      <Callout type="warning" icon="⚠️"><strong>Diagnosis:</strong> This isn&apos;t a willpower problem. It&apos;s an <em>environment-as-interface</em> problem. The room is the UI the body is running against — and right now the UI has overlapping click targets.</Callout>

      <h2 className="scroll-h3">Six Structural Failures</h2>
      <div className="scroll-grid-2">
        <div className="scroll-grid-card"><div className="scroll-gc-title" style={{color:"#e05545"}}>01 · Sleep + Production co-mingle</div><div className="scroll-gc-desc">Bed and desk share the same air with no boundary. Insomnia when work is unfinished; procrastination when rest is due.</div></div>
        <div className="scroll-grid-card"><div className="scroll-gc-title" style={{color:"#e05545"}}>02 · No dedicated Capture zone</div><div className="scroll-gc-desc">Camera floats. Friction to hit record = 10× fewer captures. For a &quot;light boy&quot; brand, Capture must be standing &amp; permanent.</div></div>
        <div className="scroll-grid-card"><div className="scroll-gc-title" style={{color:"#e05545"}}>03 · Red LED fights the palette</div><div className="scroll-gc-desc">Ceiling red contradicts navy/emerald/gold. Fix: warm amber 2700K for production, cool 5600K for capture fill only.</div></div>
        <div className="scroll-grid-card"><div className="scroll-gc-title" style={{color:"#e05545"}}>04 · Bed axis perpendicular to window</div><div className="scroll-gc-desc">Breaks flow line. Rotate so headboard is on the interior wall — command position.</div></div>
        <div className="scroll-grid-card"><div className="scroll-gc-title" style={{color:"#e05545"}}>05 · Whiteboard visible from bed</div><div className="scroll-gc-desc">Cortisol-on-waking. First sight = undone list. Move or cover until 2nd coffee.</div></div>
        <div className="scroll-grid-card"><div className="scroll-gc-title" style={{color:"#e05545"}}>06 · Zero bodywork floor space</div><div className="scroll-gc-desc">Pelvic floor / pigeon / qigong / knee rehab need ~40 sqft clear rug. Current: zero. Practice is homeless.</div></div>
      </div>

      <h2 className="scroll-h3">Four Zones — Mode Ownership</h2>
      <div className="scroll-table-wrap"><table className="scroll-table"><thead><tr><th>Zone</th><th>Owner</th><th>Size</th></tr></thead><tbody>
        <tr><td><span className="stp-badge badge-blue">Sleep</span></td><td>Recovery · bed in command position · amber bedside only · blackout curtain</td><td>~35 ft²</td></tr>
        <tr><td><span className="stp-badge badge-gold">Capture</span></td><td>Standing corner · permanent ring + key + fill · navy backdrop · tripod doesn&apos;t move</td><td>~30 ft²</td></tr>
        <tr><td><span className="stp-badge badge-green">Produce</span></td><td>Desk on window wall · 2 monitors · chair faces room · single cable trough</td><td>~40 ft²</td></tr>
        <tr><td><span className="stp-badge badge-purple">Ops / Floor</span></td><td>Rug + pegboard · bodywork + gear staging · no furniture in center</td><td>~55 ft²</td></tr>
      </tbody></table></div>

      <h2 className="scroll-h3">Lighting System — Three Fixtures, Three Modes</h2>
      <div className="scroll-grid-2">
        <div className="scroll-grid-card"><div className="scroll-gc-title" style={{color:"#d4a843"}}>Key — Capture</div><div className="scroll-gc-desc">5600K · 95+ CRI · Godox SL-60W + softbox. Only on when rolling.</div></div>
        <div className="scroll-grid-card"><div className="scroll-gc-title" style={{color:"#d4a843"}}>Fill — Produce</div><div className="scroll-gc-desc">2700K bias strip behind monitors + warm floor lamp. Ceiling light off during work hours.</div></div>
        <div className="scroll-grid-card"><div className="scroll-gc-title" style={{color:"#d4a843"}}>Ambient — Sleep</div><div className="scroll-gc-desc">2200K amber bedside on dimmer. Red LED removed. Off hard by 10pm.</div></div>
      </div>

      <h2 className="scroll-h3">Three Weekends to S-Tier</h2>
      <Step num={1} title="Weekend 1 — Subtract + Rotate" desc="Remove red LED · rotate bed to command · pull whiteboard off sight-line · move desk to window wall · everything off floor." />
      <Step num={2} title="Weekend 2 — Ground + Light" desc="Lay rug · hang blackout curtain · install bias strip · swap ceiling bulb for warm amber · tape mark Capture floor spot." />
      <Step num={3} title="Weekend 3 — Capture + Living" desc="Mount navy backdrop · set Godox permanent · hang pegboard with bodywork kit · place floor plant · route cables." />

      <Callout type="important" icon="💰"><strong>Rebuild budget:</strong> ~$560 total, tiered RED/AMBER/GREEN across 3 weeks. The 4 RED items alone ({'{'}rug, blackout curtain, bias strip, amber bulb{'}'}) = $210 and carry 70% of the psychological shift.</Callout>

      <Callout type="note" icon="📄"><strong>Full deck:</strong> <code>/Users/ethanpayton/past-el-war-room.html</code> — open locally for the before/after floorplan diagrams + complete shopping list with links.</Callout>
      <Callout type="tip" icon="🎯"><strong>Kill List integration:</strong> All 11 procurement items are seeded in <code>lib/warRoom.ts</code>. They surface in Kill List by urgency tier (wk1 RED → wk3 GREEN) and clear to <code>done</code> as you complete them.</Callout>
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
  "visual-bible": VisualBiblePage,
  "war-room": WarRoomPage,
};

export function getDoctrineContent(slug: string): ReactNode | null {
  const Component = CONTENT_MAP[slug];
  if (!Component) return null;
  return <Component />;
}
