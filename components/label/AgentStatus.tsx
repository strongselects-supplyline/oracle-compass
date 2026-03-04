"use client";

import { useEffect, useState } from "react";
import { getStoreValue, getAllWithPrefix } from "@/lib/db";
import type { PRCopy } from "./CopyVault";
import type { RolloutSchedule } from "./RolloutCalendar";

export default function AgentStatus({ trackTitle }: { trackTitle: string }) {
    const [status, setStatus] = useState({
        prRun: false,
        marketingRun: false,
        avgGuardianScore: 0,
        assetsGenerated: 0
    });

    useEffect(() => {
        const load = async () => {
            const rolloutKey = `label_rollout:${trackTitle}`;
            const rollout = await getStoreValue<RolloutSchedule>(rolloutKey);

            const copies = await getAllWithPrefix<PRCopy>(`label_pr:${trackTitle}:`);
            const copyArray = Object.values(copies);

            const avgScore = copyArray.length > 0
                ? Math.round(copyArray.reduce((acc, c) => acc + c.guardianScore, 0) / copyArray.length)
                : 0;

            setStatus({
                marketingRun: !!rollout,
                prRun: copyArray.length > 0,
                avgGuardianScore: avgScore,
                assetsGenerated: copyArray.length
            });
        };
        load();
    }, [trackTitle]);

    return (
        <div className="flex gap-4 mb-6 text-xs font-bold tracking-widest text-[#888] uppercase bg-[#0a0a0a] p-3 rounded">
            <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${status.marketingRun ? 'bg-green-500' : 'bg-[#333]'}`} />
                <span>Marketing: {status.marketingRun ? 'ON' : 'OFF'}</span>
            </div>
            <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${status.prRun ? 'bg-green-500' : 'bg-[#333]'}`} />
                <span>PR: {status.assetsGenerated} assets</span>
            </div>
            <div className="flex items-center gap-2 ml-auto">
                <span>Guard Score:</span>
                <span className={`px-2 py-0.5 rounded text-black ${status.avgGuardianScore >= 90 ? 'bg-green-500' :
                        status.avgGuardianScore >= 70 ? 'bg-amber-500' :
                            status.avgGuardianScore > 0 ? 'bg-red-500' : 'bg-[#333] text-white'
                    }`}>
                    {status.avgGuardianScore > 0 ? status.avgGuardianScore : '--'}
                </span>
            </div>
        </div>
    );
}
