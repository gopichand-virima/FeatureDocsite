# 🚀 API Key Quick Start Guide

## ✅ Your Setup is Complete!

Your OpenAI API key is now securely configured.

---

## 📍 Where is Your API Key?

### ✅ Local Development
```
/.env (file is gitignored - never committed)
```

### ✅ GitHub Actions
```
Settings → Secrets and variables → Actions → VITE_OPENAI_API_KEY
```
*(You need to add this before pushing)*

### ✅ Code
```typescript
// /lib/search/config.ts
apiKey: getEnvVar('VITE_OPENAI_API_KEY')  // ✅ Secure
```

---

## 🎯 Quick Commands

### Start Development Server
```bash
npm run dev
```

### Test Speech-to-Text
1. Open http://localhost:5173
2. Click search icon (Cmd/Ctrl + K)
3. Click microphone icon
4. Speak and test!

### Verify Security
```bash
# Check .env is gitignored
git check-ignore .env

# Should output: .env ✅
```

---

## ⚠️ Before First Git Push

### Step 1: Add GitHub Secret
1. Go to **GitHub** → **Your Repo** → **Settings**
2. Click **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Add:
   - **Name**: `VITE_OPENAI_API_KEY`
   - **Value**: Copy from your `.env` file

### Step 2: Verify No Keys in Code
```bash
git diff --cached | grep -i "sk-proj"
# Should return nothing ✅
```

### Step 3: Safe to Push
```bash
git add .
git commit -m "Configure secure API management"
git push origin main
```

---

## 🔒 Security Status

| Item | Status |
|------|--------|
| API key in code | ❌ None (secure) |
| API key in docs | ❌ None (secure) |
| `.env` gitignored | ✅ Yes |
| GitHub Secrets ready | ⚠️ You need to add |
| Code uses env vars | ✅ Yes |

---

## 📖 Full Documentation

- **Detailed Setup**: `/docs/GITHUB-SECRETS-SETUP.md`
- **Security Guide**: `/docs/API-KEY-SECURITY.md`
- **Complete Status**: `/SECURITY-COMPLETE.md`

---

## 🆘 Troubleshooting

### "OpenAI Whisper API is not configured"

**Fix**:
```bash
# 1. Verify .env exists
ls -la .env

# 2. Check it has your key
cat .env | grep VITE_OPENAI_API_KEY

# 3. Restart dev server
npm run dev
```

### GitHub Actions Fails

**Fix**:
- Go to Settings → Secrets
- Verify `VITE_OPENAI_API_KEY` exists
- Re-run the workflow

---

## ✅ You're Ready!

1. ✅ API key secured in `.env` (gitignored)
2. ✅ No keys in code or docs
3. ✅ Configuration uses env vars
4. ⚠️ GitHub Secrets - **add before pushing**

---

**Next**: Start your dev server and test!

```bash
npm run dev
```

🎤 Click the mic icon and speak to test speech-to-text!
