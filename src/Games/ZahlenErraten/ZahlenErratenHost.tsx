
import './ZahlenErraten.css'
import type {TierlistOptions} from "../Tierlist/TierlistOptions.ts";
import ZahlenErratenClient from "./ZahlenErratenClient.tsx";
import {roundStart} from "./Hostlogic.ts";


interface TierlistProps{
    playerId: string;
    members: SteamLobbyMember[] | null;
    Options: TierlistOptions | string;
    owner: string | null;
    teams: Record<string, string[]>;
}


function ZahlenErratenHost({owner, Options, teams, playerId}: TierlistProps){
    roundStart(teams, Frage);
    useGameRound()

    return(

        <div>
           <ZahlenErratenClient owner={owner} Options={Options} teams={teams} playerId={playerId}></ZahlenErratenClient>

        </div>
    )
}

export default ZahlenErratenHost;