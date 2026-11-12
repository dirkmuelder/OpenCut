import { useRef, useCallback } from "react";
import { ZoomIn, ZoomOut, Scissors } from "lucide-react";
import { useEditorStore } from "../../store/editor";

const TRACK_HEIGHT = 44;
const RULER_HEIGHT = 24;
const TRACK_LABEL_WIDTH = 60;
const TRACK_COUNT = 3;

const CLIP_COLORS = ["bg-blue-600","bg-purple-600","bg-emerald-600","bg-amber-600","bg-rose-600"];

function formatRulerTime(s: number) {
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return m > 0 ? `${m}:${sec.toString().padStart(2, "0")}` : `${sec}s`;
}

export function Timeline() {
  const {
    timelineClips, mediaItems, currentTime, duration, zoom,
    setCurrentTime, setZoom, removeClip, selectedClipId, setSelectedClip,
  } = useEditorStore();

  const totalWidth = duration * zoom;
  const rulerTicks = Array.from({ length: Math.ceil(duration) + 1 }, (_, i) => i);

  const handleRulerClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left - TRACK_LABEL_WIDTH;
    setCurrentTime(Math.max(0, Math.min(duration, x / zoom)));
  }, [zoom, duration, setCurrentTime]);

  const playheadLeft = currentTime * zoom;

  return (
    <div className="flex flex-col h-full bg-[#141414] border-t border-[#2a2a2a] select-none">
      <div className="flex items-center gap-2 px-3 py-1.5 border-b border-[#2a2a2a]">
        <button onClick={() => setZoom(zoom - 20)} className="p-1 text-zinc-500 hover:text-white"><ZoomOut className="w-3.5 h-3.5" /></button>
        <span className="text-xs text-zinc-600 w-10 text-center">{zoom}px/s</span>
        <button onClick={() => setZoom(zoom + 20)} className="p-1 text-zinc-500 hover:text-white"><ZoomIn className="w-3.5 h-3.5" /></button>
        <div className="w-px h-4 bg-[#2a2a2a] mx-1" />
        {selectedClipId && (
          <button onClick={() => { removeClip(selectedClipId); setSelectedClip(null); }} className="p-1 text-zinc-500 hover:text-red-400" title="Delete clip">
            <Scissors className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      <div className="flex-1 overflow-auto">
        <div style={{ minWidth: totalWidth + TRACK_LABEL_WIDTH + 40 }}>
          {/* Ruler */}
          <div className="flex sticky top-0 z-10 bg-[#141414] border-b border-[#2a2a2a] cursor-pointer" style={{ height: RULER_HEIGHT }} onClick={handleRulerClick}>
            <div style={{ width: TRACK_LABEL_WIDTH }} className="shrink-0" />
            <div className="relative flex-1">
              {rulerTicks.map((s) => (
                <div key={s} className="absolute top-0 flex flex-col items-center" style={{ left: s * zoom - 1 }}>
                  <div className="w-px h-2 bg-[#3a3a3a]" />
                  <span className="text-[10px] text-zinc-600 mt-0.5 whitespace-nowrap">{formatRulerTime(s)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Tracks */}
          <div className="relative">
            {Array.from({ length: TRACK_COUNT }).map((_, trackIdx) => {
              const trackClips = timelineClips.filter((c) => c.trackIndex === trackIdx);
              return (
                <div key={trackIdx} className="flex border-b border-[#1f1f1f]" style={{ height: TRACK_HEIGHT }}>
                  <div style={{ width: TRACK_LABEL_WIDTH }} className="shrink-0 flex items-center justify-center border-r border-[#2a2a2a]">
                    <span className="text-[10px] text-zinc-600">Track {trackIdx + 1}</span>
                  </div>
                  <div className="relative flex-1 bg-[#181818]">
                    {trackClips.map((clip) => {
                      const media = mediaItems.find((m) => m.id === clip.mediaId);
                      const colorClass = CLIP_COLORS[clip.mediaId.charCodeAt(0) % CLIP_COLORS.length];
                      const isSelected = clip.id === selectedClipId;
                      return (
                        <div
                          key={clip.id}
                          className={`absolute top-1 bottom-1 rounded cursor-pointer ${colorClass} ${isSelected ? "ring-2 ring-white/60" : "opacity-80 hover:opacity-100"} transition-opacity overflow-hidden`}
                          style={{ left: clip.startTime * zoom, width: Math.max(4, clip.duration * zoom) }}
                          onClick={(e) => { e.stopPropagation(); setSelectedClip(clip.id); }}
                        >
                          <div className="px-1.5 pt-0.5">
                            <p className="text-[10px] text-white/90 truncate font-medium">{media?.name ?? "clip"}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
            {/* Playhead */}
            <div className="absolute top-0 bottom-0 z-20 pointer-events-none" style={{ left: TRACK_LABEL_WIDTH + playheadLeft }}>
              <div className="w-px h-full bg-red-500/80" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
