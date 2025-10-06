
import React, { createContext, useState, useEffect, useMemo } from 'react';

const DEFAULT_USER = {
    name: 'Admin User',
    email: 'admin@warehouse.ai',
    role: 'Warehouse Manager',
    profilePicture: 'https://picsum.photos/100/100',
};

interface User {
    name: string;
    email: string;
    role: string;
    profilePicture: string;
}

interface UserContextType {
    user: User;
    updateUser: (newUserData: Partial<User>) => void;
}

export const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User>(() => {
        try {
            const storedUser = localStorage.getItem('userData');
            return storedUser ? JSON.parse(storedUser) : DEFAULT_USER;
        } catch (error) {
            return DEFAULT_USER;
        }
    });

    useEffect(() => {
        try {
            localStorage.setItem('userData', JSON.stringify(user));
        } catch (error) {
            console.error("Failed to save user data to localStorage", error);
        }
    }, [user]);

    const updateUser = (newUserData: Partial<User>) => {
        setUser(prevUser => ({ ...prevUser, ...newUserData }));
    };

    const value = useMemo(() => ({ user, updateUser }), [user]);

    return (
        <UserContext.Provider value={value}>
            {children}
        </UserContext.Provider>
    );
};
