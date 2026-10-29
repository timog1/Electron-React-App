import type {} from "./messages.ts";

declare module "./messages.ts" {
    interface GameMessageMap {


        GAMEINFO: {
            game: string;
            contentVersion: number;
            round: number;
            info: string;
        };
        GAMEINFO_START: {
            game: string;
            contentVersion: number;
            totalRounds: number;
        };
    }
}
export {};