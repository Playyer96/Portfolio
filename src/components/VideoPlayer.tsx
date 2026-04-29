import React from "react";
import ReactPlayer from "react-player";
import { VideoPlayerProps } from "../types";

/**
 * VideoPlayer Component
 *
 * Simple wrapper around ReactPlayer with responsive sizing
 * Provides playback controls for various video URL formats
 */
const VideoPlayer: React.FC<VideoPlayerProps> = ({ url }) => {
  return (
    <div className="video-player">
      <ReactPlayer
        src={url}
        width="auto"
        height="auto"
        controls
      />
    </div>
  );
};

export default VideoPlayer;
