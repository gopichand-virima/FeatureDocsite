#!/usr/bin/env node
/**
 * Generate navigationData.ts from index.mdx files
 * 
 * SINGLE SOURCE OF TRUTH: index.mdx files
 * This script parses the markdown TOC structure and generates TypeScript navigation data
 * 
 * Usage: npm run generate-nav
 */

const fs = require('fs');
const path = require('path');

// Version configurations
const VERSIONS = {
  'NextGen': { dir: 'NG', code: 'nextgen' },
  '6.1.1': { dir: '6_1_1', code: '6_1_1' },
  '6.1': { dir: '6_1', code: '6_1' },
  '5.13': { dir: '5_13', code: '5_13' }
};

/**
 * Parse markdown TOC structure from index.mdx
 */
function parseTOCFromMDX(mdxContent, version) {
  const lines = mdxContent.split('\n');
  const modules = [];
  let currentModule = null;
  let currentSection = null;
  let currentPage = null;
  let currentSubPage = null;
  let currentSubSubPage = null;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Skip frontmatter and comments
    if (line.startsWith('---') || line.startsWith('>') || line.trim() === '') {
      continue;
    }

    // Module level (## Header)
    if (line.startsWith('## ')) {
      const title = line.replace('## ', '').trim();
      const id = toKebabCase(title);
      
      currentModule = {
        id,
        title,
        label: title,
        sections: []
      };
      modules.push(currentModule);
      currentSection = null;
      currentPage = null;
      currentSubPage = null;
      currentSubSubPage = null;
      continue;
    }

    // Section level (### Header)
    if (line.startsWith('### ')) {
      const title = line.replace('### ', '').trim();
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
      currentPage = null;
      currentSubPage = null;
      currentSubSubPage = null;
      continue;
    }

    // Parse bullet points (pages)
    if (line.trim().startsWith('- ')) {
      const indent = line.search(/\S/); // Count leading spaces
      const match = line.match(/- (.+?) →/);
      
      if (!match) continue;
      
      const title = match[1].trim();
      const id = toKebabCase(title);
      
      const pageItem = {
        id,
        label: title
      };

      // Determine nesting level based on indentation
      if (indent === 0) {
        // Top-level page
        currentPage = pageItem;
        if (currentSection) {
          currentSection.pages.push(currentPage);
        }
        currentSubPage = null;
        currentSubSubPage = null;
      } else if (indent === 2) {
        // Sub-page (child of page)
        if (currentPage) {
          if (!currentPage.subPages) {
            currentPage.subPages = [];
          }
          currentPage.subPages.push(pageItem);
          currentSubPage = pageItem;
          currentSubSubPage = null;
        }
      } else if (indent === 4) {
        // Sub-sub-page (child of sub-page)
        if (currentSubPage) {
          if (!currentSubPage.subPages) {
            currentSubPage.subPages = [];
          }
          currentSubPage.subPages.push(pageItem);
          currentSubSubPage = pageItem;
        }
      } else if (indent === 6) {
        // Sub-sub-sub-page (child of sub-sub-page)
        if (currentSubSubPage) {
          if (!currentSubSubPage.subPages) {
            currentSubSubPage.subPages = [];
          }
          currentSubSubPage.subPages.push(pageItem);
        }
      }
    }
  }

  return modules;
}

/**
 * Convert string to kebab-case ID
 */
function toKebabCase(str) {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special chars
    .replace(/\s+/g, '-')         // Spaces to hyphens
    .replace(/-+/g, '-')          // Multiple hyphens to single
    .replace(/^-|-$/g, '');       // Remove leading/trailing hyphens
}

/**
 * Convert module data to TypeScript constant format
 */
function moduleToTypeScript(module, variableName) {
  return `
// ${module.title} sections
export const ${variableName} = ${JSON.stringify([{
    id: module.id,
    title: module.title,
    label: module.label,
    pages: module.sections.flatMap(s => s.pages)
  }], null, 2)};
`;
}

/**
 * Generate complete navigationData.ts file
 */
function generateNavigationFile() {
  console.log('🚀 Generating navigationData.ts from index.mdx files...\n');

  // Use version 6.1 as the reference (all versions have same structure)
  const indexPath = path.join(__dirname, '../content/6_1/index.mdx');
  
  if (!fs.existsSync(indexPath)) {
    console.error(`❌ Error: ${indexPath} not found`);
    process.exit(1);
  }

  const mdxContent = fs.readFileSync(indexPath, 'utf-8');
  const modules = parseTOCFromMDX(mdxContent, '6.1');

  console.log(`📋 Parsed ${modules.length} modules from index.mdx\n`);

  // Map module IDs to variable names
  const moduleMap = {
    'admin': 'adminSections',
    'my-dashboard': 'myDashboardSections',
    'dashboards': 'dashboardsSections',
    'cmdb': 'cmdbSections',
    'discovery-scan': 'discoveryScanSections',
    'itsm': 'itsmSections',
    'itam': 'itamSections',
    'vulnerability-management': 'vulnerabilityManagementSections',
    'self-service': 'selfServiceSections',
    'program-project-management': 'programProjectManagementSections',
    'risk-register': 'riskRegisterSections',
    'reports': 'reportsSections',
    'application-overview': 'applicationOverviewSections'
  };

  // Generate TypeScript content
  let tsContent = `/**
 * AUTO-GENERATED from index.mdx — DO NOT EDIT MANUALLY
 * 
 * Run 'npm run generate-nav' to update this file
 * 
 * SINGLE SOURCE OF TRUTH: /content/<version>/index.mdx
 * 
 * Generated: ${new Date().toISOString()}
 */

// Module definitions
export const modules = [
  { id: "admin", label: "Admin" },
  { id: "my-dashboard", label: "My Dashboard" },
  { id: "cmdb", label: "CMDB" },
  { id: "discovery-scan", label: "Discovery Scan" },
  { id: "itsm", label: "ITSM" },
  { id: "vulnerability-management", label: "Vulnerability Management" },
  { id: "itam", label: "ITAM" },
  { id: "self-service", label: "Self Service" },
  { id: "program-project-management", label: "Program and Project Management" },
  { id: "risk-register", label: "Risk Register" },
  { id: "reports", label: "Reports" },
];

// Version definitions
export const versions = ["NextGen", "6.1.1", "6.1", "5.13"];
`;

  // Generate section constants for each module
  modules.forEach(module => {
    const varName = moduleMap[module.id];
    if (varName) {
      tsContent += moduleToTypeScript(module, varName);
      console.log(`✅ Generated: ${varName}`);
    }
  });

  // Add helper function
  tsContent += `
// Helper function to get sections for a specific module
export function getSectionsForModule(moduleId: string) {
  switch (moduleId) {
${modules.map(m => {
  const varName = moduleMap[m.id];
  if (varName) {
    return `    case "${m.id}":\n      return ${varName};`;
  }
  return '';
}).filter(Boolean).join('\n')}
    default:
      return [];
  }
}
`;

  // Write to file
  const outputPath = path.join(__dirname, '../data/navigationData.ts');
  fs.writeFileSync(outputPath, tsContent);

  console.log(`\n✅ navigationData.ts generated successfully!`);
  console.log(`📁 Output: ${outputPath}`);
  console.log(`📊 Modules: ${modules.length}`);
  console.log(`\n⚠️  Remember: Edit index.mdx files, not navigationData.ts directly!\n`);
}

// Run the generator
try {
  generateNavigationFile();
} catch (error) {
  console.error('❌ Error generating navigation:', error);
  process.exit(1);
}
