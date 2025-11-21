# Figma Make Project Export/Import Guide

## Overview
This guide explains how to export and import your Virima Documentation project for use in Figma Make or other environments.

---

## Current Situation

**Important:** Figma Make does not currently have an official `.figmamake` export/import format. This guide provides the **best possible workaround** until an official format is released.

---

## Export Methods

### Method 1: Using Figma Make's Built-in Features (Recommended)

Check your Figma Make interface for these options:

#### A. Share URL Method
1. Click the **"Share"** button (usually top-right)
2. Generate a shareable link
3. Others can **fork/clone** your project from this URL
4. This is the easiest method if available

#### B. Export/Download Method
1. Look for **File → Export Project** in the menu
2. Or **Settings → Project Settings → Export**
3. Download the exported file
4. Import in another Figma Make instance using **Import Project**

---

### Method 2: Manual Export Using Project Manifest (Current Best Option)

Since Figma Make may not have export yet, use this comprehensive approach:

#### Files Included in This Project:

1. **`/project-manifest.json`** - Complete project metadata and structure
2. **All source files** - Your entire file structure as shown
3. **This guide** - Instructions for reconstruction

#### What You Get:

```
Your Project/
├── project-manifest.json          ← Project metadata
├── EXPORT-IMPORT-GUIDE.md         ← This file
├── COMPREHENSIVE-BUILD-PROMPT.md  ← Full rebuild instructions
├── App.tsx                        ← Entry point
├── components/                    ← All components
├── content/                       ← All MDX content
├── styles/                        ← Styling
└── utils/                         ← Utilities
```

---

## Import to Another Figma Make Instance

### Option A: If Figma Make Has Import Feature

1. **Open Figma Make** in browser
2. Click **"New Project"** or **"Import Project"**
3. Select one of these methods:
   - **Upload Folder/ZIP**: Upload your project folder or ZIP file
   - **Import from URL**: Paste your shared project URL
   - **Import from GitHub**: If you pushed to GitHub
   - **Import Manifest**: Upload `project-manifest.json`

4. **Figma Make will reconstruct** your project automatically

### Option B: Manual Recreation (If No Import Exists)

If Figma Make doesn't have import yet:

1. **Create New Project** in Figma Make
2. **Copy file-by-file**:
   - Start with `/App.tsx`
   - Copy each component from `/components/`
   - Copy all UI components from `/components/ui/`
   - Copy all MDX files from `/content/`
   - Copy styles from `/styles/globals.css`
   - Copy utils from `/utils/`

3. **Preserve exact structure** - The folder hierarchy matters

---

## Export to Work in Cursor or VS Code

To work on this project outside Figma Make:

### Step 1: Download Project Files

**Option A:** If Figma Make has download:
- Click **File → Download** or **Export**
- Download as ZIP
- Extract to your computer

**Option B:** Manual download:
- Copy each file's contents manually
- Recreate the folder structure locally

### Step 2: Add Configuration Files

Create these additional files to make it a standalone project:

#### `package.json`
```json
{
  "name": "virima-documentation",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "lucide-react": "latest",
    "@radix-ui/react-accordion": "latest",
    "@radix-ui/react-alert-dialog": "latest",
    "@radix-ui/react-avatar": "latest",
    "@radix-ui/react-dialog": "latest",
    "@radix-ui/react-dropdown-menu": "latest",
    "@radix-ui/react-label": "latest",
    "@radix-ui/react-scroll-area": "latest",
    "@radix-ui/react-select": "latest",
    "@radix-ui/react-separator": "latest",
    "@radix-ui/react-slot": "latest",
    "@radix-ui/react-tabs": "latest",
    "class-variance-authority": "latest",
    "clsx": "latest",
    "tailwind-merge": "latest",
    "sonner": "^2.0.3"
  },
  "devDependencies": {
    "@types/react": "^18.3.1",
    "@types/react-dom": "^18.3.0",
    "@vitejs/plugin-react": "^4.2.1",
    "@mdx-js/rollup": "^3.0.0",
    "tailwindcss": "^4.0.0",
    "typescript": "^5.4.2",
    "vite": "^5.1.6"
  }
}
```

#### `vite.config.ts`
```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import mdx from '@mdx-js/rollup';

export default defineConfig({
  plugins: [
    react(),
    mdx()
  ],
  resolve: {
    alias: {
      '@': '/src'
    }
  }
});
```

