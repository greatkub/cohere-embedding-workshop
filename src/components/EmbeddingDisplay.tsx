import { Stack, Typography, Chip, Button, Box, alpha } from '@mui/material';
import type { EmbeddingData } from '../types/embedding';

type EmbeddingDisplayProps = {
  embeddings: EmbeddingData[];
  selectedEmbeddingId?: string;
  onEmbeddingSelect: (embedding: EmbeddingData) => void;
  onEmbeddingDeselect: () => void;
};

export const EmbeddingDisplay = ({
  embeddings,
  selectedEmbeddingId,
  onEmbeddingSelect,
  onEmbeddingDeselect
}: EmbeddingDisplayProps) => {
  if (embeddings.length === 0) {
    return (
      <Typography variant="body1" color="text.secondary" sx={{ py: 4, textAlign: 'center' }}>
        No latent projections detected. Feed data to initialize embeddings.
      </Typography>
    );
  }

  return (
    <Stack spacing={2}>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        {selectedEmbeddingId && (
          <Button
            size="small"
            variant="text"
            onClick={onEmbeddingDeselect}
            sx={{
              color: 'rgba(255, 255, 255, 0.5)',
              fontSize: '0.75rem',
              '&:hover': { color: '#00E5FF' }
            }}
          >
            Reset Focus
          </Button>
        )}
      </Stack>
      <Stack spacing={1.5}>
        {embeddings.map((embedding) => {
          const isSelected = embedding.id === selectedEmbeddingId;
          return (
            <Box
              key={embedding.id}
              sx={{
                p: 1.5,
                cursor: 'pointer',
                borderRadius: '12px',
                border: '1px solid',
                borderColor: isSelected ? '#00E5FF' : 'rgba(255, 255, 255, 0.05)',
                backgroundColor: isSelected ? 'rgba(0, 229, 255, 0.05)' : 'rgba(255, 255, 255, 0.02)',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.04)',
                  borderColor: isSelected ? '#00E5FF' : 'rgba(255, 255, 255, 0.1)',
                  transform: 'translateX(4px)',
                },
              }}
              onClick={() => onEmbeddingSelect(embedding)}
            >
              <Stack direction="row" spacing={2} alignItems="center">
                {embedding.type === 'image' && embedding.imageUrl ? (
                  <Box
                    sx={{
                      width: 48,
                      height: 48,
                      borderRadius: '8px',
                      overflow: 'hidden',
                      flexShrink: 0,
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                    }}
                  >
                    <img
                      src={embedding.imageUrl}
                      alt={embedding.label}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                      }}
                    />
                  </Box>
                ) : (
                  <Box sx={{
                    width: 48,
                    height: 48,
                    borderRadius: '8px',
                    bgcolor: 'rgba(0, 229, 255, 0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    <Typography variant="h6" sx={{ opacity: 0.5, fontSize: '1rem' }}>T</Typography>
                  </Box>
                )}

                <Stack spacing={0.5} sx={{ flexGrow: 1, minWidth: 0 }}>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Typography
                      variant="subtitle2"
                      sx={{
                        fontWeight: 600,
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                      }}
                    >
                      {embedding.label}
                    </Typography>
                    <Chip
                      label={embedding.type.toUpperCase()}
                      size="small"
                      sx={{
                        height: 16,
                        px: 0,
                        '& .MuiChip-label': { px: 0.8, fontSize: '0.6rem' },
                        borderRadius: '4px',
                        fontWeight: 700,
                        bgcolor: embedding.type === 'text' ? alpha('#00E5FF', 0.1) : alpha('#CC00FF', 0.1),
                        color: embedding.type === 'text' ? '#00E5FF' : '#CC00FF',
                        border: '1px solid currentColor',
                      }}
                    />
                  </Stack>

                  <Typography
                    variant="caption"
                    sx={{
                      fontFamily: 'monospace',
                      fontSize: '0.65rem',
                      color: 'rgba(255, 255, 255, 0.4)',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}
                  >
                    {embedding.vector.slice(0, 4).map(v => v.toFixed(3)).join(' ')}...
                  </Typography>
                </Stack>

                {isSelected && (
                  <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#00E5FF', boxShadow: '0 0 8px #00E5FF' }} />
                )}
              </Stack>
            </Box>
          );
        })}
      </Stack>
    </Stack>
  );
};
