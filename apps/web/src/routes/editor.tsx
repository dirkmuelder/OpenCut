import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef } from "react";
import { MediaPanel } from "../components/editor/MediaPanel";
import { Preview } from "../components/editor/Preview";
import { Timeline } from "../components/editor/Timeline";
import { Toolbar } from "../components/editor/Toolbar";
import { useEditorStore } from "../store/editor";

export const Route = createFileRoute("/editor")({ component: Editor });

function Editor() {
  const { isPlaying, currentTime, duration, setCurrentTime, setIsPlaying } = useEditorStore();
  const rafRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number | null>(null);

  // Playback loop using requestAnimationFrame
  useEffect(() => {
    if (!isPlaying) {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      lastTimeRef.current = null;
      return;
    }
    const tick = (now: number) => {
      if (lastTimeRef.current == null) lastTimeRef.current = now;
      const delta = (now - lastTimeRef.current) / 1000;
      lastTimeRef.current = now;
      const next = currentTime + delta;
      if (next >= duration) {
        setCurrentTime(duration);
        setIsPlaying(false);
        return;
      }
      setCurrentTime(next);
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [isPlaying]);

  return (
    <div className="flex flex-col h-screen w-screen bg-[#111] text-white overflow-hidden">
      <div className="flex items-center justify-between px-4 h-9 bg-[#161616] border-b border-[#2a2a2a] shrink-0">
        <span className="text-sm font-semibold tracking-tight">OpenCut</span>
        <span className="text-xs text-zinc-600">Untitled Project</span>
        <div />
      </div>
      <div className="flex flex-1 min-h-0">
        <div className="w-56 shrink-0 flex flex-col">
          <MediaPanel />
        </div>
        <div className="flex flex-col flex-1 min-w-0">
          <Toolbar />
          <div className="flex-1 min-h-0">
            <Preview />
          </div>
        </div>
      </div>
      <div className="h-48 shrink-0">
        <Timeline />
      </div>
    </div>
  );
}
