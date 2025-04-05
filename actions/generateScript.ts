// actions/generateScript.ts
import { google } from '@ai-sdk/google';
import { generateText } from 'ai';

export async function generateScript(topic: string) {
    const { text } = await generateText({
        model: google('gemini-2.0-flash'),
        prompt: `Write a YouTube script about ${topic}.`,
    });
    return text;
}