import { useFilePicker } from "../Context/useFilePicker.tsx";
import Teams from "./Teams.tsx";

interface ZahlenErratenOptionsState {
    hostPlays: boolean;
    simultanTurns: boolean;
}

interface ZahlenErratenOptionsProps {
    lobby: SteamLobby;
    changeLobby: (key: string, value: string) => void;
}

const initialOptions: ZahlenErratenOptionsState = {
    hostPlays: false,
    simultanTurns: false,
};

function ZahlenErratenOptions({
                                  lobby,
                                  changeLobby,
                              }: ZahlenErratenOptionsProps) {
    const { openFilePicker } = useFilePicker();

    // Read the options directly from the lobby.
    const options: ZahlenErratenOptionsState = lobby.gameOptions
        ? {
            ...initialOptions,
            ...(typeof lobby.gameOptions === "string"
                ? JSON.parse(lobby.gameOptions)
                : lobby.gameOptions),
        }
        : initialOptions;

    function updateOption(
        key: keyof ZahlenErratenOptionsState,
        value: boolean
    ) {
        changeLobby(
            "gameOptions",
            JSON.stringify({
                ...options,
                [key]: value,
            })
        );
    }

    return (
        <div>
            <button
                type="button"
                onClick={() => openFilePicker("ZahlenErraten")}
            >
                Dokument auswählen
            </button>

            <label>
                <input
                    type="checkbox"
                    checked={options.hostPlays}
                    onChange={(e) =>
                        updateOption("hostPlays", e.target.checked)
                    }
                />
                Host Plays
            </label>

            <label>
                <input
                    type="checkbox"
                    checked={options.simultanTurns}
                    onChange={(e) =>
                        updateOption("simultanTurns", e.target.checked)
                    }
                />
                Simultan Turns
            </label>

            <Teams
                amountOfTeams={2}
                lobby={lobby}
                members={lobby.members}
                changeLobby={changeLobby}
            />
        </div>
    );
}

export default ZahlenErratenOptions;