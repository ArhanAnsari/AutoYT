"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Zap, CheckCircle, ChevronRight, Download } from "lucide-react";

interface GenerationStep {
  id: string;
  title: string;
  status: "pending" | "in-progress" | "completed" | "error";
  description?: string;
}

export default function GeneratePage() {
  const [topic, setTopic] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedVideo, setGeneratedVideo] = useState<{ id: string; title: string } | null>(null);
  
  const [steps, setSteps] = useState<GenerationStep[]>([
    { id: "1", title: "Generate Script", status: "pending", description: "AI creates hooks, intro, body, and CTA" },
    { id: "2", title: "Generate Images", status: "pending", description: "AI generates visuals for each scene" },
    { id: "3", title: "Generate Narration", status: "pending", description: "Text-to-speech conversion" },
    { id: "4", title: "Assemble Video", status: "pending", description: "Combine all assets with Remotion" },
    { id: "5", title: "Final Video", status: "pending", description: "Ready for upload to YouTube" },
  ]);

  const handleStartGeneration = async () => {
    if (!topic.trim()) return;

    setIsGenerating(true);
    setSteps(steps.map(s => ({ ...s, status: "pending" })));
    
    try {
      // Step 1: Generate Script
      setSteps(prev => prev.map((s, i) => i === 0 ? { ...s, status: "in-progress" } : s));
      await new Promise(r => setTimeout(r, 1000));
      setSteps(prev => prev.map((s, i) => i === 0 ? { ...s, status: "completed" } : s));

      // Step 2: Generate Images
      setSteps(prev => prev.map((s, i) => i === 1 ? { ...s, status: "in-progress" } : s));
      await new Promise(r => setTimeout(r, 1500));
      setSteps(prev => prev.map((s, i) => i === 1 ? { ...s, status: "completed" } : s));

      // Step 3: Generate Narration
      setSteps(prev => prev.map((s, i) => i === 2 ? { ...s, status: "in-progress" } : s));
      await new Promise(r => setTimeout(r, 1200));
      setSteps(prev => prev.map((s, i) => i === 2 ? { ...s, status: "completed" } : s));

      // Step 4: Assemble Video
      setSteps(prev => prev.map((s, i) => i === 3 ? { ...s, status: "in-progress" } : s));
      await new Promise(r => setTimeout(r, 2000));
      setSteps(prev => prev.map((s, i) => i === 3 ? { ...s, status: "completed" } : s));

      // Step 5: Final Video
      setSteps(prev => prev.map((s, i) => i === 4 ? { ...s, status: "in-progress" } : s));
      await new Promise(r => setTimeout(r, 800));
      setSteps(prev => prev.map((s, i) => i === 4 ? { ...s, status: "completed" } : s));

      // Set generated video
      setGeneratedVideo({
        id: "video_" + Date.now(),
        title: topic,
      });
    } catch (error) {
      setSteps(prev => prev.map(s => ({ ...s, status: "error" })));
    } finally {
      setIsGenerating(false);
    }
  };

  const getStepIcon = (status: GenerationStep["status"]) => {
    if (status === "completed") return <CheckCircle className="w-5 h-5 text-green-500" />;
    if (status === "in-progress") return <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />;
    return <div className="w-5 h-5 border-2 border-gray-300 rounded-full" />;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2 mb-2">
          <Zap className="w-6 h-6 text-primary" /> Generate Video
        </h1>
        <p className="text-gray-600">Create and publish videos in minutes</p>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Left: Input */}
        <div className="col-span-1 space-y-4">
          <div className="rounded-xl border bg-card text-card-foreground shadow p-6 space-y-4">
            <h2 className="font-semibold text-lg">Video Topic</h2>
            
            <textarea
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="What should your video be about? (e.g., 'Top 5 AI Tools for 2024')"
              rows={4}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              disabled={isGenerating}
            />

            <div className="space-y-2">
              <label className="text-sm font-medium">Video Length</label>
              <select className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent" disabled={isGenerating}>
                <option>2-3 minutes (standard)</option>
                <option>5-7 minutes (extended)</option>
                <option>10+ minutes (long-form)</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Tone</label>
              <select className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent" disabled={isGenerating}>
                <option>Professional</option>
                <option>Casual</option>
                <option>Educational</option>
                <option>Entertaining</option>
              </select>
            </div>

            <Button 
              onClick={handleStartGeneration}
              className="w-full"
              disabled={!topic.trim() || isGenerating}
              size="lg"
            >
              {isGenerating ? "Generating..." : "Start Generation"}
            </Button>
          </div>
        </div>

        {/* Right: Progress Steps */}
        <div className="col-span-2">
          <div className="rounded-xl border bg-card text-card-foreground shadow p-6 space-y-4">
            <h2 className="font-semibold text-lg">Generation Progress</h2>
            
            <div className="space-y-3">
              {steps.map((step, index) => (
                <div key={step.id}>
                  <div className="flex items-start gap-3">
                    {getStepIcon(step.status)}
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <p className="font-medium">{step.title}</p>
                        <span className="text-xs font-medium text-gray-500">
                          {step.status === "completed" && "Complete"}
                          {step.status === "in-progress" && "In Progress"}
                          {step.status === "pending" && "Pending"}
                          {step.status === "error" && "Error"}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">{step.description}</p>
                    </div>
                  </div>
                  {index < steps.length - 1 && (
                    <div className="ml-2.5 h-6 border-l-2 border-gray-200 my-1" />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Generated Video Preview */}
          {generatedVideo && (
            <div className="rounded-xl border bg-gradient-to-br from-primary/10 to-primary/5 shadow p-6 space-y-4 mt-6">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-lg">✓ Video Generated!</h3>
                <CheckCircle className="w-6 h-6 text-green-500" />
              </div>
              
              <div className="bg-black rounded-lg h-48 flex items-center justify-center">
                <video className="w-full h-full object-cover rounded-lg" controls>
                  <source src="" type="video/mp4" />
                </video>
              </div>

              <p className="text-sm text-gray-600">{generatedVideo.title}</p>

              <div className="flex gap-2">
                <Button variant="outline" className="flex-1 gap-2">
                  <Download className="w-4 h-4" /> Download
                </Button>
                <Button className="flex-1">Upload to YouTube</Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}