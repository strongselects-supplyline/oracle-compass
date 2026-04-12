// app/oracle/page.tsx
// DEPRECATED — Oracle decree is now embedded in the Execute (/kill) page as a
// collapsible header. The Oracle engine still runs in the background via OracleTrigger.
// This redirect ensures existing deep links and nav history don't 404.

import { redirect } from "next/navigation";

export default function OraclePageRedirect() {
  redirect("/kill");
}
