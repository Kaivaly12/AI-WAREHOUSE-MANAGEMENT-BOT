
import React from 'react';
import Card from '../ui/Card';
import type { Bot } from '../../types';
import { BotStatus } from '../../types';

interface BotCardProps {
    bot: Bot;
    onAssignTask: (bot: Bot) => void;
    onViewHistory: (bot: Bot) => void;
    onAction: (botId: string, action: 'pause' | 'charge' | 'maintenance') => void;
}

const BotCard: React.FC<BotCardProps> = ({ bot, onAssignTask, onViewHistory, onAction }) => {
    const getStatusColor = (status: BotStatus) => {
        switch (status) {
            case BotStatus.Active: return 'border-neon-green text-neon-green';
            case BotStatus.Idle: return 'border-neon-blue text-neon-blue';
            case BotStatus.Charging: return 'border-yellow-400 text-yellow-400';
            case BotStatus.Maintenance: return 'border-red-500 text-red-500';
            default: return 'border-gray-500 text-gray-500';
        }
    };
    
    const getBatteryColor = (battery: number) => {
        if (battery > 70) return 'bg-neon-green';
        if (battery > 30) return 'bg-yellow-400';
        return 'bg-red-500';
    };

    return (
        <Card className="flex flex-col">
            <div className="flex justify-between items-start">
                <h3 className="font-bold text-lg">{bot.id}</h3>
                <span className={`px-3 py-1 text-xs font-semibold rounded-full border ${getStatusColor(bot.status)}`}>
                    {bot.status}
                </span>
            </div>
            <div className="my-4 space-y-2 text-sm">
                <p><strong>Location:</strong> {bot.location}</p>
                <p><strong>Tasks Today:</strong> {bot.tasksCompleted}</p>
                {bot.currentTask && <p><strong>Current Task:</strong> <span className="text-neon-blue">{bot.currentTask}</span></p>}
            </div>
            <div className="mt-auto">
                <div className="flex items-center gap-2">
                    <span className="text-sm">Battery: {bot.battery}%</span>
                    <div className="w-full bg-gray-700 rounded-full h-2.5">
                        <div className={`${getBatteryColor(bot.battery)} h-2.5 rounded-full`} style={{ width: `${bot.battery}%` }}></div>
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-2 mt-4 text-sm">
                    <button onClick={() => onAssignTask(bot)} className="px-3 py-1 rounded bg-white/10 hover:bg-white/20">Assign Task</button>
                    <button onClick={() => onViewHistory(bot)} className="px-3 py-1 rounded bg-white/10 hover:bg-white/20">View History</button>
                    <button onClick={() => onAction(bot.id, 'pause')} className="px-3 py-1 rounded bg-white/10 hover:bg-white/20">Pause</button>
                    <button onClick={() => onAction(bot.id, 'charge')} className="px-3 py-1 rounded bg-white/10 hover:bg-white/20">Send to Charge</button>
                    <button onClick={() => onAction(bot.id, 'maintenance')} className="col-span-2 px-3 py-1 rounded bg-red-500/20 text-red-400 hover:bg-red-500/30">Maintenance</button>
                </div>
            </div>
        </Card>
    );
};

export default BotCard;
