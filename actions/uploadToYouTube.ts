// actions/uploadToYouTube.ts
import { google } from "googleapis";

export async function uploadToYouTube(videoUrl: string, accessToken: string) {
    const youtube = google.youtube({ version: "v3", auth: accessToken });
    const response = await youtube.videos.insert({
        part: ["snippet", "status"],
        requestBody: {
            snippet: { title: "AI Generated Video", description: "Generated with AI" },
            status: { privacyStatus: "public" }
        },
        media: { body: videoUrl }
    }) as any;
    return response.data;
}
