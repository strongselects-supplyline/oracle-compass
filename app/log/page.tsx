// app/log/page.tsx
// DEPRECATED — redirects to Today (/).
//
// Division of labor:
//   /          → Daily logging (sovereignty stack, fuel, sleep, journal, LOCK IN)
//   /kill      → Execute page — kill list + oracle recalibration + session logging
//   /studio    → Studio session logging (hours, waterfall, quality ratings)
//   /analytics → Monthly S4A pull (Spotify for Artists catalog-level data)
//
// /log is kept as a redirect so any old deep links or PWA bookmarks don't 404.

import { redirect } from "next/navigation";

export default function LogPageRedirect() {
  redirect("/");
}
