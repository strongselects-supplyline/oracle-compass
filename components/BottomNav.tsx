"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { getDayType, isBizDay } from "@/lib/dayType";
import { getStoreValue, getTodayISO } from "@/lib/db";
import type { OracleDecree } from "@/lib/oracle";

export default function BottomNav() {
    const pathname = usePathname();
    const [bizDay, setBizDay] = useState(false);
    const [oracleSeverity, setOracleSeverity] = useState<string | null>(null);

    useEffect(() => {
        setBizDay(isBizDay(getDayType()));
        // Show dot on Oracle tab if there's a RED/AMBER decree today
        getStoreValue<OracleDecree>(`oracle_decree:${getTodayISO()}`).then(d => {
            if (d?.severity === "RED" || d?.severity === "AMBER") {
                setOracleSeverity(d.severity);
            }
        });
    }, []);

    const navs = [
        { name: "Grind",  path: "/grind",  icon: "⚔️" },
        { name: "Studio", path: "/studio", icon: "🎙️" },
        { name: "Engine", path: "/engine", icon: "⚙️" },
        { name: "Brain",  path: "/brain",  icon: "🧠" },
        { name: "Oracle", path: "/oracle", icon: "🔮" },
    ];

    return (
        <nav className="bottom-nav">
            {navs.map((n) => {
                const active = pathname === n.path;
                const dotColor =
                    n.name === "Engine" && bizDay ? "bg-amber-500" :
                    n.name === "Oracle" && oracleSeverity === "RED" ? "bg-red-500" :
                    n.name === "Oracle" && oracleSeverity === "AMBER" ? "bg-amber-500" : null;

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
