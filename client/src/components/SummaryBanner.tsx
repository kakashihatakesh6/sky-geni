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
            background: 'linear-gradient(90deg, #0e3a8c 0%, #1e40af 100%)', // Match Header Deep Blue
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center', // Centered
            gap: 8, // Add gap between sections
            borderRadius: 2,
            boxShadow: 3
        }}>
            <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 2 }}>
                <Typography variant="h4" sx={{ fontWeight: 600 }}>QTD Revenue:</Typography>
                <Typography variant="h2" sx={{ fontWeight: 700 }}>
                    ${data.revenue.toLocaleString()}
                </Typography>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mr: 4, opacity: 0.9 }}>
                    <Typography variant="h6" sx={{ fontWeight: 500 }}>Target:</Typography>
                    <Typography variant="h5" sx={{ fontWeight: 600 }}>${data.target.toLocaleString()}</Typography>
                </Box>

                <Box sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    position: 'relative',
                    '&::before': {
                        content: '""',
                        position: 'absolute',
                        left: -20,
                        top: '10%',
                        bottom: '10%',
                        width: '1px',
                        bgcolor: 'rgba(255,255,255,0.3)'
                    }
                }}>
                    <Typography variant="h5" sx={{
                        color: data.gapPercent >= 0 ? '#4ade80' : '#f87171', // Green or Red
                        fontWeight: 700
                    }}>
                        {data.gapPercent >= 0 ? '+' : ''}{data.gapPercent}%
                    </Typography>
                    <Typography variant="h6" sx={{ fontWeight: 500, opacity: 0.9 }}>to Goal</Typography>
                </Box>
            </Box>
        </Paper>
    );
};

export default SummaryBanner;
