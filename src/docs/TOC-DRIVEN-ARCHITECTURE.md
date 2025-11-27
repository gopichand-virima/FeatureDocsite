# TOC-Driven Documentation Architecture

## Overview

The Virima Documentation system now uses a **single-source-of-truth** approach where all navigation, routing, and structure is controlled by `index.mdx` files. This means you can manage the entire documentation site by editing just one file per version.

## Core Concept

**Single Point of Control**: Each version has an `index.mdx` file that defines:
- All modules available in that version
- All sections within each module
- All pages and their hierarchy
- The exact file paths for each page
- The navigation structure
- Breadcrumb trails
- Previous/Next page relationships

## File Structure

```
/content/
  ├── 5_13/
  │   ├── index.mdx          ← Master TOC for version 5.13
  │   ├── cmdb/
  │   │   └── overview.mdx
  │   └── ...
  ├── 6_1/
  │   ├── index.mdx          ← Master TOC for version 6.1
  │   └── ...
  ├── 6_1_1/
  │   ├── index.mdx          ← Master TOC for version 6.1.1
  │   └── ...
  └── NG/
      ├── index.mdx          ← Master TOC for NextGen
      └── ...
```

## index.mdx Format

The `index.mdx` file uses a simple, readable format:

```markdown
# Virima Documentation - Version X.X

> This is the master Table of Contents file for version X.X.
> Editing this file automatically updates all navigation, routing, and structure.

## Module Name

### Section Name
- Page Name → /content/path/to/file.mdx
- Another Page → /content/path/to/another.mdx
  - Sub Page → /content/path/to/subpage.mdx
  - Another Sub Page → /content/path/to/another-sub.mdx

### Another Section
- Page Name → /content/path/to/file.mdx

---

## Another Module

### Section Name
- Page Name → /content/path/to/file.mdx
```

### Format Rules

1. **Modules**: Defined with `## Module Name`
2. **Sections**: Defined with `### Section Name`
3. **Pages**: Defined with `- Page Name → /path/to/file.mdx`
4. **Nested Pages**: Use indentation (2 spaces) to create sub-pages
5. **Separators**: Use `---` to visually separate modules (optional)

## How It Works

### 1. Parsing Phase

When the application loads, the TOC parser (`/utils/tocParser.ts`) reads the `index.mdx` file and:

- Identifies all modules, sections, and pages
- Builds a hierarchical navigation structure
- Validates the structure
- Generates IDs for routing

### 2. Navigation Generation

The system automatically creates:

- **Sidebar Navigation**: All sections and pages in the correct order
- **Breadcrumbs**: Based on the hierarchy (Home > Module > Section > Page)
- **Previous/Next Links**: Sequential navigation through all pages
- **Module List**: For the homepage

### 3. Routing

URLs are automatically generated from the TOC structure:
- Format: `/{version}/{module}/{section}/{page}`
- Example: `/5.13/cmdb/getting-started/quick-start`

### 4. File Resolution

When a page is requested, the system:
1. Looks up the page in the TOC structure
2. Gets the file path from the TOC
3. Loads the MDX content from that path
4. Renders the page

## Adding New Content

### Add a New Page

1. Open the relevant `index.mdx` file
2. Find the section where you want to add the page
3. Add a new line: `- Page Name → /content/path/to/file.mdx`
4. Save the file

**That's it!** The page will automatically appear in:
- The sidebar navigation
- The breadcrumb trail
- Previous/Next navigation
- Search index

### Add a New Section

1. Open the relevant `index.mdx` file
2. Find the module where you want to add the section
3. Add a new section heading: `### Section Name`
4. Add pages under it
5. Save the file

### Add a New Module

1. Open the relevant `index.mdx` file
2. Add a new module heading: `## Module Name`
3. Add sections and pages under it
4. Save the file

### Reorganize Content

Simply rearrange the lines in the `index.mdx` file. The navigation, breadcrumbs, and prev/next links will automatically update.

## Benefits

### ✅ Single Source of Truth
Edit one file to control the entire documentation structure.

### ✅ Zero Configuration
No need to manually update navigation components, routing tables, or configuration files.

### ✅ Automatic Consistency
Navigation, breadcrumbs, and prev/next links are always in sync.

### ✅ Easy Reorganization
Moving pages around is as simple as cut-and-paste in the TOC file.

### ✅ Version Independence
Each version has its own TOC, so you can have different structures for different versions.

### ✅ Human-Readable
The TOC format is easy to read and edit, even for non-technical users.

### ✅ Validation
The system validates that all referenced files exist and reports any issues.

## Technical Components

