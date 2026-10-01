import './Tierlist.css'
import type { PlacedImage } from "./TierlistHost.tsx";

interface TierlistProps{
    amountOfRows: number;
   members: SteamLobbyMember[];
    placedImages: PlacedImage[];
    onCellClick: (row: number, player: string) => void;
}

function Tierlist({amountOfRows, members, placedImages, onCellClick}: TierlistProps) {


    return (
        <div>
            <table className="tierlist">
                <thead>
                <tr>
                    <th>#</th>

                    {members.map((player) => (
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

                            {members.map((player) => {

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
                                            <img
                                                className={"tierlist-image"}
                                                key={imageIndex}
                                                src={image.media}
                                                alt=""
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
        </div>
    );
}export default Tierlist