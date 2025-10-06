
import React, { useState, useEffect } from 'react';
import { ResponsiveContainer, LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from 'recharts';
import Card from '../components/ui/Card';
import { getMarketPrediction } from '../services/geminiService';
import { STOCK_UTILIZATION_DATA, CATEGORY_DISTRIBUTION_DATA, DEMAND_STOCK_RATIO_DATA } from '../constants';
import type { ChartData } from '../types';

const KpiCard: React.FC<{ title: string; value: string; icon: string; change?: string; changeType?: 'increase' | 'decrease' }> = ({ title, value, icon, change, changeType }) => (
    <Card>
        <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
            <span className="text-2xl">{icon}</span>
        </div>
        <p className="text-3xl font-bold mt-2 text-gray-800 dark:text-white">{value}</p>
        {change && (
            <p className={`text-sm mt-1 ${changeType === 'increase' ? 'text-neon-green' : 'text-red-500'}`}>
                {change} vs last month
            </p>
        )}
    </Card>
);

const DashboardPage: React.FC = () => {
    const [aiInsight, setAiInsight] = useState("Loading AI prediction...");

    useEffect(() => {
        getMarketPrediction().then(setAiInsight);
    }, []);

    const notifications = [
        "Bot 03 restocked Item #45 (Ionic Power Cells).",
        "Low stock alert for Hydrogel Packs (45 units left).",
        "Maintenance scheduled for Bot 05 at 3:00 PM.",
        "New shipment from SynthCore received and processed.",
    ];

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <KpiCard title="Total Stock Value" value="₹10 Cr" icon="🏷️" change="+5.2%" changeType="increase" />
                <KpiCard title="Active Warehouse Bots" value="6 / 8" icon="⚙️" />
                <KpiCard title="Predicted Demand" value="+12%" icon="📊" change="+2.1%" changeType="increase" />
                <KpiCard title="Out-of-Stock Alerts" value="1" icon="🚨" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="lg:col-span-2">
                    <h3 className="font-bold text-lg mb-4">Stock Utilization Trend (6 Months)</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={STOCK_UTILIZATION_DATA}>
                            <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', border: 'none', borderRadius: '0.5rem' }} />
                            <Legend />
                            <Line type="monotone" dataKey="value" stroke="#00f6ff" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 8 }} />
                        </LineChart>
                    </ResponsiveContainer>
                </Card>
                <Card>
                     <h3 className="font-bold text-lg mb-4">AI Insight Panel</h3>
                     <div className="bg-neon-blue/10 p-4 rounded-lg border border-neon-blue/30 h-full flex flex-col justify-center">
                        <p className="text-sm font-semibold text-neon-blue mb-2">Market Prediction Summary</p>
                        <p className="text-gray-800 dark:text-gray-200">{aiInsight}</p>
                     </div>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                <Card className="lg:col-span-2">
                    <h3 className="font-bold text-lg mb-4">Category-wise Distribution</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={CATEGORY_DISTRIBUTION_DATA} layout="vertical">
                            <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
                            <XAxis type="number" hide />
                            <YAxis type="category" dataKey="name" width={80} tickLine={false} axisLine={false} />
                            <Tooltip cursor={{fill: 'rgba(255,255,255,0.1)'}} contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', border: 'none', borderRadius: '0.5rem' }} />
                            <Bar dataKey="value" fill="#00ff87" barSize={20} />
                        </BarChart>
                    </ResponsiveContainer>
                </Card>
                <Card className="lg:col-span-1">
                    <h3 className="font-bold text-lg mb-4">Demand vs Stock</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie data={DEMAND_STOCK_RATIO_DATA} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
                                {DEMAND_STOCK_RATIO_DATA.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.fill} />
                                ))}
                            </Pie>
                            <Tooltip contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', border: 'none', borderRadius: '0.5rem' }}/>
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </Card>
                <Card className="lg:col-span-2">
                    <h3 className="font-bold text-lg mb-4">Live Notification Feed</h3>
                    <div className="space-y-3">
                        {notifications.map((note, index) => (
                            <div key={index} className="flex items-start gap-3">
                                <div className="mt-1 w-2 h-2 rounded-full bg-neon-blue shrink-0"></div>
                                <p className="text-sm text-gray-600 dark:text-gray-300">{note}</p>
                            </div>
                        ))}
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default DashboardPage;