#### `tsconfig.json`
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./*"]
    }
  },
  "include": ["."],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

#### `tsconfig.node.json`
```json
{
  "compilerOptions": {
    "composite": true,
    "skipLibCheck": true,
    "module": "ESNext",
    "moduleResolution": "bundler",
    "allowSyntheticDefaultImports": true
  },
  "include": ["vite.config.ts"]
}
```

#### `index.html`
```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Virima Documentation</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/main.tsx"></script>
  </body>
</html>
```

#### `main.tsx`
```tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles/globals.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

#### `.gitignore`
```
node_modules
dist
.DS_Store
*.log
.vite
.env
```

### Step 3: Install and Run

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

---

## Best Format for Sharing

### Recommended Sharing Methods (In Order):

#### 1. **GitHub Repository** (Best for collaboration)
```bash
# Initialize git
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit - Virima Documentation"

# Push to GitHub
git remote add origin https://github.com/yourusername/virima-docs.git
git push -u origin main
```

**Benefits:**
- Version control
- Easy collaboration
- Can import directly in many platforms
- Proper project history

#### 2. **ZIP Archive** (Best for one-time sharing)
Create a ZIP file containing:
- All source files
- `project-manifest.json`
- This guide
- Optional: config files for standalone use

#### 3. **Figma Make Share URL** (Best if available)
Use Figma Make's built-in sharing if it exists.

---

## Project Manifest Format

The `project-manifest.json` file contains:

### 1. **Metadata**
- Project name and description
- Framework and styling information
- Brand colors and themes
- Versions, modules, deliverables

### 2. **Dependencies**
- All npm packages required
- Versions specified

### 3. **Structure**
- Complete file tree
- Component organization
- Content structure
- Documentation files

### 4. **Features**
- List of implemented features
- Configuration options

### 5. **Import Instructions**
- Step-by-step reconstruction guide

---

## Verification Checklist

After importing, verify:

- [ ] All components render correctly
- [ ] Routing works (homepage, documentation pages)
- [ ] MDX content loads properly
- [ ] AI search dialog opens and functions
- [ ] Login dialog works
- [ ] Version selector switches versions
- [ ] Breadcrumb navigation shows correct path
- [ ] Table of contents scrolls correctly
- [ ] Three-pane layout displays properly
- [ ] Responsive design works on mobile
- [ ] All 10 modules are accessible
- [ ] All 4 versions are accessible
- [ ] Styling matches original (emerald/green theme)

---

## Troubleshooting

### Issue: Import not working in Figma Make
**Solution:** Use manual file-by-file copy method

### Issue: Missing dependencies
**Solution:** Check `project-manifest.json` dependencies section

### Issue: MDX files not loading
**Solution:** Verify `/content/contentLoader.ts` paths are correct

### Issue: Styling looks different
**Solution:** Ensure `/styles/globals.css` is imported in App.tsx

### Issue: Components not found
**Solution:** Check import paths match your file structure

---

## File Count Summary

**Total Files:** ~250+ files

**Breakdown:**
- React Components: ~15 custom + ~45 UI components
- MDX Content Files: ~150+ files
- Configuration/Utils: ~5 files
- Documentation: ~10 files
- Styles: 1 file

**Total Project Size:** ~2-5 MB (uncompressed)

---

## Future-Proofing

This export format is designed to be:
- **Platform-agnostic**: Works in Figma Make, Cursor, VS Code, etc.
- **Future-compatible**: Ready for when Figma Make adds official import
- **Standard-compliant**: Uses industry-standard formats (JSON, MDX, TSX)
- **Self-documenting**: Includes comprehensive documentation

---

## Support & Questions

If you encounter issues:

1. Check the `COMPREHENSIVE-BUILD-PROMPT.md` for full rebuild instructions
2. Review `docs/CURRENT-STATE.md` for current implementation details
3. Consult `docs/QUICK-START.md` for setup guidance
4. Check Figma Make documentation for latest import features

---

## Summary

**Quick Export Steps:**
1. Check if Figma Make has Share/Export button → Use it
2. If not, you already have everything in your file structure
3. Use `project-manifest.json` as reference for rebuilding
4. Add config files if deploying outside Figma Make

**Quick Import Steps:**
1. In new Figma Make instance, look for Import button
2. If exists, upload ZIP or paste share URL
3. If not, manually recreate file structure
4. Verify all features work using checklist above

---

**Last Updated:** November 18, 2025
**Project Version:** 1.0.0
**Compatible with:** Figma Make, Cursor, VS Code, any React development environment
