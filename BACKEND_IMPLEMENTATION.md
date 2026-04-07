# AutoYT Backend Implementation Guide

## Overview
This document describes the complete backend implementation for AutoYT, including:
- Video scheduling and publishing
- YouTube integration
- Analytics and metrics
- Automations engine
- Video state tracking

## Database Schema Updates

### Videos Table
Added fields for scheduling and metrics:
- `publishedAt` (timestamp): When the video should be published
- `publishedAtActual` (timestamp): When the video was actually published
- `youtubeVideoId` (string): YouTube video ID after publishing
- `views`, `likes`, `comments`: Engagement metrics
- `lastSyncedAt` (timestamp): Last time metrics were synced

New statuses:
- `scheduled` - Ready to be published at a scheduled time
- `publishing` - Currently uploading to YouTube
- `published` - Successfully published to YouTube

### Automations Table
Complete automation management with:
- `name`: Automation name
- `triggerConfig`: How the automation is triggered (schedule, RSS, webhook)
- `actionConfig`: What action to take (generate_video, etc.)
- `isActive`: Whether automation is enabled
- `lastRunAt`: Last execution timestamp
- `lastRunStatus`: Success/failure status

## API Endpoints

### 1. YouTube Upload
**Endpoint**: `POST /api/upload-to-youtube`

Uploads an assembled video to the user's YouTube channel.

**Request**:
```json
{
  "videoId": "video_id_from_convex",
  "title": "Video Title",
  "description": "Video description",
  "tags": ["tag1", "tag2"],
  "categoryId": "22"  // Optional: 22=People & Blogs, 24=Entertainment
}
```

**Response**:
```json
{
  "success": true,
  "youtubeVideoId": "dQw4w9WgXcQ",
  "publishedUrl": "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
}
```

### 2. Schedule Video for Publishing
**Endpoint**: `POST /api/videos/schedule`

Marks a video as scheduled for publishing at a specific time.

**Convex Mutation**: `scheduleVideoForPublishing`
```typescript
await convex.mutation(api.videos.scheduleVideoForPublishing, {
  videoId: "video_id",
  publishAt: 1712952000000,  // Unix timestamp in milliseconds
});
```

### 3. Sync YouTube Statistics
**Endpoint**: `POST /api/sync-youtube-stats`

Fetches video statistics from YouTube and updates metrics in Convex.

**Request**:
```json
{
  "videoId": "video_id_from_convex"
}
```

**Response**:
```json
{
  "success": true,
  "metrics": {
    "views": 1250,
    "likes": 45,
    "comments": 12
  }
}
```

### 4. Publish Scheduled Videos (Cron Job)
**Endpoint**: `POST /api/publish-scheduled`

Publishing service that finds and publishes videos ready to go live.

**Request** (requires CRON_SECRET header):
```json
{
  "channelId": "channel_id_from_convex"
}
```

**Response**:
```json
{
  "success": true,
  "published": [
    {
      "videoId": "video_id",
      "youtubeVideoId": "dQw4w9WgXcQ",
      "url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
    }
  ],
  "count": 1
}
```

**To call from cron job** (EasyCron, Vercel Crons, etc.):
```bash
curl -X POST https://yourdomain.com/api/publish-scheduled \
  -H "Authorization: Bearer auto-yt-cron-secret-key-12345" \
  -H "Content-Type: application/json" \
  -d '{"channelId":"your_channel_id"}'
```

### 5. Update Video Metadata
**Endpoint**: `PATCH /api/videos/[id]`

Edit video title, description, and publish schedule.

**Request**:
```json
{
  "videoId": "video_id",
  "title": "New Title",
  "description": "New description",
  "publishAt": 1712952000000,
  "tags": ["tag1", "tag2"]
}
```

## Convex Queries & Mutations

### Analytics
```typescript
// Get channel analytics
const analytics = await convex.query(api.analytics.getChannelAnalytics, {
  channelId: "channel_id"
});
// Returns: { totalVideos, publishedVideos, scheduledVideos, draftVideos, 
//            totalViews, totalLikes, totalComments, avgViews, engagementRate }

// Get upcoming scheduled videos
const upcoming = await convex.query(api.analytics.getUpcomingPublications, {
  channelId: "channel_id"
});
// Returns array of videos ready to be published

// Get individual video metrics
const metrics = await convex.query(api.analytics.getVideoMetrics, {
  videoId: "video_id"
});
```

### Automations
```typescript
// Create automation
await convex.mutation(api.automations.createAutomation, {
  channelId: "channel_id",
  name: "Weekly Upload",
  triggerConfig: {
    type: "schedule",
    value: "0 9 * * 1"  // 9 AM every Monday (cron format)
  },
  actionConfig: {
    type: "generate_video",
    parameters: { topic: "Trending Tech News" }
  }
});

// Get automations for channel
const automations = await convex.query(api.automations.getAutomationsByChannel, {
  channelId: "channel_id"
});

// Toggle automation active/inactive
await convex.mutation(api.automations.toggleAutomation, {
  automationId: "automation_id"
});

// Delete automation
await convex.mutation(api.automations.deleteAutomation, {
  automationId: "automation_id"
});

// Record automation run
await convex.mutation(api.automations.recordAutomationRun, {
  automationId: "automation_id",
  status: "success"  // or "failed"
});
```

