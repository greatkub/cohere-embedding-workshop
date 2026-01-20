import type { EmbeddingData, DistanceMetric } from '../types/embedding';

export const calculateCosineSimilarity = (vec1: number[], vec2: number[]): number => {
  if (vec1.length !== vec2.length) {
    throw new Error('Vectors must have the same length');
  }

  let dotProduct = 0;
  let norm1 = 0;
  let norm2 = 0;

  for (let i = 0; i < vec1.length; i++) {
    dotProduct += vec1[i] * vec2[i];
    norm1 += vec1[i] * vec1[i];
    norm2 += vec2[i] * vec2[i];
  }

  const denominator = Math.sqrt(norm1) * Math.sqrt(norm2);
  if (denominator === 0) return 0;

  return dotProduct / denominator;
};

export const calculateEuclideanDistance = (vec1: number[], vec2: number[]): number => {
  if (vec1.length !== vec2.length) {
    throw new Error('Vectors must have the same length');
  }

  let sumSquaredDiffs = 0;
  for (let i = 0; i < vec1.length; i++) {
    const diff = vec1[i] - vec2[i];
    sumSquaredDiffs += diff * diff;
  }

  return Math.sqrt(sumSquaredDiffs);
};

export const calculateDistances = (embeddings: EmbeddingData[]): DistanceMetric[] => {
  const distances: DistanceMetric[] = [];

  for (let i = 0; i < embeddings.length; i++) {
    for (let j = i + 1; j < embeddings.length; j++) {
      const embedding1 = embeddings[i];
      const embedding2 = embeddings[j];

      const cosineSimilarity = calculateCosineSimilarity(embedding1.vector, embedding2.vector);
      const euclideanDistance = calculateEuclideanDistance(embedding1.vector, embedding2.vector);

      distances.push({
        embedding1Id: embedding1.id,
        embedding2Id: embedding2.id,
        cosineSimilarity,
        euclideanDistance,
      });
    }
  }

  return distances;
};
