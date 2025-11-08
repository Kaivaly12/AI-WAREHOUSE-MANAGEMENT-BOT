import React, { useState } from 'react';
import Card from '../ui/Card';
import type { Bot } from '../../types';
import { getAIBotSuggestion } from '../../services/geminiService';
import { RobotIcon } from '../icons/Icons';

interface AIDelegationModalProps {
    bots: Bot[];
    onClose: () => void;
    onConfirm: (botId: string, task: string) => void;
}

interface Recommendation {
    botId: string;
    reason: string;
    task: string;
}

const AIDelegationModal: React.FC<AIDelegationModalProps> = ({ bots, onClose, onConfirm }) => {
    const [taskDescription, setTaskDescription] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [recommendation, setRecommendation] = useState<Recommendation | null>(null);

    const handleAnalyze = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!taskDescription.trim()) {
            setError('Please enter a task description.');
            return;
        }
        setIsLoading(true);
        setError(null);
        setRecommendation(null);
        try {
            const result = await getAIBotSuggestion(taskDescription, bots);
            setRecommendation(result);
        } catch (err: any) {
            setError(err.message || 'An unknown error occurred.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleConfirm = () => {
        if (recommendation) {
            onConfirm(recommendation.botId, recommendation.task);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
            <Card className="w-full max-w-lg">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold flex items-center gap-2">
                        <RobotIcon className="text-neon-blue" /> AI Task Delegation
                    </h2>
                    <button onClick={onClose} className="text-2xl hover:text-red-500 transition-colors">&times;</button>
                </div>
                
                {!isLoading && !recommendation && (
                     <form onSubmit={handleAnalyze}>
                        <div className="space-y-4">
                            <div>
                                <label htmlFor="task-description" className="block text-sm font-medium text-gray-400 mb-2">
                                    Describe the task for the AI to delegate
                                </label>
                                <textarea
                                    id="task-description"
                                    value={taskDescription}
                                    onChange={(e) => setTaskDescription(e.target.value)}
                                    placeholder="e.g., 'Retrieve item PID-002 from Aisle 7 and deliver it to the packing station'"
                                    className="w-full h-28 form-input"
                                    required
                                />
                            </div>
                            {error && <p className="text-red-400 text-sm">{error}</p>}
                        </div>
                        <div className="flex justify-end gap-4 mt-8">
                            <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg bg-white/10 border border-white/20 hover:bg-white/20 transition-colors">Cancel</button>
                            <button type="submit" className="px-4 py-2 rounded-lg bg-neon-blue text-dark-bg font-semibold hover:shadow-neon-blue transition-shadow">Analyze & Suggest</button>
                        </div>
                    </form>
                )}
                
                {isLoading && (
                    <div className="text-center py-10">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-neon-blue mx-auto mb-4"></div>
                        <p className="font-semibold text-lg">AI is analyzing options...</p>
                        <p className="text-gray-400">Please wait a moment.</p>
                    </div>
                )}

                {!isLoading && recommendation && (
                    <div>
                        <h3 className="text-lg font-semibold mb-2 text-neon-green">AI Recommendation:</h3>
                        <div className="bg-neon-green/10 p-4 rounded-lg border border-neon-green/30 space-y-2">
                            <p><strong>Assign to:</strong> <span className="font-bold text-xl">{recommendation.botId}</span></p>
                            <p><strong>Generated Task:</strong> {recommendation.task}</p>
                            <p><strong>Reason:</strong> {recommendation.reason}</p>
                        </div>
                        <div className="flex justify-end gap-4 mt-8">
                            <button type="button" onClick={() => setRecommendation(null)} className="px-4 py-2 rounded-lg bg-white/10 border border-white/20 hover:bg-white/20 transition-colors">Back</button>
                            <button type="button" onClick={handleConfirm} className="px-4 py-2 rounded-lg bg-neon-green text-dark-bg font-semibold hover:shadow-neon-green transition-shadow">Confirm Assignment</button>
                        </div>
                    </div>
                )}
            </Card>
        </div>
    );
};

export default AIDelegationModal;
