# Virima Documentation System - Complete Guide

**Version**: 2.0  
**Status**: ✅ Production Ready  
**Last Updated**: November 26, 2024

---

## Table of Contents

1. [Quick Start](#quick-start)
2. [Current State](#current-state)
3. [Architecture Overview](#architecture-overview)
4. [Version-Specific Content Loading](#version-specific-content-loading)
5. [TOC-Driven System](#toc-driven-system)
6. [Migration Guide](#migration-guide)
7. [Reference](#reference)

---

## Quick Start

### For Content Authors

**To add or modify documentation content:**

1. Navigate to the version-specific index.mdx file:
   - NextGen: `/content/NG/index.mdx`
   - Version 6.1: `/content/6_1/index.mdx`
   - Version 6.1.1: `/content/6_1_1/index.mdx`
   - Version 5.13: `/content/5_13/index.mdx`

2. Edit the TOC structure using Markdown format:

```markdown
## Module Name

### Section Name
- Page Name → `/path/to/file.mdx`
  - Nested Page → `/path/to/nested-file.mdx`
```

3. **That's it!** The navigation, breadcrumbs, and routing update automatically.

### For Developers

**Core Files to Know:**

- `/utils/tocParser.ts` - Parses index.mdx files into structured data
- `/utils/tocLoader.ts` - Loads TOC for specific versions
- `/utils/useToc.ts` - React hooks for TOC data
- `/utils/versionContentLoader.ts` - Version-specific content loading
- `/components/VersionContentLoader.tsx` - Smart content loader component

---

## Current State

### ✅ Implemented Features

**TOC-Driven Architecture**
- ✅ Single source of truth (index.mdx per version)
- ✅ Automatic navigation generation
- ✅ Dynamic breadcrumb system
- ✅ Prev/Next page navigation
- ✅ File path resolution from TOC
- ✅ Type-safe TypeScript implementation

**Version-Specific Content Loading**
- ✅ Independent content architectures per version
- ✅ Version-specific hooks and loaders
- ✅ Strategy-based loading (TOC-driven, path-based, hybrid)
- ✅ Automatic version detection

**Content Management**
- ✅ 4 complete version TOCs (NextGen, 6.1, 6.1.1, 5.13)
- ✅ 10 modules across all versions
- ✅ 6 deliverables per module (Getting Started, OnlineHelp, Release Notes, Manuals, API Integration, Compatibility Matrix)
- ✅ Content Not Available component for missing pages

**User Experience**
- ✅ Premium emerald/blue/green gradient cover page
- ✅ Milky white background throughout
- ✅ Dark slate text colors (not pure black)
- ✅ Clean aesthetics without icon clutter
- ✅ Responsive design
- ✅ Feedback system
- ✅ AI search integration

---

## Architecture Overview

### System Flow

```
User Request
    ↓
Version Detection
    ↓
Load version-specific index.mdx
    ↓
Parse TOC structure
    ↓
Resolve file path
    ↓
Load content
    ↓
Render with navigation
```

### Key Components

**1. TOC Parser (`/utils/tocParser.ts`)**
- Parses Markdown-based TOC files
- Generates navigation hierarchies
- Creates breadcrumb trails
- Finds adjacent pages for prev/next
- Validates structure

**2. TOC Loader (`/utils/tocLoader.ts`)**
- Loads TOC for specific versions
- Caches parsed structures
- Handles version path mapping
- Imports raw MDX content

**3. Version Content Loader (`/utils/versionContentLoader.ts`)**
- Manages version configurations
- Resolves content paths
- Handles loading strategies
- Version-specific loaders

**4. React Hooks (`/utils/useToc.ts` & `/utils/useVersionContent.ts`)**
- `useToc()` - Main TOC data hook
- `useModuleNavigation()` - Module-specific navigation
- `useVersionContent()` - Version-aware content loading
- `useVersionStrategy()` - Loading strategy detection

**5. UI Components**
- `VersionContentLoader` - Smart content routing
- `ContentNotAvailable` - Missing content handling
- `DocumentationLayout` - Main layout structure
- `DocumentationContent` - Content rendering

---

## Version-Specific Content Loading

### Version Configurations

Each version has its own configuration:

```typescript
{
  'NextGen': {
    version: 'NextGen',
    versionPath: 'NG',
    contentStrategy: 'toc-driven',
    hasTOC: true,
  },
  '6.1': {
    version: '6.1',
    versionPath: '6_1',
    contentStrategy: 'toc-driven',
    hasTOC: true,
  }
}
```

### Loading Strategies

**TOC-Driven (Current Default)**
- Reads structure from index.mdx
- Resolves paths dynamically
- Single source of truth
- Used by: NextGen, 6.1, 6.1.1, 5.13

**Path-Based (Fallback)**
- Direct file path construction
- No TOC parsing
- Used for legacy content

**Hybrid (Future)**
- Combines both approaches
- TOC for structure, direct paths for content

### Version-Specific Hooks

```typescript
// Generic version loading
const { filePath, loading, error } = useVersionContent(
  'NextGen', 'cmdb', 'getting-started', 'quick-start'
);

// NextGen-specific
const result = useNextGenContent('cmdb', 'getting-started', 'quick-start');

// Version 6.1-specific
const result = use61Content('my-dashboard', 'dashboards', 'customization');
```

---

## TOC-Driven System

### TOC File Structure

Each version's `index.mdx` follows this format:

```markdown
# Virima Documentation - Version X

> Master Table of Contents

---

## Module Name

### Section Name
- Page Name → `/path/to/file.mdx`
  - Nested Page → `/path/to/nested/file.mdx`
    - Deep Nested → `/path/to/deep/nested/file.mdx`

### Another Section
- Another Page → `/another/path.mdx`
```

### Example: NextGen My Dashboard

```markdown
## My Dashboard

### Getting Started
- Quick Start → `/content/getting-started/quick-start-NG.mdx`

### Application Overview
- System Icons → `/content/NG/my-dashboard/system-icons.mdx`
- User Functions → `/content/online-help/overview-NG.mdx`

### Release Notes
- Latest Release → `/content/release-notes/latest-release-NG.mdx`
```

### Breadcrumb Generation

The system automatically generates breadcrumbs following the standard:

**Standard Structure:**
```
Home > Version > Module > Section > Parent > Nested > Page
```

**Examples:**
```
Home > NextGen > CMDB > Getting Started > Quick Start
Home > 6.1 > My Dashboard > Dashboards > Dashboard Customization
Home > 5.13 > ITSM > Online Help > Overview
```

**Rules:**
- Only includes levels that exist
- No empty placeholders
- Stops at deepest valid level
- Version always included after Home

---

## Migration Guide

### Adding a New Page

**Step 1: Create the MDX file**

```bash
# Create file at appropriate location
/content/6_1/my-dashboard/new-feature.mdx
```

**Step 2: Add to TOC**

Edit `/content/6_1/index.mdx`:

```markdown
## My Dashboard

### New Feature Section
- New Feature → `/content/6_1/my-dashboard/new-feature.mdx`
```

**Step 3: Done!**

Navigation, breadcrumbs, and routing are automatic.

### Reorganizing Navigation

**Before:**
```markdown
## CMDB
### Getting Started
- Quick Start → `/path/to/quick-start.mdx`
```

**After (adding nesting):**
```markdown
## CMDB
### Getting Started
- Quick Start → `/path/to/quick-start.mdx`
  - Installation → `/path/to/installation.mdx`
  - Configuration → `/path/to/configuration.mdx`
```

**Result:** Breadcrumbs automatically update to show proper hierarchy.

### Adding a New Version

**Step 1: Create version directory**

```bash
mkdir /content/7_0
```

**Step 2: Create index.mdx**

```bash
touch /content/7_0/index.mdx
```

**Step 3: Add version configuration**

Edit `/utils/versionContentLoader.ts`:

```typescript
const VERSION_CONFIGS: Record<string, VersionConfig> = {
  // ... existing versions
  '7.0': {
    version: '7.0',
    versionPath: '7_0',
    contentBasePath: '/content',
    hasTOC: true,
    contentStrategy: 'toc-driven',
  },
};
```

**Step 4: Populate TOC**

Edit `/content/7_0/index.mdx` with your structure.

---

## Reference

### File Path Conventions

**Version Path Mapping:**
- `NextGen` → `NG`
- `6.1.1` → `6_1_1`
- `6.1` → `6_1`
- `5.13` → `5_13`

**Common Patterns:**

```
/content/{version}/{module}/{file}.mdx
/content/{module}/{section}/{file}-{version}.mdx
/content/{section}/{file}-{version}.mdx
```

**Examples:**
```
/content/NG/cmdb/overview.mdx
/content/6_1/my-dashboard/dashboards-6_1.mdx
/content/getting-started/quick-start-NG.mdx
```

### Module IDs

```
admin
my-dashboard
cmdb
discovery-scan
itsm
vulnerability-management
itam
self-service
program-project-management
risk-register
reports
```

### Deliverable Sections

All modules should include these 6 deliverables:

1. **Getting Started** - Quick start guides
2. **OnlineHelp** - Detailed documentation
3. **Release Notes** - Version-specific updates
4. **Manuals** - User guides
5. **API Integration** - API documentation
6. **Compatibility Matrix** - System requirements

### Utility Functions

**TOC Parser:**
```typescript
parseTocFile(content: string, version: string): TocStructure
resolveFilePath(toc: TocStructure, moduleId, sectionId, pageId): string | null
generateBreadcrumbs(toc: TocStructure, moduleId, sectionId, pageId): BreadcrumbItem[]
```

**Version Loader:**
```typescript
loadVersionContent(version, moduleId, sectionId, pageId): ContentLoadResult
getVersionConfig(version: string): VersionConfig | null
isVersionTOCDriven(version: string): boolean
```

### TypeScript Interfaces

**TocStructure:**
```typescript
interface TocStructure {
  version: string;
  modules: TocModule[];
  missingFiles?: string[];
  validationErrors?: string[];
}
```

**TocModule:**
```typescript
interface TocModule {
  id: string;
  name: string;
  sections: TocSection[];
}
```

**TocSection:**
```typescript
interface TocSection {
  id: string;
  name: string;
  pages: TocPage[];
}
```

**TocPage:**
```typescript
interface TocPage {
  id: string;
  name: string;
  filePath: string;
  subPages?: TocPage[];
}
```

---

## Best Practices

### Content Organization

✅ **DO:**
- Keep one index.mdx per version
- Use clear, descriptive page names
- Follow the standard breadcrumb hierarchy
- Group related content under appropriate sections
- Use consistent file naming conventions

❌ **DON'T:**
- Create duplicate navigation structures
- Mix version-specific content
- Use special characters in IDs
- Create circular references
- Skip hierarchy levels

### TOC File Management

✅ **DO:**
- Edit TOC files directly for structural changes
- Use proper Markdown formatting
- Include all 6 deliverables per module
- Test breadcrumb navigation after changes
- Keep file paths absolute from /content

❌ **DON'T:**
- Manually edit navigation components
- Hardcode file paths in components
- Create TOC-like structures elsewhere
- Use relative file paths
- Duplicate page entries

### Version Management

✅ **DO:**
- Keep versions independent
- Use version-specific file suffixes when needed
- Leverage version-specific hooks
- Document version differences

❌ **DON'T:**
- Share content files between versions (unless intentional)
- Use version numbers in display names (system handles this)
- Hardcode version logic in components

---

## Troubleshooting

### Content Not Loading

**Issue:** Page shows "Content Not Available"

**Solutions:**
1. Check if file exists at specified path
2. Verify file path in index.mdx is correct
3. Ensure file is imported in contentLoader.ts (if needed)
4. Check version path mapping

### Breadcrumbs Incorrect

**Issue:** Breadcrumb trail doesn't match hierarchy

**Solutions:**
1. Verify TOC structure in index.mdx
2. Check for proper nesting levels
3. Ensure page IDs are unique
4. Clear cache and reload

### Navigation Missing Pages

**Issue:** Pages don't appear in sidebar

**Solutions:**
1. Add page to appropriate section in index.mdx
2. Check Markdown formatting (use `-` for list items)
3. Verify section structure is correct
4. Ensure proper indentation for nesting

---

## Support

For questions or issues:

1. Check this documentation first
2. Review the specific guide files in `/docs`
3. Examine example implementations in existing versions
4. Check console for error messages

---

**End of Documentation**

*This guide covers the complete Virima documentation system architecture, implementation, and usage.*
