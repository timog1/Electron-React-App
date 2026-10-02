import {Navigate} from "react-router-dom";
import Tierlist from "./Tierlist.tsx";
import {useEffect, useState} from "react";
import {useFilePicker} from "../../Context/useFilePicker.tsx";
import CurrentMedia from "./CurrentMedia.tsx";
import TierlistReader from "./TierlistReader.ts";
import {useGameRound} from "../hooks/useGameRound.tsx";
import {place_Image} from "./place_Image.ts";
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
function TierlistHost({
                          amountOfRows,
                          members
                      }: TierlistHostProps) {

    const [placedImages, setPlacedImages] =
        useState<PlacedImage[]>([]);

    const [roundImages, setRoundImages] =
        useState<Map<string, number>>(new Map());

    const {
        round,
        nextRound
    } = useGameRound("host");

    const { infoText } = useFilePicker();

    const allInfo =
        TierlistReader.parse(infoText)[round];

    const currentImage = allInfo[0];
    const currentText = allInfo[1];

    useEffect(() => {
        return window.steam.onMessage((message) => {
            const row = Number(message.message);

            if (!Number.isInteger(row)) {
                return;
            }

            placeImage(row, message.from);
        });
    }, [round, currentImage]);

    function placeImage(row: number, player: string) {
        if (!currentImage) return;

        // Geheime Picks der aktuellen Runde
        setRoundImages(prev => {
            const next = new Map(prev);
            next.set(player, row);
            return next;
        });

        // Host sieht die Picks natürlich sofort
        place_Image(
            setPlacedImages,
            round,
            row,
            player,
            currentImage
        );
    }

    async function handleNextRound() {

        const data = Array.from(roundImages.entries());
        await nextRound(data);


        setRoundImages(new Map());
    }

    if (!members) {
        return <Navigate to="/" replace />;
    }

    return (
        <div>
            <Tierlist
                amountOfRows={amountOfRows}
                members={members}
                placedImages={placedImages}
                onCellClick={placeImage}
            />

            <CurrentMedia
                currentText={currentText}
                currentImage={currentImage}
            />

            <button onClick={handleNextRound}>
                next
            </button>
        </div>
    );
} export default TierlistHost