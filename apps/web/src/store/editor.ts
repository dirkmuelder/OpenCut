import { create } from "zustand";

export type MediaType = "video" | "audio" | "image";

export interface MediaItem {
  id: string;
  name: string;
  type: MediaType;
  url: string;
  duration: number;
  thumbnail?: string;
}

export interface TimelineClip {
  id: string;
  mediaId: string;
  trackIndex: number;
  startTime: number;
  duration: number;
  trimStart: number;
  trimEnd: number;
}

interface EditorState {
  mediaItems: MediaItem[];
  timelineClips: TimelineClip[];
  currentTime: number;
  duration: number;
  isPlaying: boolean;
  zoom: number;
  selectedClipId: string | null;

  addMedia: (item: MediaItem) => void;
  removeMedia: (id: string) => void;
  addClipToTimeline: (mediaId: string) => void;
  removeClip: (id: string) => void;
  setCurrentTime: (t: number) => void;
  setIsPlaying: (v: boolean) => void;
  setZoom: (z: number) => void;
  setSelectedClip: (id: string | null) => void;
  updateClip: (id: string, patch: Partial<TimelineClip>) => void;
}

export const useEditorStore = create<EditorState>((set, get) => ({
  mediaItems: [],
  timelineClips: [],
  currentTime: 0,
  duration: 60,
  isPlaying: false,
  zoom: 80,
  selectedClipId: null,

  addMedia: (item) =>
    set((s) => ({ mediaItems: [...s.mediaItems, item] })),

  removeMedia: (id) =>
    set((s) => ({
      mediaItems: s.mediaItems.filter((m) => m.id !== id),
      timelineClips: s.timelineClips.filter((c) => c.mediaId !== id),
    })),

  addClipToTimeline: (mediaId) => {
    const { mediaItems, timelineClips } = get();
    const media = mediaItems.find((m) => m.id === mediaId);
    if (!media) return;
    const lastEnd = timelineClips
      .filter((c) => c.trackIndex === 0)
      .reduce((max, c) => Math.max(max, c.startTime + c.duration), 0);
    const clip: TimelineClip = {
      id: crypto.randomUUID(),
      mediaId,
      trackIndex: 0,
      startTime: lastEnd,
      duration: media.duration,
      trimStart: 0,
      trimEnd: media.duration,
    };
    set((s) => ({ timelineClips: [...s.timelineClips, clip] }));
  },

  removeClip: (id) =>
    set((s) => ({ timelineClips: s.timelineClips.filter((c) => c.id !== id) })),

  setCurrentTime: (t) => set({ currentTime: Math.max(0, t) }),
  setIsPlaying: (v) => set({ isPlaying: v }),
  setZoom: (z) => set({ zoom: Math.max(20, Math.min(300, z)) }),
  setSelectedClip: (id) => set({ selectedClipId: id }),

  updateClip: (id, patch) =>
    set((s) => ({
      timelineClips: s.timelineClips.map((c) =>
        c.id === id ? { ...c, ...patch } : c
      ),
    })),
}));
