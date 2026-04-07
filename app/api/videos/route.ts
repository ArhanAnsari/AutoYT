import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { generateScript } from "@/services/ai/gemini";
import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { topic } = await req.json();

    if (!topic) {
      return NextResponse.json({ error: "Topic is required" }, { status: 400 });
    }

    // 1. Fetch user & channel from Convex
    const user = await convex.query(api.users.getUser, { email: session.user.email });
    if (!user) {
      return NextResponse.json({ error: "User not found in DB" }, { status: 404 });
    }
    
    // In a real app we'd fetch the exact channel selected, 
    // for MVP we just get the first channel owned by the user.
    // Let's assume the user object is valid for now, but we actually need to handle the channel query.

    // 2. Kick off the initial script generation via Gemini
    const scriptJson = await generateScript(topic);

    // 3. Map the Gemini JSON output into "Scene" blocks
    const parsedScenes = [];
    
    // Add Intro Scene
    parsedScenes.push({
      order: 0,
      narrationText: scriptJson.hook + " " + scriptJson.intro,
      imagePrompt: "A captivating, cinematic intro image related to: " + topic,
    });
    
    // Add Body Scenes
    if (Array.isArray(scriptJson.body)) {
      scriptJson.body.forEach((point: string, idx: number) => {
        parsedScenes.push({
          order: idx + 1,
          narrationText: point,
          imagePrompt: "An engaging, detailed visualization representing: " + point.substring(0, 50),
        });
      });
    }

    // Add Outro/CTA Scene
    parsedScenes.push({
      order: parsedScenes.length,
      narrationText: scriptJson.cta,
      imagePrompt: "A sleek YouTube end screen graphic with subscribe text.",
    });

    const channel = await convex.query(api.users.getUserChannel, { userId: user._id });
    if (!channel) {
       return NextResponse.json({ error: "No channel configured for user" }, { status: 400 });
    }

    const videoId = await convex.mutation(api.videos.createVideo, {
      channelId: channel._id,
      title: scriptJson.title || topic,
      description: scriptJson.description || "",
      scenes: parsedScenes
    });
    
    return NextResponse.json({ 
      success: true, 
      videoId: videoId, 
      script: scriptJson,
    });

  } catch (error) {
    console.error("Video Generation Error:", error);
    return NextResponse.json({ error: "Failed to start generation pipeline." }, { status: 500 });
  }
}