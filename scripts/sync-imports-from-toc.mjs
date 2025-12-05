#!/usr/bin/env node

/**
 * Synchronize Import Definitions with Version-Specific TOC
 * 
 * This script:
 * 1. Parses all version index.mdx files (NG, 6.1, 6.1.1, 5.13)
 * 2. Extracts all file paths from each TOC
 * 3. Groups files by module and version
 * 4. Updates import files to include all topics from all versions
 * 5. Only includes files that actually exist
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

// Version mappings
const VERSIONS = {
  'NG': 'NG',
  '6.1': '6_1',
  '6.1.1': '6_1_1',
  '5.13': '5_13'
};

// Module patterns to identify which module a file belongs to
const MODULE_PATTERNS = {
  'admin': /\/admin/,
  'cmdb': /\/cmdb/,
  'discovery': /\/discovery/,
  'itsm': /\/itsm/,
  'itam': /\/itam/,
  'dashboard': /\/dashboard/,
  'gettingstarted': /\/getting_started/,
  'applicationoverview': /\/application_overview/,
  'programprojectmanagement': /\/prog_proj_mngmnt/,
  'reports': /\/reports/,
  'riskregister': /\/risk_register/,
  'vulnerabilitymanagement': /\/vulnerability_managment/,
  'supportpolicy': /\/support_policy|\/compatibility_matrix/
};

/**
 * Extract file paths from index.mdx content
 */
