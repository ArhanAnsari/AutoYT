"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Upload, Trash2, Download, Folder, Image, Music, FileText } from "lucide-react";

interface Resource {
  id: string;
  name: string;
  type: "image" | "audio" | "template" | "font";
  size: string;
  uploadedAt: string;
  url?: string;
}

export default function ResourcesPage() {
  const [resources, setResources] = useState<Resource[]>([
    {
      id: '1',
      name: 'tech_background.png',
      type: 'image',
      size: '2.4 MB',
      uploadedAt: '2024-01-15',
    },
    {
      id: '2',
      name: 'intro_music.mp3',
      type: 'audio',
      size: '5.2 MB',
      uploadedAt: '2024-01-14',
    },
    {
      id: '3',
      name: 'template_intro.json',
      type: 'template',
      size: '124 KB',
      uploadedAt: '2024-01-13',
    },
  ]);

  const [selectedType, setSelectedType] = useState<string>("all");
  const [showUpload, setShowUpload] = useState(false);

  const deleteResource = (id: string) => {
    setResources(resources.filter(r => r.id !== id));
  };

  const getTypeIcon = (type: Resource["type"]) => {
    switch (type) {
      case "image":
        return <Image className="w-4 h-4 text-blue-500" />;
      case "audio":
        return <Music className="w-4 h-4 text-green-500" />;
      case "template":
        return <FileText className="w-4 h-4 text-purple-500" />;
      default:
        return <Folder className="w-4 h-4 text-gray-500" />;
    }
  };

  const filteredResources = selectedType === "all" 
    ? resources 
    : resources.filter(r => r.type === selectedType);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Folder className="w-6 h-6 text-primary" /> Resources
        </h1>
        <Button onClick={() => setShowUpload(!showUpload)} className="gap-2">
          <Upload className="w-4 h-4" /> Upload Resource
        </Button>
      </div>

      {/* Upload Manager */}
      {showUpload && (
        <div className="rounded-xl border bg-card text-card-foreground shadow p-6 space-y-4">
          <h3 className="font-semibold text-lg">Upload New Resource</h3>
          
          <div className="border-2 border-dashed rounded-lg p-8 text-center hover:bg-gray-50 transition-colors cursor-pointer">
            <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
            <p className="text-sm font-medium">Drag and drop your file here</p>
            <p className="text-xs text-gray-500 mt-1">or click to browse (Max 100MB)</p>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Resource Type</label>
            <select className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent">
              <option value="image">Image</option>
              <option value="audio">Audio</option>
              <option value="template">Template</option>
              <option value="font">Font</option>
            </select>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Tags (comma-separated)</label>
            <input 
              type="text" 
              placeholder="e.g., background, tech, 2024"
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>

          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={() => setShowUpload(false)}>Cancel</Button>
            <Button>Upload</Button>
          </div>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex gap-2">
        {[
          { value: "all", label: "All", icon: null },
          { value: "image", label: "Images", icon: Image },
          { value: "audio", label: "Audio", icon: Music },
          { value: "template", label: "Templates", icon: FileText },
        ].map(filter => (
          <button
            key={filter.value}
            onClick={() => setSelectedType(filter.value)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
              selectedType === filter.value
                ? "bg-primary text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {filter.icon && <filter.icon className="w-4 h-4" />}
            {filter.label} ({resources.filter(r => filter.value === "all" || r.type === filter.value).length})
          </button>
        ))}
      </div>

      {/* Resources Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredResources.map(resource => (
          <div key={resource.id} className="rounded-lg border bg-card p-4 space-y-3 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3 flex-1">
                {getTypeIcon(resource.type)}
                <div className="min-w-0">
                  <p className="font-medium text-sm truncate">{resource.name}</p>
                  <p className="text-xs text-gray-500">{resource.size}</p>
                </div>
              </div>
            </div>

            {resource.type === "image" && (
              <div className="w-full h-32 bg-gray-100 rounded-md flex items-center justify-center">
                <Image className="w-8 h-8 text-gray-400" />
              </div>
            )}

            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>{resource.uploadedAt}</span>
              <span className="bg-gray-100 px-2 py-1 rounded">{resource.type}</span>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="flex-1 gap-1">
                <Download className="w-3 h-3" /> Download
              </Button>
              <Button variant="ghost" size="sm" onClick={() => deleteResource(resource.id)}>
                <Trash2 className="w-4 h-4 text-red-500" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      {filteredResources.length === 0 && (
        <div className="text-center py-12">
          <Folder className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 font-medium">No resources found</p>
          <p className="text-sm text-gray-400">Upload your first resource to get started</p>
        </div>
      )}

      {/* Storage Usage */}
      <div className="rounded-xl border bg-card text-card-foreground shadow p-6 space-y-3">
        <h3 className="font-semibold">Storage Usage</h3>
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Used space</span>
            <span className="font-medium">7.7 GB / 100 GB</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-primary h-2 rounded-full" style={{ width: "7.7%" }} />
          </div>
        </div>
      </div>
    </div>
  );
}