import React, { useState } from 'react';
import Card from '../ui/Card';
import { RobotIcon } from '../icons/Icons';
import { useAppContext } from '../../hooks/useAppContext';
import { generateReportSummary } from '../../services/geminiService';
import type { Product, Bot } from '../../types';

type ReportType = 'Inventory' | 'Bot Performance';

const CustomReportGenerator: React.FC = () => {
    const { products, bots } = useAppContext();
    const [selectedReport, setSelectedReport] = useState<ReportType>('Inventory');
    const [isLoading, setIsLoading] = useState(false);
    const [summary, setSummary] = useState('');
    const [error, setError] = useState('');

    const handleGenerate = async () => {
        setIsLoading(true);
        setError('');
        setSummary('');
        try {
            const result = await generateReportSummary(selectedReport, products, bots);
            setSummary(result);
        } catch (err: any) {
            setError(err.message || "Failed to generate summary.");
        } finally {
            setIsLoading(false);
        }
    };
    
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

    const handleDownload = () => {
        if (selectedReport === 'Inventory') {
            const headers = ['ID', 'Name', 'Category', 'Quantity', 'Price (INR)', 'Supplier', 'Status'];
            const data = products.map((p: Product) => [p.id, p.name, p.category, p.quantity, p.price, p.supplier, p.status]);
            const csv = generateCSV(headers, data);
            downloadData(csv, 'custom_inventory_report.csv');
        } else if (selectedReport === 'Bot Performance') {
            const headers = ['ID', 'Status', 'Battery (%)', 'Tasks Completed', 'Location', 'Current Task'];
            const data = bots.map((b: Bot) => [b.id, b.status, b.battery, b.tasksCompleted, b.location, b.currentTask || 'N/A']);
            const csv = generateCSV(headers, data);
            downloadData(csv, 'custom_bot_performance_report.csv');
        }
    };

    return (
        <Card>
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <RobotIcon className="text-neon-green" />
                AI Report Summary Generator
            </h3>
            <div className="flex flex-col sm:flex-row gap-4 items-center">
                <div className="w-full sm:w-auto">
                    <label htmlFor="report-type" className="block text-sm font-medium text-gray-400 mb-1">Report Type</label>
                    <select
                        id="report-type"
                        value={selectedReport}
                        onChange={(e) => setSelectedReport(e.target.value as ReportType)}
                        className="form-input w-full"
                    >
                        <option value="Inventory">Inventory</option>
                        <option value="Bot Performance">Bot Performance</option>
                    </select>
                </div>
                <div className="w-full sm:w-auto mt-0 sm:mt-6">
                    <button 
                        onClick={handleGenerate} 
                        disabled={isLoading}
                        className="w-full px-4 py-2 rounded-lg bg-neon-green text-dark-bg font-semibold hover:shadow-neon-green transition-shadow disabled:opacity-50"
                    >
                        {isLoading ? 'Generating...' : 'Generate Summary'}
                    </button>
                </div>
            </div>

            <div className="mt-6 min-h-[80px] p-4 bg-black/20 border border-white/10 rounded-lg">
                <div className="flex justify-between items-start">
                    <div>
                        <h4 className="font-semibold text-gray-300 mb-2">Generated Summary:</h4>
                        {isLoading && (
                            <div className="flex items-center gap-2 text-gray-400">
                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-neon-green"></div>
                                <span>The AI is analyzing the data...</span>
                            </div>
                        )}
                        {error && <p className="text-red-400">{error}</p>}
                        {summary && <p className="text-gray-200 whitespace-pre-wrap">{summary}</p>}
                        {!isLoading && !error && !summary && <p className="text-gray-500">Your report summary will appear here.</p>}
                    </div>
                    {summary && !isLoading && (
                        <button onClick={handleDownload} className="px-3 py-1 text-xs rounded-md bg-neon-blue/80 text-dark-bg font-semibold whitespace-nowrap">
                            Download Full Report
                        </button>
                    )}
                </div>
            </div>

             <style>{`
                .form-input { background-color: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255, 255, 255, 0.2); border-radius: 0.5rem; padding: 0.5rem 1rem; transition: all 0.2s; color: inherit !important; }
                .form-input:focus { border-color: #00f6ff; box-shadow: 0 0 0 2px rgba(0, 246, 255, 0.3); outline: none; }
                select.form-input { appearance: none; background-image: url('data:image/svg+xml;charset=UTF-8,%3csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"%3e%3cpolyline points="6 9 12 15 18 9"%3e%3c/polyline%3e%3c/svg%3e'); background-repeat: no-repeat; background-position: right 0.7rem center; background-size: 1.5em 1.5em; padding-right: 2.5rem; }
            `}</style>
        </Card>
    );
};

export default CustomReportGenerator;