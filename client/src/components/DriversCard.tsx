import React, { useEffect, useState } from 'react';
import { Paper, Typography, Box, Divider, Skeleton } from '@mui/material';
import { getDrivers } from '../services/api';
// Use D3 for Sparklines later, for now just numbers

// Sparkline Component
const Sparkline = ({ data, color = '#3b82f6', isPositive = true }: { data: number[], color?: string, isPositive?: boolean }) => {
    // Generate simple random data for demo if actual history isn't available
    const [path, setPath] = React.useState('');
    const [areaPath, setAreaPath] = React.useState('');

    useEffect(() => {
        // Mock data logic for sparkline appearance
        const points = data && data.length > 0 ? data : Array.from({ length: 10 }, () => Math.floor(Math.random() * 50) + 20);
        // Make it trend up or down based on isPositive
        if (isPositive) points.push(points[points.length - 1] + 20);
        else points.push(points[points.length - 1] - 20);

        const width = 120;
        const height = 35;
        const max = Math.max(...points);
        const min = Math.min(...points);

        const xScale = (i: number) => (i / (points.length - 1)) * width;
        const yScale = (v: number) => height - ((v - min) / (max - min || 1)) * height;

        let d = `M ${xScale(0)} ${yScale(points[0])}`;
        points.slice(1).forEach((p, i) => {
            d += ` L ${xScale(i + 1)} ${yScale(p)}`;
        });

        setPath(d);
        setAreaPath(`${d} L ${width} ${height} L 0 ${height} Z`);
    }, [data, isPositive]);

    return (
        <svg width="100%" height={40} viewBox="0 0 120 40" preserveAspectRatio="none">
            <path d={areaPath} fill={color} fillOpacity={0.2} />
            <path d={path} stroke={color} strokeWidth={2} fill="none" />
        </svg>
    );
};

const DriverRow = ({ label, value, trend, unit = '' }: any) => {
    const isPositive = trend > 0;
    // Map driver to mock history data or passed prop
    const mockHistory = [10, 15, 13, 18, 22, 20, 25, 28, 30];

    return (
        <Box sx={{ py: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', mb: 1 }}>
                <Box>
                    <Typography variant="subtitle1" fontWeight={700} color="text.primary" sx={{ mb: 0.5 }}>{label}</Typography>
                    <Box sx={{ height: 40, width: 140 }}>
                        <Sparkline data={mockHistory} color="#3b82f6" isPositive={isPositive} />
                    </Box>
                </Box>
                <Box sx={{ textAlign: 'right' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 1 }}>
                        <Typography variant="h6" sx={{ fontWeight: 700 }}>
                            {unit === '$' ? '$' : ''}{typeof value === 'number' ? value.toLocaleString() : value}{unit === 'Days' ? '' : unit}
                        </Typography>
                        <Typography variant="body2" sx={{
                            fontWeight: 700,
                            color: isPositive ? 'success.main' : 'error.main',
                            bgcolor: isPositive ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                            px: 0.8, py: 0.2,
                            borderRadius: 1
                        }}>
                            {trend > 0 ? '+' : ''}{trend}%
                        </Typography>
                    </Box>
                    {unit === 'Days' && <Typography variant="caption" color="text.secondary">Days</Typography>}
                </Box>
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
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>Revenue Drivers</Typography>
            <DriverRow label="Pipeline Value" value={Math.round(data.pipelineValue / 1000000 * 10) / 10 + 'M'} unit="$" trend={12} />
            <Divider sx={{ my: 1 }} />
            <DriverRow label="Win Rate" value={data.winRate} unit="%" trend={-4} />
            <Divider sx={{ my: 1 }} />
            <DriverRow label="Avg Deal Size" value={Math.round(data.avgDealSize / 1000) + 'K'} unit="$" trend={3} />
            <Divider sx={{ my: 1 }} />
            <DriverRow label="Sales Cycle" value={data.salesCycleDays} unit="Days" trend={9} />
        </Paper>
    );
};

export default DriversCard;
