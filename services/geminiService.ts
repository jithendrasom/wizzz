import { GoogleGenAI } from "@google/genai";

// Ensure API key is present; fallbacks are handled in UI if missing
const apiKey = process.env.API_KEY || ''; 
const ai = new GoogleGenAI({ apiKey });

export const askLaundryAssistant = async (question: string): Promise<string> => {
  if (!apiKey) return "API Key is missing. Please configure it to use the AI assistant.";

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: question,
      config: {
        systemInstruction: `You are "Suds," a friendly and expert laundry assistant for the Wizzzz Laundry app. 
        Your goal is to help users with stain removal, fabric care, sorting clothes, and understanding care labels.
        
        Guidelines:
        1. Be concise and practical. Users are likely standing in front of their washing machine.
        2. Use bullet points for steps.
        3. If a stain is difficult, suggest professional cleaning but give a home remedy first if safe.
        4. Keep a light, clean, and helpful tone.
        5. Do not answer questions unrelated to laundry, cleaning, or clothing care.`,
      }
    });
    return response.text || "I couldn't generate a response. Please try again.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Sorry, I'm having trouble connecting to my laundry knowledge base right now. Please try again later.";
  }
};