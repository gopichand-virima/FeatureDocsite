# Hierarchical TOC System - Decentralized Navigation

## Overview

The Hierarchical TOC System implements a **decentralized navigation structure** where each folder manages its own hierarchy through local `index.mdx` files. This solves the `?raw` import issues in Figma Make and provides superior scalability.

## Architecture

### Three-Level Hierarchy

1. **Version Level** (`/content/6_1/index.mdx`)
   - Lists all major modules (Admin, CMDB, Discovery, ITSM, ITAM, etc.)
   - Points to module-level or section-level index files

2. **Module/Section Level** (`/content/6_1/discovery_6_1/index.mdx`)
   - Lists all sections within the module
   - Points to section-level index files or direct pages

3. **Subsection Level** (`/content/6_1/discovery_6_1/dashboard/index.mdx`)
   - Lists all pages in the subsection
   - Can have nested page hierarchies

## File Structure

```
/content/
├── 6_1/
│   ├── index.mdx                    # Version-level TOC (lists modules)
│   ├── admin_6_1/
│   │   └── index.mdx                # Admin module TOC (lists sections)
│   ├── discovery_6_1/
│   │   ├── index.mdx                # Discovery module TOC (lists sections)
│   │   ├── dashboard/
│   │   │   ├── index.mdx            # Dashboard section TOC (lists pages)
│   │   │   ├── dashboard_discovery_scan_new_6_1.mdx
│   │   │   ├── access_dashboard_6_1.mdx
│   │   │   └── ...
│   │   ├── run_a_scan/
│   │   │   ├── index.mdx            # Run a Scan section TOC
│   │   │   └── ...
│   │   └── recent_scans/
│   │       ├── index.mdx            # Recent Scans section TOC
│   │       └── ...
│   └── ...
└── NG/
    ├── index.mdx
    └── ...
```

## Index.mdx Format

### Version-Level Index (`/content/6_1/index.mdx`)

```markdown
# Virima Documentation - Version 6.1

> Master Table of Contents for Version 6.1

---

## Admin

### Overview
- Admin Functions → `/content/6_1/admin_6_1/admin/admin_functions_new_6_1.mdx`

### Organizational Details
- About Organizational Details → `/content/6_1/admin_6_1/admin_org_details/about_org_details_6_1.mdx`
- Cost Center → `/content/6_1/admin_6_1/admin_org_details/cost_center_6_1.mdx`

### Discovery
- Admin Discovery → `/content/6_1/admin_6_1/admin_discovery`

---

## Discovery Scan

### Overview
- About Discovery Scan → `/content/6_1/discovery_6_1/about_discovery_scan_6_1.mdx`

### Dashboard
- Dashboard → `/content/6_1/discovery_6_1/dashboard`
```

### Module-Level Index (`/content/6_1/discovery_6_1/index.mdx`)

```markdown
# Discovery Scan - Version 6.1

> Local Table of Contents for Discovery Module

---

## Overview
- About Discovery Scan → `/content/6_1/discovery_6_1/about_discovery_scan_6_1.mdx`

---

## Dashboard
- Dashboard → `/content/6_1/discovery_6_1/dashboard`

---

## Run a Scan
- Run a Scan → `/content/6_1/discovery_6_1/run_a_scan`

---

## Recent Scans
- Recent Scans → `/content/6_1/discovery_6_1/recent_scans`
```

### Section-Level Index (`/content/6_1/discovery_6_1/dashboard/index.mdx`)

```markdown
# Discovery Dashboard - Version 6.1

> Local index for Dashboard section

---

## Dashboard Pages

- Dashboard → `/content/6_1/discovery_6_1/dashboard/dashboard_discovery_scan_new_6_1.mdx`
  - Access Dashboard → `/content/6_1/discovery_6_1/dashboard/access_dashboard_6_1.mdx`
  - Dashboard Features → `/content/6_1/discovery_6_1/dashboard/dashboard_features_6_1.mdx`
  - Add Contents → `/content/6_1/discovery_6_1/dashboard/add_contents_6_1.mdx`
  - Dashboard Customization → `/content/6_1/discovery_6_1/dashboard/dashboard_customization_6_1.mdx`
```

