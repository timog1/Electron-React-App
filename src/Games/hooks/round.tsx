import { useState } from "react";

export function useGameRound(maxRounds?: number) {
    const [round, setRound] = useState(0);

    function nextRound() {
        setRound(prev => {
            if (maxRounds !== undefined && prev >= maxRounds - 1) {
                return prev;
            }

            return prev + 1;
        });
    }

    function previousRound() {
        setRound(prev => Math.max(0, prev - 1));
    }

    function resetRound() {
        setRound(0);
    }

    return {
        round,
        nextRound,
        previousRound,
        resetRound,
    };
}