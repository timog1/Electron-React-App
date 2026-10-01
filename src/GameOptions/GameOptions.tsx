
import Tierlist from "./Tierlist.tsx"
import ZahlenErraten from "./ZahlenErraten.tsx";
interface TierlistOptionsProps{

    Game:  string | null;
}

function TierlistOptions({Game}: TierlistOptionsProps) {

    const games = {
        "Tierlist": Tierlist,
        "2I1T": ZahlenErraten,
    };
    if (!Game) return null;

    let GameComponent = null;

    if (Game === "Tierlist") {
        GameComponent = games[Game];
    }
    if (Game === "2I1T") {
        GameComponent = games[Game];
    }
    if (!GameComponent) {
        return null;
    }

    return(
    <div>

            <GameComponent></GameComponent>
    </div>
    )

} export default TierlistOptions
