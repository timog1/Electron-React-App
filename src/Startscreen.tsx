import { useState } from "react";
import { useNavigate } from "react-router-dom";
interface StartscreenProps {
    playerName: string;

    setLobby: React.Dispatch<React.SetStateAction<SteamLobby | null>>;
    lobby: SteamLobby | null;

}
function Startscreen({
                         playerName,

                         setLobby,


                     }: StartscreenProps){

    const [loading, setLoading] = useState(false);
    const [lobbyId, setLobbyId] = useState("");

    async function joinLobby() {
        if (!lobbyId.trim()) {
            return;
        }

        setLoading(true);

        try {
            const joinedLobby = await window.steam.joinLobby(
                lobbyId.trim()
            );

            setLobby(joinedLobby);
            if(joinedLobby) {
                navigate(`/PlayerLobby/${joinedLobby.id}`);
            }
        } catch (error) {
            console.error("Startscreen join failed:", error);
        } finally {
            setLoading(false);
        }
    }
    async function createLobby() {
        setLoading(true);

        try {
            const newLobby = await window.steam.createLobby();
            setLobby(newLobby);
            if(newLobby) {
                navigate(`/HostLobby/${newLobby.id}`);
            }
        } catch (error) {
            console.error("Startscreen creation failed:", error);
        } finally {
            setLoading(false);
        }
    }


    const navigate = useNavigate();
    return (

        <div >
            <h1>JankBox</h1>

            <p>
                Steam-Spieler: <strong>{playerName}</strong>
            </p>
                <div>
                    <button
                        onClick={createLobby}
                        disabled={loading}
                    >
                        {loading ? "Erstelle Startscreen..." : "Startscreen erstellen"}
                    </button>
                </div>
            <div >
                <input
                    value={lobbyId}
                    onChange={(event) => setLobbyId(event.target.value)}
                    placeholder="Startscreen ID"

                />

                <button
                    onClick={joinLobby}
                    disabled={loading}

                >
                    Startscreen beitreten
                </button>
            </div>
        </div>

    );
}

export default Startscreen;