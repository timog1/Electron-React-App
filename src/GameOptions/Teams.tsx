import type { DragEvent } from "react";

interface TeamPlayer {
    id: string;
    name: string;
}

// { team1: [playerId, ...], team2: [...], ... }
type TeamsObject = Record<string, string[]>;

interface TeamsProps {
    amountOfTeams: number;
    lobby: SteamLobby;
    changeLobby: (key: string, value: string) => void;
    members: TeamPlayer[];
}

interface GameOptions {
    hostPlays: boolean;
}

function teamKey(team: number): string {
    return `team${team}`;
}

// '{"team1":["id1","id2"],"team2":["id3"]}' -> TeamsObject
// Es sind immer genau team1..teamN vorhanden (fehlende = leeres Array).
function parseTeams(raw: unknown, amountOfTeams: number): Record<string, string[]> {
    let value: unknown = raw;

    // Solange es noch ein String ist, parsen (deckt auch das doppelt escapte Format ab)
    try {
        for (let i = 0; i < 3 && typeof value === "string"; i++) {
            value = JSON.parse(value);
        }
    } catch {
        value = {};
    }

    const obj = (value && typeof value === "object" ? value : {}) as Record<string, unknown>;
    const teams: Record<string, string[]> = {};

    for (let team = 1; team <= amountOfTeams; team++) {
        const ids = obj[`team${team}`];
        teams[`team${team}`] = Array.isArray(ids) ? ids.map(String) : [];
    }

    return teams;
}

// TeamsObject -> JSON-String, IDs pro Team nach ID sortiert
function serializeTeams(teams: TeamsObject): string {
    const sorted: TeamsObject = {};

    for (const key of Object.keys(teams)) {
        sorted[key] = [...teams[key]].sort();
    }

    return JSON.stringify(sorted);
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

    // Gespeicherte Teams als Objekt einlesen.
    const teams: TeamsObject = parseTeams(lobby.teams, amountOfTeams);

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

        const updated: TeamsObject = {};

        // Spieler aus allen Teams entfernen ...
        for (const key of Object.keys(teams)) {
            updated[key] = teams[key].filter((id) => id !== playerId);
        }

        // ... und im Zielteam hinzufügen (bei null bleibt er ohne Team).
        if (team !== null) {
            updated[teamKey(team)].push(playerId);
        }

        changeLobby("teams", serializeTeams(updated));
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

    // Alle IDs, die in irgendeinem Team stehen.
    const assignedIds = new Set(Object.values(teams).flat());

    const unassigned = eligibleMembers.filter(
        (member) => !assignedIds.has(member.id)
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
                    const teamIds = teams[teamKey(teamNumber)];

                    const teamMembers = eligibleMembers.filter((member) =>
                        teamIds.includes(member.id)
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