
export default class ZahlenErratenReader {
    static parse(infos: string): string[][] {
        return infos
            .split(/\r?\n/)
            .filter(Boolean)
            .map(line => line.split("|"));
    }
}
