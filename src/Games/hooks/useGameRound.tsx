
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

type GameRole = "host" | "client";

type GameMessage =
    | {
    type: "next";
    round: number;
    message: unknown;
}
    | {
    type: "end";
};

export function useGameRound(
    role: GameRole,
    maxRounds?: number
) {
    const [round, setRound] = useState(0);
    const [roundInfo, setInfo] = useState<unknown>();
    const [isLastRound, setIsLastRound] = useState(false);

    const navigate = useNavigate();

    const handleReturn = useCallback(() => {
        // Navigiert eine Route nach oben
        navigate("..", {
            relative: "path",
            replace: true,
        });
    }, [navigate]);

    const handleNext = useCallback(
        (data: Extract<GameMessage, { type: "next" }>) => {
            setRound(data.round);
            setInfo(data.message);

            setIsLastRound(
                maxRounds !== undefined &&
                data.round >= maxRounds
            );
        },
        [maxRounds]
    );

    const nextRound = useCallback(
        async (newInfo?: unknown) => {
            // Wenn wir bereits in der letzten Runde sind:
            // Spiel beenden und Host + Clients zurück navigieren
            if (
                maxRounds !== undefined &&
                round >= maxRounds
            ) {
                const message: GameMessage = {
                    type: "end",
                };

                await window.steam.broadcastMessage(
                    JSON.stringify(message)
                );

                handleReturn();
                return;
            }

            const nextRoundNumber = round + 1;

            const message: GameMessage = {
                type: "next",
                round: nextRoundNumber,
                message: newInfo ?? "",
            };

            // Nachricht an alle Clients senden
            await window.steam.broadcastMessage(
                JSON.stringify(message)
            );

            // Host aktualisiert sich selbst
            handleNext(message);
        },
        [round, maxRounds, handleNext, handleReturn]
    );

    useEffect(() => {
        if (role !== "client") {
            return;
        }

        return window.steam.onMessage((incomingMessage) => {
            if (typeof incomingMessage.message !== "string") {
                return;
            }

            let data: GameMessage;

            try {
                data = JSON.parse(incomingMessage.message);
            } catch {
                return;
            }

            if (data.type === "next") {
                handleNext(data);
            }

            if (data.type === "end") {
                handleReturn();
            }
        });
    }, [role, handleNext, handleReturn]);

    return {
        round,
        roundInfo,
        nextRound,
        isLastRound,
    };
}
