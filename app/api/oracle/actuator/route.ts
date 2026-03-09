// app/api/oracle/actuator/route.ts
// The Ghost Hands: Automatically executes Oracle decrees against the database.

import { NextRequest, NextResponse } from "next/server";
import { Realignment } from "@/lib/oracle";
import { setStoreValue } from "@/lib/db";
// Note: In a full production app, these would be robust DB update functions
// Instead of just relying on the local store for major system changes.

export async function POST(req: NextRequest) {
    // Basic Service-to-Service auth
    const authHeader = req.headers.get('authorization');
    if (authHeader !== \`Bearer \${process.env.CRON_SECRET}\` && process.env.NODE_ENV !== "development") {
        return NextResponse.json({ error: 'Unauthorized Actuator Access' }, { status: 401 });
    }

    try {
        const { realignments }: { realignments: Realignment[] } = await req.json();

        if (!realignments || !Array.isArray(realignments)) {
            return NextResponse.json({ error: "Invalid payload." }, { status: 400 });
        }

        const executedActions = [];

        for (const action of realignments) {
            console.log(\`[Actuator] Processing action type: \${action.type}\`);

            try {
                switch (action.type) {
                    case "shift_release":
                        // In reality, this would query the DB for the release, 
                        // add X days to the releaseDate, and save it back.
                        console.log(\`[Actuator] Executing shift_release: \${action.target} by \${action.days} days.\`);
                        // await shiftReleaseDate(action.target, action.days);
                        executedActions.push(action);
                        break;

                    case "update_cycle_status":
                        console.log(\`[Actuator] Executing update_cycle_status: \${action.track} to \${action.new_status}.\`);
                        // e.g. "RECONNECT" -> "cycle_reconnect"
                        const storageKey = \`cycle_\${action.track.toLowerCase().replace(/\\s+/g, "")}\`;
                        await setStoreValue(storageKey, action.new_status);
                        executedActions.push(action);
                        break;

                    case "set_focus_requirement":
                        console.log(\`[Actuator] Executing set_focus_requirement: \${action.hours} hours.\`);
                        await setStoreValue("oracle_focus_hours_override", action.hours);
                        executedActions.push(action);
                        break;

                    case "set_touch_target":
                        console.log(\`[Actuator] Executing set_touch_target: \${action.target}\`);
                        await setStoreValue("engine_touch_target", action.target);
                        executedActions.push(action);
                        break;

                    case "set_priority":
                        console.log(\`[Actuator] Executing set_priority: \${action.priority}\`);
                        await setStoreValue("oracle_priority", action.priority);
                        executedActions.push(action);
                        break;

                    case "flag_action":
                        // Just logs an urgent to-do item
                        console.log(\`[Actuator] Logging flag_action: \${action.action} (\${action.urgency})\`);
                        const currentFlags = await (async () => {
                          const val = await import('@/lib/db').then(m => m.getStoreValue<any[]>("oracle_active_flags"));
                          return val || [];
                        })();
                        await setStoreValue("oracle_active_flags", [...currentFlags, action]);
                        executedActions.push(action);
                        break;

                    case "no_change":
                        console.log(\`[Actuator] No changes required.\`);
                        break;

                    default:
                        console.warn(\`[Actuator] Unknown action type: \`, action);
                }
            } catch (err) {
                console.error(\`[Actuator] Failed to execute \${action.type}:\`, err);
                // Log failure but continue processing other actions
            }
        }

        // Lastly, log everything to the AI Audit Trail
        if (executedActions.length > 0) {
            const auditLog = {
                timestamp: new Date().toISOString(),
                actions: executedActions
            };
            
            const currentHistory = await (async () => {
                const val = await import('@/lib/db').then(m => m.getStoreValue<any[]>("oracle_action_history"));
                return val || [];
            })();
            
            await setStoreValue("oracle_action_history", [auditLog, ...currentHistory].slice(0, 50)); // Keep last 50
        }

        return NextResponse.json({
            success: true,
            executedCount: executedActions.length,
            actions: executedActions
        });

    } catch (error) {
        console.error("Actuator Error:", error);
        return NextResponse.json({ error: String(error) }, { status: 500 });
    }
}
