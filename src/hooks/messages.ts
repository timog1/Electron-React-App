export type GameMessage =
    | {
    type: "TIERLIST_PLACE";
    payload: { row: number };
}
    | {
    type: "VIDEO_PLAY";
    payload: { time: number };
}
    | {
    type: "VIDEO_PAUSE";
    payload: { time: number };
}
    | {
    type: "VIDEO_REVEAL";
    payload: {};
}
    | {
    type: "ROUND_NEXT";
    payload: {};
};