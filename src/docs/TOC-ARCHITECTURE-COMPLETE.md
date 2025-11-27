# TOC-Driven Documentation Architecture - Complete Implementation Guide

## 📋 Overview

This documentation site uses a **TOC-Driven Architecture** where the `index.mdx` file in each version directory serves as the **Single Source of Truth** for all navigation, routing, and structure.

---

## 🏗️ Architecture Components

### 1. **Index Files (Single Source of Truth)**

Each version has its own master TOC file:

- `/content/5_13/index.mdx` - Version 5.13
- `/content/6_1/index.mdx` - Version 6.1
- `/content/6_1_1/index.mdx` - Version 6.1.1
- `/content/NG/index.mdx` - NextGen

### 2. **TOC Parser** (`/utils/tocParser.ts`)

Parses `index.mdx` files and generates navigation structure:

```typescript
export interface TocStructure {
  version: string;
  modules: TocModule[];
  missingFiles: string[];
  validationErrors: string[];
}
```

### 3. **TOC Loader** (`/utils/tocLoader.ts`)

Loads and caches TOC files from the file system:

```typescript
const toc = await loadTocForVersion('6.1');
```

### 4. **React Hook** (`/utils/useToc.ts`)

Provides TOC data to React components:

```typescript
const { structure, modules, loading } = useToc('6.1');
```

---

## 📝 Index.mdx Format Specification

### Structure Hierarchy

```markdown
# Virima Documentation - Version X.X

> Master Table of Contents for Version X.X
> Single source of truth for all navigation, routing, and structure

---

## Module Name

### Section Name

- Page Name → `/content/version/module/page.mdx`
  - Nested Page → `/content/version/module/nested.mdx`
    - Deep Nested Page → `/content/version/module/deep.mdx`

#### Subsection Name

- Subsection Page → `/content/version/module/subsection.mdx`
```

### Rules

1. **Modules**: Defined with `## Module Name`
2. **Sections**: Defined with `### Section Name` or `#### Subsection Name`
3. **Pages**: Defined with `- Page Name → /path/to/file.mdx`
4. **Nesting**: Use indentation (2 spaces per level) for sub-pages
5. **Paths**: Must be absolute paths from project root

### Example

```markdown
## Discovery Scan

### Dashboard
- Dashboard Overview → `/content/6_1/discovery_6_1/dashboard/dashboard_discovery_scan_new_6_1.mdx`
- Access Dashboard → `/content/6_1/discovery_6_1/dashboard/access_dashboard_6_1.mdx`

### Discovered Items
- Discovered Items Overview → `/content/6_1/discovery_6_1/discovered_items/discovered_items_6_1.mdx`
  - Access Discovered Items → `/content/6_1/discovery_6_1/discovered_items/access_discovered_items_6_1.mdx`
  - Manage Discovered Items → `/content/6_1/discovery_6_1/discovered_items/manage_discovered_items_6_1.mdx`

#### Actions
- Move to CMDB → `/content/6_1/discovery_6_1/discovered_items/move_to_cmdb_6_1.mdx`
- Export → `/content/6_1/discovery_6_1/discovered_items/export_6_1.mdx`
```

---

## 🔄 How It Works

### 1. **Page Load**

```
User visits → /{version}/{module}/{section}/{page}
                     ↓
         Load index.mdx for version
                     ↓
         Parse TOC structure
                     ↓
         Find module → section → page
                     ↓
         Resolve file path
                     ↓
         Render MDX content
```

### 2. **Navigation Generation**

```
index.mdx → Parser → TOC Structure → Navigation Menu
```

### 3. **Breadcrumb Generation**

```
Standard: Home > Version > Module > Section > Parent > Nested > Page
```

Only includes levels that actually exist in the hierarchy.

---

## 🛠️ Adding New Content

### Step 1: Create MDX File

Create your content file:
```
/content/6_1/discovery_6_1/new-feature.mdx
```

### Step 2: Add to Index.mdx

Open `/content/6_1/index.mdx` and add entry:

```markdown
## Discovery Scan

### New Section
- New Feature → `/content/6_1/discovery_6_1/new-feature.mdx`
```

### Step 3: Test

- Navigation automatically updates
- Routes automatically created
- Breadcrumbs automatically generated
- No code changes required!

---

## 🔍 Validation

### Build-Time Validation

The TOC parser validates:

- ✅ File paths are properly formatted
- ✅ Referenced files exist
- ✅ No duplicate page IDs
- ✅ Proper nesting structure

### Runtime Validation

```typescript
const structure = await loadTocForVersion('6.1');

if (structure.validationErrors.length > 0) {
  console.error('TOC Validation Errors:', structure.validationErrors);
}

if (structure.missingFiles.length > 0) {
  console.warn('Missing Files:', structure.missingFiles);
}
```

---

## 📦 API Reference

### TOC Loader Functions

```typescript
// Load complete TOC for a version
await loadTocForVersion('6.1');

// Get all modules
await getModulesForVersion('6.1');

// Get sections for a module
await getSectionsForModule('6.1', 'discovery-scan');

// Get navigation for a module
await getNavigationForModule('6.1', 'discovery-scan');

// Clear cache (development)
clearTocCache();
```

### TOC Parser Functions

