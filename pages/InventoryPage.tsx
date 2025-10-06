import React, { useState } from 'react';
import Card from '../components/ui/Card';
import { MOCK_PRODUCTS } from '../constants';
import type { Product } from '../types';
import { ProductStatus } from '../types';
import { getReorderSuggestion } from '../services/geminiService';

const InventoryPage: React.FC = () => {
    const [products, setProducts] = useState<Product[]>(MOCK_PRODUCTS);
    const [isLoadingSuggestion, setIsLoadingSuggestion] = useState(false);

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
    
    const handleReorderSuggestion = async () => {
        setIsLoadingSuggestion(true);
        const lowStockProducts = products.filter(p => p.status === ProductStatus.LowStock);
        
        if (lowStockProducts.length === 0) {
            alert("No items are currently low in stock.");
            setIsLoadingSuggestion(false);
            return;
        }

        try {
            const suggestedIds = await getReorderSuggestion(lowStockProducts);
            if (suggestedIds.length > 0) {
                alert(`AI suggests reordering the following product IDs: ${suggestedIds.join(', ')}`);
            } else {
                alert("AI analysis complete. No high-priority reorder suggestions at this time.");
            }
        } catch (error) {
            console.error("Failed to get reorder suggestion:", error);
            alert("Could not get AI suggestion. Please try again later.");
        } finally {
            setIsLoadingSuggestion(false);
        }
    };

    return (
        <Card className="h-full flex flex-col">
            <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
                <h2 className="text-2xl font-bold w-full sm:w-auto">Inventory Management</h2>
                <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                    <button onClick={handleReorderSuggestion} className="w-full sm:w-auto px-4 py-2 rounded-lg bg-neon-green/20 text-neon-green font-semibold border border-neon-green/30 hover:bg-neon-green/30 transition-colors disabled:opacity-50" disabled={isLoadingSuggestion}>
                        {isLoadingSuggestion ? 'Analyzing...' : 'AI Reorder Suggestion'}
                    </button>
                    <button className="w-full sm:w-auto px-4 py-2 rounded-lg bg-neon-blue text-dark-bg font-semibold hover:shadow-neon-blue transition-shadow">
                        Add New Item
                    </button>
                </div>
            </div>

            <div className="overflow-x-auto flex-1">
                <table className="w-full text-left min-w-[640px]">
                    <thead>
                        <tr className="border-b border-white/10">
                            <th className="p-4">Product ID</th>
                            <th className="p-4">Name</th>
                            <th className="p-4">Category</th>
                            <th className="p-4">Quantity</th>
                            <th className="p-4">Unit Price</th>
                            <th className="p-4">Supplier</th>
                            <th className="p-4">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map((product) => (
                            <tr key={product.id} className="border-b border-white/10 hover:bg-white/5 transition-colors">
                                <td className="p-4 font-mono text-sm">{product.id}</td>
                                <td className="p-4 font-semibold">{product.name}</td>
                                <td className="p-4">{product.category}</td>
                                <td className="p-4">{product.quantity}</td>
                                <td className="p-4">
                                    {new Intl.NumberFormat('en-IN', {
                                        style: 'currency',
                                        currency: 'INR',
                                    }).format(product.price)}
                                </td>
                                <td className="p-4">{product.supplier}</td>
                                <td className="p-4">
                                    <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(product.status)}`}>
                                        {product.status}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </Card>
    );
};

export default InventoryPage;