import type {} from "../../hooks/messages";

declare module "../../hooks/messages" {
    interface GameMessageMap {
        VIDEO_PLAY: {
            time: number;
        };

        VIDEO_PAUSE: {
            time: number;
        };
    }
}

export {};