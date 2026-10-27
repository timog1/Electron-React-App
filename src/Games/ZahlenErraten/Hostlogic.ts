import {connection} from "../../hooks/ConnectionLayer.ts";


function roundStart(teams){
    for ( const team of teams){
        const picker = Math.floor(Math.random() * team.length() );
        connection.sendMessage(team[picker], "ZAHLEN_ERRATEN", "picker")
    }

}