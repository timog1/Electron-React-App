
import type {
    GameMessageMap,
    GameMessageArgs,
} from "./protocol";

const listeners = new Map<
    keyof GameMessageMap,
    Set<(payload: never) => void>
>();

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
    broadcast(...args: GameMessageArgs) {
        window.steam.broadcastMessage(encode(...args));
    },

    sendMessage(peerId: string, ...args: GameMessageArgs) {
        window.steam.sendMessage(
            peerId,
            encode(...args)
        );
    },

    on<K extends keyof GameMessageMap>(
        type: K,
        callback: (payload: GameMessageMap[K]) => void
    ) {
        let handlers = listeners.get(type);

        if (!handlers) {
            handlers = new Set();
            listeners.set(type, handlers);
        }

        const handler = callback as (payload: never) => void;
        handlers.add(handler);

        return () => {
            handlers?.delete(handler);
        };
    },
};
