#!/usr/bin/env node
/**
 * TOC Sync Script - Single Source of Truth
 * 
 * This script automatically updates all dependent files when index.mdx is modified.
 * 
 * SINGLE SOURCE OF TRUTH: /content/<version>/index.mdx
 * 
 * Updates:
 * 1. src/data/navigationData.ts - Navigation structure
 * 2. src/utils/indexContentMap.ts - Static TOC content map
 * 
 * Usage:
 *   npm run sync-toc              # Sync all versions
 *   npm run sync-toc -- 6_1       # Sync specific version
 *   npm run watch-toc             # Watch for changes and auto-sync
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Version configurations
const VERSIONS = {
  '6_1': { name: '6.1', dir: '6_1' },
  '6_1_1': { name: '6.1.1', dir: '6_1_1' },
  '5_13': { name: '5.13', dir: '5_13' },
  'NG': { name: 'NextGen', dir: 'NG' }
};

// Module ID to variable name mapping
const MODULE_VAR_MAP = {
  'my-dashboard': 'myDashboardSections',
  'admin': 'adminSections',
  'cmdb': 'cmdbSections',
  'discovery-scan': 'discoveryScanSections',
  'itsm': 'itsmSections',
  'itam': 'itamSections',
  'vulnerability-management': 'vulnerabilityManagementSections',
  'self-service': 'selfServiceSections',
  'program-project-management': 'programProjectManagementSections',
  'programproject-management': 'programProjectManagementSections', // Handle case where hyphen is removed
  'risk-register': 'riskRegisterSections',
  'reports': 'reportsSections'
};

/**
 * Convert string to kebab-case
 */
function toKebabCase(str) {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

/**
 * Get indentation level from line
 */
function getIndentLevel(line) {
  const match = line.match(/^(\s*)/);
  return match ? Math.floor(match[1].length / 2) : 0;
}

/**
 * Parse index.mdx file into structured data
 */
function parseIndexMDX(content, versionCode) {
  const lines = content.split('\n');
  const modules = [];
  let currentModule = null;
  let currentSection = null;
  let currentSubSection = null;
  const pageStack = []; // Stack for nested pages

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    // Skip empty lines, frontmatter, and comments
    if (!trimmed || trimmed.startsWith('---') || trimmed.startsWith('>') || trimmed.startsWith('#')) {
      // Handle headers
      if (trimmed.startsWith('## ')) {
        const title = trimmed.replace('## ', '').trim();
        const id = toKebabCase(title);
        
        currentModule = {
          id,
          title,
          label: title,
          sections: []
        };
        modules.push(currentModule);
        currentSection = null;
        currentSubSection = null;
        pageStack.length = 0;
        continue;
      }

      if (trimmed.startsWith('### ')) {
        const title = trimmed.replace('### ', '').trim();
        const id = toKebabCase(title);
        
        currentSection = {
          id,
          title,
          label: title,
          pages: []
        };
        
        if (currentModule) {
          currentModule.sections.push(currentSection);
        }
        currentSubSection = null;
        pageStack.length = 0;
        continue;
      }

      if (trimmed.startsWith('#### ')) {
        const title = trimmed.replace('#### ', '').trim();
        const id = toKebabCase(title);
        
        currentSubSection = {
          id,
          title,
          label: title,
          pages: []
        };
        
        if (currentSection) {
          if (!currentSection.subSections) {
            currentSection.subSections = [];
          }
          currentSection.subSections.push(currentSubSection);
        }
        pageStack.length = 0;
        continue;
      }
      
      continue;
    }

    // Parse list items (pages)
    if (trimmed.startsWith('- ')) {
      const match = trimmed.match(/^-\s+(.+?)\s+→\s+(.+)$/);
      if (!match) continue;

      const pageTitle = match[1].trim();
      const pagePath = match[2].trim();
      const indent = getIndentLevel(line);
      
      const pageItem = {
        id: toKebabCase(pageTitle),
        label: pageTitle,
        path: pagePath
      };

      // Determine nesting level
      if (indent === 0) {
        // Top-level page
        if (currentSubSection) {
          currentSubSection.pages.push(pageItem);
        } else if (currentSection) {
          currentSection.pages.push(pageItem);
        }
        pageStack[0] = pageItem;
        pageStack.length = 1;
      } else {
        // Nested page
        const parent = pageStack[indent - 1];
        if (parent) {
          if (!parent.subPages) {
            parent.subPages = [];
          }
          parent.subPages.push(pageItem);
          pageStack[indent] = pageItem;
          pageStack.length = indent + 1;
        }
      }
    }
  }

  return modules;
}

