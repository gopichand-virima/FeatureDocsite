#!/usr/bin/env node
/**
 * Generate Static MDX Import Files
 * 
 * This script automatically generates static import files for all MDX files
 * in version 6.1 modules, following the same pattern as adminMDXImports.ts
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

// Module directories to process (excluding admin_6_1 which is already done)
const modules = [
  { dir: 'cmdb_6_1', name: 'CMDB' },
  { dir: 'itsm_6_1', name: 'ITSM' },
  { dir: 'discovery_6_1', name: 'Discovery' },
  { dir: 'itam_6_1', name: 'ITAM' },
  { dir: 'dashboard_6_1', name: 'Dashboard' },
  { dir: 'application_overview_6_1', name: 'ApplicationOverview' },
  { dir: 'getting_started_6_1', name: 'GettingStarted' },
  { dir: 'prog_proj_mngmnt_6_1', name: 'ProgramProjectManagement' },
  { dir: 'reports_6_1', name: 'Reports' },
  { dir: 'risk_register_6_1', name: 'RiskRegister' },
  { dir: 'vulnerability_managment_6_1', name: 'VulnerabilityManagement' },
];

/**
 * Convert file path to camelCase variable name
 */
function toCamelCase(str) {
  return str
    .replace(/[^a-zA-Z0-9]/g, '_')
    .replace(/_+/g, '_')
    .split('_')
    .map((word, index) => {
      if (index === 0) return word.toLowerCase();
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    })
    .join('')
    .replace(/^_|_$/g, '');
}

/**
 * Get all MDX files recursively
 */
function getAllMDXFiles(dir, basePath = '') {
  const files = [];
  if (!fs.existsSync(dir)) {
    return files;
  }
  
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    const relativePath = path.join(basePath, entry.name);
    
    if (entry.isDirectory()) {
      files.push(...getAllMDXFiles(fullPath, relativePath));
    } else if (entry.name.endsWith('.mdx')) {
      files.push({
        fullPath,
        relativePath: relativePath.replace(/\\/g, '/'),
        fileName: entry.name,
      });
    }
  }
  
  return files;
}

/**
 * Generate import file for a module
 */
function generateImportFile(module) {
  const moduleDir = path.join(rootDir, 'src', 'content', '6_1', module.dir);
  const mdxFiles = getAllMDXFiles(moduleDir);
  
  if (mdxFiles.length === 0) {
    console.log(`⚠️  No MDX files found in ${module.dir}`);
    return null;
  }
  
  // Sort files by path for consistent ordering
  mdxFiles.sort((a, b) => a.relativePath.localeCompare(b.relativePath));
  
  // Generate imports
  const imports = [];
  const contentMap = [];
  
  mdxFiles.forEach((file, index) => {
    const varName = `${toCamelCase(file.fileName.replace('.mdx', ''))}61`;
    const importPath = `../../content/6_1/${module.dir}/${file.relativePath}`;
    const contentPath = `/content/6_1/${module.dir}/${file.relativePath}`;
    
    imports.push(`import ${varName} from '${importPath}?raw';`);
    contentMap.push(`  '${contentPath}': ${varName},`);
  });
  
  // Generate file content
  const fileContent = `/**
 * ${module.name} Module - Version 6.1 Static MDX Imports
 * 
 * Static imports for actual MDX content (Strategy 1 - Highest Priority)
 * This ensures ${module.name} content loads instantly from bundled assets
 * 
 * Auto-generated: ${new Date().toISOString()}
 * Total files: ${mdxFiles.length}
 */

${imports.join('\n')}

/**
 * ${module.name} MDX Content Map
 * Maps file paths to actual MDX content (static imports)
 * This is used by contentLoader Strategy 1 for instant loading
 */
export const ${module.name.toLowerCase()}MDXContent: Record<string, string> = {
${contentMap.join('\n')}
};

console.log(\`✅ [${module.name} MDX Content] Loaded \${Object.keys(${module.name.toLowerCase()}MDXContent).length} static MDX files\`);
`;

  return {
    fileName: `${module.name.toLowerCase()}MDXImports.ts`,
    content: fileContent,
    fileCount: mdxFiles.length,
  };
}

/**
 * Main execution
 */
console.log('🚀 Generating static MDX import files for version 6.1...\n');

const outputDir = path.join(rootDir, 'src', 'lib', 'imports');
let totalFiles = 0;

for (const module of modules) {
  console.log(`📦 Processing ${module.name} (${module.dir})...`);
  
  const result = generateImportFile(module);
  
  if (result) {
    const outputPath = path.join(outputDir, result.fileName);
    fs.writeFileSync(outputPath, result.content, 'utf-8');
    console.log(`   ✅ Generated ${result.fileName} (${result.fileCount} files)`);
    totalFiles += result.fileCount;
  }
}

console.log(`\n✅ Complete! Generated ${modules.length} import files with ${totalFiles} total MDX imports`);
console.log(`\n📝 Next step: Update src/content/contentLoader.ts to include all module imports`);

