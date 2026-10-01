import { useEffect, useState } from "react";

function MyComponent() {
    const [content, setContent] = useState("");

    useEffect(() => {
        async function loadFile() {
            try {
                const text = await window.fileSystem.readFile("myfile.txt");
                setContent(text);
            } catch (error) {
                console.error("Failed to read file:", error);
            }
        }

        loadFile();
    }, []);

    return content;
}

export default MyComponent;