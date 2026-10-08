
import {useMedia} from "../hooks/useMediaType.tsx";

function Media({ url }: { url: string }) {

    const { type, youtubeId, handleImageError } = useMedia(url);

    if (type === "image") {
        return (
            <img
                src={url}
                alt=""
                onError={handleImageError}
            />
        );
    }

    if (type === "youtube" && youtubeId) {
        return (
            <iframe
                width="560"
                height="315"
                src={`https://www.youtube.com/embed/${youtubeId}`}
        title="YouTube video"
    allowFullScreen
    />
);
}

if (type === "video") {
    return (
        <video controls>
            <source src={url} />
        </video>
    );
}

return <p>Medium konnte nicht geladen werden.</p>;

}

export default Media;