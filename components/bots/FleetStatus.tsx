import React from 'react';
import Card from '../ui/Card';
import type { Bot } from '../../types';
import { BotStatus } from '../../types';

interface FleetStatusProps {
    bots: Bot[];
}

const FleetStatus: React.FC<FleetStatusProps> = ({ bots }) => {
    const totalBots = bots.length;
    const active = bots.filter(b => b.status === BotStatus.Active).length;
    const idle = bots.filter(b => b.status === BotStatus.Idle).length;
    const charging = bots.filter(b => b.status === BotStatus.Charging).length;
    const maintenance = bots.filter(b => b.status === BotStatus.Maintenance).length;

    const StatusItem: React.FC<{ label: string; value: number; color: string }> = ({ label, value, color }) => (
        <div className="flex justify-between items-center text-sm">
            <div className="flex items-center gap-2">
                <span className={`w-2.5 h-2.5 rounded-full ${color}`}></span>
                <span>{label}</span>
            </div>
            <span className="font-bold">{value}</span>
        </div>
    );

    return (
        <Card>
            <h3 className="font-bold text-lg mb-4">Live Fleet Status</h3>
            <div className="space-y-3">
                <div className="flex justify-between items-center font-semibold pb-2 border-b border-white/10">
                    <span>Total Bots</span>
                    <span>{totalBots}</span>
                </div>
                <StatusItem label="Active" value={active} color="bg-neon-green" />
                <StatusItem label="Idle" value={idle} color="bg-neon-blue" />
                <StatusItem label="Charging" value={charging} color="bg-yellow-400" />
                <StatusItem label="Maintenance" value={maintenance} color="bg-red-500" />
            </div>
        </Card>
    );
};

export default FleetStatus;
