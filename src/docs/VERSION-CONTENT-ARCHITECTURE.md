# Version-Specific Content Loading Architecture

**Date**: November 26, 2024  
**Status**: ✅ Complete - Independent Loading for NG and 6.1

---

## Overview

The Virima documentation now has **independent content loading architectures** for each version (NextGen, 6.1, 6.1.1, 5.13). Each version has its own:
- Master TOC file (`index.mdx`)
- Content structure
- Loading strategy
- File path resolution

---

## Architecture Components

### 1. Master TOC Files

Each version has its own comprehensive `index.mdx` file:

**NextGen (`/content/NG/index.mdx`)**
- Complete structure for all 10 modules
- Nested page hierarchies
- API Integration sections
- Compatibility Matrix sections
- Independent of other versions

**Version 6.1 (`/content/6_1/index.mdx`)**
- Full My Dashboard structure with 8 specific MDX files
- Detailed sections for all modules
- Task Management with nested pages
- Program and Project Management structure
- Independent of other versions

**Version 6.1.1 (`/content/6_1_1/index.mdx`)**
- Basic structure for all modules
- Ready for expansion

**Version 5.13 (`/content/5_13/index.mdx`)**
- Extensive My Dashboard with 25+ pages
- All deliverables included

---

## Content Loading System

### Version Content Loader (`/utils/versionContentLoader.ts`)

**Purpose**: Manages version-specific content loading strategies

**Key Features**:
- Version configuration management
- Independent content path resolution
- Strategy-based loading (TOC-driven, path-based, hybrid)
- Version-specific loaders:
  - `loadNextGenContent()`
  - `load61Content()`
  - `load611Content()`
  - `load513Content()`

**Version Configurations**:
```typescript
{
  'NextGen': {
    contentStrategy: 'toc-driven',
    hasTOC: true,
    versionPath: 'NG',
  },
  '6.1': {
    contentStrategy: 'toc-driven',
    hasTOC: true,
    versionPath: '6_1',
  }
}
```

### React Hooks (`/utils/useVersionContent.ts`)

**Purpose**: React hooks for version-aware content loading

**Available Hooks**:

1. **`useVersionContent(version, moduleId, sectionId, pageId)`**
   - Generic hook for any version
   - Returns: content, filePath, error, loading, loadedFrom

2. **`useNextGenContent(moduleId, sectionId, pageId)`**
   - NextGen-specific hook
   - Optimized for NextGen content structure

3. **`use61Content(moduleId, sectionId, pageId)`**
   - Version 6.1-specific hook
   - Handles 6.1 content patterns

4. **`useVersionStrategy(version)`**
   - Returns loading strategy for version
   - Indicates if TOC-driven or path-based

5. **`useContentPath(version, moduleId, sectionId, pageId)`**
   - Resolves file path for given coordinates
   - Version-aware path resolution

### Version Content Loader Component (`/components/VersionContentLoader.tsx`)

**Purpose**: Smart component that routes to appropriate loading strategy

**Features**:
- Automatic strategy detection
- Loading states
- Error handling
- Version-specific rendering

**Usage**:
```tsx
<VersionContentLoader
  version="6.1"
  moduleId="my-dashboard"
  sectionId="dashboards"
  pageId="customization"
>
  {({ filePath, loadedFrom }) => (
    <ContentRenderer path={filePath} />
  )}
</VersionContentLoader>
```

---

## How It Works

### Loading Flow

```
User requests page
    ↓
Version detected (e.g., 6.1)
    ↓
VersionContentLoader determines strategy
    ↓
Strategy: TOC-driven
    ↓
Load /content/6_1/index.mdx
    ↓
Parse TOC structure
    ↓
Resolve file path from TOC
    ↓
Load content from resolved path
    ↓
Render content
```

### NextGen-Specific Loading

```tsx
// Automatic version detection
const { filePath } = useNextGenContent(
  'cmdb',
  'getting-started',
  'quick-start'
);

// Resolves to: /content/getting-started/quick-start-NG.mdx
```

### Version 6.1-Specific Loading

```tsx
// Version-specific hook
const { filePath } = use61Content(
  'my-dashboard',
  'dashboards',
  'customization'
);

// Resolves to: /content/6_1/my-dashboard/dashboards-customization-6_1.mdx
```

---

## Version Independence

### NextGen Structure

```
/content/NG/
  ├── index.mdx                  ← NextGen Master TOC
  ├── cmdb/
  │   └── overview.mdx
  ├── my-dashboard/
  │   └── system-icons.mdx
  └── [other modules]/
```

**Features**:
- 10 modules fully documented
- API Integration for all modules
- Compatibility Matrix for all modules
- Nested page hierarchies (3 levels deep)

### Version 6.1 Structure

```
/content/6_1/
  ├── index.mdx                  ← Version 6.1 Master TOC
  ├── my-dashboard/
  │   ├── dashboards-6_1.mdx
  │   ├── dashboards-contents-6_1.mdx
  │   ├── dashboards-customization-6_1.mdx
  │   ├── dashboards-report-actions-6_1.mdx
  │   ├── my-dashboard-6_1.mdx
  │   ├── my-dashboard-contents-6_1.mdx
  │   ├── my-dashboard-overview-6_1.mdx
  │   └── system-icons-6_1.mdx
  └── [other modules]/
```

**Features**:
- Detailed My Dashboard with 8 specific files
- Task Management with nested structure
- Program and Project Management sections
- Independent content organization

---

## Benefits

### ✅ Version Independence

Each version can have:
- Different page structures
- Different navigation hierarchies
- Different content organization
- Different deliverables

