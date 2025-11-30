# 🚀 Virima Documentation - Quick Start Guide

This guide will get your Virima documentation website up and running in minutes.

---

## Prerequisites

Before you begin, ensure you have:

- **Node.js** >= 18.0.0
- **npm** >= 9.0.0

Check your versions:
```bash
node --version
npm --version
```

---

## Installation

### 1. Install Dependencies

```bash
npm install
```

This will install all required packages including:
- React 18
- Vite 5
- TypeScript 5
- Tailwind CSS 4
- MDX support
- All UI components

**Expected time:** 2-3 minutes

---

## Development

### 2. Start Development Server

```bash
npm run dev
```

This will:
- ✅ Start Vite dev server on `http://localhost:3000`
- ✅ Enable hot module replacement (HMR)
- ✅ Load all MDX content dynamically
- ✅ Open browser automatically

**Access the site:** `http://localhost:3000`

---

## Building for Production

### 3. Create Production Build

```bash
npm run build
```

This will:
- ✅ Compile TypeScript
- ✅ Bundle React application
- ✅ Copy 822+ MDX files to `build/content/`
- ✅ Optimize assets for GitHub Pages
- ✅ Generate sourcemaps

**Output directory:** `./build`

### 4. Preview Production Build

```bash
npm run preview
```

This will serve the production build locally for testing.

---

## Project Structure

```
virima-documentation/
├── components/          # React components
│   ├── ui/             # Shadcn UI components
│   ├── DocumentationContent.tsx
│   ├── TableOfContents.tsx
│   └── ...
├── content/            # MDX documentation files
│   ├── 5_13/          # Version 5.13
│   ├── 6_1/           # Version 6.1 (822 files)
│   ├── 6_1_1/         # Version 6.1.1
│   └── NG/            # NextGen
├── lib/               # Libraries and utilities
│   ├── imports/       # MDX file registries
│   └── chat/          # Chat functionality
├── utils/             # Utility functions
│   ├── mdxPathResolver.ts
│   ├── tocLoader.ts
│   └── ...
├── styles/            # Global styles
│   └── globals.css
├── vite.config.ts     # Vite configuration
├── package.json       # Dependencies
└── App.tsx            # Main application entry
```

---

## Key Features

### ✅ Implemented Features

1. **Version Control System**
   - 4 versions: 5.13, 6.1, 6.1.1, NextGen
   - Complete version isolation
   - Version-specific TOC

2. **5 Modules Completed**
   - Admin (822 files)
   - Discovery
   - CMDB
   - ITAM
   - ITSM

3. **Advanced Features**
   - 🎤 Speech-to-text in AI search
   - 💬 Enterprise chat system
   - 🔍 Advanced search
   - 📊 Analytics dashboard
   - 🎨 Resizable sidebar (locked green indicator)

4. **Developer Experience**
   - TypeScript support
   - Hot module replacement
   - Path aliases
   - MDX rendering
   - Tailwind CSS

---

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Create production build |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |
| `npm run type-check` | Check TypeScript types |

---

## Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
# API Keys (if needed)
VITE_API_KEY=your_api_key_here

# Base URL for GitHub Pages
VITE_BASE_URL=/FeatureDocsite/
```

### GitHub Pages Deployment

The project is configured for GitHub Pages deployment at `/FeatureDocsite/`.

**Deployment steps:**
1. Build: `npm run build`
2. Push `build/` folder to `gh-pages` branch
3. Configure GitHub Pages settings to use `gh-pages` branch

---

## Content Management

### Adding New Content

1. **Create MDX file:**
   ```bash
   # Example: Add new admin topic
   touch content/6_1/admin_6_1/admin_security/new_topic_6_1.mdx
   ```

2. **Register the file:**
   ```typescript
   // lib/imports/adminMDXImports.ts
   export const adminMDXFilePaths = {
     '6_1': {
       'admin/security/new-topic': '/content/6_1/admin_6_1/admin_security/new_topic_6_1.mdx'
     }
   };
   ```

3. **Update TOC:**
   ```typescript
   // data/navigationData.ts
   // Add to appropriate section
   ```

### MDX File Format

```mdx
---
title: "Topic Title"
version: "6.1"
module: "admin"
---

