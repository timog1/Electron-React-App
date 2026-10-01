import { Navigate} from "react-router-dom";
import Tierlist from "./Tierlist.tsx";
import {useState} from "react";
import CurrentMedia from "./CurrentMedia.tsx";
import TierlistReader from "./TierlistReader.ts";
import { useLocation } from "react-router-dom";
import {useEffect} from "react";
import useGameRound from "../hooks/round.tsx"
interface TierlistClientProps {

    playerId: string;
    members: SteamLobbyMember[] | null;

}
type PlacedImage = {
    id: number;
    media: string;
    row: number;
    player: string;

};

function TierlistClient({  members,playerId }: TierlistClientProps) {
    let [round, setRound] = useGameRound();
    const { state } = useLocation();
    const amountOfRows = state.rows
    const info = TierlistReader.parse(state.infoText)[round];
    console.log(round)
    const currentImage = info[0]
    const currentText = info[1]
    useEffect(() => {
        return window.steam.onMessage((msg) => {
            onNext(msg);
        });
    }, []);
    function onNext(message: SteamIncomingMessage<unknown>){
        console.log(message)

        if(message.message === "next"){
            console.log("message:" + message)

            setRound((prev): number => {return prev + 1})
        }

    }



    if (!members) {
        return <Navigate to="/" replace />;
    }


    let [placedImages, setPlacedImages] = useState<PlacedImage[]>([]);
    function placeImage(row: number, player: string) {
        player = playerId
        console.log(playerId)
        console.log(round)
        window.steam.sendMessage(members[0].id, row)
        if (!currentImage) return;

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

            <CurrentMedia currentImage={currentImage} currentText={ currentText}></CurrentMedia>

        </div>
    );
}

export default TierlistClient;