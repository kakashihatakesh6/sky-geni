import React, { useEffect, useState } from 'react';
import { Paper, Typography, Box, Divider, Skeleton } from '@mui/material';
import { getDrivers } from '../services/api';

// Sparkline Component supporting Area and Bar
const Sparkline = ({ data, color = '#3b82f6', type = 'area' }: { data: number[], color?: string, type?: 'area' | 'bar' }) => {
    const [path, setPath] = React.useState('');
    const [areaPath, setAreaPath] = React.useState('');
    const [bars, setBars] = React.useState<{ x: number, y: number, height: number, width: number }[]>([]);

    useEffect(() => {
        const width = 280; // Approximate width in the card
        const height = 50;
        const points = data && data.length > 0 ? data : [];
        if (points.length === 0) return;

        const max = Math.max(...points);
        const min = Math.min(...points) * 0.8; // Give some bottom padding

        if (type === 'bar') {
            const barWidth = (width / points.length) * 0.8;
            const gap = (width / points.length) * 0.2;

            const newBars = points.map((p, i) => ({
                x: i * (width / points.length) + gap / 2,
                y: height - ((p - 0) / (max - 0)) * height, // Base from 0 for bars usually
                height: ((p - 0) / (max - 0)) * height,
                width: barWidth
            }));
            setBars(newBars);
        } else {
            const xScale = (i: number) => (i / (points.length - 1)) * width;
            const yScale = (v: number) => height - ((v - min) / (max - min || 1)) * height;

            let d = `M ${xScale(0)} ${yScale(points[0])}`;
            points.slice(1).forEach((p, i) => {
                d += ` L ${xScale(i + 1)} ${yScale(p)}`;
            });

            setPath(d);
            setAreaPath(`${d} L ${width} ${height} L 0 ${height} Z`);
        }
    }, [data, type]);

    if (type === 'bar') {
        return (
            <svg width="100%" height="100%" viewBox="0 0 280 50" preserveAspectRatio="none">
                {bars.map((bar, i) => (
                    <rect key={i} x={bar.x} y={bar.y} width={bar.width} height={bar.height} fill={color} rx={2} />
                ))}
            </svg>
        );
    }

    return (
        <svg width="100%" height="100%" viewBox="0 0 280 50" preserveAspectRatio="none">
            <path d={areaPath} fill={color} fillOpacity={0.2} />
            <path d={path} stroke={color} strokeWidth={2} fill="none" />
        </svg>
    );
};

const DriverRow = ({ label, value, trend, unit = '', type = 'area', color = '#3b82f6' }: any) => {
    const isPositive = trend > 0;
    // Mock diff data for each type to look distinct
    const mockDataMap: Record<string, number[]> = {
        'Pipeline Value': [10, 12, 11, 14, 13, 16, 18, 20, 22, 24],
        'Win Rate': [15, 18, 22, 19, 21, 25, 24, 23, 22, 26],
        'Avg Deal Size': [20, 22, 21, 24, 26, 25, 28, 30, 32, 35],
        'Sales Cycle': [40, 38, 42, 45, 41, 39, 43, 46, 40, 35]
    };

    // Reverse logic just for visual interest on negative trend or specific items? 
    // Actually sticking to simple mocks for "look like image"
    const mockHistory = mockDataMap[label] || [10, 15, 13, 18, 22, 20, 25, 28, 30];

    return (
        <Box sx={{ py: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
                <Typography variant="body1" fontWeight={700} color="text.primary">
                    {label}
                </Typography>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="h6" sx={{ fontWeight: 800 }}>
                        {unit === '$' ? '$' : ''}{typeof value === 'number' ? value.toLocaleString() : value}{unit === 'Days' ? '' : unit}
                    </Typography>
                    <Typography variant="body2" sx={{
                        fontWeight: 700,
                        color: isPositive ? '#22c55e' : '#ef4444', // Bright green/red
                    }}>
                        {trend > 0 ? '+' : ''}{trend}%
                    </Typography>
                </Box>
            </Box>

            <Box sx={{ height: 50, width: '100%', mt: 0.5 }}>
                <Sparkline data={mockHistory} color={color} type={type as any} />
            </Box>
        </Box>
    );
};

const DriversCard = () => {
    const [data, setData] = useState<any>(null);

    useEffect(() => {
        getDrivers().then(setData).catch(console.error);
    }, []);

    if (!data) return <Skeleton variant="rectangular" height={360} sx={{ borderRadius: 2 }} />;

    return (
        <Paper sx={{ p: 3, height: '100%', borderRadius: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>Revenue Drivers</Typography>
            <Divider sx={{ mb: 2 }} />

            <DriverRow
                label="Pipeline Value"
                value={Math.round(data.pipelineValue / 1000000 * 10) / 10 + 'M'}
                trend={12}
                unit="$"
                color="#3b82f6"
                type="area"
            />
            <Divider sx={{ my: 1, opacity: 0.5 }} />

            <DriverRow
                label="Win Rate"
                value={data.winRate}
                trend={-4}
                unit="%"
                color="#3b82f6"
                type="bar"
            />
            <Divider sx={{ my: 1, opacity: 0.5 }} />

            <DriverRow
                label="Avg Deal Size"
                value={Math.round(data.avgDealSize / 1000) + 'K'}
                trend={3}
                unit="$"
                color="#3b82f6"
                type="area"
            />
            <Divider sx={{ my: 1, opacity: 0.5 }} />

            <DriverRow
                label="Sales Cycle"
                value={data.salesCycleDays}
                trend={9}
                unit="Days"
                color="#f97316" // Orange
                type="area"
            />
        </Paper>
    );
};

export default DriversCard;
