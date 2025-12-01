# Hierarchical TOC System - Quick Start Guide

## What Changed?

Instead of one massive `index.mdx` file per version, we now have **small, focused index files** in each folder.

### Before (Centralized)
```
/content/6_1/
└── index.mdx (1200 lines - lists EVERYTHING)
```

### After (Decentralized)
```
/content/6_1/
├── index.mdx (100 lines - lists modules only)
├── discovery_6_1/
│   ├── index.mdx (50 lines - lists Discovery sections)
│   ├── dashboard/
│   │   ├── index.mdx (20 lines - lists Dashboard pages)
│   │   └── ... actual .mdx files
│   └── run_a_scan/
│       ├── index.mdx (20 lines - lists Run a Scan pages)
│       └── ... actual .mdx files
```

## Adding a New Page - Step by Step

### Scenario: Add "Export Scan Results" page to Discovery > Dashboard

#### Step 1: Create the content file
```bash
# Create the .mdx file
/content/6_1/discovery_6_1/dashboard/export_scan_results_6_1.mdx
```

#### Step 2: Add it to the local index
Edit `/content/6_1/discovery_6_1/dashboard/index.mdx`:

```markdown
# Discovery Dashboard - Version 6.1

> Local index for Dashboard section

---

## Dashboard Pages

- Dashboard → `/content/6_1/discovery_6_1/dashboard/dashboard_discovery_scan_new_6_1.mdx`
  - Access Dashboard → `/content/6_1/discovery_6_1/dashboard/access_dashboard_6_1.mdx`
  - Dashboard Features → `/content/6_1/discovery_6_1/dashboard/dashboard_features_6_1.mdx`
  - Export Scan Results → `/content/6_1/discovery_6_1/dashboard/export_scan_results_6_1.mdx`  ← ADD THIS
  - Add Contents → `/content/6_1/discovery_6_1/dashboard/add_contents_6_1.mdx`
```

#### Step 3: Done!
That's it. You only edited one small file (20 lines).

## Adding a New Section - Step by Step

### Scenario: Add "Scan Templates" section to Discovery module

#### Step 1: Create the folder and files
```bash
mkdir -p /content/6_1/discovery_6_1/scan_templates
touch /content/6_1/discovery_6_1/scan_templates/index.mdx
touch /content/6_1/discovery_6_1/scan_templates/create_template_6_1.mdx
touch /content/6_1/discovery_6_1/scan_templates/manage_templates_6_1.mdx
```

#### Step 2: Create the section index
`/content/6_1/discovery_6_1/scan_templates/index.mdx`:

```markdown
# Scan Templates - Discovery - Version 6.1

> Local index for Scan Templates section

---

## Scan Templates Pages

- Create Template → `/content/6_1/discovery_6_1/scan_templates/create_template_6_1.mdx`
- Manage Templates → `/content/6_1/discovery_6_1/scan_templates/manage_templates_6_1.mdx`
```

#### Step 3: Add section to module index
Edit `/content/6_1/discovery_6_1/index.mdx`:

```markdown
# Discovery Scan - Version 6.1

> Local Table of Contents for Discovery Module

---

## Dashboard
- Dashboard → `/content/6_1/discovery_6_1/dashboard`

---

## Scan Templates
- Scan Templates → `/content/6_1/discovery_6_1/scan_templates`  ← ADD THIS

---

## Run a Scan
- Run a Scan → `/content/6_1/discovery_6_1/run_a_scan`
```

#### Step 4: Done!
You edited two small files (total ~40 lines).

## Path Syntax

### Link to a File (Page)
```markdown
- Page Name → `/content/6_1/module/section/page_name_6_1.mdx`
```

### Link to a Folder (with index.mdx)
```markdown
- Section Name → `/content/6_1/module/section`
```
System automatically looks for `index.mdx` in that folder.

### Nested Pages
Use 2-space indentation:

```markdown
- Parent Page → `/content/6_1/module/parent_6_1.mdx`
  - Child Page → `/content/6_1/module/child_6_1.mdx`
    - Grandchild → `/content/6_1/module/grandchild_6_1.mdx`
```

## Common Tasks

### Task: Reorder pages in a section

Edit the section's `index.mdx`. Just move the lines:

```markdown
## Pages

- Page A → `/path/to/a.mdx`
- Page C → `/path/to/c.mdx`  ← Moved up
- Page B → `/path/to/b.mdx`  ← Moved down
```

### Task: Move a page to different section

1. Add line in new section's index.mdx
2. Remove line from old section's index.mdx
3. (Optionally) Move the actual .mdx file

### Task: Create nested page hierarchy

Use indentation in the section's index.mdx:

```markdown
- Getting Started → `/path/to/getting_started.mdx`
  - Prerequisites → `/path/to/prerequisites.mdx`
  - Installation → `/path/to/installation.mdx`
    - Windows Install → `/path/to/windows.mdx`
    - Linux Install → `/path/to/linux.mdx`
  - Configuration → `/path/to/configuration.mdx`
```

### Task: Find which index to update

Follow the URL structure:
- URL: `/6.1/discovery-scan/dashboard/access-dashboard`
- Edit: `/content/6_1/discovery_6_1/dashboard/index.mdx`

