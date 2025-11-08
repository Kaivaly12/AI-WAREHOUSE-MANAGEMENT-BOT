import React, { useRef, useEffect, useState, ReactNode } from 'react';

// Scroll Animator Component
interface ScrollAnimatorProps {
    children: ReactNode;
    className?: string;
    delay?: number;
    animationType?: 'fade-up' | 'pop-in' | 'slide-in-left' | 'slide-in-right';
}

export const ScrollAnimator: React.FC<ScrollAnimatorProps> = ({ children, className, delay = 0, animationType = 'fade-up' }) => {
    const ref = useRef<HTMLDivElement>(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const element = ref.current;
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    if (element) {
                        observer.unobserve(element);
                    }
                }
            },
            {
                threshold: 0.1,
                rootMargin: "-50px 0px -50px 0px"
            }
        );

        if (element) {
            observer.observe(element);
        }

        return () => {
            if (element) {
                observer.unobserve(element);
            }
        };
    }, []);

    const style: React.CSSProperties = {
        transitionDelay: `${delay}ms`,
    };

    return (
        <div
            ref={ref}
            className={`scroll-animate ${animationType} ${isVisible ? 'is-visible' : ''} ${className || ''}`}
            style={style}
        >
            {children}
        </div>
    );
};


// Original Card Component
interface CardProps {
    children: React.ReactNode;
    className?: string;
}

const Card: React.FC<CardProps> = ({ children, className = '' }) => {
    return (
        <div className={`
            bg-white/60 dark:bg-gray-900/50
            backdrop-blur-2xl 
            rounded-2xl 
            border border-gray-200/50 dark:border-white/10
            shadow-lg dark:shadow-black/20
            p-6 
            transition-all duration-300 ease-in-out
            hover:-translate-y-1
            ${className}
        `}>
            {children}
        </div>
    );
};

export default Card;