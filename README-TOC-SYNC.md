# TOC Sync Script - Single Source of Truth

## Overview

This documentation describes the automatic synchronization system that keeps all navigation and content files in sync with the `index.mdx` files.

**🎯 SINGLE SOURCE OF TRUTH**: The `index.mdx` files for each version are the **only** files you need to edit. All other navigation and TOC files are automatically generated from these source files.

### Example Source Files

Each version has its own `index.mdx` file that serves as the master Table of Contents:

- **Version 6.1**: `src/content/6_1/index.mdx`
- **Version 6.1.1**: `src/content/6_1_1/index.mdx`
- **Version 5.13**: `src/content/5_13/index.mdx`
- **Version NextGen**: `src/content/NG/index.mdx`

**Example**: `C:\Users\GopichandY\github\FeatureDocsite\src\content\6_1\index.mdx`

When you edit any `index.mdx` file, the sync script automatically:
1. Parses the TOC structure from the markdown
2. Updates `src/data/navigationData.ts` with the navigation structure
3. Updates `src/utils/indexContentMap.ts` with the static TOC content
4. Ensures all dependent files stay in sync

## Quick Start

### Manual Sync

```bash
# Sync all versions (uses 6_1 as reference)
npm run sync-toc

# Sync specific version
npm run sync-toc -- 6_1
npm run sync-toc -- NG
npm run sync-toc -- 5_13
npm run sync-toc -- 6_1_1
```

### Auto-Watch Mode

```bash
# Watch for changes and auto-sync
npm run watch-toc
```

This will:
- Watch all `index.mdx` files for changes
- Automatically run sync when you save changes
- Debounce changes (waits 1 second after last change)
- **No manual sync needed** - just edit and save!

## How It Works - Single Source of Truth

The system is designed so that **`index.mdx` files are the ONLY files you edit**. Here's how the auto-update flow works:

```
┌─────────────────────────────────────────────────────────────┐
│  YOU EDIT: src/content/6_1/index.mdx                      │
│  (Add/remove/modify modules, sections, or pages)            │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│  RUN: npm run sync-toc (or auto-sync with watch-toc)       │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│  SCRIPT AUTOMATICALLY:                                      │
│  1. Reads index.mdx file                                     │
│  2. Parses markdown structure                                │
│  3. Generates navigationData.ts                              │
│  4. Generates indexContentMap.ts                            │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│  RESULT: Navigation updates throughout the app!            │
│  - New pages appear in sidebar                              │
│  - Links work correctly                                     │
│  - TOC structure is synchronized                            │
└─────────────────────────────────────────────────────────────┘
```

**Key Benefits:**
- ✅ **One file to edit** - Just modify `index.mdx`
- ✅ **Automatic updates** - All dependent files regenerate
- ✅ **No manual TypeScript editing** - Everything is generated
- ✅ **Consistent structure** - Single source prevents sync issues

## What Gets Auto-Updated

When you edit an `index.mdx` file (e.g., `src/content/6_1/index.mdx`) and run sync, the following files are **automatically generated and updated**:

### 1. `src/data/navigationData.ts` (AUTO-GENERATED)
- Navigation structure for the application
- Module definitions
- Section definitions
- Page hierarchies
- **⚠️ DO NOT EDIT MANUALLY** - This file is completely generated from `index.mdx`

### 2. `src/utils/indexContentMap.ts` (AUTO-GENERATED)
- Static TOC content for all versions
- Used as fallback when dynamic loading fails
- Browser-compatible content map
- Contains the raw markdown content from each `index.mdx` file
- **⚠️ DO NOT EDIT MANUALLY** - This file is completely generated from `index.mdx`

### How Auto-Update Works

