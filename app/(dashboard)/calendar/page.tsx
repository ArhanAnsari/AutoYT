"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar, ChevronLeft, ChevronRight, Download, Plus } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useSession } from "next-auth/react";

export default function CalendarPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [currentMonth, setCurrentMonth] = useState(new Date(2026, 3, 7)); // April 2026

  const daysInMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  
  const prevMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  const nextMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));

  const monthName = currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  
  const days = [];
  const totalDays = daysInMonth(currentMonth);
  const startingDayOfWeek = firstDayOfMonth(currentMonth);
  
  for (let i = 0; i < startingDayOfWeek; i++) {
    days.push(null);
  }
  
  for (let i = 1; i <= totalDays; i++) {
    days.push(i);
  }

  // Get user channel and scheduled videos
  const userChannelQuery = useQuery(
    api.users.getUserChannel as any,
    session?.user?.email ? { userId: (session as any).userId } : "skip"
  );

  const upcomingVideos = useQuery(
    api.analytics.getUpcomingPublications as any,
    userChannelQuery?.channelId ? { channelId: userChannelQuery.channelId } : "skip"
  );

  // Build a map of videos by date
  const videosByDate: { [key: number]: typeof upcomingVideos } = {};
  if (upcomingVideos) {
    upcomingVideos.forEach((video: any) => {
      if (video.scheduledAt) {
        const date = new Date(video.scheduledAt);
        if (date.getMonth() === currentMonth.getMonth() && date.getFullYear() === currentMonth.getFullYear()) {
          const day = date.getDate();
          if (!videosByDate[day]) {
            videosByDate[day] = [];
          }
          videosByDate[day].push(video);
        }
      }
    });
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Calendar className="w-6 h-6 text-primary" /> Content Calendar
        </h1>
        <Button onClick={() => router.push("/dashboard")} className="gap-2">
          <Plus className="w-4 h-4" /> Schedule Video
        </Button>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Calendar Grid */}
        <div className="col-span-2 rounded-xl border bg-card text-card-foreground shadow p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold">{monthName}</h2>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={prevMonth}>
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={nextMonth}>
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-2">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <div key={day} className="text-center font-semibold text-sm text-gray-600 p-2">
                {day}
              </div>
            ))}

            {days.map((day, index) => (
              <div
                key={index}
                className={`border rounded-lg p-2 min-h-24 ${
                  day === null
                    ? "bg-gray-50"
                    : "bg-white hover:bg-gray-50 transition-colors cursor-pointer"
                }`}
              >
                {day && (
                  <>
                    <div className="font-semibold text-sm mb-1">{day}</div>
                    {videosByDate[day] && videosByDate[day].length > 0 && (
                      <div className="space-y-1">
                        {videosByDate[day].slice(0, 2).map((video: any) => (
                          <div
                            key={video.id}
                            className="text-xs bg-primary/10 text-primary rounded px-2 py-1 truncate"
                            title={video.title}
                          >
                            {video.title}
                          </div>
                        ))}
                        {videosByDate[day].length > 2 && (
                          <div className="text-xs text-gray-500">
                            +{videosByDate[day].length - 2} more
                          </div>
                        )}
                      </div>
                    )}
                  </>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Videos Sidebar */}
        <div className="rounded-xl border bg-card text-card-foreground shadow p-6 h-fit">
          <h3 className="text-lg font-semibold mb-4">Upcoming Uploads</h3>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {!upcomingVideos ? (
              <div className="text-sm text-gray-500">Loading...</div>
            ) : upcomingVideos.length === 0 ? (
              <div className="text-sm text-gray-500">No upcoming videos scheduled</div>
            ) : (
              upcomingVideos.map((video: any) => (
                <div
                  key={video.id}
                  className="p-3 border rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                  onClick={() => router.push(`/studio/${video.id}`)}
                >
                  <h4 className="font-medium text-sm line-clamp-2">{video.title}</h4>
                  <p className="text-xs text-gray-600 mt-1">
                    {video.scheduledAt && new Date(video.scheduledAt).toLocaleDateString()}
                  </p>
                  <div className="flex gap-2 mt-2">
                    <span className={`text-xs px-2 py-1 rounded ${
                      video.status === 'scheduled'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {video.status}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}