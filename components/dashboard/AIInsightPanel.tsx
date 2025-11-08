
import React, { useState, useEffect, useCallback } from 'react';
import Card from '../ui/Card';
import { getDashboardInsight } from '../../services/geminiService';
import { RobotIcon } from '../icons/Icons';
import { useAppContext } from '../../hooks/useAppContext';

const AIInsightPanel: React.FC = () => {
    const { products, bots } = useAppContext();
    const [insight, setInsight] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    const fetchInsight = useCallback(() => {
        setIsLoading(true);
        getDashboardInsight(products, bots)
            .then(setInsight)
            .finally(() => setIsLoading(false));
    }, [products, bots]);

    useEffect(() => {
        fetchInsight();
    }, [fetchInsight]);

    return (
        <Card className="relative overflow-hidden group h-full flex flex-col">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-neon-blue to-neon-green rounded-2xl blur opacity-20 group-hover:opacity-40 transition-opacity duration-500"></div>
            
            <div className="relative h-full flex flex-col">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold text-lg flex items-center gap-2">
                        <RobotIcon className="w-6 h-6 text-neon-blue" />
                        AI Insight
                    </h3>
                    <button
                        onClick={fetchInsight}
                        disabled={isLoading}
                        className="p-2 rounded-full hover:bg-white/10 disabled:opacity-50 disabled:animate-spin"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 4 23 10 17 10"></polyline><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path></svg>
                    </button>
                </div>
                <div className="flex-grow flex items-center justify-center">
                    {isLoading ? (
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-neon-blue"></div>
                    ) : (
                        <p className="text-center text-gray-300 italic text-md">"{insight}"</p>
                    )}
                </div>
            </div>
        </Card>
    );
};

export default AIInsightPanel;
