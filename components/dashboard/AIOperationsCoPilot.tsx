import React from 'react';
import Card from '../ui/Card';
import SuggestionCard from './SuggestionCard';
import { RobotIcon } from '../icons/Icons';
import type { CoPilotSuggestion } from '../../types';

interface AIOperationsCoPilotProps {
    suggestions: CoPilotSuggestion[];
    isLoading: boolean;
    onExecute: (plan: CoPilotSuggestion) => void;
    onDismiss: (suggestionId: string) => void;
    onRefresh: () => void;
}

const AIOperationsCoPilot: React.FC<AIOperationsCoPilotProps> = ({ suggestions, isLoading, onExecute, onDismiss, onRefresh }) => {
    return (
        <Card className="!p-0">
            <div className="flex justify-between items-center p-6">
                <h2 className="text-xl font-bold flex items-center gap-3">
                    <RobotIcon className="w-7 h-7 text-neon-blue" />
                    AI Operations Co-Pilot
                </h2>
                <button
                    onClick={onRefresh}
                    disabled={isLoading}
                    className="p-2 rounded-full hover:bg-white/10 disabled:opacity-50 disabled:animate-spin"
                    aria-label="Refresh Suggestions"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 4 23 10 17 10"></polyline><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path></svg>
                </button>
            </div>
            
            <div className="px-6 pb-6 min-h-[200px]">
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center h-full text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-neon-blue"></div>
                        <p className="mt-4 font-semibold text-lg">Co-Pilot is analyzing operations...</p>
                        <p className="text-gray-400">Identifying critical actions for you.</p>
                    </div>
                ) : suggestions.length > 0 ? (
                    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                        {suggestions.map(suggestion => (
                            <SuggestionCard 
                                key={suggestion.id}
                                suggestion={suggestion}
                                onExecute={onExecute}
                                onDismiss={onDismiss}
                            />
                        ))}
                    </div>
                ) : (
                     <div className="flex flex-col items-center justify-center h-full text-center text-gray-400">
                        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-neon-green mb-4"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                        <p className="font-semibold text-lg text-gray-200">All Systems Nominal</p>
                        <p>No critical actions required at this time. The Co-Pilot will continue to monitor.</p>
                    </div>
                )}
            </div>
        </Card>
    );
};

export default AIOperationsCoPilot;
