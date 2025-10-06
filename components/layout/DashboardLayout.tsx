import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import Chatbot from '../chatbot/Chatbot';

interface DashboardLayoutProps {
    onLogout: () => void;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ onLogout }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
    const closeSidebar = () => setIsSidebarOpen(false);

    return (
        <div className="flex h-screen bg-light-bg dark:bg-dark-bg text-gray-800 dark:text-gray-200 font-sans">
            <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />
            <div className="flex-1 flex flex-col overflow-hidden">
                <Header onLogout={onLogout} onToggleSidebar={toggleSidebar} />
                <main className="flex-1 overflow-x-hidden overflow-y-auto p-4 md:p-6">
                    <Outlet />
                </main>
            </div>
            {isSidebarOpen && <div onClick={closeSidebar} className="fixed inset-0 bg-black/50 z-30 lg:hidden" aria-hidden="true"></div>}
            <Chatbot />
        </div>
    );
};

export default DashboardLayout;