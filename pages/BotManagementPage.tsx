
import React, { useState, useEffect } from 'react';
import Card from '../components/ui/Card';
import { MOCK_BOTS } from '../constants';
import type { Bot } from '../types';
import { BotStatus } from '../types';
import AssignTaskModal from '../components/bots/AssignTaskModal';

const BotCard: React.FC<{ bot: Bot, onAssignTask: (bot: Bot) => void }> = ({ bot, onAssignTask }) => {
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
                    <button className="px-3 py-1 rounded bg-white/10 hover:bg-white/20">Pause</button>
                    <button className="px-3 py-1 rounded bg-white/10 hover:bg-white/20">Send to Charge</button>
                    <button className="px-3 py-1 rounded bg-red-500/20 text-red-400 hover:bg-red-500/30">Maintenance</button>
                </div>
            </div>
        </Card>
    );
};

const BotManagementPage: React.FC = () => {
    const [bots, setBots] = useState<Bot[]>(MOCK_BOTS);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedBot, setSelectedBot] = useState<Bot | null>(null);

    useEffect(() => {
        const interval = setInterval(() => {
            setBots(prevBots =>
                prevBots.map(bot => {
                    let newBattery = bot.battery;
                    if (bot.status === BotStatus.Active) {
                        newBattery = Math.max(0, bot.battery - 1);
                    } else if (bot.status === BotStatus.Charging) {
                        newBattery = Math.min(100, bot.battery + 2);
                    }
                    
                    let newStatus = bot.status;
                    let newCurrentTask = bot.currentTask;
                    if (newBattery <= 0 && bot.status === BotStatus.Active) {
                        newStatus = BotStatus.Idle;
                        newCurrentTask = 'Battery depleted';
                    }
                    if (newBattery >= 100 && bot.status === BotStatus.Charging) {
                        newStatus = BotStatus.Idle;
                        newCurrentTask = undefined;
                    }

                    return { ...bot, battery: newBattery, status: newStatus, currentTask: newCurrentTask };
                })
            );
        }, 3000);

        return () => clearInterval(interval);
    }, []);
    
    const handleOpenModal = (bot: Bot) => {
        setSelectedBot(bot);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setSelectedBot(null);
        setIsModalOpen(false);
    };
    
    const handleAssignTask = (botId: string, taskDescription: string, details: string) => {
        setBots(prevBots =>
            prevBots.map(bot => {
                if (bot.id === botId) {
                    const isChargingTask = taskDescription.startsWith('Go to charger');
                    let newLocation = bot.location;
                    if (taskDescription.startsWith('Deliver Item')) {
                        newLocation = details;
                    } else if (taskDescription.startsWith('Scan Shelf')) {
                        newLocation = `Scanning in ${details}`;
                    } else if (isChargingTask) {
                        newLocation = 'Charging Station';
                    } else if (taskDescription.startsWith('Pick Item')) {
                        newLocation = 'Retrieving Item...'
                    }

                    return {
                        ...bot,
                        status: isChargingTask ? BotStatus.Charging : BotStatus.Active,
                        currentTask: taskDescription,
                        location: newLocation,
                    };
                }
                return bot;
            })
        );
        alert(`Task "${taskDescription}" assigned to ${botId}.`);
        handleCloseModal();
    };


    return (
        <div>
            <h2 className="text-2xl font-bold mb-6">Bot Management</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {bots.map(bot => (
                    <BotCard key={bot.id} bot={bot} onAssignTask={handleOpenModal} />
                ))}
            </div>
            {isModalOpen && selectedBot && (
                <AssignTaskModal 
                    bot={selectedBot} 
                    onClose={handleCloseModal} 
                    onAssign={handleAssignTask} 
                />
            )}
            <style>{`
                .form-input { background-color: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255, 255, 255, 0.2); border-radius: 0.5rem; padding: 0.5rem 1rem; transition: all 0.2s; width: 100%; color: inherit !important; }
                .form-input:focus { border-color: #00f6ff; box-shadow: 0 0 0 2px rgba(0, 246, 255, 0.3); outline: none; }
                select.form-input { appearance: none; background-image: url('data:image/svg+xml;charset=UTF-8,%3csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"%3e%3cpolyline points="6 9 12 15 18 9"%3e%3c/polyline%3e%3c/svg%3e'); background-repeat: no-repeat; background-position: right 0.7rem center; background-size: 1.5em 1.5em; padding-right: 2.5rem; }
            `}</style>
        </div>
    );
};

export default BotManagementPage;
