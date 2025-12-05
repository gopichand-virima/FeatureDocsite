# 📚 Virima Documentation Website

> Comprehensive, multi-version documentation platform for Virima ITSM, ITAM, CMDB, Discovery, and Admin modules with advanced features and performance optimizations.



**Live Site**: https://gopichand-virima.github.io/FeatureDocsite/

---

## 🌟 Key Capabilities

### 📖 Multi-Version Documentation System

- **4 Parallel Versions**: Complete support for NextGen (NG), 6.1.1, 6.1, and 5.13
- **1,342+ MDX Files**: Comprehensive documentation across all modules and versions
- **Version Isolation**: Each version maintains independent content, TOC, and navigation
- **Automatic Synchronization**: TOC-driven import system ensures all topics are properly loaded
- **Zero Version Leakage**: Strict version boundaries prevent content mixing

### 🎯 Module Coverage

**12 Complete Modules** across all versions:
- **Admin** - Configuration, organizational details, discovery settings, SACM, users, integrations
- **CMDB** - Configuration management, CI management, relationships, audits
- **Discovery** - Network scanning, cloud imports (AWS, Azure, Meraki, Intune), IPAM, discovered items
- **ITSM** - Incident, change, problem, release, knowledge, request fulfillment, service portfolio
- **ITAM** - Hardware assets, software asset management, contract management, vendor management
- **Dashboard** - Customizable dashboards, widgets, report actions
- **Getting Started** - Authentication, SSO, user management, branding, organization setup
- **Application Overview** - System icons, shared functions, user-specific functions
- **Program/Project Management** - Programs, projects, dashboards
- **Reports** - Ad-hoc reports, canned reports, report management
- **Risk Register** - Risk management, risk dashboard, risk tracking
- **Vulnerability Management** - Vulnerability scanning, assessment, reporting

### ⚡ Performance & Reliability

- **Static MDX Imports (Strategy 1)**: All content bundled at build time for instant loading
- **Zero Runtime Fetch Delays**: Content loads instantly from bundled assets
- **100% Reliability**: No network dependencies for content loading
- **Optimized Builds**: Vite-powered builds with code splitting and tree shaking
- **Image Optimization**: Automatic asset copying and path resolution

### 🎨 User Experience Features

- **Resizable Sidebar**: Drag-to-resize navigation (200-600px range) with locked green indicator
- **Browser History Management**: Full back/forward button support with URL state preservation
- **Deep Linking**: All pages are bookmarkable and shareable with proper URLs
- **Responsive Design**: Mobile, tablet, and desktop optimized
- **Dark Mode Support**: Optional dark theme with smooth transitions
- **Interactive Animations**: Hover effects, icon animations, and smooth transitions
- **Breadcrumb Navigation**: Clear hierarchical navigation trails
- **Search Integration**: AI-powered search with speech-to-text support

### 🔍 Advanced Features

- **AI-Powered Search**: Intelligent content discovery with semantic search
- **Speech-to-Text**: Voice input in search dialog
- **Enterprise Chat**: Persistent conversation history with context awareness
- **Analytics Dashboard**: Monitor documentation usage and engagement
- **Version Comparison**: Compare content across different versions
- **Quick Links**: Direct access to Product Support Policies, Compatibility Matrix, API Integration, Release Notes

### 🛠️ Developer Experience

- **TypeScript**: Full type safety across the entire codebase
- **MDX Support**: Write documentation with React components embedded
- **Hot Module Replacement**: Instant updates during development
- **Path Aliases**: Clean imports (`@/components`, `@/utils`)
- **Automated Import Sync**: Script to synchronize imports from TOC files
- **Linter Integration**: ESLint and TypeScript checking
- **GitHub Actions CI/CD**: Automated testing and deployment

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** >= 18.0.0
- **npm** >= 9.0.0

### Installation

```bash
# Clone the repository
git clone https://github.com/gopichand-virima/FeatureDocsite.git
cd FeatureDocsite

# Install dependencies
npm install

# Start development server
npm run dev
```

