"use client";

import { useEffect, useRef, useState } from "react";
import { useCallStateHooks } from "@stream-io/video-react-sdk";

const MeetingRoomWrapper = ({ children }: { children: React.ReactNode }) => {
  const wakeLockRef = useRef<any>(null);
  const miniRef = useRef<HTMLDivElement>(null);

  const [showOverlay, setShowOverlay] = useState(false);
  const [drag, setDrag] = useState({ x: 20, y: 80 });
  const [isDragging, setIsDragging] = useState(false);

  const { useDominantSpeaker } = useCallStateHooks();
  const dominantSpeaker = useDominantSpeaker();

  // WakeLock
  const requestWakeLock = async () => {
    try {
      if ("wakeLock" in navigator) {
        wakeLockRef.current = await navigator.wakeLock.request("screen");
      }
    } catch {}
  };

  // Background audio (Android Chrome)
  const enableBackgroundAudio = () => {
    const audio = document.createElement("audio");
    audio.src = "/silent.mp3";
    audio.loop = true;
    audio.play().catch(() => {});
  };

  useEffect(() => {
    requestWakeLock();
    enableBackgroundAudio();

    const handleVis = () => {
      setShowOverlay(document.hidden); // This is the core behavior
      if (!document.hidden) requestWakeLock();
    };

    document.addEventListener("visibilitychange", handleVis);

    return () => {
      document.removeEventListener("visibilitychange", handleVis);
      wakeLockRef.current?.release?.();
    };
  }, []);

  // Dragging logic
  const onDragStart = () => setIsDragging(true);
  const onDragEnd = () => setIsDragging(false);

  const onDrag = (e: any) => {
    if (!isDragging) return;
    setDrag({
      x: Math.max(10, e.clientX - 50),
      y: Math.max(10, e.clientY - 50),
    });
  };

  return (
    <div onMouseMove={onDrag} className="w-full h-full relative">

      {/* FULL MEETING UI */}
      {children}

      {/* FLOATING MINI OVERLAY (appears only when tab hidden) */}
      {showOverlay && (
        <div
          ref={miniRef}
          onMouseDown={onDragStart}
          onMouseUp={onDragEnd}
          onClick={() => {
            if (!isDragging) window.focus(); // return to tab
          }}
          className={`
            fixed z-[99999] cursor-pointer rounded-full 
            shadow-lg overflow-hidden transition-all duration-300
            ${dominantSpeaker ? "ring-4 ring-blue-400" : ""}
          `}
          style={{
            width: 65,
            height: 65,
            left: drag.x,
            top: drag.y,
          }}
        >
          <div className="w-full h-full bg-black/60 flex items-center justify-center text-white text-sm">
            Live
          </div>
        </div>
      )}
    </div>
  );
};

export default MeetingRoomWrapper;
