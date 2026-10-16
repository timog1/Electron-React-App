import './Tierlist.css'
import Media from "./Media.tsx"

interface TierlistProps{
    currentImage: string;
    currentText: string;
    isMP3: boolean;
    isHost: boolean
}

function CurrentMedia({currentText,currentImage, isMP3,isHost}: TierlistProps){


    return (

        <div >
            <Media key={currentImage} url={currentImage} isMP3={isMP3} isHost={isHost}></Media>

            <p>{currentText}</p>
        </div>
    )
}

export default CurrentMedia;