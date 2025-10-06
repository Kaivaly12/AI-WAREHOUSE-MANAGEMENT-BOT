
import React from 'react';

interface CardProps {
    children: React.ReactNode;
    className?: string;
}

const Card: React.FC<CardProps> = ({ children, className = '' }) => {
    return (
        <div className={`
            bg-light-card dark:bg-dark-card 
            backdrop-blur-xl 
            rounded-2xl 
            border border-white/20 dark:border-white/10
            shadow-lg
            p-6 
            transition-all duration-300
            ${className}
        `}>
            {children}
        </div>
    );
};

export default Card;
