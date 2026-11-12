import { useRef } from "react";
import { Film, Music, Image, Plus, Trash2, ArrowRight } from "lucide-react";
import { useEditorStore } from "../../store/editor";
import type { MediaItem, MediaType } from "../../store/editor";
import { Button } from "../ui/button";
import { ScrollArea } from "../ui/scroll-area";

const ICONS: Record<MediaType, React.ReactNode> = {
  video: <Film className="w-4 h-4" />,
  audio: <Music className="w-4 h-4" />,
  image: <Image className="w-4 h-4" />,
};

function formatDuration(s: number) {
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec.toString().padStart(2, "0")}`;
}

export function MediaPanel() {
  const { mediaItems, addMedia, removeMedia, addClipToTimeline } = useEditorStore();
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = (files: FileList | null) => {
    if (!files) return;
    Array.from(files).forEach((file) => {
      const url = URL.createObjectURL(file);
      const type: MediaType = file.type.startsWith("video/")
        ? "video"
        : file.type.startsWith("audio/")
        ? "audio"
        : "image";

      if (type === "video" || type === "audio") {
        const el = document.createElement(type === "video" ? "video" : "audio");
        el.src = url;
        el.onloadedmetadata = () => {
          addMedia({ id: crypto.randomUUID(), name: file.name, type, url, duration: el.duration });
        };
      } else {
        addMedia({ id: crypto.randomUUID(), name: file.name, type: "image", url, duration: 5 });
      }
    });
  };

  return (
    <div className="flex flex-col h-full bg-[#1a1a1a] border-r border-[#2a2a2a]">
      <div className="flex items-center justify-between px-3 py-2 border-b border-[#2a2a2a]">
        <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Media</span>
        <Button size="sm" variant="ghost" className="h-6 px-2 text-xs text-zinc-400 hover:text-white" onClick={() => inputRef.current?.click()}>
          <Plus className="w-3 h-3 mr-1" />Import
        </Button>
        <input ref={inputRef} type="file" multiple accept="video/*,audio/*,image/*" className="hidden" onChange={(e) => handleFiles(e.target.files)} />
      </div>
      <ScrollArea className="flex-1">
        {mediaItems.length === 0 ? (
          <div
            className="flex flex-col items-center justify-center h-40 m-3 border-2 border-dashed border-[#3a3a3a] rounded-lg cursor-pointer hover:border-zinc-500 transition-colors"
            onClick={() => inputRef.current?.click()}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => { e.preventDefault(); handleFiles(e.dataTransfer.files); }}
          >
            <Plus className="w-6 h-6 text-zinc-600 mb-2" />
            <p className="text-xs text-zinc-600">Drop files here</p>
          </div>
        ) : (
          <div className="p-2 space-y-1">
            {mediaItems.map((item) => (
              <div key={item.id} className="flex items-center gap-2 px-2 py-2 rounded hover:bg-[#2a2a2a] group cursor-pointer">
                <div className="text-zinc-500 shrink-0">{ICONS[item.type]}</div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-zinc-300 truncate">{item.name}</p>
                  <p className="text-xs text-zinc-600">{formatDuration(item.duration)}</p>
                </div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="p-1 text-zinc-500 hover:text-white" onClick={() => addClipToTimeline(item.id)} title="Add to timeline">
                    <ArrowRight className="w-3 h-3" />
                  </button>
                  <button className="p-1 text-zinc-500 hover:text-red-400" onClick={() => removeMedia(item.id)} title="Remove">
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  );
}
