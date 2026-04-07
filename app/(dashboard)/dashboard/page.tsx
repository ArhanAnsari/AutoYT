"use client";

import { useSession } from "next-auth/react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import Link from "next/link";
import { Play, Clock, Edit3, TrendingUp, Plus, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function DashboardPage() {
  const { data: session } = useSession();
  
  const dashboardData = useQuery(
    api.videos.getDashboardData, 
    session?.user?.email ? { email: session.user.email } : "skip"
  );

  const metrics = dashboardData?.metrics || { total: 0, drafts: 0, scheduled: 0, avgViews: 0 };
  const videos = dashboardData?.videos || [];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl flex items-center gap-2 font-bold tracking-tight">
          <LayoutDashboard className="w-6 h-6 text-primary" /> Dashboard
        </h1>
        <Link href="/generate">
          <Button className="gap-2 shadow-sm"><Plus className="w-4 h-4" /> Create Resource</Button>
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard title="Total Videos" value={metrics.total} icon={<Play className="w-4 h-4" />} />
        <MetricCard title="Scheduled" value={metrics.scheduled} icon={<Clock className="w-4 h-4" />} />
        <MetricCard title="Drafts" value={metrics.drafts} icon={<Edit3 className="w-4 h-4" />} />
        <MetricCard title="Avg. Views" value="N/A" icon={<TrendingUp className="w-4 h-4" />} />
      </div>

      <div className="rounded-xl border bg-card text-card-foreground shadow p-0 overflow-hidden">
        <div className="px-6 py-5 border-b flex justify-between items-center bg-gray-50/50">
          <h3 className="font-semibold px-2 tracking-tight text-gray-800">Recent Activity</h3>
        </div>
        
        {dashboardData === undefined ? (
          <div className="flex items-center justify-center p-12 text-sm text-muted-foreground animate-pulse">
            Loading dashboard data...
          </div>
        ) : videos.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-48 text-muted-foreground gap-3">
             <div className="p-3 bg-gray-100 rounded-full">
               <Play className="w-6 h-6 text-gray-400" />
             </div>
             <p className="text-sm">No videos found. Start by generating one!</p>
          </div>
        ) : (
          <div className="divide-y max-h-[500px] overflow-y-auto">
            {videos.slice(0, 10).map((video: any) => (
              <div key={video._id} className="flex items-center justify-between p-4 px-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gray-100 rounded-md flex items-center justify-center border text-gray-400">
                    <Play className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold mb-0.5">{video.title}</h4>
                    <p className="text-xs text-muted-foreground flex gap-2">
                       <span className="capitalize">{video.status.replace("_", " ")}</span>
                    </p>
                  </div>
                </div>
                <Link href={`/studio/${video._id}`}>
                  <Button variant="outline" size="sm" className="h-8 text-xs font-medium bg-white">
                    {video.status === 'published' ? 'View Details' : 'Open in Studio'}
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function MetricCard({ title, value, icon }: { title: string, value: string | number, icon: React.ReactNode }) {
  return (
    <div className="rounded-xl border bg-white shadow-sm p-5 flex flex-col gap-3">
      <div className="flex items-center justify-between text-muted-foreground">
        <h3 className="text-sm font-medium">{title}</h3>
        {icon}
      </div>
      <div className="flex items-baseline gap-2">
        <span className="text-3xl font-bold tracking-tight text-gray-900">{value}</span>
      </div>
    </div>
  );
}