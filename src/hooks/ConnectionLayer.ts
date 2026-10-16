
import type {GameMessage} from "./messages.ts"
const listeners = new Map();

function encode(type: string, payload = {}) {
    return JSON.stringify({
        type,
        payload,
        timestamp: Date.now(),
        version: 1,
    });
}

function decode(raw: unknown) {
    try {
        const message =
            typeof raw === "string" ? JSON.parse(raw) : raw;

        if (
            !message ||
            typeof message !== "object" ||
            typeof message.type !== "string"
        ) {
            return null;
        }

        return message;
    } catch (error) {
        console.error("Invalid P2P message:", error);
        return null;
    }
}

export const connection = {
    broadcast(type: string, payload = {}) {
        window.steam.broadcastMessage(encode(type, payload));
    },

    sendMessage(peerId, type: string, payload = {}) {
        window.steam.sendMessage(
            peerId,
            encode(type, payload)
        );
    },

    on(type: string, callback) {
        if (!listeners.has(type)) {
            listeners.set(type, new Set());
        }

        listeners.get(type).add(callback);

        return () => {
            listeners.get(type)?.delete(callback);
        };
    },

    handleIncoming(raw) {
        const message = decode(raw);
        if (!message) return;

        listeners.get(message.type)?.forEach((callback) => {
            try {
                callback(message.payload, message);
            } catch (error) {
                console.error("Message handler failed:", error);
            }
        });
    },
};
