
import React, { useState } from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, Legend, CartesianGrid, ComposedChart, Bar } from 'recharts';
import Card, { ScrollAnimator } from '../components/ui/Card';
import { DEMAND_FORECAST_DATA } from '../constants';
import AIExplanationModal from '../components/demand-forecast/AIExplanationModal';

const DemandForecastPage: React.FC = () => {
    const [isExplanationModalOpen, setIsExplanationModalOpen] = useState(false);

    return (
        <div className="space-y-6">
            <ScrollAnimator>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <h2 className="text-2xl font-bold">Demand Forecast</h2>
                    <button
                        onClick={() => setIsExplanationModalOpen(true)}
                        className="px-4 py-2 rounded-lg bg-neon-blue text-dark-bg font-semibold hover:shadow-neon-blue transition-shadow"
                    >
                        Get AI Explanation
                    </button>
                </div>
            </ScrollAnimator>
            <ScrollAnimator delay={150}>
                <Card>
                    <h3 className="font-bold text-lg mb-4">Predicted Market Demand (Next 30 Days)</h3>
                    <ResponsiveContainer width="100%" height={400}>
                        <LineChart data={DEMAND_FORECAST_DATA}>
                            <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', border: 'none', borderRadius: '0.5rem' }} />
                            <Legend />
                            <Line type="monotone" dataKey="predicted" stroke="#00f6ff" strokeWidth={2} name="Predicted Demand" dot={false} />
                        </LineChart>
                    </ResponsiveContainer>
                </Card>
            </ScrollAnimator>

            <ScrollAnimator delay={300}>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <Card className="lg:col-span-2">
                        <h3 className="font-bold text-lg mb-4">Historical vs. Predicted Sales</h3>
                         <ResponsiveContainer width="100%" height={300}>
                            <ComposedChart data={DEMAND_FORECAST_DATA}>
                                <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', border: 'none', borderRadius: '0.5rem' }} />
                                <Legend />
                                <Bar dataKey="historical" fill="#00ff87" name="Historical Sales" />
                                <Line type="monotone" dataKey="predicted" stroke="#00f6ff" strokeWidth={2} name="Predicted Sales" />
                            </ComposedChart>
                        </ResponsiveContainer>
                    </Card>
                    <Card>
                        <h3 className="font-bold text-lg mb-4">AI Summary & Trends</h3>
                         <div className="space-y-4">
                            <div>
                                <p className="font-semibold text-neon-green">Top 5 High-Demand Products:</p>
                                <ul className="list-disc list-inside text-sm text-gray-300">
                                    <li>Ionic Power Cells</li>
                                    <li>Data Crystal Shards</li>
                                    <li>Graphene Sheets</li>
                                    <li>Quantum Processor</li>
                                    <li>Hydrogel Packs</li>
                                </ul>
                            </div>
                            <div>
                                <p className="font-semibold text-neon-blue">Market Trend Indicators:</p>
                                 <div className="flex items-center gap-4 text-sm">
                                    <span>Electronics: <span className="text-green-400">▲ 8%</span></span>
                                    <span>Medical: <span className="text-green-400">▲ 15%</span></span>
                                    <span>Materials: <span className="text-red-400">▼ 3%</span></span>
                                </div>
                            </div>
                            <button className="w-full mt-4 px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white font-semibold hover:bg-white/20 transition-colors">
                                Export Data (CSV)
                            </button>
                        </div>
                    </Card>
                </div>
            </ScrollAnimator>

            {isExplanationModalOpen && (
                <AIExplanationModal
                    onClose={() => setIsExplanationModalOpen(false)}
                />
            )}
        </div>
    );
};

export default DemandForecastPage;