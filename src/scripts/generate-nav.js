#!/usr/bin/env node
/**
 * Navigation Data Generator
 * 
 * SINGLE SOURCE OF TRUTH: /content/<version>/index.mdx
 * 
 * This script:
 * 1. Reads index.mdx files from all versions
 * 2. Parses the TOC structure
 * 3. Generates navigationData.ts
 * 
 * Usage: npm run generate-nav
 */

const fs = require('fs');
const path = require('path');

// ============================================================================
// CONFIGURATION
// ============================================================================

const VERSIONS = ['6_1', '6_1_1', '5_13', 'NG'];
const REFERENCE_VERSION = '6_1'; // Use this version as the reference structure

// Module ID to variable name mapping
const MODULE_VAR_MAP = {
  'application-overview': 'defaultSections',
  'dashboards': 'myDashboardSections',
  'cmdb': 'cmdbSections',
  'discovery-scan': 'discoveryScanSections',
  'itsm': 'itsmSections',
  'vulnerability-management': 'vulnerabilityManagementSections',
  'itam': 'itamSections',
  'self-service': 'selfServiceSections',
  'program-project-management': 'programProjectManagementSections',
  'risk-register': 'riskRegisterSections',
  'reports': 'reportsSections',
  'admin': 'adminSections'
};

// ============================================================================
// PARSING FUNCTIONS
// ============================================================================

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
function getIndent(line) {
  const match = line.match(/^(\s*)-/);
  return match ? match[1].length : 0;
}

/**
 * Parse a markdown TOC structure
 */
function parseMDXTOC(content) {
  const lines = content.split('\n');
  const modules = [];
  let currentModule = null;
  let currentSection = null;
  const stack = []; // Stack for tracking nested items

  for (const line of lines) {
    // Module level (## Header)
    if (line.match(/^##\s+/)) {
      const title = line.replace(/^##\s+/, '').trim();
      const id = toKebabCase(title);
      
      currentModule = {
        id,
        title,
        label: title,
        sections: []
      };
      modules.push(currentModule);
      currentSection = null;
      stack.length = 0;
      continue;
    }

    // Section level (### Header)
    if (line.match(/^###\s+/)) {
      const title = line.replace(/^###\s+/, '').trim();
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
      stack.length = 0;
      continue;
    }

    // List items
    if (line.match(/^\s*-\s+.+→/)) {
      const indent = getIndent(line);
      const level = Math.floor(indent / 2);
      
      const match = line.match(/-\s+(.+?)\s+→/);
      if (!match) continue;
      
      const title = match[1].trim();
      const id = toKebabCase(title);
      
      const item = { id, label: title };
      
      // Determine where to add this item based on indentation
      if (level === 0) {
        // Top-level page
        if (currentSection) {
          currentSection.pages.push(item);
          stack[0] = item;
          stack.length = 1;
        }
      } else {
        // Nested item - add to parent's subPages
        const parent = stack[level - 1];
        if (parent) {
          if (!parent.subPages) {
            parent.subPages = [];
          }
          parent.subPages.push(item);
          stack[level] = item;
          stack.length = level + 1;
        }
      }
    }
  }

  return modules;
}

// ============================================================================
// GENERATION FUNCTIONS
// ============================================================================

/**
 * Convert parsed structure to TypeScript section export
 */
function generateSectionExport(sectionName, moduleData) {
  const sectionData = [{
    id: moduleData.id,
    title: moduleData.title,
    label: moduleData.label,
    pages: moduleData.sections.flatMap(s => s.pages || [])
  }];
  
  return `
// ${moduleData.title} sections
export const ${sectionName} = ${JSON.stringify(sectionData, null, 2).replace(/"([^"]+)":/g, '$1:')};
`;
}

/**
 * Generate complete navigationData.ts file
 */
function generateNavigationData() {
  console.log('🚀 Generating navigationData.ts from index.mdx\n');
  console.log(`📁 Reference version: ${REFERENCE_VERSION}\n`);

  // Read reference index.mdx
  const indexPath = path.join(__dirname, `../content/${REFERENCE_VERSION}/index.mdx`);
  
  if (!fs.existsSync(indexPath)) {
    console.error(`❌ Error: ${indexPath} not found`);
    process.exit(1);
  }

  const content = fs.readFileSync(indexPath, 'utf-8');
  const modules = parseMDXTOC(content);

  console.log(`📋 Parsed modules: ${modules.length}\n`);

  // Generate TypeScript file
  let output = `/**
 * AUTO-GENERATED from index.mdx — DO NOT EDIT MANUALLY
 * 
 * ⚠️  IMPORTANT: This file is automatically generated!
 * To update navigation structure, edit: /content/${REFERENCE_VERSION}/index.mdx
 * Then run: npm run generate-nav
 * 
 * SINGLE SOURCE OF TRUTH: /content/<version>/index.mdx files
 * 
 * Generated: ${new Date().toISOString()}
 * Reference: /content/${REFERENCE_VERSION}/index.mdx
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
      return defaultSections;
  }
}
`;

  // Write output
  const outputPath = path.join(__dirname, '../data/navigationData.ts');
  const backupPath = path.join(__dirname, '../data/navigationData.backup.ts');
  
  // Create backup of existing file
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

// ============================================================================
// MAIN EXECUTION
// ============================================================================

try {
  generateNavigationData();
  process.exit(0);
} catch (error) {
  console.error('\n❌ Error generating navigation:', error.message);
  console.error(error.stack);
  process.exit(1);
}
