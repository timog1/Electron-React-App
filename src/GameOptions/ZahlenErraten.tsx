
import {useFilePicker} from "../Context/useFilePicker.tsx";

function ZahlenErratenOptions() {
    const { openFilePicker } = useFilePicker();
    return(
        <div>
            <button onClick={() => openFilePicker("ZahlenErraten")}>
                Dokument auswählen
            </button>
            <label>
                <input type="checkbox"/>
                Host Plays
            </label>

        </div>
    )


}

export default ZahlenErratenOptions;