The development server will start at `http://localhost:5173`

### Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Create optimized production build |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint for code quality checks |
| `npm run type-check` | Check TypeScript types |

---

## 📁 Project Structure

```
FeatureDocsite/
├── src/
│   ├── components/          # React components
│   │   ├── DocumentationLayout.tsx
│   │   ├── NavigationMenu.tsx
│   │   ├── MDXRenderer.tsx
│   │   ├── HomePage.tsx
│   │   └── ...
│   ├── content/             # MDX documentation files
│   │   ├── NG/              # NextGen version
│   │   ├── 6_1/             # Version 6.1
│   │   ├── 6_1_1/           # Version 6.1.1
│   │   ├── 5_13/            # Version 5.13
│   │   └── contentLoader.ts # Content loading system
│   ├── lib/
│   │   ├── imports/         # Static MDX import files
│   │   │   ├── adminMDXImports.ts
│   │   │   ├── cmdbMDXImports.ts
│   │   │   ├── discoveryMDXImports.ts
│   │   │   └── ...
│   │   └── theme/           # Theme management
│   ├── utils/               # Utility functions
│   │   ├── browserHistory.ts
│   │   ├── hierarchicalTocLoader.ts
│   │   ├── imagePathResolver.ts
│   │   └── ...
│   ├── styles/
│   │   └── globals.css      # Global styles and animations
│   └── App.tsx              # Main application entry
├── scripts/
│   └── sync-imports-from-toc.mjs  # Import synchronization script
├── vite.config.ts           # Vite configuration
└── package.json             # Dependencies and scripts
```

---

## 📝 Content Management

### TOC-Driven Architecture

The documentation uses a **Table of Contents (TOC) driven architecture** where each version has a single `index.mdx` file that serves as the source of truth for navigation:

- **NextGen**: `src/content/NG/index.mdx`
- **Version 6.1**: `src/content/6_1/index.mdx`
- **Version 6.1.1**: `src/content/6_1_1/index.mdx`
- **Version 5.13**: `src/content/5_13/index.mdx`

### Adding New Content

1. **Create the MDX file** in the appropriate version directory:
   ```bash
   src/content/NG/admin_ng/admin_org_details/new_topic_ng.mdx
   ```

2. **Update the TOC** in the version's `index.mdx`:
   ```markdown
   - New Topic → `/content/NG/admin_ng/admin_org_details/new_topic_ng.mdx`
   ```

3. **Synchronize imports** (automated):
   ```bash
   node scripts/sync-imports-from-toc.mjs
   ```

The script automatically:
- Parses all TOC files
- Extracts file paths
- Generates static imports
- Updates content maps
- Verifies files exist

### Content Loading Strategy

The system uses a **multi-strategy content loading approach** with the following priority:

1. **Strategy 1: Static MDX Imports** ⭐ (Highest Priority)
   - Content bundled at build time
   - Instant loading, zero network delay
   - 100% reliability

2. **Strategy 0: Direct Fetch with ?raw**
   - Fallback for files not in static imports
   - Works in both dev and production

3. **Strategy 2: MDX Bundle**
   - Compiled MDX content

4. **Strategy 3: Server Fetch**
   - Network-based content loading

5. **Strategy 4: Registry Placeholder**
   - Fallback placeholder content

---

## 🎯 Key Features

### Browser History Management

- **Full Back/Forward Support**: Browser navigation buttons work correctly
- **URL State Preservation**: All navigation state is reflected in the URL
- **Deep Linking**: Every page has a unique, shareable URL
- **GitHub Pages Compatible**: Handles base path (`/FeatureDocsite/`) correctly

### Universal Styling