### ✅ Separate Evolution

- NextGen can add new features without affecting 6.1
- Version 6.1 can reorganize without impacting NextGen
- Each version evolves independently
- No cross-version conflicts

### ✅ Optimized Loading

- Version-specific loaders
- Cached TOC structures per version
- Efficient path resolution
- Strategy-based optimization

### ✅ Clear Separation

- Independent index.mdx files
- Separate content directories
- Version-specific hooks
- Isolated configurations

---

## Content Strategy by Version

### NextGen: TOC-Driven

**Strategy**: Complete TOC-driven architecture

**Structure**:
- Master TOC with all navigation
- Standardized paths
- Nested hierarchies
- API and Compatibility sections

**Loading**:
```typescript
loadNextGenContent() → TOC lookup → Resolve path → Load content
```

### Version 6.1: TOC-Driven with Specific Files

**Strategy**: TOC-driven with explicit file mappings

**Structure**:
- Master TOC with file-specific paths
- My Dashboard has 8 dedicated files
- Task management with nesting
- Clear parent-child relationships

**Loading**:
```typescript
load61Content() → TOC lookup → Specific file path → Load content
```

### Version 6.1.1: Basic TOC-Driven

**Strategy**: Simple TOC-driven

**Structure**:
- Basic TOC with overview files
- Ready for expansion
- Follows 6.1 patterns

### Version 5.13: Comprehensive TOC-Driven

**Strategy**: Full TOC-driven with extensive My Dashboard

**Structure**:
- 25+ My Dashboard pages
- All shared functions documented
- Complete deliverables coverage

---

## Usage Examples

### Example 1: Load NextGen Content

```tsx
import { useNextGenContent } from '../utils/useVersionContent';

function NextGenPage() {
  const { filePath, loading, error } = useNextGenContent(
    'cmdb',
    'configuration-management',
    'manage-ci'
  );
  
  if (loading) return <Loading />;
  if (error) return <Error message={error} />;
  
  return <MDXRenderer path={filePath} />;
}
```

### Example 2: Load Version 6.1 Content

```tsx
import { use61Content } from '../utils/useVersionContent';

function Version61Page() {
  const { filePath, loading, error } = use61Content(
    'my-dashboard',
    'dashboards',
    'dashboard-customization'
  );
  
  if (loading) return <Loading />;
  if (error) return <Error message={error} />;
  
  return <MDXRenderer path={filePath} />;
}
```

### Example 3: Version-Agnostic Loading

```tsx
import { useVersionContent } from '../utils/useVersionContent';

function DocumentationPage({ version, module, section, page }) {
  const { filePath, loading, error, loadedFrom } = useVersionContent(
    version,
    module,
    section,
    page
  );
  
  return (
    <VersionContentLoader
      version={version}
      moduleId={module}
      sectionId={section}
      pageId={page}
    >
      {({ filePath, loadedFrom }) => (
        <div>
          <ContentLoadingIndicator loadedFrom={loadedFrom} />
          <MDXRenderer path={filePath} />
        </div>
      )}
    </VersionContentLoader>
  );
}
```

### Example 4: Check Version Strategy

```tsx
import { useVersionStrategy } from '../utils/useVersionContent';

function VersionInfo({ version }) {
  const { isTOCDriven, strategy } = useVersionStrategy(version);
  
  return (
    <div>
      <h3>Version: {version}</h3>
      <p>Strategy: {strategy}</p>
      <p>TOC-Driven: {isTOCDriven ? 'Yes' : 'No'}</p>
    </div>
  );
}
```

---

## File Organization

```
/content/
  ├── NG/
  │   ├── index.mdx              ← NextGen TOC
  │   └── [modules]/             ← NextGen content
  ├── 6_1/
  │   ├── index.mdx              ← Version 6.1 TOC
  │   └── [modules]/             ← Version 6.1 content
  ├── 6_1_1/
  │   ├── index.mdx              ← Version 6.1.1 TOC
  │   └── [modules]/             ← Version 6.1.1 content
  └── 5_13/
      ├── index.mdx              ← Version 5.13 TOC
      └── [modules]/             ← Version 5.13 content

/utils/
  ├── versionContentLoader.ts    ← Version-specific loading
  ├── useVersionContent.ts       ← React hooks
  ├── tocLoader.ts               ← TOC loading
  └── tocParser.ts               ← TOC parsing

/components/
  └── VersionContentLoader.tsx   ← Smart loader component
```

---

## Version Comparison

| Feature | NextGen | 6.1 | 6.1.1 | 5.13 |
|---------|---------|-----|-------|------|
| **TOC File** | ✅ | ✅ | ✅ | ✅ |
| **Strategy** | TOC-driven | TOC-driven | TOC-driven | TOC-driven |
| **My Dashboard Pages** | Standard | 8 files | Basic | 25+ files |
| **API Integration** | All modules | All modules | All modules | All modules |
| **Nested Pages** | 3 levels | 3 levels | 2 levels | 3 levels |
| **Independence** | ✅ | ✅ | ✅ | ✅ |

---

## Summary

✅ **Independent TOC Files**: Each version has its own master TOC  
✅ **Separate Content Structures**: No cross-version dependencies  
✅ **Version-Specific Loaders**: Optimized for each version  
✅ **Smart Routing**: Automatic strategy detection  
✅ **Type-Safe Hooks**: TypeScript support throughout  
✅ **Easy Maintenance**: Edit one TOC file per version  

The architecture is **complete, tested, and ready for production use**.

---

**Version**: 1.0  
**Status**: Production Ready ✅  
**Last Updated**: November 26, 2024
