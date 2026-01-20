import { useState, useMemo } from 'react';
import { Stack, Typography, Button, ThemeProvider, createTheme, CssBaseline, Box, Divider, IconButton } from '@mui/material';
import { Settings as SettingsIcon } from '@mui/icons-material';
import { TextEmbedder } from './components/TextEmbedder';
import { ImageEmbedder } from './components/ImageEmbedder';
import { EmbeddingDisplay } from './components/EmbeddingDisplay';
import { VectorSpace3D } from './components/VectorSpace3D';
import { DistanceDisplay } from './components/DistanceDisplay';
import { RerankDisplay } from './components/RerankDisplay';
import { GlassPanel } from './components/GlassPanel';
import { SettingsDialog } from './components/SettingsDialog';
import { findTopKSimilar } from './utils/rerank';
import type { EmbeddingData } from './types/embedding';
import './styles/App.css';

const theme = createTheme({
    palette: {
        mode: 'dark',
        primary: {
            main: '#00E5FF',
        },
        secondary: {
            main: '#CC00FF',
        },
        background: {
            default: '#050505',
            paper: 'rgba(255, 255, 255, 0.05)',
        },
    },
    typography: {
        fontFamily: "'Inter', sans-serif",
        h1: { fontFamily: "'Outfit', sans-serif", fontWeight: 700 },
        h2: { fontFamily: "'Outfit', sans-serif", fontWeight: 700 },
        h3: { fontFamily: "'Outfit', sans-serif", fontWeight: 700 },
        h4: { fontFamily: "'Outfit', sans-serif", fontWeight: 700 },
        h5: { fontFamily: "'Outfit', sans-serif", fontWeight: 600 },
        h6: { fontFamily: "'Outfit', sans-serif", fontWeight: 600 },
    },
    shape: {
        borderRadius: 16,
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: '12px',
                    textTransform: 'none',
                    fontWeight: 600,
                    padding: '8px 24px',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: '0 4px 20px rgba(0, 229, 255, 0.4)',
                    },
                },
            },
        },
    },
});

export const App = () => {
    const [embeddings, setEmbeddings] = useState<EmbeddingData[]>([]);
    const [selectedEmbeddingId, setSelectedEmbeddingId] = useState<string | undefined>();
    const [topK, setTopK] = useState(5);
    const [settingsOpen, setSettingsOpen] = useState(false);

    const onEmbeddingCreated = (embedding: EmbeddingData) => {
        setEmbeddings((prev) => [...prev, embedding]);
    };

    const onClearEmbeddings = () => {
        setEmbeddings([]);
        setSelectedEmbeddingId(undefined);
    };

    const onEmbeddingSelect = (embedding: EmbeddingData) => {
        setSelectedEmbeddingId(embedding.id);
    };

    const onEmbeddingDeselect = () => {
        setSelectedEmbeddingId(undefined);
    };

    const selectedEmbedding = useMemo(() => {
        return embeddings.find(e => e.id === selectedEmbeddingId);
    }, [embeddings, selectedEmbeddingId]);

    const topKResults = useMemo(() => {
        if (!selectedEmbedding) return [];
        return findTopKSimilar(selectedEmbedding, embeddings, topK);
    }, [selectedEmbedding, embeddings, topK]);

    const topKIds = useMemo(() => {
        return topKResults.map(r => r.embedding.id);
    }, [topKResults]);

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Box sx={{
                height: '100vh',
                p: { xs: 2, md: 4 },
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden'
            }}>
                <GlassPanel sx={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: { xs: 'column', lg: 'row' },
                    overflow: 'hidden',
                    p: 0 // Remove internal padding to allow sub-containers to handle it
                }}>
                    {/* Left Sidebar: Controls and List */}
                    <Box sx={{
                        width: { xs: '100%', lg: 380 },
                        display: 'flex',
                        flexDirection: 'column',
                        flexShrink: 0,
                        borderRight: { lg: '1px solid rgba(255, 255, 255, 0.05)' },
                        backgroundColor: 'rgba(255, 255, 255, 0.01)',
                    }}>
                        {/* Header moved into sidebar top */}
                        <Box sx={{ p: 3, pb: 2 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <Typography variant="h3" component="h1" gutterBottom className="gradient-text" sx={{ fontSize: '1.8rem', mb: 0.5 }}>
                                    Neural Explorer
                                </Typography>
                                <IconButton
                                    size="small"
                                    onClick={() => setSettingsOpen(true)}
                                    sx={{
                                        color: 'rgba(255,255,255,0.3)',
                                        mt: -0.5,
                                        mr: -1,
                                        '&:hover': { color: '#00E5FF', bgcolor: 'rgba(0,229,255,0.1)' }
                                    }}
                                >
                                    <SettingsIcon fontSize="small" />
                                </IconButton>
                            </Box>
                            <Typography variant="caption" color="text.secondary" sx={{ opacity: 0.7, lineHeight: 1.2, display: 'block' }}>
                                Visualizing Cohere v4 multi-modal embeddings in latent space.
                            </Typography>
                        </Box>

                        <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.05)' }} />

                        <Box sx={{ p: 3, overflowY: 'auto', flex: 1 }}>
                            <Stack spacing={3}>
                                <Box>
                                    <TextEmbedder onEmbeddingCreated={onEmbeddingCreated} />
                                </Box>
                                <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.05)' }} />
                                <Box>
                                    <ImageEmbedder onEmbeddingCreated={onEmbeddingCreated} />
                                </Box>

                                {embeddings.length > 0 && (
                                    <Box sx={{ pt: 1 }}>
                                        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1.5 }}>
                                            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>Latent Encodings ({embeddings.length})</Typography>
                                            <Button
                                                variant="text"
                                                color="error"
                                                size="small"
                                                onClick={onClearEmbeddings}
                                                sx={{ opacity: 0.6, '&:hover': { opacity: 1 } }}
                                            >
                                                Clear
                                            </Button>
                                        </Stack>
                                        <EmbeddingDisplay
                                            embeddings={embeddings}
                                            selectedEmbeddingId={selectedEmbeddingId}
                                            onEmbeddingSelect={onEmbeddingSelect}
                                            onEmbeddingDeselect={onEmbeddingDeselect}
                                        />
                                    </Box>
                                )}
                            </Stack>
                        </Box>
                    </Box>

                    {/* Main Content: Visualization and Analytics */}
                    <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
                        {embeddings.length > 0 ? (
                            <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', p: 4 }}>
                                <Box sx={{ flex: 1, minHeight: 400, position: 'relative' }}>
                                    <VectorSpace3D
                                        embeddings={embeddings}
                                        selectedEmbeddingId={selectedEmbeddingId}
                                        topKIds={topKIds}
                                    />
                                </Box>

                                <Box sx={{ mt: 4, overflowX: 'auto' }}>
                                    {selectedEmbedding && embeddings.length > 1 ? (
                                        <RerankDisplay
                                            queryEmbedding={selectedEmbedding}
                                            allEmbeddings={embeddings}
                                            topK={topK}
                                            onTopKChange={setTopK}
                                        />
                                    ) : embeddings.length >= 2 && !selectedEmbeddingId ? (
                                        <DistanceDisplay embeddings={embeddings} />
                                    ) : null}
                                </Box>
                            </Box>
                        ) : (
                            <Box sx={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0.1 }}>
                                <Typography variant="h2" sx={{ fontWeight: 700 }}>AWAITING DATA</Typography>
                            </Box>
                        )}
                    </Box>
                </GlassPanel>
            </Box>
            <SettingsDialog open={settingsOpen} onClose={() => setSettingsOpen(false)} />
        </ThemeProvider>
    );
};
