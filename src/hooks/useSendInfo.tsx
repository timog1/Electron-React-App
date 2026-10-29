import { useState, useCallback } from "react";
import { connection } from "./ConnectionLayer.ts";
import { useGameMessage } from "./MessageProvider.tsx";

type GameInfoStart = {
    contentVersion: number;
    game: string;
};

type GameInfoMessage = {
    contentVersion: number;
    game: string;
    info: string;
};

function useSendInfo() {
    const [info, setInfoState] = useState<Map<number, string>>(
        () => new Map()
    );
    const [version, setVersion] = useState(0);
    const [game, setGame] = useState("");

    const setInfo = useCallback((messages: string[]) => {
        const newVersion = version + 1;

        setVersion(newVersion);

        const newInfo = new Map<number, string>();

        messages.forEach((message, index) => {
            newInfo.set(index, message);
        });

        setInfoState(newInfo);

        connection.broadcast("GAMEINFO_START", {
            contentVersion: newVersion,
            game,
            count: messages.length,
        });

        messages.forEach((message, index) => {
            connection.broadcast("GAMEINFO", {
                contentVersion: newVersion,
                game,
                index,
                info: message,
            });
        });
    }, [version, game]);

    function startRes(message: { payload: GameInfoStart }) {
        const incomingVersion = message.payload.contentVersion;

        if (incomingVersion < version) return;

        setVersion(incomingVersion);
        setGame(message.payload.game);
        setInfoState(new Map());
    }

    function receiveInfo(message: { payload: GameInfoMessage }) {
        const payload = message.payload;

        if (payload.contentVersion !== version) return;
        if (payload.game !== game) return;

        setInfoState((previous) => {
            const next = new Map(previous);
            next.set(
                // Der Index muss Teil der Nachricht sein, nicht die Version.
                payload.contentVersion,
                payload.info
            );
            return next;
        });
    }

    useGameMessage("GAMEINFO_START", (message) => {
        startRes(message);
    });

    useGameMessage("GAMEINFO", (message) => {
        receiveInfo(message);
    });

    return { info, version, game, setInfo };
}

export default useSendInfo;