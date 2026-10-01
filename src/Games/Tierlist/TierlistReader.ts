
export default class TierlistReader {
    static parse(infos: string): string[][] {
        return infos
            .split(/\r?\n/)
            .filter(Boolean)
            .map(line => line.split("|"));
    }
}
