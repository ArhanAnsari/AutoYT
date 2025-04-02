// actions/generateVideo.ts

const apiKey = process.env.RAPIDAPI_KEY;
if (!apiKey) {
    throw new Error("RAPIDAPI_KEY is not defined in the environment variables.");
}

export async function generateVideo(script: string) {
    const response = await fetch("https://text-to-video.p.rapidapi.com/v3/process_text_and_search_media", {
        method: "POST",
        headers: {
            'x-rapidapi-key': 'a31edf94ccmsh591b19161e4448fp1f3636jsn3cd66e78c9ef',
            'x-rapidapi-host': 'text-to-video.p.rapidapi.com',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            script: `${script}`,
            dimension: '16:9'
        })
    });
    const data = await response.json();

    return data.video_url;
}

