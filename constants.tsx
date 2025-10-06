
import React from 'react';
import type { Product, Bot, ChartData } from './types';
import { ProductStatus, BotStatus } from './types';

export const MOCK_PRODUCTS: Product[] = [
    { id: 'PID-001', name: 'Quantum Processor', category: 'Electronics', quantity: 120, price: 250.00, supplier: 'SynthCore', status: ProductStatus.InStock, dateAdded: '2023-10-15' },
    { id: 'PID-002', name: 'Hydrogel Packs', category: 'Medical', quantity: 45, price: 30.50, supplier: 'BioGen', status: ProductStatus.LowStock, dateAdded: '2023-11-02' },
    { id: 'PID-003', name: 'Carbon Nanotubes', category: 'Materials', quantity: 0, price: 1200.00, supplier: 'NanoWorks', status: ProductStatus.OutOfStock, dateAdded: '2023-09-20' },
    { id: 'PID-004', name: 'Ionic Power Cells', category: 'Energy', quantity: 200, price: 150.75, supplier: 'Voltacorp', status: ProductStatus.InStock, dateAdded: '2023-11-10' },
    { id: 'PID-005', name: 'Data Crystal Shards', category: 'Electronics', quantity: 500, price: 75.00, supplier: 'SynthCore', status: ProductStatus.InStock, dateAdded: '2023-08-01' },
    { id: 'PID-006', name: 'Auto-Suture Kits', category: 'Medical', quantity: 15, price: 55.20, supplier: 'BioGen', status: ProductStatus.LowStock, dateAdded: '2023-11-18' },
    { id: 'PID-007', name: 'Graphene Sheets', category: 'Materials', quantity: 300, price: 800.00, supplier: 'NanoWorks', status: ProductStatus.InStock, dateAdded: '2023-10-05' },
];

export const MOCK_BOTS: Bot[] = [
    { id: 'BOT-01', status: BotStatus.Active, battery: 88, tasksCompleted: 142, location: 'Aisle 7' },
    { id: 'BOT-02', status: BotStatus.Idle, battery: 95, tasksCompleted: 110, location: 'Docking Bay' },
    { id: 'BOT-03', status: BotStatus.Charging, battery: 23, tasksCompleted: 98, location: 'Charging Station 2' },
    { id: 'BOT-04', status: BotStatus.Active, battery: 76, tasksCompleted: 158, location: 'Aisle 3' },
    { id: 'BOT-05', status: BotStatus.Maintenance, battery: 100, tasksCompleted: 55, location: 'Maintenance Bay' },
    { id: 'BOT-06', status: BotStatus.Active, battery: 91, tasksCompleted: 130, location: 'Packing Area' },
    { id: 'BOT-07', status: BotStatus.Idle, battery: 98, tasksCompleted: 102, location: 'Docking Bay' },
    { id: 'BOT-08', status: BotStatus.Charging, battery: 45, tasksCompleted: 121, location: 'Charging Station 1' },
];

export const STOCK_UTILIZATION_DATA: ChartData[] = [
    { name: 'Jan', value: 4000 },
    { name: 'Feb', value: 3000 },
    { name: 'Mar', value: 5000 },
    { name: 'Apr', value: 4500 },
    { name: 'May', value: 6000 },
    { name: 'Jun', value: 5500 },
];

export const CATEGORY_DISTRIBUTION_DATA: ChartData[] = [
    { name: 'Electronics', value: 400 },
    { name: 'Medical', value: 300 },
    { name: 'Materials', value: 300 },
    { name: 'Energy', value: 200 },
    { name: 'Other', value: 150 },
];

export const DEMAND_STOCK_RATIO_DATA = [
    { name: 'Available Stock', value: 65, fill: '#00f6ff' },
    { name: 'Predicted Demand', value: 35, fill: '#00ff87' },
];

export const DEMAND_FORECAST_DATA: ChartData[] = Array.from({ length: 30 }, (_, i) => ({
    name: `Day ${i + 1}`,
    predicted: 4000 + Math.sin(i / 3) * 1000 + Math.random() * 500,
    historical: 3800 + Math.sin(i / 3.5) * 800 + Math.random() * 400,
}));

export const BOT_EFFICIENCY_DATA: ChartData[] = [
    { name: 'Week 1', efficiency: 85 },
    { name: 'Week 2', efficiency: 88 },
    { name: 'Week 3', efficiency: 92 },
    { name: 'Week 4', efficiency: 90 },
];
