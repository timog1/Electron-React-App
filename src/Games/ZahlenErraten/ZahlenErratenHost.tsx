
import './ZahlenErraten.css'
import type {TierlistOptions} from "../Tierlist/TierlistOptions.ts";
import ZahlenErratenClient from "./ZahlenErratenClient.tsx";

import {useGameRound} from "../hooks/useGameRound.tsx";
import {useGameInfoStore} from "../../hooks/GameInfoStore.ts";

import ZahlenErratenReader from "./ZahlenErratenReader.ts";
import {giveroles} from "./Hostlogic.ts";
import HostControls from "./Components/HostControls.tsx";


interface TierlistProps{
    playerId: string;
    members: SteamLobbyMember[] | null;
    Options: TierlistOptions | string;
    owner: string | null;
    teams: Record<string, string[]>;
}


function ZahlenErratenHost({owner, Options, teams, playerId}: TierlistProps){
    const amountOfRounds = useGameInfoStore(
        (store) => store.rounds
    );
    const {round, nextRound} =     useGameRound("host", amountOfRounds)

    const gameInfo = useGameInfoStore(
        (store) => store.info.get(round)
    );
    const info = ZahlenErratenReader.parse(gameInfo ||"")
    useGameRound("host")
    giveroles(teams)
    return(

        <div>
            <HostControls></HostControls>
           <ZahlenErratenClient owner={owner} Options={Options} teams={teams} playerId={playerId} ></ZahlenErratenClient>

        </div>
    )
}

export default ZahlenErratenHost;