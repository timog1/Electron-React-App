import { create } from "zustand";

type GameInfoState = {
    info: Map<number, string>;
    version: number;
    game: string;
    gameInfo: string;
    rounds: number;
};

export const useGameInfoStore = create<GameInfoState>(() => ({
    info: new Map(),
    version: 0,
    game: "",
    gameInfo: "",
    rounds: 0
}));