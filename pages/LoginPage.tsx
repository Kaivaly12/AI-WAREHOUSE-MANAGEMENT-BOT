import React from 'react';
import Card from '../components/ui/Card';
import { RobotIcon } from '../components/icons/Icons';

interface LoginPageProps {
    onLogin: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {

    const handleLoginClick = () => {
        // Initialize default user data and password on first login
        if (!localStorage.getItem('userData')) {
             const defaultUser = {
                name: 'Admin User',
                email: 'admin@warehouse.ai',
                role: 'Warehouse Manager',
                profilePicture: 'https://i.pravatar.cc/100?u=admin',
            };
            localStorage.setItem('userData', JSON.stringify(defaultUser));
        }
        if (!localStorage.getItem('userPassword')) {
            localStorage.setItem('userPassword', 'password123'); // Default password
        }
        onLogin();
    };

    return (
        <>
        <div className="min-h-screen flex items-center justify-center p-4 bg-dark-bg relative overflow-hidden text-white">
            <div className="absolute inset-0 z-0 opacity-50">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-neon-blue/10 rounded-full filter blur-3xl animate-blob"></div>
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-neon-green/10 rounded-full filter blur-3xl animate-blob animation-delay-4000"></div>
            </div>

            <Card className="w-full max-w-md z-10 !bg-dark-card/80 border-neon-blue/20">
                <div className="text-center mb-8">
                    <div className="inline-block p-4 bg-neon-blue/10 rounded-full mb-4 border border-neon-blue/30">
                         <RobotIcon className="w-12 h-12 text-neon-blue drop-shadow-[0_0_5px_#00f6ff]" />
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-white">AI Warehouse Bot Manager</h1>
                    <p className="text-gray-400 mt-2">Sign in to access your dashboard</p>
                </div>

                <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); handleLoginClick(); }}>
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Warehouse ID / Email</label>
                        <input
                            type="email"
                            required
                            className="w-full px-4 py-2 rounded-lg bg-gray-900/50 border border-gray-600 focus:border-neon-blue focus:ring-neon-blue text-white"
                            placeholder="your-id@warehouse.com"
                            defaultValue="admin@warehouse.ai"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Password</label>
                        <input
                            type="password"
                            required
                            className="w-full px-4 py-2 rounded-lg bg-gray-900/50 border border-gray-600 focus:border-neon-blue focus:ring-neon-blue text-white"
                            placeholder="••••••••"
                            defaultValue="password123"
                        />
                    </div>
                    <div className="flex items-center justify-between">
                        <a href="#" className="text-sm text-neon-blue hover:underline">Forgot Password?</a>
                    </div>
                    <div>
                        <button type="submit" className="w-full py-3 px-4 rounded-lg bg-neon-blue text-black font-bold hover:shadow-neon-blue transition-shadow">
                            Login
                        </button>
                    </div>
                </form>
            </Card>
        </div>
        <style>{`
            @keyframes blob {
                0% { transform: translate(0px, 0px) scale(1); }
                33% { transform: translate(30px, -50px) scale(1.1); }
                66% { transform: translate(-20px, 20px) scale(0.9); }
                100% { transform: translate(0px, 0px) scale(1); }
            }
            .animate-blob {
                animation: blob 7s infinite;
            }
            .animation-delay-4000 {
                animation-delay: -4s;
            }
        `}</style>
        </>
    );
};

export default LoginPage;