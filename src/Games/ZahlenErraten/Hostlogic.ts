import {connection} from "../../hooks/ConnectionLayer.ts";


export function roundStart(teams, Frage){
    for ( const team of teams){
        const picker = Math.floor(Math.random() * team.length() );
        connection.broadcast(team[picker], "ZAHLEN_ERRATEN_FRAGE", Frage)
        connection.sendMessage(team[picker], "ZAHLEN_ERRATEN_ROLE", "picker")
        for (const player of team) {
            if(player != team[picker]) {
                connection.sendMessage(team[picker], "ZAHLEN_ERRATEN_ROLE", "rater")
            }
        }

    }

}