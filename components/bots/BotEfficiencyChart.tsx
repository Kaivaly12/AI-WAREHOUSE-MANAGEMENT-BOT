import React from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from 'recharts';
import Card from '../ui/Card';
import { BOT_EFFICIENCY_DATA } from '../../constants';

const BotEfficiencyChart: React.FC = () => {
    return (
        <Card className="lg:col-span-2">
            <h3 className="font-bold text-lg mb-4">Bot Efficiency (Last 4 Weeks)</h3>
            <ResponsiveContainer width="100%" height={220}>
                <LineChart data={BOT_EFFICIENCY_DATA}>
                    <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
                    <XAxis dataKey="name" />
                    <YAxis domain={[70, 100]} tickFormatter={(tick) => `${tick}%`} />
                    <Tooltip
                        contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', border: 'none', borderRadius: '0.5rem' }}
                        formatter={(value: number) => [`${value}%`, 'Efficiency']}
                    />
                    <Legend />
                    <Line
                        type="monotone"
                        dataKey="efficiency"
                        stroke="#00f6ff"
                        strokeWidth={2}
                        dot={{ r: 4 }}
                        activeDot={{ r: 8 }}
                    />
                </LineChart>
            </ResponsiveContainer>
        </Card>
    );
};

export default BotEfficiencyChart;
