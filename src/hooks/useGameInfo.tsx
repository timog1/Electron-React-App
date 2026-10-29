import { setGameInfo } from "./gameInfoStore";
import {useGameMessage} from "./MessageProvider.tsx";

function setGameData<T>(message){
    T(message)
    setGameInfo(message);

    useGameMessage("GAMEINFO", message);
}