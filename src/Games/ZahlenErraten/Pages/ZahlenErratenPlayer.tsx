import ZahlenErratenClient from "./ZahlenErratenClient.tsx";
import {useGameRound} from "../../hooks/useGameRound.tsx";
import {useGameInfoStore} from "../../../hooks/GameInfoStore.ts";

function ZahlenErratenPlayer(props: Omit<React.ComponentProps<typeof ZahlenErratenClient>, "round">) {
    const rounds = useGameInfoStore((store) => store.rounds);
    const {round} = useGameRound("client", rounds);

    return <ZahlenErratenClient {...props} round={round} />;
}
export default ZahlenErratenPlayer;