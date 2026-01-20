export type EmbeddingType = 'text' | 'image';

export type EmbeddingData = {
  id: string;
  label: string;
  vector: number[];
  type: EmbeddingType;
  timestamp: number;
  imageUrl?: string; // Data URL for image embeddings
};

export type DistanceMetric = {
  embedding1Id: string;
  embedding2Id: string;
  cosineSimilarity: number;
  euclideanDistance: number;
};
