# Virima Documentation Website - Built with Rspress

**Production Documentation Site**: https://gopichand-virima.github.io/FeatureDocsite/

This is the official documentation website for Virima, built using **Rspress** - a high-performance static site generator. The site supports multiple versions (NextGen, 6.1.1, 6.1, 5.13) with comprehensive SEO optimization, interactive navigation, and modern user experience.

---

## 📋 Table of Contents

- [What is Rspress?](#what-is-rspress)
- [Project Overview](#project-overview)
- [Getting Started from Scratch](#getting-started-from-scratch)
- [Project Structure](#project-structure)
- [Key Files and Their Roles](#key-files-and-their-roles)
- [Leveraging Rspress Plugins](#leveraging-rspress-plugins)
- [Writer Workflow](#writer-workflow)
- [Content Guidelines](#content-guidelines)
- [SEO Metadata Requirements](#seo-metadata-requirements)
- [Building and Deployment](#building-and-deployment)
- [Troubleshooting](#troubleshooting)

---

## What is Rspress?

**Rspress** is a modern static site generator built on **Rsbuild** (a Rust-based front-end toolchain). It's specifically designed for creating fast, scalable documentation websites.

### Why Rspress?

✅ **Blazing Fast Build Speed**: Rust-based toolchain provides exceptional performance  
✅ **MDX Support**: Write content in Markdown with React components  
✅ **Built-in Search**: Automatic full-text search index generation  
✅ **SEO Optimized**: Built-in support for meta tags and structured data  
✅ **Multi-Version Support**: Easy to manage multiple documentation versions  
✅ **Static Site Generation**: Generates static HTML for easy deployment  
✅ **Plugin System**: Extensible through plugins for custom functionality  

### Official Resources

- **Website**: https://rspress.rs/
- **Getting Started Guide**: https://rspress.rs/guide/start/getting-started
- **Documentation**: https://rspress.rs/guide

---

## Project Overview

### What This Project Does

This is a **Rspress-based documentation website** that:
- Displays Virima documentation across multiple versions (NextGen, 6.1.1, 6.1, 5.13)
- Provides interactive navigation with expandable sidebar
- Generates SEO-optimized pages with proper meta tags
- Creates breadcrumb navigation automatically
- Supports MDX (Markdown + JSX) for rich content formatting
- Includes built-in full-text search functionality

### Key Highlights

✅ **Multi-Version Support**: NextGen, 6.1.1, 6.1, 5.13  
✅ **11 Complete Modules**: Admin, ITSM, ITAM, CMDB, Discovery Scan, My Dashboard, Self Service, Program/Project Management, Risk Register, Reports, Vulnerability Management  
✅ **SEO Optimized**: Automatic sitemap generation, meta tags, structured data  
✅ **Smart Navigation**: 7-level breadcrumb hierarchy, clickable navigation  
✅ **Automated Deployment**: GitHub Actions CI/CD  
✅ **Built-in Search**: Full-text search across all documentation  
✅ **User Feedback System**: Integrated feedback survey on all pages  
✅ **Version-Aware Image Mapping**: Automatic image path transformation  

### Technology Stack

- **Static Site Generator**: Rspress (built on Rsbuild)
- **Content Format**: MDX (Markdown + JSX)
- **Styling**: Tailwind CSS (via Rspress theme)
- **Search**: Built-in full-text search (auto-generated)
- **SEO**: Built-in meta tags and structured data support
- **Deployment**: GitHub Pages (static HTML)

---

## Getting Started from Scratch

This section guides you step-by-step on how to build this Virima documentation project from scratch using Rspress.

### Prerequisites

Before you begin, ensure you have:

1. **Node.js** (version 18 or 20)
   - Download from: https://nodejs.org/
   - Verify installation: `node --version`

2. **npm** (comes with Node.js)
   - Verify installation: `npm --version`

3. **Git** (for version control)
   - Download from: https://git-scm.com/
   - Verify installation: `git --version`

4. **Text Editor** (VS Code recommended)
   - Download from: https://code.visualstudio.com/

### Step 1: Create a New Rspress Project

Open your terminal (Command Prompt on Windows, Terminal on Mac/Linux) and run:

```bash
# Create a new Rspress project
npm create rspress@latest virima-docs

# Navigate into the project folder
cd virima-docs
```

**What happens**: Rspress creates a new project folder with all necessary files and configurations.

**Expected output**: You'll see a folder structure like:
```
virima-docs/
├── docs/              # Your documentation content goes here
├── rspress.config.ts  # Rspress configuration file
├── package.json       # Project dependencies
└── ...
```

### Step 2: Install Dependencies

```bash
# Install all required packages
npm install
```

**What happens**: npm downloads and installs all the packages Rspress needs to work.

**Time**: This may take 2-5 minutes depending on your internet speed.

### Step 3: Understand the Project Structure

After installation, your project will have:

```
virima-docs/
├── docs/                    # 📝 Your documentation content
│   └── index.md            # Homepage content
├── rspress.config.ts        # Main configuration file
├── package.json             # Project dependencies
├── tsconfig.json            # TypeScript configuration
└── node_modules/            # Installed packages (don't edit)
```

### Step 4: Configure Rspress for Multi-Version Support

Edit `rspress.config.ts` to set up multi-version documentation:

```typescript
import { defineConfig } from 'rspress/config';

export default defineConfig({
  root: 'docs',
  title: 'Virima Documentation',
  description: 'Comprehensive documentation for Virima IT management platform',
  lang: 'en',
  
  // Multi-version configuration
  themeConfig: {
    versions: [
      { label: 'NextGen', value: 'NextGen' },
      { label: '6.1.1', value: '6.1.1' },
      { label: '6.1', value: '6.1' },
      { label: '5.13', value: '5.13' },
    ],
  },
  
  // SEO configuration
  head: [
    ['meta', { name: 'keywords', content: 'Virima, IT Management, CMDB, ITSM' }],
  ],
  
  // Build output
  outDir: 'build',
});
```

**Save the file** after making changes.

### Step 5: Organize Your Content Structure

Create folders for each version:

```bash
# Create version folders
mkdir -p docs/NextGen
mkdir -p docs/6_1
mkdir -p docs/6_1_1
mkdir -p docs/5_13

# Create module folders for version 6.1 (example)
mkdir -p docs/6_1/admin_6_1
mkdir -p docs/6_1/cmdb_6_1
mkdir -p docs/6_1/itsm_6_1
mkdir -p docs/6_1/my_dashboard_6_1
# ... create other module folders
```

**Tip**: You can create folders manually in your file explorer or use the terminal commands above.

### Step 6: Create Your First Documentation Page

Create a new MDX file:

```bash
# Example: Create a CMDB access page for version 6.1
# Windows (PowerShell):
New-Item -Path "docs/6_1/cmdb_6_1/access-cmdb.mdx" -ItemType File

# Mac/Linux:
touch docs/6_1/cmdb_6_1/access-cmdb.mdx
```

Add content to the file:

```mdx
---
title: Access CMDB
description: Step-by-step guide to accessing the Configuration Management Database (CMDB) in Virima
---

# Access CMDB

This page explains how to access the CMDB in Virima...

## Steps

1. Navigate to the CMDB module
2. Click on the CMDB icon
3. You'll see the CMDB dashboard

## Additional Information

For more details, see the [Manage CMDB](./manage-cmdb) page.
```

**Save the file**.

### Step 7: Configure Navigation

Edit `rspress.config.ts` to add navigation structure:

```typescript
import { defineConfig } from 'rspress/config';

export default defineConfig({
  // ... previous config ...
  
  themeConfig: {
    // ... previous themeConfig ...
    
    // Sidebar navigation
    sidebar: {
      '/6_1/': [
        {
          text: 'CMDB',
          items: [
            { text: 'Access CMDB', link: '/6_1/cmdb_6_1/access-cmdb' },
            { text: 'Manage CMDB', link: '/6_1/cmdb_6_1/manage-cmdb' },
          ],
        },
        {
          text: 'Admin',
          items: [
            { text: 'Organizational Details', link: '/6_1/admin_6_1/organizational-details' },
            // ... more items
          ],
        },
      ],
    },
  },
});
```

### Step 8: Start the Development Server

```bash
npm run dev
```

**What happens**: Rspress starts a local development server.

**Expected output**: You'll see something like:
```
  VITE v6.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

**Open your browser** and go to `http://localhost:5173`

**You should see**: Your documentation site running locally!

### Step 9: Build for Production

When you're ready to deploy:

```bash
npm run build
```

**What happens**: Rspress generates static HTML files in the `build` folder.

**Expected output**: You'll see:
```
✓ built in xxx ms
```

**Result**: All your documentation is now in static HTML files ready to deploy.

### Step 10: Preview Production Build

Before deploying, preview how it will look:

```bash
npm run preview
```

**What happens**: Rspress serves the built files locally so you can test the production version.

---

## Project Structure

```
FeatureDocsite/
├── docs/                      # 📝 YOUR CONTENT GOES HERE
│   ├── index.md              # Homepage
│   │
│   ├── 6_1/                  # Version 6.1 content
│   │   ├── admin_6_1/        # Admin module
│   │   │   ├── admin_sacm/   # SACM sub-module
│   │   │   │   └── cmdb-graphical-workflow.mdx
│   │   │   ├── admin_discovery/
│   │   │   └── ...
│   │   ├── cmdb_6_1/         # CMDB module
│   │   │   ├── access-cmdb.mdx
│   │   │   └── manage-cmdb.mdx
│   │   ├── itsm_6_1/         # ITSM module
│   │   ├── my_dashboard_6_1/ # My Dashboard module
│   │   └── ...               # Other modules
│   │
│   ├── NG/                   # NextGen content
│   │   ├── my-dashboard/
│   │   │   └── overview.mdx
│   │   └── ...
│   │
│   ├── 6_1_1/                # Version 6.1.1 content
│   ├── 5_13/                 # Version 5.13 content
│   └── .rspress/             # Rspress internal files (auto-generated)
│
├── public/                    # Static assets
│   ├── robots.txt            # Search engine rules
│   ├── sitemap.xml           # Generated sitemap
│   └── images_*/              # Version-specific images
│       ├── images_6_1/
│       ├── images_ng/
│       └── ...
│
├── rspress.config.ts          # Rspress configuration
├── package.json               # Project dependencies
├── tsconfig.json              # TypeScript config
└── .github/
    └── workflows/
        └── deploy.yml         # GitHub Actions deployment
```

### Content Organization

**Version 6.1** (Most Complete):
- Location: `docs/6_1/`
- Format: `{module}_6_1/{topic-name}.mdx` or `{topic-name}-6_1.mdx`
- Example: `docs/6_1/cmdb_6_1/access-cmdb.mdx`
- **Image Paths**: Use relative paths like `./images/dashboard.png` or `/images_6_1/dashboard.png`

**NextGen**:
- Location: `docs/NG/` or `docs/NextGen/`
- Format: `{topic-name}.mdx` or `{topic-name}_ng.mdx`
- Example: `docs/NG/my-dashboard/overview.mdx`
- **Image Paths**: Use `/images_ng/dashboard.png`

**Other Versions** (6.1.1, 5.13):
- Location: `docs/{version}/`
- Format: `overview.mdx` or `{topic-name}.mdx`

---

## Key Files and Their Roles

### For Writers (Files You'll Edit)

#### 1. MDX Content Files
**Location**: `docs/{version}/{module}/`

**Role**: Your actual documentation content
- Write documentation in Markdown format
- Add frontmatter (YAML metadata) at the top
- Use MDX for rich formatting and React components

**Example Structure**:
```mdx
---
title: "Page Title"
description: "Page description for SEO (150-160 characters)"
pageType: "doc"
---

# Page Title

Your content here...

## Section 1

Content for section 1...

### Subsection

More content...
```

#### 2. Navigation Configuration
**Location**: `rspress.config.ts`

**Role**: Defines the sidebar navigation structure
- **When to edit**: Adding new sections or reorganizing navigation
- Configured in the `sidebar` object within `themeConfig`

**Example**:
```typescript
sidebar: {
  '/6_1/': [
    {
      text: 'CMDB',
      items: [
        { text: 'Access CMDB', link: '/6_1/cmdb_6_1/access-cmdb' },
        { text: 'Manage CMDB', link: '/6_1/cmdb_6_1/manage-cmdb' },
      ],
    },
  ],
},
```

#### 3. Rspress Configuration
**Location**: `rspress.config.ts`

**Role**: Main configuration file for Rspress
- **When to edit**: Changing site title, description, theme settings, plugins
- Controls build behavior, SEO settings, and site-wide options

**Key Settings**:
```typescript
export default defineConfig({
  root: 'docs',                    // Content root directory
  title: 'Virima Documentation',  // Site title
  description: '...',              // Site description
  lang: 'en',                     // Language
  outDir: 'build',                // Build output directory
});
```

### For Developers (Files You Usually Don't Edit)

#### 4. `package.json`
**Role**: Project dependencies and scripts
- Lists all npm packages the project uses
- Defines scripts for development, building, and deployment
- **Edit when**: Adding new dependencies or scripts

#### 5. `tsconfig.json`
**Role**: TypeScript configuration
- Configures TypeScript compiler options
- **Don't edit** unless you know what you're doing

#### 6. `.github/workflows/deploy.yml`
**Role**: Automated deployment workflow
- Automatically deploys to GitHub Pages when you push changes
- **Don't edit** unless changing deployment settings

---

## Leveraging Rspress Plugins

The Rspress plugin system is a powerful way to extend and customize your Virima documentation site. Plugins allow you to enhance Markdown/MDX compilation, add custom pages, modify build behavior, extend page metadata, and add global components.

**Official Plugin Documentation**: [Rspress Plugin System](https://rspress.rs/plugin/system/introduction)

### Understanding the Plugin System

Rspress plugins can extend capabilities in two main areas:

1. **Node Side** (Build Time):
   - Markdown/MDX compilation
   - Custom page generation
   - Build tool configuration
   - Metadata processing

2. **Browser Runtime** (Client Side):
   - Global React components
   - Page enhancements
   - Custom logic and side effects

### How Plugins Work in Virima Documentation

For the Virima FeatureDocsite project, plugins can be leveraged to implement:

- ✅ **Version-Aware Image Path Transformation**
- ✅ **Multi-Version Content Routing**
- ✅ **SEO Metadata Enhancement**
- ✅ **Feedback Form Integration**
- ✅ **Custom Breadcrumb Navigation**
- ✅ **Error Handling Components**
- ✅ **Last Updated Timestamps**

---

### Official Plugins for Virima Documentation

#### 1. Plugin: Last Updated Timestamp

**Use Case**: Display when each documentation page was last modified

**Installation**:
```bash
npm install @rspress/plugin-last-updated
```

**Configuration** (`rspress.config.ts`):
```typescript
import { defineConfig } from 'rspress/config';
import { pluginLastUpdated } from '@rspress/plugin-last-updated';

export default defineConfig({
  plugins: [
    pluginLastUpdated(),
  ],
});
```

**Benefit for Virima**: Shows users when content was last updated, helping them identify fresh information.

**Reference**: [Plugin Last Updated](https://rspress.rs/plugin/official-plugins/last-updated)

---

#### 2. Plugin: Medium Zoom (Image Enhancement)

**Use Case**: Enable zoom functionality for images in documentation

**Installation**:
```bash
npm install @rspress/plugin-medium-zoom
```

**Configuration** (`rspress.config.ts`):
```typescript
import { defineConfig } from 'rspress/config';
import { pluginMediumZoom } from '@rspress/plugin-medium-zoom';

export default defineConfig({
  plugins: [
    pluginMediumZoom({
      selector: '.rspress-doc img', // Target images in documentation
    }),
  ],
});
```

**Benefit for Virima**: Users can zoom into screenshots and diagrams for better visibility, especially useful for CMDB workflows and admin configurations.

**Reference**: [Plugin Medium Zoom](https://rspress.rs/plugin/official-plugins/medium-zoom)

---

#### 3. Plugin: Client Redirects

**Use Case**: Handle URL redirects for version migrations and page moves

**Installation**:
```bash
npm install @rspress/plugin-client-redirects
```

**Configuration** (`rspress.config.ts`):
```typescript
import { defineConfig } from 'rspress/config';
import { pluginClientRedirects } from '@rspress/plugin-client-redirects';

export default defineConfig({
  plugins: [
    pluginClientRedirects({
      redirects: [
        // Redirect old URLs to new structure
        { from: '/6.1/cmdb/access', to: '/6_1/cmdb_6_1/access-cmdb' },
        { from: '/NextGen/dashboard', to: '/NG/my-dashboard/overview' },
        // ... more redirects
      ],
    }),
  ],
});
```

**Benefit for Virima**: Maintains backward compatibility when restructuring content or migrating between versions.

**Reference**: [Plugin Client Redirects](https://rspress.rs/plugin/official-plugins/client-redirects)

---

#### 4. Plugin: Container Syntax

**Use Case**: Add custom callout boxes (info, warning, tip, danger)

**Installation**:
```bash
npm install @rspress/plugin-container-syntax
```

**Configuration** (`rspress.config.ts`):
```typescript
import { defineConfig } from 'rspress/config';
import { pluginContainerSyntax } from '@rspress/plugin-container-syntax';

export default defineConfig({
  plugins: [
    pluginContainerSyntax(),
  ],
});
```

**Usage in MDX**:
```mdx
:::tip Version-Specific Note
This feature is available in version 6.1 and later.
:::

:::warning Important
Restart the Discovery Client after making configuration changes.
:::
```

**Benefit for Virima**: Highlight important information, version-specific notes, and warnings in documentation.

**Reference**: [Plugin Container Syntax](https://rspress.rs/plugin/official-plugins/container-syntax)

---

#### 5. Plugin: Shiki (Code Highlighting)

**Use Case**: Enhanced syntax highlighting for code blocks

**Installation**:
```bash
npm install @rspress/plugin-shiki
```

**Configuration** (`rspress.config.ts`):
```typescript
import { defineConfig } from 'rspress/config';
import { pluginShiki } from '@rspress/plugin-shiki';

export default defineConfig({
  plugins: [
    pluginShiki({
      theme: 'github-light', // or 'github-dark'
    }),
  ],
});
```

**Benefit for Virima**: Better code highlighting for API examples, configuration snippets, and command-line instructions.

**Reference**: [Plugin Shiki](https://rspress.rs/plugin/official-plugins/shiki)

---

### Custom Plugins for Virima-Specific Features

#### Custom Plugin 1: Version-Aware Image Path Transformer

**Purpose**: Automatically transform image paths based on content version

**Create**: `plugins/image-path-transformer.ts`

```typescript
import { RspressPlugin } from '@rspress/shared';
import type { Plugin } from 'unified';
import { visit } from 'unist-util-visit';

export function pluginImagePathTransformer(): RspressPlugin {
  return {
    name: 'image-path-transformer',
    markdown: {
      remarkPlugins: [
        () => {
          return (tree: any, file: any) => {
            visit(tree, 'image', (node: any) => {
              const filePath = file.path || '';
              
              // Determine version from file path
              let imageFolder = '';
              if (filePath.includes('/6_1/')) {
                imageFolder = '/images_6_1';
              } else if (filePath.includes('/NG/') || filePath.includes('/NextGen/')) {
                imageFolder = '/images_ng';
              } else if (filePath.includes('/6_1_1/')) {
                imageFolder = '/images_6_1_1';
              } else if (filePath.includes('/5_13/')) {
                imageFolder = '/images_5_13';
              }
              
              // Transform paths like ../Resources/Images/... to /images_{version}/...
              if (node.url && node.url.includes('Resources/Images/') && imageFolder) {
                const relativePath = node.url.split('Resources/Images/')[1];
                node.url = `${imageFolder}/${relativePath}`;
              }
            });
          };
        },
      ],
    },
  };
}
```

**Usage** (`rspress.config.ts`):
```typescript
import { pluginImagePathTransformer } from './plugins/image-path-transformer';

export default defineConfig({
  plugins: [
    pluginImagePathTransformer(),
  ],
});
```

**Benefit**: Automatically converts `../Resources/Images/...` paths to version-specific `/images_{version}/...` paths.

---

#### Custom Plugin 2: Feedback Form Integration

**Purpose**: Add feedback forms to all documentation pages

**Create**: `plugins/feedback-form.ts`

```typescript
import { RspressPlugin } from '@rspress/shared';
import path from 'path';

export function pluginFeedbackForm(): RspressPlugin {
  return {
    name: 'feedback-form',
    // Add global component
    globalComponents: [
      path.join(__dirname, '../components/FeedbackSection.tsx'),
    ],
    // Inject into every page
    markdown: {
      rehypePlugins: [
        () => {
          return (tree: any) => {
            // Add feedback component before closing article tag
            // Implementation details...
          };
        },
      ],
    },
  };
}
```

**Benefit**: Automatically includes feedback forms on all documentation pages without manual addition.

---

#### Custom Plugin 3: Enhanced SEO Metadata

**Purpose**: Extend page metadata with Virima-specific SEO fields

**Create**: `plugins/enhanced-seo.ts`

```typescript
import { RspressPlugin } from '@rspress/shared';

export function pluginEnhancedSEO(): RspressPlugin {
  return {
    name: 'enhanced-seo',
    // Extend page metadata
    extendPageData(pageData) {
      // Add canonical URL based on version
      const version = pageData.routePath.split('/')[1];
      pageData.frontmatter.canonical = 
        `https://docs.virima.com${pageData.routePath}`;
      
      // Add structured data
      pageData.frontmatter.structuredData = {
        '@type': 'TechArticle',
        headline: pageData.frontmatter.title,
        description: pageData.frontmatter.description,
      };
    },
  };
}
```

**Benefit**: Automatically generates canonical URLs and structured data for better SEO.

---

#### Custom Plugin 4: Multi-Version Navigation Helper

**Purpose**: Automatically generate navigation structure from file system

**Create**: `plugins/multi-version-nav.ts`

```typescript
import { RspressPlugin } from '@rspress/shared';
import fs from 'fs';
import path from 'path';

export function pluginMultiVersionNav(): RspressPlugin {
  return {
    name: 'multi-version-nav',
    config(config) {
      // Auto-generate sidebar navigation from file structure
      const versions = ['6_1', 'NG', '6_1_1', '5_13'];
      const sidebar: Record<string, any[]> = {};
      
      versions.forEach(version => {
        const versionPath = path.join(process.cwd(), 'docs', version);
        if (fs.existsSync(versionPath)) {
          sidebar[`/${version}/`] = generateNavItems(versionPath, version);
        }
      });
      
      config.themeConfig = {
        ...config.themeConfig,
        sidebar: {
          ...config.themeConfig?.sidebar,
          ...sidebar,
        },
      };
      
      return config;
    },
  };
}

function generateNavItems(dirPath: string, version: string): any[] {
  // Recursively scan directory and generate navigation items
  // Implementation...
  return [];
}
```

**Benefit**: Automatically generates navigation structure from file system, reducing manual configuration.

---

### Complete Plugin Configuration Example

Here's how to configure multiple plugins for the Virima documentation:

**`rspress.config.ts`**:
```typescript
import { defineConfig } from 'rspress/config';
import { pluginLastUpdated } from '@rspress/plugin-last-updated';
import { pluginMediumZoom } from '@rspress/plugin-medium-zoom';
import { pluginClientRedirects } from '@rspress/plugin-client-redirects';
import { pluginContainerSyntax } from '@rspress/plugin-container-syntax';
import { pluginShiki } from '@rspress/plugin-shiki';
import { pluginImagePathTransformer } from './plugins/image-path-transformer';
import { pluginFeedbackForm } from './plugins/feedback-form';
import { pluginEnhancedSEO } from './plugins/enhanced-seo';

export default defineConfig({
  root: 'docs',
  title: 'Virima Documentation',
  description: 'Comprehensive documentation for Virima IT management platform',
  
  plugins: [
    // Official plugins
    pluginLastUpdated(),
    pluginMediumZoom({
      selector: '.rspress-doc img',
    }),
    pluginClientRedirects({
      redirects: [
        // Add your redirects here
      ],
    }),
    pluginContainerSyntax(),
    pluginShiki({
      theme: 'github-light',
    }),
    
    // Custom plugins for Virima
    pluginImagePathTransformer(),
    pluginFeedbackForm(),
    pluginEnhancedSEO(),
  ],
  
  themeConfig: {
    versions: [
      { label: 'NextGen', value: 'NextGen' },
      { label: '6.1.1', value: '6.1.1' },
      { label: '6.1', value: '6.1' },
      { label: '5.13', value: '5.13' },
    ],
  },
});
```

---

### Plugin Development Workflow

#### Step 1: Create Plugin File

Create a new file: `plugins/my-custom-plugin.ts`

```typescript
import { RspressPlugin } from '@rspress/shared';

export function pluginMyCustom(): RspressPlugin {
  return {
    name: 'my-custom-plugin',
    // Plugin implementation
  };
}
```

#### Step 2: Add Plugin to Configuration

```typescript
import { pluginMyCustom } from './plugins/my-custom-plugin';

export default defineConfig({
  plugins: [
    pluginMyCustom(),
  ],
});
```

#### Step 3: Test Plugin

```bash
npm run dev
# Test your plugin functionality
```

#### Step 4: Build and Verify

```bash
npm run build
# Ensure plugin works in production build
```

---

### Plugin Capabilities Summary

| Capability | Use Case for Virima | Example |
|------------|---------------------|---------|
| **Markdown/MDX Compilation** | Transform image paths, add custom syntax | Image path transformer |
| **Custom Pages** | Add feedback page, version selector | Feedback form page |
| **Build Tool Config** | Optimize images, add build steps | Image optimization |
| **Page Metadata** | Add SEO fields, canonical URLs | Enhanced SEO plugin |
| **Global Components** | Add feedback forms, error boundaries | Feedback component |
| **Pre/Post Build Hooks** | Generate sitemap, cleanup files | Sitemap generator |

---

### Best Practices for Plugins

1. **Start with Official Plugins**: Use official plugins when possible before creating custom ones
2. **Keep Plugins Focused**: Each plugin should do one thing well
3. **Document Your Plugins**: Add comments explaining what each plugin does
4. **Test Thoroughly**: Test plugins in both development and production builds
5. **Version Control**: Keep plugin files in version control

---

### Plugin Resources

- **Official Plugin Documentation**: https://rspress.rs/plugin/system/introduction
- **Plugin API Reference**: https://rspress.rs/plugin/system/plugin-api
- **Official Plugins List**: https://rspress.rs/plugin/official-plugins/overview
- **Community Plugins**: https://rspress.rs/plugin/community-plugins/overview

---

## Writer Workflow

### Adding a New Topic

1. **Create the MDX File**
   ```bash
   # Example: Adding a new CMDB topic for version 6.1
   # Create the file in: docs/6_1/cmdb_6_1/my-new-topic.mdx
   ```

2. **Add Frontmatter and Content**
   ```mdx
   ---
   title: "My New Topic"
   description: "Clear description of what this page covers (150-160 characters)"
   pageType: "doc"
   ---
   
   # My New Topic
   
   Your content here...
   ```

3. **Add to Navigation**
   - Edit `rspress.config.ts`
   - Add the page to the appropriate section in the `sidebar` configuration
   ```typescript
   sidebar: {
     '/6_1/': [
       {
         text: 'CMDB',
         items: [
           { text: 'Access CMDB', link: '/6_1/cmdb_6_1/access-cmdb' },
           { text: 'My New Topic', link: '/6_1/cmdb_6_1/my-new-topic' }, // Add this
         ],
       },
     ],
   },
   ```

4. **Test Locally**
   ```bash
   npm run dev
   # Navigate to the new page in browser
   # Verify it loads correctly
   ```

5. **Build and Verify**
   ```bash
   npm run build
   # Check for any errors
   ```

### Updating Existing Content

1. **Edit the MDX File**
   - Open the file in `docs/{version}/{module}/`
   - Make your changes
   - Update frontmatter if needed

2. **Test Locally**
   ```bash
   npm run dev
   # Verify changes look correct
   ```

3. **Build Before Committing**
   ```bash
   npm run build
   ```

### Daily Writing Checklist

- [ ] Start dev server: `npm run dev`
- [ ] Edit MDX files in `docs/`
- [ ] Add/update frontmatter with proper metadata
- [ ] Update navigation in `rspress.config.ts` if adding new pages
- [ ] Test in browser (check navigation, content)
- [ ] Run `npm run build` to check for errors
- [ ] Commit and push changes

---

## Content Guidelines

### File Naming

**Version 6.1:**
- Use hyphens: `my-topic.mdx` or `my-topic-6_1.mdx`
- Be consistent within a module
- Match the pattern used in the module folder

**NextGen:**
- Use hyphens: `my-topic.mdx` or `my-topic_ng.mdx`
- Module overview files: `overview.mdx` or `overview_ng.mdx`

### Image Paths in MDX Files

**In Your MDX Files:**
- Use absolute paths from public folder: `/images_6_1/folder/image.png`
- Or relative paths: `./images/dashboard.png`
- Place images in `public/images_{version}/` folders

**Example:**
```mdx
![Screenshot](/images_6_1/CMDB/dashboard.png)
```

**Image Folder Structure:**
- Place images in `public/images_{version}/` folders
- Example: `public/images_6_1/CMDB/dashboard.png`

### Frontmatter Requirements

**Every MDX file SHOULD have frontmatter:**

```yaml
---
title: "Page Title"                    # Required: 50-60 characters
description: "Page description..."     # Required: 150-160 characters
pageType: "doc"                        # Optional: "doc" or "page"
---
```

### Writing Best Practices

1. **Use Clear Headings**
   - Start with H1 (`#`) for page title
   - Use H2 (`##`) for main sections
   - Use H3 (`###`) for subsections

2. **Keep Descriptions Concise**
   - 150-160 characters for SEO
   - Summarize what the page covers
   - Include key search terms

3. **Use Consistent Formatting**
   - Follow existing patterns in the module
   - Use code blocks for commands/examples
   - Use lists for step-by-step instructions

4. **Leverage Rspress Features**
   - Use built-in components for code blocks
   - Take advantage of automatic search indexing
   - Use MDX for interactive components when needed

---

## SEO Metadata Requirements

### Why It Matters

SEO metadata helps your documentation appear in Google search results. Rspress automatically generates meta tags from your frontmatter.

### Required Frontmatter Fields

| Field | Required | Format | Example |
|-------|----------|--------|---------|
| `title` | ✅ Yes | String, 50-60 chars | `"Access CMDB"` |
| `description` | ✅ Yes | String, 150-160 chars | `"Step-by-step guide to accessing CMDB..."` |

### SEO Configuration in Rspress

Rspress automatically:
- Generates `<title>` tags from frontmatter
- Creates meta descriptions
- Generates sitemap.xml
- Adds structured data for better search results

**Configure in `rspress.config.ts`**:
```typescript
export default defineConfig({
  // ... other config ...
  
  // SEO settings
  head: [
    ['meta', { name: 'keywords', content: 'Virima, CMDB, ITSM' }],
    ['link', { rel: 'canonical', href: 'https://docs.virima.com' }],
  ],
});
```

### Quick SEO Checklist

- [ ] Title is clear and descriptive (50-60 chars)
- [ ] Description is unique and helpful (150-160 chars)
- [ ] Keywords are relevant
- [ ] Content is well-structured with headings
- [ ] Images have alt text

---

## Building and Deployment

### Development

```bash
# Start development server with hot-reload
npm run dev
```

**Access**: `http://localhost:5173`

### Production Build

```bash
# Build static site
npm run build
```

**Output**: Static HTML files in `build/` folder

### Preview Production Build

```bash
# Preview the built site locally
npm run preview
```

### Deployment to GitHub Pages

#### Option 1: Manual Deployment

```bash
# Build the site
npm run build

# Deploy to GitHub Pages (if using gh-pages package)
npm run deploy
```

#### Option 2: Automated Deployment (Recommended)

The project uses GitHub Actions for automatic deployment:

1. **Push changes to GitHub**
   ```bash
   git add .
   git commit -m "Update documentation"
   git push
   ```

2. **GitHub Actions automatically**:
   - Builds the site
   - Deploys to GitHub Pages
   - Updates the live site

**No manual steps needed!**

### Build Process

1. ✅ Rspress reads all MDX files from `docs/`
2. ✅ Processes frontmatter and content
3. ✅ Generates navigation structure
4. ✅ Creates search index
5. ✅ Generates static HTML files
6. ✅ Outputs to `build/` folder

---

## Troubleshooting

### Common Issues

#### Issue: Development server won't start
**Solution**:
1. Check Node.js version: `node --version` (should be 18 or 20)
2. Reinstall dependencies: `rm -rf node_modules && npm install`
3. Check for port conflicts (try a different port)

#### Issue: Page shows 404 error
**Solution**:
1. Verify MDX file exists in correct location
2. Check the file path matches the link in navigation
3. Ensure file has `.mdx` or `.md` extension
4. Restart dev server: `npm run dev`

#### Issue: Navigation doesn't show new page
**Solution**:
1. Add page to `sidebar` in `rspress.config.ts`
2. Verify link path matches file location
3. Restart dev server: `npm run dev`

#### Issue: Build fails
**Solution**:
1. Check for syntax errors in MDX files
2. Verify frontmatter YAML is valid
3. Check `rspress.config.ts` for errors
4. Review build error messages for specific issues

#### Issue: Images not loading
**Solution**:
1. Verify images are in `public/images_{version}/` folder
2. Check image paths in MDX (use absolute paths from public)
3. Ensure image file names match exactly (case-sensitive)
4. Check browser console for 404 errors

#### Issue: Search not working
**Solution**:
1. Rspress generates search index automatically on build
2. Ensure you've run `npm run build` at least once
3. Check that content is properly formatted
4. Search index is generated in `.rspress/` folder

### Getting Help

1. **Check Rspress Documentation**:
   - Official docs: https://rspress.rs/guide
   - GitHub: https://github.com/web-infra-dev/rspress

2. **Check Browser Console**:
   - Open DevTools (F12)
   - Check Console tab for errors
   - Check Network tab for failed requests

3. **Verify File Structure**:
   - Ensure files are in correct folders
   - Check naming conventions match patterns
   - Verify navigation paths in `rspress.config.ts`

---

## Additional Resources

- **Rspress Official Docs**: https://rspress.rs/guide
- **Rspress Getting Started**: https://rspress.rs/guide/start/getting-started
- **MDX Guide**: https://rspress.rs/guide/basic/use-mdx
- **Theme Configuration**: https://rspress.rs/guide/custom/theme-config
- **Plugin System**: https://rspress.rs/plugin

---

## Quick Reference

### Essential Commands
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
```

### File Locations
- **Content**: `docs/{version}/{module}/`
- **Configuration**: `rspress.config.ts`
- **Static Assets**: `public/`
- **Build Output**: `build/`

### Important Patterns
- **6.1 Files**: `{topic}.mdx` or `{topic}-6_1.mdx`
- **NextGen Files**: `{topic}.mdx` or `{topic}_ng.mdx`
- **Image Paths**: `/images_{version}/folder/image.png`

### Version-Specific Image Folders
- **6.1**: `public/images_6_1/`
- **6.1.1**: `public/images_6_1_1/`
- **5.13**: `public/images_5_13/`
- **NextGen**: `public/images_ng/`

---

## Version History

- **v1.1.0** (January 2025): Image path transformation, feedback survey, hero redesign, navigation fixes
- **v1.0.0** (January 2025): Complete SEO/GEO implementation, breadcrumb fixes, NextGen support
- **v0.9.0** (December 2024): Page loading fixes, error handling improvements
- **v0.8.0** (December 2024): Multi-version support, Admin module expansion
- **v0.7.0** (November 2024): Initial release with Rspress

---

**Last Updated**: January 2025  
**Live Site**: https://gopichand-virima.github.io/FeatureDocsite/  
**Repository**: https://github.com/gopichand-virima/FeatureDocsite  
**Built with**: [Rspress](https://rspress.rs/) - High-performance static site generator
