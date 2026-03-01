"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { getDayType, isBizDay } from "@/lib/dayType";

export default function BottomNav() {
    const pathname = usePathname();
    const [bizDay, setBizDay] = useState(false);

    useEffect(() => {
        setBizDay(isBizDay(getDayType()));
    }, []);

    const navs = [
        { name: "Grind", path: "/grind", icon: "⚔️" },
        { name: "Studio", path: "/studio", icon: "🎙️" },
        { name: "Engine", path: "/engine", icon: "⚙️" },
        { name: "Brain", path: "/brain", icon: "🧠" },
    ];

    return (
        <nav className="bottom-nav">
            {navs.map((n) => {
                const active = pathname === n.path;
                return (
                    <Link key={n.name} href={n.path} className={`nav-item ${active ? "active" : ""}`}>
                        <div className="text-2xl relative">
                            {n.icon}
                            {n.name === "Engine" && bizDay && (
                                <span className="absolute -top-1 -right-2 w-2.5 h-2.5 bg-amber-500 rounded-full border border-[#0a0a0a]"></span>
                            )}
                        </div>
                        <span>{n.name.toUpperCase()}</span>
                    </Link>
                )
            })}
        </nav>
    );
}
