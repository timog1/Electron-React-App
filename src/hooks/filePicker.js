import { useState } from "react";

export function useFilePicker() {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);

    function openFilePicker() {
        setIsOpen(true);
    }

    function closeFilePicker() {
        setIsOpen(false);
    }

    function selectFile(file) {
        setSelectedFile(file);
        setIsOpen(false);
    }

    return {
        isOpen,
        selectedFile,
        openFilePicker,
        closeFilePicker,
        selectFile
    };
}