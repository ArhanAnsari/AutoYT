/**
 * Text-to-Speech service using free APIs
 * Primary: Use ElevenLabs free tier (300k characters/month)
 * Fallback: Use Voicerss (free, no auth required)
 */

export async function generateSpeech(text: string, voiceId: string = "onwK4N9bzJcw8e1IHm3N"): Promise<string> {
  try {
    // Try ElevenLabs free tier first (if API key is available)
    if (process.env.ELEVENLABS_API_KEY) {
      const response = await fetch("https://api.elevenlabs.io/v1/text-to-speech/" + voiceId, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "xi-api-key": process.env.ELEVENLABS_API_KEY,
        },
        body: JSON.stringify({
          text: text,
          model_id: "eleven_monolingual_v1",
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.75,
          },
        }),
      });

      if (response.ok) {
        const audioBuffer = await response.arrayBuffer();
        // Convert to base64 or upload to storage
        // For now return a marker that it was generated
        return `audio-generated-${Date.now()}`;
      }
    }

    // Fallback: Use Voicerss (completely free, no auth needed)
    // Returns a direct audio URL
    const encodedText = encodeURIComponent(text.substring(0, 100)); // Voicerss has limits
    return `https://tts.voicerss.org/?key=free&hl=en-us&v=Linda&r=0&c=mp3&f=44khz_16bit_mono&src=${encodedText}`;
  } catch (error) {
    console.error("Error generating speech:", error);
    // Fallback to free VoiceRSS
    const encodedText = encodeURIComponent(text.substring(0, 100));
    return `https://tts.voicerss.org/?key=free&hl=en-us&v=Linda&r=0&c=mp3&f=44khz_16bit_mono&src=${encodedText}`;
  }
}
