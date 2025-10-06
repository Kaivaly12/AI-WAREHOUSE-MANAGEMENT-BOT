
import React, { useState } from 'react';
import Card from '../ui/Card';
import type { Bot } from '../../types';

interface AssignTaskModalProps {
    bot: Bot;
    onClose: () => void;
    onAssign: (botId: string, task: string, details: string) => void;
}

type Task = 'Pick Item' | 'Deliver Item' | 'Scan Shelf' | 'Charge Battery';

const AssignTaskModal: React.FC<AssignTaskModalProps> = ({ bot, onClose, onAssign }) => {
    const [selectedTask, setSelectedTask] = useState<Task>('Pick Item');
    const [taskDetails, setTaskDetails] = useState('');

    const getTaskDetailsLabel = () => {
        switch (selectedTask) {
            case 'Pick Item': return 'Item ID (e.g., PID-001)';
            case 'Deliver Item': return 'Destination (e.g., Packing Area)';
            case 'Scan Shelf': return 'Aisle Number (e.g., Aisle 7)';
            default: return '';
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (getTaskDetailsLabel() && !taskDetails.trim()) {
            alert('Please fill in the task details.');
            return;
        }
        const fullTaskDescription = selectedTask === 'Charge Battery' ? 'Go to charger' : `${selectedTask} - ${taskDetails}`;
        onAssign(bot.id, fullTaskDescription, taskDetails);
    };

    const taskDetailsLabel = getTaskDetailsLabel();

    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
            <Card className="w-full max-w-md">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold">Assign Task to {bot.id}</h2>
                    <button onClick={onClose} className="text-2xl hover:text-red-500 transition-colors">&times;</button>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="task-select" className="block text-sm font-medium text-gray-400 mb-2">Task</label>
                            <select
                                id="task-select"
                                value={selectedTask}
                                onChange={(e) => {
                                    setSelectedTask(e.target.value as Task);
                                    setTaskDetails('');
                                }}
                                className="w-full form-input"
                            >
                                <option>Pick Item</option>
                                <option>Deliver Item</option>
                                <option>Scan Shelf</option>
                                <option>Charge Battery</option>
                            </select>
                        </div>
                        {taskDetailsLabel && (
                            <div>
                                <label htmlFor="task-details" className="block text-sm font-medium text-gray-400 mb-2">{taskDetailsLabel.split('(')[0].trim()}</label>
                                <input
                                    id="task-details"
                                    type="text"
                                    value={taskDetails}
                                    onChange={(e) => setTaskDetails(e.target.value)}
                                    placeholder={`${taskDetailsLabel}`}
                                    className="w-full form-input"
                                    required
                                />
                            </div>
                        )}
                    </div>
                    <div className="flex justify-end gap-4 mt-8">
                        <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg bg-white/10 border border-white/20 hover:bg-white/20 transition-colors">Cancel</button>
                        <button type="submit" className="px-4 py-2 rounded-lg bg-neon-blue text-dark-bg font-semibold hover:shadow-neon-blue transition-shadow">Assign</button>
                    </div>
                </form>
            </Card>
        </div>
    );
};

export default AssignTaskModal;
