# 🔐 API Key Security Guide

## ⚠️ CRITICAL SECURITY ALERT

**The API key you shared in our conversation has been compromised and MUST be revoked immediately.**

---

## 📋 Table of Contents

1. [Immediate Actions Required](#immediate-actions-required)
2. [Why This Matters](#why-this-matters)
3. [What Went Wrong](#what-went-wrong)
4. [Secure Configuration](#secure-configuration)
5. [Platform-Specific Setup](#platform-specific-setup)
6. [Verification](#verification)
7. [Best Practices](#best-practices)
8. [What We Fixed](#what-we-fixed)

---

## 🚨 Immediate Actions Required

### Step 1: Revoke the Compromised Key

1. **Go to**: https://platform.openai.com/api-keys
2. **Find**: The exposed key in your OpenAI dashboard
3. **Click**: "Revoke" or the trash icon
4. **Confirm**: Revoke immediately

### Step 2: Create a New API Key

1. **Click**: "Create new secret key"
2. **Name**: "Virima Docs - Production" (or similar)
3. **Copy**: The key immediately (you can't see it again)
4. **Store**: In a password manager or secure note

### Step 3: Configure Securely

**DO NOT paste the key here or in any chat.**

Instead, follow the instructions in [Secure Configuration](#secure-configuration) below.

---

## 💡 Why This Matters

### Security Risks of Exposed API Keys

| Risk | Impact |
|------|--------|
| **Unauthorized Usage** | Others can use your API key, charging your account |
| **Billing Fraud** | Malicious actors can rack up thousands in charges |
| **Data Breach** | Your prompts and data could be exposed |
| **Service Disruption** | OpenAI will auto-revoke detected keys |
| **Rate Limit Issues** | Shared usage can hit your rate limits |

### Real-World Consequences

```
❌ Exposed Key in Git → OpenAI auto-revokes within hours
❌ Exposed Key in Chat → Visible to anyone with access
❌ Exposed Key in Code → Scraped by bots within minutes
```

---

## 🔍 What Went Wrong

### The Problem

**Before (Insecure)**:

```typescript
// ❌ WRONG: Hardcoded API key in source code
export const SearchConfig = {
  openai: {
    apiKey: 'sk-proj-lVL_VTEYD...' // ❌ NEVER DO THIS
  }
};
```

**Why This Was Bad**:
- ❌ Key visible in source code
- ❌ Would be committed to Git
- ❌ Visible in GitHub repository
- ❌ Auto-detected and revoked by OpenAI
- ❌ Anyone with code access can steal it

---

## ✅ Secure Configuration

### The Solution

**After (Secure)**:

```typescript
// ✅ CORRECT: Read from environment variable
export const SearchConfig = {
  openai: {
    apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY || ''
  }
};
```

**Why This Is Better**:
- ✅ Key never in source code
- ✅ Key never committed to Git
- ✅ Different keys for dev/prod
- ✅ Can rotate keys easily
- ✅ Follows industry standards

---

## 🛠️ Platform-Specific Setup

### Option 1: Local Development

#### Step 1: Create `.env.local` File

```bash
# In your project root directory
touch .env.local
```

#### Step 2: Add Your API Key

Open `.env.local` and add:

```env
NEXT_PUBLIC_OPENAI_API_KEY=sk-proj-YOUR_NEW_KEY_HERE
```

**⚠️ Important**: Replace `sk-proj-YOUR_NEW_KEY_HERE` with your actual key

#### Step 3: Verify It's Gitignored

Check `.gitignore` contains:

```gitignore
.env.local
.env
*.env
```

#### Step 4: Restart Development Server

```bash
npm run dev
# or
yarn dev
```

---

### Option 2: Vercel Deployment

#### Step 1: Go to Project Settings

1. Open your Vercel dashboard
2. Select your project
3. Click **Settings**
4. Navigate to **Environment Variables**

#### Step 2: Add Environment Variable

```
Name:  NEXT_PUBLIC_OPENAI_API_KEY
Value: sk-proj-YOUR_NEW_KEY_HERE
Environments: ☑ Production ☑ Preview ☑ Development
```

#### Step 3: Redeploy

```bash
vercel --prod
```

Or trigger a new deployment via Git push.

---

### Option 3: Netlify Deployment

#### Step 1: Go to Site Settings

1. Open your Netlify dashboard
2. Select your site
3. Click **Site settings**
4. Navigate to **Environment variables**

#### Step 2: Add Environment Variable

```
Key:   NEXT_PUBLIC_OPENAI_API_KEY
Value: sk-proj-YOUR_NEW_KEY_HERE
Scopes: ☑ All scopes
```

#### Step 3: Redeploy

```bash
netlify deploy --prod
```

Or trigger a new deployment via Git push.

---

### Option 4: GitHub Actions (CI/CD)

#### Step 1: Go to Repository Settings

1. Open your GitHub repository
2. Click **Settings**
3. Navigate to **Secrets and variables** → **Actions**
4. Click **New repository secret**

#### Step 2: Add Secret

```
Name:  NEXT_PUBLIC_OPENAI_API_KEY
Secret: sk-proj-YOUR_NEW_KEY_HERE
```

#### Step 3: Use in Workflow

```yaml
# .github/workflows/deploy.yml
- name: Deploy
  env:
    NEXT_PUBLIC_OPENAI_API_KEY: ${{ secrets.NEXT_PUBLIC_OPENAI_API_KEY }}
  run: npm run build
```

---

### Option 5: AWS (CloudFront/S3)

#### Using AWS Secrets Manager

```bash
# Store secret
aws secretsmanager create-secret \
  --name virima-docs/openai-api-key \
  --secret-string "sk-proj-YOUR_NEW_KEY_HERE"

# Retrieve in application
aws secretsmanager get-secret-value \
  --secret-id virima-docs/openai-api-key
```

---

### Option 6: Azure Static Web Apps

#### Step 1: Azure Portal

1. Open Azure Portal
2. Navigate to your Static Web App
3. Click **Configuration**
4. Add Application Setting

#### Step 2: Add Setting

```
Name:  NEXT_PUBLIC_OPENAI_API_KEY
Value: sk-proj-YOUR_NEW_KEY_HERE
```

---

## ✅ Verification

### Test Locally

```bash
# 1. Check environment variable is loaded
echo $NEXT_PUBLIC_OPENAI_API_KEY

# 2. Start development server
npm run dev

# 3. Test AI Search feature
# - Open http://localhost:5173
# - Click Search icon
# - Try a search query
# - Check console for errors
```

### Test in Production

```bash
# 1. Deploy to your platform
# 2. Open production URL
# 3. Test AI Search feature
# 4. Check browser console for errors
```

### Common Issues

#### Issue 1: "API key not configured"

**Solution**: Environment variable not loaded

```bash
# Check .env.local exists
ls -la .env.local

# Check it contains the key
cat .env.local

# Restart dev server
npm run dev
```

#### Issue 2: "Invalid API key"

**Solution**: Key might be wrong or revoked

```bash
# Test key directly with curl
curl https://api.openai.com/v1/models \
  -H "Authorization: Bearer sk-proj-YOUR_KEY_HERE"
```

#### Issue 3: "Key working locally but not in production"

**Solution**: Environment variable not set in hosting platform

- Verify environment variable in platform dashboard
- Check variable name matches exactly: `NEXT_PUBLIC_OPENAI_API_KEY`
- Redeploy after adding variable

---

## 🛡️ Best Practices

### ✅ DO

| Practice | Why |
|----------|-----|
| **Use environment variables** | Keys stay out of code |
| **Different keys for dev/prod** | Isolate environments |
| **Rotate keys regularly** | Limit exposure window |
| **Revoke immediately if exposed** | Stop unauthorized use |
| **Use secrets management** | Enterprise-grade security |
| **Monitor API usage** | Detect anomalies quickly |
| **Set usage limits** | Prevent billing surprises |

### ❌ DON'T

| Anti-Pattern | Why Not |
|--------------|---------|
| **Hardcode in source code** | Visible to everyone |
| **Commit to Git** | Permanent record |
| **Share in chat/email** | Insecure transmission |
| **Reuse across projects** | Blast radius too large |
| **Store in documentation** | Public exposure risk |
| **Use in client-side code without proxy** | Exposed to users |
| **Ignore revocation notices** | Security vulnerability |

---

## 📊 Security Architecture

### Before: Insecure ❌

```
┌─────────────────────────────────────────┐
│  Git Repository (Public/Private)        │
│  └── src/                               │
│       └── config.ts                     │
│            ↓                            │
│       apiKey: "sk-proj-..."  ← EXPOSED │
└─────────────────────────────────────────┘
              ↓
    ❌ Scraped by bots
    ❌ Visible in Git history
    ❌ Auto-revoked by OpenAI
```

### After: Secure ✅

```
┌─────────────────────────────────────────┐
│  Git Repository (Safe to push)          │
│  └── src/                               │
│       └── config.ts                     │
│            ↓                            │
│       apiKey: process.env.KEY ← Safe    │
└─────────────────────────────────────────┘
              ↓
┌─────────────────────────────────────────┐
│  Environment Variables (External)        │
│  - Vercel Dashboard                     │
│  - Netlify Settings                     │
│  - AWS Secrets Manager                  │
│  - GitHub Secrets                       │
│  - .env.local (gitignored)              │
└─────────────────────────────────────────┘
              ↓
    ✅ Never in source code
    ✅ Never in Git
    ✅ Easily rotatable
```

---

## 🔧 What We Fixed

### Changes Made

#### 1. Updated Configuration Files

**File**: `/lib/search/config.ts`

**Before**:
```typescript
apiKey: getEnv('NEXT_PUBLIC_OPENAI_API_KEY') || 'sk-proj-HARDCODED_KEY'
```

**After**:
```typescript
// ⚠️ SECURITY: API keys must NEVER be hardcoded. Use environment variables.
apiKey: getEnv('NEXT_PUBLIC_OPENAI_API_KEY') || ''
```

#### 2. Created `.gitignore`

**File**: `/.gitignore`

**Added**:
```gitignore
# Environment Variables - CRITICAL: Never commit these files
.env
.env.local
.env.development.local
.env.test.local
.env.production.local
*.env
```

#### 3. Created `.env.example`

**File**: `/.env.example`

**Purpose**:
- Template for setting up environment variables
- Includes all API keys needed
- Instructions for each platform
- Security best practices

#### 4. Created Security Documentation

**Files Created**:
- `/docs/API-KEY-SECURITY.md` (this file)
- Updated configuration comments
- Added security warnings

---

## 📝 Summary

### What You Need to Do

1. ✅ **Revoke** the compromised key at https://platform.openai.com/api-keys
2. ✅ **Create** a new API key (don't share it anywhere)
3. ✅ **Add** the new key to your platform's environment variables:
   - **Local**: Create `.env.local` file
   - **Vercel**: Settings → Environment Variables
   - **Netlify**: Site Settings → Environment Variables
   - **Other**: Follow platform documentation
4. ✅ **Test** that AI search works with the new key
5. ✅ **Monitor** your OpenAI usage dashboard

### What We Fixed

- ✅ Removed hardcoded API keys from source code
- ✅ Updated configuration to use environment variables
- ✅ Created proper `.gitignore` file
- ✅ Created `.env.example` template
- ✅ Documented security best practices
- ✅ Added setup instructions for all major platforms

---

## 🆘 Need Help?

### If You're Stuck

1. **Check** `.env.local` exists and contains your key
2. **Verify** the key starts with `sk-proj-` or `sk-`
3. **Restart** your development server
4. **Test** the key with curl (see Verification section)
5. **Check** browser console for specific error messages

### Resources

- **OpenAI API Keys**: https://platform.openai.com/api-keys
- **OpenAI Usage Dashboard**: https://platform.openai.com/usage
- **Vercel Env Vars**: https://vercel.com/docs/environment-variables
- **Netlify Env Vars**: https://docs.netlify.com/environment-variables/overview/

---

## ✅ Checklist

Use this to verify everything is secure:

- [ ] Compromised key revoked at OpenAI
- [ ] New key created
- [ ] New key stored in password manager
- [ ] `.env.local` created with new key
- [ ] `.env.local` listed in `.gitignore`
- [ ] Source code has no hardcoded keys
- [ ] Production environment variable configured
- [ ] Application tested locally
- [ ] Application tested in production
- [ ] Usage monitored on OpenAI dashboard

---

**Remember**: API keys are like passwords. Treat them with the same level of security. Never share them, never commit them, and always use environment variables.

🔐 **Your data and billing depend on it!**