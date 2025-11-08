import React, { useState, useEffect } from 'react';
import Card from '../ui/Card';
import { getForecastExplanation } from '../../services/geminiService';
import { DEMAND_FORECAST_DATA } from '../../constants';
import { RobotIcon } from '../icons/Icons';

interface AIExplanationModalProps {
    onClose: () => void;
}

const AIExplanationModal: React.FC<AIExplanationModalProps> = ({ onClose }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [explanation, setExplanation] = useState<string>('');

    useEffect(() => {
        const fetchExplanation = async () => {
            try {
                const result = await getForecastExplanation(DEMAND_FORECAST_DATA);
                setExplanation(result);
            } catch (err: any) {
                setError(err.message || 'An unknown error occurred.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchExplanation();
    }, []);

    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
            <Card className="w-full max-w-md">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold flex items-center gap-2">
                        <RobotIcon className="text-neon-blue" /> AI Forecast Summary
                    </h2>
                    <button onClick={onClose} className="text-2xl hover:text-red-500 transition-colors">&times;</button>
                </div>

                <div className="min-h-[100px] bg-black/20 p-4 rounded-lg border border-white/10 flex items-center justify-center">
                    {isLoading && (
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-neon-blue"></div>
                    )}
                    {error && <p className="text-red-400">{error}</p>}
                    {explanation && <p className="text-center">{explanation}</p>}
                </div>

                <div className="flex justify-end mt-8">
                    <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg bg-white/10 border border-white/20 hover:bg-white/20 transition-colors">Close</button>
                </div>
            </Card>
        </div>
    );
};

export default AIExplanationModal;
