import { renderMedia } from "@remotion/renderer";
import path from "path";
import fs from "fs";

export async function renderAutoYTVideo(
  videoData: any,
  outputPath: string
): Promise<string> {
  try {
    const compositionId = "AutoYTVideo";

    // Render the video using Remotion
    const result = await renderMedia({
      composition: {
        id: compositionId,
        durationInFrames: calculateTotalFrames(videoData.scenes),
        fps: 30,
        width: 1920,
        height: 1080,
        props: {
          scenes: videoData.scenes,
          title: videoData.title,
        },
      },
      serveUrl: process.env.REMOTION_SERVE_URL || "http://localhost:3000",
      codec: "h264",
      outputLocation: outputPath,
    });

    return result;
  } catch (error) {
    console.error("Remotion render error:", error);
    throw new Error("Failed to render video with Remotion");
  }
}

function calculateTotalFrames(scenes: any[]): number {
  const fps = 30;
  let totalSeconds = 0;

  scenes.forEach((scene) => {
    const durationMs = scene.durationMs || 5000;
    totalSeconds += durationMs / 1000;
  });

  return Math.ceil(totalSeconds * fps);
}