/**
 * Generate TypeScript section export
 */
function generateSectionExport(varName, moduleData) {
  const sectionData = [{
    id: moduleData.id,
    title: moduleData.title,
    label: moduleData.label,
    pages: moduleData.sections.flatMap(s => {
      const pages = s.pages || [];
      if (s.subSections) {
        s.subSections.forEach(sub => {
          pages.push(...(sub.pages || []));
        });
      }
      return pages;
    })
  }];

  return `
// ${moduleData.title} sections
export const ${varName} = ${JSON.stringify(sectionData, null, 2).replace(/"([^"]+)":/g, '$1:')};
`;
}

/**
 * Generate navigationData.ts
 */
function generateNavigationData(versionCode = '6_1') {
  console.log(`\n🚀 Generating navigationData.ts from index.mdx (${versionCode})...\n`);

  const version = VERSIONS[versionCode];
  if (!version) {
    console.error(`❌ Invalid version: ${versionCode}`);
    process.exit(1);
  }

  const indexPath = path.join(__dirname, `../src/content/${version.dir}/index.mdx`);
  
  if (!fs.existsSync(indexPath)) {
    console.error(`❌ Error: ${indexPath} not found`);
    process.exit(1);
  }

  const content = fs.readFileSync(indexPath, 'utf-8');
  const modules = parseIndexMDX(content, versionCode);

  console.log(`📋 Parsed ${modules.length} modules\n`);

  // Generate TypeScript file
  let output = `/**
 * AUTO-GENERATED from index.mdx — DO NOT EDIT MANUALLY
 * 
 * ⚠️  IMPORTANT: This file is automatically generated!
 * To update navigation structure, edit: /content/${version.dir}/index.mdx
 * Then run: npm run sync-toc
 * 
 * SINGLE SOURCE OF TRUTH: /content/<version>/index.mdx files
 * 
 * Generated: ${new Date().toISOString()}
 * Source: /content/${version.dir}/index.mdx
 */

// Module definitions
export const modules = [
`;

  // Generate module list from parsed modules
  modules.forEach(module => {
    output += `  { id: "${module.id}", label: "${module.title}" },\n`;
  });

  output += `];

// Version definitions
export const versions = ["NextGen", "6.1.1", "6.1", "5.13"];
`;

  // Generate section exports
  modules.forEach(module => {
    const varName = MODULE_VAR_MAP[module.id];
    if (varName) {
      output += generateSectionExport(varName, module);
      console.log(`✅ Generated: ${varName} (${module.sections.length} sections)`);
    } else {
      console.log(`⚠️  Skipped: ${module.id} (no mapping defined)`);
    }
  });

  // Add helper function
  const caseStatements = modules
    .filter(m => MODULE_VAR_MAP[m.id])
    .map(m => `    case "${m.id}":\n      return ${MODULE_VAR_MAP[m.id]};`)
    .join('\n');

  output += `
// Helper function to get sections for a specific module
export function getSectionsForModule(moduleId: string) {
  switch (moduleId) {
${caseStatements}
    default:
      return [];
  }
}
`;

  // Write output
  const outputPath = path.join(__dirname, '../src/data/navigationData.ts');
  const backupPath = path.join(__dirname, '../src/data/navigationData.backup.ts');
  
  // Create backup
  if (fs.existsSync(outputPath)) {
    fs.copyFileSync(outputPath, backupPath);
    console.log(`\n💾 Backup created: ${backupPath}`);
  }

  fs.writeFileSync(outputPath, output);

  console.log(`\n✅ navigationData.ts generated successfully!`);
  console.log(`📁 Output: ${outputPath}`);
  console.log(`📊 Total modules: ${modules.length}`);
  console.log(`\n⚠️  REMEMBER: Always edit index.mdx, not navigationData.ts!\n`);
}

