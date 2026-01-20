import { useState } from 'react';
import { Stack, TextField, Button, Typography, alpha } from '@mui/material';
import { useCohereEmbedding } from '../hooks/useCohereEmbedding';
import type { EmbeddingData } from '../types/embedding';

type TextEmbedderProps = {
  onEmbeddingCreated: (embedding: EmbeddingData) => void;
};

export const TextEmbedder = ({ onEmbeddingCreated }: TextEmbedderProps) => {
  const [text, setText] = useState('');
  const { embedText, loading, error } = useCohereEmbedding();

  const onEmbed = async () => {
    if (!text.trim()) return;

    try {
      const embedding = await embedText(text);
      if (embedding && embedding.vector && embedding.vector.length > 0) {
        onEmbeddingCreated(embedding);
        setText('');
      } else {
        console.error('Invalid embedding received');
      }
    } catch (err) {
      console.error('Failed to embed text:', err);
    }
  };

  return (
    <Stack spacing={2}>
      <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '1.1rem' }}>
        Text-to-Vector
      </Typography>
      <TextField
        placeholder="Enter descriptive text..."
        multiline
        rows={2}
        value={text}
        onChange={(e) => setText(e.target.value)}
        disabled={loading}
        fullWidth
        sx={{
          '& .MuiOutlinedInput-root': {
            backgroundColor: 'rgba(255, 255, 255, 0.02)',
            borderRadius: '12px',
            fontSize: '0.9rem',
            '&.Mui-focused': {
              boxShadow: `0 0 15px ${alpha('#00E5FF', 0.1)}`,
            }
          }
        }}
      />
      <Button
        variant="contained"
        onClick={onEmbed}
        disabled={loading || !text.trim()}
        fullWidth
        size="small"
        sx={{
          py: 0.8,
          fontSize: '0.85rem',
          borderRadius: '10px',
          background: 'linear-gradient(135deg, #00E5FF 0%, #CC00FF 100%)',
          textTransform: 'none',
          '&:hover': {
            boxShadow: '0 0 20px rgba(0, 229, 255, 0.3)',
          }
        }}
      >
        {loading ? 'Processing...' : 'Project to Vector Space'}
      </Button>
      {error && (
        <Typography color="error" variant="caption" sx={{ textAlign: 'center' }}>
          {error}
        </Typography>
      )}
    </Stack>
  );
};
