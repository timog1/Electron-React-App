import Tierlist from "./TierlistOptions.tsx";
import ZahlenErraten from "./ZahlenErraten.tsx";

interface GameOptionsProps {
    changeLobby: (key: string, value: string) => void;
    Game: string | null;
}

const games = {
    Tierlist,
    "2I1T": ZahlenErraten,
};

function GameOptions({ Game, changeLobby }: GameOptionsProps) {
    if (!Game) {
        return null;
    }

    const GameComponent = games[Game as keyof typeof games];

    if (!GameComponent) {
        return null;
    }

    return (
        <div>
            <GameComponent changeLobby={changeLobby} />
        </div>
    );
}

export default GameOptions;