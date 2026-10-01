import './ZahlenErraten.css'


interface TierlistProps{
    playerId: string;
    members: SteamLobbyMember[] | null;
}

function ZahlenErratenClient({currentText,currentImage}: TierlistProps){
    const Frage = "hi"

    return(

        <div>
            <p>{Frage}</p>

        </div>
    )
} export default ZahlenErratenClient;