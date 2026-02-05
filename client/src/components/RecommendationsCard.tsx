import React, { useEffect, useState } from 'react';
import { Paper, Typography, Box, List, ListItem, ListItemIcon, ListItemText, Skeleton } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { getRecommendations } from '../services/api';

const RecommendationsCard = () => {
    const [recs, setRecs] = useState<string[]>([]);

    useEffect(() => {
        getRecommendations().then(setRecs).catch(console.error);
    }, []);

    if (recs.length === 0) return <Skeleton variant="rectangular" height={300} />;

    return (
        <Paper sx={{ p: 3, height: '100%', borderRadius: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>Recommended Actions</Typography>
            <List sx={{ pt: 0 }}>
                {recs.map((rec, idx) => (
                    <ListItem key={idx} alignItems="flex-start" sx={{ px: 0, py: 1.5 }}>
                        <ListItemIcon sx={{ minWidth: 30, mt: 0.2 }}>
                            <CheckCircleIcon sx={{ color: '#f97316', fontSize: 20 }} />
                        </ListItemIcon>
                        <ListItemText
                            primary={rec}
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

export default RecommendationsCard;
