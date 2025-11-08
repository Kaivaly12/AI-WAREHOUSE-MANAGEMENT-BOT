import { GoogleGenAI, Chat, Type, FunctionDeclaration } from "@google/genai";
import type { Product, Bot, ChartData } from '../types';
import { ProductStatus, BotStatus } from "../types";

const getBaseAi = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

export const createChatSession = (tools?: FunctionDeclaration[]): Chat => {
    const ai = getBaseAi();
    return ai.chats.create({
        model: 'gemini-2.5-flash',
        config: {
            systemInstruction: `You are an integrated AI assistant for the 'AI Warehouse' dashboard. 
            You can help manage the application and provide real-time information. 
            You have access to tools to get data about inventory and bots, and to navigate the user. 
            When a user asks a question, use the available tools if necessary to provide an accurate, real-time answer. 
            If you use a tool, inform the user that you are fetching the information (e.g., "Checking the inventory...").
            Be proactive, concise, and helpful. Do not mention that you are using mock data.
            Valid navigation pages are:
            - "dashboard" or "home" -> /
            - "inventory" -> /inventory
            - "demand" or "forecast" -> /demand-forecast
            - "bots" or "bot control" -> /bot-control
            - "reports" -> /reports
            - "settings" -> /settings`,
            tools: tools ? [{ functionDeclarations: tools }] : undefined,
        },
    });
}

export const getDashboardInsight = async (products: Product[], bots: Bot[]): Promise<string> => {
    try {
        const ai = getBaseAi();
        const simplifiedProducts = products.map(p => ({ category: p.category, status: p.status, quantity: p.quantity }));
        const simplifiedBots = bots.map(b => ({ status: b.status, tasksCompleted: b.tasksCompleted }));
        
        const prompt = `
        Analyze the current warehouse status and provide one key strategic insight for the manager.
        - Inventory: ${JSON.stringify(simplifiedProducts)}
        - Bots: ${JSON.stringify(simplifiedBots)}
        Based on this data, what is the most important thing the manager should focus on right now? (e.g., a bottleneck, an opportunity, a risk).
        Keep the insight concise and actionable, under 50 words.`;
        
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });
        return response.text;
    } catch (error) {
        console.error("Error getting dashboard insight:", error);
        return "Could not fetch AI insight. The service may be temporarily unavailable.";
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
        const ai = getBaseAi();
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


export const getAIRecommendation = async (): Promise<string> => {
    try {
        const ai = getBaseAi();
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

export const getAIBotSuggestion = async (taskDescription: string, bots: Bot[]): Promise<{ botId: string; reason: string; task: string }> => {
    try {
        const ai = getBaseAi();
        const simplifiedBots = bots.map(b => ({
            id: b.id,
            status: b.status,
            battery: b.battery,
            location: b.location,
        }));

        const prompt = `You are a warehouse logistics AI. Your task is to choose the best bot for a new assignment.
        
        Task Description: "${taskDescription}"

        Available Bots: ${JSON.stringify(simplifiedBots, null, 2)}

        Evaluation Criteria:
        1.  **Status**: The bot must be 'Active' or 'Idle'. Do NOT select bots that are 'Charging' or in 'Maintenance'.
        2.  **Battery**: Higher battery is better. Avoid assigning tasks to bots with low battery (< 30%) unless no other option exists.
        3.  **Proximity**: If the task mentions a location (e.g., 'Aisle 7'), bots already at or near that location are strongly preferred.
        4.  **Priority**: 'Idle' bots are generally preferred over 'Active' bots unless an 'Active' bot is significantly closer to the task location.

        Based on these criteria, analyze the list of bots and recommend the single best one for the task. 
        Respond ONLY with a valid JSON object.`;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        botId: { type: Type.STRING, description: "The ID of the recommended bot (e.g., 'BOT-01')." },
                        reason: { type: Type.STRING, description: "A brief, clear explanation for why this bot was chosen." },
                        task: { type: Type.STRING, description: "A concise, machine-readable task description based on the user's input (e.g., 'Retrieve PID-002 from Aisle 7')." }
                    },
                    required: ['botId', 'reason', 'task']
                }
            }
        });

        let jsonStr = response.text.trim();
        // The Gemini API sometimes wraps the JSON in markdown, so we need to clean it.
        if (jsonStr.startsWith("```json")) {
            jsonStr = jsonStr.substring(7, jsonStr.length - 3).trim();
        } else if (jsonStr.startsWith("```")) {
            jsonStr = jsonStr.substring(3, jsonStr.length - 3).trim();
        }

        return JSON.parse(jsonStr);

    } catch (error) {
        console.error("Error getting AI bot suggestion:", error);
        throw new Error("Failed to get AI recommendation. The model may have returned an invalid response.");
    }
};


