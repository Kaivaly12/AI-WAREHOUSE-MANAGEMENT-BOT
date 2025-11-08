
import React, { useState } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { UserProvider } from './contexts/UserContext';
import { AppProvider } from './contexts/AppContext';
import LoginPage from './pages/LoginPage';
import DashboardLayout from './components/layout/DashboardLayout';
import DashboardPage from './pages/DashboardPage';
import InventoryPage from './pages/InventoryPage';
import DemandForecastPage from './pages/DemandForecastPage';
import BotManagementPage from './pages/BotManagementPage';
import ReportsPage from './pages/ReportsPage';
import SettingsPage from './pages/SettingsPage';
import VideoGenerationPage from './pages/VideoGenerationPage';
import LandingPage from './pages/LandingPage';

const App: React.FC = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(() => localStorage.getItem('isLoggedIn') === 'true');

    const handleLogin = () => {
        localStorage.setItem('isLoggedIn', 'true');
        setIsLoggedIn(true);
    };

    const handleLogout = () => {
        localStorage.removeItem('isLoggedIn');
        setIsLoggedIn(false);
    };

    return (
        <ThemeProvider>
            <UserProvider>
                <AppProvider>
                    <HashRouter>
                        <Routes>
                            {/* Public routes */}
                            <Route path="/" element={<LandingPage />} />
                            <Route path="/login" element={!isLoggedIn ? <LoginPage onLogin={handleLogin} /> : <Navigate to="/dashboard" />} />

                            {/* Protected dashboard routes */}
                            <Route path="/dashboard" element={isLoggedIn ? <DashboardLayout onLogout={handleLogout} /> : <Navigate to="/login" />}>
                                <Route index element={<DashboardPage />} />
                                <Route path="inventory" element={<InventoryPage />} />
                                <Route path="demand-forecast" element={<DemandForecastPage />} />
                                <Route path="bot-control" element={<BotManagementPage />} />
                                <Route path="video-generation" element={<VideoGenerationPage />} />
                                <Route path="reports" element={<ReportsPage />} />
                                <Route path="settings" element={<SettingsPage />} />
                            </Route>
                            
                            {/* Catch-all redirects to landing page */}
                            <Route path="*" element={<Navigate to="/" />} />
                        </Routes>
                    </HashRouter>
                </AppProvider>
            </UserProvider>
        </ThemeProvider>
    );
};

export default App;