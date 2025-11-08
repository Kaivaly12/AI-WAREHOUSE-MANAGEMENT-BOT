import React from 'react';
import type { CoPilotSuggestion, ActionStep } from '../../types';

interface SuggestionCardProps {
    suggestion: CoPilotSuggestion;
    onExecute: (plan: CoPilotSuggestion) => void;
    onDismiss: (suggestionId: string) => void;
}

const SuggestionCard: React.FC<SuggestionCardProps> = ({ suggestion, onExecute, onDismiss }) => {
    
    const priorityStyles = {
        High: 'border-red-500/50 bg-red-500/10',
        Medium: 'border-yellow-500/50 bg-yellow-500/10',
        Low: 'border-blue-500/50 bg-blue-500/10',
    };

    const getIconForAction = (action: ActionStep) => {
        switch (action.actionType) {
            case 'ASSIGN_BOT': return '🤖';
            case 'FLAG_REORDER': return '📦';
            case 'INFO': return 'ℹ️';
            default: return '➡️';
        }
    };

    return (
        <div className={`flex flex-col rounded-xl border p-4 h-full ${priorityStyles[suggestion.priority]}`}>
            <div className="flex justify-between items-start mb-2">
                <h4 className="font-bold text-md leading-tight">{suggestion.issueTitle}</h4>
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${priorityStyles[suggestion.priority].replace('border-', 'text-').replace('/10', '')}`}>{suggestion.priority}</span>
            </div>
            
            <p className="text-xs text-gray-400 mb-3 flex-grow">{suggestion.analysis}</p>

            <div className="space-y-2 mb-4">
                 <p className="text-sm font-semibold">Proposed Plan:</p>
                 <ul className="space-y-1.5 text-xs">
                    {suggestion.steps.map((step, index) => (
                        <li key={index} className="flex items-start gap-2">
                            <span className="mt-0.5">{getIconForAction(step)}</span>
                            <span>{step.description}</span>
                        </li>
                    ))}
                 </ul>
            </div>

            <div className="mt-auto grid grid-cols-2 gap-2 text-sm">
                <button 
                    onClick={() => onDismiss(suggestion.id)}
                    className="w-full px-3 py-1.5 rounded-md bg-white/10 hover:bg-white/20 transition-colors"
                >
                    Dismiss
                </button>
                 <button 
                    onClick={() => onExecute(suggestion)}
                    disabled={suggestion.steps.every(s => s.actionType === 'INFO')}
                    className="w-full px-3 py-1.5 rounded-md bg-neon-blue text-dark-bg font-bold hover:shadow-neon-blue transition-shadow disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Execute Plan
                </button>
            </div>
        </div>
    );
};

export default SuggestionCard;
