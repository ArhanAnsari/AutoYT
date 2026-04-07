import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function generateScript(topic: string) {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro-latest" });

  const prompt = `
    You are an expert YouTube scriptwriter. Write a 3-minute video script about: ${topic}.
    Include a Hook, Intro, Main Content, and CTA. 
    Output strictly as JSON in the following format:
    {
      "title": "...",
      "description": "...",
      "hook": "...",
      "intro": "...",
      "body": ["point 1", "point 2", "..."],
      "cta": "..."
    }
  `;

  const result = await model.generateContent(prompt);
  const response = result.response.text();
  
  // Clean potential markdown formatting
  const rawJson = response.replace(/\`\`\`json/g, '').replace(/\`\`\`/g, '');
  
  try {
    return JSON.parse(rawJson);
  } catch (error) {
    console.error("Failed to parse script JSON:", error);
    throw new Error("Failed to generate valid script JSON.");
  }
}
