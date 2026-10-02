import React from "react";
import { useNavigate } from "react-router-dom";
import { useFilePicker } from "../Context/useFilePicker.tsx";

import Gamebuttons from "../Gamebuttons/Gamebuttons.tsx";
import GameOptions from "../GameOptions/GameOptions.tsx";
import {useGameRound} from "../Games/hooks/useGameRound.tsx";
interface HostProps {

    lobby: SteamLobby | null;
    setLobby: React.Dispatch<React.SetStateAction<SteamLobby | null>>;
    changeLobby: (key: string, value: string) => void;
   // setGame: React.Dispatch<React.SetStateAction<string>>;
}

function HostLobby({lobby, setLobby, changeLobby}: HostProps ) {
    const { infoText } = useFilePicker();

    async function sendGameInfo(){
        if(!lobby || !lobby.game) {
            console.log("error")
            return;
        }
        const message = JSON.stringify({
            game: lobby.game,
            infoText: infoText,
            rows : 10,



        });
        console.log(message)
        await window.steam.broadcastMessage(
            message
        );
    }
    const navigate = useNavigate()
    if (lobby === null) {
        navigate("/");
        return null;
    }

    async function startGame(){
        if(!lobby || !lobby.game) return
        changeLobby("status", "playing")
        await sendGameInfo()
        navigate(`${lobby.game}`);
    }

    async function leaveLobby() {

        await window.steam.leaveLobby();
        setLobby(null);
        navigate("/");
    }

    return (
        <div>

            <h2>Startscreen</h2>

            <p>
                Startscreen ID: <code>{lobby.id}</code>
            </p>

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
            <Gamebuttons setLobby={changeLobby}></Gamebuttons>
            <p>
                Spiel: <strong>{lobby.game}</strong>
            </p>
            <GameOptions Game={lobby.game}></GameOptions>

            <p>
                Status: <strong>{lobby.state}</strong>
            </p>

            <button onClick={leaveLobby}>
                Startscreen verlassen
            </button>

            <button onClick={startGame}>
                StartGame
            </button>
        </div>
    )
}

export default HostLobby;