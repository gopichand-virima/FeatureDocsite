# Hierarchical TOC System - Complete Solution

## 🎯 Problem Solved

**Before:** Single massive `index.mdx` file with 1000+ lines, Vite `?raw` imports failing in Figma Make, difficult maintenance.

**After:** Small, focused `index.mdx` files (20-50 lines each), works everywhere, easy to update locally.

## 📦 What's Included

### Core System
- **`/utils/hierarchicalTocLoader.ts`** - Main hierarchical navigation loader
  - Runtime file loading (no Vite dependencies)
  - Lazy loading for performance
  - Caching for speed
  - Support for nested hierarchies

### Migration Tools
- **`/scripts/migrateToHierarchical.ts`** - Analyzes existing TOC and generates migration plan
- **`/utils/unifiedTocLoader.ts`** - Compatibility layer for gradual migration

### Documentation
- **`/docs/HIERARCHICAL-TOC-SYSTEM.md`** - Complete technical documentation
- **`/docs/HIERARCHICAL-QUICK-START.md`** - Quick start guide for content creators
- **`/docs/HIERARCHICAL-TOC-IMPLEMENTATION.md`** - Implementation overview
- **`/docs/HIERARCHICAL-TOC-DIAGRAM.md`** - Visual diagrams and workflows
- **`/HIERARCHICAL-TOC-README.md`** - This file

### Example Files
- **`/content/6_1/discovery_6_1/index.mdx`** - Module-level example
- **`/content/6_1/discovery_6_1/dashboard/index.mdx`** - Section-level example
- **`/content/6_1/discovery_6_1/run_a_scan/index.mdx`** - Section-level example
- **`/content/6_1/discovery_6_1/recent_scans/index.mdx`** - Section-level example

## 🚀 Quick Start

### For Content Creators

Want to add a new page? Just edit one small file:

```markdown
# Edit: /content/6_1/discovery_6_1/dashboard/index.mdx (20 lines)

## Dashboard Pages
- Dashboard → `/content/6_1/.../dashboard.mdx`
- Access Dashboard → `/content/6_1/.../access.mdx`
- Export Results → `/content/6_1/.../export.mdx`  ← ADD THIS LINE
```

Want to add a new section? Create its folder and index:

```bash
mkdir /content/6_1/discovery_6_1/scan_templates
# Create index.mdx in that folder
# Add reference in parent index
```

**Read:** `/docs/HIERARCHICAL-QUICK-START.md`

### For Developers

Use the new loader in your components:

```typescript
import { loadHierarchicalToc, loadSectionPages } from '@/utils/hierarchicalTocLoader';

// Load main structure
const toc = await loadHierarchicalToc('6.1');

// Lazy load section when needed
const pages = await loadSectionPages('6.1', 'discovery-scan', 'dashboard');

// Resolve file path
const filePath = await resolveHierarchicalFilePath(
  '6.1',
  'discovery-scan',
  'dashboard',
  'access-dashboard'
);
```

**Read:** `/docs/HIERARCHICAL-TOC-SYSTEM.md`

## 📁 File Structure

```
/content/
├── 6_1/
│   ├── index.mdx                     # Lists all modules
│   ├── discovery_6_1/
│   │   ├── index.mdx                 # Lists Discovery sections
│   │   ├── dashboard/
│   │   │   ├── index.mdx             # Lists Dashboard pages
│   │   │   └── *.mdx                 # Actual content
│   │   ├── run_a_scan/
│   │   │   ├── index.mdx
│   │   │   └── *.mdx
│   │   └── recent_scans/
│   │       ├── index.mdx
│   │       └── *.mdx
│   └── ...
└── NG/
    └── ... (same structure)
```

## 📝 Index.mdx Format

### Point to a file (page):
```markdown
- Page Name → `/content/6_1/module/page.mdx`
```

### Point to a folder (with index.mdx):
```markdown
- Section Name → `/content/6_1/module/section`
```

### Create nested pages (2-space indentation):
```markdown
- Parent → `/content/6_1/module/parent.mdx`
  - Child → `/content/6_1/module/child.mdx`
    - Grandchild → `/content/6_1/module/grandchild.mdx`
```

## ✅ Benefits

### For Content Creators
- Easy to find which file to update (follow folder structure)
- Small files (20-50 lines vs 1000+ lines)
- No merge conflicts when multiple people work
- Clear organization

