
import { useMedia } from "../hooks/useMediaType.tsx";
import "./MediaThumbnail.css";

function MediaThumbnail({
                            url,
                            imageIndex,
                            imageText
                        }: {
    url: string;
    imageIndex: number;
    imageText: string;
}) {
    const { type, youtubeId, handleImageError } = useMedia(url);

    if (type === "image") {
        return (
            <div className="pictureDiv">
                <img
                    className="tierlist-image"
                    src={url}
                    key={imageIndex}
                    alt=""
                    onError={handleImageError}
                />
                <div className="textbackground">
                    <p className="ImageText">{imageText}</p>
                </div>
            </div>
        );
    }

    if (type === "youtube" && youtubeId) {
        return (
            <div className="pictureDiv">
                <img
                    className="tierlist-image"
                    src={`https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg`}
                    key={imageIndex}
                    alt=""
                />
                <div className="textbackground">
                    <p className="ImageText">{imageText}</p>
                </div>
            </div>
        );
    }

    if (type === "video") {
        return <p>Video</p>;
    }

    return <p>Medium konnte nicht geladen werden.</p>;
}

export default MediaThumbnail;
