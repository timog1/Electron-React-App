import type {} from "../hooks/messages.ts";

declare module "../hooks/messages.ts" {
    interface GameMessageMap {


        GAMESTART: {
            game: string;
        };

    }
}
export {};