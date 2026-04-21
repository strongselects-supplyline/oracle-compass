"use client";

import { useState } from "react";
import { useTheme } from "@/components/ThemeProvider";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 28 }}>
      <p
        style={{
          fontSize: 10,
          fontWeight: 900,
          letterSpacing: "0.2em",
          textTransform: "uppercase",
          color: "var(--text-muted)",
          marginBottom: 12,
          paddingLeft: 4,
        }}
      >
        {title}
      </p>
      <div className="card" style={{ padding: 0, overflow: "hidden" }}>
        {children}
      </div>
    </div>
  );
}

function SettingRow({
  label,
  sub,
  action,
  cta,
  ctaStyle,
  id,
}: {
  label: string;
  sub?: string;
  action: () => void;
  cta: string;
  ctaStyle?: React.CSSProperties;
  id: string;
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "16px 20px",
        borderBottom: "1px solid var(--border)",
        gap: 12,
      }}
    >
      <div>
        <p style={{ fontSize: 14, fontWeight: 700, color: "var(--text-primary)", marginBottom: sub ? 2 : 0 }}>
          {label}
        </p>
        {sub && (
          <p style={{ fontSize: 11, color: "var(--text-muted)", lineHeight: 1.4 }}>{sub}</p>
        )}
      </div>
      <button
        id={id}
        onClick={action}
        style={{
          padding: "8px 14px",
          borderRadius: 8,
          fontSize: 11,
          fontWeight: 900,
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          border: "1px solid var(--border-2)",
          background: "var(--surface-2)",
          color: "var(--text-secondary)",
          cursor: "pointer",
          flexShrink: 0,
          transition: "all 0.15s",
          ...ctaStyle,
        }}
      >
        {cta}
      </button>
    </div>
  );
}

