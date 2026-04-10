"use client";

// components/BrainDumpInput.tsx
// Cognitive Dump — floating brain dump intake module.
// Floating trigger → fullscreen modal → sends to /api/brain-dump → shows parsed results.
// Follows existing Oracle Compass design tokens from globals.css.

import { useState, useRef, useEffect, useCallback } from "react";
import { setStoreValue, getStoreValue, getTodayISO } from "@/lib/db";

// ── Types ────────────────────────────────────────────────
type BudgetStatus = {
  detected_state: "nominal" | "elevated" | "redlining" | "recovery";
  confidence: number;
  signals: string[];
  recommended_action: string;
};

type ExtractedTask = {
  title: string;
  priority: "high" | "medium" | "low";
  pillar: "creative" | "business" | "body" | "ops";
  context: string;
};

type ProtocolUpdate = {
  target_system: string;
  modification: string;
  reason: string;
};

type DumpResult = {
  body_budget_status: BudgetStatus;
  extracted_tasks: ExtractedTask[];
  protocol_updates: ProtocolUpdate[];
  raw_log_summary: string;
};

type DumpLogEntry = {
  timestamp: string;
  raw_text: string;
  result: DumpResult;
};

// ── State indicator colors ────────────────────────────────
const STATE_COLORS: Record<string, string> = {
  nominal: "var(--green)",
  elevated: "var(--amber)",
  redlining: "var(--red)",
  recovery: "#818cf8", // indigo — matches Brain page metacognition accent
};

const PRIORITY_COLORS: Record<string, string> = {
  high: "var(--red)",
  medium: "var(--amber)",
  low: "var(--green)",
};

