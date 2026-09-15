"use client";

import { useEffect, useRef } from "react";
import { getReverseVideoPath } from "@/lib/videos";

interface LoopVideoProps {
  src: string;
  reverseSrc?: string;
  className?: string;
}

export function LoopVideo({
  src,
  reverseSrc = getReverseVideoPath(src),
  className = "",
}: LoopVideoProps) {
  const forwardRef = useRef<HTMLVideoElement>(null);
  const reverseRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const forward = forwardRef.current;
    const reverse = reverseRef.current;
    if (!forward || !reverse) return;

    const setupVideo = (video: HTMLVideoElement) => {
      video.muted = true;
      video.defaultMuted = true;
      video.playsInline = true;
      video.loop = false;
      video.preload = "auto";
    };

    setupVideo(forward);
    setupVideo(reverse);

    const showForward = () => {
      reverse.pause();
      reverse.currentTime = 0;
      forward.style.opacity = "1";
      reverse.style.opacity = "0";
    };

    const showReverse = () => {
      forward.pause();
      forward.currentTime = 0;
      forward.style.opacity = "0";
      reverse.style.opacity = "1";
    };

    const playForward = () => {
      showForward();
      forward.currentTime = 0;
      void forward.play().catch(() => {});
    };

    const playReverse = () => {
      showReverse();
      reverse.currentTime = 0;
      void reverse.play().catch(() => {});
    };

    const handleForwardEnded = () => playReverse();
    const handleReverseEnded = () => playForward();

    forward.addEventListener("ended", handleForwardEnded);
    reverse.addEventListener("ended", handleReverseEnded);

    reverse.load();

    if (forward.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) {
      playForward();
    } else {
      forward.addEventListener("loadeddata", playForward, { once: true });
    }

    return () => {
      forward.removeEventListener("ended", handleForwardEnded);
      reverse.removeEventListener("ended", handleReverseEnded);
      forward.removeEventListener("loadeddata", playForward);
    };
  }, [src, reverseSrc]);

  const videoClassName = `${className} absolute inset-0`;

  return (
    <div className="relative h-full w-full">
      <video
        ref={forwardRef}
        src={src}
        muted
        playsInline
        autoPlay
        preload="auto"
        aria-hidden
        className={videoClassName}
      />
      <video
        ref={reverseRef}
        src={reverseSrc}
        muted
        playsInline
        preload="auto"
        aria-hidden
        className={`${videoClassName} opacity-0`}
      />
    </div>
  );
}