export const generateVideoFromImage = async (
    base64Image: string,
    mimeType: string,
    prompt: string,
    aspectRatio: '16:9' | '9:16'
): Promise<Blob> => {
    try {
        // As per guidelines for Veo, a new client should be instantiated right before the API call.
        const ai = getBaseAi();

        let operation = await ai.models.generateVideos({
            model: 'veo-3.1-fast-generate-preview',
            prompt: prompt,
            image: {
                imageBytes: base64Image,
                mimeType: mimeType,
            },
            config: {
                numberOfVideos: 1,
                resolution: '720p',
                aspectRatio: aspectRatio,
            }
        });

        // Poll for the result
        while (!operation.done) {
            await new Promise(resolve => setTimeout(resolve, 10000));
            operation = await ai.operations.getVideosOperation({ operation: operation });
        }

        const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
        if (!downloadLink) {
            throw new Error("Video generation failed: no download link found in the operation response.");
        }

        // The response.body contains the MP4 bytes. You must append an API key when fetching from the download link.
        const response = await fetch(`${downloadLink}&key=${process.env.API_KEY}`);
        
        if (!response.ok) {
            const errorText = await response.text();
            console.error('Failed to download video:', errorText);
            throw new Error(`Failed to download video. Status: ${response.status} - ${response.statusText}`);
        }
        
        const videoBlob = await response.blob();
        return videoBlob;
    } catch (error) {
        console.error("Error in generateVideoFromImage:", error);
        throw error; // Re-throw to be caught by the UI component
    }
};

export const getInventoryAnalysis = async (question: string, products: Product[]): Promise<string> => {
    try {
        const ai = getBaseAi();
        const simplifiedProducts = products.map(({ id, name, category, quantity, price, status, supplier }) => 
            ({ id, name, category, quantity, price, status, supplier }));

        const prompt = `You are an AI inventory analyst for a futuristic warehouse. Analyze the provided JSON data of products and answer the user's question concisely and accurately.
        
        Product Data: ${JSON.stringify(simplifiedProducts, null, 2)}
        
        User's Question: "${question}"
        
        Provide a direct and helpful answer based *only* on the data provided. If the question cannot be answered with the data, say so.`;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });
        return response.text;
    } catch (error) {
        console.error("Error getting inventory analysis:", error);
        throw new Error("Failed to get inventory analysis from AI.");
    }
};

export const getForecastExplanation = async (forecastData: ChartData[]): Promise<string> => {
    try {
        const ai = getBaseAi();
        const prompt = `You are a data analyst AI. The following JSON data represents the predicted market demand for the next 30 days: ${JSON.stringify(forecastData)}. Analyze this data and provide a short, easy-to-understand explanation of the key trends. Mention any significant peaks or troughs and suggest a potential reason if applicable. Keep it concise and under 50 words.`;
        
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });
        return response.text;
    } catch (error) {
        console.error("Error getting forecast explanation:", error);
        return "Could not fetch AI explanation at this time.";
    }
};

export const generateReportSummary = async (reportType: 'Inventory' | 'Bot Performance', products: Product[], bots: Bot[]): Promise<string> => {
    try {
        const ai = getBaseAi();
        let prompt = '';
        if (reportType === 'Inventory') {
             const simplifiedProducts = products.map(p => ({ category: p.category, status: p.status, quantity: p.quantity, price: p.price }));
            prompt = `You are an AI auditor. Based on this inventory data (${JSON.stringify(simplifiedProducts)}), generate a brief summary report. Include total number of items, total stock value, and the status of the most critical category (Medical or Energy). Keep it under 60 words.`
        } else { // Bot Performance
            const simplifiedBots = bots.map(b => ({ id: b.id, status: b.status, tasksCompleted: b.tasksCompleted, battery: b.battery }));
            prompt = `You are an AI operations manager. Based on this bot data (${JSON.stringify(simplifiedBots)}), generate a brief performance summary. Highlight the most and least active bots by tasks completed, and mention any bots requiring attention (e.g., in maintenance or low battery). Keep it under 60 words.`
        }

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });
        return response.text;
    } catch (error) {
        console.error("Error generating report summary:", error);
        return "Could not generate AI summary for the report.";
    }
};