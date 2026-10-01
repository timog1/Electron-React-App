import {
    createContext,
    useState,
    type ReactNode,
} from "react";
import FilePicker from "./FilePicker.tsx";

export type FilePickerContextType = {
    openFilePicker: (path: string) => void;
    closeFilePicker: () => void;
    infoText: string;
    setInfoText: (text: string) => void;
};

export const FilePickerContext =
    createContext<FilePickerContextType | null>(null);

export function FilePickerProvider({
                                       children,
                                   }: {
    children: ReactNode;
}) {
    const [isOpen, setIsOpen] = useState(false);
    const [path, setPath] = useState<string | null>(null);
    const [infoText, setInfoText] = useState("");

    function openFilePicker(path: string) {
        setPath(path);
        setIsOpen(true);
    }

    function closeFilePicker() {
        setIsOpen(false);

    }

    return (
        <FilePickerContext.Provider
            value={{
                openFilePicker,
                closeFilePicker,
                infoText,
                setInfoText,
            }}
        >
            {children}

            {isOpen && (
                <FilePicker
                    path={path}
                    onClose={closeFilePicker}
                />
            )}
        </FilePickerContext.Provider>
    );
}