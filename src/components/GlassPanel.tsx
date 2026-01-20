import React, { ReactNode } from 'react';
import { Box, BoxProps, styled } from '@mui/material';

interface GlassPanelProps extends BoxProps {
    children: ReactNode;
    opacity?: number;
    blur?: number;
}

const StyledGlassBox = styled(Box, {
    shouldForwardProp: (prop) => prop !== 'opacity' && prop !== 'blur',
})<GlassPanelProps>(({ opacity = 0.05, blur = 16 }) => ({
    background: `rgba(255, 255, 255, ${opacity})`,
    backdropFilter: `blur(${blur}px)`,
    WebkitBackdropFilter: `blur(${blur}px)`,
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '24px',
    boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    '&:hover': {
        borderColor: 'rgba(255, 255, 255, 0.2)',
        boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.5)',
        background: `rgba(255, 255, 255, ${opacity + 0.02})`,
    },
}));

export const GlassPanel: React.FC<GlassPanelProps> = ({ children, ...props }) => {
    return (
        <StyledGlassBox className="glass-panel" {...props}>
            {children}
        </StyledGlassBox>
    );
};
