import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { RobotIcon } from '../icons/Icons';
import Card from '../ui/Card';
import { createChatSession } from '../../services/geminiService';
import { useAppContext } from '../../hooks/useAppContext';
import { ProductStatus } from '../../types';
import { Type, Chat, FunctionDeclaration, Part } from '@google/genai';


interface Message {
    text: string;
    sender: 'user' | 'ai';
}

const Chatbot: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [chat, setChat] = useState<Chat | null>(null);

    const messagesEndRef = useRef<HTMLDivElement>(null);
    const { products, bots } = useAppContext();
    const navigate = useNavigate();

    // === Define Tool Functions ===
    const tools: FunctionDeclaration[] = useMemo(() => [
        {
            name: 'navigate_to_page',
            description: 'Navigate to a specific page in the application.',
            parameters: {
                type: Type.OBJECT,
                properties: {
                    page: {
                        type: Type.STRING,
                        description: 'The destination page. Must be one of: "dashboard", "inventory", "demand-forecast", "bot-control", "reports", "settings".',
                    },
                },
                required: ['page'],
            },
        },
        {
            name: 'get_inventory_summary',
            description: 'Get a summary of the current inventory status.',
            parameters: { type: Type.OBJECT, properties: {} }
        },
        {
            name: 'find_low_stock_items',
            description: 'Get a list of all products that are low in stock.',
            parameters: { type: Type.OBJECT, properties: {} }
        },
        {
            name: 'get_bot_status',
            description: 'Gets the status of one or all warehouse bots.',
            parameters: {
                type: Type.OBJECT,
                properties: {
                    bot_id: {
                        type: Type.STRING,
                        description: 'The ID of the bot, e.g., "BOT-01". If omitted, returns status for all bots.'
                    },
                },
            }
        },
    ], []);


    const toolFunctions = useMemo(() => ({
        navigate_to_page: ({ page }: { page: string }) => {
            const pathMap: { [key: string]: string } = {
                'dashboard': '/', 'home': '/',
                'inventory': '/inventory',
                'demand-forecast': '/demand-forecast', 'demand': '/demand-forecast', 'forecast': '/demand-forecast',
                'bot-control': '/bot-control', 'bots': '/bot-control',
                'reports': '/reports',
                'settings': '/settings',
            };
            const path = pathMap[page.toLowerCase()];
            if (path) {
                navigate(path);
                return { success: `Navigated to ${page}.` };
            }
            return { error: `Could not find the page: ${page}.` };
        },
        get_inventory_summary: () => {
            const totalItems = products.length;
            const inStock = products.filter(p => p.status === ProductStatus.InStock).length;
            const lowStock = products.filter(p => p.status === ProductStatus.LowStock).length;
            const outOfStock = products.filter(p => p.status === ProductStatus.OutOfStock).length;
            return { totalItems, inStock, lowStock, outOfStock };
        },
        find_low_stock_items: () => {
            const lowStockItems = products
                .filter(p => p.status === ProductStatus.LowStock)
                .map(p => ({ id: p.id, name: p.name, quantity: p.quantity }));
            return { lowStockItems };
        },
        get_bot_status: ({ bot_id }: { bot_id?: string }) => {
            const botsToReport = bot_id ? bots.filter(b => b.id.toLowerCase() === bot_id.toLowerCase()) : bots;
            if (botsToReport.length === 0) return { error: `Bot with ID ${bot_id} not found.` };
            
            const report = botsToReport.map(b => ({
                id: b.id,
                status: b.status,
                battery: `${b.battery}%`,
                location: b.location,
                currentTask: b.currentTask || 'None'
            }));
            return { bots: report };
        }
    }), [navigate, products, bots]);
    
    // Initialize chat session
    useEffect(() => {
        if(isOpen && !chat) {
            setChat(createChatSession(tools));
        }
    }, [isOpen, chat, tools]);


    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };
    useEffect(scrollToBottom, [messages]);


    const handleSend = async () => {
        if (input.trim() === '' || isLoading || !chat) return;

        const userMessage: Message = { text: input, sender: 'user' };
        setMessages(prev => [...prev, userMessage]);
        const currentInput = input;
        setInput('');
        setIsLoading(true);

        try {
            let stream = await chat.sendMessageStream({ message: currentInput });

            let text = '';
            let functionCalls: any[] = [];

            for await (const chunk of stream) {
                 if (chunk.functionCalls) {
                    functionCalls.push(...chunk.functionCalls);
                }
                text += chunk.text;
            }

            if (functionCalls.length > 0) {
                setMessages(prev => [...prev, { text: text || 'Thinking...', sender: 'ai' }]);

                const toolResponses: { id: string; name: string; response: any; }[] = [];
                for (const call of functionCalls) {
                    const toolFunction = (toolFunctions as any)[call.name];
                    if (toolFunction) {
                        const result = await Promise.resolve(toolFunction(call.args));
                        toolResponses.push({
                            id: call.id,
                            name: call.name,
                            response: result,
                        });
                    }
                }
                
                const functionResponseParts: Part[] = toolResponses.map(
                  (toolResponse) => ({
                    functionResponse: {
                      name: toolResponse.name,
                      response: toolResponse.response,
                    },
                  })
                );
                
                stream = await chat.sendMessageStream({ message: functionResponseParts });
                
                // Start a new AI message for the final response
                setMessages(prev => [...prev, { text: '', sender: 'ai' }]);
                for await (const chunk of stream) {
                    setMessages(prev => {
                        const newMessages = [...prev];
                        newMessages[newMessages.length-1].text += chunk.text;
                        return newMessages;
                    });
                }

            } else {
                // No function calls, just stream the text response
                setMessages(prev => [...prev, { text: text, sender: 'ai' }]);
            }

        } catch (error) {
            console.error("Chatbot error:", error);
            setMessages(prev => [...prev, { text: "Sorry, I encountered an error. Please try again.", sender: 'ai' }]);
        } finally {
            setIsLoading(false);
        }
    };
    
    const BlinkingCursor = () => <span className="blinking-cursor">▍</span>;

    return (
        <>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="fixed bottom-8 right-8 w-16 h-16 bg-neon-blue rounded-full text-white flex items-center justify-center shadow-lg shadow-neon-blue/50 hover:scale-110 transition-transform z-50"
                aria-label="Toggle Chatbot"
            >
                <RobotIcon className="w-8 h-8" />
            </button>

            {isOpen && (
                <div className="fixed inset-0 sm:inset-auto sm:bottom-28 sm:right-8 w-full sm:w-96 h-full sm:h-[32rem] z-50">
                    <Card className="flex flex-col h-full !p-0 rounded-none sm:rounded-2xl">
                        <header className="p-4 border-b border-white/20 flex justify-between items-center">
                            <h3 className="font-bold text-lg">AI Warehouse Assistant</h3>
                            <button onClick={() => setIsOpen(false)} className="sm:hidden text-2xl">&times;</button>
                        </header>
                        <div className="flex-1 p-4 overflow-y-auto">
                            <div className="flex flex-col gap-4">
                                {messages.map((msg, index) => (
                                    <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                                        <div className={`max-w-xs px-4 py-2 rounded-2xl ${msg.sender === 'user' ? 'bg-neon-blue text-dark-bg rounded-br-none' : 'bg-gray-200 dark:bg-gray-700 rounded-bl-none'}`}>
                                            <p className="text-sm whitespace-pre-wrap">
                                                {msg.text}
                                                {msg.sender === 'ai' && isLoading && index === messages.length - 1 && <BlinkingCursor />}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                                {isLoading && messages.length > 0 && messages[messages.length - 1].sender === 'user' && (
                                     <div className="flex justify-start">
                                        <div className="px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-700">
                                            <div className="flex items-center gap-2">
                                                <span className="w-2 h-2 bg-gray-500 rounded-full animate-pulse"></span>
                                                <span className="w-2 h-2 bg-gray-500 rounded-full animate-pulse [animation-delay:0.2s]"></span>
                                                <span className="w-2 h-2 bg-gray-500 rounded-full animate-pulse [animation-delay:0.4s]"></span>
                                            </div>
                                        </div>
                                    </div>
                                )}
                                <div ref={messagesEndRef} />
                            </div>
                        </div>
                        <footer className="p-4 border-t border-white/20">
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                                    placeholder="Ask something..."
                                    className="flex-1 px-4 py-2 rounded-lg bg-black/5 dark:bg-white/5 border-transparent focus:border-neon-blue focus:ring-0"
                                    disabled={isLoading}
                                />
                                <button onClick={handleSend} className="px-4 py-2 bg-neon-blue text-dark-bg font-semibold rounded-lg disabled:opacity-50" disabled={isLoading || !input.trim()}>Send</button>
                            </div>
                        </footer>
                    </Card>
                </div>
            )}
            <style>{`
                @keyframes blink { 50% { opacity: 0; } }
                .blinking-cursor { animation: blink 1s step-end infinite; }
                .whitespace-pre-wrap { white-space: pre-wrap; word-break: break-word; }
            `}</style>
        </>
    );
};

export default Chatbot;