## Path Conventions

### Pointing to a File
```markdown
- Page Name → `/content/6_1/module/section/page.mdx`
```

### Pointing to a Folder (with index.mdx)
```markdown
- Section Name → `/content/6_1/module/section`
```

The system automatically looks for `/content/6_1/module/section/index.mdx`

### Nested Pages
Use indentation (2 spaces per level):

```markdown
- Parent Page → `/content/6_1/module/parent.mdx`
  - Child Page 1 → `/content/6_1/module/child1.mdx`
  - Child Page 2 → `/content/6_1/module/child2.mdx`
    - Grandchild → `/content/6_1/module/grandchild.mdx`
```

## Benefits

### ✅ Scalability
Each section manages its own hierarchy. No massive centralized files.

### ✅ Easy Maintenance
Want to add a new page to Discovery Dashboard? Just update:
```
/content/6_1/discovery_6_1/dashboard/index.mdx
```

No need to search through a 1000-line file!

### ✅ Better Organization
Logical grouping - related content is defined together.

### ✅ Lazy Loading
Only load navigation structure when needed. Improves performance.

### ✅ Works Everywhere
No Vite-specific features. Works in Figma Make, Netlify, Vercel, etc.

### ✅ Version Control Friendly
Small, focused changes. Better diffs and merge conflict resolution.

## Usage

### Loading Navigation

```typescript
import { loadHierarchicalToc, loadSectionPages } from '@/utils/hierarchicalTocLoader';

// Load main structure
const toc = await loadHierarchicalToc('6.1');

// Lazy load section pages when user navigates there
const dashboardPages = await loadSectionPages('6.1', 'discovery-scan', 'dashboard');
```

### Resolving File Paths

```typescript
import { resolveHierarchicalFilePath } from '@/utils/hierarchicalTocLoader';

const filePath = await resolveHierarchicalFilePath(
  '6.1',
  'discovery-scan',
  'dashboard',
  'access-dashboard'
);
// Returns: /content/6_1/discovery_6_1/dashboard/access_dashboard_6_1.mdx
```

## Migration Guide

### Step 1: Create Module-Level Index Files

For each module, create an `index.mdx`:

```bash
/content/6_1/admin_6_1/index.mdx
/content/6_1/cmdb_6_1/index.mdx
/content/6_1/discovery_6_1/index.mdx
/content/6_1/itam_6_1/index.mdx
/content/6_1/itsm_6_1/index.mdx
```

### Step 2: Create Section-Level Index Files

For each major section, create an `index.mdx`:

```bash
/content/6_1/discovery_6_1/dashboard/index.mdx
/content/6_1/discovery_6_1/run_a_scan/index.mdx
/content/6_1/discovery_6_1/recent_scans/index.mdx
```

### Step 3: Update Version-Level Index

Simplify the version index to only reference modules and major sections:

```markdown
## Discovery Scan

### Overview
- About Discovery Scan → `/content/6_1/discovery_6_1/about_discovery_scan_6_1.mdx`

### Dashboard
- Dashboard → `/content/6_1/discovery_6_1/dashboard`
```

### Step 4: Update Components

Update navigation components to use the hierarchical loader:

```typescript
// Old
import { loadTocForVersion } from '@/utils/tocLoader';

// New
import { loadHierarchicalToc } from '@/utils/hierarchicalTocLoader';
```

## Best Practices

### 1. Keep Index Files Focused
Each index.mdx should manage only its immediate children.

### 2. Use Consistent Naming
- Module folders: `module_version` (e.g., `discovery_6_1`)
- Section folders: `section_name` (e.g., `dashboard`, `run_a_scan`)
- Files: `descriptive_name_version.mdx` (e.g., `access_dashboard_6_1.mdx`)

### 3. Document Your Structure
Add a comment at the top of each index.mdx explaining its scope:

```markdown
# Discovery Scan - Version 6.1

> Local Table of Contents for Discovery Module
> Manages all Discovery subsections and their pages
```

