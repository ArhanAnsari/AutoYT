import { google } from "googleapis";
import { generateScript } from "@/actions/generateScript";
import { generateVideo } from "@/actions/generateVideo";
import { generateVoice } from "@/actions/generateVoice";
import { generateThumbnail } from "@/actions/generateThumbnail";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session || !session.accessToken) {
    return new Response("Unauthorized", { status: 401 });
  }

  try {
    const { topic } = await req.json();
    if (!topic) return new Response("Topic is required", { status: 400 });

    // Generate AI content
    const script = await generateScript(topic);
    const video = await generateVideo(script);
    const voice = await generateVoice(script);
    const thumbnail = await generateThumbnail(topic);

    // Upload video to YouTube
    const youtube = google.youtube({
      version: "v3",
      auth: session.accessToken,
    });
    const uploadResponse = await youtube.videos.insert({
      part: ["snippet", "status"],
      requestBody: {
        snippet: {
          title: `AI-Generated Video: ${topic}`,
          description: "Generated with AI",
        },
        status: { privacyStatus: "public" },
      },
      media: { body: video.createReadStream() },
    });

    return Response.json({
      script,
      video,
      voice,
      thumbnail,
      youtubeResponse: uploadResponse.data,
    });
  } catch (error) {
    console.error("Error generating content:", error);
    return new Response("Error processing request", { status: 500 });
  }
}
