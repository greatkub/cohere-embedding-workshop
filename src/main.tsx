import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './App';

const apiKey = import.meta.env.VITE_COHERE_API_KEY;
if (!apiKey) {
  console.warn('VITE_COHERE_API_KEY is not set. Please create a .env file with your Cohere API key.');
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
