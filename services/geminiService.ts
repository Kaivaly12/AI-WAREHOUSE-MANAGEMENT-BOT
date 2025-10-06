import { GoogleGenAI, Chat, Type } from "@google/genai";
import type { Product } from '../types';
import { ProductStatus } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

let chat: Chat | null = null;

const getChat = (): Chat => {
    if (!chat) {
        chat = ai.chats.create({
            model: 'gemini-2.5-flash',
            config: {
                systemInstruction: `You are a helpful and friendly AI assistant for a futuristic warehouse management system named 'AI Warehouse'.
                You can answer questions about inventory, bot status, and demand forecasts.
                Keep your answers concise and helpful.
                You have access to the following mock data context if needed, but do not state that it is mock data, treat it as real-time information.
                - Inventory: Several products including 'Quantum Processor', 'Hydrogel Packs', 'Carbon Nanotubes', some are in-stock, low-stock, or out-of-stock.
                - Bots: 8 bots, with statuses like Active, Idle, Charging, Maintenance. They are in various locations like 'Aisle 7' or 'Charging Station'.
                - Demand: Predicted demand is up 12% this month.
                `,
            },
        });
    }
    return chat;
}

export const getMarketPrediction = async (): Promise<string> => {
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: "Provide a concise market prediction summary for our futuristic warehouse. Focus on one high-demand product category (e.g., electronics, medical, energy) and mention a specific product. Keep it under 40 words.",
        });
        return response.text;
    } catch (error) {
        console.error("Error getting market prediction:", error);
        return "Could not fetch AI prediction at this time. Please check your connection or API key.";
    }
};

export const getReorderSuggestion = async (products: Product[]): Promise<string[]> => {
    const lowStockProducts = products
        .filter(p => p.status === ProductStatus.LowStock)
        .map(p => ({ id: p.id, name: p.name, quantity: p.quantity }));

    if (lowStockProducts.length === 0) {
        return [];
    }
    
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `The following products are low in stock: ${JSON.stringify(lowStockProducts)}. Which ones should be reordered first based on critical need (assume medical and energy are high priority)? Respond with a JSON object containing a single key "product_ids" which is an array of the product ID strings to reorder.`,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        product_ids: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.STRING,
                            },
                            description: "Array of product IDs that need to be reordered."
                        },
                    },
                    required: ['product_ids'],
                }
            }
        });

        let jsonStr = response.text.trim();
        if (jsonStr.startsWith("```json")) {
            jsonStr = jsonStr.substring(7, jsonStr.length - 3).trim();
        } else if (jsonStr.startsWith("```")) {
            jsonStr = jsonStr.substring(3, jsonStr.length - 3).trim();
        }
        
        const json = JSON.parse(jsonStr);
        return json.product_ids || [];
    } catch (error) {
        console.error("Error getting reorder suggestion:", error);
        throw error;
    }
};

export const getChatbotResponseStream = async (message: string) => {
    const chatSession = getChat();
    try {
        const result = await chatSession.sendMessageStream({ message });
        return result;
    } catch (error) {
        console.error("Error getting chatbot response:", error);
        throw error;
    }
}

export const getAIRecommendation = async (): Promise<string> => {
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: "Generate a single, actionable strategic recommendation for a warehouse manager. The scenario: a key supplier for 'Energy' products is experiencing production slowdowns. Demand for energy products is expected to rise 10% next quarter. Keep the recommendation under 50 words.",
        });
        return response.text;
    } catch (error) {
        console.error("Error getting AI recommendation:", error);
        return "Could not fetch AI recommendation. There might be an issue with the service.";
    }
};