
import YouTube from "react-youtube";
import { useRef, useState} from "react";
import type youtubePlayer from "youtube-player";
import "./videoPlayer.css"
import {useGameMessage} from "../../hooks/MessageProvider.tsx";
type Player = ReturnType<typeof youtubePlayer>;
const opts = {
  playerVars: {
    autoplay: 0,
    controls: 0,
    disablekb: 1,
    fs: 0,
    playsinline: 1,
    rel: 0,
    cc_load_policy: 0,
  },
} as const;
type Props = {
  videoId: string;
  isHost: boolean;
  isMP3: boolean;
  isRevealed: boolean;
  onPlay: () => void;
  onPause: () => void;
};

function VideoPlayer({
  videoId,
  isHost,
  isMP3,
  isRevealed,
  onPlay,
  onPause,
}: Props) {
  const playerRef = useRef<Player | null>(null);
  const [playing, setPlaying] = useState(false);
  const [ready, setReady] = useState(false);
    const [volume, setVolume] = useState(50);

    useGameMessage("VIDEO_PLAY", (message, from) => {setPlaying(true);
        const player = playerRef.current;
        console.log(player)
        if (!player) return;

        void player.playVideo();
        });
    useGameMessage("VIDEO_PAUSE", (message, from) => {setPlaying(false);
        const player = playerRef.current;
        console.log(player)
        if (!player) return;

        void player.pauseVideo();
        });

        return (
      <div className="video">
          <div className="video-wrapper">
              <YouTube
                  videoId={videoId}
                  opts={opts}
                  onReady={(event) => {

                      playerRef.current = event.target;
                      setReady(true);
                  }}
                  onPlay={() => {
                      setPlaying(true);

                      onPlay();
                  }}
                  onPause={() => {
                      setPlaying(false);

                      onPause();
                  }}
                  onEnd={() => setPlaying(false)}
              />

              <div className="video-overlay">

                  {isMP3 && !isRevealed && (
                      <div className="black-overlay"/>
                  )}
              </div>
          </div>

          <div className="Controls">
          <label htmlFor="volume">Volume: {volume}%</label>
          <input
              id="volume"
              type="range"
              min="0"
              max="100"
              value={volume}
              onChange={(e) => {
                  const newVolume = Number(e.target.value);
                  setVolume(newVolume);

                  if (playerRef.current) {
                      playerRef.current.setVolume(newVolume);
                  }

              }}
          />
          {isHost && (
              <div className="host-controls">
                  <button
                      type="button"
                      disabled={!ready}
                      onClick={() => {
                          const player = playerRef.current;
                          if (!player) return;

                          if (playing) {
                              void player.pauseVideo();
                          } else {
                              void player.playVideo();
                          }
                      }}
                  >
                      {playing ? "Stop" : "Start"}
                  </button>
              </div>
          )}
          </div>
      </div>
  );
}

export default VideoPlayer;
