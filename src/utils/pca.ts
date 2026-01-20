import { PCA } from 'ml-pca';
import type { EmbeddingData } from '../types/embedding';

export type Point3D = [number, number, number];

export const reduceTo3D = (embeddings: EmbeddingData[]): Point3D[] => {
  if (embeddings.length === 0) return [];

  // Filter out embeddings with empty vectors
  const validEmbeddings = embeddings.filter(emb => emb.vector && emb.vector.length > 0);
  
  if (validEmbeddings.length === 0) return [];

  if (validEmbeddings.length === 1) {
    // If only one embedding, return origin
    return [[0, 0, 0]];
  }

  // Extract vectors as matrix (rows = embeddings, cols = dimensions)
  const matrix = validEmbeddings.map(emb => emb.vector);

  // Check if all vectors have the same dimension
  const dimensions = matrix.map(v => v.length);
  const firstDim = dimensions[0];
  if (!dimensions.every(d => d === firstDim)) {
    console.warn('Vectors have different dimensions, using first dimension:', firstDim);
  }

  try {
    // Perform PCA
    const pca = new PCA(matrix);
    
    // Project to 3D
    const reduced = pca.predict(matrix, { nComponents: 3 });
    
    // Convert to array of [x, y, z] tuples
    return reduced.to2DArray() as Point3D[];
  } catch (error) {
    console.error('PCA reduction failed:', error);
    // Fallback: use first 3 dimensions of each vector
    return matrix.map(v => [v[0] || 0, v[1] || 0, v[2] || 0] as Point3D);
  }
};
