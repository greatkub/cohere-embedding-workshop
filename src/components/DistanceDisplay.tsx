import { Stack, Typography, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { calculateDistances } from '../utils/distance';
import type { EmbeddingData } from '../types/embedding';

type DistanceDisplayProps = {
  embeddings: EmbeddingData[];
};

export const DistanceDisplay = ({ embeddings }: DistanceDisplayProps) => {
  if (embeddings.length < 2) {
    return (
      <Box sx={{ p: 4, textAlign: 'center', opacity: 0.5 }}>
        <Typography variant="body1">
          Accumulate at least 2 latent projections to analyze pairwise metrics.
        </Typography>
      </Box>
    );
  }

  const distances = calculateDistances(embeddings);

  return (
    <Stack spacing={3}>
      <Typography variant="h5" sx={{ fontWeight: 600 }}>Pairwise Analytics</Typography>
      <TableContainer sx={{
        backgroundColor: 'transparent',
        border: '1px solid rgba(255, 255, 255, 0.05)',
        borderRadius: '16px',
        overflow: 'hidden'
      }}>
        <Table size="small">
          <TableHead>
            <TableRow sx={{ backgroundColor: 'rgba(255, 255, 255, 0.02)' }}>
              <TableCell sx={{ color: 'rgba(255, 255, 255, 0.5)', borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>Node A</TableCell>
              <TableCell sx={{ color: 'rgba(255, 255, 255, 0.5)', borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>Node B</TableCell>
              <TableCell align="right" sx={{ color: 'rgba(255, 255, 255, 0.5)', borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>Cosine Similarity</TableCell>
              <TableCell align="right" sx={{ color: 'rgba(255, 255, 255, 0.5)', borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>Euclidean Distance</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {distances.map((distance, index) => {
              const emb1 = embeddings.find(e => e.id === distance.embedding1Id);
              const emb2 = embeddings.find(e => e.id === distance.embedding2Id);
              return (
                <TableRow key={index} sx={{ '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.02)' } }}>
                  <TableCell sx={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)', fontWeight: 500 }}>{emb1?.label || 'Unknown'}</TableCell>
                  <TableCell sx={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)', fontWeight: 500 }}>{emb2?.label || 'Unknown'}</TableCell>
                  <TableCell align="right" sx={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)', color: '#00E5FF', fontWeight: 600 }}>
                    {distance.cosineSimilarity.toFixed(4)}
                  </TableCell>
                  <TableCell align="right" sx={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)', color: '#CC00FF' }}>
                    {distance.euclideanDistance.toFixed(4)}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Stack>
  );
};
