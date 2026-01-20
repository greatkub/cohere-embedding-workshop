import { useState } from 'react';
import type { EmbeddingData } from '../types/embedding';
import { createCohereClient } from '../utils/cohere';

const getCohereClient = () => {
  const client = createCohereClient();
  if (!client) {
    throw new Error('Cohere API Key is not set. Please set it in Settings.');
  }
  return client;
};

export const useCohereEmbedding = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const embedText = async (text: string, label?: string): Promise<EmbeddingData> => {
    setLoading(true);
    setError(null);

    try {
      const cohere = getCohereClient();
      const response = await cohere.embed({
        texts: [text],
        model: 'embed-v4.0',
        inputType: 'search_document',
        embeddingTypes: ['float'],
      });

      // Handle different response structures
      let vector: number[] = [];
      
      if (response.embeddings) {
        if (typeof response.embeddings === 'object' && 'float' in response.embeddings) {
          const floatEmbeddings = (response.embeddings as { float?: number[][] }).float;
          if (floatEmbeddings && floatEmbeddings.length > 0) {
            vector = floatEmbeddings[0];
          }
        } else if (Array.isArray(response.embeddings) && response.embeddings.length > 0) {
          const firstEmbedding = response.embeddings[0];
          if (Array.isArray(firstEmbedding)) {
            vector = firstEmbedding;
          }
        }
      }

      if (vector.length === 0) {
        throw new Error('No embedding vector received from API');
      }
      
      const embedding: EmbeddingData = {
        id: `text-${Date.now()}-${Math.random()}`,
        label: label || `Text: ${text.substring(0, 50)}${text.length > 50 ? '...' : ''}`,
        vector,
        type: 'text',
        timestamp: Date.now(),
      };

      setLoading(false);
      return embedding;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to embed text';
      setError(errorMessage);
      setLoading(false);
      throw err;
    }
  };

  const embedImage = async (imageDataUrl: string, label?: string, imageUrl?: string): Promise<EmbeddingData> => {
    setLoading(true);
    setError(null);

    try {
      const cohere = getCohereClient();
      const response = await cohere.embed({
        images: [imageDataUrl],
        model: 'embed-v4.0',
        inputType: 'image',
        embeddingTypes: ['float'],
      });

      // Handle different response structures
      let vector: number[] = [];
      
      if (response.embeddings) {
        if (typeof response.embeddings === 'object' && 'float' in response.embeddings) {
          const floatEmbeddings = (response.embeddings as { float?: number[][] }).float;
          if (floatEmbeddings && floatEmbeddings.length > 0) {
            vector = floatEmbeddings[0];
          }
        } else if (Array.isArray(response.embeddings) && response.embeddings.length > 0) {
          const firstEmbedding = response.embeddings[0];
          if (Array.isArray(firstEmbedding)) {
            vector = firstEmbedding;
          }
        }
      }

      if (vector.length === 0) {
        throw new Error('No embedding vector received from API');
      }
      
      const embedding: EmbeddingData = {
        id: `image-${Date.now()}-${Math.random()}`,
        label: label || `Image: ${new Date().toLocaleTimeString()}`,
        vector,
        type: 'image',
        timestamp: Date.now(),
        imageUrl: imageUrl || imageDataUrl, // Store the image URL for preview
      };

      setLoading(false);
      return embedding;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to embed image';
      setError(errorMessage);
      setLoading(false);
      throw err;
    }
  };

  return {
    embedText,
    embedImage,
    loading,
    error,
  };
};