export default function SettingsPage() {
  const { mode, resolved, cycle } = useTheme();
  const [exportStatus, setExportStatus] = useState<"idle" | "working" | "done">("idle");
  const [wipeStatus, setWipeStatus] = useState<"idle" | "confirm" | "done">("idle");
  const [toastMsg, setToastMsg] = useState("");

  const toast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(""), 2500);
  };

  const themeLabel = mode === "auto"
    ? `Auto (${resolved === "light" ? "☀️ Light" : "🌙 Dark"} now)`
    : mode === "light" ? "☀️ Light" : "🌙 Dark";

  const handleExport = async () => {
    setExportStatus("working");
    try {
      // Gather all IndexedDB data
      const keys: string[] = [];
      const data: Record<string, unknown> = {};
      const request = indexedDB.open("OracleCompassDB", 1);
      await new Promise<void>((resolve, reject) => {
        request.onsuccess = () => {
          const db = request.result;
          const tx = db.transaction("compass_store", "readonly");
          const store = tx.objectStore("compass_store");
          const cursorReq = store.openCursor();
          cursorReq.onsuccess = (e) => {
            const cursor = (e.target as IDBRequest).result as IDBCursorWithValue;
            if (cursor) {
              data[cursor.key as string] = cursor.value;
              cursor.continue();
            } else {
              resolve();
            }
          };
          cursorReq.onerror = () => reject(cursorReq.error);
        };
        request.onerror = () => reject(request.error);
      });

      const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `oracle-compass-export-${new Date().toISOString().split("T")[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
      setExportStatus("done");
      toast("Data exported");
      setTimeout(() => setExportStatus("idle"), 3000);
    } catch (e) {
      setExportStatus("idle");
      toast("Export failed — check console");
    }
  };

  const handleWipe = async () => {
    if (wipeStatus === "idle") {
      setWipeStatus("confirm");
      return;
    }
    if (wipeStatus === "confirm") {
      try {
        await new Promise<void>((resolve, reject) => {
          const req = indexedDB.deleteDatabase("OracleCompassDB");
          req.onsuccess = () => resolve();
          req.onerror = () => reject(req.error);
        });
        localStorage.clear();
        setWipeStatus("done");
        toast("Cache wiped. Reload to reinitialize.");
      } catch {
        setWipeStatus("idle");
        toast("Wipe failed");
      }
    }
  };

  return (
    <div className="page animate-fade-in pb-28">
      <div className="page-inner">

        {/* Header */}
        <div style={{ marginBottom: 32, paddingBottom: 20, borderBottom: "1px solid var(--border)" }}>
          <p
            style={{
              fontSize: 10,
              fontWeight: 900,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "var(--text-muted)",
              marginBottom: 6,
            }}
          >
            Oracle Compass
          </p>
          <h1
            style={{
              fontSize: "clamp(1.4rem, 5vw, 1.9rem)",
              fontWeight: 700,
              color: "var(--text-primary)",
              letterSpacing: "-0.015em",
              margin: 0,
            }}
          >
            ⚙️ Settings
          </h1>
        </div>

        {/* Toast */}
        {toastMsg && (
          <div
            role="status"
            aria-live="polite"
            style={{
              position: "fixed",
              top: 20,
              left: "50%",
              transform: "translateX(-50%)",
              background: "var(--surface-3)",
              border: "1px solid var(--border-2)",
              borderRadius: 10,
              padding: "10px 18px",
              fontSize: 12,
              fontWeight: 800,
              color: "var(--text-primary)",
              zIndex: 100,
              whiteSpace: "nowrap",
              boxShadow: "0 4px 24px rgba(0,0,0,0.3)",
            }}
          >
            {toastMsg}
          </div>
        )}

        {/* Appearance */}
        <Section title="Appearance">
          <SettingRow
            id="settings-theme-toggle"
            label="Theme"
            sub={`Current: ${themeLabel}. Cycles Auto → Light → Dark.`}
            action={() => { cycle(); toast(`Theme: ${mode === "auto" ? "Light" : mode === "light" ? "Dark" : "Auto"}`); }}
            cta={mode === "auto" ? "Auto" : mode === "light" ? "Light ☀️" : "Dark 🌙"}
            ctaStyle={{ borderColor: "var(--accent)", color: "var(--accent)", background: "rgba(212,168,83,0.08)" }}
          />
        </Section>

        {/* Data */}
        <Section title="Data">
          <SettingRow
            id="settings-export-data"
            label="Export data"
            sub="Downloads all IndexedDB + localStorage as JSON."
            action={handleExport}
            cta={exportStatus === "working" ? "Exporting…" : exportStatus === "done" ? "Done ✓" : "Export"}
          />
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "16px 20px",
              gap: 12,
            }}
          >
            <div>
              <p style={{ fontSize: 14, fontWeight: 700, color: wipeStatus === "confirm" ? "var(--red)" : "var(--text-primary)" }}>
                {wipeStatus === "confirm" ? "⚠️ Are you sure?" : "Wipe cache"}
              </p>
              <p style={{ fontSize: 11, color: "var(--text-muted)", lineHeight: 1.4 }}>
                {wipeStatus === "confirm"
                  ? "This deletes ALL local data. Cannot be undone."
                  : "Delete all local data. Export first if needed."}
              </p>
            </div>
            <button
              id="settings-wipe-cache"
              onClick={handleWipe}
              style={{
                padding: "8px 14px",
                borderRadius: 8,
                fontSize: 11,
                fontWeight: 900,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                border: `1px solid ${wipeStatus === "confirm" ? "rgba(248,113,113,0.5)" : "var(--border-2)"}`,
                background: wipeStatus === "confirm" ? "rgba(248,113,113,0.1)" : "var(--surface-2)",
                color: wipeStatus === "confirm" ? "var(--red)" : "var(--text-secondary)",
                cursor: "pointer",
                flexShrink: 0,
                transition: "all 0.15s",
              }}
            >
              {wipeStatus === "done" ? "Wiped" : wipeStatus === "confirm" ? "Confirm Wipe" : "Wipe"}
            </button>
          </div>
        </Section>

        {/* Time Zone */}
        <Section title="System">
          <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--border)" }}>
            <p style={{ fontSize: 14, fontWeight: 700, color: "var(--text-primary)", marginBottom: 4 }}>Time Zone</p>
            <p style={{ fontSize: 13, color: "var(--text-muted)", fontFamily: "var(--font-geist-mono, monospace)" }}>
              {Intl.DateTimeFormat().resolvedOptions().timeZone}
            </p>
            <p style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 6 }}>
              System time zone — automatic. No override needed.
            </p>
          </div>
          <div style={{ padding: "16px 20px" }}>
            <p style={{ fontSize: 14, fontWeight: 700, color: "var(--text-primary)", marginBottom: 4 }}>
              Notifications
            </p>
            <p style={{ fontSize: 11, color: "var(--text-muted)" }}>
              Push notification preferences — coming in the CREAM phase.
            </p>
          </div>
        </Section>

        {/* About */}
        <div style={{ textAlign: "center", paddingTop: 8 }}>
          <p style={{ fontSize: 10, color: "var(--text-muted)", fontWeight: 700, letterSpacing: "0.1em" }}>
            ORACLE COMPASS · Sovereign. Offline-capable. Yours.
          </p>
        </div>

      </div>
    </div>
  );
}
