# Single Source of Truth: index.mdx Implementation Guide

## Overview

This document describes the implementation of index.mdx as the single source of truth for navigation structure, eliminating duplication between index.mdx and navigationData.ts.

---

## ✅ Benefits

| Benefit | Description |
|---------|-------------|
| **Single Source** | All TOC changes happen in one place (index.mdx) |
| **No Duplication** | Eliminates sync issues between two files |
| **Auto-Generated** | navigationData.ts updates automatically |
| **Version Control** | Clear history of all navigation changes |
| **Less Error-Prone** | Can't forget to update both files |
| **Scalable** | Perfect for 818+ files across 4 versions |

---

## 📁 File Structure

### Source Files (EDIT THESE)
```
/content/
├── 6_1/
│   └── index.mdx          ← Edit this for version 6.1
├── 6_1_1/
│   └── index.mdx          ← Edit this for version 6.1.1
├── 5_13/
│   └── index.mdx          ← Edit this for version 5.13
└── NG/
    └── index.mdx          ← Edit this for NextGen
```

### Generated Files (AUTO-GENERATED - DO NOT EDIT)
```
/data/
├── navigationData.ts      ← Generated from index.mdx
└── navigationData.backup.ts  ← Auto-backup before generation
```

### Scripts
```
/scripts/
├── generate-nav.js        ← Main generation script
├── parseIndexMDX.js       ← Parser utility
└── generateNavigationFromTOC.js  ← Alternative implementation
```

---

## 🚀 Quick Start

### Step 1: Add Scripts to package.json

```json
{
  "scripts": {
    "generate-nav": "node scripts/generate-nav.js",
    "prebuild": "npm run generate-nav",
    "dev": "npm run generate-nav && next dev",
    "watch-nav": "nodemon --watch content/**/index.mdx --exec npm run generate-nav"
  },
  "devDependencies": {
    "nodemon": "^3.0.0"
  }
}
```

### Step 2: Generate Navigation

```bash
# Generate once
npm run generate-nav

# Auto-generate on file change
npm run watch-nav

# Runs automatically before build
npm run build
```

### Step 3: Edit TOC in index.mdx

Edit `/content/6_1/index.mdx` (or other version):

```markdown
## Admin

### Organizational Details

- Cost Center → `/content/6_1/admin_6_1/...`
- Departments → `/content/6_1/admin_6_1/...`
  - Members → `/content/6_1/admin_6_1/...`
```

### Step 4: Run Generator

```bash
npm run generate-nav
```

✅ navigationData.ts is automatically updated!

---

## 📝 index.mdx Format

### Basic Structure

```markdown
# Version X.X Documentation

> Master Table of Contents

---

## Module Name

### Section Name

- Page Name → `/content/version/path/file.mdx`
- Parent Page → `/content/version/path/parent.mdx`
  - Child Page → `/content/version/path/child.mdx`
    - Grandchild Page → `/content/version/path/grandchild.mdx`
```

### Nesting Rules

| Indentation | Level | Example |
|-------------|-------|---------|
| 0 spaces | Top-level page | `- Page Name →` |
| 2 spaces | Sub-page | `  - Child Page →` |
| 4 spaces | Sub-sub-page | `    - Grandchild →` |
| 6 spaces | Sub-sub-sub-page | `      - Great-grandchild →` |

### Example: Admin Module

```markdown
## Admin

### Organizational Details

- Cost Center → `/content/6_1/admin_6_1/org/cost_center.mdx`
- Departments → `/content/6_1/admin_6_1/org/departments.mdx`
  - Members → `/content/6_1/admin_6_1/org/dept_members.mdx`

### Discovery

- Application Map → `/content/6_1/admin_6_1/discovery/app_map.mdx`
- Client → `/content/6_1/admin_6_1/discovery/client.mdx`
  - Discovery Agents → `/content/6_1/admin_6_1/discovery/agents.mdx`
  - Remote Install → `/content/6_1/admin_6_1/discovery/remote_install.mdx`
- Credentials → `/content/6_1/admin_6_1/discovery/credentials.mdx`
  - Details → `/content/6_1/admin_6_1/discovery/cred_details.mdx`
  - Flush Credential → `/content/6_1/admin_6_1/discovery/flush_cred.mdx`
```

---

## 🔧 How It Works

### 1. Parsing Process

```
index.mdx
    ↓
Parser reads markdown
    ↓
Identifies modules (##)
    ↓
Identifies sections (###)
    ↓
Parses list items with indentation
    ↓
Builds hierarchical structure
    ↓
Converts to TypeScript
    ↓
Writes navigationData.ts
```

### 2. Data Flow

```
Source:     /content/6_1/index.mdx
Parser:     /scripts/generate-nav.js
Output:     /data/navigationData.ts
Consumers:  NavigationMenu.tsx, ResizableSidebar.tsx, etc.
```

### 3. Generated Structure

