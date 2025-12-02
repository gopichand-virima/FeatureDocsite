# MDX Rendering System - Implementation Guide

## Overview

The Virima documentation platform now uses a robust MDX rendering system that properly formats and displays all markdown content across all versions (5.13, 6.1, 6.1.1, and NextGen).

## Architecture

### Components

1. **MDXRenderer** (`/components/MDXRenderer.tsx`)
   - Core rendering engine for MDX/Markdown content
   - Uses `react-markdown` with `remark-gfm` and `rehype-raw` plugins
   - Provides comprehensive styling for all markdown elements
   - Supports syntax highlighting via Prism.js

2. **MDXContent** (`/components/MDXContent.tsx`)
   - Wrapper component that loads content and manages breadcrumbs
   - Integrates with the content loader system
   - Handles loading states and error conditions

3. **Content Loader** (`/content/contentLoader.ts`)
   - Dynamically loads MDX files from the content registry
   - Caches content for performance
   - Supports all versions and modules

### Supported Features

#### Markdown Features
- ✅ **Headings** (H1-H6) with auto-generated anchor IDs
- ✅ **Paragraphs** with proper spacing and typography
- ✅ **Lists** (ordered and unordered) with nested support
- ✅ **Links** (internal and external) with proper styling
- ✅ **Images** with lazy loading and responsive sizing
- ✅ **Code blocks** with syntax highlighting (100+ languages)
- ✅ **Inline code** with distinctive styling
- ✅ **Tables** with responsive design and hover effects
- ✅ **Blockquotes** with custom styling
- ✅ **Emphasis** (bold, italic, strikethrough)
- ✅ **Horizontal rules**
- ✅ **Task lists** (checkboxes)

#### GitHub Flavored Markdown (GFM)
- ✅ Tables
- ✅ Task lists
- ✅ Strikethrough
- ✅ Autolinks
- ✅ Footnotes

#### Additional Features
- ✅ **HTML Support** via `rehype-raw`
- ✅ **Scroll Margin** for headings (smooth anchor navigation)
- ✅ **Auto-linking** headings for table of contents
- ✅ **External link detection** (opens in new tab)
- ✅ **Responsive images** with proper alt text

## Usage

### Basic Usage

```tsx
import { MDXRenderer } from './components/MDXRenderer';

function MyComponent() {
  const content = `
# My Documentation

This is a paragraph with **bold** and *italic* text.

## Features

- Feature 1
- Feature 2
- Feature 3
  `;

  return <MDXRenderer content={content} />;
}
```

### With Content Loader

```tsx
import { MDXContent } from './components/MDXContent';

function DocumentationPage() {
  return (
    <MDXContent
      filePath="/content/6_1/admin_6_1/about_admin_6_1.mdx"
      version="6_1"
      module="admin"
      section="overview"
      page="about"
    />
  );
}
```

## File Structure

```
/content
  /6_1                      # Version 6.1 content
    /admin_6_1             # Admin module
      about_admin_6_1.mdx  # MDX files
      /admin
        admin_functions_v6_6_1.mdx
    /cmdb_6_1              # CMDB module
    /discovery_6_1         # Discovery module
    /itam_6_1              # ITAM module
    /itsm_6_1              # ITSM module
  /6_1_1                   # Version 6.1.1 content
  /NG                      # NextGen content
  /5_13                    # Version 5.13 content
```

## Styling System

The MDX renderer uses Tailwind CSS for all styling:

### Typography Scale
- **H1**: Large, bold, with bottom border
- **H2**: Section headers with top margin
- **H3**: Subsection headers
- **H4-H6**: Progressive smaller headers
- **Paragraphs**: Comfortable line height and spacing
- **Lists**: Proper indentation and spacing

### Color Palette
- **Text**: Slate-700 (body), Slate-900 (headers)
- **Links**: Emerald-600 (default), Emerald-700 (hover)
- **Code**: Rose-600 on Slate-100 background
- **Borders**: Slate-200
- **Accents**: Emerald-500

### Responsive Design
- Tables scroll horizontally on mobile
- Images are constrained to container width
- Proper spacing adjusts for different screen sizes

## Testing MDX Rendering

### Test Files for Version 6.1

The following files are recommended for testing the rendering system:

1. **`/content/6_1/admin_6_1/about_admin_6_1.mdx`**
   - Tests: Headings, lists, links
   
2. **`/content/6_1/admin_6_1/admin/admin_functions_v6_6_1.mdx`**
   - Tests: Images, links, formatting
   
3. **`/content/6_1/cmdb_6_1/cmdb_overview_6_1.mdx`**
   - Tests: Complex content structure
   
4. **`/content/6_1/discovery_6_1/about_discovery_scan_6_1.mdx`**
   - Tests: Comprehensive features

### Manual Testing Checklist

