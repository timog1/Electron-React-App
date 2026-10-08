import { useState } from "react";

export function useGameOptions<T>(
    initialState: T,
    changeLobby: (key: string, value: unknown) => void
) {
    const [options, setOptionsState] = useState<T>(initialState);

    function setOptions(value: T) {

        setOptionsState(value);
        changeLobby("gameOptions", value);
    }

    return {
        options,
        setOptions,
    };
}