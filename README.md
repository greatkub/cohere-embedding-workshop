# Cohere Embedding Visualizer

A React application that visualizes embeddings from Cohere's v4 embedding model. Embed text and images, view their vector representations, and explore their relationships in an interactive 3D vector space with similarity search and reranking capabilities.

## Features

### 🎯 Core Functionality

- **Text Embedding**: Embed any text using Cohere's `embed-v4.0` model
- **Image Embedding**: Upload and embed images (PNG, JPEG, WebP, GIF)
- **Vector Display**: View raw embedding vectors (1536 dimensions)
- **3D Visualization**: Interactive 3D plot showing embeddings reduced from 1536D to 3D using PCA
- **Distance Metrics**: Calculate and display cosine similarity and Euclidean distance between embeddings
- **Similarity Search & Reranking**: Click any embedding to find the top K most similar embeddings
- **Visual Highlighting**: Selected embeddings and their top K matches are highlighted in the 3D space

### 🎨 Interactive Features

- **Click to Focus**: Select any embedding to see its most similar matches
- **Adjustable Top K**: Customize how many similar embeddings to display (default: 5)
- **3D Navigation**: Rotate, zoom, and pan the 3D visualization
- **Multiple Embeddings**: Stack as many embeddings as you want and compare them all
- **Real-time Reranking**: Instantly see similarity rankings when you select an embedding

## Tech Stack

- **React 19** - Modern React with latest features
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and dev server
- **Material-UI (MUI)** - Modern UI components
- **Plotly.js** - Interactive 3D visualizations
- **Cohere AI SDK** - Embedding API integration
- **ml-pca** - Dimensionality reduction (1536D → 3D)

## Prerequisites

- Node.js 18+ and npm
- Cohere API key ([Get one here](https://dashboard.cohere.com/api-keys))

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd poc-cohere-embedding
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory:
```bash
cp .env.example .env
```

4. Add your Cohere API key to `.env`:
```
VITE_COHERE_API_KEY=your_cohere_api_key_here
```

## Usage

1. Start the development server:
```bash
npm run dev
```

2. Open your browser to `http://localhost:3000`

3. **Embed Text**:
   - Enter text in the "Embed Text" field
   - Click "Embed Text"
   - The embedding vector will be displayed

4. **Embed Images**:
   - Click "Select Image" and choose an image file
   - Click "Embed Image"
   - The embedding vector will be displayed

5. **View in 3D**:
   - All embeddings automatically appear in the 3D visualization
   - Use mouse to rotate, zoom, and pan
   - Blue circles = text embeddings
   - Purple diamonds = image embeddings

6. **Similarity Search**:
   - Click any embedding in the list to select it
   - View the top K most similar embeddings in the rerank table
   - See highlighted connections in the 3D visualization
   - Adjust the "Top K" value to show more or fewer results

7. **Distance Metrics**:
   - When you have 2+ embeddings, see distance metrics table
   - Compare cosine similarity and Euclidean distance between all pairs

## Project Structure

```
poc-cohere-embedding/
├── src/
│   ├── components/
│   │   ├── TextEmbedder.tsx       # Text input and embedding
│   │   ├── ImageEmbedder.tsx      # Image upload and embedding
│   │   ├── EmbeddingDisplay.tsx   # Display embedding vectors
│   │   ├── VectorSpace3D.tsx       # 3D visualization
│   │   ├── DistanceDisplay.tsx    # Distance metrics table
│   │   └── RerankDisplay.tsx     # Top K similarity results
│   ├── hooks/
│   │   └── useCohereEmbedding.ts  # Cohere API integration
│   ├── utils/
│   │   ├── distance.ts            # Cosine similarity & Euclidean distance
│   │   ├── pca.ts                 # PCA dimensionality reduction
│   │   └── rerank.ts              # Top K similarity search
│   ├── types/
│   │   └── embedding.ts           # TypeScript types
│   ├── styles/
│   │   └── App.css                # Global styles
│   ├── App.tsx                    # Main app component
│   └── main.tsx                   # Entry point
├── .env.example                   # Environment variables template
├── package.json
└── README.md
```

## How It Works

1. **Embedding Generation**: 
   - Text or images are sent to Cohere's `embed-v4.0` API
   - Returns 1536-dimensional embedding vectors

2. **Dimensionality Reduction**:
   - High-dimensional vectors (1536D) are reduced to 3D using Principal Component Analysis (PCA)
   - Preserves as much variance as possible for visualization

3. **Similarity Calculation**:
   - Cosine similarity measures the angle between vectors (higher = more similar)
   - Euclidean distance measures straight-line distance (lower = more similar)

4. **Reranking**:
   - When an embedding is selected, all other embeddings are ranked by cosine similarity
   - Top K results are displayed and highlighted in the 3D visualization

## API Configuration

The app uses Cohere's `embed-v4.0` model with:
- **Model**: `embed-v4.0` (multimodal - supports text and images)
- **Output Dimension**: 1536 (default)
- **Embedding Type**: Float vectors

## Build for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## Development

```bash
# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Notes

- The API key is used in the frontend (stored in `.env` file)
- PCA reduction may lose some information but provides good visualization
- Distance calculations use both cosine similarity and Euclidean distance
- The app supports unlimited embeddings - add as many as you want!

## License

This is a proof-of-concept project for exploring Cohere embeddings and vector space visualization.
