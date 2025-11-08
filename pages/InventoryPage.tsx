import React, { useState } from 'react';
import Card, { ScrollAnimator } from '../components/ui/Card';
import type { Product } from '../types';
import { ProductStatus } from '../types';
import AddItemModal, { NewProductData } from '../components/inventory/AddItemModal';
import EditItemModal from '../components/inventory/EditItemModal';
import { useAppContext } from '../hooks/useAppContext';
import InventoryStats from '../components/inventory/InventoryStats';
import AIAnalystModal from '../components/inventory/AIAnalystModal';
import { RobotIcon } from '../components/icons/Icons';

const InventoryPage: React.FC = () => {
    const { products, setProducts } = useAppContext();
    const [isAddItemModalOpen, setIsAddItemModalOpen] = useState(false);
    const [isAIModalOpen, setIsAIModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);

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

    const getStatusFromQuantity = (quantity: number): ProductStatus => {
        if (quantity === 0) return ProductStatus.OutOfStock;
        if (quantity <= 50) return ProductStatus.LowStock;
        return ProductStatus.InStock;
    };
    
    const handleAddItem = (newItemData: NewProductData) => {
        const existingIds = products.map(p => parseInt(p.id.split('-')[1], 10));
        const newIdNumber = (existingIds.length > 0 ? Math.max(...existingIds) : 0) + 1;
        const newId = `PID-${String(newIdNumber).padStart(3, '0')}`;

        const newProduct: Product = {
            id: newId,
            ...newItemData,
            status: getStatusFromQuantity(newItemData.quantity),
            dateAdded: new Date().toISOString().split('T')[0],
        };

        setProducts(prevProducts => [...prevProducts, newProduct].sort((a,b) => a.id.localeCompare(b.id)));
        setIsAddItemModalOpen(false);
    };

    const handleUpdateItem = (updatedProduct: Product) => {
        setProducts(prevProducts =>
            prevProducts.map(p =>
                p.id === updatedProduct.id
                    ? { ...updatedProduct, status: getStatusFromQuantity(updatedProduct.quantity) }
                    : p
            )
        );
        setEditingProduct(null);
    };

    const handleOpenEditModal = (product: Product) => {
        setEditingProduct(product);
    };

    const handleCloseEditModal = () => {
        setEditingProduct(null);
    };

    return (
        <div className="space-y-6">
             <ScrollAnimator>
                <InventoryStats products={products} />
            </ScrollAnimator>

            <ScrollAnimator delay={150}>
                <Card className="h-full flex flex-col">
                    <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
                        <h2 className="text-2xl font-bold w-full sm:w-auto">Inventory Details</h2>
                        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                           <button onClick={() => setIsAIModalOpen(true)} className="flex items-center justify-center gap-2 w-full sm:w-auto px-4 py-2 rounded-lg bg-neon-green/20 text-neon-green font-semibold border border-neon-green/30 hover:bg-neon-green/30 transition-colors">
                                <RobotIcon className="w-5 h-5" />
                                Ask AI Analyst
                            </button>
                            <button onClick={() => setIsAddItemModalOpen(true)} className="w-full sm:w-auto px-4 py-2 rounded-lg bg-neon-blue text-dark-bg font-semibold hover:shadow-neon-blue transition-shadow">
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
                                    <th className="p-4">Actions</th>
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
                                        <td className="p-4">
                                            <button 
                                                onClick={() => handleOpenEditModal(product)} 
                                                className="px-3 py-1 text-xs font-semibold rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30 hover:bg-blue-500/30 transition-colors"
                                            >
                                                Edit
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </Card>
            </ScrollAnimator>
            {isAddItemModalOpen && (
                <AddItemModal
                    onClose={() => setIsAddItemModalOpen(false)}
                    onAddItem={handleAddItem}
                />
            )}
            {editingProduct && (
                <EditItemModal
                    productToEdit={editingProduct}
                    onClose={handleCloseEditModal}
                    onUpdateItem={handleUpdateItem}
                />
            )}
            {isAIModalOpen && (
                <AIAnalystModal
                    onClose={() => setIsAIModalOpen(false)}
                />
            )}
        </div>
    );
};

export default InventoryPage;