// actions/generateVideo.ts
import axios from 'axios';

export async function generateVideo(script: string) {
  const apiKey = process.env.RAPIDAPI_KEY;
  if (!apiKey) throw new Error("RAPIDAPI_KEY is missing.");

  try {
    const response = await axios.request({
      method: 'POST',
      url: 'https://text-to-video.p.rapidapi.com/v3/process_text_and_search_media',
      headers: {
        'x-rapidapi-key': apiKey,
        'x-rapidapi-host': 'text-to-video.p.rapidapi.com',
        'Content-Type': 'application/json'
      },
      data: {
        script,
        dimension: '16:9'
      }
    });

    const data = response.data;

    if (!data || !data.video_url) {
      console.error("Unexpected response:", data);
      throw new Error("Failed to generate video. Please try again later.");
    }

    return data.video_url;

  } catch (error: any) {
    if (error.response) {
      console.error("API Error Response:", error.response.data);
      if (error.response.status === 401 || error.response.status === 403) {
        throw new Error("Unauthorized access. Check your API key and permissions.");
      }
    } else {
      console.error("Unexpected Error:", error.message);
    }

    throw new Error("Video generation failed. Please check console for details.");
  }
}
