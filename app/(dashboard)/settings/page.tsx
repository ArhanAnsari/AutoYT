"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Settings, User, Bell, Key, Save } from "lucide-react";

export default function SettingsPage() {
  const [profile, setProfile] = useState({
    name: 'John Doe',
    email: 'john@example.com',
    channelName: 'Tech & Innovation',
    channelDescription: 'Daily tech updates and innovation insights',
  });

  const [notifications, setNotifications] = useState({
    emailOnUpload: true,
    emailOnError: true,
    emailOnMilestone: false,
    pushNotifications: true,
  });

  const [apiKeys, setApiKeys] = useState({
    youtubeConnected: true,
    reminderText: '•••••••••• (last 4: T2aG)',
  });

  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold flex items-center gap-2">
        <Settings className="w-6 h-6 text-primary" /> Settings
      </h1>

      {saved && (
        <div className="rounded-xl bg-green-50 border border-green-200 text-green-800 p-4">
          ✓ Settings saved successfully
        </div>
      )}

      {/* Profile Settings */}
      <div className="rounded-xl border bg-card text-card-foreground shadow p-6 space-y-4">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <User className="w-5 h-5" /> Profile Settings
        </h2>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Full Name</label>
            <input 
              type="text" 
              value={profile.name}
              onChange={(e) => setProfile({...profile, name: e.target.value})}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
          
          <div>
            <label className="text-sm font-medium mb-2 block">Email</label>
            <input 
              type="email" 
              value={profile.email}
              onChange={(e) => setProfile({...profile, email: e.target.value})}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>

          <div className="col-span-2">
            <label className="text-sm font-medium mb-2 block">Channel Name</label>
            <input 
              type="text" 
              value={profile.channelName}
              onChange={(e) => setProfile({...profile, channelName: e.target.value})}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>

          <div className="col-span-2">
            <label className="text-sm font-medium mb-2 block">Channel Description</label>
            <textarea 
              value={profile.channelDescription}
              onChange={(e) => setProfile({...profile, channelDescription: e.target.value})}
              rows={3}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Notification Settings */}
      <div className="rounded-xl border bg-card text-card-foreground shadow p-6 space-y-4">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <Bell className="w-5 h-5" /> Notification Preferences
        </h2>
        
        <div className="space-y-3">
          <label className="flex items-center gap-3 cursor-pointer">
            <input 
              type="checkbox" 
              checked={notifications.emailOnUpload}
              onChange={(e) => setNotifications({...notifications, emailOnUpload: e.target.checked})}
              className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
            />
            <span className="text-sm font-medium">Email me when video is uploaded</span>
          </label>

          <label className="flex items-center gap-3 cursor-pointer">
            <input 
              type="checkbox" 
              checked={notifications.emailOnError}
              onChange={(e) => setNotifications({...notifications, emailOnError: e.target.checked})}
              className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
            />
            <span className="text-sm font-medium">Email me on generation errors</span>
          </label>

          <label className="flex items-center gap-3 cursor-pointer">
            <input 
              type="checkbox" 
              checked={notifications.emailOnMilestone}
              onChange={(e) => setNotifications({...notifications, emailOnMilestone: e.target.checked})}
              className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
            />
            <span className="text-sm font-medium">Email me on milestones (100 videos, 1K subs)</span>
          </label>

          <label className="flex items-center gap-3 cursor-pointer">
            <input 
              type="checkbox" 
              checked={notifications.pushNotifications}
              onChange={(e) => setNotifications({...notifications, pushNotifications: e.target.checked})}
              className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
            />
            <span className="text-sm font-medium">Enable push notifications</span>
          </label>
        </div>
      </div>

      {/* API & Integrations */}
      <div className="rounded-xl border bg-card text-card-foreground shadow p-6 space-y-4">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <Key className="w-5 h-5" /> API & Integrations
        </h2>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 border rounded-lg">
            <div>
              <p className="font-medium">YouTube Connection</p>
              <p className="text-sm text-gray-600">Authorization & channel data sync</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full" />
              <span className="text-sm font-medium text-green-600">Connected</span>
            </div>
          </div>

          <div className="flex items-center justify-between p-3 border rounded-lg">
            <div>
              <p className="font-medium">Gemini API Key</p>
              <p className="text-sm text-gray-600">{apiKeys.reminderText}</p>
            </div>
            <Button variant="outline" size="sm">Update</Button>
          </div>
        </div>

        <div>
          <p className="text-sm font-medium mb-2">Manage API Keys</p>
          <p className="text-sm text-gray-600 mb-3">Create API keys to access AutoYT data programmatically</p>
          <Button variant="outline" className="w-full">Create New API Key</Button>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="rounded-xl border border-red-200 bg-red-50 p-6 space-y-4">
        <h2 className="text-lg font-semibold text-red-900">Danger Zone</h2>
        
        <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-red-200">
          <div>
            <p className="font-medium">Delete Account</p>
            <p className="text-sm text-gray-600">Permanently delete your account and all associated content</p>
          </div>
          <Button variant="outline" className="text-red-600 border-red-300 hover:bg-red-50">
            Delete
          </Button>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button onClick={handleSave} className="gap-2">
          <Save className="w-4 h-4" /> Save Changes
        </Button>
      </div>
    </div>
  );
}