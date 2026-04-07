import { NextResponse } from "next/server";
import { generateImage } from "@/services/ai/image";

export async function POST(req: Request) {
  try {
    const { prompt, sceneId } = await req.json();

    if (!prompt || !sceneId) {
      return NextResponse.json({ error: "Missing prompt or sceneId" }, { status: 400 });
    }

    // Use the real image generation service with free APIs
    const imageUrl = await generateImage(prompt);

    return NextResponse.json({
      success: true,
      imageUrl: imageUrl
    });
  } catch (error) {
    console.error("Error generating image:", error);
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}
