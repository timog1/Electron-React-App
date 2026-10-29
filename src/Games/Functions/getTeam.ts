export function getTeam(
    teams: Record<string, string[]>,
    playerId: string
): string | undefined {
    return Object.keys(teams).find((teamId) =>
        teams[teamId].includes(playerId)
    );
}