"use client";

import { useState } from "react";
import Link from "next/link";
import StudioBoard from "@/components/release/StudioBoard";
import LabelBoard from "@/components/release/LabelBoard";

type View = "studio" | "label";

export default function ReleasePage() {
    const [view, setView] = useState<View>("studio");

    return (
        <main className="page animate-fade-in pb-20">
            <div className="page-inner">

                {/* Breadcrumb */}
                <div className="flex items-center gap-2 mb-6">
                  <Link href="/" className="text-[9px] font-black tracking-[0.2em] text-[#333] uppercase hover:text-[#555] transition-colors">WAR ROOM</Link>
                  <span className="text-[9px] text-[#222]">/</span>
                  <span className="text-[9px] font-black tracking-[0.2em] text-[#555] uppercase">RELEASE</span>
                </div>

                {/* Header */}
                <div className="text-center mb-6 animate-slide-up">
                  <h1 className="text-xl font-black tracking-widest uppercase">
                    {view === "studio" ? "🎤 The Studio" : "🏷️ Label OS"}
                  </h1>
                  <div className="text-[10px] font-black tracking-[0.2em] text-[#555] uppercase mt-1">
                    {view === "studio" ? "Waterfall · Cycle · Sessions" : "past.El noir Records"}
                  </div>
                </div>

                {/* Toggle Switch */}
                <div className="flex bg-[#111] border border-[#222] p-1 rounded-xl mb-8">
                    <button
                        onClick={() => setView("studio")}
                        className={`flex-1 py-2.5 text-[10px] font-black tracking-widest uppercase rounded-lg transition-all ${
                            view === "studio" ? "bg-[#222] text-white shadow" : "text-[#555] hover:text-[#888]"
                        }`}
                    >
                        Studio Board
                    </button>
                    <button
                        onClick={() => setView("label")}
                        className={`flex-1 py-2.5 text-[10px] font-black tracking-widest uppercase rounded-lg transition-all ${
                            view === "label" ? "bg-[#d4a853] text-black shadow-lg shadow-[#d4a853]/10" : "text-[#555] hover:text-[#888]"
                        }`}
                    >
                        Label Ops
                    </button>
                </div>

                {/* Content */}
                {view === "studio" ? <StudioBoard /> : <LabelBoard />}

            </div>
        </main>
    );
}
