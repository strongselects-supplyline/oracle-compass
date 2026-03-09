import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const { trackTitle, genre, mood, lyricsSnippet, notes } = await req.json();

        if (!trackTitle) {
            return NextResponse.json({ error: "trackTitle is required to start the pipeline." }, { status: 400 });
        }

        const host = process.env.VERCEL_URL ?\`https://\${process.env.VERCEL_URL}\` : "http://localhost:3000";

        // --- STEP 1: A&R AGENT (Sonic Positioning) ---
        console.log(\`[Pipeline] Triggering A&R Agent for \${trackTitle}...\`);
        const anrRes = await fetch(\`\${host}/api/label/anr\`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ trackTitle, genre, mood, notes }),
        });
        
        if (!anrRes.ok) throw new Error("A&R Agent failed.");
        const anrData = await anrRes.json();

        // --- STEP 2: CREATIVE AGENT (Video, Art, Merch) ---
        console.log(\`[Pipeline] Passing A&R Data to Creative Agent for \${trackTitle}...\`);
        // We inject the A&R sonic positioning as the "mood" for the Creative agent
        const combinedMood = \`\${mood || ''}. A&R Assessment: \${anrData.sonicPosition}\`;
        
        const creativeRes = await fetch(\`\${host}/api/label/creative\`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ 
                trackTitle, 
                mood: combinedMood, 
                lyricsSnippet 
            }),
        });

        if (!creativeRes.ok) throw new Error("Creative Agent failed.");
        const creativeData = await creativeRes.json();

        // --- STEP 3: GUARDIAN AGENT (Brand Voice Review) ---
        console.log(\`[Pipeline] Passing Creative output to Guardian Agent for \${trackTitle}...\`);
        // We only really need to Guardian check the video treatment acts and the merch description,
        // as the cover art prompts are for Midjourney, not public consumption.
        
        const treatmentText = \`Act 1: \${creativeData.videoTreatment.act1}
Act 2: \${creativeData.videoTreatment.act2}
Act 3: \${creativeData.videoTreatment.act3}\`;

        const merchText = \`\${creativeData.merchConcept.item}: \${creativeData.merchConcept.description}\`;

        const [treatmentGuardianRes, merchGuardianRes] = await Promise.all([
            fetch(\`\${host}/api/label/guardian\`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ inputContent: treatmentText, assetType: "Video Treatment" })
            }),
            fetch(\`\${host}/api/label/guardian\`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ inputContent: merchText, assetType: "Merch Concept" })
            })
        ]);

        if (!treatmentGuardianRes.ok || !merchGuardianRes.ok) throw new Error("Guardian Agent failed.");
        
        const treatmentGuardian = await treatmentGuardianRes.json();
        const merchGuardian = await merchGuardianRes.json();

        // --- FINAL PACKAGE COMPILATION ---
        const finalPackage = {
            trackTitle,
            timestamp: new Date().toISOString(),
            pipeline: {
                anr: {
                    status: "Completed",
                    data: anrData
                },
                creative: {
                    status: "Completed",
                    originalDraft: creativeData,
                },
                guardian: {
                    status: "Completed",
                    approvals: {
                        treatment: treatmentGuardian,
                        merch: merchGuardian
                    }
                }
            },
            // The Guardian agent returns 'content' with edits applied if it passed. 
            // If it rejected (score < 50), it returns the reason.
            finalAssets: {
                approvedTreatmentText: treatmentGuardian.approved ? treatmentGuardian.content : "(Rejected by Guardian) " + JSON.stringify(treatmentGuardian.hardRuleViolations),
                coverArtPrompts: creativeData.coverArtPrompts, // Unfiltered
                approvedMerchText: merchGuardian.approved ? merchGuardian.content : "(Rejected by Guardian) " + JSON.stringify(merchGuardian.hardRuleViolations),
            }
        };

        // Note: In a full SS-Tier implementation, you would write this 'finalPackage'
        // directly to your Supabase/PostgreSQL database here.

        return NextResponse.json(finalPackage);

    } catch (error) {
        console.error("Pipeline Orchestrator Error:", error);
        return NextResponse.json({ error: String(error) }, { status: 500 });
    }
}
