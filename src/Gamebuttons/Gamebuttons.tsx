
import './buttons.css';

interface GamebuttonsProps{

    setLobby:  (key: string, value: string) => void;
}

function Gamebuttons({setLobby}: GamebuttonsProps) {
    function changeGame(Game: string){


            setLobby("game", Game)

    }
    return(
        <div>
            <button className="game-button" onClick={() => changeGame(("Tierlist"))}>Tierlist</button>
            <button className="game-button" onClick={() => changeGame(("2I1T"))}>2Idiots1Thought</button>
        </div>
    )
}

export default Gamebuttons;