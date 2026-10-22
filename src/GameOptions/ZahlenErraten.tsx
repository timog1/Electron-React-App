
import { useFilePicker } from "../Context/useFilePicker.tsx";
import { useGameOptions } from "./useGameOptions.tsx";
import Teams from "./Teams.tsx";
import type { ChangeEvent } from "react";

interface ZahlenErratenOptionsProps {
    changeLobby: (key: string, value: unknown) => void;
}

interface ZahlenErratenOptionsState {
    hostPlays: boolean;
    simultanTurns: boolean;
}

const initialOptions: ZahlenErratenOptionsState = {
    hostPlays: false,
    simultanTurns: false,
};

function ZahlenErratenOptions({
                                  changeLobby,
                              }: ZahlenErratenOptionsProps) {
    const { openFilePicker } = useFilePicker();

    const { options, setOptions } = useGameOptions(
        initialOptions,
        changeLobby
    );

    function handleHostPlaysChange(
        e: ChangeEvent<HTMLInputElement>
    ) {
        setOptions({
            ...options,
            hostPlays: e.target.checked,
        });
    }

    function handleSimultanTurnsChange(
        e: ChangeEvent<HTMLInputElement>
    ) {
        setOptions({
            ...options,
            simultanTurns: e.target.checked,
        });
    }

    return (
        <div>
            <button
                onClick={() => openFilePicker("ZahlenErraten")}
            >
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
                    checked={options.simultanTurns}
                    onChange={handleSimultanTurnsChange}
                />
                Simultan Turns
            </label>

            <Teams amountOfTeams={2}  />
        </div>
    );
}

export default ZahlenErratenOptions;
