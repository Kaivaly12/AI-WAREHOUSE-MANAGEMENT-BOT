import React, { createContext, useState, ReactNode } from 'react';
import type { Product, Bot } from '../types';
import { MOCK_PRODUCTS, MOCK_BOTS } from '../constants';

interface AppContextType {
    products: Product[];
    setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
    bots: Bot[];
    setBots: React.Dispatch<React.SetStateAction<Bot[]>>;
}

export const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [products, setProducts] = useState<Product[]>(MOCK_PRODUCTS);
    const [bots, setBots] = useState<Bot[]>(MOCK_BOTS);

    const value = {
        products,
        setProducts,
        bots,
        setBots,
    };

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    );
};
