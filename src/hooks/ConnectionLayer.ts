
const listeners = new Map();

function encode(type: string, payload = {}) {
    return JSON.stringify({
        type,
        payload,
        timestamp: Date.now(),
        version: 1,
    });
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


};
