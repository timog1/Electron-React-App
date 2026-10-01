import {BrowserRouter, Route, Routes} from "react-router-dom";
import {useEffect, useState} from "react";
import TierlistHost from "./Games/Tierlist/TierlistHost.tsx"
import Startscreen from "./Startscreen";
import HostLobby from "./Lobby/HostLobby.tsx";
import PlayerLobby from "./Lobby/PlayerLobby.tsx";
import TierlistClient from "./Games/Tierlist/TierlistClient.tsx"
import ZahlenErratenHost from "./Games/ZahlenErraten/ZahlenErratenHost.tsx";

function App() {
    const [playerName, setPlayerName] = useState("");
    const [playerId, setPlayerId] = useState<string>("");

    useEffect(() => {
        window.steam.getSteamId().then((id) => {
            setPlayerId(id);
        });
    }, []);



    const [lobby, setLobby] = useState<SteamLobby | null>(null);

    useEffect(() => {
        const updateLobby = async () => {
            try {
                const lobby = await window.steam.getLobby();
                setLobby(lobby);
            } catch (err) {
                console.error(err);
            }
        };
        updateLobby();
        window.steam.onLobbyUpdated(updateLobby);




        window.steam.getPlayerName()
            .then(setPlayerName)
            .catch(console.error);
    }, []);

    async function setlobbyall(key: string, value:string ){
        if (!lobby) return;
        setLobby((prev) => {
            if (!prev) return prev;

            return {
                ...prev,
                [key]: value,
            };
        });
        await window.steam.setLobbyData(key, value);
    }
    function getLobbyMembers(){
        if(!lobby) return null;
        return lobby.members
    }
    return (
        <BrowserRouter>
            <Routes>
                <Route
                    path="/"
                    element={
                        <Startscreen
                            playerName={playerName}

                            setLobby={setLobby}
                            lobby={lobby}
                        />
                    }
                />

                <Route
                    path="/HostLobby/:lobbyId"
                    element={
                        <HostLobby
                            lobby={lobby}
                            setLobby={setLobby}
                            changeLobby={setlobbyall}
                        />
                    }
                />
                <Route
                    path="/HostLobby/:lobbyI/Tierlist"
                    element={
                        <TierlistHost
                            amountOfRows={10}
                            members={getLobbyMembers()}
                        />
                    }
                />
                <Route
                    path="/HostLobby/:lobbyI/2I1T"
                    element={
                        <ZahlenErratenHost

                            members={getLobbyMembers()}
                        />
                    }
                />


                <Route
                    path="/PlayerLobby/:lobbyId"
                    element={
                        <PlayerLobby
                            lobby={lobby}

                            setLobby={setLobby}
                        />
                    }
                />

                <Route
                    path="/PlayerLobby/:lobbyId/Tierlist"
                    element={
                        <TierlistClient
                            amountOfRows={10}
                            playerId={playerId}
                            members={getLobbyMembers()}
                        />
                    }
                />

            </Routes>
        </BrowserRouter>
    );
}

export default App;