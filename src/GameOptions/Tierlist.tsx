
import {useFilePicker} from "../Context/useFilePicker.tsx";

function TierlistOptions() {
    const { openFilePicker } = useFilePicker();
    return(
        <div>
            <button onClick={() => openFilePicker("Tierlist")}>
                Dokument auswählen
            </button>
            <label>
                <input type="checkbox"/>
                Host Plays
            </label>

        </div>
    )


}

export default TierlistOptions;
