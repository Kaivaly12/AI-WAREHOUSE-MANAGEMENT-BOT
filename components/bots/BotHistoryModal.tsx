
import React from 'react';
import Card from '../ui/Card';
import type { Bot } from '../../types';

interface BotHistoryModalProps {
    bot: Bot;
    onClose: () => void;
}

const BotHistoryModal: React.FC<BotHistoryModalProps> = ({ bot, onClose }) => {
    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
            <Card className="w-full max-w-2xl flex flex-col h-[90vh] sm:h-auto sm:max-h-[80vh]">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold">History Log: {bot.id}</h2>
                    <button onClick={onClose} className="text-2xl hover:text-red-500 transition-colors">&times;</button>
                </div>
                <div className="flex-1 overflow-y-auto pr-2">
                    <div className="relative border-l-2 border-neon-blue/30 pl-6 space-y-6">
                        {bot.history.length > 0 ? (
                            bot.history.map((entry, index) => (
                                <div key={index} className="relative">
                                    <div className="absolute -left-[33px] top-1 w-4 h-4 bg-gray-800 border-2 border-neon-blue rounded-full"></div>
                                    <p className="text-sm text-gray-400">
                                        {new Date(entry.timestamp).toLocaleString()}
                                    </p>
                                    <p className="font-medium text-gray-100">{entry.event}</p>
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-400">No history available for this bot.</p>
                        )}
                    </div>
                </div>
                 <div className="flex justify-end mt-8">
                    <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg bg-white/10 border border-white/20 hover:bg-white/20 transition-colors">Close</button>
                </div>
            </Card>
        </div>
    );
};

export default BotHistoryModal;
