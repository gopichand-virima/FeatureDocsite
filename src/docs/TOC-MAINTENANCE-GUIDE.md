# TOC Structure Maintenance Guide

## Overview

This guide provides instructions for maintaining the Table of Contents (TOC) structure in the Virima documentation system.

---

## File Structure

### Primary TOC File
- **Location**: `/data/navigationData.ts`
- **Purpose**: Central navigation structure for all modules
- **Format**: TypeScript with exported constants

### Validation Script
- **Location**: `/scripts/validate-toc-structure.ts`
- **Purpose**: Automated structural validation
- **Usage**: Run to verify TOC integrity after changes

### Documentation
- **TOC Update Log**: `/docs/TOC-HIERARCHY-UPDATE.md`
- **Hygiene Audit**: `/docs/TOC-HYGIENE-AUDIT.md`
- **This Guide**: `/docs/TOC-MAINTENANCE-GUIDE.md`

---

## How to Add New Content

### Adding a New Page to Existing Section

```typescript
// In navigationData.ts
{
  id: "existing-section",
  label: "Existing Section",
  subPages: [
    // ... existing pages
    { id: "new-page", label: "New Page Name" }, // Add here
  ],
}
```

### Adding a New Subsection

```typescript
{
  id: "parent-section",
  label: "Parent Section",
  subPages: [
    // ... existing items
    {
      id: "new-subsection",
      label: "New Subsection",
      subPages: [
        { id: "child-page-1", label: "Child Page 1" },
        { id: "child-page-2", label: "Child Page 2" },
      ],
    },
  ],
}
```

### Adding a New Module

1. **Define the module** in the `modules` array:
```typescript
export const modules = [
  // ... existing modules
  { id: "new-module", label: "New Module Name" },
];
```

2. **Create the section structure**:
```typescript
export const newModuleSections = [
  {
    id: "new-module",
    title: "New Module Name",
    label: "New Module Name",
    pages: [
      { id: "overview", label: "Overview" },
      // ... more pages
    ],
  },
];
```

3. **Update the helper function**:
```typescript
export function getSectionsForModule(moduleId: string) {
  switch (moduleId) {
    // ... existing cases
    case "new-module":
      return newModuleSections;
    default:
      return defaultSections;
  }
}
```

---

## Naming Conventions

### IDs (kebab-case)
- ✅ Good: `"application-map"`, `"user-groups"`, `"ci-details-and-tabs"`
- ❌ Bad: `"ApplicationMap"`, `"user_groups"`, `"CI Details"`

### Labels (Title Case)
- ✅ Good: `"Application Map"`, `"User Groups"`, `"CI Details and Tabs"`
- ❌ Bad: `"application map"`, `"USER GROUPS"`, `"ci details and tabs"`

### Consistency Rules
1. IDs must be unique within their context
2. Labels should be human-readable
3. Use existing patterns for similar content
4. Avoid special characters in IDs (except hyphens)

---

## Structure Patterns

### Pattern 1: Simple List
```typescript
{
  id: "section",
  label: "Section Name",
  pages: [
    { id: "page-1", label: "Page 1" },
    { id: "page-2", label: "Page 2" },
    { id: "page-3", label: "Page 3" },
  ],
}
```

### Pattern 2: Nested Hierarchy
```typescript
{
  id: "parent",
  label: "Parent Section",
  pages: [
    {
      id: "child",
      label: "Child Section",
      subPages: [
        { id: "grandchild", label: "Grandchild Page" },
      ],
    },
  ],
}
```

### Pattern 3: Mixed Structure
```typescript
{
  id: "mixed",
  label: "Mixed Section",
  pages: [
    { id: "simple-page", label: "Simple Page" },
    {
      id: "complex-page",
      label: "Complex Page",
      subPages: [
        { id: "sub-1", label: "Sub 1" },
        { id: "sub-2", label: "Sub 2" },
      ],
    },
  ],
}
```

---

## Validation Checklist

Before committing changes to `navigationData.ts`, verify:

- [ ] All IDs use kebab-case
- [ ] All labels use Title Case
- [ ] No duplicate IDs within same module
- [ ] Proper nesting (pages → subPages → subPages)
- [ ] Maximum 4-5 levels of nesting
- [ ] TypeScript syntax is valid
- [ ] All sections have id, title, and label
- [ ] Helper function includes new modules
- [ ] No typos in labels
- [ ] Sibling relationships are correct (not accidentally nested)

---

## Common Mistakes to Avoid

### ❌ Mistake 1: Incorrect Nesting
```typescript
// WRONG - Creating unintended parent-child relationship
{
  id: "view-ci",
  label: "View CI",
  subPages: [
    {
      id: "ci-details", // Should be sibling, not child!
      label: "CI Details",
    },
  ],
}
```

✅ **Correct**:
```typescript
// Siblings at same level
{ id: "view-ci", label: "View CI" },
{ id: "ci-details", label: "CI Details" },
```

