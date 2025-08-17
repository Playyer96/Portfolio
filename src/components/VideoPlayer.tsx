import React from "react";
import ReactPlayer from "react-player";

interface VideoPlayerProps {
  url: string;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ url }) => {
  return (
    <div className="video-player">
      <ReactPlayer
        url={url}
        width="auto"
        height="auto"
        controls={true} // Add controls like play, pause, and volume
      />
    </div>
  );
};

export default VideoPlayer;