# Topic Title

Your content here with Markdown and JSX components.

## Subheading

- Bullet points
- **Bold text**
- *Italic text*
- [Links](#)

import { Button } from './components/ui/button'

<Button>Interactive Component</Button>
```

---

## Troubleshooting

### Issue: Dependencies fail to install

**Solution:**
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and lock file
rm -rf node_modules package-lock.json

# Reinstall
npm install
```

### Issue: Port 3000 already in use

**Solution:**
```bash
# Kill process on port 3000
npx kill-port 3000

# Or use a different port
npm run dev -- --port 3001
```

### Issue: Content not loading

**Solution:**
1. Check browser console for errors
2. Verify file path in `lib/imports/adminMDXImports.ts`
3. Ensure file exists in `content/` directory
4. Clear browser cache

### Issue: Build fails

**Solution:**
```bash
# Check TypeScript errors
npm run type-check

# Check for syntax errors
npm run lint

# Try clean build
rm -rf build node_modules
npm install
npm run build
```

---

## Development Workflow

### Daily Development

1. **Start development server:**
   ```bash
   npm run dev
   ```

2. **Make changes to:**
   - React components in `/components`
   - MDX content in `/content`
   - Styles in `/styles`
   - Utilities in `/utils`

3. **Changes auto-reload** thanks to HMR

4. **Before committing:**
   ```bash
   npm run type-check
   npm run lint
   npm run build  # Ensure it builds
   ```

### Adding a New Module

1. Create content directory: `content/6_1/[module]_6_1/`
2. Create registry file: `lib/imports/[module]MDXImports.ts`
3. Update `content/contentLoader.ts` to import registry
4. Add TOC entries in `data/navigationData.ts`
5. Test thoroughly

---

## Performance Tips

### Development

- Use `React DevTools` for component debugging
- Enable `Vite` debug mode: `DEBUG=vite:* npm run dev`
- Use browser's Network tab to check content loading

### Production

- Check bundle size: Analyze `build/assets/`
- Optimize images before adding to content
- Use lazy loading for heavy components
- Preload critical content

---

## Resources

### Documentation

- [Vite Documentation](https://vitejs.dev/)
- [React Documentation](https://react.dev/)
- [MDX Documentation](https://mdxjs.com/)
- [Tailwind CSS Documentation](https://tailwindcss.com/)

### Components

- [Shadcn UI](https://ui.shadcn.com/)
- [Radix UI](https://www.radix-ui.com/)
- [Lucide Icons](https://lucide.dev/)

### Tools

- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [React Router](https://reactrouter.com/)

---

## Support

### Getting Help

1. **Check documentation:** `/docs` folder
2. **Review guides:** `IMPLEMENTATION_APPLIED.md`
3. **Check issues:** Review error messages carefully
4. **Console logs:** Enable verbose logging

### Common Questions

**Q: How do I add a new version?**
A: Create a new folder in `/content`, update version constants, add TOC data.

**Q: Can I use custom React components in MDX?**
A: Yes! Import and use any React component in your MDX files.

**Q: How do I customize the theme?**
A: Edit `/styles/globals.css` for colors, fonts, and spacing.

**Q: How do I add a new UI component?**
A: Use Shadcn CLI: `npx shadcn-ui@latest add [component]`

---

## Next Steps

### For New Developers

1. ✅ Complete installation
2. ✅ Start dev server
3. ✅ Explore the codebase
4. 📖 Read `/docs/README.md`
5. 🛠️ Make a small change
6. 🧪 Test your changes
7. 📝 Update documentation

### For Content Authors

1. ✅ Learn MDX syntax
2. 📝 Review existing content structure
3. ✍️ Create your first content file
4. 🔗 Add to TOC
5. 👀 Preview in browser
6. ✅ Submit for review

---

## Success! 🎉

You should now have:
- ✅ Development server running
- ✅ All 822 files accessible
- ✅ All 4 versions working
- ✅ Hot reload active
- ✅ Ready to develop

**Happy documenting!** 📚

---

*Last updated: November 30, 2025*
