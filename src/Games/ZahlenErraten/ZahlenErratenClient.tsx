import './ZahlenErraten.css'
import {useMemo, useState} from "react";
import Skala from "./Skala.tsx";
import HostControls from "./HostControls.tsx";
import {useGameMessage} from "../../hooks/MessageProvider.tsx";
import {connection} from "../../hooks/ConnectionLayer.ts";
import type {TierlistOptions} from "../Tierlist/TierlistOptions.ts";
import InputField from "./InputField.tsx";
import {teamConnetion} from "../Functions/TeamMessages.ts"
import {getTeam} from "../Functions/getTeam.ts";
interface TierlistProps{
    playerId: string;
    members: SteamLobbyMember[] | null;
    Options: TierlistOptions | string;
    owner: string | null;
    teams: Record<string, string[]>;
}

function ZahlenErratenClient({owner, Options, teams, playerId}: TierlistProps){


    const value = useMemo(() => {
        return getTeam(teams, playerId);
    }, [teams]);
    const [role, setRole] = useState("")
    const [frage, setFrage] = useState("")
    const [answer, setAnswer] = useState<number>()
    //connection.broadcast()
    function onSendInfo(message, from){
        teamConnetion.sendToEach(message, teams, from)
        connection.sendMessage(message, owner)
    }
    function onMessage(message, from) {

    }
    const [changeState, setChangeState] = useState("F")
    const [form, setForm] = useState()
    useGameMessage("ZAHLEN_ERRATEN_ROLE", (message, from) => {setRole(message.payload.role)});
    useGameMessage("ZAHLEN_ERRATEN_FRAGE", (message, from) => {setFrage(message.payload.frage)});
    useGameMessage("ZAHLEN_ERRATEN_NUMBER", (message, from) => {setAnswer(message.payload.number)});

    return(

        <div>
            <p className={frage}></p>
            <p>{role}</p>
            <p>{answer}</p>
            { (changeState === "F") &&(
                <HostControls></HostControls>
            )}
            {changeState === "F" ? (
                <InputField owner={owner}></InputField>
            ) : (
                <Skala firstNumber={1} lastNumber={10} owner={owner}></Skala>
            )}

        </div>
    )
} export default ZahlenErratenClient;