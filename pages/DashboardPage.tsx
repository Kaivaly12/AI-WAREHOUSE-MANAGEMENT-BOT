
import React, { useMemo } from 'react';
import { 
    ResponsiveContainer, 
    LineChart, 
    Line, 
    BarChart, 
    Bar, 
    XAxis, 
    YAxis, 
    Tooltip, 
    Legend, 
    CartesianGrid,
    PieChart,
    Pie,
    Cell
} from 'recharts';
import Card, { ScrollAnimator } from '../components/ui/Card';
import { STOCK_UTILIZATION_DATA, CATEGORY_DISTRIBUTION_DATA } from '../constants';
import { TagIcon, CpuIcon, TrendingUpIcon, AlertTriangleIcon } from '../components/icons/Icons';
import { useAppContext } from '../hooks/useAppContext';
import { ProductStatus, BotStatus } from '../types';
import AIInsightPanel from '../components/dashboard/AIInsightPanel';
import LiveNotificationFeed from '../components/dashboard/LiveNotificationFeed';


const KpiCard: React.FC<{ title: string; value: string; icon: React.ElementType; change?: string; changeType?: 'increase' | 'decrease' }> = ({ title, value, icon: Icon, change, changeType }) => (
    <Card>
        <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
            <Icon className="w-6 h-6 text-gray-400 dark:text-gray-500" />
        </div>
        <p className="text-3xl font-bold mt-2 text-gray-800 dark:text-white">{value}</p>
        {change && (
            <p className={`text-sm mt-1 flex items-center gap-1 ${changeType === 'increase' ? 'text-neon-green' : 'text-red-500'}`}>
                {changeType === 'increase' ? '▲' : '▼'}
                {change} vs last month
            </p>
        )}
    </Card>
);

const DashboardPage: React.FC = () => {
    const { products, bots } = useAppContext();

    const pieData = useMemo(() => {
        const statusCounts = {
            [ProductStatus.InStock]: products.filter(p => p.status === ProductStatus.InStock).length,
            [ProductStatus.LowStock]: products.filter(p => p.status === ProductStatus.LowStock).length,
            [ProductStatus.OutOfStock]: products.filter(p => p.status === ProductStatus.OutOfStock).length,
        };
        return [
            { name: 'In Stock', value: statusCounts[ProductStatus.InStock] },
            { name: 'Low Stock', value: statusCounts[ProductStatus.LowStock] },
            { name: 'Out of Stock', value: statusCounts[ProductStatus.OutOfStock] },
        ];
    }, [products]);

    const COLORS = ['#00ff87', '#facc15', '#ef4444'];


    return (
        <div className="space-y-6">
            <ScrollAnimator>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <KpiCard title="Total Stock Value" value="₹10 Cr" icon={TagIcon} change="+5.2%" changeType="increase" />
                    <KpiCard title="Active Warehouse Bots" value={`${bots.filter(b => b.status === BotStatus.Active).length} / ${bots.length}`} icon={CpuIcon} />
                    <KpiCard title="Predicted Demand" value="+12%" icon={TrendingUpIcon} change="+2.1%" changeType="increase" />
                    <KpiCard title="Out-of-Stock Alerts" value={products.filter(p => p.status === ProductStatus.OutOfStock).length.toString()} icon={AlertTriangleIcon} />
                </div>
            </ScrollAnimator>
            
            <ScrollAnimator delay={150}>
                 <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <AIInsightPanel />
                    <Card>
                        <h3 className="font-bold text-lg mb-4 text-center">Stock Status Distribution</h3>
                        <ResponsiveContainer width="100%" height={150}>
                            <PieChart>
                                <Pie
                                    data={pieData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={45}
                                    outerRadius={65}
                                    fill="#8884d8"
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {pieData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', border: 'none', borderRadius: '0.5rem' }} />
                                <Legend iconSize={10} wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                            </PieChart>
                        </ResponsiveContainer>
                    </Card>
                    <LiveNotificationFeed />
                </div>
            </ScrollAnimator>

            <ScrollAnimator delay={300}>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card>
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
                        <h3 className="font-bold text-lg mb-4">Category-wise Distribution</h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={CATEGORY_DISTRIBUTION_DATA}>
                                <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip cursor={{fill: 'rgba(255,255,255,0.1)'}} contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', border: 'none', borderRadius: '0.5rem' }} />
                                <Legend/>
                                <Bar dataKey="value" fill="#00ff87" />
                            </BarChart>
                        </ResponsiveContainer>
                    </Card>
                </div>
            </ScrollAnimator>
        </div>
    );
};

export default DashboardPage;
