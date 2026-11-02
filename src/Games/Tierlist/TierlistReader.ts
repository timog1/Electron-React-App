
export default class TierlistReader {
    static parse(infos: string): string[] {
        return infos
            .split("|")

    }
}
