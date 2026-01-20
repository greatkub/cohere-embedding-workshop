import Plot from 'react-plotly.js';
import { Typography, Box, alpha } from '@mui/material';
import { reduceTo3D, type Point3D } from '../utils/pca';
import type { EmbeddingData } from '../types/embedding';

type VectorSpace3DProps = {
  embeddings: EmbeddingData[];
  selectedEmbeddingId?: string;
  topKIds?: string[];
};

export const VectorSpace3D = ({ embeddings, selectedEmbeddingId, topKIds = [] }: VectorSpace3DProps) => {
  const validEmbeddings = embeddings.filter(emb => emb.vector && emb.vector.length > 0);

  const points3D = reduceTo3D(validEmbeddings);

  if (validEmbeddings.length === 0) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', opacity: 0.5 }}>
        <Typography variant="body1">
          Awaiting vector data for multidimensional mapping...
        </Typography>
      </Box>
    );
  }

  const textEmbeddings = validEmbeddings.filter(e => e.type === 'text');
  const imageEmbeddings = validEmbeddings.filter(e => e.type === 'image');

  const plotData: any[] = [];

  const getPointsForEmbeddings = (embList: EmbeddingData[]) => {
    return embList.map((emb) => {
      const idx = validEmbeddings.findIndex(e => e.id === emb.id);
      return points3D[idx];
    }).filter((p): p is Point3D => p !== undefined);
  };

  // Traces Configuration
  const traces = [
    {
      list: textEmbeddings.filter(e => e.id !== selectedEmbeddingId && !topKIds.includes(e.id)),
      name: 'Text Latent',
      color: '#00E5FF',
      symbol: 'circle',
      size: 8,
      opacity: 0.4
    },
    {
      list: imageEmbeddings.filter(e => e.id !== selectedEmbeddingId && !topKIds.includes(e.id)),
      name: 'Image Latent',
      color: '#CC00FF',
      symbol: 'diamond',
      size: 8,
      opacity: 0.4
    },
    {
      list: validEmbeddings.filter(e => topKIds.includes(e.id) && e.id !== selectedEmbeddingId),
      name: 'Proximal Match',
      color: '#FFFFFF',
      symbol: 'circle',
      size: 12,
      opacity: 1,
      line: { color: '#00E5FF', width: 2 }
    }
  ];

  traces.forEach(t => {
    const pts = getPointsForEmbeddings(t.list);
    if (pts.length > 0) {
      plotData.push({
        x: pts.map(p => p[0]),
        y: pts.map(p => p[1]),
        z: pts.map(p => p[2]),
        mode: 'markers',
        type: 'scatter3d',
        name: t.name,
        text: t.list.map(e => e.label.substring(0, 40)),
        hoverinfo: 'text',
        marker: {
          size: t.size,
          color: t.color,
          symbol: t.symbol,
          opacity: t.opacity,
          line: (t as any).line
        },
      });
    }
  });

  const selectedEmb = validEmbeddings.find(e => e.id === selectedEmbeddingId);
  if (selectedEmb) {
    const pt = getPointsForEmbeddings([selectedEmb])[0];
    if (pt) {
      plotData.push({
        x: [pt[0]],
        y: [pt[1]],
        z: [pt[2]],
        mode: 'markers',
        type: 'scatter3d',
        name: 'Selected Node',
        text: [selectedEmb.label],
        hoverinfo: 'text',
        marker: {
          size: 18,
          color: '#00E5FF',
          symbol: 'circle',
          line: { color: '#FFFFFF', width: 3 },
          boxshadow: '0 0 20px #00E5FF'
        },
      });

      // Lines to top K
      topKIds.forEach((id, index) => {
        const topKIdx = validEmbeddings.findIndex(e => e.id === id);
        if (topKIdx !== -1) {
          const topKPt = points3D[topKIdx];
          if (topKPt) {
            const isNearest = index === 0;
            plotData.push({
              x: [pt[0], topKPt[0]],
              y: [pt[1], topKPt[1]],
              z: [pt[2], topKPt[2]],
              mode: 'lines',
              type: 'scatter3d',
              name: isNearest ? 'Primary Relation' : 'Secondary Relation',
              line: {
                color: isNearest ? '#FFFFFF' : alpha('#00E5FF', 0.5),
                width: isNearest ? 6 : 3,
                dash: isNearest ? 'solid' : 'dot'
              },
              showlegend: false,
              hoverinfo: 'skip',
            });
          }
        }
      });
    }
  }

  const layout = {
    paper_bgcolor: 'rgba(0,0,0,0)',
    plot_bgcolor: 'rgba(0,0,0,0)',
    font: { family: 'Inter', color: 'rgba(255,255,255,0.5)' },
    scene: {
      xaxis: {
        gridcolor: 'rgba(255,255,255,0.05)',
        zerolinecolor: 'rgba(255,255,255,0.1)',
        backgroundcolor: 'rgba(0,0,0,0)',
        showbackground: false
      },
      yaxis: {
        gridcolor: 'rgba(255,255,255,0.05)',
        zerolinecolor: 'rgba(255,255,255,0.1)',
        backgroundcolor: 'rgba(0,0,0,0)',
        showbackground: false
      },
      zaxis: {
        gridcolor: 'rgba(255,255,255,0.05)',
        zerolinecolor: 'rgba(255,255,255,0.1)',
        backgroundcolor: 'rgba(0,0,0,0)',
        showbackground: false
      },
      camera: { eye: { x: 1.8, y: 1.8, z: 1.8 } },
    },
    margin: { l: 0, r: 0, t: 0, b: 0 },
    legend: {
      x: 0.8,
      y: 0.95,
      bgcolor: 'transparent',
      font: { size: 10 }
    },
    autosize: true
  };

  return (
    <Box sx={{ width: '100%', height: '100%', position: 'relative' }}>
      <Box sx={{ position: 'absolute', top: 0, left: 0, zIndex: 1, pointerEvents: 'none' }}>
        <Typography variant="h5" sx={{ fontWeight: 600 }}>Vector Projection</Typography>
        <Typography variant="caption" sx={{ opacity: 0.5 }}>1536D ⮕ 3D PCA RECONSTRUCTION</Typography>
      </Box>
      <Plot
        data={plotData}
        layout={layout as any}
        config={{ displaylogo: false, responsive: true }}
        style={{ width: '100%', height: '100%' }}
      />
    </Box>
  );
};
