import { useFilePicker } from "../Context/useFilePicker.tsx";
import { useGameOptions } from "./useGameOptions.tsx";
import type { ChangeEvent } from "react";

interface TierlistOptionsProps {
    changeLobby: (key: string, value: unknown) => void;
}

interface TierlistOptionsState {
    hostPlays: boolean;
    videoasMP3: boolean;
}

const initialOptions: TierlistOptionsState = {
    hostPlays: false,
    videoasMP3: false,
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
    function handlevideoasMP3Change(e: ChangeEvent<HTMLInputElement>) {
        setOptions({
            ...options,
            videoasMP3: e.target.checked,
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
            <label>
            <input
                type="checkbox"
                checked={options.videoasMP3}
                onChange={handlevideoasMP3Change}
            />
            Video als MP3
        </label>
        </div>
    );
}

export default TierlistOptions;