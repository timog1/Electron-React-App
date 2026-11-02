import type {} from "../../hooks/messages.ts";

declare module "../../hooks/messages.ts" {
    interface GameMessageMap {


        ZAHLEN_ERRATEN_NUMBER: {
            number: number;
        };
        ZAHLEN_ERRATEN_ROLE: {
            role: "picker" | "rater";
            number: number | null;
        };
        ZAHLEN_ERRATEN_ANTWORT:{
            antwort: string;

        }
        ZAHLEN_ERRATEN_SUBMIT:{
            antwort: string;

        }

    }
}
export {};