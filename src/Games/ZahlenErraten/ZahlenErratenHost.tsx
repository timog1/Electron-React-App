import './ZahlenErraten.css'
import {useState} from "react";
import Skala from "./Skala.tsx";
import HostControls from "./HostControls.tsx";
import {useGameMessage} from "../../hooks/MessageProvider.tsx";
import {connection} from "../../hooks/ConnectionLayer.ts";
import type {TierlistOptions} from "../Tierlist/TierlistOptions.ts";
import InputField from "./InputField.tsx";

interface TierlistProps{
    playerId: string;
    members: SteamLobbyMember[] | null;
    Options: TierlistOptions | string;
    owner: string  null;
}

function ZahlenErratenClient({owner, Options}: TierlistProps){
    const Frage = "hi";
    if(!owner){
        return
    }
    if (isHost){
        roundStart();
    }
    //connection.broadcast()
    function onMessage(){

    }
    const [changeState, setChangeState] = useState("F")
    const [form, setForm] = useState()
    useGameMessage("ZAHLEN_ERRATEN", onMessage);
    return(

        <div>
            <p className={"Frage"}></p>
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