

import {  useState } from "react";

export type MediaType = "image" | "video" | "youtube" | "unknown";

export function getYoutubeId(url: string): string | null {
    try {
        const parsed = new URL(url);

        if (parsed.hostname === "youtu.be") {
            return parsed.pathname.slice(1);
        }

        if (parsed.hostname.includes("youtube.com")) {
            return parsed.searchParams.get("v");
        }

        return null;
    } catch {
        return null;
    }
}

export function useMedia(url: string) {
    const [type, setType] = useState<MediaType>("image");



    const handleImageError = () => {
        const youtubeId = getYoutubeId(url);

        if (youtubeId) {
            setType("youtube");
        } else {
            setType("video");
        }
    };

    const youtubeId = getYoutubeId(url);

    return {
        type,
        youtubeId,
        handleImageError,
    };
}

