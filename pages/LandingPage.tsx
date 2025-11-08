
import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { RobotIcon, InventoryIcon, CpuIcon } from '../components/icons/Icons';

// CursorFollower: A soft, glowing orb that follows the mouse with a trailing effect.
const CursorFollower: React.FC = () => {
    const dotRef = useRef<HTMLDivElement>(null);
    const outlineRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            const { clientX, clientY } = e;
            
            if (dotRef.current) {
                dotRef.current.style.transform = `translate(${clientX}px, ${clientY}px)`;
            }
            if (outlineRef.current) {
                 outlineRef.current.animate({
                    transform: `translate(${clientX}px, ${clientY}px)`
                }, { duration: 500, fill: "forwards" });
            }
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    return (
        <>
            <div ref={outlineRef} className="cursor-outline" />
            <div ref={dotRef} className="cursor-dot" />
        </>
    );
};

// Interactive3DCard: A card that tilts based on mouse position.
const Interactive3DCard: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => {
    const cardRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const card = cardRef.current;
        if (!card) return;

        const handleMouseMove = (e: MouseEvent) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const { width, height } = rect;
            
            const rotateX = (y / height - 0.5) * -30; // -15deg to 15deg
            const rotateY = (x / width - 0.5) * 30;   // -15deg to 15deg
            
            card.style.setProperty('--rotateX', `${rotateX}deg`);
            card.style.setProperty('--rotateY', `${rotateY}deg`);
        };
        
        const handleMouseLeave = () => {
            card.style.setProperty('--rotateX', '0deg');
            card.style.setProperty('--rotateY', '0deg');
        };

        card.addEventListener('mousemove', handleMouseMove);
        card.addEventListener('mouseleave', handleMouseLeave);
        return () => {
            card.removeEventListener('mousemove', handleMouseMove);
            card.removeEventListener('mouseleave', handleMouseLeave);
        };
    }, []);

    return (
        <div ref={cardRef} className={`interactive-3d-card ${className || ''}`}>
            {children}
        </div>
    );
};


// HiveBackground: The 3D interactive warehouse grid visualization.
const HiveBackground: React.FC = () => {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const handleMouseMove = (e: MouseEvent) => {
            const { clientX, clientY } = e;
            const { innerWidth, innerHeight } = window;
            const rotateX = (clientY / innerHeight - 0.5) * -10;
            const rotateY = (clientX / innerWidth - 0.5) * 10;
            container.style.setProperty('--rotateX', `${rotateX}deg`);
            container.style.setProperty('--rotateY', `${rotateY}deg`);
        };

        const handleScroll = () => {
            const scrollY = window.scrollY;
            const zoom = 1 + scrollY / 1000;
            container.style.setProperty('--zoom', `${Math.min(zoom, 1.8)}`);
        };

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    return (
        <div ref={containerRef} className="hive-background">
            <div className="hive-grid">
                {Array.from({ length: 400 }).map((_, i) => (
                    <div key={i} className="hive-cell" style={{ animationDelay: `${Math.random() * 5}s` }} />
                ))}
            </div>
        </div>
    );
};

