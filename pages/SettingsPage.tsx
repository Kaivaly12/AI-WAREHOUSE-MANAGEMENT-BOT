
import React, { useState, useRef } from 'react';
import Card from '../components/ui/Card';
import { useTheme } from '../hooks/useTheme';
import { useUser } from '../hooks/useUser';

const SettingsPage: React.FC = () => {
    const { theme, setTheme } = useTheme();
    const { user, updateUser } = useUser();
    
    const [profileData, setProfileData] = useState({ name: user.name, email: user.email });
    const [passwordData, setPasswordData] = useState({ current: '', new: '', confirm: '' });
    const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const getButtonClass = (buttonTheme: 'dark' | 'light' | 'auto') => {
        return theme === buttonTheme
            ? 'border-2 border-neon-blue bg-neon-blue/20 text-neon-blue'
            : 'border border-gray-600 hover:bg-white/5';
    };

    const handleProfileSave = (e: React.FormEvent) => {
        e.preventDefault();
        updateUser(profileData);
        setMessage({ text: 'Profile updated successfully!', type: 'success' });
        setTimeout(() => setMessage(null), 3000);
    };
    
    const handlePasswordChange = (e: React.FormEvent) => {
        e.preventDefault();
        const storedPassword = localStorage.getItem('userPassword');
        if (passwordData.current !== storedPassword) {
            setMessage({ text: 'Incorrect current password.', type: 'error' });
            return;
        }
        if (passwordData.new.length < 6) {
            setMessage({ text: 'New password must be at least 6 characters.', type: 'error' });
            return;
        }
        if (passwordData.new !== passwordData.confirm) {
            setMessage({ text: 'New passwords do not match.', type: 'error' });
            return;
        }
        localStorage.setItem('userPassword', passwordData.new);
        setMessage({ text: 'Password changed successfully!', type: 'success' });
        setPasswordData({ current: '', new: '', confirm: '' });
        setTimeout(() => setMessage(null), 3000);
    };

    const handleProfilePictureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                updateUser({ profilePicture: reader.result as string });
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold">Settings</h2>
            
            {message && (
                <div className={`p-4 rounded-lg ${message.type === 'success' ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'}`}>
                    {message.text}
                </div>
            )}
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="lg:col-span-2">
                    <h3 className="text-xl font-bold mb-6">User Profile</h3>
                    <div className="flex items-center gap-6 mb-6">
                        <div className="relative">
                            <img src={user.profilePicture} alt="Profile" className="w-24 h-24 rounded-full object-cover" />
                             <button 
                                onClick={() => fileInputRef.current?.click()}
                                className="absolute bottom-0 right-0 w-8 h-8 bg-neon-blue text-dark-bg rounded-full flex items-center justify-center hover:scale-110 transition-transform"
                                aria-label="Change profile picture"
                            >
                                ✏️
                            </button>
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleProfilePictureChange}
                                accept="image/*"
                                className="hidden"
                            />
                        </div>
                        <form onSubmit={handleProfileSave} className="space-y-4 flex-1">
                            <div>
                                <label className="block text-sm font-medium text-gray-400">Name</label>
                                <input 
                                    type="text" 
                                    value={profileData.name} 
                                    onChange={e => setProfileData({...profileData, name: e.target.value})} 
                                    className="mt-1 w-full form-input" 
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-400">Email</label>
                                <input 
                                    type="email" 
                                    value={profileData.email} 
                                    onChange={e => setProfileData({...profileData, email: e.target.value})} 
                                    className="mt-1 w-full form-input" 
                                />
                            </div>
                             <div className="text-right">
                                <button type="submit" className="px-4 py-2 rounded-lg bg-neon-blue text-dark-bg font-semibold">Save Profile</button>
                            </div>
                        </form>
                    </div>
                    <hr className="border-white/10 my-6" />
                    <h3 className="text-xl font-bold mb-4">Change Password</h3>
                     <form onSubmit={handlePasswordChange} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-400">Current Password</label>
                            <input type="password" value={passwordData.current} onChange={e => setPasswordData({...passwordData, current: e.target.value})} className="mt-1 w-full form-input" required />
                        </div>
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-400">New Password</label>
                                <input type="password" value={passwordData.new} onChange={e => setPasswordData({...passwordData, new: e.target.value})} className="mt-1 w-full form-input" required />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-400">Confirm New Password</label>
                                <input type="password" value={passwordData.confirm} onChange={e => setPasswordData({...passwordData, confirm: e.target.value})} className="mt-1 w-full form-input" required />
                            </div>
                        </div>
                        <div className="text-right">
                            <button type="submit" className="px-4 py-2 rounded-lg bg-neon-blue text-dark-bg font-semibold">Update Password</button>
                        </div>
                    </form>
                </Card>

                <div className="space-y-6">
                    <Card>
                        <h3 className="text-xl font-bold mb-4">Notifications</h3>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between"><label htmlFor="in-app-notifs" className="font-medium">In-App Notifications</label><input type="checkbox" id="in-app-notifs" className="form-checkbox" defaultChecked /></div>
                            <div className="flex items-center justify-between"><label htmlFor="email-notifs" className="font-medium">Email Alerts</label><input type="checkbox" id="email-notifs" className="form-checkbox" defaultChecked /></div>
                            <div className="flex items-center justify-between"><label htmlFor="sms-notifs" className="font-medium">SMS for Critical Alerts</label><input type="checkbox" id="sms-notifs" className="form-checkbox" /></div>
                        </div>
                    </Card>
                    <Card>
                        <h3 className="text-xl font-bold mb-4">Theme</h3>
                        <div className="flex gap-4">
                            <button onClick={() => setTheme('dark')} className={`flex-1 py-2 rounded-lg transition-colors ${getButtonClass('dark')}`}>Dark</button>
                            <button onClick={() => setTheme('light')} className={`flex-1 py-2 rounded-lg transition-colors ${getButtonClass('light')}`}>Light</button>
                            <button onClick={() => setTheme('auto')} className={`flex-1 py-2 rounded-lg transition-colors ${getButtonClass('auto')}`}>Auto</button>
                        </div>
                    </Card>
                    <Card>
                         <h3 className="text-xl font-bold mb-4">System Info</h3>
                         <div className="text-sm space-y-1">
                            <p><strong>Version:</strong> 2.5.1-beta</p>
                            <p><strong>Last Update:</strong> 2024-07-20</p>
                            <p><strong>License Key:</strong> ••••••••-••••-••••-PRO</p>
                         </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};

const style = document.createElement('style');
style.innerHTML = `
    .form-input { background-color: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255, 255, 255, 0.2); border-radius: 0.5rem; padding: 0.5rem 1rem; transition: all 0.2s; width: 100%; }
    .form-input:focus { border-color: #00f6ff; box-shadow: 0 0 0 2px rgba(0, 246, 255, 0.3); outline: none; }
    .form-checkbox { width: 1.25rem; height: 1.25rem; border-radius: 0.25rem; background-color: rgba(255, 255, 255, 0.1); border-color: rgba(255, 255, 255, 0.3); appearance: none; }
    .form-checkbox:checked { background-color: #00f6ff; border-color: #00f6ff; background-image: url("data:image/svg+xml,%3csvg viewBox='0 0 16 16' fill='black' xmlns='http://www.w3.org/2000/svg'%3e%3cpath d='M12.207 4.793a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0l-2-2a1 1 0 011.414-1.414L6.5 9.086l4.293-4.293a1 1 0 011.414 0z'/%3e%3c/svg%3e"); }
`;
document.head.appendChild(style);

export default SettingsPage;
