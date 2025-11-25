# Virima Documentation Website

**Production Documentation Site**: https://gopichand-virima.github.io/FeatureDocsite/

This is the official documentation website for Virima, supporting multiple versions (NextGen, 6.1.1, 6.1, 5.13) with comprehensive SEO optimization, interactive navigation, and modern user experience.

---

## 📋 Table of Contents

- [Project Overview](#project-overview)
- [Quick Start for Writers](#quick-start-for-writers)
- [Mandatory Commands](#mandatory-commands)
- [Project Structure](#project-structure)
- [Key Files and Their Roles](#key-files-and-their-roles)
- [Writer Workflow](#writer-workflow)
- [Content Guidelines](#content-guidelines)
- [SEO Metadata Requirements](#seo-metadata-requirements)
- [Troubleshooting](#troubleshooting)

---

## Project Overview

### What This Project Does

This is a **React-based documentation website** that:
- Displays Virima documentation across multiple versions
- Provides interactive navigation with expandable sidebar
- Generates SEO-optimized pages with proper meta tags
- Creates breadcrumb navigation automatically
- Supports MDX (Markdown + JSX) for rich content formatting

### Key Highlights

✅ **Multi-Version Support**: NextGen, 6.1.1, 6.1, 5.13  
✅ **11 Complete Modules**: Admin, ITSM, ITAM, CMDB, Discovery Scan, My Dashboard, Self Service, Program/Project Management, Risk Register, Reports, Vulnerability Management  
✅ **SEO Optimized**: Automatic sitemap generation, meta tags, structured data  
✅ **Smart Navigation**: 7-level breadcrumb hierarchy, clickable navigation  
✅ **Automated Deployment**: GitHub Actions CI/CD  
✅ **Type-Safe**: Full TypeScript implementation  
✅ **User Feedback System**: Integrated feedback survey on all documentation pages  
✅ **Version-Aware Image Mapping**: Automatic image path transformation for all versions  
✅ **Enhanced Error Handling**: Route-based error recovery with ErrorBoundary  

### Technology Stack

- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite 6
- **Styling**: Tailwind CSS
- **Content Format**: MDX (Markdown + JSX)
- **Routing**: React Router
- **SEO**: react-helmet-async
- **Email Service**: EmailJS (for feedback forms)
- **Deployment**: GitHub Pages

---

## Quick Start for Writers

### Prerequisites

- Node.js 18 or 20 installed
- Git installed
- Basic knowledge of Markdown
- Text editor (VS Code recommended)

### Initial Setup

```bash
# 1. Clone the repository (if you haven't already)
git clone https://github.com/gopichand-virima/FeatureDocsite.git
cd FeatureDocsite

# 2. Install dependencies (first time only)
npm install

# 3. Start development server
npm run dev
```

The site will open at `http://localhost:5173`

---

## Mandatory Commands

### For Daily Writing Work

```bash
# Start development server (MANDATORY before writing)
npm run dev

# Normalize frontmatter after editing MDX files (MANDATORY before commit)
npm run normalize:frontmatter

# Build project to check for errors (MANDATORY before pushing)
npm run build
```

### For Adding New Content

```bash
# Add frontmatter to new MDX files (if missing)
npm run add:frontmatter

# Normalize all frontmatter (ensures consistency)
npm run normalize:frontmatter

# Generate sitemap (happens automatically on build)
npm run generate:sitemap
```

### For Deployment

```bash
# Build for production (includes sitemap generation)
npm run build

# Deploy to GitHub Pages (usually handled by GitHub Actions)
npm run deploy
```

### Command Reference

| Command | When to Use | What It Does |
|---------|------------|--------------|
| `npm run dev` | **Every time you write** | Starts local development server |
| `npm run normalize:frontmatter` | **After editing MDX files** | Cleans and standardizes metadata |
| `npm run build` | **Before committing/pushing** | Builds project and checks for errors |
| `npm run add:frontmatter` | **When creating new files** | Adds default frontmatter to files without it |
| `npm run generate:sitemap` | **Before deployment** | Generates sitemap.xml (auto-runs on build) |

---

## Project Structure

```
FeatureDocsite/
├── src/
│   ├── components/          # React components (UI, layout, content)
│   │   ├── DocumentationLayout.tsx    # Main layout with sidebar
│   │   ├── DocumentationContent.tsx   # Content rendering + breadcrumbs
│   │   ├── MDXContent.tsx            # MDX content renderer
│   │   ├── Seo.tsx                   # SEO meta tags component
│   │   ├── ErrorBoundary.tsx         # Error handling
│   │   └── ui/                        # Reusable UI components
│   │
│   ├── content/             # 📝 YOUR CONTENT GOES HERE
│   │   ├── 6_1/            # Version 6.1 content
│   │   │   ├── admin_6_1/  # Admin module (223 files)
│   │   │   ├── cmdb_6_1/   # CMDB module (37 files)
│   │   │   ├── discovery_scan_6_1/  # Discovery Scan (355 files)
│   │   │   ├── itsm_6_1/   # ITSM module
│   │   │   ├── itam_6_1/   # ITAM module (101 files)
│   │   │   ├── my_dashboard_6_1/  # My Dashboard (18 files)
│   │   │   └── ...         # Other modules
│   │   │
│   │   ├── NG/             # NextGen content
│   │   ├── 6_1_1/          # Version 6.1.1 content
│   │   ├── 5_13/           # Version 5.13 content
│   │   └── contentLoader.ts # Content loading logic
│   │
│   ├── config/
│   │   └── seoConfig.ts     # SEO configuration (canonical host, defaults)
│   │
│   ├── utils/
│   │   ├── mdxPathResolver.ts  # Resolves MDX file paths
│   │   └── routeBuilder.ts     # Builds URL routes
│   │
│   ├── App.tsx             # Main application (routing, state)
│   └── main.tsx            # Application entry point
│
├── scripts/                 # Automation scripts
│   ├── generate-sitemap.ts      # Generates sitemap.xml
│   ├── add-frontmatter.ts       # Adds frontmatter to MDX files
│   ├── normalize-frontmatter.ts # Normalizes existing frontmatter
│   └── remove-added-frontmatter.ts # Cleanup script
│
├── public/
│   ├── robots.txt           # Search engine crawler rules
│   ├── sitemap.xml          # Generated sitemap (auto-updated)
│   ├── 404.html             # 404 page for GitHub Pages
│   └── images_*/            # Version-specific image folders
│       ├── images_6_1/      # Version 6.1 images
│       ├── images_6_1_1/    # Version 6.1.1 images
│       ├── images_5_13/     # Version 5.13 images
│       └── images_ng/       # NextGen images
│
├── .github/
│   └── workflows/
│       └── deploy.yml        # Automated deployment workflow
│
├── package.json             # Project dependencies and scripts
└── README.md                # This file
```

### Content Organization

**Version 6.1** (Most Complete):
- Location: `src/content/6_1/`
- Format: `{module}_6_1/{topic-name}_6_1.mdx` or `{topic-name}-6_1.mdx`
- Example: `src/content/6_1/cmdb_6_1/access_cmdb_6_1.mdx`
- **Image Paths**: Use `../Resources/Images/...` in MDX (auto-transformed to `/images_6_1/...`)

**NextGen**:
- Location: `src/content/NG/{module}/`
- Format: `{topic-name}.mdx` or `{topic-name}_ng.mdx`
- Example: `src/content/NG/my-dashboard/overview.mdx`
- **Image Paths**: Use `../Resources/Images/...` in MDX (auto-transformed to `/images_ng/...`)

**Other Versions** (6.1.1, 5.13):
- Location: `src/content/{version}/{module}/`
- Format: `overview.mdx` (currently minimal content)
- **Image Paths**: Use `../Resources/Images/...` in MDX (auto-transformed to `/images_{version}/...`)

---

## Key Files and Their Roles

### For Writers (Files You'll Edit)

#### 1. MDX Content Files
**Location**: `src/content/{version}/{module}/`

**Role**: Your actual documentation content
- Write documentation in Markdown format
- Add frontmatter (YAML metadata) at the top
- Use MDX for rich formatting

**Example Structure**:
```mdx
---
title: "Page Title"
description: "Page description for SEO"
canonical: "/6_1/cmdb/cmdb/access-cmdb"
keywords:
  - "virima"
  - "cmdb"
  - "configuration management"
lastUpdated: "2025-01-15"
---

# Page Title

Your content here...
```

#### 2. Navigation Configuration
**Location**: `src/components/DocumentationLayout.tsx`

**Role**: Defines the sidebar navigation structure
- **When to edit**: Adding new sections or reorganizing navigation
- Contains `adminSections`, `cmdbSections`, etc.
- Defines the Table of Contents (TOC) hierarchy

**Example**:
```typescript
const cmdbSections = [
  {
    id: 'cmdb',
    label: 'CMDB',
    pages: [
      { id: 'access-cmdb', label: 'Access CMDB' },
      { id: 'manage-cmdb', label: 'Manage CMDB' },
      // ... more pages
    ]
  }
];
```

#### 2a. Feedback Survey Component
**Location**: `src/components/FeedbackSection.tsx`

**Role**: User feedback collection system
- **When to edit**: Customizing feedback questions or email configuration
- Integrated into all documentation pages automatically
- Uses EmailJS for email delivery
- **Note**: Configure EmailJS service IDs in the component before deployment

### For Developers (Files You Usually Don't Edit)

#### 3. `src/App.tsx`
**Role**: Main application component
- Handles routing and URL parsing
- Manages version/module/section/page state
- Maps file names to page IDs
- **Don't edit** unless adding new module mappings

#### 4. `src/components/DocumentationContent.tsx`
**Role**: Renders content and breadcrumbs
- Loads MDX content based on route
- Generates breadcrumb navigation
- Handles parent topic detection
- **Don't edit** unless fixing breadcrumb logic

#### 5. `src/content/contentLoader.ts`
**Role**: Loads and parses MDX files
- Imports all MDX files statically
- Parses frontmatter (browser-safe)
- Maps file paths to content
- **Edit when**: Adding new content imports

#### 6. `src/utils/mdxPathResolver.ts`
**Role**: Resolves MDX file paths from route parameters
- Converts URL segments to file paths
- Handles version-specific path logic
- **Edit when**: Adding new version or path patterns

#### 7. `src/config/seoConfig.ts`
**Role**: SEO configuration
- Defines canonical hostname
- Sets default meta tags
- Controls indexing rules
- **Edit when**: Changing canonical domain or SEO defaults

#### 8. `scripts/generate-sitemap.ts`
**Role**: Generates sitemap.xml
- Reads navigation structure
- Creates sitemap entries for all pages
- Updates lastmod dates
- **Runs automatically** on build

#### 9. `src/components/MDXContent.tsx`
**Role**: Renders MDX content with image path transformation
- Automatically transforms image paths based on version
- Handles frontmatter stripping
- Provides loading and error states
- **Key Feature**: Version-aware image path mapping (`../Resources/Images/...` → `/images_{version}/...`)

#### 10. `src/components/ErrorBoundary.tsx`
**Role**: Catches and handles React errors gracefully
- Displays user-friendly error messages
- Resets error state on route changes (allows recovery via browser back button)
- Prevents blank white screens

#### 11. `src/components/HomePage.tsx`
**Role**: Landing page with hero section and module cards
- Modern, premium design with white/slate color scheme
- Interactive module navigation
- Search functionality
- **Updated**: January 2025 with new design system

---

## Writer Workflow

### Adding a New Topic

1. **Create the MDX File**
   ```bash
   # Example: Adding a new CMDB topic for version 6.1
   src/content/6_1/cmdb_6_1/my-new-topic-6_1.mdx
   ```

2. **Add Frontmatter**
   ```mdx
   ---
   title: "My New Topic"
   description: "Clear description of what this page covers (150-160 characters)"
   canonical: "/6_1/cmdb/cmdb/my-new-topic"
   keywords:
     - "virima"
     - "cmdb"
     - "new feature"
   lastUpdated: "2025-01-15"
   ---
   
   # My New Topic
   
   Your content here...
   ```

3. **Add to Navigation**
   - Edit `src/components/DocumentationLayout.tsx`
   - Add the page to the appropriate section's `pages` array
   - Example:
     ```typescript
     pages: [
       { id: 'access-cmdb', label: 'Access CMDB' },
       { id: 'my-new-topic', label: 'My New Topic' }, // Add this
     ]
     ```

4. **Update Content Loader** (if needed)
   - Edit `src/content/contentLoader.ts`
   - Add import: `import myNewTopic from './6_1/cmdb_6_1/my-new-topic-6_1.mdx?raw';`
   - Add to `contentMap`: `'/content/6_1/cmdb_6_1/my-new-topic-6_1.mdx': myNewTopic`

5. **Normalize Frontmatter**
   ```bash
   npm run normalize:frontmatter
   ```

6. **Test Locally**
   ```bash
   npm run dev
   # Navigate to the new page in browser
   # Verify it loads correctly
   ```

7. **Build and Verify**
   ```bash
   npm run build
   # Check for any errors
   ```

### Updating Existing Content

1. **Edit the MDX File**
   - Open the file in `src/content/{version}/{module}/`
   - Make your changes
   - Update `lastUpdated` date in frontmatter

2. **Normalize Frontmatter** (if you changed metadata)
   ```bash
   npm run normalize:frontmatter
   ```

3. **Test Locally**
   ```bash
   npm run dev
   # Verify changes look correct
   ```

4. **Build Before Committing**
   ```bash
   npm run build
   ```

### Daily Writing Checklist

- [ ] Start dev server: `npm run dev`
- [ ] Edit MDX files in `src/content/`
- [ ] Add/update frontmatter with proper metadata
- [ ] Run `npm run normalize:frontmatter` after editing
- [ ] Test in browser (check navigation, breadcrumbs, content)
- [ ] Run `npm run build` to check for errors
- [ ] Commit and push changes

---

## Content Guidelines

### File Naming

**Version 6.1:**
- Use underscores or hyphens: `my-topic-6_1.mdx` or `my_topic_6_1.mdx`
- Be consistent within a module
- Match the pattern used in the module folder

**NextGen:**
- Use hyphens: `my-topic.mdx` or `my-topic_ng.mdx`
- Module overview files should be named `overview_ng.mdx`

### Image Paths in MDX Files

**Important**: All versions support automatic image path transformation!

**In Your MDX Files:**
- Use relative paths: `../Resources/Images/folder/image.png`
- The system automatically transforms them to version-specific paths:
  - **6.1**: `/images_6_1/folder/image.png`
  - **6.1.1**: `/images_6_1_1/folder/image.png`
  - **5.13**: `/images_5_13/folder/image.png`
  - **NextGen**: `/images_ng/folder/image.png`

**Example:**
```mdx
<!-- In your MDX file -->
![Screenshot](../Resources/Images/CMDB/dashboard.png)

<!-- Automatically becomes (for 6.1) -->
![Screenshot](/images_6_1/CMDB/dashboard.png)
```

**Image Folder Structure:**
- Place images in `public/images_{version}/` folders
- Maintain the same folder structure as `Resources/Images/`
- Example: `public/images_6_1/CMDB/dashboard.png`

### Frontmatter Requirements

**Every MDX file MUST have frontmatter:**

```yaml
---
title: "Page Title"                    # Required: 50-60 characters
description: "Page description..."     # Required: 150-160 characters
canonical: "/version/module/section/page"  # Required: matches URL structure
keywords:                              # Required: 3-10 keywords
  - "virima"
  - "module-name"
  - "feature-name"
lastUpdated: "2025-01-15"             # Required: YYYY-MM-DD format
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

4. **Update Last Updated Date**
   - Change `lastUpdated` when content changes significantly
   - Format: `YYYY-MM-DD`

---

## SEO Metadata Requirements

### Why It Matters

SEO metadata helps your documentation appear in Google search results. Without proper metadata:
- Pages might not be found by search engines
- Search results show generic titles
- Lower click-through rates
- Poor search rankings

### Required Fields

| Field | Required | Format | Example |
|-------|----------|--------|---------|
| `title` | ✅ Yes | String, 50-60 chars | `"Advanced Search"` |
| `description` | ✅ Yes | String, 150-160 chars | `"Learn how to use advanced search..."` |
| `canonical` | ✅ Yes | URL path | `"/6_1/cmdb/cmdb/access-cmdb"` |
| `keywords` | ✅ Yes | Array, 3-10 items | `["virima", "cmdb", "search"]` |
| `lastUpdated` | ✅ Yes | Date, YYYY-MM-DD | `"2025-01-15"` |

### Canonical URL Pattern

**Format**: `/{version}/{module}/{section}/{page}`

**Examples**:
- `/NextGen/my-dashboard/application-overview/advanced-search`
- `/6_1/cmdb/cmdb/access-cmdb`
- `/6_1/admin/discovery/client/restart-client`

**Rules**:
- Use lowercase
- Use hyphens to separate words
- Match the actual URL structure
- No trailing slashes

### Quick SEO Checklist

- [ ] Title is clear and descriptive (50-60 chars)
- [ ] Description is unique and helpful (150-160 chars)
- [ ] Canonical URL matches route structure
- [ ] Keywords are relevant (3-10 keywords)
- [ ] Last updated date is current
- [ ] No HTML tags in title/description/keywords
- [ ] YAML syntax is correct

**See `README_6_1.md` for detailed SEO/GEO guide with examples.**

---

## Recent Project Updates (January 2025)

### 🎨 User Experience Enhancements

#### 1. Feedback Survey System
- **Added**: Integrated feedback form on all documentation pages
- **Features**:
  - Thumbs up/down initial feedback
  - Follow-up questions based on feedback type
  - Role selection and NPS scoring
  - EmailJS integration for email delivery
  - Submission tracking (max 2 per session)
- **Location**: `src/components/FeedbackSection.tsx`
- **Note**: Configure EmailJS service IDs before deployment

#### 2. Cover Page Redesign
- **Updated**: Hero section with premium white/slate design
- **Features**:
  - Clean, modern aesthetic
  - Floating service icons
  - Enhanced hover effects
  - Improved visual hierarchy
- **Location**: `src/components/HomePage.tsx`

### 🖼️ Image Path Transformation

#### Automatic Version-Aware Image Mapping
- **Feature**: All MDX files automatically transform image paths based on version
- **How It Works**:
  - MDX files use: `../Resources/Images/...`
  - System transforms to: `/images_{version}/...`
  - Supports all versions: 6.1, 6.1.1, 5.13, NextGen
- **Location**: `src/components/MDXContent.tsx` → `transformImagePaths()`
- **Benefit**: No manual path updates needed when moving content between versions

### 🧭 Navigation Improvements

#### 1. Breadcrumb Fixes
- **Fixed**: Admin module breadcrumb hierarchy
- **Fixed**: Section detection for nested Admin sub-modules (SACM, Discovery, Users, etc.)
- **Fixed**: Breadcrumb home icon now correctly navigates to homepage
- **Result**: Accurate breadcrumbs matching TOC structure

#### 2. Error Boundary Enhancements
- **Added**: Route-based error state reset
- **Feature**: Browser back button now recovers from error pages
- **Implementation**: ErrorBoundary resets when route changes
- **Location**: `src/components/ErrorBoundary.tsx` + `src/App.tsx`

#### 3. GitHub Pages Routing
- **Added**: Client-side redirect handling for deep links
- **Feature**: Handles 404 redirects gracefully
- **Implementation**: Session storage-based redirect recovery
- **Location**: `src/main.tsx`

### 📁 Content Organization

#### NextGen Content Standardization
- **Renamed**: All NextGen folders/files from `_6_1` to `_ng` suffix
- **Standardized**: Module overview files now use `overview_ng.mdx` naming
- **Cleaned**: Removed duplicate folders without `_ng` suffix
- **Result**: Consistent naming convention across NextGen content

### 🔧 Technical Improvements

#### 1. Build System
- **Added**: `emailjs-com` dependency for feedback forms
- **Updated**: Vite config with EmailJS alias
- **Fixed**: Package lock file synchronization

#### 2. Content Loading
- **Improved**: Graceful fallback for missing content
- **Fixed**: Error logging for expected fallbacks
- **Enhanced**: Version-specific path resolution

#### 3. Constants Management
- **Refactored**: Admin page constants moved to shared module
- **Location**: `src/constants/adminPages.ts`
- **Benefit**: Prevents duplicate declarations and initialization errors

### 📊 Version-Specific Features

**Version 6.1:**
- ✅ Complete image path transformation
- ✅ Full Admin module sub-section support
- ✅ Enhanced breadcrumb hierarchy
- ✅ All modules fully documented

**NextGen:**
- ✅ Standardized `_ng` naming convention
- ✅ Image path transformation
- ✅ Module overview standardization
- ✅ Content replication for missing pages

**All Versions:**
- ✅ Consistent image path transformation
- ✅ Feedback survey integration
- ✅ Enhanced error handling
- ✅ Improved navigation experience

---

## Troubleshooting

### Common Issues

#### Issue: Page shows blank/white screen
**Solution**:
1. Check browser console for errors
2. Verify MDX file exists in correct location
3. Check that file is imported in `contentLoader.ts`
4. Verify frontmatter syntax is correct
5. Run `npm run build` to check for build errors

#### Issue: Navigation doesn't show new page
**Solution**:
1. Add page to `DocumentationLayout.tsx` in the appropriate section
2. Verify `id` matches the page ID in URL
3. Restart dev server: `npm run dev`

#### Issue: Breadcrumb is incorrect
**Solution**:
1. Check that page is in correct section array in `DocumentationContent.tsx`
2. Verify parent topic arrays include your page
3. Check URL structure matches breadcrumb logic

#### Issue: Metadata not appearing in search results
**Solution**:
1. Verify frontmatter is correct (run `npm run normalize:frontmatter`)
2. Check canonical URL matches actual route
3. Rebuild: `npm run build`
4. Wait 1-7 days for Google to index (submit sitemap in Search Console)

#### Issue: Build fails
**Solution**:
1. Check for TypeScript errors: `npm run build`
2. Verify all imports are correct
3. Check MDX file syntax
4. Ensure frontmatter YAML is valid
5. Run `npm install` if dependencies are missing

#### Issue: Images not loading
**Solution**:
1. Verify images are in `public/images_{version}/` folder
2. Check image paths in MDX use `../Resources/Images/...` format
3. Ensure folder structure matches (e.g., `public/images_6_1/CMDB/image.png`)
4. Check browser console for 404 errors

#### Issue: Feedback form not sending emails
**Solution**:
1. Verify EmailJS service IDs are configured in `FeedbackSection.tsx`
2. Check EmailJS service, template, and public key are set
3. Verify `emailjs-com` is installed: `npm install`
4. Check browser console for EmailJS errors

#### Issue: Error page doesn't recover on back navigation
**Solution**:
1. Verify ErrorBoundary is wrapping AppContent in `App.tsx`
2. Check that `resetKey` prop is being passed correctly
3. Ensure route changes trigger ErrorBoundary reset
4. Clear browser cache and try again

### Getting Help

1. **Check Documentation**:
   - `README_6_1.md` - Detailed project documentation
   - `tutorials/seo-geo-management.md` - SEO guide
   - `src/docs/` - Additional documentation

2. **Check Browser Console**:
   - Open DevTools (F12)
   - Check Console tab for errors
   - Check Network tab for failed requests

3. **Verify File Structure**:
   - Ensure files are in correct folders
   - Check naming conventions match patterns
   - Verify imports in `contentLoader.ts`

---

## Additional Resources

- **Detailed Documentation**: See `README_6_1.md` for comprehensive project details
- **SEO Guide**: See `tutorials/seo-geo-management.md` for SEO best practices
- **Content Guidelines**: See `src/content/README.md` for content writing guidelines
- **Architecture**: See `src/docs/architecture-diagram.md` for system architecture

---

## Quick Reference

### Essential Commands
```bash
npm run dev                    # Start development server
npm run normalize:frontmatter  # Clean frontmatter (run after editing)
npm run build                  # Build project (check for errors)
```

### File Locations
- **Content**: `src/content/{version}/{module}/`
- **Navigation**: `src/components/DocumentationLayout.tsx`
- **Content Loader**: `src/content/contentLoader.ts`
- **SEO Config**: `src/config/seoConfig.ts`

### Important Patterns
- **6.1 Files**: `{topic}_6_1.mdx` or `{topic}-6_1.mdx`
- **NextGen Files**: `{topic}.mdx` or `{topic}_ng.mdx`
- **NextGen Overview**: `overview_ng.mdx` (not `about_*_ng.mdx`)
- **Canonical URL**: `/{version}/{module}/{section}/{page}`
- **Image Paths**: Use `../Resources/Images/...` (auto-transformed)

### Version-Specific Image Folders
- **6.1**: `public/images_6_1/`
- **6.1.1**: `public/images_6_1_1/`
- **5.13**: `public/images_5_13/`
- **NextGen**: `public/images_ng/`

---

## Version History

- **v1.1.0** (January 2025): Image path transformation, feedback survey, hero redesign, navigation fixes, error boundary improvements
- **v1.0.0** (January 2025): Complete SEO/GEO implementation, breadcrumb fixes, NextGen support
- **v0.9.0** (December 2024): Page loading fixes, error handling improvements
- **v0.8.0** (December 2024): Multi-version support, Admin module expansion
- **v0.7.0** (November 2024): Initial release with basic navigation

---

**Last Updated**: January 2025  
**Live Site**: https://gopichand-virima.github.io/FeatureDocsite/  
**Repository**: https://github.com/gopichand-virima/FeatureDocsite
