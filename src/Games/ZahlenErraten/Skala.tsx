
import './Skala.css'


type SkalaProps = {
    firstNumber: number;
    lastNumber: number;
};



function Skala({firstNumber, lastNumber}: SkalaProps){

    return(

        <div className="zahlenstrahl">
            {Array.from(
                { length: lastNumber - firstNumber + 1 },
                (_, index) => firstNumber + index
            ).map((i) => (
                <div className="zahl" key={i}>
                    {i}
                </div>
            ))}

        </div>
    )
}

export default Skala;