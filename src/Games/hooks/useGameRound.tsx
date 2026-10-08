import { useEffect, useState } from "react";
import {useNavigate} from "react-router-dom";

export function useGameRound(
    role: "host" | "client",
    maxRounds?: number
) {
    const [round, setRound] = useState(0);
    const [isLastRound, setIsLastRound] = useState(false);
    const [roundInfo, setInfo] = useState<unknown | undefined>(undefined);
    const navigate = useNavigate()
    async function nextRound(newInfo?: unknown) {
        const message = JSON.stringify({
            type: "next",
            message: newInfo,
        });

        await window.steam.broadcastMessage(message);



        setRound(prev => {
            if (maxRounds !== undefined && prev >= maxRounds - 1) {
               handleReturn()
            }
            if(maxRounds !== undefined && prev -1 >= maxRounds - 1){
                setIsLastRound (true)
            }
            return prev + 1;
        });
    }
    const handleReturn = () => {

        const path = window.location.pathname;
        const slashCount = (path.match(/\//g) || []).length;

        if (slashCount === 3) {
            navigate(path.substring(0, path.lastIndexOf("/")));
        }
    };
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
        isLastRound
    };
}