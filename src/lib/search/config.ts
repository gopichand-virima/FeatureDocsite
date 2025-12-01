/**
 * Ultra-Premium Search Configuration
 * Centralized configuration for all search and AI services
 * 
 * SECURITY: All API keys must be set via environment variables.
 * Never hardcode API keys in this file.
 * 
 * Setup:
 * 1. Copy .env.example to .env
 * 2. Add your API keys to .env
 * 3. .env is gitignored and will not be committed
 */

// Safe environment variable access for Vite
// Vite exposes env variables via import.meta.env with VITE_ prefix
const getEnv = (key: string): string | undefined => {
  // Try Vite environment variable first (import.meta.env.VITE_*)
  if (typeof import !== 'undefined' && import.meta && import.meta.env) {
    const viteKey = key.replace('NEXT_PUBLIC_', 'VITE_');
    const value = (import.meta.env as any)[viteKey];
    if (value) return value;
  }
  
  // Fallback to window (for runtime injection, if needed)
  if (typeof window !== 'undefined') {
    const windowValue = (window as any)[key];
    if (windowValue) return windowValue;
  }
  
  return undefined;
};

export const SearchConfig = {
  // OpenAI Configuration - UNRESTRICTED TOKEN ALLOCATION
  // SECURITY: API key must be set via VITE_OPENAI_API_KEY environment variable
  openai: {
    apiKey: getEnv('VITE_OPENAI_API_KEY') || getEnv('NEXT_PUBLIC_OPENAI_API_KEY') || '',
    model: 'gpt-4o',
    embeddingModel: 'text-embedding-3-large',
    maxTokens: 16000, // Maximum for GPT-4o - ensures complete responses
    temperature: 0.7,
    enableContinuation: true, // Auto-continue if response is truncated
    maxContinuations: 3, // Allow up to 3 continuation calls for very long responses
  },

  // Anthropic Claude Configuration
  anthropic: {
    apiKey: getEnv('VITE_ANTHROPIC_API_KEY') || getEnv('NEXT_PUBLIC_ANTHROPIC_API_KEY') || '',
    model: 'claude-3-opus-20240229',
    maxTokens: 4000,
  },

  // Algolia Configuration
  algolia: {
    appId: getEnv('VITE_ALGOLIA_APP_ID') || getEnv('NEXT_PUBLIC_ALGOLIA_APP_ID') || '',
    apiKey: getEnv('VITE_ALGOLIA_API_KEY') || getEnv('NEXT_PUBLIC_ALGOLIA_API_KEY') || '',
    indexName: 'virima_documentation',
  },

  // Pinecone Vector Database Configuration
  pinecone: {
    apiKey: getEnv('VITE_PINECONE_API_KEY') || getEnv('NEXT_PUBLIC_PINECONE_API_KEY') || '',
    environment: 'us-west1-gcp',
    indexName: 'virima-docs-embeddings',
    dimension: 3072, // text-embedding-3-large dimension
  },

  // Elasticsearch Configuration
  elasticsearch: {
    cloudId: getEnv('VITE_ELASTICSEARCH_CLOUD_ID') || getEnv('NEXT_PUBLIC_ELASTICSEARCH_CLOUD_ID') || '',
    apiKey: getEnv('VITE_ELASTICSEARCH_API_KEY') || getEnv('NEXT_PUBLIC_ELASTICSEARCH_API_KEY') || '',
    indexName: 'virima-documentation',
  },

  // Web Search APIs
  webSearch: {
    // Serper API for real-time web results
    serper: {
      apiKey: getEnv('VITE_SERPER_API_KEY') || getEnv('NEXT_PUBLIC_SERPER_API_KEY') || '',
      endpoint: 'https://google.serper.dev/search',
    },
    // Brave Search API
    brave: {
      apiKey: getEnv('VITE_BRAVE_API_KEY') || getEnv('NEXT_PUBLIC_BRAVE_API_KEY') || '',
      endpoint: 'https://api.search.brave.com/res/v1/web/search',
    },
    // Bing Search API
    bing: {
      apiKey: getEnv('VITE_BING_API_KEY') || getEnv('NEXT_PUBLIC_BING_API_KEY') || '',
      endpoint: 'https://api.bing.microsoft.com/v7.0/search',
    },
  },

  // Azure Cognitive Search
  azure: {
    endpoint: getEnv('VITE_AZURE_SEARCH_ENDPOINT') || getEnv('NEXT_PUBLIC_AZURE_SEARCH_ENDPOINT') || '',
    apiKey: getEnv('VITE_AZURE_SEARCH_KEY') || getEnv('NEXT_PUBLIC_AZURE_SEARCH_KEY') || '',
    indexName: 'virima-cognitive-search',
  },

  // OpenAI Whisper for Voice Search
  // Uses same API key as OpenAI (set via VITE_OPENAI_API_KEY)
  whisper: {
    apiKey: getEnv('VITE_OPENAI_API_KEY') || getEnv('NEXT_PUBLIC_OPENAI_API_KEY') || '',
    model: 'whisper-1',
  },

  // Analytics
  analytics: {
    mixpanel: {
      token: getEnv('VITE_MIXPANEL_TOKEN') || getEnv('NEXT_PUBLIC_MIXPANEL_TOKEN') || '',
    },
    amplitude: {
      apiKey: getEnv('VITE_AMPLITUDE_KEY') || getEnv('NEXT_PUBLIC_AMPLITUDE_KEY') || '',
    },
  },

  // Feature Flags
  features: {
    useOpenAI: true,
    useClaude: false, // Fallback to Claude if OpenAI fails
    useAlgolia: false, // Use Algolia for enterprise search
    usePinecone: false, // Use vector search
    useElasticsearch: false, // Use Elasticsearch
    useWebSearch: true, // Enable web search
    useVoiceSearch: true, // Enable voice input
    useVisualSearch: false, // Enable image search (future)
    useCollaboration: false, // Enable real-time collaboration (future)
    useAnalytics: true, // Track search analytics
  },

  // Performance
  performance: {
    searchTimeout: 5000, // 5 seconds
    cacheEnabled: true,
    cacheTTL: 3600, // 1 hour
    maxRetries: 3,
    edgeComputing: false, // Use Cloudflare Workers (future)
  },

  // Security
  security: {
    rateLimitPerMinute: 60,
    enableAuditLog: true,
    sanitizeInput: true,
    enablePIIDetection: false, // Detect and redact PII (future)
  },
};

export type SearchConfigType = typeof SearchConfig;
