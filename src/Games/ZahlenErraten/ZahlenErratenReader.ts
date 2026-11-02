
type ZahlenErratenInfo = {
    frage: string;
    one: string;
    ten: string;
};

export default class ZahlenErratenReader {
    static parse(infos: string): ZahlenErratenInfo {
        const info =  infos.split("|");

                return {
                    frage: info[0]?.trim() ?? "",
                    one: info[1]?.trim() || "worst",
                    ten: info[2]?.trim() || "best",
                };

    }
}
