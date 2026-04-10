/**
 * Oracle Compass Theme Sync — for standalone HTML pages
 * Reads the theme from localStorage (set by the main app's ThemeProvider)
 * and applies matching CSS overrides so extension pages stay coherent.
 */
(function() {
  var mode = localStorage.getItem('theme-mode') || 'auto';
  var resolved = localStorage.getItem('theme-resolved');
  
  if (!resolved) {
    // Auto-detect if no resolved value stored
    var hour = new Date().getHours();
    resolved = (hour >= 6 && hour < 18) ? 'light' : 'dark';
  }
  
  document.documentElement.setAttribute('data-theme', resolved);

  // If the page is in light mode (cream/gold), it's already the default for these HTML files.
  // If dark mode, inject dark overrides.
  if (resolved === 'dark') {
    var style = document.createElement('style');
    style.textContent = [
      '[data-theme="dark"] { }',
      '[data-theme="dark"] body { background-color: #08090f !important; color: #f0f2f8 !important; }',
      '[data-theme="dark"] .container { color: #f0f2f8; }',
      '[data-theme="dark"] h1, [data-theme="dark"] h2, [data-theme="dark"] h3 { color: #3ecf8e !important; }',
      '[data-theme="dark"] .masthead { border-color: #c9a84c !important; }',
      '[data-theme="dark"] .masthead-title { color: #f0f2f8 !important; }',
      '[data-theme="dark"] .masthead-label, [data-theme="dark"] .label-os { color: #c9a84c !important; }',
      '[data-theme="dark"] .masthead-subtitle, [data-theme="dark"] .subtitle { color: #c9a84c !important; }',
      /* Cards & surfaces */
      '[data-theme="dark"] .card, [data-theme="dark"] .diag-card, [data-theme="dark"] .codex-item { background-color: #12141c !important; border-color: #2a2d3e !important; color: #f0f2f8 !important; }',
      '[data-theme="dark"] .card.alert { background-color: #1a1018 !important; border-color: #d32f2f !important; }',
      '[data-theme="dark"] .card.alert h3 { color: #f87171 !important; }',
      '[data-theme="dark"] .protocol-box { background-color: #12141c !important; border-color: #3ecf8e !important; color: #f0f2f8 !important; }',
      '[data-theme="dark"] .protocol-box h4 { color: #c9a84c !important; }',
      '[data-theme="dark"] .benchmarks { background-color: #12141c !important; border-color: #3ecf8e !important; }',
      '[data-theme="dark"] .benchmark-text { color: #a3abc2 !important; }',
      '[data-theme="dark"] .benchmark-check { color: #3ecf8e !important; }',
      /* Tables */
      '[data-theme="dark"] table { background-color: #12141c !important; }',
      '[data-theme="dark"] th { background-color: #1a1c27 !important; color: #c9a84c !important; border-color: #c9a84c !important; }',
      '[data-theme="dark"] td { color: #a3abc2 !important; border-color: #2a2d3e !important; }',
      '[data-theme="dark"] tr:hover { background-color: #1a1c27 !important; }',
      /* Section headers */
      '[data-theme="dark"] .section-header { background-color: #1a1c27 !important; }',
      '[data-theme="dark"] .section-header h2 { color: #c9a84c !important; }',
      '[data-theme="dark"] .section-header .section-subtitle { color: #a3abc2 !important; }',
      /* Callouts */
      '[data-theme="dark"] .callout { background-color: #1a1c27 !important; border-color: #c9a84c !important; color: #a3abc2 !important; }',
      '[data-theme="dark"] .callout-title { color: #3ecf8e !important; }',
      /* Text */
      '[data-theme="dark"] p { color: #a3abc2 !important; }',
      '[data-theme="dark"] li { color: #a3abc2 !important; }',
      '[data-theme="dark"] strong { color: #c9a84c !important; }',
      '[data-theme="dark"] em { color: #6a718d !important; }',
      '[data-theme="dark"] code, [data-theme="dark"] .label { background-color: #1a1c27 !important; color: #c9a84c !important; }',
      /* Status pills */
      '[data-theme="dark"] .status-green { background-color: rgba(62, 207, 142, 0.15) !important; color: #3ecf8e !important; }',
      '[data-theme="dark"] .status-yellow { background-color: rgba(251, 191, 36, 0.15) !important; color: #fbbf24 !important; }',
      '[data-theme="dark"] .status-red { background-color: rgba(248, 113, 113, 0.15) !important; color: #f87171 !important; }',
      '[data-theme="dark"] .status-gold { background-color: rgba(201, 168, 76, 0.15) !important; color: #c9a84c !important; border-color: #c9a84c !important; }',
      /* Rank badges */
      '[data-theme="dark"] .rank-badge { background-color: #c9a84c !important; color: #08090f !important; }',
      '[data-theme="dark"] .rank-badge.active { background-color: #3ecf8e !important; color: #08090f !important; }',
      /* Phase grid */
      '[data-theme="dark"] .phase-grid { border-color: #2a2d3e !important; }',
      '[data-theme="dark"] .phase-label { background-color: #1a1c27 !important; }',
      '[data-theme="dark"] .phase-content { background-color: #12141c !important; color: #a3abc2 !important; border-color: #2a2d3e !important; }',
      '[data-theme="dark"] .phase-content strong { color: #3ecf8e !important; }',
      /* Signal decoder */
      '[data-theme="dark"] .signal-row { border-color: #2a2d3e !important; }',
      '[data-theme="dark"] .signal-row:first-child { background-color: #1a1c27 !important; }',
      '[data-theme="dark"] .signal-cell { border-color: #2a2d3e !important; color: #a3abc2 !important; }',
      /* Rules table */
      '[data-theme="dark"] .rules-table td { background-color: transparent !important; }',
      '[data-theme="dark"] .rules-table tr:nth-child(even) td { background-color: #0f1015 !important; }',
      '[data-theme="dark"] .rules-table .label-col { color: #3ecf8e !important; }',
      /* Ceremony box */
      '[data-theme="dark"] .ceremony-box { background: linear-gradient(135deg, #12141c 0%, #1a1c27 100%) !important; border-color: #c9a84c !important; }',
      '[data-theme="dark"] .ceremony-title { color: #c9a84c !important; }',
      /* Timeline */
      '[data-theme="dark"] .timeline-item::before { border-color: #08090f !important; }',
      '[data-theme="dark"] .timeline-text { color: #a3abc2 !important; }',
      /* Footer */
      '[data-theme="dark"] .footer { border-color: #c9a84c !important; color: #6a718d !important; }',
      '[data-theme="dark"] .footer-line { color: #6a718d !important; }',
      /* Masthead status */
      '[data-theme="dark"] .masthead-status { color: #3ecf8e !important; background: rgba(62, 207, 142, 0.08) !important; border-color: rgba(62, 207, 142, 0.2) !important; }',
      /* Block cards (for schematic-style pages) */
      '[data-theme="dark"] .block { background: #12141c !important; border-color: #2a2d3e !important; }',
      '[data-theme="dark"] .block.critical { background: #1a1018 !important; }',
      '[data-theme="dark"] .block.execution { background: #0f1a14 !important; }',
      '[data-theme="dark"] .block.recovery { background: #10101f !important; }',
      '[data-theme="dark"] .block.shutdown { background: #111114 !important; }',
      '[data-theme="dark"] .block-title { color: #f0f2f8 !important; }',
      '[data-theme="dark"] .block-desc { color: #a3abc2 !important; }',
      '[data-theme="dark"] .block-time { color: #c9a84c !important; }',
      '[data-theme="dark"] .block-scroll-ref { background: rgba(201, 168, 76, 0.1) !important; border-color: rgba(201, 168, 76, 0.3) !important; color: #c9a84c !important; }',
      /* Anchor cards */
      '[data-theme="dark"] .anchor { background: #1a1c27 !important; }',
      '[data-theme="dark"] .anchor-label { color: #c9a84c !important; }',
      '[data-theme="dark"] .anchor-text { color: #f0f2f8 !important; }',
      /* Thread */
      '[data-theme="dark"] .thread { background: #12141c !important; border-color: #c9a84c !important; }',
      '[data-theme="dark"] .thread-title { color: #c9a84c !important; }',
      '[data-theme="dark"] .thread-row { border-color: #2a2d3e !important; }',
      '[data-theme="dark"] .thread-outcome { color: #a3abc2 !important; }',
      /* Dump CTA */
      '[data-theme="dark"] .dump-cta { background: linear-gradient(135deg, #12141c, #1a1c27) !important; border-color: #c9a84c !important; }',
      '[data-theme="dark"] .dump-cta-title { color: #c9a84c !important; }',
      '[data-theme="dark"] .dump-cta-desc { color: #6a718d !important; }',
      /* Reference page specifics */
      '[data-theme="dark"] .card-header { background-color: #1a1c27 !important; color: #c9a84c !important; }',
      '[data-theme="dark"] .card-body { background-color: #12141c !important; }',
      '[data-theme="dark"] .item-title { color: #f0f2f8 !important; }',
      '[data-theme="dark"] .item-desc { color: #a3abc2 !important; }',
      '[data-theme="dark"] .btn { background-color: #1a1c27 !important; color: #c9a84c !important; border-color: #2a2d3e !important; }',
      '[data-theme="dark"] .btn:hover { background-color: #222533 !important; }',
    ].join('\n');
    document.head.appendChild(style);
  }

  // Re-check every 60 seconds in case the user toggled in the main app
  setInterval(function() {
    var newResolved = localStorage.getItem('theme-resolved');
    if (newResolved && newResolved !== document.documentElement.getAttribute('data-theme')) {
      location.reload();
    }
  }, 60000);
})();
