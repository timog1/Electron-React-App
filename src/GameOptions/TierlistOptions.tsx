import { useFilePicker } from "../Context/useFilePicker.tsx";
import { useGameOptions } from "./useGameOptions.tsx";
import type { ChangeEvent } from "react";

interface TierlistOptionsProps {
    changeLobby: (key: string, value: unknown) => void;
}

interface TierlistOptionsState {
    hostPlays: boolean;
}

const initialOptions: TierlistOptionsState = {
    hostPlays: false,
};

function TierlistOptions({ changeLobby }: TierlistOptionsProps) {
    const { openFilePicker } = useFilePicker();

    const { options, setOptions } = useGameOptions(
        initialOptions,
        changeLobby
    );

    function handleHostPlaysChange(e: ChangeEvent<HTMLInputElement>) {
        setOptions({
            ...options,
            hostPlays: e.target.checked,
        });
    }

    return (
        <div>
            <button onClick={() => openFilePicker("Tierlist")}>
                Dokument auswählen
            </button>

            <label>
                <input
                    type="checkbox"
                    checked={options.hostPlays}
                    onChange={handleHostPlaysChange}
                />
                Host Plays
            </label>
        </div>
    );
}

export default TierlistOptions;