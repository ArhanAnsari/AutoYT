"use client";

import { Play, Pause, SkipBack, Volume2 } from "lucide-react";

export default function VideoPreview() {
  // In the future, this will mount the <Player /> from Remotion
  return (
    <div className="w-full max-w-2xl bg-white p-4 rounded-2xl shadow-sm border space-y-4">
      <div className="aspect-video bg-black rounded-xl border-4 border-gray-900 flex items-center justify-center relative overflow-hidden group">
        <div className="text-white/50 text-sm flex flex-col items-center gap-2">
            <span className="p-3 bg-white/10 rounded-full backdrop-blur-md">
                <Play className="w-6 h-6 fill-current" />
            </span>
            Waiting for rendered assets...
        </div>
        
        {/* Mock Subtitles */}
        <div className="absolute bottom-6 left-0 right-0 text-center">
            <span className="bg-black/60 text-white font-bold text-lg px-2 py-1 rounded shadow-lg backdrop-blur-sm">
                Have you ever wondered...
            </span>
        </div>
      </div>

      <div className="flex items-center justify-between px-2">
        <div className="flex items-center gap-3">
          <button className="h-8 w-8 flex items-center justify-center hover:bg-gray-100 rounded-full text-gray-700 transition">
            <SkipBack className="w-4 h-4" />
          </button>
          <button className="h-10 w-10 flex items-center justify-center bg-primary hover:bg-primary/90 rounded-full text-white shadow transition-transform active:scale-95">
            <Play className="w-4 h-4 fill-current" />
          </button>
          <span className="text-sm text-gray-500 font-mono">00:00 / 03:45</span>
        </div>
        
        <div className="flex items-center gap-2 text-gray-500 group">
          <Volume2 className="w-4 h-4" />
          <div className="w-24 h-1.5 bg-gray-200 rounded-full overflow-hidden">
             <div className="w-2/3 h-full bg-primary" />
          </div>
        </div>
      </div>
    </div>
  );
}