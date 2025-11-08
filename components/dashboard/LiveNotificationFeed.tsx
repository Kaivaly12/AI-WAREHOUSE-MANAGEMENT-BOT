
import React from 'react';
import Card from '../ui/Card';
import { AlertTriangleIcon } from '../icons/Icons';

const LiveNotificationFeed: React.FC = () => {
    const notifications = [
        { id: 1, type: 'alert', text: "Item 'PID-002' is low on stock. Only 45 units left.", time: "2m ago" },
        { id: 2, type: 'info', text: "Bot 'BOT-03' has started its charging cycle.", time: "10m ago" },
        { id: 3, type: 'success', text: "Task 'Deliver Item - PID-004' completed by BOT-01.", time: "1h ago" },
        { id: 4, type: 'alert', text: "Item 'PID-006' is critically low. Only 15 units left.", time: "2h ago" },
    ];
    
    const getIcon = (type: string) => {
        switch(type) {
            case 'alert': return <AlertTriangleIcon className="w-5 h-5 text-yellow-400" />;
            case 'success': return <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-green-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>;
            default: return <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-blue-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>;
        }
    }

    return (
        <Card className="h-full flex flex-col">
            <h3 className="font-bold text-lg mb-4">Live Feed</h3>
            <div className="space-y-4 flex-grow overflow-y-auto pr-2">
                {notifications.map(notif => (
                    <div key={notif.id} className="flex items-start gap-3">
                        <div>{getIcon(notif.type)}</div>
                        <div className="flex-1">
                            <p className="text-sm">{notif.text}</p>
                            <p className="text-xs text-gray-500">{notif.time}</p>
                        </div>
                    </div>
                ))}
            </div>
        </Card>
    );
};

export default LiveNotificationFeed;
