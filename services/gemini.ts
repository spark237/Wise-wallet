import { GoogleGenAI } from "@google/genai";
import { Transaction } from "../types";

const SYSTEM_INSTRUCTION = `
You are an expert financial advisor named "WiseBot". 
Your goal is to analyze the user's transaction history and provide brief, encouraging, and actionable financial advice.
Focus on spending patterns, potential savings, and budget health.
Keep your response under 100 words.
Structure the response as 3 short bullet points.
`;

export const getFinancialAdvice = async (transactions: Transaction[]): Promise<string> => {
  try {
    if (!process.env.API_KEY) {
      return "API Key is missing. Unable to generate insights.";
    }

    // Filter to last 20 transactions to keep context size manageable and relevant
    const recentTransactions = transactions.slice(0, 20).map(t => ({
      date: t.date,
      type: t.type,
      category: t.category,
      amount: t.amount,
      description: t.description
    }));

    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Here are my recent transactions: ${JSON.stringify(recentTransactions)}. What are your insights?`,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
      }
    });

    return response.text || "No insights available at the moment.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Sorry, I couldn't analyze your data right now. Please try again later.";
  }
};