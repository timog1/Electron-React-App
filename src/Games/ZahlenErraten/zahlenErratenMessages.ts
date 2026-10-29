import type {} from "../../hooks/messages.ts";

declare module "../../hooks/messages.ts" {
    interface GameMessageMap {


        ZAHLEN_ERRATEN_NUMBER: {
            number: number;
        };
        ZAHLEN_ERRATEN_ROLE: {
            role: string;
        };
        ZAHLEN_ERRATEN_FRAGE: {
            frage: string;
        };
    }
}
export {};