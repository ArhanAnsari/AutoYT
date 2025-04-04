// actions/generateVideo.ts

export async function generateVideo(script: string) {
    const apiKey = process.env.RAPIDAPI_KEY;
    if (!apiKey) throw new Error("RAPIDAPI_KEY is missing.");

    const response = await fetch("https://text-to-video.p.rapidapi.com/v3/process_text_and_search_media", {
        method: "POST",
        headers: {
            'x-rapidapi-key': apiKey,
            'x-rapidapi-host': 'text-to-video.p.rapidapi.com',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ script, dimension: '16:9' })
    });

    if (!response.ok) {
        throw new Error(`Video generation failed: ${response.statusText}`);
    }

    const data = await response.json();
    if (!data.video_url) {
        throw new Error("Failed to generate video. API response: " + JSON.stringify(data));
    }

    return data.video_url;
}
