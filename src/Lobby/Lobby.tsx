import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from "react";


function Lobby() {
    async function leaveLobby() {

        await window.steam.leaveLobby();
        setLobby(null);
    }

    const [lobby, setLobby] = useState<SteamLobby | null>(null);

    return (
        <div>
            <h3>Spieler</h3>

            {lobby.members.map((member, index) => (
                <div
                    key={member.id}

                >
                    {member.id === lobby.owner ? "👑 " : "👤 "}
                    Spieler {index + 1}

                    {member.id === lobby.owner && (
                        <strong> – Host</strong>
                    )}
                </div>
            ))}

            <p>
                Spiel: <strong>{lobby.game}</strong>
            </p>

            <p>
                Status: <strong>{lobby.state}</strong>
            </p>
            <button onClick={leaveLobby}>
                Startscreen verlassen
            </button>
        </div>
    );
} export default Lobby;