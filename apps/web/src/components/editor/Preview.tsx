import { useEditorStore } from "../../store/editor";

function formatTime(s: number) {
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  const ms = Math.floor((s % 1) * 100);
  return `${m.toString().padStart(2, "0")}:${sec.toString().padStart(2, "0")}.${ms.toString().padStart(2, "0")}`;
}

export function Preview() {
  const { currentTime, duration, timelineClips, mediaItems } = useEditorStore();

  const activeClip = timelineClips.find(
    (c) => currentTime >= c.startTime && currentTime < c.startTime + c.duration
  );
  const activeMedia = activeClip ? mediaItems.find((m) => m.id === activeClip.mediaId) : null;

  return (
    <div className="flex flex-col h-full bg-[#111] items-center justify-center p-4">
      <div className="relative w-full max-w-[640px] aspect-video bg-black rounded overflow-hidden">
        {activeMedia?.type === "image" ? (
          <img src={activeMedia.url} className="w-full h-full object-contain" alt="" />
        ) : activeMedia?.type === "video" ? (
          <div className="flex items-center justify-center h-full text-zinc-600 text-sm">
            {activeMedia.name}
          </div>
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-zinc-700 text-sm">No clip at playhead</p>
          </div>
        )}
        <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs font-mono px-2 py-0.5 rounded">
          {formatTime(currentTime)} / {formatTime(duration)}
        </div>
      </div>
    </div>
  );
}
