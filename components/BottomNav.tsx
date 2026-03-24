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
        // Show dot on Oracle tab if there's a RED/AMBER decree today
        getStoreValue<OracleDecree>(`oracle_decree:${getTodayISO()}`).then(d => {
            if (d?.severity === "RED" || d?.severity === "AMBER") {
                setOracleSeverity(d.severity);
            }
        });
        // Show dot on Label tab if there are unreviewed items in Copy Vault
        getStoreValue<number>("label_vault_unreviewed").then(n => {
            setUnreviewedCopy(n ? n > 0 : false);
        });
        // Show amber dot on Plan tab if it's Sunday and checklist is incomplete
        if (new Date().getDay() === 0) {
            getSundayChecklist(getWeekKey()).then(c => {
                setPlannerDot(!isSundayChecklistComplete(c));
            });
        }
        // Kill list badge — RED tasks remaining
        getKillStats().then(s => {
            setKillRed(s.redRemaining > 0);
            setKillCount(s.total - s.cleared);
        });
    }, []);

    // Flywheel order: SEE → INPUT → THINK → PLAN → CREATE → HUSTLE → SHIP
    const navs = [
        { name: "Home", path: "/", icon: "🏠" },
        { name: "Kill", path: "/kill", icon: "🎯" },
        { name: "Log", path: "/log", icon: "⚡" },
        { name: "Oracle", path: "/oracle", icon: "🔮" },
        { name: "Plan", path: "/planner", icon: "📋" },
        { name: "Studio", path: "/studio", icon: "🎙️" },
        { name: "Engine", path: "/engine", icon: "⚙️" },
        { name: "Label", path: "/label", icon: "🏷️" },
        { name: "Brain", path: "/brain", icon: "🧠" },
    ];

    return (
        <nav className="bottom-nav">
            {navs.map((n) => {
                const active = pathname === n.path;
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
