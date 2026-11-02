import { useCallback } from "react";
import { connection } from "./ConnectionLayer.ts";
import { useGameMessage } from "./MessageProvider.tsx";
import { useGameInfoStore } from "./GameInfoStore.ts";

import type { GameMessageMap } from "./messages.ts";

type GameInfoStart = GameMessageMap["GAMEINFO_START"];
type GameInfoMessage = GameMessageMap["GAMEINFO"];

function useSendInfo() {
    const info = useGameInfoStore((state) => state.info);
    const version = useGameInfoStore((state) => state.version);
    const game = useGameInfoStore((state) => state.game);
    // const gameInfo = useGameInfoStore((state) => state.gameInfo);
    const setInfo = useCallback((messages: string[]) => {
        const store = useGameInfoStore.getState();

        const newVersion = store.version + 1;
        const currentGame = store.game;

        const newInfo = new Map<number, string>();

        messages.forEach((message, index) => {
            newInfo.set(index, message);
        });

        useGameInfoStore.setState({
            rounds: messages.length,

            version: newVersion,
            info: newInfo,
        });

        connection.broadcast("GAMEINFO_START", {
            contentVersion: newVersion,
            game: currentGame,
            totalRounds: messages.length,
        });

        messages.forEach((message, index) => {
            connection.broadcast("GAMEINFO", {
                contentVersion: newVersion,
                game: currentGame,
                round: index,
                info: message,
            });
        });
    }, []);

    function startRes(message: { payload: GameInfoStart }) {
        const incomingVersion = message.payload.contentVersion;
        const store = useGameInfoStore.getState();

        if (incomingVersion < store.version) return;

        useGameInfoStore.setState({
            version: incomingVersion,
            rounds: message.payload.totalRounds,
            game: message.payload.game,
            info: new Map(),
        });
    }

    function receiveInfo(message: { payload: GameInfoMessage }) {
        const payload = message.payload;
        const store = useGameInfoStore.getState();

        if (payload.contentVersion !== store.version) return;
        if (payload.game !== store.game) return;

        useGameInfoStore.setState((state) => {
            const next = new Map(state.info);

            next.set(payload.round, payload.info);

            return { info: next };
        });
    }

    useGameMessage("GAMEINFO_START", startRes);
    useGameMessage("GAMEINFO", receiveInfo);

    return { info, version, game, setInfo };
}

export default useSendInfo;