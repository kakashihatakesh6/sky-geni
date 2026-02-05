import React from 'react';
import { ThemeProvider, CssBaseline, Box, AppBar, Toolbar, Typography, Container, Grid, IconButton } from '@mui/material';
import { theme } from './theme';
import DashboardIcon from '@mui/icons-material/Dashboard';
import NotificationsIcon from '@mui/icons-material/Notifications';
import MessageIcon from '@mui/icons-material/Message';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

// Components (Placeholders for now)
import SummaryBanner from './components/SummaryBanner';
import DriversCard from './components/DriversCard';
import RiskFactorsCard from './components/RiskFactorsCard';
import RecommendationsCard from './components/RecommendationsCard';
import RevenueTrendChart from './components/RevenueTrendChart';

function App() {
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Box sx={{ flexGrow: 1, height: '100vh', overflow: 'auto', bgcolor: 'background.default' }}>
                {/* Header */}
                <AppBar position="static" elevation={0} sx={{ bgcolor: '#0e3a8c', color: 'white' }}>
                    <Toolbar variant="dense" sx={{ minHeight: 64 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
                            {/* Logo Icon */}
                            <div style={{
                                width: 32,
                                height: 32,
                                borderRadius: '50%',
                                background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                                marginRight: 12,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                border: '2px solid white'
                            }}>
                                <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#f59e0b' }}></div>
                            </div>
                            <Typography variant="h5" component="div" sx={{ color: 'white', textTransform: 'none', fontWeight: 700, letterSpacing: '-0.025em' }}>
                                SkyGeni
                            </Typography>
                        </Box>
                        <Box sx={{ flexGrow: 1 }} />
                        <IconButton color="inherit" sx={{ mx: 0.5 }}><DashboardIcon /></IconButton>
                        <IconButton color="inherit" sx={{ mx: 0.5 }}><NotificationsIcon /></IconButton>
                        <IconButton color="inherit" sx={{ mx: 0.5 }}><MessageIcon /></IconButton>
                        <IconButton color="inherit" sx={{ mx: 0.5 }}><AccountCircleIcon /></IconButton>
                    </Toolbar>
                </AppBar>

                <Container maxWidth="lg" sx={{ mt: 3, mb: 3 }}>
                    <Stack spacing={3}>
                        {/* 1. Summary Banner */}
                        <SummaryBanner />

                        {/* 2. Three Cards Row */}
                        <Grid container spacing={3}>
                            <Grid item xs={12} md={4}>
                                <DriversCard />
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <RiskFactorsCard />
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <RecommendationsCard />
                            </Grid>
                        </Grid>

                        {/* 3. Charts Row */}
                        <RevenueTrendChart />
                    </Stack>
                </Container>
            </Box>
        </ThemeProvider>
    );
}

import { Stack } from '@mui/material'; // Forgot to import Stack
export default App;
