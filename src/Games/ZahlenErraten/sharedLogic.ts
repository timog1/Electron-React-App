import {connection} from "../../hooks/ConnectionLayer.ts";
import {useGameRound} from "../hooks/useGameRound.tsx";
import {useGameInfoStore} from "../../hooks/GameInfoStore.ts";

export function RoundStart(isHost:boolean, Frage){
    const amountOfRounds = useGameInfoStore(
        (store) => store.rounds
    );
    let role;
    if(isHost)
            role = "host"
    else{
        role = "client"
    }
    const {round} = useGameRound(role, amountOfRounds)
    const roundInfo = useGameInfoStore(
        (store) => store.info.get(round)
    );
        return{
            roundInfo
        }
}