
import React, { useState } from 'react';
import { ScrollAnimator } from '../components/ui/Card';
import { useAppContext } from '../hooks/useAppContext';
import type { Bot } from '../types';
import { BotStatus } from '../types';

const AuraPage: React.FC = () => {
    const { bots } = useAppContext();
    const [selectedBot, setSelectedBot] = useState<Bot | null>(null);

    const getOrbStatusClass = (status: BotStatus) => {
        switch (status) {
            case BotStatus.Active:
            case BotStatus.Idle:
                return 'healthy';
            case BotStatus.Charging:
                return 'charging';
            case BotStatus.Maintenance:
                return 'error';
            default:
                return 'healthy';
        }
    };

    const handleOrbClick = (bot: Bot) => {
        setSelectedBot(bot);
    };

    const handleCloseCard = () => {
        setSelectedBot(null);
    };

    const DiagnosticCard: React.FC<{ bot: Bot; onClose: () => void }> = ({ bot, onClose }) => {
         const getStatusColor = (status: BotStatus) => {
            switch (status) {
                case BotStatus.Active: return 'text-neon-green';
                case BotStatus.Idle: return 'text-neon-blue';
                case BotStatus.Charging: return 'text-yellow-400';
                case BotStatus.Maintenance: return 'text-red-500';
                default: return 'text-gray-500';
            }
        };

        const getBatteryColor = (battery: number) => {
            if (battery > 70) return 'bg-neon-green';
            if (battery > 30) return 'bg-yellow-400';
            return 'bg-red-500';
        };

        return (
            <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm diagnostic-card-backdrop" onClick={onClose}>
                <div className="bg-gray-900/80 backdrop-blur-2xl border border-white/10 rounded-2xl w-full max-w-sm p-6 space-y-4 diagnostic-card" onClick={(e) => e.stopPropagation()}>
                    <div className="flex justify-between items-start">
                        <div>
                            <h2 className="text-2xl font-bold">{bot.id}</h2>
                            <p className={`font-semibold ${getStatusColor(bot.status)}`}>{bot.status}</p>
                        </div>
                        <button onClick={onClose} className="text-2xl hover:text-red-500 transition-colors">&times;</button>
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-400">Battery</p>
                        <div className="flex items-center gap-2">
                             <div className="w-full bg-gray-700 rounded-full h-2.5">
                                <div className={`${getBatteryColor(bot.battery)} h-2.5 rounded-full`} style={{ width: `${bot.battery}%` }}></div>
                            </div>
                            <span className="font-semibold">{bot.battery}%</span>
                        </div>
                    </div>
                     <div>
                        <p className="text-sm font-medium text-gray-400">Location</p>
                        <p>{bot.location}</p>
                    </div>
                    {bot.currentTask && (
                        <div>
                            <p className="text-sm font-medium text-gray-400">Current Task</p>
                            <p>{bot.currentTask}</p>
                        </div>
                    )}
                     <div>
                        <p className="text-sm font-medium text-gray-400">Last Recorded Event</p>
                        <p className="text-sm text-gray-300">{bot.history[0]?.event || 'No recent events.'}</p>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="h-full" style={{ background: '#111111' }}>
            <div className="container mx-auto px-4 py-6 text-white text-center h-full flex flex-col">
                <ScrollAnimator>
                    <h2 className="text-4xl md:text-6xl font-bold mb-4">Aura</h2>
                    <p className="text-lg md:text-xl text-gray-400 mb-12 max-w-3xl mx-auto">
                        Know your fleet's health. In a heartbeat. Serene oversight and immediate, beautiful data visualization.
                    </p>
                </ScrollAnimator>
                <ScrollAnimator delay={200} className="flex-1">
                    <div className="aura-grid p-4">
                        {bots.map((bot) => (
                            <div
                                key={bot.id}
                                className={`aura-orb ${getOrbStatusClass(bot.status)}`}
                                onClick={() => handleOrbClick(bot)}
                            />
                        ))}
                    </div>
                </ScrollAnimator>
            </div>
            {selectedBot && <DiagnosticCard bot={selectedBot} onClose={handleCloseCard} />}
             <style>{`
                .aura-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(60px, 1fr));
                    gap: 1.5rem;
                    max-width: 900px;
                    margin: 0 auto;
                }
                .aura-orb {
                    width: 60px; height: 60px;
                    border-radius: 50%;
                    transition: all 0.3s ease;
                    cursor: pointer;
                    margin: 0 auto;
                }
                .aura-orb:hover {
                    transform: scale(1.1);
                }

                @keyframes healthy-pulse {
                    0%, 100% { transform: scale(1); opacity: 0.9; }
                    50% { transform: scale(1.03); opacity: 1; }
                }
                @keyframes charging-pulse {
                    0%, 100% { transform: scale(1); opacity: 0.9; }
                    50% { transform: scale(1.05); opacity: 1; }
                }

                .aura-orb.healthy {
                    background: white;
                    animation: healthy-pulse 2.5s infinite ease-in-out;
                }
                .aura-orb.charging {
                    background: #facc15; /* yellow-400 */
                    animation: charging-pulse 1.5s infinite ease-in-out;
                }
                .aura-orb.error {
                    background: #ef4444; /* red-500 */
                }

                .diagnostic-card-backdrop {
                    animation: fadeIn 0.3s cubic-bezier(0.165, 0.84, 0.44, 1) forwards;
                }
                .diagnostic-card {
                    animation: scaleIn 0.3s cubic-bezier(0.165, 0.84, 0.44, 1) forwards;
                }

                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                @keyframes scaleIn {
                    from { opacity: 0; transform: scale(0.95); }
                    to { opacity: 1; transform: scale(1); }
                }
            `}</style>
        </div>
    );
};

export default AuraPage;
