
import React from 'react';
import { NavLink } from 'react-router-dom';
import { RobotIcon, DashboardIcon, InventoryIcon, ForecastIcon, ReportsIcon, SettingsIcon, VideoIcon } from '../icons/Icons';

interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

const navigationItems = [
    { to: '/dashboard', icon: DashboardIcon, label: 'Dashboard' },
    { to: '/dashboard/inventory', icon: InventoryIcon, label: 'Inventory' },
    { to: '/dashboard/demand-forecast', icon: ForecastIcon, label: 'Demand Forecast' },
    { to: '/dashboard/bot-control', icon: RobotIcon, label: 'Bot Control' },
    { to: '/dashboard/video-generation', icon: VideoIcon, label: 'Video Studio' },
    { to: '/dashboard/reports', icon: ReportsIcon, label: 'Reports' },
    { to: '/dashboard/settings', icon: SettingsIcon, label: 'Settings' },
];

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
    return (
        <aside className={`
            fixed inset-y-0 left-0 z-40 w-64 bg-white/40 dark:bg-gray-900/40 backdrop-blur-2xl border-r border-white/10 
            flex-shrink-0 p-4 flex flex-col
            transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0
            ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}>
            <div className="flex items-center gap-2 px-4 py-2 mb-8">
                <RobotIcon className="w-8 h-8 text-neon-blue" />
                <h1 className="text-xl font-bold text-gray-800 dark:text-white">AI Warehouse</h1>
            </div>
            <nav className="flex flex-col gap-2">
                {navigationItems.map((item) => (
                     <NavLink
                        key={item.to}
                        to={item.to}
                        end={item.to === '/dashboard'}
                        onClick={onClose}
                        className="group relative flex items-center gap-3 rounded-lg px-4 py-3 text-gray-700 transition-all duration-200 hover:bg-black/5 dark:text-gray-300 dark:hover:bg-white/10 dark:hover:text-white"
                    >
                        {({ isActive }) => (
                            <>
                                <div
                                    className={`absolute left-0 top-1/2 h-0 w-1 -translate-y-1/2 rounded-r-full bg-neon-blue transition-all duration-300 group-hover:h-4 ${
                                        isActive ? 'h-8' : ''
                                    }`}
                                ></div>
                                <item.icon className={`w-5 h-5 transition-colors ${isActive ? 'text-neon-blue' : ''}`} />
                                <span className={`transition-colors ${isActive ? 'font-semibold text-neon-blue' : ''}`}>{item.label}</span>
                            </>
                        )}
                    </NavLink>
                ))}
            </nav>
            <div className="mt-auto p-4 text-center text-xs text-gray-500 dark:text-gray-400">
                <p>© 2025 AI Warehouse Systems</p>
                <p>Powered by Predictive Intelligence</p>
            </div>
        </aside>
    );
};

export default Sidebar;