import './Tierlist.css'
import type { PlacedImage } from "./TierlistHost.tsx";

import MediaThumbnail from "./MediaThumbnail.tsx"
interface TierlistProps{
    amountOfRows: number;
   members: SteamLobbyMember[];
    placedImages: PlacedImage[];
    onCellClick: (row: number, player: string) => void;
    HostPlays: boolean;

}

function Tierlist({amountOfRows, members, placedImages, onCellClick, HostPlays}: TierlistProps) {
    let players = members;
    console.log(HostPlays)
    console.log(players)


    if (!HostPlays) {
        players = members.filter((_, index) => index !== 0);
    }
    console.log(players)
    return (

            <table className="tierlist">
                <thead>
                <tr>
                    <th>#</th>

                    {players.map((player) => (
                        <th key={player.id}>
                            {player.id}
                        </th>
                    ))}
                </tr>
                </thead>

                <tbody>

                {Array.from({length: amountOfRows}).map((_, index) => {

                    const row = index + 1;

                    return (
                        <tr key={row}>
                            <td>{row}</td>

                            {players.map((player) => {

                                const playerName = player.id

                                const images = placedImages.filter(
                                    image =>
                                        image.row === row &&
                                        image.player === playerName
                                );

                                return (
                                    <td
                                        key={playerName}
                                        onClick={() =>
                                            onCellClick(
                                                row,
                                                playerName
                                            )
                                        }
                                    >
                                        {images.map((image, imageIndex) => (

                                            <MediaThumbnail

                                                imageIndex={imageIndex}
                                                url={image.media}

                                            />

                                        ))}
                                    </td>
                                );
                            })}
                        </tr>
                    );
                })}

                </tbody>
            </table>

    );
}export default Tierlist





