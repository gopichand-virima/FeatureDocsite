# MDX Rendering - Quick Reference

## 🚀 Quick Start

### Install Packages
```bash
npm install react-markdown remark-gfm rehype-raw react-syntax-highlighter
npm install --save-dev @types/react-markdown @types/react-syntax-highlighter
```

### Use MDXRenderer
```tsx
import { MDXRenderer } from './components/MDXRenderer';

<MDXRenderer content={markdownString} />
```

### Use MDXContent (with file loading)
```tsx
import { MDXContent } from './components/MDXContent';

<MDXContent
  filePath="/content/6_1/admin_6_1/about_admin_6_1.mdx"
  version="6_1"
  module="admin"
/>
```

## 📝 Markdown Syntax Cheat Sheet

### Headings
```markdown
# H1 - Page Title
## H2 - Main Section
### H3 - Subsection
#### H4 - Minor Heading
##### H5 - Smallest Heading
###### H6 - Micro Heading
```

### Text Formatting
```markdown
**Bold text**
*Italic text*
***Bold and italic***
~~Strikethrough~~
`Inline code`
```

### Links
```markdown
[Link text](https://example.com)
[Internal link](/admin/overview)
```

### Images
```markdown
![Alt text](path/to/image.png)
![Alt text](https://example.com/image.jpg)
```

### Lists

#### Unordered
```markdown
- Item 1
- Item 2
  - Nested item
  - Another nested item
- Item 3
```

#### Ordered
```markdown
1. First item
2. Second item
3. Third item
```

#### Task Lists
```markdown
- [x] Completed task
- [ ] Pending task
- [ ] Another task
```

### Code Blocks

#### Inline
```markdown
Use `const x = 10;` for constants.
```

#### Block (with syntax highlighting)
````markdown
```javascript
function greet(name) {
  console.log(`Hello, ${name}!`);
}
```
````

Supported languages: `javascript`, `typescript`, `python`, `java`, `sql`, `bash`, `json`, `xml`, `yaml`, `css`, `html`, and 100+ more.

### Tables
```markdown
| Column 1 | Column 2 | Column 3 |
|----------|----------|----------|
| Data 1   | Data 2   | Data 3   |
| Data 4   | Data 5   | Data 6   |
```

Alignment:
```markdown
| Left | Center | Right |
|:-----|:------:|------:|
| L    |   C    |     R |
```

### Blockquotes
```markdown
> This is a blockquote.
> It can span multiple lines.
>
> And contain multiple paragraphs.
```

### Horizontal Rule
```markdown
---
```

## 🎨 Component Props

### MDXRenderer

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `content` | `string` | Yes | - | Markdown content to render |
| `className` | `string` | No | `''` | Additional CSS classes |

### MDXContent

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `filePath` | `string` | Yes | - | Path to MDX file |
| `version` | `string` | No | - | Version identifier |
| `module` | `string` | No | - | Module identifier |
| `section` | `string` | No | - | Section identifier |
| `page` | `string` | No | - | Page identifier |
| `onHomeClick` | `() => void` | No | - | Home navigation handler |
| `onVersionClick` | `() => void` | No | - | Version navigation handler |
| `onModuleClick` | `() => void` | No | - | Module navigation handler |

## 🧪 Testing

### Test a Single File
```tsx
import { MDXContent } from './components/MDXContent';

<MDXContent filePath="/content/6_1/admin_6_1/about_admin_6_1.mdx" />
```

### Use Test Component
```tsx
import { MDXRenderingTest } from './components/MDXRenderingTest';

<MDXRenderingTest />
```

Access via: `http://localhost:5173/?test-mdx`

### Test Utilities
```typescript
import { analyzeMDXContent, generateTestMarkdown } from './utils/mdxTestUtils';

// Analyze content
const features = analyzeMDXContent(markdownString);
console.log(features); // { hasHeadings: true, hasLists: true, ... }

// Generate test content
const testContent = generateTestMarkdown();
```

## 🎯 Common Patterns

### Full Page Documentation
```tsx
function DocumentationPage() {
  return (
    <MDXContent
      filePath="/content/6_1/admin_6_1/about_admin_6_1.mdx"
      version="6_1"
      module="admin"
      section="overview"
      page="about"
      onHomeClick={() => navigate('/')}
      onModuleClick={() => navigate('/admin')}
    />
  );
}
```

### Inline Content
```tsx
function InlineDoc() {
  const content = `
# Quick Guide

Follow these steps:
1. Install packages
2. Import components
3. Render content
  `;

  return <MDXRenderer content={content} />;
}
```

### Dynamic Content
```tsx
function DynamicDoc({ version }) {
  const [content, setContent] = useState('');

  useEffect(() => {
    getContent(`/content/${version}/overview.mdx`)
      .then(setContent);
  }, [version]);

  return <MDXRenderer content={content} />;
}
```

