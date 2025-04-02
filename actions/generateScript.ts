// actions/generateScript.ts
import { google } from '@ai-sdk/google';
import { generateText } from 'ai';

export async function generateScript(topic: string) {
    const { text } = await generateText({
        model: google('gemini-2.5-pro-exp-03-25'),
        prompt: `Write a YouTube script about ${topic}.`,
    });
    return text;
}