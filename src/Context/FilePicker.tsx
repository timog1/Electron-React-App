
import { useEffect, useState } from "react";

import { useFilePicker } from "./useFilePicker.tsx";
type FilePickerProps = {
    path: string | null;
    onClose: () => void;
};

export default function FilePicker({
    path,
    onClose,
}: FilePickerProps) {
    const [currentPath, setCurrentPath] = useState(path);
    const [entries, setEntries] = useState<FileEntry[]>([]);
    const [selectedEntry, setSelectedEntry] = useState<FileEntry | null>(null);

    const { infoText, setInfoText } = useFilePicker();

    async function onDoubleClick(entry: FileEntry) {
        // Datei
        if (!entry.isDirectory) {
            try {
                const content = await window.fileSystem.readFile(entry.path);

                console.log("Loaded:", content);
            } catch (error) {
                console.error("Failed to read file:", error);
            }

            return;
        }

        // Ordner
        try {
            const infoPath = `${entry.path}/info.txt`;

const info = await window.fileSystem.readFile(infoPath);

// info.txt gefunden
console.log("info.txt:", info);

setSelectedEntry(entry);
setInfoText(info);
} catch {
    // Keine info.txt gefunden
    // -> Ordner öffnen

    setCurrentPath(entry.path);
    setSelectedEntry(null);
    setInfoText("");
}
}

useEffect(() => {
    if (!currentPath) {
        return;
    }

    window.fileSystem
        .readDirectory(currentPath)
        .then(setEntries)
        .catch((error) => {
            console.error("Failed to read directory:", error);
        });
}, [currentPath]);

return (
    <div className="overlay">
        <div className="overlay-content">

            <button onClick={onClose}>
                X
            </button>

            <h2>File Picker</h2>

            <p>Current path: {currentPath}</p>

            {/* Dateien / Ordner */}
            {entries.map((entry) => (
                <button
                    key={entry.path}
                    onDoubleClick={() => onDoubleClick(entry)}
                >
                    {entry.isDirectory ? "📁" : "📄"} {entry.name}
                </button>
            ))}

            {/* Info */}
            {selectedEntry && (
                <div className="info-tab">
                    <h3>{selectedEntry.name}</h3>

                    <pre>{infoText}</pre>
                </div>
            )}

        </div>
    </div>
);
}
