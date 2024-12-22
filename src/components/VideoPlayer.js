import React from "react";
import ReactPlayer from "react-player";

function VideoPlayer({ url }) {
  return (
    <div className="video-player">
      <ReactPlayer
        url={url}
        // max-width= "auto"
        // max-height= "auto"
        width="auto"
        max-height="auto"
        controls={true} // Add controls like play, pause, and volume
      />
    </div>
  );
}

export default VideoPlayer;
