# GitHub Secrets Setup Guide

## 🔒 Secure API Key Management for GitHub Actions

This guide explains how to securely store your OpenAI API key and other sensitive credentials for GitHub Actions deployment.

---

## Quick Setup (5 Minutes)

### Step 1: Go to Repository Settings

1. Open your GitHub repository
2. Click **Settings** (top right)
3. In the left sidebar, click **Secrets and variables** → **Actions**

### Step 2: Add Repository Secrets

Click **New repository secret** and add each secret:

#### Required Secret

```
Name:  VITE_OPENAI_API_KEY
Value: your_openai_api_key_here
```

**⚠️ IMPORTANT**: Replace `your_openai_api_key_here` with your actual OpenAI API key from your `.env` file

#### Optional Secrets (for web search features)

```
Name:  VITE_SERPER_API_KEY
Value: (your Serper API key)

Name:  VITE_BRAVE_API_KEY
Value: (your Brave Search API key)

Name:  VITE_BING_API_KEY
Value: (your Bing Search API key)
```

### Step 3: Verify Secrets Are Saved

You should see your secrets listed (values are hidden for security):
- ✅ VITE_OPENAI_API_KEY
- ✅ VITE_SERPER_API_KEY (optional)
- ✅ VITE_BRAVE_API_KEY (optional)
- ✅ VITE_BING_API_KEY (optional)

---

## How It Works

### Local Development

Your `.env` file is used:
```bash
# .env (gitignored - never committed)
VITE_OPENAI_API_KEY=sk-proj-...
```

### GitHub Actions / CI/CD

The workflow file (`.github/workflows/deploy.yml`) uses GitHub Secrets:
```yaml
env:
  VITE_OPENAI_API_KEY: ${{ secrets.VITE_OPENAI_API_KEY }}
```

---

## Security Checklist

- [x] **.env is gitignored** - Confirmed in `.gitignore`
- [x] **No hardcoded keys** - All keys use environment variables
- [x] **GitHub Secrets configured** - Keys stored securely in GitHub
- [x] **.env.example provided** - Template without actual keys
- [x] **Deployment workflow configured** - Uses GitHub Secrets

---

## File Structure

```
📁 Your Repository
├── .env                          # ❌ NEVER COMMIT (gitignored)
├── .env.example                  # ✅ Safe template
├── .gitignore                    # ✅ Excludes .env files
├── .github/
│   └── workflows/
│       └── deploy.yml           # ✅ Uses GitHub Secrets
└── lib/search/config.ts         # ✅ Reads from env vars
```

---

## Testing Your Setup

### 1. Verify Local Development

```bash
# Start dev server
npm run dev

# Open browser and test:
# - Speech-to-text (mic icon in search)
# - GPT-4o chat responses
```

### 2. Verify GitHub Actions

Push to main branch and check:
1. Go to **Actions** tab in GitHub
2. Click on the latest workflow run
3. Verify build completes successfully
4. Check logs don't show API keys (they'll show `***`)

---

## Important Notes

### ⚠️ Never Expose API Keys

- ❌ Don't commit `.env` to Git
- ❌ Don't hardcode keys in code
- ❌ Don't share keys in screenshots
- ❌ Don't log keys to console

### ✅ Best Practices

- ✅ Use environment variables
- ✅ Use GitHub Secrets for CI/CD
- ✅ Rotate keys periodically
- ✅ Use different keys for dev/prod
- ✅ Monitor API usage in OpenAI dashboard

---

## Rotating Your API Key

If your key is ever exposed:

### 1. Revoke Old Key
1. Go to [OpenAI API Keys](https://platform.openai.com/api-keys)
2. Find the exposed key
3. Click **Revoke**

### 2. Generate New Key
1. Click **Create new secret key**
2. Copy the new key immediately (you won't see it again)

### 3. Update Everywhere
- Update `.env` locally
- Update GitHub Secrets
- Update any deployment platform (Vercel, Netlify, etc.)

### 4. Redeploy
```bash
git push origin main
```

---

## Deployment Platforms

### Vercel

1. Go to your Vercel project
2. Settings → Environment Variables
3. Add `VITE_OPENAI_API_KEY`
4. Redeploy

### Netlify

1. Site Settings → Environment Variables
2. Add `VITE_OPENAI_API_KEY`
3. Trigger new deploy

### AWS / Custom

Add to your deployment environment configuration:
```bash
export VITE_OPENAI_API_KEY="sk-proj-..."
```

---

## Troubleshooting

### "OpenAI Whisper API is not configured"

**Cause**: Environment variable not loaded

**Fix**:
```bash
# 1. Check .env exists
ls -la .env

# 2. Verify content
cat .env

# 3. Restart dev server
npm run dev
```

### GitHub Actions Build Fails

**Cause**: Secret not configured

**Fix**:
1. Go to Settings → Secrets and variables → Actions
2. Verify `VITE_OPENAI_API_KEY` exists
3. Re-run workflow

---

## Additional Resources

- [OpenAI API Keys](https://platform.openai.com/api-keys)
- [GitHub Secrets Documentation](https://docs.github.com/en/actions/security-guides/encrypted-secrets)
- [Vite Environment Variables](https://vitejs.dev/guide/env-and-mode.html)

---

## Support

If you need help:
1. Check the troubleshooting section above
2. Verify all files match this guide
3. Test locally first, then GitHub Actions
4. Monitor OpenAI usage for unexpected charges

---

**✅ Your API key is now securely managed!**