1. **You edit** `src/content/6_1/index.mdx` (or any version's index.mdx)
2. **You run** `npm run sync-toc` (or use watch mode)
3. **Script reads** the `index.mdx` file and parses its structure
4. **Script generates** all dependent files automatically
5. **Navigation updates** throughout the application

**Key Point**: Any changes to modules, sections, or pages in `index.mdx` are automatically reflected in the generated files. You never need to manually edit the generated TypeScript files.

## File Structure

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

/scripts/
├── sync-toc-from-index.mjs    ← Main sync script
└── watch-toc.mjs              ← Watch mode script

/src/data/
└── navigationData.ts          ← AUTO-GENERATED (do not edit)

/src/utils/
└── indexContentMap.ts         ← AUTO-GENERATED (do not edit)
```

## index.mdx Format

The `index.mdx` file uses a simple markdown structure:

```markdown
# Virima Documentation - Version 6.1

> Master Table of Contents for Version 6.1

---

## Module Name

### Section Name

- Page Name → /content/6_1/path/to/file.mdx
- Another Page → /content/6_1/path/to/another.mdx
  - Sub Page → /content/6_1/path/to/subpage.mdx
  - Another Sub Page → /content/6_1/path/to/another-sub.mdx

### Another Section

- Page Name → /content/6_1/path/to/file.mdx

#### Subsection Name

- Subsection Page → /content/6_1/path/to/subsection.mdx

---

## Another Module

### Section Name

- Page Name → /content/6_1/path/to/file.mdx
```

### Format Rules

1. **Modules**: `## Module Name` (H2)
2. **Sections**: `### Section Name` (H3)
3. **Subsections**: `#### Subsection Name` (H4)
4. **Pages**: `- Page Name → /path/to/file.mdx`
   - Use 2-space indentation for nested pages
   - Arrow (`→`) separates title from path

## Workflow - Edit Only index.mdx Files

### Adding a New Page

1. **Edit** the appropriate `index.mdx` file (e.g., `src/content/6_1/index.mdx`)
2. **Add** the page entry: `- Page Name → /content/6_1/path/to/file.mdx`
3. **Run** `npm run sync-toc` (or it will auto-sync if watching)
4. **Result**: The navigation automatically updates! No need to touch any TypeScript files.

### Adding a New Section

1. **Edit** the appropriate `index.mdx` file
2. **Add** a new `### Section Name` header under the module
3. **Add** pages under it using the `- Page Name → /path` format
4. **Run** `npm run sync-toc`
5. **Result**: The section appears in navigation automatically

### Adding a New Module

1. **Edit** the appropriate `index.mdx` file
2. **Add** a new `## Module Name` header
3. **Add** sections and pages under it
4. **Run** `npm run sync-toc`
5. **Result**: The module appears in navigation automatically

**Note**: If you add a new module, you may need to update `MODULE_VAR_MAP` in `scripts/sync-toc-from-index.mjs` to map the module ID to a variable name. However, the script will still generate the navigation structure correctly.

## Integration with Build Process

The sync script runs automatically before builds:

```json
{
  "scripts": {
    "prebuild": "npm run sync-toc"
  }
}
```

This ensures that navigation data is always up-to-date in production builds.

## Troubleshooting

### Script fails to parse index.mdx

- Check that the file uses proper markdown syntax
- Ensure all list items use the arrow format: `- Name → /path`
- Verify indentation is consistent (2 spaces per level)

### Navigation not updating

- Make sure you ran `npm run sync-toc` after editing
- Check that the generated files were updated (check timestamps)
- Verify the module ID exists in `MODULE_VAR_MAP`

### Watch mode not working

- Ensure you're using Node.js 18+ (for ES modules)
- Check that file paths are correct
- Try running sync manually first

## Best Practices

1. **✅ ALWAYS edit `index.mdx` files only** - These are the single source of truth
   - Example: `src/content/6_1/index.mdx`
   - Never edit `navigationData.ts` or `indexContentMap.ts` directly
   
2. **✅ Run sync after making changes** (or use watch mode for auto-sync)
   - Manual: `npm run sync-toc`
   - Auto: `npm run watch-toc` (watches for changes and syncs automatically)
   
3. **✅ Test navigation after syncing** to ensure everything works
   - Check that new pages appear in the navigation
   - Verify links work correctly
   
4. **✅ Commit both `index.mdx` and generated files** to version control
   - Source files: `src/content/*/index.mdx`
   - Generated files: `src/data/navigationData.ts`, `src/utils/indexContentMap.ts`
   
5. **✅ Use consistent naming** for modules, sections, and pages
   - Module names become IDs automatically (converted to kebab-case)
   - Section names should be descriptive and unique within a module
   - Page names should clearly indicate their content

6. **✅ Follow the markdown format exactly** as shown in the examples
   - Use `##` for modules
   - Use `###` for sections
   - Use `- Name → /path` for pages
   - Use 2-space indentation for nested pages

## Version Control

Both source (`index.mdx`) and generated files should be committed:

```bash
git add src/content/*/index.mdx
git add src/data/navigationData.ts
git add src/utils/indexContentMap.ts
git commit -m "Update navigation structure"
```

This ensures:
- Team members always have the latest navigation
- Builds work correctly on CI/CD
- History of navigation changes is preserved

## Support

For issues or questions:
1. Check the generated files for syntax errors
2. Verify index.mdx format matches examples
3. Review console output from sync script
4. Check that all file paths in index.mdx are valid

