import React from 'react';
import { NavLink } from 'react-router-dom';
import { RobotIcon, DashboardIcon, InventoryIcon, ForecastIcon, ReportsIcon, SettingsIcon } from '../icons/Icons';

interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

const navigationItems = [
    { to: '/', icon: DashboardIcon, label: 'Dashboard' },
    { to: '/inventory', icon: InventoryIcon, label: 'Inventory' },
    { to: '/demand-forecast', icon: ForecastIcon, label: 'Demand Forecast' },
    { to: '/bot-control', icon: RobotIcon, label: 'Bot Control' },
    { to: '/reports', icon: ReportsIcon, label: 'Reports' },
    { to: '/settings', icon: SettingsIcon, label: 'Settings' },
];

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
    return (
        <aside className={`
            fixed inset-y-0 left-0 z-40 w-64 bg-light-card dark:bg-dark-card backdrop-blur-xl border-r border-white/10 
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
                        end
                        onClick={onClose}
                        className={({ isActive }) => `
                            flex items-center gap-3 px-4 py-3 rounded-lg text-gray-600 dark:text-gray-300
                            transition-all duration-200 hover:bg-black/5 dark:hover:bg-white/5
                            ${isActive ? 'bg-neon-blue/10 dark:bg-neon-blue/20 text-neon-blue font-semibold' : ''}
                        `}
                    >
                        <item.icon className="w-5 h-5" />
                        <span>{item.label}</span>
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