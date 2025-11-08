import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import Chatbot from '../chatbot/Chatbot';

interface DashboardLayoutProps {
    onLogout: () => void;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ onLogout }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const location = useLocation();
    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
    const closeSidebar = () => setIsSidebarOpen(false);

    return (
        <div 
            className="flex min-h-screen text-gray-800 dark:text-gray-200 font-sans"
        >
            <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />
            <div className="flex-1 flex flex-col min-w-0">
                <Header onLogout={onLogout} onToggleSidebar={toggleSidebar} />
                <main key={location.pathname} className="flex-1 p-4 md:p-6">
                    <Outlet />
                </main>
            </div>
            {isSidebarOpen && <div onClick={closeSidebar} className="fixed inset-0 bg-black/50 z-30 lg:hidden" aria-hidden="true"></div>}
            <Chatbot />
            <style>{`
                body {
                    background-color: #F9FAFB; /* light-bg */
                    transition: background-color 0.5s ease;
                }
                .dark body {
                    background-color: #0A0E14; /* dark-bg */
                }
                body::before {
                    content: '';
                    position: fixed;
                    top: -50%;
                    left: -50%;
                    width: 200vw;
                    height: 200vh;
                    background-image: 
                        radial-gradient(circle at 20% 80%, rgba(0, 246, 255, 0.1), transparent 35%),
                        radial-gradient(circle at 80% 30%, rgba(0, 255, 135, 0.1), transparent 35%);
                    filter: blur(100px);
                    z-index: -1;
                    animation: background-pan 40s infinite alternate ease-in-out;
                }
                
                @keyframes background-pan {
                    from { transform: translate(0%, 10%); }
                    to { transform: translate(-10%, -10%); }
                }

                .scroll-animate {
                    transition: opacity 0.8s cubic-bezier(0.165, 0.84, 0.44, 1), transform 0.8s cubic-bezier(0.165, 0.84, 0.44, 1);
                }
                
                .scroll-animate.fade-up { opacity: 0; transform: translateY(30px); }
                .scroll-animate.pop-in { opacity: 0; transform: scale(0.95); }
                .scroll-animate.slide-in-left { opacity: 0; transform: translateX(-40px); }
                .scroll-animate.slide-in-right { opacity: 0; transform: translateX(40px); }

                .scroll-animate.is-visible {
                    opacity: 1;
                    transform: translateY(0) scale(1);
                }
            `}</style>
        </div>
    );
};

export default DashboardLayout;