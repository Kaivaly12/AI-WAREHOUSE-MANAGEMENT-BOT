
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
    { id: 'BOT-01', status: BotStatus.Active, battery: 88, tasksCompleted: 142, location: 'Aisle 7', history: [
        { timestamp: new Date(Date.now() - 3600000).toISOString(), event: 'Task completed: Pick Item - PID-004' },
        { timestamp: new Date(Date.now() - 7200000).toISOString(), event: 'Status changed to Active.' },
    ]},
    { id: 'BOT-02', status: BotStatus.Idle, battery: 95, tasksCompleted: 110, location: 'Docking Bay', history: [
        { timestamp: new Date(Date.now() - 1800000).toISOString(), event: 'Returned to Docking Bay.' },
        { timestamp: new Date(Date.now() - 9000000).toISOString(), event: 'System restart initiated.' },
    ]},
    { id: 'BOT-03', status: BotStatus.Charging, battery: 23, tasksCompleted: 98, location: 'Charging Station 2', history: [
        { timestamp: new Date(Date.now() - 600000).toISOString(), event: 'Low battery detected. Moving to charge.' },
        { timestamp: new Date(Date.now() - 4800000).toISOString(), event: 'Task completed: Deliver Item - Packing Area' },
    ]},
    { id: 'BOT-04', status: BotStatus.Active, battery: 76, tasksCompleted: 158, location: 'Aisle 3', history: [
        { timestamp: new Date(Date.now() - 2400000).toISOString(), event: 'Task assigned: Scan Shelf - Aisle 3' },
        { timestamp: new Date(Date.now() - 5400000).toISOString(), event: 'Activated from Idle state.' },
    ]},
    { id: 'BOT-05', status: BotStatus.Maintenance, battery: 100, tasksCompleted: 55, location: 'Maintenance Bay', history: [
         { timestamp: new Date(Date.now() - 86400000).toISOString(), event: 'Scheduled maintenance started.' },
         { timestamp: new Date(Date.now() - 86460000).toISOString(), event: 'Sensor calibration failed diagnostics.' },
    ]},
    { id: 'BOT-06', status: BotStatus.Active, battery: 91, tasksCompleted: 130, location: 'Packing Area', history: [
        { timestamp: new Date(Date.now() - 1200000).toISOString(), event: 'Delivered Item PID-001 to Packing Area.' },
        { timestamp: new Date(Date.now() - 3000000).toISOString(), event: 'Task assigned: Deliver Item - Packing Area' },
    ]},
    { id: 'BOT-07', status: BotStatus.Idle, battery: 98, tasksCompleted: 102, location: 'Docking Bay', history: [
        { timestamp: new Date(Date.now() - 7200000).toISOString(), event: 'Task queue empty. Returning to base.' },
    ]},
    { id: 'BOT-08', status: BotStatus.Charging, battery: 45, tasksCompleted: 121, location: 'Charging Station 1', history: [
        { timestamp: new Date(Date.now() - 1800000).toISOString(), event: 'Battery level at 20%. Initiating charge cycle.' },
    ]},
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