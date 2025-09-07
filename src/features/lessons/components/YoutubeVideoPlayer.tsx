"use client";
import YouTube from "react-youtube";

function YoutubeVideoPlayer({
  videoId,
  onFinishedVideo,
}: {
  videoId: string;
  onFinishedVideo?: () => void;
}) {
  return (
    <YouTube
      videoId={videoId}
      className="w-full h-full"
      opts={{ width: "100%", height: "100%" }}
      onEnd={onFinishedVideo}
    />
  );
}

export default YoutubeVideoPlayer;
