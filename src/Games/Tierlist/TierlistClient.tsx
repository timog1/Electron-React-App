import { Navigate} from "react-router-dom";
import Tierlist from "./Tierlist.tsx";
import {useEffect, useState} from "react";
import CurrentMedia from "./CurrentMedia.tsx";
import TierlistReader from "./TierlistReader.ts";
import { useLocation } from "react-router-dom";
import {place_Image} from "./place_Image.ts"
import {useGameRound} from "../hooks/useGameRound.tsx"
import type {TierlistOptions} from "./TierlistOptions.ts";
import {useGameInfoStore} from "../../hooks/GameInfoStore.ts";
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

    const amountOfRounds = useGameInfoStore(
        (state) => state.rounds
    );
    const options: TierlistOptions =
        typeof Options === "string"
            ? JSON.parse(Options)
            : Options;


    const {round, roundInfo}= useGameRound("client", amountOfRounds);
    const { state } = useLocation();

    const roundInf = useGameInfoStore(
        (state) => state.info.get(round)
    );

    console.log(round)
    console.log(roundInf)
    const info =    TierlistReader.parse(roundInf || "");
    console.log(info)
    const currentImage = info[0]
    const currentText = info[1]
    const resolvedRound = round - 1;

    const resolvedRoundInfo = useGameInfoStore(
        (store) => store.info.get(resolvedRound)
    );
    console.log(useGameInfoStore(
        (state) => state.info
    ))
    const [placedImages, setPlacedImages] = useState<PlacedImage[]>([]);
    useEffect(() => {
        if (!roundInfo) return;

        const positions = new Map(roundInfo);


        const info =
            TierlistReader.parse(resolvedRoundInfo || "");

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
        if(placedImages.find((image: {row: number, player: string}) => image.row === row && image.player === player)) return;

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
                amountOfRows={amountOfRounds}
                members={members}
                placedImages={placedImages}
                onCellClick={placeImage}
                HostPlays={options.hostPlays}
            />
            </div>
            <div className={"CurrentMedia box"}>
            <CurrentMedia currentImage={currentImage} currentText={ currentText} isMP3={options.videoasMP3}   isHost={ false}></CurrentMedia>
            </div>
        </div>
    );
}

export default TierlistClient;