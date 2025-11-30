# MDX Rendering - Package Requirements

## Overview

The MDX rendering system requires the following npm packages to function properly. These packages provide markdown parsing, GitHub Flavored Markdown support, HTML processing, and syntax highlighting.

## Required Packages

### Core Markdown Processing

#### react-markdown
```bash
npm install react-markdown
```
- **Version**: Latest (v8.x or v9.x recommended)
- **Purpose**: Core React component for rendering Markdown
- **Features**:
  - Safe by default (no XSS vulnerabilities)
  - Extensible with plugins
  - Customizable components
  - Full CommonMark support

**Import**:
```typescript
import ReactMarkdown from 'react-markdown';
```

### Extended Markdown Features

#### remark-gfm
```bash
npm install remark-gfm
```
- **Version**: Latest (v3.x or v4.x recommended)
- **Purpose**: GitHub Flavored Markdown support
- **Features**:
  - Tables
  - Task lists (checkboxes)
  - Strikethrough
  - Autolinks
  - Footnotes

**Import**:
```typescript
import remarkGfm from 'remark-gfm';
```

**Usage**:
```typescript
<ReactMarkdown remarkPlugins={[remarkGfm]}>
  {content}
</ReactMarkdown>
```

#### rehype-raw
```bash
npm install rehype-raw
```
- **Version**: Latest (v6.x or v7.x recommended)
- **Purpose**: Allows rendering of raw HTML in markdown
- **Features**:
  - Parse HTML tags
  - Preserve HTML structure
  - Safe HTML rendering

**Import**:
```typescript
import rehypeRaw from 'rehype-raw';
```

**Usage**:
```typescript
<ReactMarkdown rehypePlugins={[rehypeRaw]}>
  {content}
</ReactMarkdown>
```

### Syntax Highlighting

#### react-syntax-highlighter
```bash
npm install react-syntax-highlighter
```
- **Version**: Latest (v15.x recommended)
- **Purpose**: Syntax highlighting for code blocks
- **Features**:
  - 100+ language support
  - Multiple themes
  - Line numbering
  - Line highlighting

**Import**:
```typescript
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
```

**Type Definitions**:
```bash
npm install --save-dev @types/react-syntax-highlighter
```

### Type Definitions

For TypeScript support, install the following type definition packages:

```bash
npm install --save-dev @types/react-markdown
npm install --save-dev @types/react-syntax-highlighter
```

## Complete Installation Command

Install all required packages at once:

```bash
npm install react-markdown remark-gfm rehype-raw react-syntax-highlighter
npm install --save-dev @types/react-markdown @types/react-syntax-highlighter
```

## Package Configuration

### package.json

After installation, your `package.json` should include:

```json
{
  "dependencies": {
    "react-markdown": "^9.0.0",
    "remark-gfm": "^4.0.0",
    "rehype-raw": "^7.0.0",
    "react-syntax-highlighter": "^15.5.0"
  },
  "devDependencies": {
    "@types/react-markdown": "^8.0.0",
    "@types/react-syntax-highlighter": "^15.5.0"
  }
}
```

## Verification

### Test Imports

Create a test file to verify all packages are installed correctly:

```typescript
// test-mdx-imports.ts
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

console.log('✅ All MDX packages imported successfully');

export {
  ReactMarkdown,
  remarkGfm,
  rehypeRaw,
  SyntaxHighlighter,
  vscDarkPlus,
};
```

Run the test:
```bash
npm run build  # or your build command
```

If there are no errors, all packages are installed correctly.

### Runtime Test

Test the rendering system with a simple component:

```tsx
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

function TestComponent() {
  const markdown = `
# Test Heading

This is a paragraph with **bold** text.

| Feature | Status |
|---------|--------|
| Tables  | ✅     |
| Lists   | ✅     |

- [ ] Task 1
- [x] Task 2 (completed)
  `;

  return (
    <ReactMarkdown remarkPlugins={[remarkGfm]}>
      {markdown}
    </ReactMarkdown>
  );
}
```

## Alternative Packages (Optional)

### Additional Remark Plugins

#### remark-math & rehype-katex (for mathematical expressions)
```bash
npm install remark-math rehype-katex
```

#### remark-emoji (for emoji shortcodes)
```bash
npm install remark-emoji
```

### Alternative Syntax Highlighters

#### highlight.js
```bash
npm install highlight.js
npm install --save-dev @types/highlight.js
```

#### shiki (VS Code's syntax highlighter)
```bash
npm install shiki
```

