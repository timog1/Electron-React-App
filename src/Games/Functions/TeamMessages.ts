import type {GameMessageMap} from "../../hooks/messages.ts";
import {connection} from "../../hooks/ConnectionLayer.ts";

export const teamConnection = {
    sendToEach<K extends keyof GameMessageMap>(
        team: string[],
        except: string | string[],
        ...args: [type: K, payload: GameMessageMap[K]]
    ) {
        const excluded = Array.isArray(except) ? except : [except];

        for (const player of team) {
            if (!excluded.includes(player)) {
                connection.sendMessage(player, ...args);
            }
        }
    },
};