import { CohereClient } from 'cohere-ai';

const API_KEY_STORAGE_KEY = 'cohere_api_key';

export const getStoredApiKey = (): string => {
  return localStorage.getItem(API_KEY_STORAGE_KEY) || import.meta.env.VITE_COHERE_API_KEY || '';
};

export const setStoredApiKey = (apiKey: string) => {
  localStorage.setItem(API_KEY_STORAGE_KEY, apiKey);
};

export const createCohereClient = () => {
  const apiKey = getStoredApiKey();
  if (!apiKey) {
    return null;
  }
  return new CohereClient({ token: apiKey });
};
