import React, { useMemo } from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import Card from '../ui/Card';
import { Product, ProductStatus } from '../../types';

interface InventoryStatsProps {
    products: Product[];
}

const KpiCard: React.FC<{ title: string; value: string | number; }> = ({ title, value }) => (
    <Card className="text-center">
        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
        <p className="text-3xl font-bold mt-2 text-gray-800 dark:text-white">{value}</p>
    </Card>
);

const InventoryStats: React.FC<InventoryStatsProps> = ({ products }) => {
    const stats = useMemo(() => {
        const totalItems = products.reduce((sum, p) => sum + p.quantity, 0);
        const totalValue = products.reduce((sum, p) => sum + p.quantity * p.price, 0);
        const uniqueCategories = new Set(products.map(p => p.category)).size;
        
        const statusCounts = {
            [ProductStatus.InStock]: products.filter(p => p.status === ProductStatus.InStock).length,
            [ProductStatus.LowStock]: products.filter(p => p.status === ProductStatus.LowStock).length,
            [ProductStatus.OutOfStock]: products.filter(p => p.status === ProductStatus.OutOfStock).length,
        };

        return { totalItems, totalValue, uniqueCategories, statusCounts };
    }, [products]);

    const pieData = [
        { name: 'In Stock', value: stats.statusCounts[ProductStatus.InStock] },
        { name: 'Low Stock', value: stats.statusCounts[ProductStatus.LowStock] },
        { name: 'Out of Stock', value: stats.statusCounts[ProductStatus.OutOfStock] },
    ];

    const COLORS = ['#00ff87', '#facc15', '#ef4444'];
    
    const getStatusColor = (status: ProductStatus) => {
        switch (status) {
            case ProductStatus.InStock:
                return 'bg-green-500/20 text-green-400 border border-green-500/30';
            case ProductStatus.LowStock:
                return 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30';
            case ProductStatus.OutOfStock:
                return 'bg-red-500/20 text-red-400 border border-red-500/30';
            default:
                return 'bg-gray-500/20 text-gray-400';
        }
    };

    const attentionItems = useMemo(() => {
        return products
            .filter(p => p.status === ProductStatus.OutOfStock || p.status === ProductStatus.LowStock)
            .sort((a, b) => {
                if (a.status === ProductStatus.OutOfStock && b.status !== ProductStatus.OutOfStock) return -1;
                if (a.status !== ProductStatus.OutOfStock && b.status === ProductStatus.OutOfStock) return 1;
                return a.quantity - b.quantity;
            })
            .slice(0, 4);
    }, [products]);

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="flex flex-col gap-6">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                     <KpiCard title="Total Items" value={stats.totalItems.toLocaleString()} />
                     <KpiCard title="Total Stock Value" value={new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', notation: 'compact' }).format(stats.totalValue)} />
                     <KpiCard title="Unique Categories" value={stats.uniqueCategories} />
                </div>
                <Card>
                    <h3 className="font-bold text-lg mb-4">Items Requiring Attention</h3>
                    <div className="space-y-2">
                        {attentionItems.length > 0 ? (
                            attentionItems.map(item => (
                                <div key={item.id} className="flex justify-between items-center text-sm p-2 rounded-md hover:bg-white/5 transition-colors">
                                    <div>
                                        <p className="font-semibold">{item.name}</p>
                                        <p className="text-xs text-gray-400">{item.id} &bull; Qty: {item.quantity}</p>
                                    </div>
                                    <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${getStatusColor(item.status)}`}>
                                        {item.status}
                                    </span>
                                </div>
                            ))
                        ) : (
                            <div className="text-center text-gray-500 py-4">
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 mx-auto mb-2 text-neon-green" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                                <p>All items are well-stocked.</p>
                            </div>
                        )}
                    </div>
                </Card>
            </div>
            <Card>
                 <h3 className="font-bold text-lg mb-4 text-center">Stock Status Distribution</h3>
                 <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                        <Pie
                            data={pieData}
                            cx="50%"
                            cy="50%"
                            innerRadius={50}
                            outerRadius={80}
                            fill="#8884d8"
                            paddingAngle={5}
                            dataKey="value"
                        >
                            {pieData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', border: 'none', borderRadius: '0.5rem' }} />
                        <Legend />
                    </PieChart>
                </ResponsiveContainer>
            </Card>
        </div>
    );
};

export default InventoryStats;