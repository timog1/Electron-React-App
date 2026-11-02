import './ZahlenErraten.css'
import {useMemo, useState} from "react";
import Skala from "./Components/Skala.tsx";
import HostControls from "./Components/HostControls.tsx";
import {useGameMessage} from "../../hooks/MessageProvider.tsx";
import {connection} from "../../hooks/ConnectionLayer.ts";
import type {TierlistOptions} from "../Tierlist/TierlistOptions.ts";
import InputField from "./Components/InputField.tsx";
import {teamConnetion} from "../Functions/TeamMessages.ts"
import {getTeam} from "../Functions/getTeam.ts";
import {useGameInfoStore} from "../../hooks/GameInfoStore.ts";
import {useGameRound} from "../hooks/useGameRound.tsx";
import ZahlenErratenReader from "./ZahlenErratenReader.ts";
import ZahlenErratenRater from "./ZahlenErratenRater.tsx";
import ZahlenErratenAntworter from "./ZahlenErratenAntworter.tsx";
interface TierlistProps{
    playerId: string;

    Options: TierlistOptions | string;
    owner: string | null;
    teams: Record<string, string[]>;
}

function ZahlenErratenClient({owner, Options, teams, playerId}: TierlistProps) {
    const rounds = useGameInfoStore(
        (store) => store.rounds
    );
    const {round} = useGameRound("client", rounds)
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
    //connection.broadcast()
    function onSendInfo(message, from){
        teamConnetion.sendToEach(message, teams, from)
        connection.sendMessage(message, owner)
    }



    useGameMessage("ZAHLEN_ERRATEN_ROLE", (message, from) => {setRole(message.payload.role); setNumber(message.payload.number)});

    return(

        <div>
            <p>hi</p>
            <p className={info.frage}>{info.frage}</p>
            <p>{role}</p>


            { (role === "picker") &&(
                <ZahlenErratenAntworter owner={owner} zahl={number}> </ZahlenErratenAntworter>
            )}
            {role === "rater" && (
                <ZahlenErratenRater owner={owner} teamMates={teamMates}></ZahlenErratenRater>
            )

            }

        </div>
    )
} export default ZahlenErratenClient;