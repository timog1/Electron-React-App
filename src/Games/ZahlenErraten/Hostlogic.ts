import {connection} from "../../hooks/ConnectionLayer.ts";




export function giveroles(teams: Record<string, string[]>) {
    const num = Math.floor(Math.random() * 10) +1
    for (const team of Object.values(teams)) {
        if (team.length === 0) continue;

        const picker = Math.floor(Math.random() * team.length);

        for (const player of team) {
            if (player === team[picker]) {
                connection.sendMessage(team[picker], "ZAHLEN_ERRATEN_ROLE", {role: "picker", number: num})
            } else {
                connection.sendMessage(team[picker], "ZAHLEN_ERRATEN_ROLE",{role:  "rater"})
            }
        }
    }
}
/*export function givepoints(perfect, next){
    if(number == guess) {
        return  perfect
    } else if (){

    }
}*/
