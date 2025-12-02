# 📚 Virima Documentation Website

> Corporate professional documentation with version control for Virima ITSM, ITAM, CMDB, Discovery, and Admin modules.

[![Build Status](https://img.shields.io/github/actions/workflow/status/your-org/FeatureDocsite/deploy.yml?branch=main)](https://github.com/your-org/FeatureDocsite/actions)
[![Node Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5.3-blue)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/license-Proprietary-red)](LICENSE)

---

## 🌟 Features

### 📖 Content Management
- **4 Versions:** 5.13, 6.1, 6.1.1, and NextGen
- **822+ MDX Files:** Comprehensive documentation across all modules
- **Version Isolation:** Each version maintains its own independent content and TOC
- **5 Modules Complete:** Admin, Discovery, CMDB, ITAM, ITSM

### 🎨 User Experience
- **Milky White Background:** Professional, easy-to-read interface
- **Resizable Sidebar:** Locked green indicator (2px, 0.4 opacity)
- **Responsive Design:** Works on desktop, tablet, and mobile
- **Dark Mode:** Optional dark theme support

### 🔍 Advanced Features
- **AI-Powered Search:** Intelligent content discovery
- **Speech-to-Text:** Voice input in search dialog
- **Enterprise Chat:** Persistent conversation history
- **Analytics Dashboard:** Monitor documentation usage
- **Version Comparison:** Compare content across versions

### 🛠️ Developer Experience
- **TypeScript:** Full type safety
- **MDX Support:** Write docs with React components
- **Hot Reload:** Instant updates during development
- **Path Aliases:** Clean imports (`@/components`, `@/utils`)
- **Automated Deployment:** GitHub Actions CI/CD

---

## 🚀 Quick Start

### Prerequisites

- Node.js >= 18.0.0
- npm >= 9.0.0

### Installation

```bash
# Clone the repository
git clone https://github.com/your-org/FeatureDocsite.git
cd FeatureDocsite

# Install dependencies
npm install

# Start development server
npm run dev
```

Visit `http://localhost:3000` to see the site.

📖 **Detailed guide:** See [QUICK_START.md](QUICK_START.md)

---

## 📂 Project Structure

```
virima-documentation/
├── .github/
│   └── workflows/
│       └── deploy.yml          # GitHub Actions deployment
├── components/                  # React components
│   ├── ui/                     # Shadcn UI components
│   ├── DocumentationContent.tsx
│   ├── TableOfContents.tsx
│   ├── AISearchDialogSimplified.tsx
│   ├── ChatPanel.tsx
│   └── ...
├── content/                    # MDX documentation files
│   ├── 5_13/                  # Version 5.13
│   ├── 6_1/                   # Version 6.1 (822 files)
│   │   ├── admin_6_1/
│   │   ├── cmdb_6_1/
│   │   ├── discovery_6_1/
│   │   ├── itam_6_1/
│   │   ├── itsm_6_1/
│   │   └── index.mdx
│   ├── 6_1_1/                 # Version 6.1.1
│   ├── NG/                    # NextGen
│   ├── contentLoader.ts       # Content loading logic
│   └── mdxContentRegistry.ts  # File registry
├── lib/                       # Libraries
│   ├── imports/              # MDX file imports
│   │   └── adminMDXImports.ts
│   ├── chat/                 # Chat functionality
│   └── search/               # Search services
├── utils/                    # Utilities
│   ├── mdxPathResolver.ts
│   ├── tocLoader.ts
│   └── ...
├── styles/
│   └── globals.css           # Global styles
├── docs/                     # Documentation
│   ├── README.md
│   ├── QUICK-START-GUIDE.md
│   └── ...
├── vite.config.ts            # Vite configuration
├── package.json              # Dependencies
├── tsconfig.json             # TypeScript config
├── App.tsx                   # Main entry point
└── index.html                # HTML template
```

---

## 📦 Tech Stack

### Core
- **React 18.3.1** - UI library
- **TypeScript 5.5.3** - Type safety
- **Vite 5.3.1** - Build tool
- **React Router 6.26.0** - Routing

### Styling
- **Tailwind CSS 4.0** - Utility-first CSS
- **Radix UI** - Accessible components
- **Lucide React** - Icon library
- **Framer Motion** - Animations

### Content
- **MDX 3.0** - Markdown with JSX
- **Remark GFM** - GitHub Flavored Markdown
- **Rehype Raw** - Raw HTML support

### Developer Tools
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **GitHub Actions** - CI/CD

---

## 🧩 Modules

### Completed Modules (5/10)

| Module | Status | Files | Version Coverage |
|--------|--------|-------|------------------|
| **Admin** | ✅ Complete | 822 | All versions |
| **Discovery** | ✅ Complete | 822 | All versions |
| **CMDB** | ✅ Complete | 822 | All versions |
| **ITAM** | ✅ Complete | 822 | All versions |
| **ITSM** | ✅ Complete | 822 | All versions |

### Remaining Modules (5/10)

| Module | Status | Target |
|--------|--------|--------|
| **Program/Project Management** | ⏳ Pending | Q1 2026 |
| **Reports** | ⏳ Pending | Q1 2026 |
| **Risk Register** | ⏳ Pending | Q1 2026 |
| **Vulnerability Management** | ⏳ Pending | Q1 2026 |
| **My Dashboard** | ⏳ Pending | Q1 2026 |

---

## 🎯 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server on port 3000 |
| `npm run build` | Create production build in `./build` |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint on TypeScript files |
| `npm run type-check` | Check TypeScript types without emitting |

---

## 🌐 Deployment

### GitHub Pages

This project is configured for automatic deployment to GitHub Pages.

**Deployment URL:** `https://your-org.github.io/FeatureDocsite/`

**Automatic Deployment:**
- Push to `main` branch triggers build and deployment
- GitHub Actions workflow handles the entire process
- Content is served from `build/` directory

**Manual Deployment:**
```bash
# Build the project
npm run build

# The build/ directory is ready for deployment
# GitHub Actions will handle the rest
```

### Custom Domain

To use a custom domain:
1. Add `CNAME` file in `public/` directory
2. Configure DNS settings
3. Update GitHub Pages settings

---

## 📝 Content Management

### Adding New Content

1. **Create MDX file:**
   ```bash
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

### MDX File Template

```mdx
---
title: "Topic Title"
version: "6.1"
module: "admin"
section: "security"
---

# Topic Title

Introduction paragraph explaining the topic.

## Overview

Main content with:
- Bullet points
- **Bold text**
- *Italic text*
- [Links](#)

## Examples

\`\`\`typescript
// Code examples
const example = "Hello World";
\`\`\`

## See Also

- [Related Topic 1](#)
- [Related Topic 2](#)
```

---

## 🔍 Version System

### Version Structure

Each version maintains:
- Independent TOC (Table of Contents)
- Separate content files
- Version-specific features
- No cross-version conflicts

### Version Naming

| Version | Directory | URL Slug |
|---------|-----------|----------|
| 5.13 | `/content/5_13` | `/5.13` |
| 6.1 | `/content/6_1` | `/6.1` |
| 6.1.1 | `/content/6_1_1` | `/6.1.1` |
| NextGen | `/content/NG` | `/nextgen` |

### Adding New Version

1. Create version directory: `content/NEW_VERSION/`
2. Add version constant in `utils/versionContentLoader.ts`
3. Create TOC structure in `data/navigationData.ts`
4. Register content files
5. Test thoroughly

---

## 🎨 Styling Guidelines

### Design System

- **Primary Color:** Virima Green
- **Background:** Milky White (#FAFAFA)
- **Text:** Dark Gray (#333333)
- **Accent:** Blue for links and highlights

### Typography

- **Headings:** Inter font family
- **Body:** System font stack
- **Code:** JetBrains Mono

### Components

All UI components use:
- Tailwind CSS utility classes
- Radix UI primitives for accessibility
- Consistent spacing system
- Responsive breakpoints

---

## 🧪 Testing

### Manual Testing Checklist

- [ ] All versions load correctly
- [ ] Navigation works across all pages
- [ ] Search functionality operational
- [ ] Content displays properly
- [ ] No console errors
- [ ] Mobile responsive
- [ ] All 822 files accessible

### Automated Testing

```bash
# Type checking
npm run type-check

# Linting
npm run lint

# Build verification
npm run build
```

---

## 📊 Performance

### Metrics

- **Build Time:** < 60 seconds
- **Initial Load:** < 3 seconds
- **Cached Load:** < 1 second
- **Lighthouse Score:** 90+

### Optimizations

- Code splitting with dynamic imports
- Lazy loading for routes and content
- Asset optimization
- Tree shaking
- Caching strategy

---

## 🤝 Contributing

### For Developers

1. Fork the repository
2. Create feature branch: `git checkout -b feature/new-feature`
3. Make changes and test thoroughly
4. Run linting: `npm run lint`
5. Run type checking: `npm run type-check`
6. Commit changes: `git commit -m "Add new feature"`
7. Push to branch: `git push origin feature/new-feature`
8. Create Pull Request

### For Content Authors

1. Create MDX file following template
2. Register file in appropriate imports file
3. Update TOC if needed
4. Test locally
5. Submit for review

### Code Style

- Use TypeScript for all new code
- Follow existing naming conventions
- Add JSDoc comments for functions
- Keep components small and focused
- Write self-documenting code

---

## 📄 Documentation

### Available Guides

- [QUICK_START.md](QUICK_START.md) - Getting started guide
- [IMPLEMENTATION_APPLIED.md](IMPLEMENTATION_APPLIED.md) - Implementation details
- [docs/README.md](docs/README.md) - Comprehensive documentation
- [docs/CONTENT-EDITOR-GUIDE.md](docs/CONTENT-EDITOR-GUIDE.md) - Content authoring guide

---

## 🐛 Troubleshooting

### Common Issues

**Issue: Dependencies fail to install**
```bash
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

**Issue: Content not loading**
- Check browser console for errors
- Verify file path in imports registry
- Clear browser cache
- Check base path configuration

**Issue: Build fails**
```bash
npm run type-check  # Check TypeScript errors
npm run lint        # Check linting errors
```

**Issue: Port 3000 in use**
```bash
npx kill-port 3000
# or
npm run dev -- --port 3001
```

---

## 📞 Support

### Getting Help

- **Documentation:** Check `/docs` folder
- **Issues:** Use GitHub Issues
- **Questions:** Contact development team

### Reporting Bugs

When reporting bugs, include:
1. Steps to reproduce
2. Expected behavior
3. Actual behavior
4. Browser/OS information
5. Console errors
6. Screenshots if applicable

---

## 📜 License

This project is proprietary and confidential.

**© 2025 Virima. All rights reserved.**

Unauthorized copying, distribution, or use of this software is strictly prohibited.

---

## 🙏 Acknowledgments

### Technologies

- React Team for React
- Vite Team for Vite
- Vercel for MDX
- Radix UI Team
- Tailwind Labs
- TypeScript Team

### Contributors

Thank you to all the developers and content authors who have contributed to this project.

---

## 📈 Roadmap

### Q1 2026
- [ ] Complete remaining 5 modules
- [ ] Enhance AI search capabilities
- [ ] Add version comparison feature
- [ ] Implement content analytics

### Q2 2026
- [ ] Multi-language support
- [ ] Advanced filtering
- [ ] PDF export functionality
- [ ] API documentation integration

### Q3 2026
- [ ] Mobile app
- [ ] Offline mode
- [ ] Interactive tutorials
- [ ] Video integration

---

## 📊 Statistics

- **Total Files:** 822+ MDX files
- **Versions:** 4 (5.13, 6.1, 6.1.1, NextGen)
- **Modules:** 5 complete, 5 pending
- **Components:** 50+ React components
- **Lines of Code:** 25,000+
- **Dependencies:** 40+ npm packages

---

## 🔗 Links

- **GitHub:** [https://github.com/your-org/FeatureDocsite](https://github.com/your-org/FeatureDocsite)
- **Documentation:** [https://your-org.github.io/FeatureDocsite/](https://your-org.github.io/FeatureDocsite/)
- **Issues:** [https://github.com/your-org/FeatureDocsite/issues](https://github.com/your-org/FeatureDocsite/issues)

---

**Built with ❤️ by the Virima Documentation Team**

*Last updated: November 30, 2025*
