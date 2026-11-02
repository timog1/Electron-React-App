
import './ZahlenErraten.css'
import InputField from "./Components/InputField.tsx"
import {useGameMessage} from "../../hooks/MessageProvider.tsx";
import {useState} from "react";

interface zahlenAntowrtProps
{

    owner: string;
    zahl: number | null;
};


function ZahlenErratenAntworter({owner, zahl}: zahlenAntowrtProps){
    console.log("antwortowner" +owner)
    const [number, setNumber] = useState<number | null>(null)
    useGameMessage("ZAHLEN_ERRATEN_NUMBER", (message) => {
        console.log("MESSAGE RECEIVED:", message);
        console.log("PAYLOAD:", message.payload);

        setNumber(message.payload.number);
    });
    return(

        <div>
            <p>{zahl}</p>
            <InputField owner={owner}></InputField>
            <p>Dein Team Pick: {number}</p>
        </div>
    )
}

export default ZahlenErratenAntworter;