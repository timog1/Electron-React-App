import '../ZahlenErraten.css'
import {useMemo, useState} from "react";

import {useGameMessage} from "../../../hooks/MessageProvider.tsx";
import {connection} from "../../../hooks/ConnectionLayer.ts";
import type {TierlistOptions} from "../../Tierlist/TierlistOptions.ts";

import {teamConnection} from "../../Functions/TeamMessages.ts"
import {getTeam} from "../../Functions/getTeam.ts";
import {useGameInfoStore} from "../../../hooks/GameInfoStore.ts";
import {useGameRound} from "../../hooks/useGameRound.tsx";
import ZahlenErratenReader from "../ZahlenErratenReader.ts";
import ZahlenErratenRater from "../ZahlenErratenRater.tsx";
import ZahlenErratenAntworter from "../ZahlenErratenAntworter.tsx";
import RevealPopup from "../Components/RevealPopup.tsx";
interface TierlistProps{
    playerId: string;

    Options: TierlistOptions | string;
    owner: string | null;
    teams: Record<string, string[]>;
    round: number;
}

function ZahlenErratenClient({owner, Options, teams, playerId, round}: TierlistProps) {

    console.log(teams)
    const team: string | undefined = useMemo(() => {
        return getTeam(teams, playerId);
    }, [teams]);
    let teamMates: string[] = []

    if (team){
        teamMates = teams[team]
    }
    console.log(teamMates)
    const gameInfo = useGameInfoStore(
        (store) => store.info.get(round)
    );
    const [role, setRole] = useState("")
    const [number, setNumber] = useState(0)
    const info = ZahlenErratenReader.parse(gameInfo ||"")
    const [popup, setPopup] = useState< {number: number, answerNumber: number, gegnerAnswerNumber: number, antwort: string, gegnerAntwort: string} | null>(null)
    //connection.broadcast()




    useGameMessage("ZAHLEN_ERRATEN_ROLE", (message, from) => {setRole(message.payload.role); setNumber(message.payload.number)});
    useGameMessage("ZAHLEN_ERRATEN_AUFLÖSUNG", (message) => {setPopup({
        number: message.payload.number,
        answerNumber: message.payload.answerNumber,
        gegnerAnswerNumber: message.payload.gegnerAnswerNumber,
        antwort: message.payload.antwort,
        gegnerAntwort: message.payload.gegnerAntwort,
    })})
    return(

        <div>
            <p>hi</p>
            <p className={info.frage}>{info.frage}</p>
            <p>{role}</p>


            { (role === "picker") &&(
                <ZahlenErratenAntworter key={round} owner={owner} zahl={number} team={teamMates}> </ZahlenErratenAntworter>
            )}
            {role === "rater" && (
                <ZahlenErratenRater key={round} owner={owner} teamMates={teamMates}></ZahlenErratenRater>
            )

            }
            {popup && (
                <RevealPopup number={popup.number} answerNumber={popup.answerNumber} gegnerAnswerNumber={popup.gegnerAnswerNumber} antwort={popup.antwort} gegnerAntwort={popup.gegnerAntwort}>
                </RevealPopup>
            )}

        </div>
    )
} export default ZahlenErratenClient;