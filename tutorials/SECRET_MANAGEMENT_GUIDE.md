# Secret Key Management Guide

## 🔒 Security Best Practices

This guide explains how to securely manage API keys and secrets in the FeatureDocsite project.

---

## ⚠️ Critical Security Issue Fixed

**Previous Issue**: OpenAI API key was hardcoded in `src/lib/search/config.ts`
**Status**: ✅ **FIXED** - Hardcoded key removed, now uses environment variables only

---

## 📋 Table of Contents

1. [Quick Setup](#quick-setup)
2. [Local Development](#local-development)
3. [GitHub Secrets (CI/CD)](#github-secrets-cicd)
4. [Production Deployment](#production-deployment)
5. [Security Checklist](#security-checklist)

---

## 🚀 Quick Setup

### Step 1: Create Environment File

```bash
# Copy the example file
cp .env.example .env
```

### Step 2: Add Your API Keys

Edit `.env` file and add your actual API keys:

```env
VITE_OPENAI_API_KEY=sk-your-actual-openai-api-key-here
VITE_ANTHROPIC_API_KEY=your-anthropic-key
# ... other keys as needed
```

### Step 3: Verify .gitignore

Ensure `.env` is in `.gitignore` (already included):

```gitignore
.env
.env.local
.env*.local
```

---

## 💻 Local Development

### Environment Variables

The project uses **Vite**, which requires the `VITE_` prefix for environment variables.

**File**: `.env` (create in project root)

```env
# Required for AI features
VITE_OPENAI_API_KEY=sk-your-openai-api-key

# Optional - only if using these features
VITE_ANTHROPIC_API_KEY=your-anthropic-key
VITE_ALGOLIA_APP_ID=your-algolia-app-id
VITE_ALGOLIA_API_KEY=your-algolia-key
VITE_PINECONE_API_KEY=your-pinecone-key
VITE_SERPER_API_KEY=your-serper-key
VITE_BRAVE_API_KEY=your-brave-key
VITE_BING_API_KEY=your-bing-key
```

### How It Works

1. Vite automatically loads `.env` files
2. Variables prefixed with `VITE_` are exposed to client code
3. Access via `import.meta.env.VITE_OPENAI_API_KEY`
4. `.env` is gitignored and never committed

### Testing Locally

```bash
# Start dev server
npm run dev

# The app will automatically use variables from .env
```

---

## 🔐 GitHub Secrets (CI/CD)

For GitHub Actions workflows, use **GitHub Secrets**:

### Step 1: Add Secrets to GitHub

1. Go to your repository on GitHub
2. Navigate to **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Add each secret:

| Secret Name | Value | Description |
|------------|-------|-------------|
| `VITE_OPENAI_API_KEY` | `sk-...` | OpenAI API key for AI features |
| `VITE_ANTHROPIC_API_KEY` | `...` | Anthropic Claude key (optional) |
| `VITE_ALGOLIA_API_KEY` | `...` | Algolia search key (optional) |
| `VITE_PINECONE_API_KEY` | `...` | Pinecone vector DB key (optional) |

### Step 2: Update GitHub Workflows

The workflows need to inject secrets as environment variables. Update `.github/workflows/deploy.yml`:

```yaml
- name: Build project
  run: npm run build
  env:
    VITE_OPENAI_API_KEY: ${{ secrets.VITE_OPENAI_API_KEY }}
    VITE_ANTHROPIC_API_KEY: ${{ secrets.VITE_ANTHROPIC_API_KEY }}
    # ... other secrets
```

### Step 3: Update test.yml

Similarly update `.github/workflows/test.yml`:

```yaml
- name: Build project
  run: npm run build
  env:
    VITE_OPENAI_API_KEY: ${{ secrets.VITE_OPENAI_API_KEY }}
```

---

## 🌐 Production Deployment

### Option 1: GitHub Pages (Current Setup)

**For GitHub Pages**, environment variables need special handling since it's a static site:

1. **Build-time injection**: Secrets are injected during build in GitHub Actions
2. **Client-side access**: Variables are baked into the JavaScript bundle
3. **Security note**: `VITE_` variables are exposed in the client bundle

**Recommendation**: For production, consider:
- Using a backend proxy for API calls (more secure)
- Or accepting that API keys will be in the client bundle (acceptable for public docs)

### Option 2: Backend Proxy (More Secure)

For better security, create a backend API that:
1. Stores API keys server-side
2. Proxies requests to OpenAI
3. Never exposes keys to client

**Example structure**:
```
Client → Your Backend API → OpenAI API
```

---

## ✅ Security Checklist

### Before Committing

- [ ] ✅ No API keys in source code
- [ ] ✅ `.env` file exists and is in `.gitignore`
- [ ] ✅ `.env.example` exists with placeholder values
- [ ] ✅ All hardcoded keys removed from config files
- [ ] ✅ GitHub Secrets configured (if using CI/CD)

### Regular Maintenance

- [ ] Rotate API keys periodically
- [ ] Monitor API usage for unexpected activity
- [ ] Review GitHub Actions logs for exposed secrets
- [ ] Update `.env.example` when adding new keys

### If API Key is Compromised

1. **Immediately revoke** the key in OpenAI dashboard
2. **Generate new key** from OpenAI platform
3. **Update** `.env` file with new key
4. **Update** GitHub Secrets with new key
5. **Review** git history - if key was committed, consider it compromised
6. **Monitor** usage for unauthorized access

---

## 📝 Current Configuration

### File: `src/lib/search/config.ts`

**Before (INSECURE)**:
```typescript
apiKey: getEnv('NEXT_PUBLIC_OPENAI_API_KEY') || 'sk-proj-hardcoded-key-here',
```

**After (SECURE)**:
```typescript
apiKey: getEnv('VITE_OPENAI_API_KEY') || getEnv('NEXT_PUBLIC_OPENAI_API_KEY') || '',
```

### Environment Variable Priority

1. `VITE_OPENAI_API_KEY` (Vite standard)
2. `NEXT_PUBLIC_OPENAI_API_KEY` (fallback for compatibility)
3. Empty string (fails gracefully if not set)

---

## 🔧 Troubleshooting

### Problem: API key not working

**Solution**:
1. Check `.env` file exists in project root
2. Verify variable name: `VITE_OPENAI_API_KEY` (not `OPENAI_API_KEY`)
3. Restart dev server after changing `.env`
4. Check browser console for errors

### Problem: "API key invalid" error

**Solution**:
1. Verify key is correct in OpenAI dashboard
2. Check if key has been revoked/disabled
3. Ensure key has proper permissions
4. Generate new key if needed

### Problem: Keys not loading in production

**Solution**:
1. Verify GitHub Secrets are set correctly
2. Check workflow logs for environment variable injection
3. Ensure `VITE_` prefix is used
4. Verify build process includes env variables

---

## 🎯 Best Practices

### ✅ DO

- ✅ Use environment variables for all secrets
- ✅ Keep `.env` in `.gitignore`
- ✅ Use `.env.example` as template
- ✅ Rotate keys periodically
- ✅ Use GitHub Secrets for CI/CD
- ✅ Monitor API usage

### ❌ DON'T

- ❌ Never commit `.env` files
- ❌ Never hardcode API keys in source code
- ❌ Never share API keys in chat/email
- ❌ Never use the same key for dev/prod
- ❌ Never commit keys to public repos

---

## 📚 Additional Resources

- **OpenAI API Keys**: https://platform.openai.com/api-keys
- **Vite Environment Variables**: https://vitejs.dev/guide/env-and-mode.html
- **GitHub Secrets**: https://docs.github.com/en/actions/security-guides/encrypted-secrets
- **Environment Variables Best Practices**: https://12factor.net/config

---

## 🔄 Migration from Hardcoded Keys

If you had hardcoded keys (like the OpenAI key that was disabled):

1. ✅ **Removed** hardcoded key from `config.ts`
2. ✅ **Created** `.env.example` template
3. ✅ **Updated** `.gitignore` to exclude `.env`
4. ✅ **Updated** config to use environment variables only
5. ⏳ **Next**: Add your new API key to `.env` file
6. ⏳ **Next**: Add key to GitHub Secrets for CI/CD

---

**Last Updated**: After removing hardcoded OpenAI API key
**Status**: ✅ Secure - All keys now use environment variables

