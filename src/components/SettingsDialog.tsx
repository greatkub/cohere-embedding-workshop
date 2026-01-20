import { useState, useEffect } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    Typography,
    Box,
    IconButton,
    InputAdornment
} from '@mui/material';
import { Visibility, VisibilityOff, Key } from '@mui/icons-material';
import { getStoredApiKey, setStoredApiKey } from '../utils/cohere';

type SettingsDialogProps = {
    open: boolean;
    onClose: () => void;
};

export const SettingsDialog = ({ open, onClose }: SettingsDialogProps) => {
    const [apiKey, setApiKey] = useState('');
    const [showKey, setShowKey] = useState(false);

    useEffect(() => {
        if (open) {
            setApiKey(getStoredApiKey());
        }
    }, [open]);

    const handleSave = () => {
        setStoredApiKey(apiKey);
        onClose();
        // Optional: reload or refresh the client state if needed
        window.location.reload();
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            PaperProps={{
                sx: {
                    bgcolor: '#0A0A0A',
                    backgroundImage: 'none',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '20px',
                    width: '100%',
                    maxWidth: '450px',
                }
            }}
        >
            <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1.5, pb: 1 }}>
                <Box sx={{
                    p: 1,
                    borderRadius: '10px',
                    bgcolor: 'rgba(0, 229, 255, 0.1)',
                    color: '#00E5FF',
                    display: 'flex'
                }}>
                    <Key fontSize="small" />
                </Box>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>API Settings</Typography>
            </DialogTitle>

            <DialogContent sx={{ pt: 2 }}>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    Enter your Cohere API key to synchronize with neural vector space. Your key is stored securely in your browser's local storage.
                </Typography>

                <TextField
                    label="Cohere API Key"
                    fullWidth
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    type={showKey ? 'text' : 'password'}
                    variant="outlined"
                    autoFocus
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton onClick={() => setShowKey(!showKey)} edge="end">
                                    {showKey ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                            </InputAdornment>
                        ),
                        sx: { borderRadius: '12px' }
                    }}
                />
            </DialogContent>

            <DialogActions sx={{ p: 3, pt: 1 }}>
                <Button onClick={onClose} sx={{ color: 'rgba(255, 255, 255, 0.5)', textTransform: 'none' }}>
                    Cancel
                </Button>
                <Button
                    variant="contained"
                    onClick={handleSave}
                    sx={{
                        borderRadius: '10px',
                        background: 'linear-gradient(90deg, #00E5FF 0%, #CC00FF 100%)',
                        textTransform: 'none',
                        px: 4,
                        fontWeight: 600
                    }}
                >
                    Save Configuration
                </Button>
            </DialogActions>
        </Dialog>
    );
};
