import React, { useState, useRef, useEffect, useCallback } from 'react';
import { RobotIcon } from '../icons/Icons';
import Card from '../ui/Card';
import { getChatbotResponseStream } from '../../services/geminiService';

interface Message {
    text: string;
    sender: 'user' | 'ai';
}

const Chatbot: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(scrollToBottom, [messages]);

    const getInitialMessage = useCallback(async () => {
        if (messages.length > 0 || !isOpen) return;
        setIsLoading(true);
        setMessages([{ text: '', sender: 'ai' }]);
        try {
            const stream = await getChatbotResponseStream("Hello");
            for await (const chunk of stream) {
                setMessages(prev => {
                    const newMessages = [...prev];
                    newMessages[newMessages.length - 1].text += chunk.text;
                    return newMessages;
                });
            }
        } catch (error) {
            setMessages([{ text: "Sorry, I'm having trouble connecting. Please try again later.", sender: 'ai' }]);
        } finally {
            setIsLoading(false);
        }
    }, [messages.length, isOpen]);

    useEffect(() => {
        if (isOpen) {
            getInitialMessage();
        }
    }, [isOpen, getInitialMessage]);


    const handleSend = async () => {
        if (input.trim() === '' || isLoading) return;

        const userMessage: Message = { text: input, sender: 'user' };
        setMessages(prev => [...prev, userMessage, { text: '', sender: 'ai' }]);
        const currentInput = input;
        setInput('');
        setIsLoading(true);

        try {
            const stream = await getChatbotResponseStream(currentInput);
            for await (const chunk of stream) {
                setMessages(prev => {
                    const newMessages = [...prev];
                    newMessages[newMessages.length - 1].text += chunk.text;
                    return newMessages;
                });
            }
        } catch (error) {
            setMessages(prev => {
                const newMessages = [...prev];
                newMessages[newMessages.length - 1].text = "Sorry, I encountered an error. Please try again.";
                return newMessages;
            });
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