export default function BrainDumpInput() {
  const [isOpen, setIsOpen] = useState(false);
  const [dumpText, setDumpText] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<DumpResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [tasksSaved, setTasksSaved] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-focus textarea when modal opens
  useEffect(() => {
    if (isOpen && textareaRef.current) {
      setTimeout(() => textareaRef.current?.focus(), 100);
    }
  }, [isOpen]);

  // Escape key to close
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (result) {
          handleClose();
        } else if (!isProcessing) {
          setIsOpen(false);
        }
      }
    };
    if (isOpen) window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [isOpen, result, isProcessing]);

  const handleSubmit = useCallback(async () => {
    if (!dumpText.trim() || isProcessing) return;
    setIsProcessing(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch("/api/brain-dump", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ dumpText: dumpText.trim() }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({ error: "Unknown error" }));
        throw new Error(errData.error || `HTTP ${res.status}`);
      }

      const data: DumpResult = await res.json();
      setResult(data);

      // Archive the dump
      const today = getTodayISO();
      const archiveKey = `brain_dump_archive:${today}`;
      const existing = (await getStoreValue<DumpLogEntry[]>(archiveKey)) || [];
      existing.push({
        timestamp: new Date().toISOString(),
        raw_text: dumpText.trim(),
        result: data,
      });
      await setStoreValue(archiveKey, existing);
    } catch (err) {
      setError(String(err instanceof Error ? err.message : err));
    } finally {
      setIsProcessing(false);
    }
  }, [dumpText, isProcessing]);

  const handleSaveTasksToKillList = useCallback(async () => {
    if (!result || tasksSaved) return;

    // Save extracted tasks as Oracle flags so they appear in the Kill List
    const today = getTodayISO();
    const flagsKey = `oracle_flags:${today}`;
    const existing = (await getStoreValue<any[]>(flagsKey)) || [];

    for (const task of result.extracted_tasks) {
      existing.push({
        action: task.title,
        reason: `[Brain Dump] ${task.context}`,
        urgency: task.priority === "high" ? "RED" : task.priority === "medium" ? "AMBER" : "GREEN",
      });
    }

    await setStoreValue(flagsKey, existing);
    setTasksSaved(true);
  }, [result, tasksSaved]);

  const handleClose = useCallback(() => {
    setIsOpen(false);
    setDumpText("");
    setResult(null);
    setError(null);
    setTasksSaved(false);
  }, []);

  // ── Floating Trigger ────────────────────────────────────
  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        aria-label="Open Cognitive Dump"
        style={{
          position: "fixed",
          bottom: "calc(var(--nav-height) + max(env(safe-area-inset-bottom, 16px), 16px) + 12px)",
          right: "16px",
          width: "52px",
          height: "52px",
          borderRadius: "16px",
          background: "linear-gradient(135deg, var(--surface-2) 0%, var(--surface-3) 100%)",
          border: "1px solid var(--border-2)",
          color: "var(--text-secondary)",
          fontSize: "22px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          zIndex: 40,
          transition: "transform 0.1s, box-shadow 0.2s",
          boxShadow: "0 4px 16px rgba(0,0,0,0.3)",
        }}
        onMouseDown={(e) => ((e.target as HTMLElement).style.transform = "scale(0.92)")}
        onMouseUp={(e) => ((e.target as HTMLElement).style.transform = "scale(1)")}
        onMouseLeave={(e) => ((e.target as HTMLElement).style.transform = "scale(1)")}
      >
        🧠
      </button>
    );
  }

  // ── Fullscreen Modal ────────────────────────────────────
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "var(--bg)",
        zIndex: 100,
        display: "flex",
        flexDirection: "column",
        animation: "fade-in 0.2s ease",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "max(env(safe-area-inset-top, 12px), 12px) 20px 12px",
          borderBottom: "1px solid var(--border)",
        }}
      >
        <div>
          <div
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "10px",
              fontWeight: 800,
              letterSpacing: "0.12em",
              color: "var(--text-muted)",
              textTransform: "uppercase",
              marginBottom: "2px",
            }}
          >
            COGNITIVE DUMP
          </div>
          <div
            style={{
              fontSize: "16px",
              fontWeight: 700,
              color: "var(--text-primary)",
            }}
          >
            {result ? "Parsed Results" : "Drop the chaos"}
          </div>
        </div>

        <button
          onClick={result ? handleClose : () => setIsOpen(false)}
          style={{
            background: "var(--surface-2)",
            border: "1px solid var(--border-2)",
            borderRadius: "10px",
            color: "var(--text-secondary)",
            padding: "8px 14px",
            fontSize: "12px",
            fontWeight: 700,
            cursor: "pointer",
            minHeight: "44px",
          }}
        >
          {result ? "DONE" : "CANCEL"}
        </button>
      </div>

      {/* Content */}
      <div
        style={{
          flex: 1,
          overflow: "auto",
          padding: "20px",
        }}
      >
        {!result ? (
          /* ── Input Mode ── */
          <div style={{ maxWidth: "480px", margin: "0 auto" }}>
            <textarea
              ref={textareaRef}
              value={dumpText}
              onChange={(e) => setDumpText(e.target.value)}
              placeholder="What's on your mind? Stream of consciousness. No structure needed. The system will parse it..."
              disabled={isProcessing}
              style={{
                width: "100%",
                minHeight: "240px",
                background: "var(--surface)",
                border: "1px solid var(--border-2)",
                borderRadius: "14px",
                color: "var(--text-primary)",
                fontSize: "16px",
                lineHeight: "1.6",
                padding: "16px",
                outline: "none",
                resize: "vertical",
                fontFamily: "inherit",
                WebkitFontSmoothing: "antialiased",
              }}
              onFocus={(e) => (e.target.style.borderColor = "var(--accent)")}
              onBlur={(e) => (e.target.style.borderColor = "var(--border-2)")}
            />

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginTop: "12px",
              }}
            >
              <span
                style={{
                  fontSize: "12px",
                  color: "var(--text-muted)",
                  fontFamily: "var(--font-mono)",
                }}
              >
                {dumpText.length}/4000
              </span>

              <button
                onClick={handleSubmit}
                disabled={!dumpText.trim() || isProcessing}
                className="agent-btn agent-btn-primary"
                style={{ minWidth: "140px" }}
              >
                {isProcessing ? (
                  <>
                    <span className="spinner" /> PARSING
                  </>
                ) : (
                  "PROCESS DUMP"
                )}
              </button>
            </div>

            {error && (
              <div
                className="alert-banner alert-banner-red"
                style={{ marginTop: "16px" }}
              >
                ⚠ {error}
              </div>
            )}
          </div>
        ) : (
          /* ── Results Mode ── */
          <div style={{ maxWidth: "480px", margin: "0 auto" }}>
            {/* Body Budget Status */}
            <div className="card" style={{ marginBottom: "16px" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  marginBottom: "12px",
                }}
              >
                <div
                  style={{
                    width: "10px",
                    height: "10px",
                    borderRadius: "50%",
                    background: STATE_COLORS[result.body_budget_status.detected_state] || "var(--text-muted)",
                    boxShadow: `0 0 8px ${STATE_COLORS[result.body_budget_status.detected_state] || "transparent"}`,
                  }}
                />
                <span
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "11px",
                    fontWeight: 800,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    color: STATE_COLORS[result.body_budget_status.detected_state] || "var(--text-muted)",
                  }}
                >
                  BODY BUDGET: {result.body_budget_status.detected_state}
                </span>
              </div>

              <p
                style={{
                  fontSize: "14px",
                  color: "var(--text-secondary)",
                  lineHeight: "1.5",
                  margin: 0,
                }}
              >
                {result.body_budget_status.recommended_action}
              </p>

              {result.body_budget_status.signals.length > 0 && (
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "6px",
                    marginTop: "10px",
                  }}
                >
                  {result.body_budget_status.signals.map((s, i) => (
                    <span
                      key={i}
                      className="badge badge-muted"
                      style={{ fontSize: "9px" }}
                    >
                      {s}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Summary */}
            <div
              className="card"
              style={{
                marginBottom: "16px",
                borderLeft: `3px solid var(--accent)`,
              }}
            >
              <div
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "10px",
                  fontWeight: 800,
                  letterSpacing: "0.1em",
                  color: "var(--text-muted)",
                  textTransform: "uppercase",
                  marginBottom: "6px",
                }}
              >
                SYSTEM READ
              </div>
              <p
                style={{
                  fontSize: "15px",
                  color: "var(--text-primary)",
                  lineHeight: "1.6",
                  margin: 0,
                  fontStyle: "italic",
                }}
              >
                {result.raw_log_summary}
              </p>
            </div>

            {/* Extracted Tasks */}
            {result.extracted_tasks.length > 0 && (
              <div className="card" style={{ marginBottom: "16px" }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "12px",
                  }}
                >
                  <span
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: "10px",
                      fontWeight: 800,
                      letterSpacing: "0.1em",
                      color: "var(--text-muted)",
                      textTransform: "uppercase",
                    }}
                  >
                    EXTRACTED TASKS ({result.extracted_tasks.length})
                  </span>

                  <button
                    onClick={handleSaveTasksToKillList}
                    disabled={tasksSaved}
                    className="agent-btn"
                    style={{
                      background: tasksSaved
                        ? "rgba(34,197,94,0.12)"
                        : "var(--surface-2)",
                      color: tasksSaved ? "var(--green)" : "var(--text-secondary)",
                      border: `1px solid ${tasksSaved ? "rgba(34,197,94,0.25)" : "var(--border-2)"}`,
                      padding: "6px 12px",
                      fontSize: "10px",
                      minHeight: "36px",
                    }}
                  >
                    {tasksSaved ? "✓ SAVED" : "→ KILL LIST"}
                  </button>
                </div>

                {result.extracted_tasks.map((task, i) => (
                  <div
                    key={i}
                    style={{
                      padding: "12px 0",
                      borderBottom:
                        i < result.extracted_tasks.length - 1
                          ? "1px solid var(--border)"
                          : "none",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        marginBottom: "4px",
                      }}
                    >
                      <span
                        className="badge"
                        style={{
                          background: `${PRIORITY_COLORS[task.priority]}15`,
                          color: PRIORITY_COLORS[task.priority],
                          border: `1px solid ${PRIORITY_COLORS[task.priority]}40`,
                          fontSize: "8px",
                        }}
                      >
                        {task.priority.toUpperCase()}
                      </span>
                      <span
                        className="badge badge-muted"
                        style={{ fontSize: "8px" }}
                      >
                        {task.pillar}
                      </span>
                    </div>
                    <div
                      style={{
                        fontSize: "14px",
                        fontWeight: 600,
                        color: "var(--text-primary)",
                        marginBottom: "3px",
                      }}
                    >
                      {task.title}
                    </div>
                    <div
                      style={{
                        fontSize: "12px",
                        color: "var(--text-muted)",
                      }}
                    >
                      {task.context}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Protocol Updates */}
            {result.protocol_updates.length > 0 && (
              <div className="card" style={{ marginBottom: "16px" }}>
                <div
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "10px",
                    fontWeight: 800,
                    letterSpacing: "0.1em",
                    color: "var(--text-muted)",
                    textTransform: "uppercase",
                    marginBottom: "12px",
                  }}
                >
                  PROTOCOL UPDATES ({result.protocol_updates.length})
                </div>

                {result.protocol_updates.map((update, i) => (
                  <div
                    key={i}
                    style={{
                      padding: "10px 0",
                      borderBottom:
                        i < result.protocol_updates.length - 1
                          ? "1px solid var(--border)"
                          : "none",
                    }}
                  >
                    <div
                      style={{
                        fontSize: "11px",
                        fontWeight: 700,
                        color: "var(--accent)",
                        textTransform: "uppercase",
                        letterSpacing: "0.05em",
                        marginBottom: "4px",
                      }}
                    >
                      {update.target_system}
                    </div>
                    <div
                      style={{
                        fontSize: "14px",
                        color: "var(--text-primary)",
                        marginBottom: "2px",
                      }}
                    >
                      {update.modification}
                    </div>
                    <div
                      style={{
                        fontSize: "12px",
                        color: "var(--text-muted)",
                      }}
                    >
                      {update.reason}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Dump another */}
            <button
              onClick={() => {
                setResult(null);
                setDumpText("");
                setError(null);
                setTasksSaved(false);
              }}
              className="agent-btn agent-btn-ghost"
              style={{ width: "100%", marginTop: "8px" }}
            >
              DUMP AGAIN
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