## Troubleshooting

### Common Issues

#### 1. Module Not Found

**Error**: `Module not found: Can't resolve 'react-markdown'`

**Solution**:
```bash
npm install react-markdown
npm run build
```

#### 2. TypeScript Errors

**Error**: `Could not find a declaration file for module 'react-markdown'`

**Solution**:
```bash
npm install --save-dev @types/react-markdown
```

#### 3. ESM vs CommonJS Issues

**Error**: `require() of ES Module not supported`

**Solution**: Ensure your build tool (Vite, Webpack, etc.) is configured to handle ESM modules.

For Vite, this is typically automatic. For Webpack, update your configuration:

```javascript
// webpack.config.js
module.exports = {
  // ...
  resolve: {
    extensionAlias: {
      '.js': ['.js', '.ts'],
      '.jsx': ['.jsx', '.tsx'],
    },
  },
};
```

#### 4. Build Size Concerns

If bundle size is a concern, use dynamic imports:

```typescript
const SyntaxHighlighter = lazy(() => 
  import('react-syntax-highlighter').then(mod => ({ 
    default: mod.Prism 
  }))
);
```

### Version Compatibility

The packages are tested with:
- **React**: 18.x
- **TypeScript**: 5.x
- **Node**: 18.x or higher

## Migration from Old Versions

### From react-markdown v7 to v9

Main breaking changes:
1. `renderers` prop renamed to `components`
2. Plugin array syntax changed
3. Some component signatures updated

**Old**:
```typescript
<ReactMarkdown renderers={{ code: CodeBlock }}>
  {content}
</ReactMarkdown>
```

**New**:
```typescript
<ReactMarkdown components={{ code: CodeBlock }}>
  {content}
</ReactMarkdown>
```

### From remark-gfm v2 to v4

The API remains largely the same, but ensure you're using the latest version for best results.

## Build System Integration

### Vite

Vite handles these packages automatically. No additional configuration needed.

### Webpack

Add to your webpack config:

```javascript
module.exports = {
  // ...
  module: {
    rules: [
      {
        test: /\.mdx?$/,
        use: ['babel-loader', '@mdx-js/loader'],
      },
    ],
  },
};
```

### Next.js

Install the MDX plugin:

```bash
npm install @next/mdx
```

Configure in `next.config.js`:

```javascript
const withMDX = require('@next/mdx')({
  extension: /\.mdx?$/,
  options: {
    remarkPlugins: [remarkGfm],
    rehypePlugins: [rehypeRaw],
  },
});

module.exports = withMDX({
  pageExtensions: ['ts', 'tsx', 'md', 'mdx'],
});
```

## Performance Optimization

### Code Splitting

Split syntax highlighter by language:

```typescript
const loadLanguage = async (lang: string) => {
  const languages = {
    javascript: () => import('react-syntax-highlighter/dist/esm/languages/prism/javascript'),
    python: () => import('react-syntax-highlighter/dist/esm/languages/prism/python'),
    // Add more languages as needed
  };
  
  return languages[lang]?.();
};
```

### Tree Shaking

Import only what you need:

```typescript
// Instead of:
import * as SyntaxHighlighter from 'react-syntax-highlighter';

// Use:
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
```

## Security Considerations

### XSS Prevention

`react-markdown` is safe by default and prevents XSS attacks. When using `rehype-raw`, ensure you trust the source of your HTML content.

For untrusted content, use a sanitizer:

```bash
npm install rehype-sanitize
```

```typescript
import rehypeSanitize from 'rehype-sanitize';

<ReactMarkdown rehypePlugins={[rehypeRaw, rehypeSanitize]}>
  {content}
</ReactMarkdown>
```

## Resources

- [react-markdown GitHub](https://github.com/remarkjs/react-markdown)
- [remark-gfm GitHub](https://github.com/remarkjs/remark-gfm)
- [rehype-raw GitHub](https://github.com/rehypejs/rehype-raw)
- [react-syntax-highlighter GitHub](https://github.com/react-syntax-highlighter/react-syntax-highlighter)
- [Unified Ecosystem](https://unifiedjs.com/)
- [CommonMark Spec](https://commonmark.org/)
- [GFM Spec](https://github.github.com/gfm/)

## Support

For package-specific issues:
1. Check the package's GitHub issues
2. Review the package documentation
3. Verify version compatibility
4. Test with minimal reproduction

For Virima-specific MDX rendering issues, refer to the [MDX Rendering Guide](./MDX-RENDERING-GUIDE.md).
