
import './ZahlenErraten.css'
import {useGameMessage} from "../../hooks/MessageProvider.tsx";
import {useState} from "react";
import Skala from "./Components/Skala.tsx";


interface zahlenErraterProps
{
    teamMates: string[];
    owner: string;
};


function ZahlenErratenRater({owner, teamMates}: zahlenErraterProps){
    const [antwort, setAntwort] = useState("")
    console.log( teamMates)
    useGameMessage("ZAHLEN_ERRATEN_ANTWORT", (message) =>{ setAntwort(message.payload.antwort)})
    return(

        <div>
            <p>{antwort}</p>
            <Skala firstNumber={1} lastNumber={10} owner={owner} teamMates={teamMates}></Skala>
        </div>
    )
}

export default ZahlenErratenRater;