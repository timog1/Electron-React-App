import './Tierlist.css'


interface TierlistProps{
    currentImage: string;
    currentText: string;
}

function CurrentMedia({currentText,currentImage}: TierlistProps){


    return(

    <div>
        <img className= {"media-image"}  src={currentImage}/>
        <p>{currentText}</p>
    </div>
    )
} export default CurrentMedia;