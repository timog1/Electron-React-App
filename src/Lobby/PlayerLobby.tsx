
import { useNavigate } from "react-router-dom";
import {useGameMessage} from "../hooks/MessageProvider.tsx";

interface PlayerProps {
    lobby: SteamLobby | null;
    setLobby: React.Dispatch<React.SetStateAction<SteamLobby | null>>;
}

function PlayerLobby({ lobby, setLobby }: PlayerProps) {
    const navigate = useNavigate();

        useGameMessage("GAMESTART", (message) => {
            const data = message.payload.game
            console.log(data)
            setLobby(prev => {
                if (!prev) return null;

                return {
                    ...prev,
                    game: data,
                };
            });

            navigate(`/PlayerLobby/${lobby?.id}/${data}`, {
                state: data
            });

        })





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