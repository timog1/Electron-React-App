
import { useState } from "react";
import {connection} from "../../../hooks/ConnectionLayer.ts";
import {teamConnection} from "../../Functions/TeamMessages.ts";
interface InputProps
{
    team: string[];
    owner: string;
};
function InputField({team, owner}: InputProps) {
    const [answer, setAnswer] = useState("");
    console.log()
    const [submitted, setSubmitted] = useState(false)
    function onPress(answer: string) {
        setSubmitted(true)
        teamConnection.sendToEach(team,[],  "ZAHLEN_ERRATEN_ANTWORT", { antwort: answer})
        connection.sendMessage(owner, "ZAHLEN_ERRATEN_HOSTINFO", { antwort: answer, number: null});
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