"use client";

import { ImageIcon, Mic, RefreshCw, Trash2, Loader2, Volume2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

interface Scene {
  _id: Id<"scenes">;
  narrationText: string;
  imagePrompt: string;
  imageAssetUrl?: string;
  duration?: number;
}

export default function SceneBlock({
  scene,
  index,
  onUpdate
}: {
  scene: any;
  index: number;
  onUpdate: (data: Partial<Scene>) => void 
}) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isGeneratingAudio, setIsGeneratingAudio] = useState(false);
  const updateSceneAsset = useMutation(api.videos.updateSceneAsset);

  const handleGenerateAudio = async () => {
    setIsGeneratingAudio(true);
    try {
      const response = await fetch("/api/generate-audio", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: scene.narrationText, sceneId: scene._id })
      });
      const data = await response.json();
      if (data.audioUrl) {
        if(scene._id) {
            await updateSceneAsset({ sceneId: scene._id, audioAssetUrl: data.audioUrl });
        }
        onUpdate({ audioAssetUrl: data.audioUrl });
      }
    } catch (e) {
      console.error("Failed to generate audio", e);
    } finally {
      setIsGeneratingAudio(false);
    }
  };

  const handleGenerateImage = async () => {
    setIsGenerating(true);
    try {
      const response = await fetch("/api/generate-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: scene.imagePrompt, sceneId: scene._id })
      });
      const data = await response.json();
      if (data.imageUrl) {
        if(scene._id) {
            await updateSceneAsset({ sceneId: scene._id, imageAssetUrl: data.imageUrl });
        }
        onUpdate({ imageAssetUrl: data.imageUrl });
      }
    } catch (e) {
      console.error("Failed to generate image", e);
    } finally {
      setIsGenerating(false);
    }
  };
  return (
    <div className="border rounded-xl bg-white shadow-sm overflow-hidden flex flex-col group relative">
      <div className="px-3 py-2 bg-gray-50 border-b flex items-center justify-between text-xs text-gray-500 font-medium">
        <span>Scene {index}</span>
        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button className="hover:text-red-500 transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
        </div>
      </div>
      
      <div className="p-3 space-y-3">
        {/* Narration Editor */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span className="flex items-center gap-1.5"><Mic className="w-3.5 h-3.5" /> Narration</span>
            <button 
              onClick={handleGenerateAudio} 
              disabled={isGeneratingAudio}
              className="text-primary hover:bg-primary/10 p-1 rounded transition-colors" 
              title="Generate Audio"
            >
              {isGeneratingAudio ? <Loader2 className="w-3 h-3 animate-spin"/> : <Volume2 className="w-3 h-3" />}
            </button>
          </div>
          <textarea
            value={scene.narrationText}
            onChange={(e) => onUpdate({ narrationText: e.target.value })}
            className="w-full text-sm resize-none bg-transparent border-none focus:ring-0 p-0 text-gray-800 focus:outline-none"
            rows={3}
            placeholder="What does the voiceover say?"
          />
        </div>

        <div className="h-px bg-gray-100 w-full" />

        {/* Visual/Image Prompt Editor */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span className="flex items-center gap-1.5"><ImageIcon className="w-3.5 h-3.5" /> Visual Prompt</span>
            <button onClick={handleGenerateImage} disabled={isGenerating} className="text-primary hover:bg-primary/10 p-1 rounded transition-colors" title="Generate Image">
                {isGenerating ? <Loader2 className="w-3 h-3 animate-spin"/> : <RefreshCw className="w-3 h-3" />}
            </button>
          </div>
          <div className="flex gap-3">
            <div className="w-16 h-16 bg-gray-100 rounded-md border flex items-center justify-center shrink-0 text-gray-400 overflow-hidden relative">
               {scene.imageAssetUrl ? (
                 <img src={scene.imageAssetUrl} alt="Visual" className="w-full h-full object-cover" />
               ) : (
                 <ImageIcon className="w-6 h-6 opacity-50" />
               )}
            </div>
            <textarea
              value={scene.imagePrompt}
              onChange={(e) => onUpdate({ imagePrompt: e.target.value })}
              className="w-full text-xs resize-none bg-transparent border-none focus:ring-0 p-0 text-gray-600 focus:outline-none leading-relaxed"
              rows={3}
              placeholder="Describe the image you want generated..."
            />
          </div>
        </div>
      </div>
    </div>
  );
}