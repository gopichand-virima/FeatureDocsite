# 🔐 GitHub Secrets Setup Guide

## Critical: Your OpenAI API Key Was Disabled

If you received an email that your OpenAI API key was disabled, it's likely because:
1. The key was exposed in your GitHub repository (committed to git)
2. The key was used by unauthorized users
3. OpenAI detected suspicious activity

**Action Required**: You need to set up GitHub Secrets to securely manage your API keys.

---

## 🚀 Quick Setup (5 Minutes)

### Step 1: Generate New OpenAI API Key

1. Go to https://platform.openai.com/api-keys
2. Click **"Create new secret key"**
3. Copy the key (starts with `sk-`)
4. **Important**: Save it immediately - you won't see it again!

### Step 2: Add Secret to GitHub

1. Go to your GitHub repository: `https://github.com/[your-username]/FeatureDocsite`
2. Click **Settings** (top menu)
3. Click **Secrets and variables** → **Actions** (left sidebar)
4. Click **New repository secret**
5. Fill in:
   - **Name**: `VITE_OPENAI_API_KEY`
   - **Secret**: Paste your new OpenAI API key (starts with `sk-`)
6. Click **Add secret**

### Step 3: Verify Workflow is Updated

The workflows (`.github/workflows/deploy.yml` and `.github/workflows/test.yml`) have been updated to use GitHub Secrets. They will automatically inject the secret during build.

### Step 4: Test the Setup

1. Push a commit to trigger the workflow
2. Check the **Actions** tab in GitHub
3. The build should complete successfully
4. Your API key will be available in the built site

---

## 📋 Complete Secret List

Add these secrets to GitHub if you're using these features:

| Secret Name | Required | Description |
|------------|----------|-------------|
| `VITE_OPENAI_API_KEY` | ✅ **YES** | OpenAI API key for AI chat features |
| `VITE_ANTHROPIC_API_KEY` | ❌ Optional | Anthropic Claude (fallback AI) |
| `VITE_ALGOLIA_APP_ID` | ❌ Optional | Algolia search app ID |
| `VITE_ALGOLIA_API_KEY` | ❌ Optional | Algolia search API key |
| `VITE_PINECONE_API_KEY` | ❌ Optional | Pinecone vector database |
| `VITE_SERPER_API_KEY` | ❌ Optional | Serper web search |
| `VITE_BRAVE_API_KEY` | ❌ Optional | Brave search API |
| `VITE_BING_API_KEY` | ❌ Optional | Bing search API |

**Minimum Required**: Only `VITE_OPENAI_API_KEY` is required for basic AI features.

---

## 🔒 How It Works

### During Build (GitHub Actions)

1. GitHub Actions workflow runs
2. Secrets are injected as environment variables
3. Vite reads `VITE_*` environment variables
4. Variables are baked into the JavaScript bundle
5. Site is deployed to GitHub Pages

### Security Note

⚠️ **Important**: Since this is a static site (GitHub Pages), the API key will be in the client-side JavaScript bundle. This is acceptable for:
- Public documentation sites
- Read-only API access
- Public-facing applications

**For maximum security**, consider:
- Using a backend proxy (API routes)
- Implementing rate limiting
- Using domain restrictions in OpenAI dashboard

---

## 🛡️ Security Best Practices

### ✅ DO

- ✅ Use GitHub Secrets for all API keys
- ✅ Rotate keys periodically (every 90 days)
- ✅ Use different keys for dev/prod
- ✅ Monitor API usage in OpenAI dashboard
- ✅ Set spending limits in OpenAI dashboard
- ✅ Use domain restrictions if possible

### ❌ DON'T

- ❌ Never commit `.env` files
- ❌ Never hardcode keys in source code
- ❌ Never share keys in chat/email
- ❌ Never use the same key for multiple projects
- ❌ Never commit keys to public repos

---

## 🔄 If Your Key Was Disabled

### Immediate Actions

