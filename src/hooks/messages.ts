export interface GameMessageMap {}

// Alle Nachrichten als Union
export type GameMessage = {
    [K in keyof GameMessageMap]: {
        type: K;
        payload: GameMessageMap[K];
    }
}[keyof GameMessageMap];

// Argumente für das Senden einer Nachricht
export type GameMessageArgs = {
    [K in keyof GameMessageMap]: [
        type: K,
        payload: GameMessageMap[K]
    ]
}[keyof GameMessageMap];