- **Table Styling**: All tables have:
  - Green header background (#2E7D32) with white text
  - Dark borders on all cells
  - No rounded corners
  - Consistent appearance across all pages

- **Image Styling**: All images have:
  - 1/2 weight border (0.5px)
  - Proper path resolution
  - Automatic asset copying during build

### Navigation Features

- **Active State Logic**: Only active parent sections are highlighted
- **Expansion State**: Independent from active styling
- **Hierarchical Navigation**: Multi-level nested navigation support
- **Module Switching**: Seamless module navigation without page reload

### Interactive Elements

- **Homepage Cards**: Interactive hover effects with color-coded themes:
  - Release Notes: Green highlight
  - Compatibility Matrix: Purple highlight
  - API Integration: Blue highlight
  - Product Support Policies: Green highlight

- **Icon Animations**: Smooth, slow animations:
  - Admin: 2 rotations over 4 seconds
  - Dashboard: Bounce animation (2 seconds)
  - CMDB: Scale-in-ver-bottom animation
  - ITAM: Scale-in-hor-center animation

---

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the root directory (optional):

```env
# Base URL for GitHub Pages (if different from default)
VITE_BASE_URL=/FeatureDocsite/
```

### GitHub Pages Deployment

The project is configured for GitHub Pages deployment:

1. **Build the project**:
   ```bash
   npm run build
   ```

2. **Deploy to gh-pages branch**:
   ```bash
   npm run deploy
   ```

3. **Configure GitHub Pages** to use the `gh-pages` branch

---

## 📊 Statistics

- **Total MDX Files**: 1,342+ files across all versions
- **Modules**: 12 complete modules
- **Versions**: 4 parallel version systems
- **Static Imports**: All content files use Strategy 1 (static imports)
- **Build Time**: Optimized with Vite for fast builds
- **Load Time**: Instant content loading (no network delays)

---

## 🛡️ Quality Assurance

### Code Quality

- **TypeScript**: Full type safety
- **ESLint**: Code quality enforcement
- **No Console Errors**: All duplicate identifier issues resolved
- **No Linter Warnings**: Clean codebase

### Content Quality

- **TOC Synchronization**: Automated import synchronization ensures no missing topics
- **File Verification**: Script verifies files exist before importing
- **Path Validation**: Automatic path resolution and correction

---

## 🤝 Contributing

### For Content Authors

1. Edit the appropriate version's `index.mdx` file
2. Add or modify MDX files in the version directory
3. Run the synchronization script: `node scripts/sync-imports-from-toc.mjs`
4. Test locally with `npm run dev`

### For Developers

1. Follow TypeScript best practices
2. Maintain version isolation
3. Use static imports for all new content
4. Update TOC files when adding new topics
5. Run linter before committing: `npm run lint`

---

## 📚 Documentation

- **Architecture**: See `src/docs/` for detailed architecture documentation
- **Tutorials**: See `tutorials/` for guides and checklists
- **API Reference**: Check component files for JSDoc comments

---

## 🐛 Troubleshooting

### Content Not Loading

1. **Check if file exists**: Verify the MDX file exists in the filesystem
2. **Check TOC entry**: Ensure the path in `index.mdx` matches the actual file path
3. **Run sync script**: `node scripts/sync-imports-from-toc.mjs` to update imports
4. **Check console**: Look for Strategy 1 success messages

### Build Errors

1. **Check for duplicate imports**: Run `npm run type-check`
2. **Verify file paths**: Ensure all paths in imports are correct
3. **Check for missing files**: The sync script will warn about missing files

---

[![Build Status](https://img.shields.io/github/actions/workflow/status/gopichand-virima/FeatureDocsite/deploy.yml?branch=main)](https://github.com/gopichand-virima/FeatureDocsite/actions)
[![Node Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5.3-blue)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/license-Proprietary-red)](LICENSE)

## 📄 License

Proprietary - All rights reserved

---

## 🙏 Acknowledgments

Built with:
- **React** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool
- **MDX** - Content format
- **Tailwind CSS** - Styling
- **GitHub Pages** - Hosting

---

**Last Updated**: December 2025
