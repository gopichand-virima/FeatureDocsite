# AI Configuration Guide

## OpenAI Integration Status

✅ **ChatGPT API is now active** with GPT-4o model

### Current Configuration

The system is configured with:
- **Model**: GPT-4o (latest and most capable)
- **Max Tokens**: 2000
- **Temperature**: 0.7 (balanced creativity/accuracy)
- **Embedding Model**: text-embedding-3-large

### Features Enabled

1. **Intelligent Chat Responses**
   - Context-aware answers based on documentation
   - Conversational memory (last 3 exchanges)
   - Source citations with links
   - Fallback handling if API fails

2. **Voice Search (Whisper)**
   - Speech-to-text transcription
   - Supports multiple audio formats
   - Same API key used for consistency

3. **RAG (Retrieval-Augmented Generation)**
   - Searches documentation database
   - Searches web (if configured)
   - Combines results with GPT-4o
   - Provides accurate, grounded responses

### Visual Indicators

- **Chat Panel Header**: Shows "GPT-4 Active" badge when configured
- **Green Status Dot**: Indicates AI assistant is online
- **Loading States**: Shows when AI is generating responses

### How It Works

1. User sends a message
2. System searches documentation and web
3. Results are sent to GPT-4o as context
4. AI generates natural, conversational response
5. Sources are attached for verification
6. Response is displayed with formatting

### API Key Security

⚠️ **Important Security Note**:
- API key is currently set in `/lib/search/config.ts`
- For production, use environment variable: `NEXT_PUBLIC_OPENAI_API_KEY`
- Never commit API keys to version control
- Consider using server-side API routes for added security

### Testing the Integration

1. Open the chat panel
2. Look for the "GPT-4" badge in the header
3. Ask a question about Virima
4. AI should respond with contextual, helpful answers

### Troubleshooting

**Problem**: No AI responses, getting fallback text
**Solution**: Check browser console for API errors

**Problem**: "API key invalid" error
**Solution**: Verify the API key is valid and has credits

**Problem**: Slow responses
**Solution**: Normal for GPT-4o, responses take 2-5 seconds

**Problem**: Generic responses without sources
**Solution**: This is fallback mode - check if documentation search is working

### Cost Estimation

- GPT-4o: ~$5 per 1M input tokens, ~$15 per 1M output tokens
- Typical conversation: ~500-1500 tokens per exchange
- Estimated cost: $0.01-0.03 per conversation
- Voice transcription (Whisper): $0.006 per minute

### Next Steps

Consider adding:
- Rate limiting for API calls
- Caching frequently asked questions
- Analytics to track AI usage
- User feedback on response quality
- A/B testing different prompts
