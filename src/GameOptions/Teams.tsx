
import type { DragEvent } from "react";

interface TeamPlayer {
    id: string;
    name: string;
}

interface TeamAssignments {
    [playerId: string]: number;
}

interface TeamsProps {
    amountOfTeams: number;
    lobby: SteamLobby;
    changeLobby: (key: string, value: string) => void;
    members: TeamPlayer[];
}

interface GameOptions {
    hostPlays: boolean;
}

function Teams({
                   amountOfTeams,
                   lobby,
                   changeLobby,
                   members,
               }: TeamsProps) {
    // Parse game options and read hostPlays as a boolean.
    const gameOptions: GameOptions = (() => {
        const saved = lobby.gameOptions;

        if (!saved) {
            return { hostPlays: false };
        }

        try {
            const parsed =
                typeof saved === "string" ? JSON.parse(saved) : saved;

            return {
                hostPlays: parsed?.hostPlays === true,
            };
        } catch {
            return { hostPlays: false };
        }
    })();

    // Parse saved team assignments.
    const assignments: TeamAssignments = (() => {
        const saved = lobby.teams;

        if (!saved) {
            return {};
        }

        try {
            return typeof saved === "string"
                ? JSON.parse(saved)
                : saved;
        } catch {
            return {};
        }
    })();

    // Exclude the host when hostPlays is false.
    const eligibleMembers = members.filter(
        (member) =>
            gameOptions.hostPlays || member.id !== lobby.owner
    );

    function movePlayer(playerId: string, team: number | null) {
        // Only eligible players can be assigned to teams.
        if (!eligibleMembers.some((member) => member.id === playerId)) {
            return;
        }

        const updated: TeamAssignments = { ...assignments };

        if (team === null) {
            delete updated[playerId];
        } else {
            updated[playerId] = team;
        }

        changeLobby("teams", JSON.stringify(updated));
    }

    function handleDragStart(
        event: DragEvent<HTMLDivElement>,
        playerId: string
    ) {
        event.dataTransfer.setData("text/plain", playerId);
        event.dataTransfer.effectAllowed = "move";
    }

    function handleDrop(
        event: DragEvent<HTMLDivElement>,
        team: number | null
    ) {
        event.preventDefault();

        const playerId = event.dataTransfer.getData("text/plain");

        if (
            playerId &&
            eligibleMembers.some((member) => member.id === playerId)
        ) {
            movePlayer(playerId, team);
        }
    }

    function allowDrop(event: DragEvent<HTMLDivElement>) {
        event.preventDefault();
        event.dataTransfer.dropEffect = "move";
    }

    const unassigned = eligibleMembers.filter(
        (member) => !assignments[member.id]
    );

    return (
        <div>
            <h3>Spieler ohne Team</h3>

            <div
                onDragOver={allowDrop}
                onDrop={(event) => handleDrop(event, null)}
                style={{
                    minHeight: 70,
                    padding: 12,
                    border: "2px dashed #888",
                    borderRadius: 8,
                    display: "flex",
                    flexWrap: "wrap",
                    gap: 8,
                }}
            >
                {unassigned.map((player) => (
                    <div
                        key={player.id}
                        draggable
                        onDragStart={(event) =>
                            handleDragStart(event, player.id)
                        }
                        style={{
                            padding: 8,
                            border: "1px solid #888",
                            borderRadius: 6,
                            cursor: "grab",
                        }}
                    >
                        {player.name}
                    </div>
                ))}

                {unassigned.length === 0 && (
                    <span>Alle Spieler sind in einem Team.</span>
                )}
            </div>

            <h3>Teams</h3>

            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: `repeat(${amountOfTeams}, minmax(140px, 1fr))`,
                    gap: 12,
                }}
            >
                {Array.from(
                    { length: amountOfTeams },
                    (_, index) => index + 1
                ).map((teamNumber) => {
                    const teamMembers = eligibleMembers.filter(
                        (member) =>
                            assignments[member.id] === teamNumber
                    );

                    return (
                        <div
                            key={teamNumber}
                            onDragOver={allowDrop}
                            onDrop={(event) =>
                                handleDrop(event, teamNumber)
                            }
                            style={{
                                minHeight: 160,
                                padding: 12,
                                border: "1px solid #888",
                                borderRadius: 8,
                            }}
                        >
                            <h4>Team {teamNumber}</h4>

                            {teamMembers.map((player) => (
                                <div
                                    key={player.id}
                                    draggable
                                    onDragStart={(event) =>
                                        handleDragStart(
                                            event,
                                            player.id
                                        )
                                    }
                                    style={{
                                        padding: 8,
                                        marginBottom: 8,
                                        border: "1px solid #888",
                                        borderRadius: 6,
                                        cursor: "grab",
                                    }}
                                >
                                    {player.name}
                                </div>
                            ))}

                            {teamMembers.length === 0 && (
                                <span>Spieler hier ablegen</span>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default Teams;