### 4. Test Navigation
After creating index files, test that navigation works:
- Can users navigate to all pages?
- Are breadcrumbs correct?
- Do nested pages work?

### 5. Use Version Control
Commit index files separately with descriptive messages:
```bash
git add content/6_1/discovery_6_1/dashboard/index.mdx
git commit -m "Add hierarchical TOC for Discovery Dashboard section"
```

## Comparison: Old vs New

### Old System (Centralized)

**Problems:**
- ❌ Single massive index.mdx file (1000+ lines)
- ❌ Hard to find what to update
- ❌ Vite `?raw` imports don't work in Figma Make
- ❌ Merge conflicts when multiple people edit
- ❌ Poor performance loading everything at once

**Example:**
```markdown
# /content/6_1/index.mdx (1200 lines)

## Discovery Scan
### Dashboard
- Dashboard → ...
- Access Dashboard → ...
- Dashboard Features → ...
... (50 more dashboard pages)
### Run a Scan
... (40 more scan pages)
### Recent Scans
... (30 more pages)
... (continues for 1000+ lines)
```

### New System (Decentralized)

**Benefits:**
- ✅ Small, focused index files (20-50 lines each)
- ✅ Easy to find and update
- ✅ Works in any environment
- ✅ Minimal merge conflicts
- ✅ Lazy loading for better performance

**Example:**
```markdown
# /content/6_1/index.mdx (100 lines)
## Discovery Scan
- About → ...
- Dashboard → /content/6_1/discovery_6_1/dashboard

# /content/6_1/discovery_6_1/index.mdx (50 lines)
## Dashboard
- Dashboard → /content/6_1/discovery_6_1/dashboard

# /content/6_1/discovery_6_1/dashboard/index.mdx (20 lines)
- Dashboard → ...
- Access Dashboard → ...
- Dashboard Features → ...
```

## Troubleshooting

### Issue: Navigation not showing pages

**Solution:** Check that the index.mdx file exists and has correct paths:
```bash
# Check if file exists
ls -la /content/6_1/discovery_6_1/dashboard/index.mdx

# Check content
cat /content/6_1/discovery_6_1/dashboard/index.mdx
```

### Issue: Paths not resolving

**Solution:** Verify path format:
- ✅ `/content/6_1/module/page.mdx` (absolute path)
- ❌ `module/page.mdx` (relative path)
- ❌ `./page.mdx` (relative path)

### Issue: Nested pages not working

**Solution:** Check indentation (must be 2 spaces per level):
```markdown
- Parent → /path/to/parent.mdx
  - Child → /path/to/child.mdx    ✅ (2 spaces)
    - Grandchild → /path/to/grandchild.mdx    ✅ (4 spaces)
```

### Issue: Changes not reflecting

**Solution:** Clear the cache:
```typescript
import { clearHierarchicalCache } from '@/utils/hierarchicalTocLoader';

clearHierarchicalCache();
```

## API Reference

### `loadHierarchicalToc(version: string)`
Loads the main TOC structure for a version.

**Returns:** `Promise<HierarchicalTocStructure>`

### `loadSectionPages(version: string, moduleId: string, sectionId: string)`
Lazy loads pages for a specific section.

**Returns:** `Promise<HierarchicalPage[]>`

### `loadPageSubpages(page: HierarchicalPage)`
Lazy loads subpages for a specific page.

**Returns:** `Promise<HierarchicalPage[]>`

### `resolveHierarchicalFilePath(version, moduleId, sectionId, pageId)`
Resolves the MDX file path for a page.

**Returns:** `Promise<string | null>`

### `clearHierarchicalCache()`
Clears all cached TOC data.

**Returns:** `void`

## Next Steps

1. Create index.mdx files for all modules and sections
2. Update navigation components to use hierarchical loader
3. Test navigation thoroughly
4. Document any custom patterns specific to your content
5. Train team on new system

## Support

For questions or issues:
1. Check this documentation
2. Review example index.mdx files in `/content/6_1/discovery_6_1/`
3. Check console logs for detailed loading information
4. Clear cache if seeing stale data
