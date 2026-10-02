import { useEffect, useState } from "react";

export function useGameRound(
    role: "host" | "client",
    maxRounds?: number
) {
    const [round, setRound] = useState(0);
    const [roundInfo, setInfo] = useState<unknown | undefined>(undefined);

    async function nextRound(newInfo?: unknown) {
        const message = JSON.stringify({
            type: "next",
            message: newInfo,
        });

        await window.steam.broadcastMessage(message);



        setRound(prev => {
            if (maxRounds !== undefined && prev >= maxRounds - 1) {
                return -1;
            }

            return prev + 1;
        });
    }

    useEffect(() => {
        if (role !== "client") {
            return;
        }

        return window.steam.onMessage((message) => {
            if (! (typeof message.message === "string"))  return;
                const data = JSON.parse(message.message);

            if (data.type === "next") {
                setInfo(data.message);

                setRound(prev => {
                    if (maxRounds !== undefined && prev >= maxRounds - 1) {
                        return -1;
                    }

                    return prev + 1;
                });
            }
        });
    }, [role, maxRounds]);

    return {
        round,
        roundInfo,
        nextRound,
    };
}