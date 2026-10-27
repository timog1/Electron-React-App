
import { useState } from "react";
import {connection} from "../../hooks/ConnectionLayer.ts";
interface InputProps
{

    owner: string;
};
function InputField({owner}: InputProps) {
    const [answer, setAnswer] = useState("");

    function onPress(answer: string) {
        connection.sendMessage(owner, "ZAHLEN_ERRATEN", answer);
    }

    function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        onPress(answer);
    }

    return (
        <div className="zahlenstrahl">
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="username"
                    placeholder="Answer"
                    value={answer}
                    onChange={(event) => setAnswer(event.target.value)}
                />

                <input type="submit" value="Submit" />
            </form>
        </div>
    );
}
export default InputField;