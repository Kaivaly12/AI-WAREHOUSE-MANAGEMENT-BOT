
import React, { useState, useEffect } from 'react';
import Card from '../components/ui/Card';
import { getAIRecommendation } from '../services/geminiService';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

const reportData = [
    { name: 'Jan', profit: 4000, cost: 2400 },
    { name: 'Feb', profit: 3000, cost: 1398 },
    { name: 'Mar', profit: 5000, cost: 9800 },
    { name: 'Apr', profit: 4780, cost: 3908 },
    { name: 'May', profit: 5890, cost: 4800 },
    { name: 'Jun', profit: 4390, cost: 3800 },
];


const ReportsPage: React.FC = () => {
    const [aiRecommendation, setAiRecommendation] = useState("Loading recommendation...");

    useEffect(() => {
        getAIRecommendation().then(setAiRecommendation);
    }, []);

    const downloadableReports = [
        { name: 'Inventory Summary', format: 'CSV' },
        { name: 'Demand Trends', format: 'PDF' },
        { name: 'Bot Efficiency Logs', format: 'CSV' },
        { name: 'Quarterly Financials', format: 'PDF' },
    ];

    const currencyTickFormatter = (tick: any) => {
        if (typeof tick !== 'number') return tick;
        if (tick >= 1000) return `₹${tick / 1000}K`;
        return `₹${tick}`;
    };

    const currencyTooltipFormatter = (value: any) => {
        if (typeof value !== 'number') return value;
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0,
        }).format(value);
    };

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold">Reports & Analytics</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="lg:col-span-1">
                    <h3 className="font-bold text-lg mb-4">Download Reports</h3>
                    <div className="space-y-3">
                        {downloadableReports.map((report, index) => (
                            <div key={index} className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                                <div>
                                    <p className="font-semibold">{report.name}</p>
                                    <p className="text-xs text-gray-400">Format: {report.format}</p>
                                </div>
                                <button className="px-3 py-1 text-sm rounded-md bg-neon-blue text-dark-bg font-semibold">Download</button>
                            </div>
                        ))}
                    </div>
                </Card>
                 <Card className="lg:col-span-2">
                    <h3 className="font-bold text-lg mb-4">Profit vs Cost Over Time</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <AreaChart data={reportData}>
                            <defs>
                                <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#00f6ff" stopOpacity={0.8}/>
                                <stop offset="95%" stopColor="#00f6ff" stopOpacity={0}/>
                                </linearGradient>
                                <linearGradient id="colorCost" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#ff4d4d" stopOpacity={0.8}/>
                                <stop offset="95%" stopColor="#ff4d4d" stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
                            <XAxis dataKey="name" />
                            <YAxis tickFormatter={currencyTickFormatter} />
                            <Tooltip 
                                contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', border: 'none', borderRadius: '0.5rem' }} 
                                formatter={currencyTooltipFormatter}
                            />
                            <Area type="monotone" dataKey="profit" stroke="#00f6ff" fillOpacity={1} fill="url(#colorProfit)" />
                            <Area type="monotone" dataKey="cost" stroke="#ff4d4d" fillOpacity={1} fill="url(#colorCost)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </Card>
            </div>
            
            <Card>
                <h3 className="font-bold text-lg mb-4 text-neon-green">AI Recommendation Panel</h3>
                <p>{aiRecommendation}</p>
            </Card>
        </div>
    );
};

export default ReportsPage;