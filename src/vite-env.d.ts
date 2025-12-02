/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_OPENAI_API_KEY: string
  readonly VITE_SERPER_API_KEY?: string
  readonly VITE_BRAVE_API_KEY?: string
  readonly VITE_BING_API_KEY?: string
  readonly VITE_ALGOLIA_APP_ID?: string
  readonly VITE_ALGOLIA_API_KEY?: string
  readonly VITE_PINECONE_API_KEY?: string
  readonly VITE_ELASTICSEARCH_CLOUD_ID?: string
  readonly VITE_ELASTICSEARCH_API_KEY?: string
  readonly VITE_AZURE_SEARCH_ENDPOINT?: string
  readonly VITE_AZURE_SEARCH_KEY?: string
  readonly VITE_ANTHROPIC_API_KEY?: string
  readonly VITE_MIXPANEL_TOKEN?: string
  readonly VITE_AMPLITUDE_KEY?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