// LandingPage: The main component combining all interactive elements.
const LandingPage: React.FC = () => {
     useEffect(() => {
        const flowItems = document.querySelectorAll('.flow-item');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                }
            });
        }, { threshold: 0.5 });

        flowItems.forEach(item => observer.observe(item));
        return () => flowItems.forEach(item => observer.unobserve(item));
    }, []);

    return (
        <>
            <CursorFollower />
            <HiveBackground />
            <div className="dark-landing-container">
                <header className="fixed top-0 left-0 right-0 z-50 p-6">
                    <div className="container mx-auto flex justify-between items-center">
                        <div className="flex items-center gap-3">
                             <RobotIcon className="w-8 h-8 text-white" />
                            <span className="font-bold text-xl text-white">WIZO</span>
                        </div>
                        <Link to="/login" className="px-5 py-2 text-sm font-semibold text-black bg-white rounded-full hover:bg-gray-200 transition-colors">
                            Dashboard Login
                        </Link>
                    </div>
                </header>

                <main>
                    <section className="h-screen min-h-[700px] flex items-center relative">
                        <div className="container mx-auto px-4 relative z-10">
                            <h1 className="text-5xl md:text-7xl font-bold text-white leading-tight max-w-3xl">
                                Warehouse Intelligence.
                                <br />
                                <span className="text-neon-blue">Redefined.</span>
                            </h1>
                            <p className="mt-6 text-lg text-gray-400 max-w-xl">
                                WIZO is the AI-driven command center for the modern warehouse. Automate, predict, and optimize with unparalleled precision.
                            </p>
                             <Link to="/login" className="mt-10 inline-block px-8 py-4 text-lg font-bold text-black bg-neon-blue rounded-full hover:shadow-neon-blue transition-shadow transform hover:scale-105">
                                Explore the Dashboard
                            </Link>
                        </div>
                    </section>
                    
                    {/* Hive Flow Section */}
                    <section className="py-20 md:py-40 relative">
                         <div className="container mx-auto px-4 text-center">
                            <h2 className="text-4xl md:text-5xl font-bold mb-4">The Hive Flow</h2>
                            <p className="text-gray-400 max-w-2xl mx-auto mb-24">
                                Witness the journey of an order through our intelligent system, from digital request to physical reality, orchestrated entirely by AI.
                            </p>
                            <div className="flow-container">
                                {/* FIX: Cast style object to React.CSSProperties to allow for custom CSS properties. */}
                                <div className="flow-item" style={{ '--delay': '0s' } as React.CSSProperties}>
                                    <div className="flow-content">
                                        <span className="flow-number">1</span>
                                        <h3 className="font-bold">Order Received</h3>
                                        <p className="text-sm">An order enters the system and is instantly processed.</p>
                                    </div>
                                </div>
                                 {/* FIX: Cast style object to React.CSSProperties to allow for custom CSS properties. */}
                                 <div className="flow-item" style={{ '--delay': '0.2s' } as React.CSSProperties}>
                                    <div className="flow-content">
                                        <span className="flow-number">2</span>
                                        <h3 className="font-bold">AI Co-Pilot Assigns</h3>
                                        <p className="text-sm">WIZO's AI selects the optimal bot based on location, battery, and task load.</p>
                                    </div>
                                </div>
                                {/* FIX: Cast style object to React.CSSProperties to allow for custom CSS properties. */}
                                <div className="flow-item" style={{ '--delay': '0.4s' } as React.CSSProperties}>
                                    <div className="flow-content">
                                        <span className="flow-number">3</span>
                                        <h3 className="font-bold">Bot Fulfills Task</h3>
                                        <p className="text-sm">The bot autonomously navigates, picks the item, and updates the inventory in real-time.</p>
                                    </div>
                                </div>
                                {/* FIX: Cast style object to React.CSSProperties to allow for custom CSS properties. */}
                                <div className="flow-item" style={{ '--delay': '0.6s' } as React.CSSProperties}>
                                    <div className="flow-content">
                                        <span className="flow-number">4</span>
                                        <h3 className="font-bold">Ready for Dispatch</h3>
                                        <p className="text-sm">The item is delivered to the packing station, completing the cycle.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                     {/* WIZO Inventory Section */}
                     <section className="py-20 md:py-32">
                        <div className="container mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                             <div className="lg:order-2">
                                <h3 className="text-3xl md:text-4xl font-bold">Smart Inventory, Live Data</h3>
                                <p className="text-gray-400 mt-4">Don't just track your stock. WIZO provides predictive analysis, automatic reorder flags, and a live, 3D-visualized overview of every single item in your facility. Interact with your data like never before.</p>
                            </div>
                            <div className="lg:order-1">
                                <Interactive3DCard>
                                    <div className="inventory-card-content">
                                        <div className="flex justify-between items-center mb-4">
                                            <div className="flex items-center gap-2"><InventoryIcon className="w-5 h-5 text-neon-green" /> <h4 className="font-bold">Live Inventory</h4></div>
                                            <span className="text-xs text-green-400">● Live</span>
                                        </div>
                                        <div className="space-y-3">
                                            <div className="flex justify-between items-center text-sm p-3 bg-white/5 rounded-md">
                                                <span>Quantum Processor</span> <span className="font-mono text-neon-blue">120 units</span>
                                            </div>
                                            <div className="flex justify-between items-center text-sm p-3 bg-white/5 rounded-md">
                                                <span>Hydrogel Packs</span> <span className="font-mono text-yellow-400">45 units</span>
                                            </div>
                                            <div className="flex justify-between items-center text-sm p-3 bg-white/5 rounded-md">
                                                <span>Ionic Power Cells</span> <span className="font-mono text-neon-blue">200 units</span>
                                            </div>
                                        </div>
                                        <div className="mt-4 text-xs text-gray-500 text-center">Hover to interact</div>
                                    </div>
                                </Interactive3DCard>
                            </div>
                        </div>
                    </section>
                    
                    <section className="py-20 md:py-32 text-center">
                        <div className="container mx-auto px-4 relative z-10">
                             <h2 className="text-4xl md:text-5xl font-bold">Step Into the Future.</h2>
                              <Link to="/login" className="mt-10 inline-block px-10 py-5 text-xl font-bold text-black bg-neon-blue rounded-full hover:shadow-neon-blue transition-shadow transform hover:scale-105">
                                Enter Command Center
                            </Link>
                        </div>
                    </section>
                </main>
            </div>
            
            <style>{`
                /* General */
                .dark-landing-container {
                    font-family: 'Inter', sans-serif;
                    background-color: transparent; /* Background is now the hive */
                    color: #E2E8F0;
                    overflow-x: hidden;
                    position: relative;
                }
                
                /* Cursor Follower */
                .cursor-dot, .cursor-outline {
                    position: fixed;
                    top: -50px; left: -50px; /* Start off-screen */
                    border-radius: 50%;
                    pointer-events: none;
                    z-index: 9999;
                    mix-blend-mode: screen;
                }
                .cursor-dot {
                    width: 8px; height: 8px;
                    background-color: #00f6ff;
                    transition: transform 0.05s ease-out;
                }
                .cursor-outline {
                    width: 40px; height: 40px;
                    background-color: rgba(0, 246, 255, 0.3);
                    filter: blur(8px);
                }
                
                /* Hive Background */
                .hive-background {
                    position: fixed;
                    top: 0; left: 0;
                    width: 100%; height: 100%;
                    z-index: -1;
                    transform: perspective(1000px) rotateX(var(--rotateX, 0deg)) rotateY(var(--rotateY, 0deg)) scale(var(--zoom, 1));
                    transition: transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
                    will-change: transform;
                    background: #0D1117;
                }
                .hive-grid {
                    position: absolute;
                    top: 50%; left: 50%;
                    width: 150vw; height: 150vh;
                    display: grid;
                    grid-template-columns: repeat(20, 1fr);
                    gap: 1.5rem;
                    transform-style: preserve-3d;
                    transform: translate(-50%, -50%) rotateX(75deg);
                }
                .hive-cell {
                    background-color: rgba(0, 246, 255, 0.05);
                    border: 1px solid rgba(0, 246, 255, 0.1);
                    border-radius: 4px;
                    animation: pulse 6s infinite ease-in-out;
                }
                @keyframes pulse {
                    0%, 100% { background-color: rgba(0, 246, 255, 0.05); }
                    50% { background-color: rgba(0, 255, 135, 0.1); }
                }

                /* Flow Section */
                .flow-container {
                    position: relative;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 4rem;
                }
                .flow-item {
                    width: 100%;
                    max-width: 320px;
                    opacity: 0;
                    transform: translateY(30px);
                    transition: opacity 0.8s cubic-bezier(0.165, 0.84, 0.44, 1), transform 0.8s cubic-bezier(0.165, 0.84, 0.44, 1);
                    transition-delay: var(--delay);
                }
                .flow-item.is-visible {
                    opacity: 1;
                    transform: translateY(0);
                }
                .flow-content {
                    padding: 1.5rem;
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    background: rgba(22, 27, 34, 0.6);
                    backdrop-filter: blur(12px);
                    border-radius: 1rem;
                }
                .flow-number {
                    display: inline-block;
                    width: 2rem;
                    height: 2rem;
                    line-height: 2rem;
                    border-radius: 50%;
                    background-color: #00f6ff;
                    color: #0D1117;
                    font-weight: bold;
                    margin-bottom: 1rem;
                }
                @media (min-width: 768px) {
                    .flow-container {
                        flex-direction: row;
                        justify-content: center;
                        align-items: flex-start;
                        gap: 2rem;
                    }
                     .flow-item {
                        position: relative;
                    }
                    .flow-item:not(:last-child)::after {
                        content: '';
                        position: absolute;
                        top: 1.5rem;
                        right: -30px; /* Adjust based on gap */
                        width: 2rem;
                        height: 2px;
                        background: linear-gradient(90deg, #00f6ff, #00ff87);
                        transform-origin: left;
                        transform: scaleX(0);
                        transition: transform 0.8s ease;
                        transition-delay: calc(var(--delay) + 0.5s);
                    }
                    .flow-item.is-visible:not(:last-child)::after {
                        transform: scaleX(1);
                    }
                }
                 @media (max-width: 767px) {
                     .flow-item:not(:last-child)::after {
                        content: '';
                        position: absolute;
                        left: 50%;
                        bottom: -2.5rem;
                        transform: translateX(-50%);
                        width: 2px;
                        height: 2rem;
                        background: linear-gradient(180deg, #00f6ff, #00ff87);
                        transform-origin: top;
                        transform: scaleY(0) translateX(-50%);
                        transition: transform 0.8s ease;
                        transition-delay: calc(var(--delay) + 0.5s);
                    }
                    .flow-item.is-visible:not(:last-child)::after {
                        transform: scaleY(1) translateX(-50%);
                    }
                }
                
                /* 3D Inventory Card */
                .interactive-3d-card {
                    transform-style: preserve-3d;
                    transform: perspective(1000px) rotateX(var(--rotateX, 0deg)) rotateY(var(--rotateY, 0deg));
                    transition: transform 0.3s ease-out;
                }
                .inventory-card-content {
                    padding: 1.5rem;
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    background: rgba(22, 27, 34, 0.6);
                    backdrop-filter: blur(12px);
                    border-radius: 1rem;
                    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
                    transform: translateZ(20px);
                }
            `}</style>
        </>
    );
};

export default LandingPage;
