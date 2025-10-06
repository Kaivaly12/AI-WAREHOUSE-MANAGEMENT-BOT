
import React, { createContext, useState, useEffect, useMemo } from 'react';

type ThemeMode = 'light' | 'dark' | 'auto';

interface ThemeContextType {
    theme: ThemeMode;
    effectiveTheme: 'light' | 'dark';
    setTheme: (theme: ThemeMode) => void;
}

export const ThemeContext = createContext<ThemeContextType>({
    theme: 'auto',
    effectiveTheme: 'dark',
    setTheme: () => {},
});

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [theme, setTheme] = useState<ThemeMode>(() => {
        const storedTheme = localStorage.getItem('theme') as ThemeMode | null;
        return storedTheme || 'auto';
    });
    
    const [effectiveTheme, setEffectiveTheme] = useState<'light' | 'dark'>(() => {
        if (theme !== 'auto') return theme;
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    });


    useEffect(() => {
        const root = window.document.documentElement;
        const userMedia = window.matchMedia('(prefers-color-scheme: dark)');

        const applyTheme = () => {
            const isDark = theme === 'auto' ? userMedia.matches : theme === 'dark';
            const newEffectiveTheme = isDark ? 'dark' : 'light';

            root.classList.remove('light', 'dark');
            root.classList.add(newEffectiveTheme);
            setEffectiveTheme(newEffectiveTheme);
        };

        applyTheme();
        localStorage.setItem('theme', theme);

        const mediaListener = () => {
            if (theme === 'auto') {
                applyTheme();
            }
        };
        
        userMedia.addEventListener('change', mediaListener);

        return () => {
            userMedia.removeEventListener('change', mediaListener);
        };
    }, [theme]);

    const changeTheme = (newTheme: ThemeMode) => {
        setTheme(newTheme);
    };
    
    const value = useMemo(() => ({ theme, effectiveTheme, setTheme: changeTheme }), [theme, effectiveTheme]);

    return (
        <ThemeContext.Provider value={value}>
            {children}
        </ThemeContext.Provider>
    );
};
