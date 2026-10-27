
import './Skala.css'
import {useGameMessage} from "../../hooks/MessageProvider.tsx";
import {connection} from "../../hooks/ConnectionLayer.ts";


interface SkalaProps
{
    firstNumber: number;
    lastNumber: number;
    owner: string;
};



function Skala({firstNumber, lastNumber, owner}: SkalaProps){
    useGameMessage("ZAHLEN_ERRATEN", onMessage);
    function onMessage(){

    }
    function onPress(number: string){
        connection.sendMessage(owner, "ZAHLEN_ERRATEN", number)
    }

    return(

        <div className="zahlenstrahl">
            {Array.from(
                { length: lastNumber - firstNumber + 1 },
                (_, index) => firstNumber + index
            ).map((i) => (
                <div>
                <div className="zahl" key={"z" + i}>
                    {i}
                </div>
                <button className={"zahlenButton"} key={i} onClick={() => onPress(i.toString())}>{i}</button>
                </div>
            ))}

        </div>
    )
}

export default Skala;