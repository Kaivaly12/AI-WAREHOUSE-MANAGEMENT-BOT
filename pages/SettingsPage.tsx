
import React, { useState, useRef, useEffect } from 'react';
import Card, { ScrollAnimator } from '../components/ui/Card';
import { useTheme } from '../hooks/useTheme';
import { useUser } from '../hooks/useUser';
import { DatabaseIcon, ShieldIcon } from '../components/icons/Icons';

const SettingsPage: React.FC = () => {
    const { theme, setTheme } = useTheme();
    const { user, updateUser } = useUser();
    
    const [profileData, setProfileData] = useState({ name: user.name, email: user.email });
    const [passwordData, setPasswordData] = useState({ current: '', new: '', confirm: '' });
    
    // New state for Data & Security
    const [dbConfig, setDbConfig] = useState({ type: 'PostgreSQL', host: 'db.warehouse.ai', port: 5432, username: 'admin_user' });
    const [is2FAEnabled, setIs2FAEnabled] = useState(false);
    const [sessionTimeout, setSessionTimeout] = useState(30);
    const [dbTestStatus, setDbTestStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');

    const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Load security settings from localStorage on mount
    useEffect(() => {
        const savedDbConfig = localStorage.getItem('dbConfig');
        if (savedDbConfig) setDbConfig(JSON.parse(savedDbConfig));

        const saved2FA = localStorage.getItem('is2FAEnabled');
        if (saved2FA) setIs2FAEnabled(JSON.parse(saved2FA));

        const savedTimeout = localStorage.getItem('sessionTimeout');
        if (savedTimeout) setSessionTimeout(parseInt(savedTimeout, 10));
    }, []);


    const getButtonClass = (buttonTheme: 'dark' | 'light' | 'auto') => {
        return theme === buttonTheme
            ? 'border-2 border-neon-blue bg-neon-blue/20 text-neon-blue'
            : 'border border-gray-600 hover:bg-white/5';
    };
    
    const showMessage = (text: string, type: 'success' | 'error') => {
        setMessage({ text, type });
        setTimeout(() => setMessage(null), 4000);
    };

    const handleProfileSave = (e: React.FormEvent) => {
        e.preventDefault();
        updateUser(profileData);
        showMessage('Profile updated successfully!', 'success');
    };
    
    const handlePasswordChange = (e: React.FormEvent) => {
        e.preventDefault();
        const storedPassword = localStorage.getItem('userPassword');
        if (passwordData.current !== storedPassword) {
            showMessage('Incorrect current password.', 'error');
            return;
        }
        if (passwordData.new.length < 6) {
            showMessage('New password must be at least 6 characters.', 'error');
            return;
        }
        if (passwordData.new !== passwordData.confirm) {
            showMessage('New passwords do not match.', 'error');
            return;
        }
        localStorage.setItem('userPassword', passwordData.new);
        showMessage('Password changed successfully!', 'success');
        setPasswordData({ current: '', new: '', confirm: '' });
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
    
    const handleDbConfigChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setDbConfig({ ...dbConfig, [e.target.name]: e.target.value });
    };

    const handleTestConnection = () => {
        setDbTestStatus('testing');
        setTimeout(() => {
            // Simulate a 50/50 chance of success/failure
            if (Math.random() > 0.5) {
                setDbTestStatus('success');
            } else {
                setDbTestStatus('error');
            }
            setTimeout(() => setDbTestStatus('idle'), 3000);
        }, 2000);
    };
    
    const handleSaveDbConfig = () => {
        localStorage.setItem('dbConfig', JSON.stringify(dbConfig));
        showMessage('Database configuration saved!', 'success');
    };

    const handleSecurityChange = (type: '2fa' | 'timeout', value: any) => {
        if (type === '2fa') {
            setIs2FAEnabled(value);
            localStorage.setItem('is2FAEnabled', JSON.stringify(value));
        } else if (type === 'timeout') {
            setSessionTimeout(value);
            localStorage.setItem('sessionTimeout', value.toString());
        }
        showMessage('Security settings updated!', 'success');
    };

    const getDbTestButton = () => {
        switch (dbTestStatus) {
            case 'testing': return { text: 'Testing...', disabled: true, className: 'bg-yellow-500/80' };
            case 'success': return { text: 'Success!', disabled: true, className: 'bg-green-500/80' };
            case 'error': return { text: 'Failed!', disabled: true, className: 'bg-red-500/80' };
            default: return { text: 'Test Connection', disabled: false, className: 'bg-white/10 hover:bg-white/20' };
        }
    };

    return (
        <div className="space-y-6">
            <ScrollAnimator>
                <h2 className="text-2xl font-bold">Settings</h2>
            </ScrollAnimator>
            
            {message && (
                <ScrollAnimator>
                    <div className={`p-4 rounded-lg ${message.type === 'success' ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'}`}>
                        {message.text}
                    </div>
                </ScrollAnimator>
            )}
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <ScrollAnimator delay={150}>
                        <Card>
                            <h3 className="text-xl font-bold mb-6">User Profile</h3>
                            <div className="flex flex-col sm:flex-row items-center gap-6">
                                <div className="relative flex-shrink-0">
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
                                <form onSubmit={handleProfileSave} className="space-y-4 flex-1 w-full">
                                     <h4 className="font-semibold text-lg">Personal Information</h4>
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
                                    <div className="text-right pt-2">
                                        <button type="submit" className="px-4 py-2 rounded-lg bg-neon-blue text-dark-bg font-semibold">Save Profile</button>
                                    </div>
                                </form>
                            </div>
                        </Card>
                    </ScrollAnimator>
                    
                    <ScrollAnimator delay={300}>
                        <Card>
                            <h3 className="text-xl font-bold mb-4">Security Settings</h3>
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
                    </ScrollAnimator>

                    <ScrollAnimator delay={450}>
                        <Card>
                            <h3 className="text-xl font-bold mb-6 flex items-center gap-3"><DatabaseIcon className="w-6 h-6 text-neon-green" /> Data & Infrastructure</h3>
                            
                            <h4 className="font-semibold text-lg mb-4">Database Connection</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-400">Database Type</label>
                                    <select name="type" value={dbConfig.type} onChange={handleDbConfigChange} className="mt-1 w-full form-input">
                                        <option>PostgreSQL</option>
                                        <option>MongoDB</option>
                                        <option>MySQL</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-400">Host</label>
                                    <input type="text" name="host" value={dbConfig.host} onChange={handleDbConfigChange} className="mt-1 w-full form-input" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-400">Port</label>
                                    <input type="number" name="port" value={dbConfig.port} onChange={handleDbConfigChange} className="mt-1 w-full form-input" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-400">Username</label>
                                    <input type="text" name="username" value={dbConfig.username} onChange={handleDbConfigChange} className="mt-1 w-full form-input" />
                                </div>
                            </div>
                             <div className="flex justify-end gap-3 mt-4">
                                <button
                                    onClick={handleTestConnection}
                                    disabled={getDbTestButton().disabled}
                                    className={`px-4 py-2 text-sm rounded-lg font-semibold transition-colors ${getDbTestButton().className}`}
                                >
                                    {getDbTestButton().text}
                                </button>
                                <button onClick={handleSaveDbConfig} className="px-4 py-2 text-sm rounded-lg bg-neon-blue text-dark-bg font-semibold">Save Configuration</button>
                            </div>

                            <hr className="border-white/10 my-6" />

                            <h4 className="font-semibold text-lg mb-4 flex items-center gap-3"><ShieldIcon className="w-6 h-6 text-neon-green" /> Login & Access Control</h4>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <label htmlFor="2fa" className="font-medium">Enable Two-Factor Authentication (2FA)</label>
                                    <input type="checkbox" id="2fa" className="form-checkbox" checked={is2FAEnabled} onChange={(e) => handleSecurityChange('2fa', e.target.checked)} />
                                </div>
                                <div className="flex items-center justify-between">
                                    <label htmlFor="session-timeout" className="font-medium">Session Timeout (minutes)</label>
                                    <input
                                        type="number"
                                        id="session-timeout"
                                        value={sessionTimeout}
                                        onChange={(e) => handleSecurityChange('timeout', parseInt(e.target.value, 10))}
                                        className="form-input w-24 text-center"
                                        min="5"
                                        max="120"
                                    />
                                </div>
                            </div>
                        </Card>
                    </ScrollAnimator>
                </div>

                <div className="space-y-6">
                    <ScrollAnimator delay={250}>
                        <Card>
                            <h3 className="text-xl font-bold mb-4">Notifications</h3>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between"><label htmlFor="in-app-notifs" className="font-medium">In-App Notifications</label><input type="checkbox" id="in-app-notifs" className="form-checkbox" defaultChecked /></div>
                                <div className="flex items-center justify-between"><label htmlFor="email-notifs" className="font-medium">Email Alerts</label><input type="checkbox" id="email-notifs" className="form-checkbox" defaultChecked /></div>
                                <div className="flex items-center justify-between"><label htmlFor="sms-notifs" className="font-medium">SMS for Critical Alerts</label><input type="checkbox" id="sms-notifs" className="form-checkbox" /></div>
                            </div>
                        </Card>
                    </ScrollAnimator>
                    <ScrollAnimator delay={400}>
                        <Card>
                            <h3 className="text-xl font-bold mb-4">Theme</h3>
                            <div className="flex gap-4">
                                <button onClick={() => setTheme('dark')} className={`flex-1 py-2 rounded-lg transition-colors ${getButtonClass('dark')}`}>Dark</button>
                                <button onClick={() => setTheme('light')} className={`flex-1 py-2 rounded-lg transition-colors ${getButtonClass('light')}`}>Light</button>
                                <button onClick={() => setTheme('auto')} className={`flex-1 py-2 rounded-lg transition-colors ${getButtonClass('auto')}`}>Auto</button>
                            </div>
                        </Card>
                    </ScrollAnimator>
                    <ScrollAnimator delay={550}>
                        <Card>
                             <h3 className="text-xl font-bold mb-4">System Info</h3>
                             <div className="text-sm space-y-1">
                                <p><strong>Version:</strong> 2.5.1-beta</p>
                                <p><strong>Last Update:</strong> 2024-07-20</p>
                                <p><strong>License Key:</strong> ••••••••-••••-••••-PRO</p>
                             </div>
                        </Card>
                    </ScrollAnimator>
                </div>
            </div>
        </div>
    );
};

const style = document.createElement('style');
style.innerHTML = `
    .form-input { background-color: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255, 255, 255, 0.2); border-radius: 0.5rem; padding: 0.5rem 1rem; transition: all 0.2s; width: 100%; color: inherit !important; }
    .form-input:focus { border-color: #00f6ff; box-shadow: 0 0 0 2px rgba(0, 246, 255, 0.3); outline: none; }
    .form-checkbox { width: 1.25rem; height: 1.25rem; border-radius: 0.25rem; background-color: rgba(255, 255, 255, 0.1); border-color: rgba(255, 255, 255, 0.3); appearance: none; cursor: pointer; }
    .form-checkbox:checked { background-color: #00f6ff; border-color: #00f6ff; background-image: url("data:image/svg+xml,%3csvg viewBox='0 0 16 16' fill='black' xmlns='http://www.w3.org/2000/svg'%3e%3cpath d='M12.207 4.793a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0l-2-2a1 1 0 011.414-1.414L6.5 9.086l4.293-4.293a1 1 0 011.414 0z'/%3e%3c/svg%3e"); }
    select.form-input { appearance: none; background-image: url('data:image/svg+xml;charset=UTF-8,%3csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"%3e%3cpolyline points="6 9 12 15 18 9"%3e%3c/polyline%3e%3c/svg%3e'); background-repeat: no-repeat; background-position: right 0.7rem center; background-size: 1.5em 1.5em; padding-right: 2.5rem; }
`;
document.head.appendChild(style);

export default SettingsPage;