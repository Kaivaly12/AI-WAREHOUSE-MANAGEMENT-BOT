import React, { useState } from 'react';
import Card from '../ui/Card';
import type { Product } from '../../types';

interface EditItemModalProps {
    productToEdit: Product;
    onClose: () => void;
    onUpdateItem: (updatedProduct: Product) => void;
}

const EditItemModal: React.FC<EditItemModalProps> = ({ productToEdit, onClose, onUpdateItem }) => {
    const [formData, setFormData] = useState<Product>(productToEdit);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'number' ? parseFloat(value) || 0 : value,
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.name || !formData.category || !formData.supplier) {
            alert('Please fill in all text fields.');
            return;
        }
        if (formData.quantity < 0 || formData.price < 0) {
            alert('Quantity and Price cannot be negative.');
            return;
        }
        onUpdateItem(formData);
    };

    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
            <Card className="w-full max-w-lg">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold">Edit Item: {productToEdit.id}</h2>
                    <button onClick={onClose} className="text-2xl hover:text-red-500 transition-colors">&times;</button>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-400 mb-2">Product Name</label>
                            <input
                                id="name"
                                name="name"
                                type="text"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="e.g., Ionic Power Cells"
                                className="w-full form-input"
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="category" className="block text-sm font-medium text-gray-400 mb-2">Category</label>
                            <input
                                id="category"
                                name="category"
                                type="text"
                                value={formData.category}
                                onChange={handleChange}
                                placeholder="e.g., Energy"
                                className="w-full form-input"
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="quantity" className="block text-sm font-medium text-gray-400 mb-2">Quantity</label>
                            <input
                                id="quantity"
                                name="quantity"
                                type="number"
                                value={formData.quantity}
                                onChange={handleChange}
                                className="w-full form-input"
                                min="0"
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="price" className="block text-sm font-medium text-gray-400 mb-2">Unit Price (₹)</label>
                            <input
                                id="price"
                                name="price"
                                type="number"
                                value={formData.price}
                                onChange={handleChange}
                                step="0.01"
                                min="0"
                                className="w-full form-input"
                                required
                            />
                        </div>
                        <div className="md:col-span-2">
                            <label htmlFor="supplier" className="block text-sm font-medium text-gray-400 mb-2">Supplier</label>
                            <input
                                id="supplier"
                                name="supplier"
                                type="text"
                                value={formData.supplier}
                                onChange={handleChange}
                                placeholder="e.g., Voltacorp"
                                className="w-full form-input"
                                required
                            />
                        </div>
                    </div>
                    <div className="flex justify-end gap-4 mt-8">
                        <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg bg-white/10 border border-white/20 hover:bg-white/20 transition-colors">Cancel</button>
                        <button type="submit" className="px-4 py-2 rounded-lg bg-neon-blue text-dark-bg font-semibold hover:shadow-neon-blue transition-shadow">Save Changes</button>
                    </div>
                </form>
            </Card>
             <style>{`
                .form-input { background-color: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255, 255, 255, 0.2); border-radius: 0.5rem; padding: 0.5rem 1rem; transition: all 0.2s; width: 100%; color: inherit !important; }
                .form-input:focus { border-color: #00f6ff; box-shadow: 0 0 0 2px rgba(0, 246, 255, 0.3); outline: none; }
            `}</style>
        </div>
    );
};

export default EditItemModal;
