/**
 * Migration Script: Centralized to Hierarchical TOC
 * 
 * This script helps migrate from the centralized index.mdx structure
 * to the decentralized hierarchical structure.
 * 
 * Usage:
 * 1. Run this script to analyze the current structure
 * 2. It will generate suggested index.mdx files
 * 3. Review and place them in appropriate directories
 * 4. Test navigation
 */

interface ParsedModule {
  name: string;
  id: string;
  sections: ParsedSection[];
}

interface ParsedSection {
  name: string;
  id: string;
  pages: ParsedPage[];
}

interface ParsedPage {
  name: string;
  id: string;
  path: string;
  children: ParsedPage[];
  indent: number;
}

/**
 * Parses a centralized index.mdx file
 */
function parseCentralizedIndex(content: string): ParsedModule[] {
  const lines = content.split('\n');
  const modules: ParsedModule[] = [];
  let currentModule: ParsedModule | null = null;
  let currentSection: ParsedSection | null = null;
  let pageStack: { page: ParsedPage; indent: number }[] = [];

  for (const line of lines) {
    const trimmed = line.trim();

    if (!trimmed || trimmed.startsWith('>') || trimmed === '---') {
      continue;
    }

    // Module
    if (trimmed.startsWith('## ') && !trimmed.includes('---')) {
      const moduleName = trimmed.substring(3).trim();
      const moduleId = convertToId(moduleName);
      
      currentModule = {
        name: moduleName,
        id: moduleId,
        sections: [],
      };
      modules.push(currentModule);
      currentSection = null;
      pageStack = [];
      continue;
    }

    // Section
    if (trimmed.startsWith('###') && currentModule) {
      const sectionName = trimmed.replace(/^#+\s+/, '').trim();
      const sectionId = convertToId(sectionName);
      
      currentSection = {
        name: sectionName,
        id: sectionId,
        pages: [],
      };
      currentModule.sections.push(currentSection);
      pageStack = [];
      continue;
    }

    // Page
    if (trimmed.startsWith('- ') && trimmed.includes('→') && currentSection) {
      const match = trimmed.match(/^-\s+(.+?)\s+→\s+(.+)$/);
      if (match) {
        const pageName = match[1].trim();
        const path = match[2].trim().replace(/`/g, '');
        const pageId = convertToId(pageName);

        const indent = line.search(/\S/);
        const page: ParsedPage = {
          name: pageName,
          id: pageId,
          path: path,
          children: [],
          indent: indent,
        };

        // Handle nesting
        if (indent > 0 && pageStack.length > 0) {
          // Find parent
          while (pageStack.length > 0 && pageStack[pageStack.length - 1].indent >= indent) {
            pageStack.pop();
          }

          if (pageStack.length > 0) {
            const parent = pageStack[pageStack.length - 1].page;
            parent.children.push(page);
            pageStack.push({ page, indent });
          } else {
            currentSection.pages.push(page);
            pageStack = [{ page, indent }];
          }
        } else {
          currentSection.pages.push(page);
          pageStack = [{ page, indent }];
        }
      }
    }
  }

  return modules;
}

/**
 * Generates a module-level index.mdx
 */
function generateModuleIndex(module: ParsedModule, version: string): string {
  const versionPath = versionToPath(version);
  let content = `# ${module.name} - Version ${version}\n\n`;
  content += `> Local Table of Contents for ${module.name} Module\n`;
  content += `> Manages all ${module.name} subsections and their pages\n\n`;
  content += `---\n\n`;

  for (const section of module.sections) {
    content += `## ${section.name}\n\n`;
    
    // Determine if section should have its own index
    const shouldHaveIndex = section.pages.length > 5 || 
                           section.pages.some(p => p.children.length > 0);
    
    if (shouldHaveIndex) {
      // Point to section folder (which will have index.mdx)
      const sectionPath = `/content/${versionPath}/${module.id}/${section.id}`;
      content += `- ${section.name} → \`${sectionPath}\`\n\n`;
    } else {
      // List pages directly
      for (const page of section.pages) {
        content += `- ${page.name} → \`${page.path}\`\n`;
      }
      content += `\n`;
    }
    
    content += `---\n\n`;
  }

  return content;
}

/**
 * Generates a section-level index.mdx
 */
function generateSectionIndex(section: ParsedSection, moduleName: string, version: string): string {
  let content = `# ${section.name} - ${moduleName} - Version ${version}\n\n`;
  content += `> Local index for ${section.name} section\n\n`;
  content += `---\n\n`;
  content += `## ${section.name} Pages\n\n`;

  function writePages(pages: ParsedPage[], indent: number = 0) {
    for (const page of pages) {
      const spaces = '  '.repeat(indent);
      content += `${spaces}- ${page.name} → \`${page.path}\`\n`;
      
      if (page.children.length > 0) {
        writePages(page.children, indent + 1);
      }
    }
  }

  writePages(section.pages);

  return content;
}

/**
 * Generates migration plan
 */
function generateMigrationPlan(modules: ParsedModule[], version: string): string {
  const versionPath = versionToPath(version);
  let plan = `# Migration Plan for Version ${version}\n\n`;
  plan += `## Files to Create\n\n`;

  let fileCount = 0;

  for (const module of modules) {
    // Module index
    const moduleIndexPath = `/content/${versionPath}/${module.id}/index.mdx`;
    plan += `### ${++fileCount}. ${moduleIndexPath}\n\n`;
    plan += `\`\`\`markdown\n`;
    plan += generateModuleIndex(module, version);
    plan += `\`\`\`\n\n`;

    // Section indexes
    for (const section of module.sections) {
      const shouldHaveIndex = section.pages.length > 5 || 
                             section.pages.some(p => p.children.length > 0);
      
      if (shouldHaveIndex) {
        const sectionIndexPath = `/content/${versionPath}/${module.id}/${section.id}/index.mdx`;
        plan += `### ${++fileCount}. ${sectionIndexPath}\n\n`;
        plan += `\`\`\`markdown\n`;
        plan += generateSectionIndex(section, module.name, version);
        plan += `\`\`\`\n\n`;
      }
    }
  }

  plan += `## Summary\n\n`;
  plan += `- Total files to create: ${fileCount}\n`;
  plan += `- Modules: ${modules.length}\n`;
  plan += `- Total sections: ${modules.reduce((sum, m) => sum + m.sections.length, 0)}\n`;

  return plan;
}

/**
 * Helper functions
 */
function convertToId(name: string): string {
  return name
    .toLowerCase()
    .replace(/[&/]/g, '-')
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

function versionToPath(version: string): string {
  const mapping: Record<string, string> = {
    '5.13': '5_13',
    '6.1': '6_1',
    '6.1.1': '6_1_1',
    'NextGen': 'NG',
  };
  return mapping[version] || version;
}

/**
 * Main execution
 */
export function analyzeCentralizedIndex(content: string, version: string): string {
  console.log(`🔍 Analyzing centralized index for version ${version}...`);
  
  const modules = parseCentralizedIndex(content);
  console.log(`✅ Found ${modules.length} modules`);
  
  const plan = generateMigrationPlan(modules, version);
  console.log(`📋 Migration plan generated`);
  
  return plan;
}

/**
 * Example usage:
 * 
 * import { analyzeCentralizedIndex } from './migrateToHierarchical';
 * import fs from 'fs';
 * 
 * const content = fs.readFileSync('/content/6_1/index.mdx', 'utf-8');
 * const plan = analyzeCentralizedIndex(content, '6.1');
 * fs.writeFileSync('/migration-plan-6.1.md', plan);
 */

// For Node.js execution
if (typeof process !== 'undefined' && process.argv[1] === __filename) {
  console.log('Migration script loaded. Import and use analyzeCentralizedIndex() to generate migration plan.');
}
