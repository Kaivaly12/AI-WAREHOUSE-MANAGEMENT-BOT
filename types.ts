
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

export interface Bot {
    id: string;
    status: BotStatus;
    battery: number;
    tasksCompleted: number;
    location: string;
    currentTask?: string;
}

export interface ChartData {
    name: string;
    [key: string]: string | number;
}