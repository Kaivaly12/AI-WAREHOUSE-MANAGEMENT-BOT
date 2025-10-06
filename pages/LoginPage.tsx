
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
                profilePicture: 'https://picsum.photos/100/100',
            };
            localStorage.setItem('userData', JSON.stringify(defaultUser));
        }
        if (!localStorage.getItem('userPassword')) {
            localStorage.setItem('userPassword', 'password123'); // Default password
        }
        onLogin();
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-dark-bg relative overflow-hidden">
            <div className="absolute inset-0 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: `url('https://picsum.photos/seed/warehouse/1920/1080')`, filter: 'blur(8px)' }}></div>
            <div className="absolute inset-0 bg-black/60"></div>

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

                <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-600"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-dark-card text-gray-400">Or continue with</span>
                    </div>
                </div>

                <div>
                     <button type="button" onClick={handleLoginClick} className="w-full py-3 px-4 rounded-lg bg-white/10 border border-white/20 text-white font-semibold hover:bg-white/20 transition-colors flex items-center justify-center gap-2">
                        <svg className="w-5 h-5" viewBox="0 0 48 48"><path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C12.955 4 4 12.955 4 24s8.955 20 20 20s20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"></path><path fill="#FF3D00" d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C16.318 4 9.656 8.337 6.306 14.691z"></path><path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238C29.211 35.091 26.715 36 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z"></path><path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303c-.792 2.237-2.231 4.166-4.087 5.571l6.19 5.238C44.572 33.931 48 27.461 48 20c0-1.341-.138-2.65-.389-3.917z"></path></svg>
                        Sign in with Google
                    </button>
                </div>
            </Card>
        </div>
    );
};

export default LoginPage;