### For Developers  
- Works in any environment (no Vite quirks)
- Lazy loading improves performance
- Clean, maintainable code
- Better caching strategy

### For Users
- Faster page loads
- Reliable navigation
- No broken links
- Consistent experience

## 🔄 Migration Path

### Phase 1: Test (Current)
- [x] Core system implemented
- [x] Examples created
- [x] Documentation written
- [ ] Test with Discovery module

### Phase 2: Migrate One Module
1. Create index.mdx files for Discovery module
2. Test navigation thoroughly
3. Enable hierarchical system
4. Monitor for issues

### Phase 3: Migrate All Modules
Repeat Phase 2 for:
- Admin, CMDB, ITAM, ITSM
- Vulnerability Management
- Program/Project Management
- Reports, Risk Register

### Phase 4: Migrate Other Versions
- NextGen
- Version 6.1.1
- Version 5.13

### Phase 5: Cleanup
- Remove old tocLoader.ts
- Update components
- Archive migration tools

**Timeline:** ~1 month for full migration

## 📚 Documentation Guide

Start here based on your role:

| Role | Start With | Then Read |
|------|------------|-----------|
| **Content Creator** | Quick Start | TOC System (basics) |
| **Developer** | TOC System | Implementation |
| **Team Lead** | Implementation | All docs |
| **New Team Member** | Quick Start | Visual Diagrams |

### Documentation Files

1. **`HIERARCHICAL-TOC-README.md`** (This file)
   - Overview and quick links
   - Good for first-time readers

2. **`HIERARCHICAL-QUICK-START.md`**
   - Step-by-step examples
   - Templates and checklists
   - Common tasks
   - Best for content creators

3. **`HIERARCHICAL-TOC-SYSTEM.md`**
   - Complete technical documentation
   - API reference
   - Best practices
   - Troubleshooting
   - Best for developers

4. **`HIERARCHICAL-TOC-IMPLEMENTATION.md`**
   - Implementation overview
   - Migration guide
   - Testing checklist
   - Next steps
   - Best for project leads

5. **`HIERARCHICAL-TOC-DIAGRAM.md`**
   - Visual diagrams
   - Flow charts
   - Before/after comparisons
   - Best for understanding the system

## 🛠️ Common Tasks

### Add a New Page
1. Create the `.mdx` file
2. Add one line to section's `index.mdx`
3. Done!

### Add a New Section
1. Create folder with `index.mdx`
2. List pages in section's `index.mdx`
3. Add reference in module's `index.mdx`
4. Done!

### Reorder Pages
Edit section's `index.mdx` and move lines around.

### Move Page to Different Section
1. Add line in new section's `index.mdx`
2. Remove line from old section's `index.mdx`
3. Done!

## 🔍 Key Files Reference

### To Use the System
- `/utils/hierarchicalTocLoader.ts` - Import and use this
- `/docs/HIERARCHICAL-TOC-SYSTEM.md` - API documentation

### To Create Index Files
- `/docs/HIERARCHICAL-QUICK-START.md` - Templates and examples
- `/content/6_1/discovery_6_1/dashboard/index.mdx` - Working example

### To Migrate
- `/scripts/migrateToHierarchical.ts` - Analyzes existing TOC
- `/utils/unifiedTocLoader.ts` - Works with both old and new
- `/docs/HIERARCHICAL-TOC-IMPLEMENTATION.md` - Migration guide

### To Understand
- `/docs/HIERARCHICAL-TOC-DIAGRAM.md` - Visual explanations
- This file - Overview and links

## 📖 Examples

### Example 1: Simple Section Index

```markdown
# Dashboard - Discovery - Version 6.1

> Local index for Dashboard section

---

## Dashboard Pages

- Dashboard Overview → `/content/6_1/discovery_6_1/dashboard/overview_6_1.mdx`
- Access Dashboard → `/content/6_1/discovery_6_1/dashboard/access_6_1.mdx`
- Dashboard Features → `/content/6_1/discovery_6_1/dashboard/features_6_1.mdx`
```

### Example 2: Complex Nested Structure

