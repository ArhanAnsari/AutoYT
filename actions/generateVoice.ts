// actions/generateVoice.ts
export async function generateVoice(script: string) {
    const apiKey = process.env.ELEVENLABS_API_KEY;
    if (!apiKey) throw new Error("ELEVENLABS_API_KEY is missing.");

    const response = await fetch("https://api.elevenlabs.io/v1/generate", {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${apiKey}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ text: script, voice: "default" })
    });

    if (!response.ok) {
        throw new Error(`Voice generation failed: ${response.statusText}`);
    }

    const data = await response.json();
    if (!data.audio_url) {
        throw new Error("Failed to generate voice. API response: " + JSON.stringify(data));
    }

    return data.audio_url;
}
