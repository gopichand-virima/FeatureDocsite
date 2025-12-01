# Real Web Search API Configuration Guide

## 🎯 Principle

**"The 'Search Web' function must execute a live query against a real search engine, returning only authentic URLs from the response payload — the AI must never generate, guess, or fabricate any reference link."**

## Current Status

✅ **Web Search Service**: Fully implemented with real API integration  
⚠️ **API Keys**: Not yet configured (system will show honest "no results" message)  
✅ **Fallback Behavior**: System transparently states when APIs are unavailable

## Supported Search Engines

The system supports three real-time web search APIs:

### 1. **Serper API** (Recommended - Google Search Results)
- **Website**: https://serper.dev
- **Pricing**: 2,500 free searches, then $50/month for 10,000 searches
- **Quality**: Excellent (uses Google's index)
- **Response Time**: ~500ms

### 2. **Brave Search API**
- **Website**: https://brave.com/search/api/
- **Pricing**: Free tier: 2,000 queries/month, paid from $3/month
- **Quality**: Good (independent index)
- **Response Time**: ~300ms

### 3. **Bing Web Search API** (Microsoft Azure)
- **Website**: https://azure.microsoft.com/en-us/services/cognitive-services/bing-web-search-api/
- **Pricing**: Free tier: 1,000 queries/month, S1: $7/1000 queries
- **Quality**: Excellent (Microsoft's index)
- **Response Time**: ~400ms

## Step-by-Step Configuration

### Option 1: Serper API (Easiest & Recommended)

1. **Sign up for Serper**
   - Go to https://serper.dev
   - Click "Get API Key"
   - Verify email and get your key

2. **Add to Configuration**
   - Open `/lib/search/config.ts`
   - Find the `webSearch.serper` section
   - Replace with your key:
   ```typescript
   serper: {
     apiKey: 'YOUR_SERPER_API_KEY_HERE',
     endpoint: 'https://google.serper.dev/search',
   }
   ```

3. **Test**
   - Open the search dialog
   - Click "Search Web" tab
   - Search for "Virima CMDB"
   - You should see real Google search results

### Option 2: Brave Search API

1. **Get Brave API Key**
   - Go to https://brave.com/search/api/
   - Click "Get Started"
   - Complete registration
   - Generate API key

2. **Configure**
   ```typescript
   brave: {
     apiKey: 'YOUR_BRAVE_API_KEY_HERE',
     endpoint: 'https://api.search.brave.com/res/v1/web/search',
   }
   ```

### Option 3: Bing Search API

1. **Azure Setup**
   - Go to https://portal.azure.com
   - Create "Bing Search v7" resource
   - Get subscription key

2. **Configure**
   ```typescript
   bing: {
     apiKey: 'YOUR_BING_API_KEY_HERE',
     endpoint: 'https://api.bing.microsoft.com/v7.0/search',
   }
   ```

## How It Works

### Without API Keys (Current State)
```
User searches "network discovery"
  ↓
System checks: webSearchService.isConfigured()
  ↓
Returns: false
  ↓
Shows honest message: "Web search APIs not configured"
  ↓
Displays: "No results - APIs required"
```

### With API Keys Configured
```
User searches "network discovery"
  ↓
System makes parallel calls to all configured APIs:
  → Serper API (Google results)
  → Brave API (Brave results)
  → Bing API (Bing results)
  ↓
Receives real URLs from search engines
  ↓
Deduplicates by URL
  ↓
Sorts by domain priority (virima.com first)
  ↓
Displays real, clickable links with:
  - Title (from search engine)
  - URL (from search engine)
  - Description (from search engine)
  - Domain (extracted from URL)
```

## Verification Checklist

### ✅ URL Authenticity Checks

- [ ] Every URL comes from a real search API response
- [ ] No URLs are hardcoded or fabricated
- [ ] All links are clickable and lead to real pages
- [ ] Titles and descriptions match actual web content
- [ ] If APIs fail, system shows honest error message
- [ ] No "example.com" or placeholder links ever displayed

### ✅ Code Verification

**File**: `/lib/search/services/web-search-service.ts`

Key functions:
```typescript
// Real API call to Serper
private async searchSerper(query: string): Promise<WebSearchResult[]>

// Real API call to Brave
private async searchBrave(query: string): Promise<WebSearchResult[]>

// Real API call to Bing
private async searchBing(query: string): Promise<WebSearchResult[]>

// Aggregates real results from all APIs
async search(query: string): Promise<WebSearchResponse>
```

**File**: `/components/AISearchDialogSimplified.tsx`

```typescript
// Calls real web search service
async function performWebSearch(query: string): Promise<WebResult[]> {
  if (!webSearchService.isConfigured()) {
    return []; // Honest: no fake results
  }
  
  const searchResponse = await webSearchService.search(query, 6);
  return searchResponse.results; // Only real URLs
}
```

## Testing the Integration

### 1. Without API Keys (Current State)

**Expected Behavior**:
```
Search: "Virima documentation"
Result: "No web results available
         Web search requires API configuration..."
```

### 2. With One API Key Configured

**Expected Behavior**:
```
Search: "Virima documentation"
Result: 3-6 real URLs from the configured search engine
        Each link is clickable and leads to actual content
```

### 3. With Multiple API Keys

**Expected Behavior**:
```
Search: "Virima documentation"
Result: 6-10 deduplicated URLs from multiple search engines
        Higher quality and more comprehensive results
```

## Cost Analysis

### Recommended Setup for Production

**Serper API**: $50/month
- 10,000 searches per month
- ~333 searches per day
- ~14 searches per hour
- Perfect for medium-traffic documentation sites

**Expected Usage**:
- Average: 50-200 web searches per day
- Cost: ~$5-20/month actual usage
- Budget: $50/month with plenty of headroom

### Cost-Effective Alternative

**Brave API**: $3/month
- 3,000 searches per month
- Good for low-medium traffic
- Independent search results

### Free Tier Testing

All three APIs offer free tiers:
- Serper: 2,500 free searches (one-time)
- Brave: 2,000 queries/month (recurring)
- Bing: 1,000 queries/month (recurring)

## Fallback Strategy

The system is designed with honest fallback:

1. **All APIs Configured**: Best experience, multiple sources
2. **One API Configured**: Good experience, single source
3. **No APIs Configured**: System transparently states this
4. **API Fails/Rate Limited**: Shows error, doesn't fabricate
5. **No Results Found**: Honestly states "no results found"

## Security Best Practices

### Current Setup (Development)
```typescript
// Direct in config.ts
apiKey: 'YOUR_API_KEY_HERE'
```

### Recommended (Production)
```typescript
// Use environment variables
apiKey: getEnv('NEXT_PUBLIC_SERPER_API_KEY') || 'fallback'
```

### Environment Variables
```bash
# .env.local
NEXT_PUBLIC_SERPER_API_KEY=your_serper_key
NEXT_PUBLIC_BRAVE_API_KEY=your_brave_key
NEXT_PUBLIC_BING_API_KEY=your_bing_key
```

## Monitoring & Analytics

Track web search usage:
```typescript
// In analytics service
trackWebSearch({
  query: string,
  resultsCount: number,
  source: 'serper' | 'brave' | 'bing',
  responseTime: number,
  success: boolean
})
```

## Support & Troubleshooting

### Issue: "No web results" message appears

**Cause**: API keys not configured  
**Solution**: Follow setup guide above

### Issue: "API error" in console

**Cause**: Invalid API key or rate limit exceeded  
**Solution**: Check API key validity, check usage quota

### Issue: Slow response times

**Cause**: Multiple API calls in parallel  
**Solution**: Normal - system searches multiple engines for quality

### Issue: Duplicate results

**Cause**: Same URL found by multiple engines  
**Solution**: Already handled - system deduplicates by URL

## Quick Start (5 Minutes)

1. **Sign up**: Go to https://serper.dev → Get API Key
2. **Copy key**: Copy the API key provided
3. **Configure**: Open `/lib/search/config.ts`
4. **Paste**: Replace `'YOUR_SERPER_API_KEY'` with your key
5. **Test**: Search "Virima CMDB" in the web search tab
6. **Verify**: All links should be real and clickable

## Complete Configuration Example

```typescript
// /lib/search/config.ts
webSearch: {
  serper: {
    apiKey: 'abc123xyz789...', // Your real Serper key
    endpoint: 'https://google.serper.dev/search',
  },
  brave: {
    apiKey: 'def456uvw012...', // Your real Brave key (optional)
    endpoint: 'https://api.search.brave.com/res/v1/web/search',
  },
  bing: {
    apiKey: 'ghi789rst345...', // Your real Bing key (optional)
    endpoint: 'https://api.bing.microsoft.com/v7.0/search',
  },
}
```

## Summary

✅ **System is ready** - just needs API keys  
✅ **No fake URLs** - system only shows real search results  
✅ **Honest fallback** - transparently states when unavailable  
✅ **Multiple sources** - aggregates from multiple engines  
✅ **Quality assured** - all URLs verified by real search engines  

Configure one API (5 minutes) → Get real web search results!
