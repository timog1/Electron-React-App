


interface zahlenErraterProps
{
    Leaderboard: Map<string, number> ;

};


function Leaderboard({Leaderboard}: zahlenErraterProps){
    function getPlayerPos() {
        let playerArray = [];
        let saved = -Infinity;

        for (const player of Leaderboard.keys()) {
            saved = Math.max(saved, Leaderboard.get(player));
        }

        while (playerArray.length < Leaderboard.size) {
            let highest = -Infinity;
            let highestPlayer = null;

            for (const player of Leaderboard.keys()) {
                if (
                    Leaderboard.get(player) > highest &&
                    !playerArray.includes(player)
                ) {
                    highest = Leaderboard.get(player);
                    highestPlayer = player;
                }
            }

            if (highestPlayer !== null) {
                playerArray.push(highestPlayer);
            } else {
                break;
            }
        }

        return playerArray;
    }
    return(

        <div>
            <table>
                <tr>
                    <th>X</th>
                    <th>Points</th>
                </tr>
                { }
            </table>

        </div>
    )
}

export default Leaderboard;
