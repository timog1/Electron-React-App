
import { useState } from "react";
import {connection} from "../../../hooks/ConnectionLayer.ts";
interface InputProps
{

    owner: string;
};
function InputField({owner}: InputProps) {
    const [answer, setAnswer] = useState("");
    console.log()
    const [submitted, setSubmitted] = useState(false)
    function onPress(answer: string) {
        setSubmitted(true)
        connection.sendMessage(owner, "ZAHLEN_ERRATEN_ANTWORT", { antwort: answer});
    }

    function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        onPress(answer);
    }

    return (
        <div className="zahlenstrahl">
            <form onSubmit={handleSubmit}>
                <input disabled={submitted}
                    type="text"
                    name="username"
                    placeholder="Answer"
                    value={answer}
                    onChange={(event) => setAnswer(event.target.value)}
                />

                <input disabled={submitted} type="submit" value="Submit" />
            </form>
        </div>
    );
}
export default InputField;