### ❌ Mistake 2: Inconsistent Naming
```typescript
// WRONG - Mixed conventions
{ id: "user_groups", label: "user groups" }
```

✅ **Correct**:
```typescript
{ id: "user-groups", label: "User Groups" }
```

### ❌ Mistake 3: Duplicate IDs
```typescript
// WRONG - Same ID in same context
pages: [
  { id: "details", label: "Details" },
  { id: "details", label: "More Details" }, // Duplicate!
]
```

✅ **Correct**:
```typescript
pages: [
  { id: "details", label: "Details" },
  { id: "advanced-details", label: "More Details" },
]
```

---

## Testing Changes

### 1. Visual Testing
1. Start development server
2. Navigate to affected module
3. Verify hierarchy displays correctly
4. Check all items are clickable
5. Confirm expand/collapse works

### 2. Automated Testing
```bash
# Run validation script (when implemented)
npm run validate-toc
```

### 3. Cross-Version Testing
Test changes across all versions:
- Version 5.13
- Version 6.1
- Version 6.1.1
- Version NextGen

---

## Troubleshooting

### Issue: Navigation not showing
**Check**: Is the module ID in the `modules` array?  
**Fix**: Add module definition

### Issue: Items not expanding
**Check**: Is `subPages` property present and not empty?  
**Fix**: Ensure subPages array exists with content

### Issue: Wrong hierarchy displayed
**Check**: Nesting level correct? Using `subPages` vs `pages`?  
**Fix**: Review structure, ensure proper nesting

### Issue: Duplicate content appearing
**Check**: Are there duplicate IDs?  
**Fix**: Make IDs unique within context

### Issue: Items out of order
**Check**: Array order in navigationData.ts  
**Fix**: Reorder items in the array

---

## Version-Specific Content

### How It Works
- **Structure**: Same across all versions (defined in navigationData.ts)
- **Content**: Different for each version (in version-specific MDX files)
- **Routing**: Version parameter determines which MDX to load

### Example
```
Structure: Admin > Discovery > Credentials > Details (same for all)
Content:
  - 5.13: /content/5_13/admin/.../details_5_13.mdx
  - 6.1:  /content/6_1/admin/.../details_6_1.mdx
  - 6.1.1: /content/6_1_1/admin/.../details_6_1_1.mdx
  - NextGen: /content/NextGen/admin/.../details_nextgen.mdx
```

### Adding Version-Specific Topics
To add a topic only in version 6.1.1:
1. Add entry to navigationData.ts (shows in ALL versions)
2. Create MDX only in /content/6_1_1/
3. Other versions show "Content not available" message

---

## Module-Specific Notes

### Admin Module
- Has 7 main sections (fixed structure)
- Discovery section is particularly deep (4 levels)
- Integrations use specific mapping names (not generic)

### CMDB Module
- "View and Edit a CI" and "CI Details and Tabs" are SIBLINGS
- Do not nest one under the other!

### ITSM & ITAM Modules
- Both use Configuration Management wrapper
- CMDB structure nested inside Configuration Management
- Mirror pattern across both modules

### Discovery Scan Module
- Most complex structure (5 levels deep)
- Many sibling sections at same level
- Be careful with nesting additions

---

## Best Practices

### 1. Plan Before Coding
- Sketch hierarchy on paper first
- Identify sibling vs parent-child relationships
- Consider user navigation patterns

### 2. Follow Existing Patterns
- Look at similar modules for guidance
- Match naming conventions
- Maintain consistent depth

### 3. Keep It Shallow
- Avoid more than 4-5 levels of nesting
- Group related items logically
- Consider user cognitive load

### 4. Document Changes
- Update TOC-HIERARCHY-UPDATE.md
- Note rationale for structural changes
- Include screenshots if helpful

### 5. Test Thoroughly
- Check all affected modules
- Test on different screen sizes
- Verify responsive behavior
- Test expand/collapse animations

---

## Emergency Rollback

If changes cause issues:

```bash
# Restore previous version from git
git checkout HEAD~1 /data/navigationData.ts

# Or restore specific commit
git checkout <commit-hash> /data/navigationData.ts
```

Then restart development server to apply changes.

---

## Contact & Support

For questions about TOC structure:
1. Check this maintenance guide
2. Review TOC-HIERARCHY-UPDATE.md
3. Examine navigationData.ts comments
4. Review hygiene audit report

---

## Changelog

| Date | Change | Author |
|------|--------|--------|
| 2025-11-29 | Initial TOC restructuring | AI Assistant |
| 2025-11-29 | Created maintenance guide | AI Assistant |

---

## Quick Reference Card

```
Adding a page:      Add to pages array
Adding subsection:  Use subPages property
Adding module:      Update modules + getSectionsForModule()
ID format:          kebab-case
Label format:       Title Case
Max depth:          4-5 levels
Sibling check:      Same array = siblings
Parent-child:       subPages = children
```

---

**Last Updated**: November 29, 2025
