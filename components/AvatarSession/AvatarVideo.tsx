import React, { forwardRef, useState } from "react";
import { ConnectionQuality } from "@heygen/streaming-avatar";

import { useConnectionQuality } from "../logic/useConnectionQuality";
import { useStreamingAvatarSession } from "../logic/useStreamingAvatarSession";
import { StreamingAvatarSessionState } from "../logic";
import { CloseIcon } from "../Icons";
import { Button } from "../Button";

export const AvatarVideo = forwardRef<HTMLVideoElement>(({}, ref) => {
  const { sessionState, stopAvatar } = useStreamingAvatarSession();
  const { connectionQuality } = useConnectionQuality();
  const [isPaused, setIsPaused] = useState(false);

  const isLoaded = sessionState === StreamingAvatarSessionState.CONNECTED;

  const handlePauseResume = () => {
    const video = (ref as React.RefObject<HTMLVideoElement>).current;
    if (!video) return;
    if (video.paused) {
      video.play();
      setIsPaused(false);
    } else {
      video.pause();
      setIsPaused(true);
    }
  };

  return (
    <>
      {connectionQuality !== ConnectionQuality.UNKNOWN && (
        <div className="absolute top-3 left-3 bg-black text-white rounded-lg px-3 py-2">
          Connection Quality: {connectionQuality}
        </div>
      )}
      {isLoaded && (
        <>
          <Button
            className="absolute top-3 right-3 !p-2 bg-slate-800/60 hover:bg-slate-700/80 backdrop-blur-sm border border-slate-600 z-10"
            onClick={stopAvatar}
          >
            <CloseIcon />
          </Button>
          <Button
            className="absolute top-3 right-14 !p-2 bg-slate-800/60 hover:bg-slate-700/80 backdrop-blur-sm border border-slate-600 z-10"
            onClick={handlePauseResume}
          >
            {isPaused ? "Resume" : "Pause"}
          </Button>
        </>
      )}
      <video
        ref={ref}
        autoPlay
        playsInline
        style={{
          width: "100%",
          height: "100%",
          objectFit: "contain",
        }}
      >
        {/* <track kind="captions" /> */}
      </video>
      {!isLoaded && (
        <div className="w-full h-full flex items-center justify-center absolute top-0 left-0">
          Loading...
        </div>
      )}
    </>
  );
});
AvatarVideo.displayName = "AvatarVideo";