```markdown
# Admin - Version 6.1

---

## Organizational Details

- About → `/content/6_1/admin_6_1/org_details/about_6_1.mdx`
  - Cost Center → `/content/6_1/admin_6_1/org_details/cost_center_6_1.mdx`
  - Departments → `/content/6_1/admin_6_1/org_details/departments_6_1.mdx`
    - Members → `/content/6_1/admin_6_1/org_details/dept_members_6_1.mdx`
  - Locations → `/content/6_1/admin_6_1/org_details/locations_6_1.mdx`
```

## 🧪 Testing

### Test Hierarchical System
```typescript
import { testHierarchicalSystem } from '@/utils/unifiedTocLoader';

const result = await testHierarchicalSystem('6.1');
console.log(result); // { success: true, modules: 10, sections: 45 }
```

### Compare Old vs New
```typescript
import { compareSystems } from '@/utils/unifiedTocLoader';

const comparison = await compareSystems('6.1');
console.log(comparison); // Shows if both systems produce same structure
```

## ⚠️ Important Notes

1. **Use absolute paths** starting with `/content/`
2. **Use 2-space indentation** for nested pages
3. **Test navigation** after creating index files
4. **Clear cache** if changes don't show: `clearHierarchicalCache()`
5. **Check console** for detailed loading logs

## 🆘 Getting Help

1. **Read the docs** (start with Quick Start)
2. **Check examples** in `/content/6_1/discovery_6_1/`
3. **Review console logs** (detailed loading information)
4. **Test with tools** (testHierarchicalSystem, compareSystems)
5. **Clear cache** and retry

## 📊 Current Status

| Component | Status | Notes |
|-----------|--------|-------|
| Core System | ✅ Complete | Ready to use |
| Migration Tools | ✅ Complete | Ready to use |
| Documentation | ✅ Complete | All docs written |
| Examples | ✅ Complete | Discovery module examples |
| Testing | 🟡 In Progress | Need to test with full module |
| Migration | ⏳ Pending | Ready to start |

## 🎯 Next Actions

### For You (Content Creator)
1. Read `/docs/HIERARCHICAL-QUICK-START.md`
2. Look at examples in `/content/6_1/discovery_6_1/`
3. Try creating an index.mdx for one section
4. Test in browser

### For Developer
1. Read `/docs/HIERARCHICAL-TOC-SYSTEM.md`
2. Review `/utils/hierarchicalTocLoader.ts`
3. Test with `loadHierarchicalToc('6.1')`
4. Integrate into navigation components

### For Project Lead
1. Read `/docs/HIERARCHICAL-TOC-IMPLEMENTATION.md`
2. Review migration timeline
3. Assign module owners
4. Set milestones

## 📞 Support

### Documentation
- 📘 Quick Start: `/docs/HIERARCHICAL-QUICK-START.md`
- 📗 Technical Docs: `/docs/HIERARCHICAL-TOC-SYSTEM.md`
- 📙 Implementation: `/docs/HIERARCHICAL-TOC-IMPLEMENTATION.md`
- 📕 Visual Guide: `/docs/HIERARCHICAL-TOC-DIAGRAM.md`

### Examples
- Discovery Module: `/content/6_1/discovery_6_1/`
- Dashboard Section: `/content/6_1/discovery_6_1/dashboard/`
- Run a Scan: `/content/6_1/discovery_6_1/run_a_scan/`

### Tools
- Migration Script: `/scripts/migrateToHierarchical.ts`
- Unified Loader: `/utils/unifiedTocLoader.ts`
- Core System: `/utils/hierarchicalTocLoader.ts`

## 🎉 Summary

The Hierarchical TOC System provides a clean, scalable solution for managing documentation navigation. Instead of one massive file, each folder manages its own structure through small, focused index.mdx files.

**Key Advantages:**
- ✅ Works in Figma Make (no Vite dependencies)
- ✅ Easy to maintain (small files, clear organization)
- ✅ Scalable (supports thousands of pages)
- ✅ Fast (lazy loading + caching)
- ✅ Team-friendly (no merge conflicts)

**Ready to Use:**
- All code implemented
- Documentation complete
- Examples provided
- Migration tools ready

**Start Here:**
- Content creators → `/docs/HIERARCHICAL-QUICK-START.md`
- Developers → `/docs/HIERARCHICAL-TOC-SYSTEM.md`
- Everyone → Look at `/content/6_1/discovery_6_1/` examples

---

**Status:** ✅ Ready for Migration
**Date:** November 27, 2024
**Version:** 1.0
