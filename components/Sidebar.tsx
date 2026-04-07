"use client";

import Link from "next/link";
import { PlusCircle, Home, Clapperboard, Calendar, Settings, Activity, X, BarChart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Sidebar() {
  const [isCreating, setIsCreating] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [topic, setTopic] = useState("");
  const [description, setDescription] = useState("");
  const [tone, setTone] = useState("professional");
  const router = useRouter();

  const handleCreateVideo = async () => {
    if (!topic.trim()) return;

    setIsCreating(true);
    try {
      const res = await fetch("/api/videos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic, description, tone })
      });
      const data = await res.json();
      
      if (data.videoId) {
        router.push(`/studio/${data.videoId}`);
        setShowModal(false);
        setTopic("");
        setDescription("");
      }
    } catch (e) {
      alert("Failed to create video.");
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <>
      <aside className="w-64 border-r bg-white flex flex-col z-10 shrink-0 h-screen sticky top-0">
        <div className="p-4 border-b flex items-center justify-between">
          <Link href="/" className="font-bold text-xl flex items-center gap-2">
            <span className="bg-primary text-white p-1 rounded">
              <Clapperboard className="w-5 h-5" />
            </span>
            AutoYT
          </Link>
        </div>
        
        <nav className="flex-1 p-4 space-y-1">
          <Link href="/dashboard" className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-100 text-gray-700 font-medium transition-colors">
            <Home className="w-5 h-5" />
            Dashboard
          </Link>
          <Link href="/calendar" className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-100 text-gray-700 font-medium transition-colors">
            <Calendar className="w-5 h-5" />
            Content Calendar
          </Link>
          <Link href="/generate" className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-100 text-gray-700 font-medium transition-colors">
            <PlusCircle className="w-5 h-5" />
            Generate Video
          </Link>
          <Link href="/automations" className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-100 text-gray-700 font-medium transition-colors">
            <Activity className="w-5 h-5" />
            Automations
          </Link>
          <Link href="/resources" className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-100 text-gray-700 font-medium transition-colors">
            <Clapperboard className="w-5 h-5" />
            Resources
          </Link>
          <Link href="/analytics" className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-100 text-gray-700 font-medium transition-colors">
            <BarChart className="w-5 h-5" />
            Analytics
          </Link>
          <Link href="/settings" className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-100 text-gray-700 font-medium transition-colors">
            <Settings className="w-5 h-5" />
            Settings
          </Link>
        </nav>

        <div className="p-4 border-t bg-gray-50/50">
          <Button 
            onClick={() => setShowModal(true)}
            disabled={isCreating} 
            className="w-full flex items-center gap-2 shadow-sm"
          >
            <PlusCircle className="w-4 h-4" />
            {isCreating ? "Generating..." : "New Video"}
          </Button>
        </div>
      </aside>

      {/* Enhanced Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-xl font-semibold">Create New Video</h2>
              <button 
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Video Topic *</label>
                <input
                  type="text"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="e.g., Top 5 AI Tools for 2024"
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  disabled={isCreating}
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Add more context or details (optional)"
                  rows={2}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  disabled={isCreating}
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Tone</label>
                <select 
                  value={tone}
                  onChange={(e) => setTone(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  disabled={isCreating}
                >
                  <option value="professional">Professional</option>
                  <option value="casual">Casual</option>
                  <option value="educational">Educational</option>
                  <option value="entertaining">Entertaining</option>
                </select>
              </div>
            </div>

            {/* Footer */}
            <div className="flex gap-3 p-6 border-t bg-gray-50/50">
              <Button 
                variant="outline" 
                onClick={() => setShowModal(false)}
                disabled={isCreating}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button 
                onClick={handleCreateVideo}
                disabled={!topic.trim() || isCreating}
                className="flex-1"
              >
                {isCreating ? "Creating..." : "Create"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}