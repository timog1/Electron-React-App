import {connection} from "../../hooks/ConnectionLayer.ts";

export const teamConnetion = {
    sendToEach(message: string, team: any, except: string | any[])
{
    for (const player of team) {
        if (!except.includes(player)) {
            connection.sendMessage(message, player);
        }
    }
}
}