function extractFilePaths(content, version) {
  const paths = [];
  // Match patterns like: `- Topic → `/content/VERSION/path/file.mdx``
  // Also handle backslashes and variations
  const regex = /→\s*`?([\/\\]?content[\/\\][^`\s\n]+\.mdx)`?/g;
  let match;
  
  while ((match = regex.exec(content)) !== null) {
    let filePath = match[1];
    // Normalize path separators
    filePath = filePath.replace(/\\/g, '/');
    // Ensure it starts with /content/
    if (!filePath.startsWith('/content/')) {
      filePath = '/content/' + filePath.replace(/^content\//, '');
    }
    paths.push(filePath);
  }
  
  return [...new Set(paths)]; // Remove duplicates
}

/**
 * Determine module from file path
 */
function getModuleFromPath(filePath) {
  for (const [module, pattern] of Object.entries(MODULE_PATTERNS)) {
    if (pattern.test(filePath)) {
      return module;
    }
  }
  return 'other';
}

/**
 * Generate variable name from file path
 */
function generateVarName(filePath, version) {
  // Remove /content/VERSION/ prefix
  let name = filePath.replace(/^\/content\/[^\/]+\//, '');
  // Remove .mdx extension
  name = name.replace(/\.mdx$/, '');
  // Remove version suffix from path parts (e.g., _5_13, _6_1, _ng)
  const versionPatterns = [
    /_5_13$/,
    /_6_1_1$/,
    /_6_1$/,
    /_ng$/
  ];
  name = name.split('/').map(part => {
    let cleaned = part;
    for (const pattern of versionPatterns) {
      cleaned = cleaned.replace(pattern, '');
    }
    return cleaned;
  }).join('/');
  
  // Replace slashes and special chars with camelCase
  name = name
    .split('/')
    .map(part => part.replace(/[^a-zA-Z0-9]/g, '_'))
    .map(part => {
      // Convert to camelCase
      const words = part.split('_').filter(w => w);
      return words.map((w, i) => 
        i === 0 ? w.toLowerCase() : w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()
      ).join('');
    })
    .map(part => part.charAt(0).toUpperCase() + part.slice(1))
    .join('');
  // Make first letter lowercase
  name = name.charAt(0).toLowerCase() + name.slice(1);
  // Add version suffix (normalized)
  const versionSuffix = version.replace(/_/g, '');
  name = name + versionSuffix;
  return name;
}

/**
 * Check if file exists and return correct path
 */
function findExistingFile(filePath) {
  // Convert /content/VERSION/... to src/content/VERSION/...
  const exactPath = path.join(rootDir, 'src', filePath.replace(/^\/content\//, ''));
  
  if (fs.existsSync(exactPath)) {
    return filePath;
  }
  
  // Try to find file with common typos (double letters, etc.)
  const basePath = path.dirname(exactPath);
  const fileName = path.basename(exactPath);
  
  if (fs.existsSync(basePath)) {
    try {
      const files = fs.readdirSync(basePath);
      // Look for files that are close matches
      const closeMatch = files.find(f => {
        // Remove common typos
        const normalized = f.replace(/(.)\1+/g, '$1'); // Remove double letters
        const normalizedTarget = fileName.replace(/(.)\1+/g, '$1');
        return normalized === normalizedTarget || f === fileName;
      });
      
      if (closeMatch) {
        const foundPath = path.join(basePath, closeMatch);
        const relativePath = path.relative(path.join(rootDir, 'src'), foundPath);
        return '/' + relativePath.replace(/\\/g, '/');
      }
    } catch (e) {
      // Directory doesn't exist or can't be read
    }
  }
  
  return null;
}

/**
 * Read and parse all index.mdx files
 */
function parseAllTOCs() {
  const allFiles = {};
  const stats = { total: 0, found: 0, missing: 0 };
  
  for (const [displayVersion, versionCode] of Object.entries(VERSIONS)) {
    const indexPath = path.join(rootDir, 'src', 'content', versionCode, 'index.mdx');
    
    if (!fs.existsSync(indexPath)) {
      console.warn(`⚠️  Index file not found: ${indexPath}`);
      continue;
    }
    
    const content = fs.readFileSync(indexPath, 'utf-8');
    const filePaths = extractFilePaths(content, versionCode);
    
    console.log(`📖 Parsed ${versionCode}: ${filePaths.length} files in TOC`);
    stats.total += filePaths.length;
    
    // Group by module and verify files exist
    for (const filePath of filePaths) {
      const module = getModuleFromPath(filePath);
      if (!allFiles[module]) {
        allFiles[module] = {};
      }
      if (!allFiles[module][versionCode]) {
        allFiles[module][versionCode] = [];
      }
      
      // Check if file exists - convert /content/VERSION/... to src/content/VERSION/...
      const fullPath = path.join(rootDir, 'src', filePath);
      if (fs.existsSync(fullPath)) {
        allFiles[module][versionCode].push(filePath);
        stats.found++;
      } else {
        stats.missing++;
        // Don't add missing files to imports
      }
    }
  }
  
  console.log(`\n📊 Summary: ${stats.found} files found, ${stats.missing} missing from filesystem`);
  return allFiles;
}

/**
 * Read existing import file to get current imports
 */
function readExistingImports(moduleName) {
  const importFile = path.join(rootDir, 'src', 'lib', 'imports', `${moduleName}MDXImports.ts`);
  
  if (!fs.existsSync(importFile)) {
    return { imports: new Set(), contentMap: new Map() };
  }
  
  const content = fs.readFileSync(importFile, 'utf-8');
  const imports = new Set();
  const contentMap = new Map();
  
  // Extract import statements
  const importRegex = /import\s+(\w+)\s+from\s+['"]([^'"]+)['"]/g;
  let match;
  while ((match = importRegex.exec(content)) !== null) {
    imports.add(match[1]);
  }
  
  // Extract content map entries - convert relative paths to absolute
  const mapRegex = /['"]([^'"]+)['"]:\s+(\w+)/g;
  while ((match = mapRegex.exec(content)) !== null) {
    const filePath = match[1];
    const varName = match[2];
    contentMap.set(filePath, varName);
  }
  
  return { imports, contentMap };
}

/**
 * Generate import file content
 */
function generateImportFile(moduleName, filesByVersion) {
  const lines = [];
  const moduleDisplayName = moduleName.charAt(0).toUpperCase() + moduleName.slice(1).replace(/([A-Z])/g, ' $1');
  
  lines.push(`/**`);
  lines.push(` * ${moduleDisplayName} Module - Multi-Version Static MDX Imports`);
  lines.push(` * `);
  lines.push(` * Static imports for actual MDX content (Strategy 1 - Highest Priority)`);
  lines.push(` * This ensures ${moduleDisplayName} content loads instantly from bundled assets`);
  lines.push(` * `);
  lines.push(` * Auto-synchronized from TOC files`);
  lines.push(` * Versions: ${Object.keys(filesByVersion).join(', ')}`);
  lines.push(` */`);
  lines.push('');
  
  const allImports = new Map(); // varName -> relativePath
  const allContentMap = new Map(); // filePath -> varName
  const existingImports = readExistingImports(moduleName);
  
  // Generate imports organized by version
  for (const [version, files] of Object.entries(filesByVersion).sort()) {
    if (files.length === 0) continue;
    
    lines.push(`// ========================================`);
    lines.push(`// Version ${version}`);
    lines.push(`// ========================================`);
    lines.push('');
    
    for (const filePath of files.sort()) {
      // Check if file actually exists
      const fullPath = path.join(rootDir, 'src', filePath);
      if (!fs.existsSync(fullPath)) {
        continue; // Skip files that don't exist
      }
      
      const varName = generateVarName(filePath, version);
      const relativePath = filePath.replace(/^\//, '../../');
      
      // Avoid duplicates - check if we already have this varName
      let finalVarName = varName;
      let counter = 1;
      while (allImports.has(finalVarName)) {
        finalVarName = varName + counter;
        counter++;
      }
      
      lines.push(`import ${finalVarName} from '${relativePath}?raw';`);
      allImports.set(finalVarName, relativePath);
      allContentMap.set(filePath, finalVarName);
    }
    
    lines.push('');
  }
  
  // Generate content map
  lines.push(`/**`);
  lines.push(` * ${moduleDisplayName} MDX Content Map`);
  lines.push(` * Maps file paths to actual MDX content (static imports)`);
  lines.push(` * This is used by contentLoader Strategy 1 for instant loading`);
  lines.push(` */`);
  lines.push(`export const ${moduleName}MDXContent: Record<string, string> = {`);
  
  for (const [filePath, varName] of Array.from(allContentMap.entries()).sort()) {
    lines.push(`  '${filePath}': ${varName},`);
  }
  
  lines.push(`};`);
  lines.push('');
  lines.push(`console.log(\`✅ [${moduleDisplayName} MDX Content] Loaded \${Object.keys(${moduleName}MDXContent).length} static MDX files\`);`);
  
  return lines.join('\n');
}