/**
 * Generate indexContentMap.ts
 */
function generateIndexContentMap() {
  console.log(`\n🚀 Generating indexContentMap.ts from all index.mdx files...\n`);

  let output = `/**
 * Index Content Map
 * 
 * AUTO-GENERATED from index.mdx files — DO NOT EDIT MANUALLY
 * 
 * This file contains all the index.mdx content as raw strings.
 * This is necessary because in the browser environment, we can't use fetch() to load local files.
 * 
 * SINGLE SOURCE OF TRUTH: /content/<version>/index.mdx
 * 
 * Generated: ${new Date().toISOString()}
 * 
 * To update: Edit index.mdx files and run: npm run sync-toc
 */

`;

  // Generate TOC content for each version
  for (const [versionCode, version] of Object.entries(VERSIONS)) {
    const indexPath = path.join(__dirname, `../src/content/${version.dir}/index.mdx`);
    
    if (!fs.existsSync(indexPath)) {
      console.log(`⚠️  Skipping ${versionCode}: index.mdx not found`);
      continue;
    }

    const content = fs.readFileSync(indexPath, 'utf-8');
    
    // Escape the content for TypeScript string
    const escapedContent = content
      .replace(/\\/g, '\\\\')
      .replace(/`/g, '\\`')
      .replace(/\${/g, '\\${');

    output += `/**
 * Get TOC content for ${version.name}
 */
export function getTOC${versionCode.replace(/_/g, '').replace(/^./, c => c.toUpperCase())}(): string {
  return \`${escapedContent}\`;
}

`;
  }

  // Add main function
  output += `/**
 * Get TOC content for a specific version
 */
export function getTOCContent(version: string): string {
  switch (version) {
`;

  for (const [versionCode, version] of Object.entries(VERSIONS)) {
    const funcName = `getTOC${versionCode.replace(/_/g, '').replace(/^./, c => c.toUpperCase())}`;
    output += `    case "${version.name}":
    case "${versionCode}":
      return ${funcName}();
`;
  }

  output += `    default:
      return getTOC61();
  }
}
`;

  // Write output
  const outputPath = path.join(__dirname, '../src/utils/indexContentMap.ts');
  const backupPath = path.join(__dirname, '../src/utils/indexContentMap.backup.ts');
  
  // Create backup
  if (fs.existsSync(outputPath)) {
    fs.copyFileSync(outputPath, backupPath);
    console.log(`💾 Backup created: ${backupPath}`);
  }

  fs.writeFileSync(outputPath, output);

  console.log(`\n✅ indexContentMap.ts generated successfully!`);
  console.log(`📁 Output: ${outputPath}`);
  console.log(`📊 Versions processed: ${Object.keys(VERSIONS).length}\n`);
}

/**
 * Main execution
 */
function main() {
  const args = process.argv.slice(2);
  const versionArg = args.find(arg => !arg.startsWith('--'));
  const versionCode = versionArg || '6_1';

  console.log('═══════════════════════════════════════════════════════════');
  console.log('  TOC Sync Script - Single Source of Truth');
  console.log('═══════════════════════════════════════════════════════════');

  try {
    // Generate navigationData.ts
    generateNavigationData(versionCode);
    
    // Generate indexContentMap.ts
    generateIndexContentMap();

    console.log('═══════════════════════════════════════════════════════════');
    console.log('✅ All files synced successfully!');
    console.log('═══════════════════════════════════════════════════════════\n');
  } catch (error) {
    console.error('\n❌ Error syncing TOC:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

// Run if executed directly
main();

export { parseIndexMDX, generateNavigationData, generateIndexContentMap };

