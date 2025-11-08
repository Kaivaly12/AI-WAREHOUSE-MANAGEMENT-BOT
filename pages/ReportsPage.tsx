import React from 'react';
import Card, { ScrollAnimator } from '../components/ui/Card';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import CustomReportGenerator from '../components/reports/CustomReportGenerator';
import { useAppContext } from '../hooks/useAppContext';
import type { Product, Bot } from '../types';


const reportData = [
    { name: 'Jan', profit: 400000, cost: 240000 },
    { name: 'Feb', profit: 300000, cost: 139800 },
    { name: 'Mar', profit: 500000, cost: 980000 },
    { name: 'Apr', profit: 478000, cost: 390800 },
    { name: 'May', profit: 589000, cost: 480000 },
    { name: 'Jun', profit: 439000, cost: 380000 },
];


const ReportsPage: React.FC = () => {
    const { products, bots } = useAppContext();

    const downloadableReports = [
        { id: 'inventory_summary', name: 'Inventory Summary', format: 'CSV' },
        { id: 'demand_trends', name: 'Demand Trends', format: 'PDF' },
        { id: 'bot_efficiency', name: 'Bot Efficiency Logs', format: 'CSV' },
        { id: 'quarterly_financials', name: 'Quarterly Financials', format: 'PDF' },
    ];

    const generateCSV = (headers: string[], data: any[][]): string => {
        const csvRows = [headers.join(',')];
        data.forEach(row => {
            const values = row.map(val => {
                const escaped = ('' + val).replace(/"/g, '""');
                return `"${escaped}"`;
            });
            csvRows.push(values.join(','));
        });
        return csvRows.join('\n');
    };

    const downloadData = (data: string, filename: string, type = 'text/csv;charset=utf-8;') => {
        const blob = new Blob([data], { type });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.setAttribute('download', filename);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleDownload = (reportId: string) => {
        if (reportId === 'inventory_summary') {
            const headers = ['ID', 'Name', 'Category', 'Quantity', 'Price (INR)', 'Supplier', 'Status'];
            const data = products.map((p: Product) => [p.id, p.name, p.category, p.quantity, p.price, p.supplier, p.status]);
            const csv = generateCSV(headers, data);
            downloadData(csv, 'inventory_summary.csv');
        } else if (reportId === 'bot_efficiency') {
            const headers = ['ID', 'Status', 'Battery (%)', 'Tasks Completed', 'Location', 'Current Task'];
            const data = bots.map((b: Bot) => [b.id, b.status, b.battery, b.tasksCompleted, b.location, b.currentTask || 'N/A']);
            const csv = generateCSV(headers, data);
            downloadData(csv, 'bot_efficiency_logs.csv');
        } else {
            // For PDF or other formats, we can show an alert as a placeholder
            alert(`Download for this report type is not yet implemented.`);
        }
    };


    const currencyTickFormatter = (tick: any) => {
        if (typeof tick !== 'number') return tick;
        if (tick >= 10000000) return `₹${tick / 10000000}Cr`;
        if (tick >= 100000) return `₹${tick / 100000}L`;
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
            <ScrollAnimator>
                <h2 className="text-2xl font-bold">Reports & Analytics</h2>
            </ScrollAnimator>
            
            <ScrollAnimator delay={150}>
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
                                    <button 
                                        onClick={() => handleDownload(report.id)}
                                        className="px-3 py-1 text-sm rounded-md bg-neon-blue text-dark-bg font-semibold"
                                    >
                                        Download
                                    </button>
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
            </ScrollAnimator>
            
            <ScrollAnimator delay={300}>
                <CustomReportGenerator />
            </ScrollAnimator>
        </div>
    );
};

export default ReportsPage;