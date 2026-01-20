import { useState } from 'react';
import { Stack, Button, Typography, Box } from '@mui/material';
import { useCohereEmbedding } from '../hooks/useCohereEmbedding';
import type { EmbeddingData } from '../types/embedding';

type ImageEmbedderProps = {
  onEmbeddingCreated: (embedding: EmbeddingData) => void;
};

export const ImageEmbedder = ({ onEmbeddingCreated }: ImageEmbedderProps) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const { embedImage, loading, error } = useCohereEmbedding();

  const onFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onEmbed = async () => {
    if (!selectedFile || !preview) return;

    try {
      const embedding = await embedImage(preview, selectedFile.name, preview);
      if (embedding && embedding.vector && embedding.vector.length > 0) {
        onEmbeddingCreated(embedding);
        setSelectedFile(null);
        setPreview(null);
      } else {
        console.error('Invalid embedding received');
      }
    } catch (err) {
      console.error('Failed to embed image:', err);
    }
  };

  const loadSample = async () => {
    try {
      const response = await fetch('/ani.webp');
      const blob = await response.blob();
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
        setSelectedFile(new File([blob], 'ani.webp', { type: 'image/webp' }));
      };
      reader.readAsDataURL(blob);
    } catch (err) {
      console.error('Failed to load sample image:', err);
    }
  };

  return (
    <Stack spacing={2}>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '1.1rem' }}>
          Image-to-Vector
        </Typography>
        <Button
          size="small"
          variant="text"
          onClick={loadSample}
          sx={{
            fontSize: '0.7rem',
            opacity: 0.6,
            '&:hover': { opacity: 1, color: '#00E5FF' }
          }}
        >
          Use Sample
        </Button>
      </Stack>

      <Box
        component="label"
        sx={{
          height: 80,
          border: '1px dashed rgba(255, 255, 255, 0.1)',
          borderRadius: '12px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          backgroundColor: 'rgba(255, 255, 255, 0.02)',
          position: 'relative',
          overflow: 'hidden',
          '&:hover': {
            borderColor: '#00E5FF',
            backgroundColor: 'rgba(0, 229, 255, 0.05)',
          },
        }}
      >
        <input type="file" hidden accept="image/*" onChange={onFileSelect} />

        {preview ? (
          <Box
            component="img"
            src={preview}
            sx={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              position: 'absolute',
              top: 0,
              left: 0,
              opacity: 0.4,
            }}
          />
        ) : null}

        <Typography variant="caption" color="text.secondary" sx={{ zIndex: 1, fontWeight: 500, px: 2, textAlign: 'center' }}>
          {selectedFile ? selectedFile.name : 'Select or drag visual data'}
        </Typography>
      </Box>

      <Button
        variant="contained"
        onClick={onEmbed}
        disabled={loading || !selectedFile}
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
        {loading ? 'Analyzing...' : 'Project Image to Vector'}
      </Button>

      {error && (
        <Typography color="error" variant="caption" sx={{ textAlign: 'center' }}>
          {error}
        </Typography>
      )}
    </Stack>
  );
};
