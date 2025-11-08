import React, { useState, useEffect } from 'react';
import { ScrollAnimator } from '../components/ui/Card';
import type { Bot } from '../types';
import { BotStatus } from '../types';
import AssignTaskModal from '../components/bots/AssignTaskModal';
import BotHistoryModal from '../components/bots/BotHistoryModal';
import BotCard from '../components/bots/BotCard';
import { useAppContext } from '../hooks/useAppContext';
import FleetStatus from '../components/bots/FleetStatus';
import BotEfficiencyChart from '../components/bots/BotEfficiencyChart';
import AIDelegationModal from '../components/bots/AIDelegationModal';
import { CpuIcon } from '../components/icons/Icons';

const BotManagementPage: React.FC = () => {
    const { bots, setBots } = useAppContext();
    const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
    const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
    const [isAIDelegateModalOpen, setIsAIDelegateModalOpen] = useState(false);
    const [selectedBot, setSelectedBot] = useState<Bot | null>(null);

    // Automatic status updates and history logging
    useEffect(() => {
        const interval = setInterval(() => {
            setBots(prevBots =>
                prevBots.map(bot => {
                    let newBattery = bot.battery;
                    let newStatus = bot.status;
                    let newCurrentTask = bot.currentTask;
                    let newHistory = bot.history;
                    let hasChanged = false;

                    if (bot.status === BotStatus.Active) {
                        newBattery = Math.max(0, bot.battery - 1);
                    } else if (bot.status === BotStatus.Charging) {
                        newBattery = Math.min(100, bot.battery + 2);
                    }
                    
                    if (newBattery <= 20 && bot.status === BotStatus.Active && !bot.currentTask?.includes('charge')) {
                        newStatus = BotStatus.Charging;
                        newCurrentTask = 'Go to charger (Low Battery)';
                        newHistory = [{ timestamp: new Date().toISOString(), event: 'Low battery. Automatically routing to charge.' }, ...bot.history];
                        hasChanged = true;
                    } else if (newBattery >= 100 && bot.status === BotStatus.Charging) {
                        newStatus = BotStatus.Idle;
                        newCurrentTask = undefined;
                        newHistory = [{ timestamp: new Date().toISOString(), event: 'Fully charged. Status changed to Idle.' }, ...bot.history];
                        hasChanged = true;
                    }

                    return hasChanged ? { ...bot, battery: newBattery, status: newStatus, currentTask: newCurrentTask, history: newHistory } : { ...bot, battery: newBattery };
                })
            );
        }, 3000);

        return () => clearInterval(interval);
    }, [setBots]);
    
    const handleOpenAssignModal = (bot: Bot) => {
        setSelectedBot(bot);
        setIsAssignModalOpen(true);
    };

    const handleOpenHistoryModal = (bot: Bot) => {
        setSelectedBot(bot);
        setIsHistoryModalOpen(true);
    };

    const handleCloseModals = () => {
        setSelectedBot(null);
        setIsAssignModalOpen(false);
        setIsHistoryModalOpen(false);
        setIsAIDelegateModalOpen(false);
    };
    
    const handleAssignTask = (botId: string, taskDescription: string, details?: string) => {
        setBots(prevBots =>
            prevBots.map(bot => {
                if (bot.id === botId) {
                    const isChargingTask = taskDescription.toLowerCase().includes('charge');
                    let newLocation = bot.location;
                    if (details) {
                       if (taskDescription.startsWith('Deliver Item')) newLocation = details;
                       else if (taskDescription.startsWith('Scan Shelf')) newLocation = `Scanning in ${details}`;
                       else if (taskDescription.startsWith('Pick Item')) newLocation = 'Retrieving Item...';
                    }
                    
                    return {
                        ...bot,
                        status: isChargingTask ? BotStatus.Charging : BotStatus.Active,
                        currentTask: taskDescription,
                        location: newLocation,
                        history: [{ timestamp: new Date().toISOString(), event: `Task assigned: ${taskDescription}` }, ...bot.history],
                    };
                }
                return bot;
            })
        );
        alert(`Task "${taskDescription}" assigned to ${botId}.`);
        handleCloseModals();
    };

    const handleBotAction = (botId: string, action: 'pause' | 'charge' | 'maintenance') => {
        setBots(prevBots =>
            prevBots.map(bot => {
                if (bot.id === botId) {
                    switch (action) {
                        case 'pause':
                            return { ...bot, status: BotStatus.Idle, currentTask: 'Paused by operator', history: [{ timestamp: new Date().toISOString(), event: 'Paused by operator.' }, ...bot.history] };
                        case 'charge':
                            return { ...bot, status: BotStatus.Charging, location: 'Charging Station', currentTask: 'Go to charger (Manual)', history: [{ timestamp: new Date().toISOString(), event: 'Manually sent to charge.' }, ...bot.history] };
                        case 'maintenance':
                            return { ...bot, status: BotStatus.Maintenance, location: 'Maintenance Bay', currentTask: 'Undergoing maintenance', history: [{ timestamp: new Date().toISOString(), event: 'Maintenance mode activated.' }, ...bot.history] };
                        default:
                            return bot;
                    }
                }
                return bot;
            })
        );
    };

    return (
        <div className="space-y-6">
            <ScrollAnimator>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                     <h2 className="text-2xl font-bold">Bot Management Dashboard</h2>
                     <button
                        onClick={() => setIsAIDelegateModalOpen(true)}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-neon-blue text-dark-bg font-semibold hover:shadow-neon-blue transition-all duration-300 transform hover:scale-105"
                    >
                        <CpuIcon className="w-5 h-5" />
                        Delegate Task with AI
                    </button>
                </div>
            </ScrollAnimator>

            <ScrollAnimator delay={150}>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <FleetStatus bots={bots} />
                    <BotEfficiencyChart />
                </div>
            </ScrollAnimator>

            <ScrollAnimator delay={300}>
                 <h3 className="text-xl font-bold mt-8 mb-4">Individual Bot Control</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {bots.map(bot => (
                        <BotCard 
                            key={bot.id} 
                            bot={bot} 
                            onAssignTask={handleOpenAssignModal}
                            onViewHistory={handleOpenHistoryModal}
                            onAction={handleBotAction}
                        />
                    ))}
                </div>
            </ScrollAnimator>

            {isAssignModalOpen && selectedBot && (
                <AssignTaskModal 
                    bot={selectedBot} 
                    onClose={handleCloseModals} 
                    onAssign={handleAssignTask} 
                />
            )}

            {isHistoryModalOpen && selectedBot && (
                <BotHistoryModal
                    bot={selectedBot}
                    onClose={handleCloseModals}
                />
            )}
            
            {isAIDelegateModalOpen && (
                <AIDelegationModal
                    bots={bots}
                    onClose={handleCloseModals}
                    onConfirm={handleAssignTask}
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