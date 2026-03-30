"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { getDayType, isBizDay } from "@/lib/dayType";
import { getStoreValue, getTodayISO } from "@/lib/db";
import type { OracleDecree } from "@/lib/oracle";
import { getSundayChecklist, isSundayChecklistComplete } from "@/lib/planner";
import { getWeekKey } from "@/lib/oracle";
import { getKillStats } from "@/lib/killList";

export default function BottomNav() {
    const pathname = usePathname();
    const [showMore, setShowMore] = useState(false);

    useEffect(() => {
        setBizDay(isBizDay(getDayType()));
        getStoreValue<OracleDecree>(`oracle_decree:${getTodayISO()}`).then(d => {
            if (d?.severity === "RED" || d?.severity === "AMBER") {
                setOracleSeverity(d.severity);
            }
        });
        getStoreValue<number>("label_vault_unreviewed").then(n => {
            setUnreviewedCopy(n ? n > 0 : false);
        });
        if (new Date().getDay() === 0) {
            getSundayChecklist(getWeekKey()).then(c => {
                setPlannerDot(!isSundayChecklistComplete(c));
            });
        }
        getKillStats().then(s => {
            setKillRed(s.redRemaining > 0);
            setKillCount(s.total - s.cleared);
        });
        
        // Close on escape
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === "Escape") setShowMore(false);
        };
        window.addEventListener("keydown", handleEsc);
        return () => window.removeEventListener("keydown", handleEsc);
    }, []);

    const primaryNavs = [
        { name: "Home",   path: "/",         icon: "\uD83C\uDFE0" },
        { name: "Log",    path: "/log",      icon: "\u26A1" },
        { name: "Kill",   path: "/kill",     icon: "\uD83C\uDFAF" },
        { name: "Oracle", path: "/oracle",   icon: "\uD83D\uDD2E" },
    ];

    const moreNavs = [
        { name: "Plan",   path: "/planner",  icon: "\uD83D\uDCCB" },
        { name: "Engine", path: "/engine",   icon: "⚙️" },
        { name: "Studio", path: "/studio",   icon: "\uD83C\uDFA4" },
        { name: "Flow",   path: "/velocity",  icon: "📈" },
        { name: "Label",  path: "/label",    icon: "🏷️" },
        { name: "CRM",    path: "/crm",      icon: "🤝" },
        { name: "Geo",    path: "/geo",      icon: "🗺️" },
        { name: "Grind",  path: "/grind",    icon: "\uD83D\uDCAA" },
        { name: "Brain",  path: "/brain",    icon: "🧠" },
    ];

    const allNavs = [...primaryNavs, ...moreNavs];
    const isMoreActive = moreNavs.some(n => pathname === n.path || (n.name === "Studio" && pathname === "/sonic"));

    const getDotColor = (name: string) => {
        return name === "Plan" && plannerDot ? "bg-amber-500" :
               name === "Engine" && bizDay ? "bg-amber-500" :
               name === "Oracle" && oracleSeverity === "RED" ? "bg-red-500" :
               name === "Oracle" && oracleSeverity === "AMBER" ? "bg-amber-500" :
               name === "Kill" && killRed ? "bg-red-500" :
               name === "Kill" && killCount > 0 ? "bg-amber-500" :
               name === "Label" && unreviewedCopy ? "bg-amber-500" : null;
    };

    const hasMoreAlert = moreNavs.some(n => !!getDotColor(n.name));

    return (
        <>
            {showMore && (
                <>
                    <div className="more-overlay" onClick={() => setShowMore(false)} />
                    <div className="more-menu">
                        {moreNavs.map(n => {
                            const active = pathname === n.path || (n.name === "Studio" && pathname === "/sonic");
                            const dotColor = getDotColor(n.name);
                            const isExternal = n.path === "/crm";

                            if (isExternal) {
                                return (
                                    <a 
                                        key={n.path} 
                                        href={n.path} 
                                        className={`more-item ${active ? "active" : ""}`}
                                        onClick={() => setShowMore(false)}
                                    >
                                        <span className="icon relative">
                                            {n.icon}
                                            {dotColor && <span className={`absolute -top-1 -right-2 w-2 h-2 ${dotColor} rounded-full border border-[#111]`} />}
                                        </span>
                                        <span>{n.name}</span>
                                    </a>
                                );
                            }

                            return (
                                <Link 
                                    key={n.path} 
                                    href={n.path} 
                                    className={`more-item ${active ? "active" : ""}`}
                                    onClick={() => setShowMore(false)}
                                >
                                    <span className="icon relative">
                                        {n.icon}
                                        {dotColor && <span className={`absolute -top-1 -right-2 w-2 h-2 ${dotColor} rounded-full border border-[#111]`} />}
                                    </span>
                                    <span>{n.name}</span>
                                </Link>
                            );
                        })}
                    </div>
                </>
            )}

            <nav className="bottom-nav">
                {primaryNavs.map((n) => {
                    const active = pathname === n.path;
                    const dotColor = getDotColor(n.name);

                    return (
                        <Link key={n.name} href={n.path} className={`nav-item ${active ? "active" : ""}`} style={{ flex: 1 }}>
                            <div className="text-2xl relative">
                                {n.icon}
                                {dotColor && (
                                    <span className={`absolute -top-1 -right-2 w-2.5 h-2.5 ${dotColor} rounded-full border border-[#0a0a0a]`} />
                                )}
                            </div>
                            <span>{n.name.toUpperCase()}</span>
                        </Link>
                    );
                })}

                <button 
                    onClick={() => setShowMore(!showMore)} 
                    className={`nav-item ${isMoreActive ? "active" : ""} ${showMore ? "opacity-50" : ""}`}
                    style={{ flex: 1, border: "none", background: "none" }}
                    aria-label="More menu"
                >
                    <div className="text-2xl relative">
                        {showMore ? "✕" : "•••"}
                        {hasMoreAlert && !showMore && (
                            <span className="absolute -top-1 -right-2 w-2.5 h-2.5 bg-amber-500 rounded-full border border-[#0a0a0a]" />
                        )}
                    </div>
                    <span>MORE</span>
                </button>
            </nav>
        </>
    );
}
}
