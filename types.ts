
export enum ProductStatus {
    InStock = "In Stock",
    LowStock = "Low Stock",
    OutOfStock = "Out of Stock",
}

export interface Product {
    id: string;
    name: string;
    category: string;
    quantity: number;
    price: number;
    supplier: string;
    status: ProductStatus;
    dateAdded: string;
}

export enum BotStatus {
    Active = "Active",
    Idle = "Idle",
    Charging = "Charging",
    Maintenance = "Maintenance",
}

export interface HistoryEntry {
    timestamp: string;
    event: string;
}

export interface Bot {
    id: string;
    status: BotStatus;
    battery: number;
    tasksCompleted: number;
    location: string;
    currentTask?: string;
    history: HistoryEntry[];
}

// FIX: Add missing types for AI Co-Pilot feature.
export type ActionType = 'ASSIGN_BOT' | 'FLAG_REORDER' | 'INFO';

export interface ActionStep {
    actionType: ActionType;
    description: string;
    details?: { [key: string]: any };
}

export type Priority = 'High' | 'Medium' | 'Low';

export interface CoPilotSuggestion {
    id: string;
    priority: Priority;
    issueTitle: string;
    analysis: string;
    steps: ActionStep[];
}

export interface ChartData {
    name: string;
    [key: string]: string | number;
}