import {useMedia} from "../hooks/useMediaType.tsx";

function MediaThumbnail({ url, imageIndex }: { url: string, imageIndex: number }) {
    const { type, youtubeId, handleImageError } = useMedia(url);

    if (type === "image") {
        return (
            <img
                className={"tierlist-image"}
                src={url}
                key={imageIndex}
                alt=""
                onError={handleImageError}
            />
        );
    }

    if (type === "youtube" && youtubeId) {
        return (
            <img
                className={"tierlist-image"}
                key={imageIndex}
                src={`https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg`}
                alt=""
            />
        );
    }

    if (type === "video") {
        // Hier könntest du später ein Video-Thumbnail erzeugen
        return <p>Video</p>;
    }

    return <p>Medium konnte nicht geladen werden.</p>;
}
export default MediaThumbnail