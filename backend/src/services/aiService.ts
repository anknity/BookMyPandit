import OpenAI from "openai";
import axios from "axios";

// Primary: Groq Llama 3 70B
export async function generateTextWithGroq(messages: any[]) {
    const GROQ_API_KEY = process.env.GROQ_API_KEY || "";
    if (!GROQ_API_KEY) throw new Error("GROQ_API_KEY is missing");

    const groq = new OpenAI({
        apiKey: GROQ_API_KEY,
        baseURL: "https://api.groq.com/openai/v1",
    });

    console.log("Attempting generation with Groq...");
    try {
        const chatCompletion = await groq.chat.completions.create({
            messages,
            model: "llama3-70b-8192",
            temperature: 0.7,
            max_tokens: 1500,
        });
        return chatCompletion.choices[0]?.message?.content || "";
    } catch (e: any) {
        console.error("GROQ API HTTP ERROR:");
        console.error(e.response ? JSON.stringify(e.response.data) : e.message);
        throw e;
    }
}

// Secondary (Fallback): GitHub Models GPT-4o
export async function generateTextWithGitHub(messages: any[]) {
    const GITHUB_TOKEN = process.env.GITHUB_TOKEN || "";
    if (!GITHUB_TOKEN) throw new Error("GITHUB_TOKEN is missing");

    console.log("Attempting generation with GitHub Models...");
    try {
        const response = await axios.post(
            "https://models.inference.ai.azure.com/chat/completions",
            {
                messages,
                model: "gpt-4o",
                temperature: 0.7,
                max_tokens: 1500,
            },
            {
                headers: {
                    "Authorization": `Bearer ${GITHUB_TOKEN}`,
                    "Content-Type": "application/json"
                }
            }
        );
        return response.data.choices[0]?.message?.content || "";
    } catch (e: any) {
        console.error("GITHUB API HTTP ERROR:");
        console.error(e.response ? JSON.stringify(e.response.data) : e.message);
        throw e;
    }
}

/**
 * Main AI generation function that attempts Groq first, and falls back to GitHub Models.
 */
export async function generateAstrologyResponse(messages: any[]): Promise<string> {
    try {
        // Try Groq first for speed
        const groqResult = await generateTextWithGroq(messages);
        if (groqResult) return groqResult;
        throw new Error("Groq returned empty result");
    } catch (groqError) {
        console.warn("Groq generation failed. Falling back to GitHub Models. Error:", groqError);

        try {
            // Fallback to GitHub GPT-4o
            const githubResult = await generateTextWithGitHub(messages);
            return githubResult;
        } catch (githubError) {
            console.error("Both Groq and GitHub Models failed.", githubError);
            return "I apologize, but the celestial channels are currently unavailable. Please try your cosmic query again in a moment.";
        }
    }
}
