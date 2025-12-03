# 🚀 Production Deployment Guide

## ✅ Pre-Deployment Checklist

Before deploying to production, verify:

- [x] `.env.local` created with API key (for local dev)
- [x] `.env.local` is in `.gitignore` 
- [x] No hardcoded API keys in source code
- [x] Local development tested and working
- [ ] Production environment variables configured
- [ ] Production deployment tested

---

## 📦 Deployment Options

### Option 1: Vercel (Recommended)

#### Step 1: Connect Repository

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Link project
vercel link
```

#### Step 2: Configure Environment Variables

**Via Vercel Dashboard**:
1. Go to: https://vercel.com/dashboard
2. Select your project
3. Go to: **Settings** → **Environment Variables**
4. Click **Add New**

**Add this variable**:
```
Name: NEXT_PUBLIC_OPENAI_API_KEY
Value: [Paste your OpenAI API key here]
Environments: 
  ☑ Production
  ☑ Preview  
  ☑ Development
```

**Via Vercel CLI**:
```bash
# Set production environment variable
vercel env add NEXT_PUBLIC_OPENAI_API_KEY production

# When prompted, paste your API key
# Repeat for preview and development environments
```

#### Step 3: Deploy

```bash
# Deploy to production
vercel --prod

# Or push to main branch (auto-deploys)
git push origin main
```

#### Step 4: Verify

```bash
# Get deployment URL
vercel ls

# Test in browser
# 1. Open deployment URL
# 2. Test AI Search
# 3. Test Voice Input
# 4. Check browser console for errors
```

---

### Option 2: Netlify

#### Step 1: Connect Repository

**Via Netlify Dashboard**:
1. Go to: https://app.netlify.com/
2. Click **Add new site** → **Import an existing project**
3. Connect your Git provider
4. Select your repository
5. Configure build settings:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`

**Via Netlify CLI**:
```bash
# Install Netlify CLI
npm i -g netlify-cli

# Login
netlify login

# Initialize
netlify init
```

#### Step 2: Configure Environment Variables

**Via Netlify Dashboard**:
1. Go to your site dashboard
2. Navigate to: **Site settings** → **Environment variables**
3. Click **Add a variable**

**Add this variable**:
```
Key: NEXT_PUBLIC_OPENAI_API_KEY
Value: [Paste your OpenAI API key here]
Scopes: ☑ All scopes
```

**Via Netlify CLI**:
```bash
# Set environment variable
netlify env:set NEXT_PUBLIC_OPENAI_API_KEY "your-api-key-here"
```

#### Step 3: Deploy

```bash
# Deploy to production
netlify deploy --prod

# Or push to main branch (auto-deploys)
git push origin main
```

#### Step 4: Verify

```bash
# Get deployment URL
netlify status

# Test in browser
```

---

### Option 3: GitHub Pages + GitHub Actions

#### Step 1: Create GitHub Actions Workflow

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build
        env:
          NEXT_PUBLIC_OPENAI_API_KEY: ${{ secrets.OPENAI_API_KEY }}
        run: npm run build
      
      - name: Upload artifact
        uses: actions/upload-pages-artifact@v2
        with:
          path: ./dist

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v3
```

#### Step 2: Configure Repository Secrets

1. Go to your GitHub repository
2. Navigate to: **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**

**Add this secret**:
```
Name: OPENAI_API_KEY
Secret: [Paste your OpenAI API key here]
```

#### Step 3: Enable GitHub Pages

1. Go to: **Settings** → **Pages**
2. Source: **GitHub Actions**
3. Save

#### Step 4: Deploy

```bash
# Push to trigger deployment
git push origin main

# Or manually trigger via Actions tab
```

---

### Option 4: AWS (S3 + CloudFront)

#### Step 1: Build Locally

```bash
# Build with environment variable
NEXT_PUBLIC_OPENAI_API_KEY="your-key-here" npm run build
```

#### Step 2: Create S3 Bucket

```bash
# Create bucket
aws s3 mb s3://virima-docs --region us-east-1

# Enable static website hosting
aws s3 website s3://virima-docs \
  --index-document index.html \
  --error-document index.html
```

#### Step 3: Upload Build

```bash
# Sync dist folder to S3
aws s3 sync dist/ s3://virima-docs \
  --delete \
  --cache-control max-age=31536000,public
```

#### Step 4: Configure CloudFront

```bash
# Create CloudFront distribution
aws cloudfront create-distribution \
  --origin-domain-name virima-docs.s3.amazonaws.com \
  --default-root-object index.html
```

#### Alternative: Use AWS Secrets Manager

```bash
# Store API key in Secrets Manager
aws secretsmanager create-secret \
  --name virima-docs/openai-key \
  --secret-string "your-api-key-here"

# Create Lambda@Edge function to inject at runtime
# (Advanced - see AWS documentation)
```

---

### Option 5: Docker Container

#### Step 1: Create Dockerfile

Create `Dockerfile`:

```dockerfile
FROM node:18-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

