import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

interface PlayerProps {
    lobby: SteamLobby | null;
    setLobby: React.Dispatch<React.SetStateAction<SteamLobby | null>>;
}

function PlayerLobby({ lobby, setLobby }: PlayerProps) {
    const navigate = useNavigate();


        console.log(lobby);
        useEffect(() => {
            const cleanup = window.steam.onMessage((msg) => {
                console.log("MESSAGE:", msg);

                if (typeof msg.message === "string") {
                    const data = JSON.parse(msg.message);

                    console.log("GAME:", data.game);

                    setLobby(prev => {
                        if (!prev) return null;

                        return {
                            ...prev,
                            game: data.game,
                        };
                    });

                    navigate(`/PlayerLobby/${lobby?.id}/${data.game}`, {
                        state: data
                    });
                }
            });

            return cleanup;
        }, []);




    async function leaveLobby() {
        await window.steam.leaveLobby();
        setLobby(null);
        navigate("/");
    }

    if (!lobby) {
        return null;
    }

    return (
        <div>
            <h3>Spieler</h3>

            {lobby.members.map((member, index) => (
                <div key={member.id}>
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
}

export default PlayerLobby;