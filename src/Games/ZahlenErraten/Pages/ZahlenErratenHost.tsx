
import '../ZahlenErraten.css'
import type {TierlistOptions} from "../../Tierlist/TierlistOptions.ts";
import ZahlenErratenClient from "./ZahlenErratenClient.tsx";

import {useGameRound} from "../../hooks/useGameRound.tsx";
import {useGameInfoStore} from "../../../hooks/GameInfoStore.ts";

import ZahlenErratenReader from "../ZahlenErratenReader.ts";
import {giveroles} from "../Hostlogic.ts";
import HostControls from "../Components/HostControls.tsx";
import {teamConnection} from "../../Functions/TeamMessages.ts";
import {connection} from "../../../hooks/ConnectionLayer.ts";
import {useHostMessage} from "../../../hooks/useHostMessage.tsx";
import {useEffect, useRef, useState} from "react";


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
   const {getSnapshot} = useHostMessage("ZAHLEN_ERRATEN_HOSTINFO", {antwort: null, number: null}, teams)
    const hasStarted = useRef(false);
    const [answerNumbers, setAnswerNumbers] = useState<number>(-1);
    useEffect(() => {
        if (hasStarted.current) return;
        hasStarted.current = true;

        setAnswerNumbers(giveroles(teams));

    }, [teams]);

    const onNext = () => {
        const snapshot = getSnapshot();
        const teamNames = Object.keys(teams);

        for (const team of teamNames) {
            const own = snapshot[team];
            const opponent = snapshot[teamNames.find((t) => t !== team) ?? team];

            teamConnection.sendToEach(teams[team], [], "ZAHLEN_ERRATEN_AUFLÖSUNG", {
                antwort: own.antwort ?? "",
                gegnerAntwort: opponent.antwort ?? "",
                number: answerNumbers ?? 0,
                gegnerAnswerNumber: opponent.number ?? 0,
                answerNumber: own.number ?? 0,
            });
        }
    };
    const handleStartRound = () => {
        setAnswerNumbers(giveroles(teams));
        nextRound()
    };
    return(

        <div>
            <HostControls nextRound={handleStartRound} reveal={() => {onNext()}}></HostControls>

            <ZahlenErratenClient round={round}          owner={owner} Options={Options} teams={teams} playerId={playerId}  ></ZahlenErratenClient>

        </div>
    )
}

export default ZahlenErratenHost;