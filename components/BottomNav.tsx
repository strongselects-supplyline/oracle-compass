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
    const [bizDay, setBizDay] = useState(false);
    const [oracleSeverity, setOracleSeverity] = useState<string | null>(null);
    const [unreviewedCopy, setUnreviewedCopy] = useState(false);
    const [plannerDot, setPlannerDot] = useState(false);
    const [killRed, setKillRed] = useState(false);
    const [killCount, setKillCount] = useState(0);

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
    }, []);

    // 10 tabs — SONIC merged into Studio page (accessible at /sonic via link in Studio)
    const navs = [
        { name: "Home",   path: "/",         icon: "\uD83C\uDFE0" },
        { name: "Kill",   path: "/kill",     icon: "\uD83C\uDFAF" },
        { name: "Log",    path: "/log",      icon: "\u26A1" },
        { name: "Grind",  path: "/grind",    icon: "\uD83D\uDCAA" },
        { name: "Oracle", path: "/oracle",   icon: "\uD83D\uDD2E" },
        { name: "Plan",   path: "/planner",  icon: "\uD83D\uDCCB" },
        { name: "Studio", path: "/studio",   icon: "\uD83C\uDFA4" },
        { name: "Engine", path: "/engine",   icon: "\u2699\uFE0F" },
        { name: "Label",  path: "/label",    icon: "\uD83C\uDFF7\uFE0F" },
        { name: "Brain",  path: "/brain",    icon: "\uD83E\uDDE0" },
    ];

    return (
        <nav className="bottom-nav">
            {navs.map((n) => {
                const active = pathname === n.path || (n.name === "Studio" && pathname === "/sonic");
                const dotColor =
                    n.name === "Plan" && plannerDot ? "bg-amber-500" :
                        n.name === "Engine" && bizDay ? "bg-amber-500" :
                            n.name === "Oracle" && oracleSeverity === "RED" ? "bg-red-500" :
                                n.name === "Oracle" && oracleSeverity === "AMBER" ? "bg-amber-500" :
                                    n.name === "Kill" && killRed ? "bg-red-500" :
                                        n.name === "Kill" && killCount > 0 ? "bg-amber-500" :
                                            n.name === "Label" && unreviewedCopy ? "bg-amber-500" : null;

                return (
                    <Link key={n.name} href={n.path} className={`nav-item ${active ? "active" : ""}`}>
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
        </nav>
    );
}