## 🐛 Troubleshooting

### Content Not Rendering
```typescript
// Check if content is loaded
console.log('Content:', content);
console.log('Content length:', content?.length);

// Verify file exists
const exists = await getContent(filePath);
console.log('File exists:', !!exists);
```

### Styling Issues
```tsx
// Add custom className
<MDXRenderer 
  content={content} 
  className="custom-prose" 
/>
```

```css
/* Override default styles */
.custom-prose h1 {
  color: #custom-color;
}
```

### Code Highlighting Not Working
````markdown
<!-- Ensure language is specified -->
```javascript  // ✅ Correct
const x = 10;
```

```  // ❌ Wrong - no language
const x = 10;
```
````

## 📦 File Locations

### Components
- `/components/MDXRenderer.tsx` - Core renderer
- `/components/MDXContent.tsx` - Content wrapper
- `/components/MDXRenderingTest.tsx` - Test interface

### Utilities
- `/utils/mdxTestUtils.ts` - Testing utilities
- `/content/contentLoader.ts` - Content loading

### Documentation
- `/docs/MDX-RENDERING-GUIDE.md` - Complete guide
- `/docs/MDX-PACKAGE-REQUIREMENTS.md` - Package info
- `/docs/MDX-IMPLEMENTATION-SUMMARY.md` - Implementation details
- `/docs/MDX-QUICK-REFERENCE.md` - This file

### Content
- `/content/6_1/` - Version 6.1 content (818 files)
- `/content/6_1_1/` - Version 6.1.1 content
- `/content/NG/` - NextGen content
- `/content/5_13/` - Version 5.13 content

## 🎨 Styling Classes

### Headings
```css
h1: scroll-mt-24 text-slate-900 mb-6 pb-3 border-b
h2: scroll-mt-24 text-slate-900 mt-12 mb-6
h3: scroll-mt-24 text-slate-900 mt-8 mb-4
```

### Text
```css
p: text-slate-700 leading-relaxed mb-4
strong: font-semibold text-slate-900
em: italic text-slate-700
```

### Links
```css
a: text-emerald-600 hover:text-emerald-700 underline
```

### Code
```css
code: bg-slate-100 text-rose-600 px-1.5 py-0.5 rounded
```

### Lists
```css
ul: mb-6 space-y-2 list-disc pl-6
ol: mb-6 space-y-2 list-decimal pl-6
li: text-slate-700 leading-relaxed
```

### Tables
```css
table: min-w-full divide-y divide-slate-200
thead: bg-slate-50
th: px-6 py-3 text-left text-xs font-semibold
td: px-6 py-4 text-sm text-slate-700
```

## 🔗 Useful Links

### Internal Docs
- [Complete Guide](./MDX-RENDERING-GUIDE.md)
- [Package Requirements](./MDX-PACKAGE-REQUIREMENTS.md)
- [Implementation Summary](./MDX-IMPLEMENTATION-SUMMARY.md)

### External Resources
- [react-markdown](https://github.com/remarkjs/react-markdown)
- [remark-gfm](https://github.com/remarkjs/remark-gfm)
- [Markdown Guide](https://www.markdownguide.org/)
- [GFM Spec](https://github.github.com/gfm/)

## 💡 Tips & Best Practices

### Do's ✅
- Use semantic headings (H1 → H2 → H3)
- Add alt text to all images
- Use fenced code blocks with language
- Keep files under 1000 lines
- Test on multiple browsers

### Don'ts ❌
- Don't skip heading levels (H1 → H3)
- Don't use images without alt text
- Don't embed large images (optimize first)
- Don't use inline styles (use classes)
- Don't mix HTML and Markdown excessively

### Performance
- Cache content when possible
- Use lazy loading for images
- Minimize re-renders with memoization
- Split large documents into sections

### Accessibility
- Maintain proper heading hierarchy
- Provide meaningful alt text
- Ensure sufficient color contrast
- Test with screen readers
- Support keyboard navigation

## 📋 Checklist

### Before Committing MDX Content
- [ ] All headings follow hierarchy (H1 → H2 → H3)
- [ ] All images have alt text
- [ ] All links are tested and working
- [ ] Code blocks have language specified
- [ ] Tables are properly formatted
- [ ] Content is spell-checked
- [ ] File renders without errors
- [ ] Mobile responsive (if applicable)

### Before Deploying
- [ ] All npm packages installed
- [ ] No console errors
- [ ] Test suite passes
- [ ] Cross-browser tested
- [ ] Accessibility validated
- [ ] Performance benchmarked
- [ ] Documentation updated

---

**Version**: 1.0.0  
**Last Updated**: November 29, 2025  
**Quick Help**: See [Complete Guide](./MDX-RENDERING-GUIDE.md) for detailed information
