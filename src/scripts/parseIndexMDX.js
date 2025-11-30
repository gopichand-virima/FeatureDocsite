#!/usr/bin/env node
/**
 * Advanced MDX TOC Parser
 * Parses complex nested structures from index.mdx with proper indentation handling
 */

const fs = require('fs');
const path = require('path');

class TOCParser {
  constructor() {
    this.modules = [];
    this.stack = [];
  }

  /**
   * Parse index.mdx and extract hierarchical structure
   */
  parse(mdxContent) {
    const lines = mdxContent.split('\n');
    let currentModule = null;
    let currentSection = null;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      
      // Skip empty lines, frontmatter, and comments
      if (!line.trim() || line.startsWith('---') || line.startsWith('>') || line.startsWith('#')) {
        // Handle headers
        if (line.startsWith('## ')) {
          const title = line.replace('## ', '').trim();
          currentModule = this.createModule(title);
          this.modules.push(currentModule);
          currentSection = null;
        } else if (line.startsWith('### ')) {
          const title = line.replace('### ', '').trim();
          currentSection = this.createSection(title);
          if (currentModule) {
            if (!currentModule.sections) currentModule.sections = [];
            currentModule.sections.push(currentSection);
          }
        }
        continue;
      }

      // Parse list items
      if (line.trim().startsWith('- ')) {
        const item = this.parseListItem(line);
        if (item && currentSection) {
          if (!currentSection.pages) currentSection.pages = [];
          currentSection.pages.push(item);
        }
      }
    }

    return this.modules;
  }

  /**
   * Parse a single list item with proper nesting
   */
  parseListItem(line) {
    const indent = this.getIndentLevel(line);
    const match = line.match(/- (.+?) →/);
    
    if (!match) return null;
    
    const title = match[1].trim();
    const id = this.toKebabCase(title);
    
    const item = { id, label: title };
    
    // Build stack for nesting
    while (this.stack.length > indent) {
      this.stack.pop();
    }
    
    if (this.stack.length > 0) {
      const parent = this.stack[this.stack.length - 1];
      if (!parent.subPages) {
        parent.subPages = [];
      }
      parent.subPages.push(item);
    }
    
    this.stack[indent] = item;
    
    return indent === 0 ? item : null; // Only return top-level items
  }

  /**
   * Get indentation level (0, 1, 2, 3, ...)
   */
  getIndentLevel(line) {
    const spaces = line.search(/\S/);
    return Math.floor(spaces / 2);
  }

  /**
   * Create module object
   */
  createModule(title) {
    return {
      id: this.toKebabCase(title),
      title,
      label: title,
      sections: []
    };
  }

  /**
   * Create section object
   */
  createSection(title) {
    return {
      id: this.toKebabCase(title),
      title,
      label: title,
      pages: []
    };
  }

  /**
   * Convert to kebab-case
   */
  toKebabCase(str) {
    return str
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
  }
}

/**
 * Main generation function
 */
function generateFromIndex() {
  console.log('🔍 Parsing index.mdx files...\n');

  const indexPath = path.join(__dirname, '../content/6_1/index.mdx');
  
  if (!fs.existsSync(indexPath)) {
    console.error(`❌ ${indexPath} not found`);
    process.exit(1);
  }

  const content = fs.readFileSync(indexPath, 'utf-8');
  const parser = new TOCParser();
  const modules = parser.parse(content);

  console.log(`✅ Parsed ${modules.length} modules`);
  modules.forEach(m => {
    const sectionCount = m.sections?.length || 0;
    const pageCount = m.sections?.reduce((sum, s) => sum + (s.pages?.length || 0), 0) || 0;
    console.log(`   📦 ${m.title}: ${sectionCount} sections, ${pageCount} pages`);
  });

  return modules;
}

// Export for use in other scripts
module.exports = { TOCParser, generateFromIndex };

// Run if called directly
if (require.main === module) {
  const modules = generateFromIndex();
  console.log('\n' + JSON.stringify(modules, null, 2));
}