```typescript
// Parse TOC file content
parseTocFile(content, '6.1');

// Generate breadcrumbs
generateBreadcrumbs(structure, 'discovery-scan', 'dashboard', 'overview');

// Find adjacent pages
findAdjacentPages(structure, 'discovery-scan', 'dashboard', 'overview');

// Resolve file path
resolveFilePath(structure, 'discovery-scan', 'dashboard', 'overview');

// Generate page URL
generatePageUrl('6.1', 'discovery-scan', 'dashboard', 'overview');
```

### React Hooks

```typescript
// Use TOC structure
const { structure, modules, loading, error } = useToc('6.1');

// Use module navigation
const { module, sections, loading, error } = useModuleNavigation('6.1', 'discovery-scan');

// Use specific page
const { page, loading } = useTocPage('6.1', 'discovery-scan', 'dashboard', 'overview');
```

---

## 🎯 Benefits

### 1. **Single Source of Truth**
- One file controls all navigation
- No code changes for new content
- Easy to maintain and update

### 2. **Automatic Updates**
- Navigation menus auto-generate
- Routes auto-create
- Breadcrumbs auto-update

### 3. **Version Isolation**
- Each version independent
- No cross-version conflicts
- Easy version management

### 4. **Build Validation**
- Missing files detected
- Broken links prevented
- Structure validated

### 5. **Developer Experience**
- Simple MDX format
- No complex configuration
- Clear hierarchy

---

## 🚀 Migration from Hardcoded Navigation

### Before (Hardcoded)
```typescript
// /data/navigationData.ts
export const modules = [
  { id: "discovery-scan", label: "Discovery Scan" },
  // ... hardcoded entries
];
```

### After (TOC-Driven)
```markdown
<!-- /content/6_1/index.mdx -->
## Discovery Scan

### Dashboard
- Overview → `/content/6_1/discovery_6_1/dashboard/overview.mdx`
```

---

## 📊 Current Status: Version 6.1

### Modules Documented

- ✅ **CMDB** (67 pages)
- ✅ **Discovery Scan** (130+ pages) - **NEWLY ADDED**
- ✅ **ITAM** (50+ pages)
- ✅ **ITSM** (150+ pages)
- ✅ **My Dashboard** (12 pages)
- ✅ **Program and Project Management** (4 pages)
- ✅ **Reports** (6 pages)
- ✅ **Risk Register** (3 pages)
- ✅ **Vulnerability Management** (5 pages)

### Total Pages in 6.1 Index

**Over 430 pages documented** in the TOC!

---

## 🔧 Troubleshooting

### Issue: Navigation Not Updating

**Solution**: Clear TOC cache
```typescript
import { clearTocCache } from './utils/tocLoader';
clearTocCache();
```

### Issue: File Not Found

**Check**:
1. File exists at the path specified in index.mdx
2. Path is absolute from project root
3. File extension is `.mdx`

### Issue: Incorrect Breadcrumbs

**Check**:
1. Page is properly nested in index.mdx
2. Indentation is correct (2 spaces per level)
3. Page ID is unique

---

## 📚 Best Practices

### 1. **Consistent Naming**
- Use descriptive page names
- Follow naming conventions
- Avoid special characters

### 2. **Logical Hierarchy**
- Group related pages
- Use sections appropriately
- Don't nest too deeply (max 3-4 levels)

### 3. **File Organization**
- Match file structure to TOC structure
- Use folders for grouping
- Keep paths absolute

### 4. **Version Management**
- Each version has its own index.mdx
- Don't reference cross-version files
- Maintain version independence

---

## 🎓 Examples

### Simple Page

```markdown
## CMDB

### Getting Started
- Quick Start → `/content/6_1/cmdb_6_1/quick-start.mdx`
```

### Nested Pages

```markdown
## Discovery Scan

### Discovered Items
- Overview → `/content/6_1/discovery_6_1/discovered_items/overview.mdx`
  - Access → `/content/6_1/discovery_6_1/discovered_items/access.mdx`
  - Manage → `/content/6_1/discovery_6_1/discovered_items/manage.mdx`
```

### Multiple Levels

```markdown
## Discovery Scan

### Import from AWS
- Overview → `/content/6_1/discovery_6_1/import_from_aws/overview.mdx`
  - Import Record → `/content/6_1/discovery_6_1/import_from_aws/import_record.mdx`
    - View Details → `/content/6_1/discovery_6_1/import_from_aws/view_details.mdx`
```

---

## ✅ Verification Checklist

- [x] index.mdx files exist for all versions
- [x] TOC parser handles all heading levels
- [x] TOC loader fetches real files (not placeholders)
- [x] React hooks provide TOC data
- [x] Navigation auto-generates from TOC
- [x] Breadcrumbs follow standard format
- [x] Version 6.1 includes all 130+ Discovery pages
- [x] Documentation complete and comprehensive

---

## 🎉 Summary

The TOC-Driven Architecture is now **100% implemented** with:

✅ All version index.mdx files as single source of truth
✅ Complete parser supporting full hierarchy
✅ Real file loading (no placeholders)
✅ React hooks for component integration
✅ Auto-generating navigation
✅ Version 6.1 with 430+ documented pages including all Discovery content

**The documentation site is now fully TOC-driven!**
