import { GoogleGenerativeAI } from "@google/generative-ai";
import { PROJECTS_DB } from "../data/projects";

// Initialize Gemini API
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

if (!API_KEY) {
    console.error("Missing VITE_GEMINI_API_KEY in .env file");
}

const genAI = new GoogleGenerativeAI(API_KEY || '');
const model = genAI.getGenerativeModel({ model: "gemini-pro" });

// Prepare Context from Projects DB
const projectsContext = PROJECTS_DB.map(p =>
    `- ${p.title}: ${p.description} (Category: ${p.category})`
).join('\n');

const SYSTEM_PROMPT = `
You are the official AI Assistant for "OpenDiscover", a platform for discovering open-source apps.
Your goal is to help users find apps that match their needs based on the following available projects:

${projectsContext}

Guidelines:
1. Be helpful, friendly, and concise.
2. Recommend specific apps from the list above if they match the user's query.
3. If the user asks for something not in the list, suggest the closest alternative or politely say we don't have it yet.
4. Keep the tone professional but approachable (like a helpful tech expert).
5. Format your response nicely (markdown is supported).
`;

export const getBotResponse = async (userMessage: string): Promise<string> => {
    try {
        if (!API_KEY) return "Error: API Key is missing. Please check configuration.";

        // Construct the prompt with context
        const prompt = `${SYSTEM_PROMPT}\n\nUser: ${userMessage}\nAssistant:`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        return text;
    } catch (error) {
        console.error("Gemini API Error:", error);
        return "I'm having trouble connecting to my brain right now. Please try again later! 🤖";
    }
};
