import {Navigate} from "react-router-dom";
import Tierlist from "./Tierlist.tsx";
import {useEffect, useState} from "react";
import {useFilePicker} from "../../Context/useFilePicker.tsx";
import CurrentMedia from "./CurrentMedia.tsx";
import TierlistReader from "./TierlistReader.ts";

interface TierlistHostProps {

    amountOfRows: number;
    members: SteamLobbyMember[] | null;

}
type PlacedImage = {
    id: number;
    media: string;
    row: number;
    player: string;
};

function TierlistHost({ amountOfRows, members }: TierlistHostProps) {
    const [round, setRound] = useState<number>(0);
    const [placedImages, setPlacedImages] = useState<PlacedImage[]>([]);



    const { infoText } = useFilePicker();
    const allInfo = TierlistReader.parse(infoText)[round]
    const currentImage = allInfo[0];
    const currentText = allInfo[1]
    useEffect(() => {
        return window.steam.onMessage((message) => {
            if (Number.isInteger(message.message)) {
                placeImage(message.message, message.from);
            }
        });
    }, [round, currentImage]);
    if (!members) {
        return <Navigate to="/" replace />;
    }


    console.log(allInfo)
    function next() {
        window.steam.broadcastMessage("next");
        setRound(prev => prev + 1);
        console.log(round)

    }

    function placeImage(row: unknown, player: string) {
       // window.steam.sendMessage(members[0].id, row)
        if(!Number.isInteger(row)) return;
        console.log("round:" + round)
        setPlacedImages(prev => {
            const existing = prev.find(
                image => image.id === round
            );

            if (existing) {
                // Bild verschieben
                return prev.map(image =>
                    image.id === round
                        ? { ...image, row, player }
                        : image
                );
            }

            // Bild zum ersten Mal platzieren
            return [
                ...prev,
                {
                    id: round,
                    media: currentImage,
                    row,
                    player,
                },
            ];
        });
    }
    return (
        <div>
            <Tierlist
                amountOfRows={amountOfRows}
                members={members}
                placedImages={placedImages}
                onCellClick={placeImage}
            />

            <CurrentMedia currentText={currentText}
            currentImage={currentImage}></CurrentMedia>
            <button onClick={next}>next</button>
        </div>
    );
}

export default TierlistHost;