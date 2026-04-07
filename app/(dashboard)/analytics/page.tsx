"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useSession } from "next-auth/react";
import { BarChart, TrendingUp, Eye, ThumbsUp, MessageCircle } from "lucide-react";

export default function AnalyticsPage() {
  const { data: session } = useSession();

  // Get user channel
  const userChannelQuery = useQuery(
    api.users.getUserChannel as any,
    session?.user?.email ? { userId: (session as any).userId } : "skip"
  );

  // Get analytics data
  const analytics = useQuery(
    api.analytics.getChannelAnalytics as any,
    userChannelQuery?.channelId ? { channelId: userChannelQuery.channelId } : "skip"
  );

  if (!analytics) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-gray-500">Loading analytics...</div>
      </div>
    );
  }

  const MetricCard = ({
    icon: Icon,
    title,
    value,
    subtitle,
    color = "primary",
  }: any) => (
    <div className="rounded-xl border bg-card text-card-foreground shadow p-6">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-3xl font-bold mt-2">{value.toLocaleString()}</p>
          <p className="text-xs text-gray-500 mt-1">{subtitle}</p>
        </div>
        <div className={`p-3 rounded-lg bg-${color}/10`}>
          <Icon className={`w-6 h-6 text-${color}`} />
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <BarChart className="w-6 h-6 text-primary" /> Analytics & Metrics
        </h1>
        <p className="text-gray-600 mt-1">Performance overview of your channel</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          icon={TrendingUp}
          title="Total Videos"
          value={analytics.totalVideos}
          subtitle="All time"
          color="blue"
        />
        <MetricCard
          icon={Eye}
          title="Total Views"
          value={analytics.totalViews}
          subtitle={`Avg: ${analytics.avgViews.toLocaleString()} per video`}
          color="green"
        />
        <MetricCard
          icon={ThumbsUp}
          title="Total Likes"
          value={analytics.totalLikes}
          subtitle={`${analytics.engagementRate}% engagement rate`}
          color="red"
        />
        <MetricCard
          icon={MessageCircle}
          title="Total Comments"
          value={analytics.totalComments}
          subtitle="Community interaction"
          color="purple"
        />
      </div>

      {/* Content Status Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="rounded-xl border bg-card text-card-foreground shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Content Status</h3>
          <div className="space-y-3">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Published</span>
                <span className="text-lg font-bold">{analytics.publishedVideos}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-green-500 h-2 rounded-full"
                  style={{
                    width: `${analytics.totalVideos > 0 ? (analytics.publishedVideos / analytics.totalVideos) * 100 : 0}%`,
                  }}
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Scheduled</span>
                <span className="text-lg font-bold">{analytics.scheduledVideos}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-500 h-2 rounded-full"
                  style={{
                    width: `${analytics.totalVideos > 0 ? (analytics.scheduledVideos / analytics.totalVideos) * 100 : 0}%`,
                  }}
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Drafts</span>
                <span className="text-lg font-bold">{analytics.draftVideos}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-yellow-500 h-2 rounded-full"
                  style={{
                    width: `${analytics.totalVideos > 0 ? (analytics.draftVideos / analytics.totalVideos) * 100 : 0}%`,
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Engagement Breakdown */}
        <div className="rounded-xl border bg-card text-card-foreground shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Engagement Metrics</h3>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-600 mb-1">Engagement Rate</p>
              <p className="text-2xl font-bold">{analytics.engagementRate}%</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Avg Views per Video</p>
              <p className="text-2xl font-bold">{analytics.avgViews.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Interaction Rate</p>
              <p className="text-lg font-semibold">
                {analytics.totalViews > 0
                  ? ((analytics.totalLikes + analytics.totalComments) / analytics.totalViews * 100).toFixed(2)
                  : 0}%
              </p>
            </div>
          </div>
        </div>

        {/* Growth Summary */}
        <div className="rounded-xl border bg-card text-card-foreground shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Summary</h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Last Updated</span>
              <span className="font-medium">Just now</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Total Duration</span>
              <span className="font-medium">
                {analytics.totalVideos > 0 ? `${analytics.totalVideos} videos` : "No videos"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Publishing Rate</span>
              <span className="font-medium">
                {analytics.totalVideos > 0
                  ? `${((analytics.publishedVideos / analytics.totalVideos) * 100).toFixed(0)}%`
                  : "0%"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Top Performing Videos */}
      <div className="rounded-xl border bg-card text-card-foreground shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Performance Insights</h3>
        <div className="space-y-2 text-sm text-gray-600">
          <p>
            ✓ You have <strong>{analytics.publishedVideos}</strong> published videos generating{" "}
            <strong>{analytics.totalViews.toLocaleString()}</strong> total views.
          </p>
          <p>
            ✓ Average engagement rate is <strong>{analytics.engagementRate}%</strong>, which is
            {analytics.engagementRate > 5 ? " above average! 📈" : " average. Keep improving! 💪"}
          </p>
          <p>
            ✓ You have <strong>{analytics.scheduledVideos}</strong> videos scheduled for publishing.
          </p>
        </div>
      </div>
    </div>
  );
}
