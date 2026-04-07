import Replicate from "replicate";

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

/**
 * Generate an image using Replicate's free tier models (Flux / Stable Diffusion)
 */
export async function generateImage(prompt: string): Promise<string> {
  try {
    // Use Flux - Free on Replicate free tier
    const output = await replicate.run(
      "black-forest-labs/flux-schnell",
      {
        input: {
          prompt: prompt,
          num_inference_steps: 4,
          guidance_scale: 0,
        },
      }
    ) as string[];

    if (Array.isArray(output) && output.length > 0) {
      return output[0]; // Return the image URL from Replicate
    }

    // Fallback to Pollinations if Flux fails
    return `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=1024&height=1024&nologo=true`;
  } catch (error) {
    console.error("Error generating image with Flux:", error);
    // Fallback to free Pollinations API (no auth required)
    return `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=1024&height=1024&nologo=true`;
  }
}
