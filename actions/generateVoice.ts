// actions/generateVoice.ts
export async function generateVoice(script: string) {
    const response = await fetch("https://api.elevenlabs.io/v1/generate", {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${process.env.ELEVENLABS_API_KEY}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ text: script, voice: "default" })
    });
    const data = await response.json();
    return data.audio_url;
}