/**
 * Main execution
 */
function main() {
  console.log('🔄 Starting import synchronization...\n');
  
  // Parse all TOC files
  const allFiles = parseAllTOCs();
  
  console.log('\n📊 Files by module:');
  for (const [module, versions] of Object.entries(allFiles)) {
    const total = Object.values(versions).reduce((sum, files) => sum + files.length, 0);
    const existing = Object.values(versions).reduce((sum, files) => {
      return sum + files.filter(f => {
        const fullPath = path.join(rootDir, 'src', f.replace(/^\/content\//, ''));
        return fs.existsSync(fullPath);
      }).length;
    }, 0);
    console.log(`  ${module}: ${existing}/${total} files (${total - existing} missing)`);
  }
  
  // Generate/update import files for each module
  console.log('\n📝 Generating import files...\n');
  
  for (const [module, filesByVersion] of Object.entries(allFiles)) {
    if (module === 'other') {
      console.log(`⏭️  Skipping 'other' module`);
      continue;
    }
    
    const importFile = path.join(rootDir, 'src', 'lib', 'imports', `${module}MDXImports.ts`);
    const content = generateImportFile(module, filesByVersion);
    
    fs.writeFileSync(importFile, content, 'utf-8');
    
    // Count how many files were added
    const newCount = Array.from(filesByVersion).reduce((sum, [_, files]) => {
      return sum + files.filter(f => {
        const fullPath = path.join(rootDir, 'src', f);
        return fs.existsSync(fullPath);
      }).length;
    }, 0);
    
    console.log(`✅ Updated: ${module}MDXImports.ts (${newCount} files)`);
  }
  
  console.log('\n✨ Synchronization complete!');
  console.log('\n💡 Note: Files listed in TOC but missing from filesystem were skipped.');
  console.log('   Fix any typos in index.mdx files if needed.');
}

main();

