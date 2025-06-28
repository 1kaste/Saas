
import { GoogleGenAI } from "@google/genai";

if (!process.env.API_KEY) {
  console.warn("API_KEY environment variable not set. Gemini API calls will fail.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

export const generateProductInsight = async (productTitle: string, productDescription: string): Promise<string> => {
  try {
    const prompt = `Give me a concise, engaging, and surprising tech insight or a forward-looking fact about this product. Keep it to 1-2 sentences. Focus on innovation, future trends, or a lesser-known capability.

    Product Title: ${productTitle}
    Product Description: ${productDescription}

    Tech Insight:`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-preview-04-17',
      contents: prompt,
    });
    
    return response.text;
  } catch (error) {
    console.error("Error generating product insight:", error);
    if (error instanceof Error) {
        return `Failed to generate insight. Please check console for details.`;
    }
    return "An unknown error occurred while generating the insight.";
  }
};
