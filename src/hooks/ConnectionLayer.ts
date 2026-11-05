import type {
    GameMessageMap,
    GameMessageArgs,
} from "./messages.ts";

function encode(...args: GameMessageArgs): string {
    const [type, payload] = args;

    return JSON.stringify({
        type,
        payload,
        timestamp: Date.now(),
        version: 1,
    });
}

export const connection = {
    broadcast<K extends keyof GameMessageMap>(
        ...args: [type: K, payload: GameMessageMap[K]]
    ) {
        window.steam.broadcastMessage(encode(...args));
    },

    sendMessage<K extends keyof GameMessageMap>(
        peerId: string,
        ...args: [type: K, payload: GameMessageMap[K]]
    ) {
        window.steam.sendMessage(peerId, encode(...args));
    },


};