### Videos
```typescript
// Schedule a video
await convex.mutation(api.videos.scheduleVideoForPublishing, {
  videoId: "video_id",
  publishAt: Date.now() + 24 * 60 * 60 * 1000  // 24 hours from now
});

// Mark as published
await convex.mutation(api.videos.markVideoAsPublished, {
  videoId: "video_id",
  youtubeVideoId: "abc123",
  publishedUrl: "https://youtube.com/watch?v=abc123"
});

// Update metrics
await convex.mutation(api.videos.updateVideoMetrics, {
  videoId: "video_id",
  views: 1250,
  likes: 45,
  comments: 12
});

// Get scheduled videos ready to publish
const readyToPublish = await convex.query(
  api.videos.getScheduledVideosReadyToPublish, 
  { channelId: "channel_id" }
);

// Update video metadata
await convex.mutation(api.videos.updateVideoMetadata, {
  videoId: "video_id",
  title: "New Title",
  description: "New description"
});
```

## Frontend Integration

### Calendar Page
- Shows scheduled videos on calendar grid
- Lists upcoming videos in sidebar
- All data is real from Convex queries

### Automations Page
- Create/edit/delete automations
- Toggle automations on/off
- View last run status
- All bidirectional with Convex mutations

### Analytics Page
- Real-time metrics from Convex
- Channel stats and video performance
- Engagement rate calculations
- Status breakdown (published/scheduled/drafts)

### Studio Page (Video Editor)
- **Schedule Button**: Opens modal to pick publish date/time
- **Sync Stats Button**: Fetches latest views/likes/comments from YouTube
- **Upload YT Button**: Upload assembled video to YouTube
- **Assemble Button**: Creates final video with Remotion

## Workflow: From Generation to Publishing

1. **Generate**: Create video from topic (Gemini AI generates script)
2. **Edit**: Adjust scenes, narration, images, audio in studio
3. **Assemble**: Use Remotion to create final video file
4. **Choose Path**:
   - **Publish Now**: Upload directly to YouTube via Upload YT button
   - **Schedule**: Click Schedule, pick date/time, video waits for croncron job
   - **Automate**: Set automation to generate → edit → assemble → publish

5. **Publish**: 
   - Manual: Click "Upload YT" button
   - Scheduled: Cron job calls `/api/publish-scheduled` at the time
   - Automation: Automation engine handles the full flow

6. **Monitor**: 
   - View in Calendar when scheduled
   - Check Analytics for engagement
   - Sync Stats to keep metrics updated

## Setting Up Cron Jobs

### Option 1: Vercel Crons
Add to `vercel.json`:
```json
{
  "crons": [{
    "path": "/api/publish-scheduled",
    "schedule": "0 */6 * * *"
  }]
}
```

### Option 2: EasyCron
Create cron job:
- URL: `https://yourdomain.com/api/publish-scheduled`
- Method: POST
- Header: `Authorization: Bearer auto-yt-cron-secret-key-12345`
- Body: `{"channelId":"your_default_channel_id"}`
- Frequency: Every 6 hours

### Option 3: GitHub Actions
Create `.github/workflows/publish-videos.yml`:
```yaml
name: Publish Scheduled Videos
on:
  schedule:
    - cron: '0 */6 * * *'

jobs:
  publish:
    runs-on: ubuntu-latest
    steps:
      - name: Trigger publishing service
        run: |
          curl -X POST https://yourdomain.com/api/publish-scheduled \
            -H "Authorization: Bearer ${{ secrets.CRON_SECRET }}" \
            -H "Content-Type: application/json" \
            -d '{"channelId":"your_channel_id"}'
```

## Security Notes

1. **YouTube OAuth**: Uses Google OAuth 2.0 with:
   - `youtube.upload`: Permission to upload videos
   - `youtube.readonly`: Permission to fetch stats
   - Tokens stored in Convex encrypted

2. **API Security**:
   - Publication endpoint requires CRON_SECRET
   - User auth validated on all endpoints
   - Ownership verification prevents cross-channel access
   - YouTube upload validates token freshness

3. **Environment Variables**:
   - Keep `GOOGLE_CLIENT_SECRET` secure
   - Keep `CRON_SECRET` secret, use different value in production
   - YOUTUBE_API_KEY can be public (limited operations)

## Error Handling

Common errors and solutions:

### "YouTube not connected"
- User hasn't completed OAuth flow
- Solution: Redirect to login with YouTube scopes

### "Failed to get video file"
- Video assembly hasn't completed
- Solution: Check status is "ready" before publishing

### "Upload failed"
- Token expired (happens after 1 hour)
- Solution: System auto-refreshes using refresh_token

### "Metrics sync failed"
- Video not published to YouTube yet
- Solution: Only sync videos with youtubeVideoId

## Performance Considerations

1. **Batch Operations**: Publishing handles multiple videos efficiently
2. **Stats Sync**: Only updates if video is published
3. **Automations**: Stored as simple configs, evaluated by cron job
4. **Metrics Caching**: lastSyncedAt prevents excessive API calls

## Next Steps

1. Deploy to production with proper environment variables
2. Configure cron jobs for regular publishing
3. Monitor error rates with logging/observability
4. Set up Slack/email notifications for upload failures
5. Implement premium features (custom branding, batch scheduling)
