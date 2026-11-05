import { useCallback, useEffect, useRef } from "react";
import type { GameMessage, GameMessageMap } from "./messages.ts";
import { useGameMessage } from "./MessageProvider.tsx"; // Pfad anpassen

type PayloadOf<T extends keyof GameMessageMap> = Extract<
    GameMessage,
    { type: T }
>["payload"];

export function useHostMessage<T extends keyof GameMessageMap>(
    type: T,
    initial: PayloadOf<T>,
    teams: Record<string, string[]> // teamname -> playernames
) {
    const initialRef = useRef(initial);
    const teamsRef = useRef(teams);

    useEffect(() => {
        teamsRef.current = teams;
    }, [teams]);

    // teamname -> zusammengeführter Payload
    const stateRef = useRef<Record<string, PayloadOf<T>>>({});

    useGameMessage(type, (message, from) => {
        // Team des Absenders finden
        const teamName = Object.keys(teamsRef.current).find((name) =>
            teamsRef.current[name].includes(from)
        );
        if (!teamName) return; // Spieler gehört zu keinem Team

        const next = {
            ...(stateRef.current[teamName] ?? initialRef.current),
        } as Record<string, unknown>;

        // Nur Felder übernehmen, die nicht null/undefined sind
        for (const [key, value] of Object.entries(
            message.payload as Record<string, unknown>
        )) {
            if (value !== null && value !== undefined) {
                next[key] = value;
            }
        }

        stateRef.current[teamName] = next as PayloadOf<T>;
    });

    const getSnapshot = useCallback(() => {
        const result: Record<string, PayloadOf<T>> = {};
        for (const teamName of Object.keys(teamsRef.current)) {
            result[teamName] = {
                ...(stateRef.current[teamName] ?? initialRef.current),
            };
        }
        return result;
    }, []);

    return { getSnapshot };
}