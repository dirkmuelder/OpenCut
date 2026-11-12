import { Play, Pause, SkipBack, SkipForward } from "lucide-react";
import { useEditorStore } from "../../store/editor";

function formatTime(s: number) {
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m.toString().padStart(2, "0")}:${sec.toString().padStart(2, "0")}`;
}

export function Toolbar() {
  const { isPlaying, setIsPlaying, currentTime, duration, setCurrentTime } = useEditorStore();

  return (
    <div className="flex items-center gap-3 px-4 h-10 bg-[#1a1a1a] border-b border-[#2a2a2a] shrink-0">
      <button onClick={() => setCurrentTime(0)} className="text-zinc-500 hover:text-white transition-colors">
        <SkipBack className="w-4 h-4" />
      </button>
      <button onClick={() => setIsPlaying(!isPlaying)} className="text-white hover:text-zinc-200 transition-colors">
        {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
      </button>
      <button onClick={() => setCurrentTime(duration)} className="text-zinc-500 hover:text-white transition-colors">
        <SkipForward className="w-4 h-4" />
      </button>
      <div className="w-px h-4 bg-[#2a2a2a]" />
      <span className="text-xs font-mono text-zinc-400">
        {formatTime(currentTime)} / {formatTime(duration)}
      </span>
    </div>
  );
}