1. **Revoke the old key** in OpenAI dashboard (if still accessible)
2. **Generate a new key** from https://platform.openai.com/api-keys
3. **Add new key to GitHub Secrets** (see Step 2 above)
4. **Check git history** - if key was committed, it's compromised
5. **Monitor usage** - check for unauthorized access

### Check Git History

```bash
# Search git history for exposed keys
git log --all --full-history -p | grep -i "sk-"

# If found, the key is compromised and should be revoked
```

### Update Local Development

1. Create `.env` file in project root:
   ```env
   VITE_OPENAI_API_KEY=sk-your-new-key-here
   ```
2. Restart dev server: `npm run dev`

---

## 🧪 Testing Locally

### Setup Local Environment

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Edit `.env` and add your API key:
   ```env
   VITE_OPENAI_API_KEY=sk-your-actual-key-here
   ```

3. Start dev server:
   ```bash
   npm run dev
   ```

4. Test AI features - they should work now!

### Verify Configuration

Check browser console (F12) - you should NOT see:
- ❌ `API key invalid`
- ❌ `401 Unauthorized`
- ❌ `sk-` in any error messages

---

## 📊 Monitoring API Usage

### OpenAI Dashboard

1. Go to https://platform.openai.com/usage
2. Monitor:
   - Daily usage
   - Cost per day
   - Requests per day
   - Error rate

### Set Spending Limits

1. Go to https://platform.openai.com/account/billing/limits
2. Set monthly spending limit
3. Set per-request limits
4. Enable email alerts

---

## 🚨 Troubleshooting

### Problem: "API key invalid" in production

**Solution**:
1. Verify GitHub Secret is set correctly
2. Check secret name: `VITE_OPENAI_API_KEY` (exact match)
3. Verify workflow is injecting the secret (check Actions logs)
4. Ensure key hasn't been revoked

### Problem: API works locally but not in production

**Solution**:
1. Check GitHub Secrets are set
2. Verify workflow uses `env:` section
3. Check build logs for environment variable injection
4. Verify `VITE_` prefix is used

### Problem: Key was exposed in git history

**Solution**:
1. **Immediately revoke** the key in OpenAI dashboard
2. Generate new key
3. Add to GitHub Secrets
4. Consider using `git-filter-repo` to remove from history (advanced)

---

## ✅ Verification Checklist

Before deploying:

- [ ] New OpenAI API key generated
- [ ] Key added to GitHub Secrets (`VITE_OPENAI_API_KEY`)
- [ ] `.env` file created locally (not committed)
- [ ] `.env` is in `.gitignore` (already done)
- [ ] Workflows updated to use secrets (already done)
- [ ] Test build locally with `.env`
- [ ] Push to GitHub and verify build succeeds
- [ ] Test AI features on deployed site
- [ ] Set spending limits in OpenAI dashboard
- [ ] Monitor API usage for first few days

---

## 📚 Additional Resources

- **OpenAI API Keys**: https://platform.openai.com/api-keys
- **GitHub Secrets**: https://docs.github.com/en/actions/security-guides/encrypted-secrets
- **Vite Environment Variables**: https://vitejs.dev/guide/env-and-mode.html
- **OpenAI Usage Dashboard**: https://platform.openai.com/usage
- **OpenAI Billing Limits**: https://platform.openai.com/account/billing/limits

---

## 🎯 Summary

1. ✅ **Generate new OpenAI API key** (old one is disabled)
2. ✅ **Add to GitHub Secrets** as `VITE_OPENAI_API_KEY`
3. ✅ **Create `.env` file locally** for development
4. ✅ **Workflows are already configured** to use secrets
5. ✅ **Push to GitHub** - secrets will be injected automatically
6. ✅ **Monitor usage** and set spending limits

**Your API key is now secure and will work from GitHub without being exposed!**

---

**Last Updated**: After fixing exposed API key issue
**Status**: ✅ Secure - Using GitHub Secrets

