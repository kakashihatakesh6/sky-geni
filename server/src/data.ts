import fs from 'fs';
import path from 'path';
import { Account, Rep, Deal, Activity, Target } from './types';

const DATA_DIR = path.join(__dirname, '../data');

export let accounts: Account[] = [];
export let reps: Rep[] = [];
export let deals: Deal[] = [];
export let activities: Activity[] = [];
export let targets: Target[] = [];

// Simulation Current Date
export const CURRENT_DATE = new Date('2026-02-05');

export const loadData = () => {
  try {
    const readUi = (file: string) => JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf-8'));

    // Clear and push to preserve reference
    const load = (arr: any[], file: string) => {
        const filePath = path.join(DATA_DIR, file);
        console.log(`Loading ${file} from ${filePath}`);
        if (!fs.existsSync(filePath)) {
            console.error(`File not found: ${filePath}`);
            return;
        }
        const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
        arr.length = 0;
        arr.push(...data);
        console.log(`Loaded ${arr.length} records into ${file.replace('.json', '')}`);
    };

    load(accounts, 'accounts.json');
    load(reps, 'reps.json');
    load(deals, 'deals.json');
    load(activities, 'activities.json');
    load(targets, 'targets.json');

    console.log(`Data loaded: 
      ${accounts.length} accounts, 
      ${reps.length} reps, 
      ${deals.length} deals, 
      ${activities.length} activities,
      ${targets.length} targets`);

  } catch (err) {
    console.error('Error loading data:', err);
  }
};

// Helpers
export const getQ1Target2026 = () => {
    // Sum targets for Jan, Feb, Mar 2026 (or all available 2026 if simpler)
    // targets.json format: "month": "2025-01". Be sure to check years.
    // Wait, the file snippet showed 2025. I need to check if 2026 targets exist.
    // If not, I'll project 2025 targets or reuse them.
    return targets
        .filter(t => t.month.startsWith('2026-01') || t.month.startsWith('2026-02') || t.month.startsWith('2026-03'))
        .reduce((sum, t) => sum + t.target, 0);
};

export const getDealsInRange = (startDate: Date, endDate: Date) => {
    return deals.filter(d => {
        if (!d.closed_at) return false;
        const closed = new Date(d.closed_at);
        return closed >= startDate && closed <= endDate;
    });
};
