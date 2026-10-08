import './Tierlist.css'
import Media from "./Media.tsx"

interface TierlistProps{
    currentImage: string;
    currentText: string;
}

function CurrentMedia({currentText,currentImage}: TierlistProps){


    return (

        <div >
            <Media url={currentImage}></Media>

            <p>{currentText}</p>
        </div>
    )
}

export default CurrentMedia;