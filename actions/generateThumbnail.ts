// actions/generateThumbnail.ts
import { togetherai } from "@ai-sdk/togetherai";
import { experimental_generateImage as generateImage } from "ai";

export async function generateThumbnail(topic: string) {
  const { images } = await generateImage({
    model: togetherai.image("black-forest-labs/FLUX.1-schnell-Free"),
    prompt: `Create an attractive YouTube thumbnail about ${topic}.`,
  });
  return images[0];
}