### `/utils/tocParser.ts`
Parses the `index.mdx` file and generates the navigation structure.

Key functions:
- `parseTocFile()`: Parses the raw MDX content
- `generateBreadcrumbs()`: Creates breadcrumb trails
- `findAdjacentPages()`: Finds prev/next pages
- `resolveFilePath()`: Gets the MDX file path for a page

### `/utils/tocLoader.ts`
Loads and caches TOC structures.

Key functions:
- `loadTocForVersion()`: Loads the TOC for a specific version
- `getModulesForVersion()`: Gets all modules
- `getNavigationForModule()`: Gets the complete navigation structure
- `getDefaultPageForModule()`: Gets the first page of a module

### `/utils/useToc.ts`
React hooks for easy TOC access in components.

Key hooks:
- `useToc()`: Loads the complete TOC structure
- `useModules()`: Gets all modules for a version
- `useModuleNavigation()`: Gets navigation for a specific module
- `useBreadcrumbs()`: Gets breadcrumb trail for current page
- `useAdjacentPages()`: Gets prev/next page information

## Migration Guide

### Current System → TOC-Driven System

The current system has navigation hardcoded in `DocumentationLayout.tsx`. To fully migrate:

1. **Phase 1**: Create `index.mdx` files for each version (✅ Done for 5.13 and NG)
2. **Phase 2**: Create remaining `index.mdx` files for 6.1 and 6.1.1
3. **Phase 3**: Update `DocumentationLayout.tsx` to use TOC hooks
4. **Phase 4**: Remove hardcoded navigation arrays
5. **Phase 5**: Update breadcrumb and prev/next components to use TOC

## Example Usage

### In a Component

```tsx
import { useModuleNavigation, useBreadcrumbs } from '../utils/useToc';

function MyComponent({ version, moduleId, sectionId, pageId }) {
  // Get navigation structure
  const { navigation, loading } = useModuleNavigation(version, moduleId);
  
  // Get breadcrumbs
  const breadcrumbs = useBreadcrumbs(version, moduleId, sectionId, pageId);
  
  if (loading) return <div>Loading...</div>;
  
  return (
    <div>
      {/* Render breadcrumbs */}
      {breadcrumbs.map(crumb => (
        <span key={crumb.id}>{crumb.label}</span>
      ))}
      
      {/* Render navigation */}
      {navigation?.sections.map(section => (
        <div key={section.id}>
          <h3>{section.title}</h3>
          {section.pages.map(page => (
            <a key={page.id} href={`#${page.id}`}>
              {page.label}
            </a>
          ))}
        </div>
      ))}
    </div>
  );
}
```

## Future Enhancements

### Planned Features

1. **Auto-generate Missing Files**: Automatically create placeholder MDX files for pages that don't exist yet
2. **TOC Validation CLI**: Command-line tool to validate TOC files before deployment
3. **Visual TOC Editor**: GUI for editing the TOC structure without editing MDX
4. **Cross-references**: Automatic detection and linking of related pages
5. **Search Integration**: Use TOC structure to improve search results
6. **Analytics Integration**: Track which sections/pages are most viewed

## Best Practices

### ✅ DO

- Keep the TOC file clean and well-organized
- Use descriptive page names
- Maintain consistent indentation (2 spaces for nesting)
- Group related pages together
- Use section separators (`---`) for clarity

### ❌ DON'T

- Don't create deeply nested hierarchies (max 2-3 levels)
- Don't use special characters in page names
- Don't reference files that don't exist
- Don't duplicate page IDs within the same module

## Troubleshooting

### Page Not Showing in Navigation

1. Check that the page is listed in the `index.mdx` file
2. Verify the file path is correct
3. Ensure proper indentation and format
4. Clear the TOC cache (refresh the page)

### Breadcrumbs Not Working

1. Verify the module, section, and page IDs are correct
2. Check that the hierarchy in `index.mdx` is correct
3. Ensure the TOC has been loaded successfully

### File Not Found

1. Check the file path in the `index.mdx` matches the actual file location
2. Verify the file extension is `.mdx`
3. Ensure the file exists in the correct directory

## Support

For questions or issues with the TOC-driven architecture:

1. Check this documentation first
2. Review the example `index.mdx` files
3. Examine the `/utils/tocParser.ts` code for detailed parsing logic
4. Contact the development team

## Version History

- **v1.0** (Nov 26, 2024): Initial TOC-driven architecture implementation
  - Created `index.mdx` format
  - Implemented TOC parser and loader
  - Created React hooks for TOC access
  - Generated TOC files for versions 5.13 and NextGen
