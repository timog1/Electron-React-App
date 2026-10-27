import {connection} from "../../hooks/ConnectionLayer.ts";


function sendToEach(message, team, except) {
    for (const player of team) {
        if (!except.includes(player)) {
            connection.sendMessage(message, player);
        }
    }
}