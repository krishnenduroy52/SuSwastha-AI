import React from 'react';
import {
    Card,
    CardContent,
    Typography,
    Switch,
} from '@mui/material';

const StyledCard = ({ isSelected, onClick, children, onToggle }) => (
    <Card
        sx={{
            marginBottom: '16px',
            display: 'flex',
            alignItems: 'center',
            padding: '12px',
        }}
    >
        <CardContent style={{ flexGrow: 1 }}>
            <Typography variant="body1">{children}</Typography>
        </CardContent>
        <Switch color="warning"  checked={isSelected} onChange={onToggle} />
    </Card>
);

export default StyledCard;
