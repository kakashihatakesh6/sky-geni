import React, { useEffect, useState } from 'react';
import { Paper, Typography, Box, Chip, Skeleton, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import { getRiskFactors } from '../services/api';

const RiskFactorsCard = () => {
    const [risks, setRisks] = useState<any[]>([]);

    useEffect(() => {
        getRiskFactors().then(setRisks).catch(console.error);
    }, []);

    if (risks.length === 0) return <Skeleton variant="rectangular" height={300} />;

    return (
        <Paper sx={{ p: 3, height: '100%', borderRadius: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>Top Risk Factors</Typography>
            <List sx={{ pt: 0 }}>
                {risks.map((risk: any) => (
                    <ListItem key={risk.id} alignItems="flex-start" sx={{ px: 0, py: 1.5 }}>
                        <ListItemIcon sx={{ minWidth: 24, mt: 0.5 }}>
                            <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#f97316' }} />
                        </ListItemIcon>
                        <ListItemText
                            primary={risk.message}
                            primaryTypographyProps={{
                                variant: 'body1',
                                fontWeight: 500,
                                color: 'text.primary',
                                style: { lineHeight: 1.4 }
                            }}
                        />
                    </ListItem>
                ))}
            </List>
        </Paper>
    );
};

export default RiskFactorsCard;
