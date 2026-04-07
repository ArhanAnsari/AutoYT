import { NextResponse } from "next/server";
import { generateSpeech } from "@/services/ai/tts";

export async function POST(req: Request) {
  try {
    const { text, sceneId } = await req.json();

    if (!text || !sceneId) {
      return NextResponse.json({ error: "Missing text or sceneId" }, { status: 400 });
    }

    // Generate speech using free TTS API (ElevenLabs free tier or VoiceRSS)
    const audioUrl = await generateSpeech(text);

    return NextResponse.json({
      success: true,
      audioUrl: audioUrl,
      durationSeconds: Math.ceil(text.split(" ").length / 2.5), // Approximate duration
    });
  } catch (error) {
    console.error("Error generating audio:", error);
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}
