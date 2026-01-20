import { Stack, Typography, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip, TextField, alpha } from '@mui/material';
import { findTopKSimilar } from '../utils/rerank';
import type { EmbeddingData } from '../types/embedding';

type RerankDisplayProps = {
  queryEmbedding: EmbeddingData;
  allEmbeddings: EmbeddingData[];
  topK: number;
  onTopKChange: (k: number) => void;
};

export const RerankDisplay = ({ queryEmbedding, allEmbeddings, topK, onTopKChange }: RerankDisplayProps) => {
  const results = findTopKSimilar(queryEmbedding, allEmbeddings, topK);

  if (results.length === 0) {
    return (
      <Box sx={{ p: 4, textAlign: 'center', opacity: 0.5 }}>
        <Typography variant="body1">
          Insufficient data points for comparative analysis.
        </Typography>
      </Box>
    );
  }

  return (
    <Stack spacing={3}>
      <Stack direction="row" spacing={2} justifyContent="space-between" alignItems="center">
        <Typography variant="h5" sx={{ fontWeight: 600 }}>
          Proximal Analysis: <span className="gradient-text">{queryEmbedding.label.substring(0, 30)}...</span>
        </Typography>
        <TextField
          type="number"
          label="Top K"
          value={topK}
          onChange={(e) => {
            const value = parseInt(e.target.value, 10);
            if (value > 0 && value <= allEmbeddings.length - 1) {
              onTopKChange(value);
            }
          }}
          inputProps={{ min: 1, max: allEmbeddings.length - 1 }}
          size="small"
          sx={{
            width: 100,
            '& .MuiOutlinedInput-root': {
              borderRadius: '12px',
              backgroundColor: 'rgba(255, 255, 255, 0.02)'
            }
          }}
        />
      </Stack>
      <TableContainer sx={{
        backgroundColor: 'transparent',
        border: '1px solid rgba(255, 255, 255, 0.05)',
        borderRadius: '16px',
        overflow: 'hidden'
      }}>
        <Table size="small">
          <TableHead>
            <TableRow sx={{ backgroundColor: 'rgba(255, 255, 255, 0.02)' }}>
              <TableCell sx={{ color: 'rgba(255, 255, 255, 0.5)', borderBottom: '1px solid rgba(255, 255, 255, 0.05)', fontWeight: 600 }}>RANK</TableCell>
              <TableCell sx={{ color: 'rgba(255, 255, 255, 0.5)', borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>ENTITY</TableCell>
              <TableCell sx={{ color: 'rgba(255, 255, 255, 0.5)', borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>MODALITY</TableCell>
              <TableCell align="right" sx={{ color: 'rgba(255, 255, 255, 0.5)', borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>SIMILARITY</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {results.map((result) => (
              <TableRow key={result.embedding.id} sx={{ '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.02)' } }}>
                <TableCell sx={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                  <Box sx={{
                    width: 28,
                    height: 28,
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    bgcolor: result.rank === 1 ? alpha('#00E5FF', 0.2) : 'rgba(255, 255, 255, 0.05)',
                    color: result.rank === 1 ? '#00E5FF' : 'inherit',
                    fontWeight: 700,
                    fontSize: '0.75rem'
                  }}>
                    {result.rank}
                  </Box>
                </TableCell>
                <TableCell sx={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)', fontWeight: 500 }}>{result.embedding.label}</TableCell>
                <TableCell sx={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                  <Chip
                    label={result.embedding.type.toUpperCase()}
                    size="small"
                    sx={{
                      borderRadius: '6px',
                      fontSize: '0.65rem',
                      fontWeight: 700,
                      bgcolor: result.embedding.type === 'text' ? alpha('#00E5FF', 0.1) : alpha('#CC00FF', 0.1),
                      color: result.embedding.type === 'text' ? '#00E5FF' : '#CC00FF',
                      border: '1px solid currentColor',
                    }}
                  />
                </TableCell>
                <TableCell align="right" sx={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)', color: '#00E5FF', fontWeight: 600 }}>
                  {result.cosineSimilarity.toFixed(4)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Stack>
  );
};
