
type ZahlenErratenInfo = {
    frage: string;
    one: string;
    ten: string;
};

export default class ZahlenErratenReader {
    static parse(infos: string): ZahlenErratenInfo[] {
        return infos
            .split(/\r?\n/)
            .filter(Boolean)
            .map((line) => {
                const test = line.split("|");

                return {
                    frage: test[0]?.trim() ?? "",
                    one: test[1]?.trim() || "worst",
                    ten: test[2]?.trim() || "best",
                };
            });
    }
}
