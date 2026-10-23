import { useFilePicker } from "../Context/useFilePicker.tsx";

interface TierlistOptionsState {
    hostPlays: boolean;
    videoasMP3: boolean;
}

interface TierlistOptionsProps {
    lobby: SteamLobby;
    changeLobby: (key: string, value: string) => void;
}

const initialOptions: TierlistOptionsState = {
    hostPlays: false,
    videoasMP3: false,
};

function TierlistOptions({
                             lobby,
                             changeLobby,
                         }: TierlistOptionsProps) {
    const { openFilePicker } = useFilePicker();

    // Derive options directly from the lobby.
    const options: TierlistOptionsState = lobby.gameOptions
        ? {
            ...initialOptions,
            ...(typeof lobby.gameOptions === "string"
                ? JSON.parse(lobby.gameOptions)
                : lobby.gameOptions),
        }
        : initialOptions;

    function updateOption(
        key: keyof TierlistOptionsState,
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
                onClick={() => openFilePicker("Tierlist")}
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
                    checked={options.videoasMP3}
                    onChange={(e) =>
                        updateOption("videoasMP3", e.target.checked)
                    }
                />
                Video als MP3
            </label>
        </div>
    );
}

export default TierlistOptions;