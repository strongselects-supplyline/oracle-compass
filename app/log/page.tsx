// app/log/page.tsx
// DEPRECATED — Quick Log has been merged into the Today (/) and Execute (/kill) pages.
// Studio session logging lives on /studio.
// Oracle recalibration lives on /kill.
// This redirect ensures deep links don't 404.

import { redirect } from "next/navigation";

export default function LogPageRedirect() {
  redirect("/");
}
