
import '../ZahlenErraten.css'
import './PopupWindow.css'


interface zahlenErraterProps
{


    number: number;
    answerNumber: number;
    gegnerAnswerNumber: number;
    antwort: string;
    gegnerAntwort: string;

};


function RevealPopup({number, answerNumber, gegnerAnswerNumber, antwort, gegnerAntwort, }: zahlenErraterProps){

    return(

        <div>
            <p>{number}</p>
            <p>Your Team Answer Word: {antwort}</p>
            <p>Your Team Answer: {answerNumber}</p>
            <p>Other Team Answer Word: {gegnerAntwort}</p>
            <p>Your Enemy Team Answer: {gegnerAnswerNumber}</p>

        </div>
)
}

export default RevealPopup;