```typescript
// AUTO-GENERATED from index.mdx

export const adminSections = [
  {
    id: "admin",
    title: "Admin",
    label: "Admin",
    pages: [
      {
        id: "organizational-details",
        label: "Organizational Details",
        subPages: [
          { id: "cost-center", label: "Cost Center" },
          {
            id: "departments",
            label: "Departments",
            subPages: [
              { id: "members", label: "Members" }
            ]
          }
        ]
      }
    ]
  }
];
```

---

## 📋 Workflow for Updates

### Scenario 1: Add New Page

**Before:**
```markdown
### Discovery

- Application Map → `/content/6_1/.../app_map.mdx`
- Client → `/content/6_1/.../client.mdx`
```

**After:**
```markdown
### Discovery

- Application Map → `/content/6_1/.../app_map.mdx`
- Client → `/content/6_1/.../client.mdx`
- Correlation → `/content/6_1/.../correlation.mdx`  ← NEW
```

**Commands:**
```bash
npm run generate-nav
```

✅ Done! Navigation automatically updated.

### Scenario 2: Add Nested Item

**Before:**
```markdown
- Client → `/content/6_1/.../client.mdx`
```

**After:**
```markdown
- Client → `/content/6_1/.../client.mdx`
  - Discovery Agents → `/content/6_1/.../agents.mdx`  ← NEW
  - Remote Install → `/content/6_1/.../remote.mdx`    ← NEW
```

**Commands:**
```bash
npm run generate-nav
```

✅ Nesting automatically handled!

### Scenario 3: Reorganize Structure

**Before:**
```markdown
### Section A
- Page 1 → ...
- Page 2 → ...

### Section B
- Page 3 → ...
```

**After:**
```markdown
### Section A
- Page 1 → ...

### Section B  
- Page 2 → ...  ← MOVED
- Page 3 → ...
```

**Commands:**
```bash
npm run generate-nav
```

✅ Structure automatically updated!

---

## 🔍 Validation

### Pre-Generation Checks