#### Step 2: Create nginx.conf

Create `nginx.conf`:

```nginx
server {
    listen 80;
    server_name _;
    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # Enable gzip compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
}
```

#### Step 3: Build and Run

```bash
# Build image
docker build -t virima-docs .

# Run container with environment variable
docker run -d \
  -p 80:80 \
  -e NEXT_PUBLIC_OPENAI_API_KEY="your-key-here" \
  virima-docs

# Or use Docker Compose
```

---

## 🔒 Security Best Practices

### Environment Variable Management

| Platform | Storage Method | Security Level |
|----------|---------------|----------------|
| Vercel | Encrypted in dashboard | ⭐⭐⭐⭐⭐ |
| Netlify | Encrypted in settings | ⭐⭐⭐⭐⭐ |
| GitHub Actions | Repository secrets | ⭐⭐⭐⭐⭐ |
| AWS Secrets Manager | Enterprise encryption | ⭐⭐⭐⭐⭐ |
| Docker Env Vars | Runtime injection | ⭐⭐⭐⭐ |

### Key Rotation Strategy

```bash
# 1. Create new API key at OpenAI
# 2. Update environment variable in platform
# 3. Verify new key works
# 4. Revoke old key
# 5. Monitor for any issues
```

### Monitoring

```bash
# Check OpenAI usage dashboard regularly
# https://platform.openai.com/usage

# Set up billing alerts
# https://platform.openai.com/account/billing/limits

# Monitor application logs for API errors
```

---

## ✅ Post-Deployment Verification

### Automated Testing

```bash
# Test production endpoint
curl https://your-domain.com

# Test AI Search endpoint (if applicable)
curl -X POST https://your-domain.com/api/search \
  -H "Content-Type: application/json" \
  -d '{"query":"test"}'
```

### Manual Testing Checklist

- [ ] Homepage loads correctly
- [ ] Navigation works across all versions
- [ ] AI Search Docs returns results
- [ ] AI Search Web returns results
- [ ] Voice Input activates and transcribes
- [ ] Chat panel opens and responds
- [ ] No console errors
- [ ] No 404 errors for assets
- [ ] SSL certificate valid (HTTPS)
- [ ] Mobile responsive

### Browser Testing

Test in:
- [ ] Chrome/Edge (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Mobile Safari (iOS)
- [ ] Chrome Mobile (Android)

---

## 🐛 Troubleshooting

### Issue: "API key not configured"

**Symptoms**: AI features don't work in production

**Solutions**:
```bash
# 1. Verify environment variable is set
# Platform dashboard → Environment variables

# 2. Verify variable name matches exactly
# Must be: NEXT_PUBLIC_OPENAI_API_KEY

# 3. Redeploy after adding variable
vercel --prod  # or
netlify deploy --prod
```

### Issue: "Invalid API key"

**Symptoms**: API returns 401 errors

**Solutions**:
```bash
# 1. Test key directly
curl https://api.openai.com/v1/models \
  -H "Authorization: Bearer YOUR_KEY"

# 2. Verify key hasn't been revoked
# Check: https://platform.openai.com/api-keys

# 3. Regenerate key if necessary
```

### Issue: "Rate limit exceeded"

**Symptoms**: Some requests fail with 429 errors

**Solutions**:
```bash
# 1. Check usage dashboard
# https://platform.openai.com/usage

# 2. Implement request throttling
# Add rate limiting in your code

# 3. Upgrade OpenAI tier if needed
# https://platform.openai.com/account/billing/overview
```

---

## 📊 Performance Optimization

### CDN Configuration

**Vercel**: Automatically configured
**Netlify**: Automatically configured
**CloudFront**: Configure cache behaviors
**Cloudflare**: Add as DNS proxy

### Caching Strategy

```nginx
# Cache static assets
location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}

# Don't cache HTML
location ~* \.html$ {
    expires -1;
    add_header Cache-Control "no-store, no-cache, must-revalidate";
}
```

---

## 🎯 Summary

### What You Need

1. ✅ **Source code** - Ready (all keys removed)
2. ✅ **API key** - Secured in `.env.local`
3. ✅ **Hosting platform** - Choose one above
4. ⬜ **Environment variable** - Add to platform
5. ⬜ **Deploy** - Push or run deploy command
6. ⬜ **Test** - Verify all features work

### Quick Deploy Commands

```bash
# Vercel
vercel --prod

# Netlify  
netlify deploy --prod

# GitHub Pages
git push origin main

# Docker
docker build -t virima-docs . && docker run -p 80:80 virima-docs
```

---

## 📚 Resources

- **Vercel Docs**: https://vercel.com/docs
- **Netlify Docs**: https://docs.netlify.com
- **GitHub Actions**: https://docs.github.com/en/actions
- **AWS S3**: https://docs.aws.amazon.com/s3/
- **Docker**: https://docs.docker.com/

---

**Your Virima documentation is ready for production! 🚀**

Choose your deployment platform and follow the steps above. All security measures are in place.