- [ ] All headings render correctly (H1-H6)
- [ ] Lists display with proper indentation
- [ ] Links are clickable and styled
- [ ] Images load and display responsively
- [ ] Code blocks have syntax highlighting
- [ ] Inline code is distinctly styled
- [ ] Tables are responsive and formatted
- [ ] Blockquotes have custom styling
- [ ] Bold and italic text render correctly
- [ ] Horizontal rules display properly
- [ ] Task lists show checkboxes
- [ ] External links open in new tab
- [ ] Anchor links work from TOC

## Performance Optimization

### Content Caching
The content loader caches MDX content to avoid re-fetching:

```typescript
const contentCache = new Map<string, string>();
```

### Memoization
The MDXRenderer uses `useMemo` to prevent unnecessary re-renders:

```typescript
const renderedContent = useMemo(() => {
  return <ReactMarkdown ...>{content}</ReactMarkdown>;
}, [content]);
```

### Lazy Loading
Images use native lazy loading:

```html
<img loading="lazy" ... />
```

## Troubleshooting

### Issue: Content Not Rendering

**Symptoms**: Blank page or "Content not available" message

**Solutions**:
1. Verify the MDX file exists at the specified path
2. Check that the file is registered in the content registry
3. Confirm the file path in the TOC matches the actual file location
4. Check browser console for errors

### Issue: Styling Not Applied

**Symptoms**: Content renders but looks unstyled

**Solutions**:
1. Verify Tailwind CSS is loaded
2. Check that `prose` classes are applied
3. Confirm custom component styles are defined
4. Clear browser cache

### Issue: Syntax Highlighting Not Working

**Symptoms**: Code blocks render but without colors

**Solutions**:
1. Verify language identifier is correct (e.g., ```javascript)
2. Check that Prism.js and style are imported
3. Confirm SyntaxHighlighter component is configured

### Issue: Images Not Displaying

**Symptoms**: Broken image icons or missing images

**Solutions**:
1. Verify image path is correct (relative or absolute)
2. Check that images are in the public directory or imported
3. Confirm image formats are supported (PNG, JPG, GIF, SVG)
4. Check network tab for 404 errors

## Best Practices

### Writing MDX Content

1. **Use Semantic Headings**
   ```markdown
   # Page Title (H1 - only one per page)
   ## Main Section (H2)
   ### Subsection (H3)
   ```

2. **Add Alt Text to Images**
   ```markdown
   ![Descriptive alt text](path/to/image.png)
   ```

3. **Use Fenced Code Blocks**
   ````markdown
   ```javascript
   const example = "code";
   ```
   ````

4. **Link Internally with Relative Paths**
   ```markdown
   [See Admin Functions](/admin/functions)
   ```

5. **Create Accessible Tables**
   ```markdown
   | Header 1 | Header 2 |
   |----------|----------|
   | Data 1   | Data 2   |
   ```

### File Organization

1. Keep MDX files in version-specific directories
2. Use descriptive filenames that match TOC entries
3. Organize by module and section hierarchy
4. Maintain consistent naming conventions

### Performance

1. Optimize images before adding to content
2. Use appropriate image formats (WebP when possible)
3. Keep MDX files focused and reasonably sized
4. Minimize external dependencies in content

## Future Enhancements

### Potential Improvements

1. **Component Support**
   - Add custom React components in MDX
   - Create reusable documentation widgets
   - Build interactive examples

2. **Search Integration**
   - Index MDX content for full-text search
   - Highlight search terms in rendered content
   - Generate content snippets for search results

3. **Analytics**
   - Track which pages are most viewed
   - Monitor reading time and engagement
   - Identify outdated content

4. **Versioning**
   - Show version differences
   - Highlight new/changed content
   - Provide version comparison views

5. **Export Capabilities**
   - Export to PDF
   - Generate offline documentation
   - Create printable formats

## References

### Documentation
- [React Markdown](https://github.com/remarkjs/react-markdown)
- [Remark GFM](https://github.com/remarkjs/remark-gfm)
- [Rehype Raw](https://github.com/rehypejs/rehype-raw)
- [Prism.js](https://prismjs.com/)

### Tailwind CSS
- [Typography Plugin](https://tailwindcss.com/docs/typography-plugin)
- [Prose Classes](https://tailwindcss.com/docs/typography-plugin#prose)

## Support

For issues or questions about the MDX rendering system:

1. Check this guide first
2. Review the troubleshooting section
3. Check the browser console for errors
4. Verify file paths and content registry
5. Test with known working examples

## Changelog

### Version 1.0.0 (Current)
- Initial MDX rendering system implementation
- Support for all Markdown and GFM features
- Syntax highlighting for 100+ languages
- Responsive design and accessibility
- Performance optimizations
- Comprehensive documentation