Rule: Module → `/content/{version}/{module}/index.mdx`
Rule: Section → `/content/{version}/{module}/{section}/index.mdx`

## File Naming Conventions

### Folders
- Module: `modulename_version` (e.g., `discovery_6_1`, `admin_6_1`)
- Section: `sectionname` (e.g., `dashboard`, `run_a_scan`)

### Files
- Content: `descriptive_name_version.mdx` (e.g., `access_dashboard_6_1.mdx`)
- Index: Always `index.mdx`

## Template: Section Index

Copy and customize:

```markdown
# [Section Name] - [Module Name] - Version [X.X]

> Local index for [Section Name] section

---

## [Section Name] Pages

- Page 1 → `/content/[version]/[module]/[section]/page1_[version].mdx`
- Page 2 → `/content/[version]/[module]/[section]/page2_[version].mdx`
  - Subpage 2.1 → `/content/[version]/[module]/[section]/subpage21_[version].mdx`
- Page 3 → `/content/[version]/[module]/[section]/page3_[version].mdx`
```

## Template: Module Index

Copy and customize:

```markdown
# [Module Name] - Version [X.X]

> Local Table of Contents for [Module Name] Module
> Manages all [Module Name] subsections and their pages

---

## Overview
- About [Module Name] → `/content/[version]/[module]/about_[module]_[version].mdx`

---

## [Section 1]
- [Section 1] → `/content/[version]/[module]/[section1]`

---

## [Section 2]
- [Section 2] → `/content/[version]/[module]/[section2]`
```

## Checklist: Creating New Section

- [ ] Create folder: `/content/{version}/{module}/{section}/`
- [ ] Create section index: `/content/{version}/{module}/{section}/index.mdx`
- [ ] Add content files to folder
- [ ] List content files in section index
- [ ] Add section reference in module index: `/content/{version}/{module}/index.mdx`
- [ ] Test navigation in browser
- [ ] Verify breadcrumbs work correctly

## Checklist: Adding New Page

- [ ] Create .mdx file in appropriate folder
- [ ] Add entry to section's index.mdx
- [ ] Use correct path format (absolute path)
- [ ] Use proper indentation for nested pages
- [ ] Test page loads correctly
- [ ] Verify breadcrumbs show correct hierarchy

## Troubleshooting

### Page not showing in navigation
- ✅ Check: Does section have an index.mdx?
- ✅ Check: Is page listed in section's index.mdx?
- ✅ Check: Is path format correct (starts with `/content/`)?
- ✅ Check: Does the actual .mdx file exist?

### Navigation loads slowly
- This is normal for first load (fetches index files)
- Subsequent navigation is cached
- To clear cache: Refresh browser

### Indentation not working
- Use exactly 2 spaces per level (not tabs)
- Check indentation in index.mdx matches structure you want

### Path not resolving
- Use absolute paths: `/content/6_1/...`
- Don't use relative paths: `./page.mdx` or `../section/page.mdx`

## Examples

### Simple Section (No Nesting)
```markdown
# Recent Scans - Discovery - Version 6.1

---

## Recent Scans Pages

- Recent Scans Overview → `/content/6_1/discovery_6_1/recent_scans/overview_6_1.mdx`
- Access Recent Scans → `/content/6_1/discovery_6_1/recent_scans/access_6_1.mdx`
- View Scan Details → `/content/6_1/discovery_6_1/recent_scans/view_details_6_1.mdx`
```

### Complex Section (With Nesting)
```markdown
# Admin - Version 6.1

---

## Organizational Details

- About Organizational Details → `/content/6_1/admin_6_1/admin_org_details/about_6_1.mdx`
  - Cost Center → `/content/6_1/admin_6_1/admin_org_details/cost_center_6_1.mdx`
  - Departments → `/content/6_1/admin_6_1/admin_org_details/departments_6_1.mdx`
    - Members → `/content/6_1/admin_6_1/admin_org_details/departments_members_6_1.mdx`
  - Designations → `/content/6_1/admin_6_1/admin_org_details/designations_6_1.mdx`
  - Holidays → `/content/6_1/admin_6_1/admin_org_details/holidays_6_1.mdx`
  - Locations → `/content/6_1/admin_6_1/admin_org_details/locations_6_1.mdx`
```

## Benefits Recap

✅ **Easy to Update**: Only edit small, focused files
✅ **Easy to Find**: Follow URL structure to find the right index
✅ **Better Organization**: Related content defined together
✅ **Less Conflicts**: Multiple people can work without conflicts
✅ **Scalable**: Add thousands of pages without slowing down

## Getting Help

1. Read this guide
2. Look at examples in `/content/6_1/discovery_6_1/`
3. Check `/docs/HIERARCHICAL-TOC-SYSTEM.md` for detailed docs
4. Check browser console for loading errors

## Next Steps

1. **For content creators**: Use the templates above to create index files
2. **For developers**: Review `/docs/HIERARCHICAL-TOC-SYSTEM.md` for API usage
3. **For everyone**: Test the new system with Discovery examples

Happy documenting! 🚀
