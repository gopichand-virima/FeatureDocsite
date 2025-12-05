/**
 * OpenAI Service - GPT-4 Integration for Conversational AI
 * Handles all OpenAI API interactions including chat completions and embeddings
 */

import { SearchConfig } from '../config';

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface ChatCompletionResponse {
  answer: string;
  usage: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
  model: string;
}

export interface EmbeddingResponse {
  embedding: number[];
  usage: {
    totalTokens: number;
  };
}

class OpenAIService {
  private apiKey: string;
  private baseURL = 'https://api.openai.com/v1';

  constructor() {
    this.apiKey = SearchConfig.openai.apiKey;
  }

  /**
   * Generate embeddings for text using OpenAI's embedding model
   */
  async createEmbedding(text: string): Promise<EmbeddingResponse> {
    try {
      const response = await fetch(`${this.baseURL}/embeddings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model: SearchConfig.openai.embeddingModel,
          input: text,
        }),
      });

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.statusText}`);
      }

      const data = await response.json();
      return {
        embedding: data.data[0].embedding,
        usage: {
          totalTokens: data.usage.total_tokens,
        },
      };
    } catch (error) {
      console.error('OpenAI Embedding Error:', error);
      throw error;
    }
  }

  /**
   * Generate chat completion using GPT-4o with unlimited token support
   * Auto-continues if response is truncated (finish_reason === 'length')
   */
  async createChatCompletion(
    messages: ChatMessage[],
    temperature?: number
  ): Promise<ChatCompletionResponse> {
    try {
      let fullAnswer = '';
      let totalPromptTokens = 0;
      let totalCompletionTokens = 0;
      let continuations = 0;
      let currentMessages = [...messages];

      while (continuations <= (SearchConfig.openai.maxContinuations || 3)) {
        const response = await fetch(`${this.baseURL}/chat/completions`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.apiKey}`,
          },
          body: JSON.stringify({
            model: SearchConfig.openai.model,
            messages: currentMessages,
            max_tokens: SearchConfig.openai.maxTokens,
            temperature: temperature ?? SearchConfig.openai.temperature,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(`OpenAI API error: ${response.statusText} - ${JSON.stringify(errorData)}`);
        }

        const data = await response.json();
        const content = data.choices[0].message.content;
        const finishReason = data.choices[0].finish_reason;

        fullAnswer += content;
        totalPromptTokens += data.usage.prompt_tokens;
        totalCompletionTokens += data.usage.completion_tokens;

        // If response is complete, return it
        if (finishReason === 'stop') {
          return {
            answer: fullAnswer,
            usage: {
              promptTokens: totalPromptTokens,
              completionTokens: totalCompletionTokens,
              totalTokens: totalPromptTokens + totalCompletionTokens,
            },
            model: data.model,
          };
        }

        // If truncated due to length and continuation is enabled, continue
        if (finishReason === 'length' && SearchConfig.openai.enableContinuation) {
          continuations++;
          console.log(`Response truncated, continuing (${continuations}/${SearchConfig.openai.maxContinuations})...`);
          
          // Add the partial response and ask to continue
          currentMessages = [
            ...currentMessages,
            { role: 'assistant', content: content },
            { role: 'user', content: 'Please continue from where you left off.' },
          ];
        } else {
          // Finished for other reasons or continuation disabled
          return {
            answer: fullAnswer,
            usage: {
              promptTokens: totalPromptTokens,
              completionTokens: totalCompletionTokens,
              totalTokens: totalPromptTokens + totalCompletionTokens,
            },
            model: data.model,
          };
        }
      }

      // Max continuations reached, return what we have
      console.warn(`Max continuations (${SearchConfig.openai.maxContinuations}) reached. Response may be incomplete.`);
      return {
        answer: fullAnswer,
        usage: {
          promptTokens: totalPromptTokens,
          completionTokens: totalCompletionTokens,
          totalTokens: totalPromptTokens + totalCompletionTokens,
        },
        model: SearchConfig.openai.model,
      };
    } catch (error) {
      console.error('OpenAI Chat Completion Error:', error);
      throw error;
    }
  }

  /**
   * Generate conversational answer with documentation context (RAG)
   */
  async generateAnswer(
    query: string,
    documentationContext: string[],
    conversationHistory: ChatMessage[] = []
  ): Promise<string> {
    const systemPrompt = `You are Virima's AI Documentation Assistant. You help users understand Virima's features, configuration, and best practices.

You have access to the following documentation context:
${documentationContext.map((doc, i) => `[${i + 1}] ${doc}`).join('\n\n')}

Instructions:
- Provide accurate, helpful answers based on the documentation context
- If information is not in the context, acknowledge this and suggest where to look
- Include source citations using [1], [2], etc. format
- Be conversational and friendly
- Provide code examples when relevant
- For troubleshooting, offer step-by-step guidance`;

    const messages: ChatMessage[] = [
      { role: 'system', content: systemPrompt },
      ...conversationHistory,
      { role: 'user', content: query },
    ];

    const response = await this.createChatCompletion(messages);
    return response.answer;
  }

  /**
   * Generate conversational answer with both documentation and web search context
   * Enhanced for "Search Web" mode with real-time external information
   * 
   * Note: This uses external web search APIs (Serper, Brave, Bing) to retrieve
   * real-time web results, then leverages GPT-4o's AI capabilities to synthesize
   * comprehensive responses. This is the recommended approach since OpenAI's
   * native browsing tool was deprecated.
   * 
   * The AI processes both internal documentation and external web sources to
   * provide accurate, up-to-date answers with proper source citations.
   */
  async generateAnswerWithWebSearch(
    query: string,
    documentationContext: string[],
    webResults: Array<{ title: string; url: string; description: string; domain: string }>,
    conversationHistory: ChatMessage[] = []
  ): Promise<string> {
    const webContext = webResults.length > 0
      ? `\n\nExternal Web Resources (Real-time search results):\n${webResults.map((result, i) => 
          `[Web ${i + 1}] ${result.title}\nURL: ${result.url}\nDescription: ${result.description}\nDomain: ${result.domain}`
        ).join('\n\n')}`
      : '';

    const systemPrompt = `You are Virima's AI Documentation Assistant with access to both internal documentation and real-time web search results. You help users understand Virima's features, configuration, best practices, and industry standards.

You have access to the following documentation context:
${documentationContext.map((doc, i) => `[${i + 1}] ${doc}`).join('\n\n')}${webContext}

Instructions:
- Provide comprehensive answers combining internal documentation and external web resources
- Prioritize internal Virima documentation when available
- Use web results to provide context on industry standards, latest updates, or third-party references
- Always cite sources: use [1], [2], etc. for documentation and [Web 1], [Web 2], etc. for web results
- Include actual URLs from web results when referencing external sources
- Be conversational and friendly
- Provide code examples when relevant
- For troubleshooting, offer step-by-step guidance
- If web results are provided, acknowledge them and explain how they relate to the question
- NEVER fabricate or guess URLs - only use URLs provided in the web results`;

    const messages: ChatMessage[] = [
      { role: 'system', content: systemPrompt },
      ...conversationHistory,
      { role: 'user', content: query },
    ];

    const response = await this.createChatCompletion(messages);
    return response.answer;
  }

  /**
   * Transcribe audio using Whisper API
   */
  async transcribeAudio(audioBlob: Blob): Promise<string> {
    try {
      const formData = new FormData();
      formData.append('file', audioBlob, 'audio.webm');
      formData.append('model', SearchConfig.whisper.model);

      const response = await fetch(`${this.baseURL}/audio/transcriptions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Whisper API error: ${response.statusText}`);
      }

      const data = await response.json();
      return data.text;
    } catch (error) {
      console.error('Whisper Transcription Error:', error);
      throw error;
    }
  }

  /**
   * Check if OpenAI is configured and available
   */
  isConfigured(): boolean {
    return this.apiKey !== 'YOUR_OPENAI_API_KEY' && this.apiKey.length > 0;
  }
}

export const openAIService = new OpenAIService();
