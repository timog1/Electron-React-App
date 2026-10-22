

function Teams({amountOfTeams, Teams}: number) {

    return (
        <div>
            <table>
            {Array.from({length: amountOfTeams}, (_, index) => index + 1).map((i) => (



                        <td>{i}</td>




            ))}
                <tbody>
                <tr>
                   <td>12</td>
                    <td>2</td>
                </tr>
                </tbody>
        </table>
        </div>
    )


}

export default Teams;
