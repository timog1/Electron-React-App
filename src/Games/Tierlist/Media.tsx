
import {useMedia} from "../hooks/useMediaType.tsx";
import VideoPlayer from "../Components/videoPlayer.tsx";
import {connection} from "../../hooks/ConnectionLayer.ts";

function Media({ url, isMP3, isHost }: { url: string, isMP3: boolean, isHost: boolean }) {

    const { type, youtubeId, handleImageError } = useMedia(url);
    console.log("url:" + url)
    function onPlay(){
        window.steam.broadcastMessage("Play")
        connection.broadcast("VIDEO_PLAY", 1)
    }
    function onPause(){
        connection.broadcast("VIDEO_PAUSE", 1)
    }

    if (type === "image") {
        return (
            <img
                src={url}
                alt=""
                onLoad={() => console.log("IMAGE LOADED:", url)}
                onError={(e) => {
                    console.error("IMAGE FAILED:", {
                        url,
                        currentSrc: e.currentTarget.currentSrc,
                    });
                    handleImageError();
                }}
                style={{ maxWidth: "100%" }}
            />
        );
    }

    if (type === "youtube" && youtubeId) {
        return (
            <>
                {/* Custom player */}
                <VideoPlayer
                    videoId={youtubeId}
                    isMP3={isMP3}
                    isRevealed={false}
                    isHost={isHost}
                    onPause={onPause}
                    onPlay={onPlay}
                />

                {/* Working iframe for comparison */}

            </>
        );
    }

    if (type === "video") {
        return (
            <video controls>
                <source src={url}/>
            </video>
        );
    }

    return <p>Medium konnte nicht geladen werden.</p>;

}

export default Media;