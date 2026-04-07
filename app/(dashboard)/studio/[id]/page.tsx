"use client";

import { useState, useEffect, use } from "react";
import { Button } from "@/components/ui/button";
import { Play, Sparkles, Image as ImageIcon, Volume2, Save, Download, Loader2, Upload, Clock, BarChart3 } from "lucide-react";
import SceneBlock from "@/components/studio/SceneBlock";
import VideoPreview from "@/components/studio/VideoPreview";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

export default function StudioPage({ params }: { params: Promise<{ id: string }> }) {
  const unwrappedParams = use(params);
  const videoId = unwrappedParams.id as Id<"videos">;
  
  const videoData = useQuery(api.videos.getVideoWithScenes, { videoId });
  const [localScenes, setLocalScenes] = useState<any[]>([]);
  const [isAssembling, setIsAssembling] = useState(false);
  const [isUploadingYT, setIsUploadingYT] = useState(false);
  const [isSyncingStats, setIsSyncingStats] = useState(false);
  const [assemblyStatus, setAssemblyStatus] = useState("");
  const [scheduleDate, setScheduleDate] = useState<string>("");
  const [showScheduleModal, setShowScheduleModal] = useState(false);

  const updateVideoMetadata = useMutation(api.videos.updateVideoMetadata as any);
  const scheduleVideoForPublishing = useMutation(api.videos.scheduleVideoForPublishing as any);

  useEffect(() => {
    if (videoData?.scenes) {
      setLocalScenes(videoData.scenes);
    }
  }, [videoData]);

  const handleAssembleVideo = async () => {
    setIsAssembling(true);
    setAssemblyStatus("Checking assets...");
    
    try {
      setAssemblyStatus("Assembling video...");
      const response = await fetch("/api/assemble-video", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ videoId: videoId }),
      });

      const data = await response.json();

      if (!response.ok) {
        setAssemblyStatus(`Error: ${data.error}`);
        return;
      }

      setAssemblyStatus(`✅ Video assembled! URL: ${data.videoUrl}`);
      console.log("Video assembly result:", data);
    } catch (error) {
      console.error("Assembly error:", error);
      setAssemblyStatus(`Error: ${error}`);
    } finally {
      setIsAssembling(false);
    }
  };

  const handleScheduleVideo = async () => {
    if (!scheduleDate) {
      alert("Please select a date and time");
      return;
    }

    try {
      const publishAt = new Date(scheduleDate).getTime();
      await scheduleVideoForPublishing({
        videoId,
        publishAt,
      });
      alert("Video scheduled successfully!");
      setShowScheduleModal(false);
    } catch (error) {
      console.error("Scheduling error:", error);
      alert("Failed to schedule video");
    }
  };

  const handleUploadToYouTube = async () => {
    setIsUploadingYT(true);
    try {
      // Get video file from public/videos directory
      const response = await fetch("/api/upload-to-youtube", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          videoId,
          title: videoData?.title,
          description: videoData?.description || "",
          tags: videoData?.description?.split(",").map((t: string) => t.trim()) || [],
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        alert(`Upload failed: ${data.error}`);
        return;
      }

      alert(`✅ Video uploaded! Watch it: ${data.publishedUrl}`);
    } catch (error) {
      console.error("Upload error:", error);
      alert("Failed to upload to YouTube");
    } finally {
      setIsUploadingYT(false);
    }
  };

  const handleSyncYouTubeStats = async () => {
    setIsSyncingStats(true);
    try {
      const response = await fetch("/api/sync-youtube-stats", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ videoId }),
      });

      const data = await response.json();
      if (!response.ok) {
        alert(`Sync failed: ${data.error}`);
        return;
      }

      alert(
        `✅ Stats synced!\nViews: ${data.metrics.views}\nLikes: ${data.metrics.likes}\nComments: ${data.metrics.comments}`
      );
    } catch (error) {
      console.error("Sync error:", error);
      alert("Failed to sync YouTube stats");
    } finally {
      setIsSyncingStats(false);
    }
  };

  if (videoData === undefined) {
    return <div className="h-full flex items-center justify-center">Loading Studio...</div>;
  }

  if (videoData === null) {
    return <div className="h-full flex items-center justify-center">Video not found.</div>;
  }

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] -m-6 bg-gray-100">
      {/* Studio Topbar */}
      <div className="h-14 border-b bg-white flex items-center justify-between px-6 shrink-0 overflow-x-auto">
        <div className="flex items-center gap-4 min-w-0">
          <h1 className="font-semibold text-lg max-w-[400px] truncate" title={videoData.title}>
             Project: {videoData.title}
          </h1>
          <span className="px-2 py-0.5 bg-yellow-100 text-yellow-800 text-xs rounded-full font-medium whitespace-nowrap">
             {videoData.status}
          </span>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0 ml-4">
          <Button variant="outline" size="sm" className="gap-2" onClick={handleSyncYouTubeStats} disabled={isSyncingStats}>
            {isSyncingStats ? <Loader2 className="w-4 h-4 animate-spin" /> : <BarChart3 className="w-4 h-4" />}
            <span className="text-xs hidden md:inline">Sync Stats</span>
          </Button>
          <Button variant="outline" size="sm" className="gap-2" onClick={() => setShowScheduleModal(true)}>
            <Clock className="w-4 h-4" />
            <span className="text-xs hidden md:inline">Schedule</span>
          </Button>
          <Button 
            size="sm" 
            className="gap-2" 
            onClick={handleUploadToYouTube}
            disabled={isUploadingYT}
          >
            {isUploadingYT ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
            <span className="text-xs hidden md:inline">Upload YT</span>
          </Button>
          <Button variant="outline" size="sm" className="gap-2">
            <Save className="w-4 h-4" />
            <span className="text-xs hidden md:inline">Save</span>
          </Button>
          <Button 
            size="sm" 
            className="gap-2" 
            onClick={handleAssembleVideo}
            disabled={isAssembling}
          >
            {isAssembling ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="text-xs hidden md:inline">Assembling...</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                <span className="text-xs hidden md:inline">Assemble</span>
              </>
            )}
          </Button>
        </div>
        {assemblyStatus && (
          <div className="text-xs text-gray-600 absolute bottom-2 right-20 max-w-xs truncate">
            {assemblyStatus}
          </div>
        )}
      </div>

      {/* Schedule Modal */}
      {showScheduleModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full">
            <h2 className="text-xl font-semibold mb-4">Schedule Video for Publishing</h2>
            <input
              type="datetime-local"
              value={scheduleDate}
              onChange={(e) => setScheduleDate(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg mb-4"
            />
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setShowScheduleModal(false)}>
                Cancel
              </Button>
              <Button onClick={handleScheduleVideo}>Schedule</Button>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-1 overflow-hidden">
        {/* Left/Center - Main Preview & Settings */}
        <div className="flex-1 flex flex-col min-w-0 bg-gray-50">
          <div className="flex-1 p-6 flex flex-col items-center justify-center">
             <VideoPreview />
          </div>
        </div>

        {/* Right Sidebar - Script & Scene Blocks */}
        <div className="w-[450px] border-l bg-white flex flex-col shrink-0">
          <div className="p-4 border-b bg-gray-50 flex items-center justify-between">
            <h2 className="font-semibold text-sm">Script & Scenes</h2>
            <Button variant="ghost" size="sm" className="h-8 text-xs text-primary gap-1">
              <Sparkles className="w-3 h-3" /> Auto-Enhance Script
            </Button>
          </div>
          
          <div className="flex-1 overflow-auto p-4 space-y-4">
            {localScenes.map((scene, idx) => (
              <SceneBlock 
                 key={scene._id || idx} 
                 scene={scene} 
                 index={idx + 1} 
                 onUpdate={(updatedData: any) => {
                   const newScenes = [...localScenes];
                   newScenes[idx] = { ...newScenes[idx], ...updatedData };
                   setLocalScenes(newScenes);
                 }}
              />
            ))}
            
            <Button variant="outline" className="w-full border-dashed text-gray-500 gap-2">
              + Add Scene Block
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}