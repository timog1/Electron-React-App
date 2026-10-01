import { useContext } from "react";
import { FilePickerContext } from "./FilePickerContext.tsx";

export function useFilePicker() {
    const context = useContext(FilePickerContext);

    if (!context) {
        throw new Error(
            "useFilePicker must be used inside FilePickerProvider"
        );
    }

    return context;
}