import { calculateCosineSimilarity } from './distance';
import type { EmbeddingData } from '../types/embedding';

export type RerankResult = {
  embedding: EmbeddingData;
  cosineSimilarity: number;
  rank: number;
};

export const findTopKSimilar = (
  queryEmbedding: EmbeddingData,
  allEmbeddings: EmbeddingData[],
  k: number = 5
): RerankResult[] => {
  // Filter out the query embedding itself
  const otherEmbeddings = allEmbeddings.filter(emb => emb.id !== queryEmbedding.id);
  
  // Calculate similarity for all other embeddings
  const results: RerankResult[] = otherEmbeddings.map(emb => {
    const cosineSimilarity = calculateCosineSimilarity(queryEmbedding.vector, emb.vector);
    return {
      embedding: emb,
      cosineSimilarity,
      rank: 0, // Will be set after sorting
    };
  });

  // Sort by cosine similarity (descending - higher is more similar)
  results.sort((a, b) => b.cosineSimilarity - a.cosineSimilarity);

  // Assign ranks and return top K
  return results.slice(0, k).map((result, index) => ({
    ...result,
    rank: index + 1,
  }));
};
