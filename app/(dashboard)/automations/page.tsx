"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Activity, Plus, Trash2, Edit2, Zap, Clock, Rss } from "lucide-react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useSession } from "next-auth/react";

interface Automation {
  _id: string;
  name: string;
  triggerConfig: { type: string; value: string };
  actionConfig: { type: string; parameters: any };
  isActive: boolean;
  createdAt: number;
  lastRunAt?: number;
  lastRunStatus?: string;
}

export default function AutomationsPage() {
  const { data: session } = useSession();
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    triggerType: "schedule",
    triggerValue: "",
    actionType: "generate_video",
  });

  // Get channel ID from session/user
  const userChannelQuery = useQuery(
    api.users.getUserChannel as any,
    session?.user?.email ? { userId: (session as any).userId } : "skip"
  );

  // Get automations for this channel
  const automations = useQuery(
    api.automations.getAutomationsByChannel as any,
    userChannelQuery?.channelId ? { channelId: userChannelQuery.channelId } : "skip"
  ) as Automation[] | undefined;

  const toggleAutomation = useMutation(api.automations.toggleAutomation as any);
  const deleteAutomation = useMutation(api.automations.deleteAutomation as any);
  const createAutomation = useMutation(api.automations.createAutomation as any);

  const handleCreateAutomation = async () => {
    if (!formData.name || !formData.triggerValue || !userChannelQuery?.channelId) {
      alert("Please fill in all fields");
      return;
    }

    try {
      await createAutomation({
        channelId: userChannelQuery.channelId,
        name: formData.name,
        triggerConfig: {
          type: formData.triggerType,
          value: formData.triggerValue,
        },
        actionConfig: {
          type: formData.actionType,
          parameters: {},
        },
      });

      setFormData({
        name: "",
        triggerType: "schedule",
        triggerValue: "",
        actionType: "generate_video",
      });
      setShowForm(false);
    } catch (error) {
      console.error("Failed to create automation:", error);
      alert("Failed to create automation");
    }
  };

  const handleToggle = async (automationId: string) => {
    try {
      await toggleAutomation({ automationId: automationId as any });
    } catch (error) {
      console.error("Failed to toggle automation:", error);
    }
  };

  const handleDelete = async (automationId: string) => {
    if (confirm("Are you sure you want to delete this automation?")) {
      try {
        await deleteAutomation({ automationId: automationId as any });
      } catch (error) {
        console.error("Failed to delete automation:", error);
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Activity className="w-6 h-6 text-primary" /> Automations
        </h1>
        <Button onClick={() => setShowForm(!showForm)} className="gap-2">
          <Plus className="w-4 h-4" /> New Automation
        </Button>
      </div>

      {/* Create Automation Form */}
      {showForm && (
        <div className="rounded-xl border bg-card text-card-foreground shadow p-6 space-y-4">
          <h3 className="font-semibold text-lg">Create New Automation</h3>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Automation Name</label>
              <input 
                type="text" 
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Weekly Upload"
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="text-sm font-medium mb-2 block">Trigger Type</label>
              <select 
                value={formData.triggerType}
                onChange={(e) => setFormData({ ...formData, triggerType: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent">
                <option value="schedule">Schedule (Cron)</option>
                <option value="rss">RSS Feed</option>
                <option value="webhook">Webhook</option>
              </select>
            </div>

            <div className="col-span-2">
              <label className="text-sm font-medium mb-2 block">Trigger Configuration</label>
              <input 
                type="text" 
                value={formData.triggerValue}
                onChange={(e) => setFormData({ ...formData, triggerValue: e.target.value })}
                placeholder={formData.triggerType === "schedule" ? "e.g., 0 9 * * 1 (Monday 9 AM)" : "e.g., https://feed.com/rss"}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
          </div>

          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
            <Button onClick={handleCreateAutomation}>Create Automation</Button>
          </div>
        </div>
      )}

      {/* Automations List */}
      <div className="space-y-3">
        {!automations ? (
          <div className="text-center py-8 text-gray-500">Loading...</div>
        ) : automations.length === 0 ? (
          <div className="text-center py-8 text-gray-500">No automations yet. Create one to get started!</div>
        ) : (
          automations.map(auto => (
            <div key={auto._id} className="rounded-xl border bg-card text-card-foreground shadow p-4 flex items-center justify-between hover:shadow-md transition-shadow">
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${auto.isActive ? 'bg-green-500' : 'bg-gray-300'}`} />
                  <div>
                    <h4 className="font-semibold">{auto.name}</h4>
                    <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                      <span className="flex items-center gap-1">
                        {auto.triggerConfig.type === 'schedule' ? <Clock className="w-4 h-4" /> : <Rss className="w-4 h-4" />}
                        {auto.triggerConfig.value}
                      </span>
                      <span className="flex items-center gap-1">
                        <Zap className="w-4 h-4" /> {auto.actionConfig.type}
                      </span>
                      {auto.lastRunAt && (
                        <span className="text-xs text-gray-500">
                          Last run: {new Date(auto.lastRunAt).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => handleToggle(auto._id)}
                  className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                    auto.isActive 
                      ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {auto.isActive ? 'Active' : 'Inactive'}
                </button>
                <Button variant="ghost" size="sm"><Edit2 className="w-4 h-4" /></Button>
                <Button variant="ghost" size="sm" onClick={() => handleDelete(auto._id)}>
                  <Trash2 className="w-4 h-4 text-red-500" />
                </Button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}