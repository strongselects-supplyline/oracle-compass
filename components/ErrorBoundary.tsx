"use client";

import React from "react";

type Props = { children: React.ReactNode };
type State = { hasError: boolean; error: string };

export default class ErrorBoundary extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { hasError: false, error: "" };
    }

    static getDerivedStateFromError(error: Error) {
        return { hasError: true, error: error.message || "Something broke" };
    }

    componentDidCatch(error: Error, info: React.ErrorInfo) {
        console.error("ErrorBoundary caught:", error, info);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div style={{
                    padding: "40px 24px",
                    textAlign: "center",
                    background: "#080808",
                    minHeight: "100dvh",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    fontFamily: "-apple-system, sans-serif",
                    color: "#f0f0f0"
                }}>
                    <div style={{ fontSize: 48, marginBottom: 16 }}>⚠️</div>
                    <h2 style={{ fontSize: 20, fontWeight: 900, marginBottom: 8 }}>Something broke.</h2>
                    <p style={{ fontSize: 13, color: "#777", marginBottom: 24, maxWidth: 320 }}>
                        {this.state.error}
                    </p>
                    <button
                        onClick={() => {
                            this.setState({ hasError: false, error: "" });
                            window.location.reload();
                        }}
                        style={{
                            background: "#d4a853",
                            color: "#000",
                            border: "none",
                            padding: "14px 28px",
                            borderRadius: 14,
                            fontSize: 12,
                            fontWeight: 800,
                            letterSpacing: "0.1em",
                            textTransform: "uppercase" as const,
                            cursor: "pointer"
                        }}
                    >
                        Reload App
                    </button>
                </div>
            );
        }
        return this.props.children;
    }
}
