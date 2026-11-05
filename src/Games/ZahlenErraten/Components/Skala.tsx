
import '../Skala.css'
import {connection} from "../../../hooks/ConnectionLayer.ts";
import {useState} from "react";
import {teamConnection} from "../../Functions/TeamMessages.ts";


interface SkalaProps
{
    teamMates: string[];
    firstNumber: number;
    lastNumber: number;
    owner: string;
};



function Skala({firstNumber, lastNumber, owner, teamMates}: SkalaProps){
    const [number, setNumber] = useState<number>(-1)
    const [submitted, setSubmitted] = useState(false)
    function onPress(zahl: number){
        setNumber(zahl)
        connection.sendMessage(owner, "ZAHLEN_ERRATEN_HOSTINFO", {antwort: null, number: zahl})
        teamConnection.sendToEach(teamMates, [], "ZAHLEN_ERRATEN_NUMBER", {number: zahl})
    }
    function onPressSubmit(){
        setSubmitted(true)
        connection.sendMessage(owner, "ZAHLEN_ERRATEN_HOSTINFO", {antwort: null, number: number})
        connection.sendMessage(owner, "ZAHLEN_ERRATEN_SUBMIT", {antwort: ""})

    }

    return(

        <div className="zahlenstrahl">
            {Array.from(
                {length: lastNumber - firstNumber + 1},
                (_, index) => firstNumber + index
            ).map((i) => (
                <div>
                    <div className="zahl" key={"z" + i}>
                        {i}
                    </div>
                    <button disabled={submitted} className={"zahlenButton"} key={i}
                            onClick={() => onPress(i)}>{i}</button>

                </div>
            ))}
            <button disabled={submitted} onClick={() => onPressSubmit()}>submit</button>

        </div>
    )
}

export default Skala;