Script automatically validates:
- ✅ Proper markdown syntax
- ✅ Consistent indentation (2 spaces)
- ✅ Valid headers (##, ###)
- ✅ Proper list format (- Title →)

### Post-Generation Checks

```bash
# Check generated file
cat data/navigationData.ts

# Verify structure
npm run validate-toc

# Test in development
npm run dev
```

### Manual Verification

1. **Visual Check**: Navigate through UI
2. **Expand/Collapse**: Test all nested items
3. **Click Links**: Verify routing works
4. **Check Breadcrumbs**: Ensure hierarchy displays correctly

---

## ⚠️ Common Mistakes to Avoid

### ❌ Mistake 1: Editing Generated File

```typescript
// In data/navigationData.ts
export const adminSections = [  // ← DON'T EDIT THIS!
```

**Fix**: Edit index.mdx instead

### ❌ Mistake 2: Wrong Indentation

```markdown
- Parent → ...
   - Child → ...  ← 3 spaces (WRONG)
```

**Fix**: Use exactly 2 spaces per level

```markdown
- Parent → ...
  - Child → ...  ← 2 spaces (CORRECT)
```

### ❌ Mistake 3: Missing Arrow

```markdown
- Page Name /content/...  ← Missing →
```

**Fix**: Always use arrow separator

```markdown
- Page Name → /content/...  ← Correct
```

### ❌ Mistake 4: Inconsistent Headers

```markdown
## Admin
#### Subsection  ← Should be ###
```

**Fix**: Use proper header levels

```markdown
## Admin
### Subsection  ← Correct
```

---

## 🎯 Version-Specific Notes

### Multiple Versions

Each version has its own index.mdx:

```
/content/6_1/index.mdx      → Version 6.1 structure
/content/6_1_1/index.mdx    → Version 6.1.1 structure
/content/5_13/index.mdx     → Version 5.13 structure
/content/NG/index.mdx       → NextGen structure
```

### Reference Version

Generator uses version 6.1 as reference by default:

```javascript
const REFERENCE_VERSION = '6_1';
```

**Why?** All versions have the same navigation structure, only content differs.

### Version-Specific Content

```
Structure:  Same for all (from index.mdx)
Content:    Different per version (in MDX files)
```

Example:
```
Navigation: Admin > Discovery > Credentials
Content 6.1:     /content/6_1/admin/.../credentials_6_1.mdx
Content NextGen: /content/NG/admin/.../credentials_ng.mdx
```

---

## 🔄 Migration from Current System

### Current State

```
✅ /content/6_1/index.mdx (SOURCE OF TRUTH)
✅ /data/navigationData.ts (MANUALLY MAINTAINED)
```

### Target State

```
✅ /content/6_1/index.mdx (SINGLE SOURCE OF TRUTH)
✅ /data/navigationData.ts (AUTO-GENERATED)
```

### Migration Steps

1. **Install Scripts** (Already done ✅)
   ```bash
   # Scripts created:
   - /scripts/generate-nav.js
   - /scripts/parseIndexMDX.js
   ```

2. **Add to package.json**
   ```json
   {
     "scripts": {
       "generate-nav": "node scripts/generate-nav.js"
     }
   }
   ```

3. **Test Generation**
   ```bash
   npm run generate-nav
   ```

4. **Compare Output**
   ```bash
   # Compare generated vs current
   diff data/navigationData.ts data/navigationData.backup.ts
   ```

5. **Verify in UI**
   ```bash
   npm run dev
   # Test navigation thoroughly
   ```

6. **Update Documentation**
   ```markdown
   ⚠️  DO NOT EDIT navigationData.ts
   Edit /content/6_1/index.mdx instead
   ```

7. **Add Git Hooks** (Optional)
   ```bash
   # .husky/pre-commit
   npm run generate-nav
   git add data/navigationData.ts
   ```

---

## 📊 Impact Analysis

### What Changes

| File | Before | After |
|------|--------|-------|
| index.mdx | Source + Display | **SINGLE SOURCE** |
| navigationData.ts | Manual maintenance | **AUTO-GENERATED** |
| Workflow | Edit 2 files | **Edit 1 file** |
| Sync issues | Possible | **Eliminated** |

### What Stays the Same

- ✅ Navigation structure (same hierarchy)
- ✅ UI components (no changes needed)
- ✅ Routing logic (unchanged)
- ✅ MDX file paths (same)
- ✅ Version isolation (preserved)

### Risk Assessment

| Risk | Mitigation |
|------|------------|
| Parser bugs | Comprehensive testing, validation |
| Lost changes | Automatic backup before generation |
| Build breaks | Run in dev first, test thoroughly |
| Team confusion | Clear documentation, warnings |

---

## 🛠️ Troubleshooting

### Issue: Generation Fails

**Error**: `index.mdx not found`

**Fix**:
```bash
# Check path
ls -la content/6_1/index.mdx

# Update path in script if needed
const REFERENCE_VERSION = '6_1';
```

### Issue: Wrong Nesting

**Error**: Items not nested correctly

**Fix**: Check indentation (use 2 spaces per level)

```markdown
- Parent → ...
  - Child → ...    (2 spaces)
    - Grandchild → ...  (4 spaces)
```

### Issue: Missing Items

**Error**: Some items don't appear in navigation

**Fix**: Ensure proper markdown format

```markdown
- Title → /path/to/file.mdx  ← Must have arrow (→)
```

### Issue: Duplicate IDs

**Error**: Multiple items with same ID

**Fix**: Use unique titles (IDs auto-generated from titles)

```markdown
❌ - Details → ...  (appears twice)
✅ - Credential Details → ...
✅ - Profile Details → ...
```

---

## 📈 Future Enhancements

### Phase 1: Basic (Current)
- ✅ Parse index.mdx
- ✅ Generate navigationData.ts
- ✅ Auto-backup

### Phase 2: Validation
- [ ] Lint index.mdx for errors
- [ ] Validate file paths exist
- [ ] Check for broken links
- [ ] Verify unique IDs

### Phase 3: TypeScript Types
- [ ] Generate TypeScript interfaces
- [ ] Type-safe navigation
- [ ] Auto-complete in IDE

### Phase 4: Multi-Version
- [ ] Parse all 4 versions
- [ ] Detect version differences
- [ ] Version-specific validation

### Phase 5: CI/CD Integration
- [ ] Auto-generate on commit
- [ ] Prevent manual edits to generated files
- [ ] GitHub Actions workflow

---

## 📚 Additional Resources

### Related Documentation
- `/docs/TOC-HIERARCHY-UPDATE.md` - Structure changes
- `/docs/TOC-HYGIENE-AUDIT.md` - Quality audit
- `/docs/TOC-MAINTENANCE-GUIDE.md` - Maintenance procedures

### Script Files
- `/scripts/generate-nav.js` - Main generator
- `/scripts/parseIndexMDX.js` - Parser utility
- `/scripts/validate-toc-structure.ts` - Validator

### Example Files
- `/content/6_1/index.mdx` - Reference structure
- `/data/navigationData.ts` - Generated output

---

## ✅ Checklist for Adoption

- [ ] Scripts installed in `/scripts/`
- [ ] package.json updated with npm scripts
- [ ] Test generation: `npm run generate-nav`
- [ ] Compare output with current file
- [ ] Verify UI navigation works
- [ ] Update team documentation
- [ ] Add "DO NOT EDIT" warning to generated file
- [ ] Setup watch mode for development
- [ ] Configure Git hooks (optional)
- [ ] Train team on new workflow

---

## 🎉 Success Metrics

After implementation:

- ✅ **100% synchronization** between index.mdx and navigationData.ts
- ✅ **Zero manual edits** to navigationData.ts
- ✅ **50% reduction** in TOC maintenance time
- ✅ **Zero sync errors** between documentation and navigation
- ✅ **Clear audit trail** of all navigation changes
- ✅ **Scalable** to 1000+ files across multiple versions

---

**Last Updated**: November 29, 2025  
**Status**: Ready for Implementation  
**Recommended**: ✅ YES - Adopt this approach
