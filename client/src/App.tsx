import { ThemeProvider, CssBaseline, Box, AppBar, Toolbar, Typography, Container, Grid, IconButton, Stack } from '@mui/material';
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
            <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', bgcolor: 'background.default' }}>
                {/* Header */}
                <AppBar position="static" elevation={0} sx={{ bgcolor: '#0e3a8c', color: 'white', flexShrink: 0 }}>
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

                {/* Main Content Area - Scrollable */}
                <Box sx={{ flexGrow: 1, p: 3, display: 'flex', flexDirection: 'column', gap: 3 }}>
                    {/* 1. Summary Banner (Full Width) */}
                    <Box sx={{ flexShrink: 0 }}>
                        <SummaryBanner />
                    </Box>

                    {/* 2. Main Grid Content */}
                    <Box sx={{ flexGrow: 1 }}>
                        <Grid container spacing={3}>
                            {/* Left Column: Drivers Card */}
                            <Grid size={{ xs: 12, md: 3 }} sx={{ display: 'flex' }}>
                                <DriversCard />
                            </Grid>

                            {/* Right Column: Other Components */}
                            <Grid size={{ xs: 12, md: 9 }} sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                                {/* Risk & Recommendations Row */}
                                <Box>
                                    <Grid container spacing={3}>
                                        <Grid size={{ xs: 12, md: 6 }}>
                                            <RiskFactorsCard />
                                        </Grid>
                                        <Grid size={{ xs: 12, md: 6 }}>
                                            <RecommendationsCard />
                                        </Grid>
                                    </Grid>
                                </Box>

                                {/* Revenue Trend Chart - Fixed minimum height for visibility */}
                                <Box sx={{ flexGrow: 1, minHeight: 400 }}>
                                    <RevenueTrendChart />
                                </Box>
                            </Grid>
                        </Grid>
                    </Box>
                </Box>
            </Box>
        </ThemeProvider>
    );
}


export default App;
