import './ZahlenErraten.css'
import {useState} from "react";
import Skala from "./Skala.tsx";
import HostControls from "./HostControls.tsx";


interface TierlistProps{
    playerId: string;
    members: SteamLobbyMember[] | null;
}

function ZahlenErratenClient({currentText,currentImage}: TierlistProps){
    const Frage = "hi"
    const [changeState, setChangeState] = useState("F")
    const [form, setForm] = useState()

    return(

        <div>
            { (changeState === "F") &&(
            <HostControls></HostControls>
            )}
            <Skala firstNumber={1} lastNumber={10}></Skala>
        </div>
    )
} export default ZahlenErratenClient;