import React, { useEffect, useState } from 'react';
import { Paper, Typography, Box, Skeleton } from '@mui/material';
import { getSummary } from '../services/api';

const SummaryBanner = () => {
    const [data, setData] = useState<any>(null);

    useEffect(() => {
        getSummary().then(setData).catch(console.error);
    }, []);

    if (!data) return <Skeleton variant="rectangular" height={100} />;

    return (
        <Paper sx={{
            p: 3,
            background: 'linear-gradient(180deg, #1e40af 0%, #0e3a8c 100%)', // darker gradient top-down
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 0, // Looks more like a banner/bar based on image
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
        }}>
            {/* Section 1: QTD Revenue (Largest) */}
            <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1.5, mr: 6 }}>
                <Typography variant="h5" sx={{ fontWeight: 700, textShadow: '0px 2px 4px rgba(0,0,0,0.3)' }}>
                    QTD Revenue:
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 800, textShadow: '0px 2px 4px rgba(0,0,0,0.3)' }}>
                    ${data.revenue.toLocaleString()}
                </Typography>
            </Box>

            {/* Divider */}
            <Box sx={{ width: '1px', height: '40px', bgcolor: 'rgba(255,255,255,0.2)', mr: 6 }} />

            {/* Section 2: Target (Medium) */}
            <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1, mr: 6 }}>
                <Typography variant="h5" sx={{ fontWeight: 400, opacity: 0.9 }}>
                    Target:
                </Typography>
                <Typography variant="h5" sx={{ fontWeight: 600 }}>
                    ${data.target.toLocaleString()}
                </Typography>
            </Box>

            {/* Divider */}
            <Box sx={{ width: '1px', height: '40px', bgcolor: 'rgba(255,255,255,0.2)', mr: 6 }} />

            {/* Section 3: Gap (Small, Colored) */}
            <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1 }}>
                <Typography variant="h5" sx={{
                    color: '#fca5a5', // Soft Red/Pink for negative
                    fontWeight: 700
                }}>
                    {data.gapPercent}%
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 400, opacity: 0.9 }}>
                    to Goal
                </Typography>
            </Box>
        </Paper>
    );
};

export default SummaryBanner;
