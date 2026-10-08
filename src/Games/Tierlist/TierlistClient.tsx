import { Navigate} from "react-router-dom";
import Tierlist from "./Tierlist.tsx";
import {useEffect, useState} from "react";
import CurrentMedia from "./CurrentMedia.tsx";
import TierlistReader from "./TierlistReader.ts";
import { useLocation } from "react-router-dom";
import {place_Image} from "./place_Image.ts"
import {useGameRound} from "../hooks/useGameRound.tsx"
import type {TierlistOptions} from "./TierlistOptions.ts";
interface TierlistClientProps {
    Options: TierlistOptions | string;
    playerId: string;
    members: SteamLobbyMember[] | null;

}
type PlacedImage = {
    id: number;
    media: string;
    row: number;
    player: string;
};

function TierlistClient({  members,playerId, Options }: TierlistClientProps) {
    let options: TierlistOptions;
    if(typeof Options === "string"){
        options = JSON.parse(Options);
    } else{
        options =  Options
    }
    const {round, roundInfo}= useGameRound("client");
    const { state } = useLocation();
    const amountOfRows = state.rows
    const info = TierlistReader.parse(state.infoText)[round];
    console.log(round)
    const currentImage = info[0]
    const currentText = info[1]
    console.log("round:" +roundInfo)
    const [placedImages, setPlacedImages] = useState<PlacedImage[]>([]);
    useEffect(() => {
        if (!roundInfo) return;

        const positions = new Map(roundInfo);

        const resolvedRound = round - 1;

        const info =
            TierlistReader.parse(state.infoText)[resolvedRound];

        if (!info) return;

        const media = info[0];

        positions.forEach((row, player) => {
            place_Image(
                setPlacedImages,
                resolvedRound,
                row,
                player,
                media
            );
        });
    }, [roundInfo, round, state.infoText]);

    if (!members) {
        return <Navigate to="/" replace />;
    }





    function placeImage(row: number, player: string) {
        player = playerId
        console.log(playerId)
        console.log(round)
        window.steam.sendMessage(members[0].id, row)
        if (!currentImage) return;
        place_Image(setPlacedImages,round, row,player,currentImage)

    }


    return (
        <div className="container">
            <div className={"box"}>
            <Tierlist
                amountOfRows={amountOfRows}
                members={members}
                placedImages={placedImages}
                onCellClick={placeImage}
                HostPlays={options.hostPlays}
            />
            </div>
            <div className={"CurrentMedia box"}>
            <CurrentMedia currentImage={currentImage} currentText={ currentText}></CurrentMedia>
            </div>
        </div>
    );
}

export default TierlistClient;