import React, { useState } from 'react';
import Card from '../ui/Card';
import { RobotIcon } from '../icons/Icons';
import { useAppContext } from '../../hooks/useAppContext';
import { getInventoryAnalysis } from '../../services/geminiService';

interface AIAnalystModalProps {
    onClose: () => void;
}

const AIAnalystModal: React.FC<AIAnalystModalProps> = ({ onClose }) => {
    const { products } = useAppContext();
    const [question, setQuestion] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [answer, setAnswer] = useState<string>('');

    const suggestedQuestions = [
        "Which items are low in stock?",
        "What is the total value of my inventory?",
        "Summarize the status of medical supplies.",
        "List all products from the supplier 'SynthCore'.",
    ];

    const handleAskQuestion = async (query: string) => {
        if (!query.trim()) return;
        
        setIsLoading(true);
        setError(null);
        setAnswer('');
        try {
            const result = await getInventoryAnalysis(query, products);
            setAnswer(result);
        } catch (err: any) {
            setError(err.message || 'An unknown error occurred.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        handleAskQuestion(question);
    };

    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
            <Card className="w-full max-w-2xl">
                 <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold flex items-center gap-2">
                        <RobotIcon className="text-neon-green" /> AI Inventory Analyst
                    </h2>
                    <button onClick={onClose} className="text-2xl hover:text-red-500 transition-colors">&times;</button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <p className="text-sm font-medium text-gray-400 mb-2">Ask a question about your inventory:</p>
                        <form onSubmit={handleSubmit}>
                            <textarea
                                value={question}
                                onChange={(e) => setQuestion(e.target.value)}
                                placeholder="e.g., How many electronic items are in stock?"
                                className="w-full h-24 form-input"
                                required
                            />
                            <button type="submit" className="w-full mt-2 px-4 py-2 rounded-lg bg-neon-green text-dark-bg font-semibold hover:shadow-neon-green transition-shadow disabled:opacity-50" disabled={isLoading}>
                                {isLoading ? 'Analyzing...' : 'Ask AI'}
                            </button>
                        </form>
                        <p className="text-xs text-gray-500 mt-4 mb-2">Or try a suggestion:</p>
                        <div className="flex flex-wrap gap-2">
                            {suggestedQuestions.map(q => (
                                <button key={q} onClick={() => { setQuestion(q); handleAskQuestion(q); }} className="text-xs px-3 py-1 rounded-full bg-white/10 hover:bg-white/20" disabled={isLoading}>{q}</button>
                            ))}
                        </div>
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-400 mb-2">AI Response:</p>
                        <div className="h-48 p-4 rounded-lg bg-black/20 border border-white/10 overflow-y-auto">
                            {isLoading && (
                                <div className="flex items-center justify-center h-full">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-neon-green"></div>
                                </div>
                            )}
                            {error && <p className="text-red-400">{error}</p>}
                            {answer && <p className="whitespace-pre-wrap">{answer}</p>}
                             {!isLoading && !error && !answer && <p className="text-gray-500">The AI's analysis will appear here.</p>}
                        </div>
                    </div>
                </div>

                <div className="flex justify-end mt-8">
                    <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg bg-white/10 border border-white/20 hover:bg-white/20 transition-colors">Close</button>
                </div>
            </Card>
        </div>
    );
};

export default AIAnalystModal;
