#!/usr/bin/env node

/**
 * Verification Script for Virima Documentation Project
 * 
 * This script verifies that all configuration files are in place
 * and the project is ready for development and deployment.
 */

const fs = require('fs');
const path = require('path');

// ANSI color codes
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  bold: '\x1b[1m',
};

const log = {
  success: (msg) => console.log(`${colors.green}✅ ${msg}${colors.reset}`),
  error: (msg) => console.log(`${colors.red}❌ ${msg}${colors.reset}`),
  warning: (msg) => console.log(`${colors.yellow}⚠️  ${msg}${colors.reset}`),
  info: (msg) => console.log(`${colors.blue}ℹ️  ${msg}${colors.reset}`),
  title: (msg) => console.log(`\n${colors.bold}${colors.cyan}${msg}${colors.reset}\n`),
};

// Configuration files to check
const requiredFiles = [
  { path: 'package.json', description: 'Package configuration' },
  { path: 'vite.config.ts', description: 'Vite configuration' },
  { path: 'tsconfig.json', description: 'TypeScript configuration' },
  { path: 'tsconfig.node.json', description: 'TypeScript Node configuration' },
  { path: 'index.html', description: 'HTML entry point' },
  { path: 'App.tsx', description: 'Main application component' },
  { path: '.gitignore', description: 'Git ignore rules' },
  { path: 'README.md', description: 'Project README' },
  { path: 'QUICK_START.md', description: 'Quick start guide' },
  { path: 'IMPLEMENTATION_APPLIED.md', description: 'Implementation documentation' },
];

// Directories to check
const requiredDirectories = [
  { path: 'components', description: 'React components' },
  { path: 'content', description: 'MDX content files' },
  { path: 'lib', description: 'Library files' },
  { path: 'utils', description: 'Utility functions' },
  { path: 'styles', description: 'Style files' },
];

// Content directories to verify
const contentDirectories = [
  { path: 'content/5_13', description: 'Version 5.13 content' },
  { path: 'content/6_1', description: 'Version 6.1 content' },
  { path: 'content/6_1_1', description: 'Version 6.1.1 content' },
  { path: 'content/NG', description: 'NextGen content' },
];

// Module directories for version 6.1
const moduleDirectories = [
  { path: 'content/6_1/admin_6_1', description: 'Admin module' },
  { path: 'content/6_1/cmdb_6_1', description: 'CMDB module' },
  { path: 'content/6_1/discovery_6_1', description: 'Discovery module' },
  { path: 'content/6_1/itam_6_1', description: 'ITAM module' },
  { path: 'content/6_1/itsm_6_1', description: 'ITSM module' },
];

// Critical component files
const criticalComponents = [
  { path: 'components/DocumentationContent.tsx', description: 'Documentation content renderer' },
  { path: 'components/TableOfContents.tsx', description: 'TOC component' },
  { path: 'components/DocumentationLayout.tsx', description: 'Layout component' },
  { path: 'content/contentLoader.ts', description: 'Content loader' },
  { path: 'utils/mdxPathResolver.ts', description: 'MDX path resolver' },
];

let totalChecks = 0;
let passedChecks = 0;
let warnings = 0;

function checkFileExists(filePath) {
  return fs.existsSync(path.join(process.cwd(), filePath));
}

function checkDirectoryExists(dirPath) {
  const fullPath = path.join(process.cwd(), dirPath);
  return fs.existsSync(fullPath) && fs.statSync(fullPath).isDirectory();
}

function countMDXFiles(dirPath) {
  const fullPath = path.join(process.cwd(), dirPath);
  if (!fs.existsSync(fullPath)) return 0;
  
  let count = 0;
  function traverse(dir) {
    const files = fs.readdirSync(dir, { withFileTypes: true });
    for (const file of files) {
      const filePath = path.join(dir, file.name);
      if (file.isDirectory()) {
        traverse(filePath);
      } else if (file.name.endsWith('.mdx')) {
        count++;
      }
    }
  }
  
  try {
    traverse(fullPath);
  } catch (error) {
    log.error(`Error counting files in ${dirPath}: ${error.message}`);
  }
  
  return count;
}

function checkPackageJson() {
  log.title('📦 Checking package.json configuration');
  
  const pkgPath = path.join(process.cwd(), 'package.json');
  if (!fs.existsSync(pkgPath)) {
    log.error('package.json not found');
    return false;
  }
  
  try {
    const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
    
    // Check required scripts
    const requiredScripts = ['dev', 'build', 'preview', 'lint', 'type-check'];
    for (const script of requiredScripts) {
      totalChecks++;
      if (pkg.scripts && pkg.scripts[script]) {
        log.success(`Script "${script}" found`);
        passedChecks++;
      } else {
        log.error(`Script "${script}" missing`);
      }
    }
    
    // Check critical dependencies
    const criticalDeps = [
      'react',
      'react-dom',
      'react-router-dom',
      '@mdx-js/react',
      'vite',
      'typescript',
      'rehype-raw',
      'remark-gfm',
    ];
    
    for (const dep of criticalDeps) {
      totalChecks++;
      if (pkg.dependencies?.[dep] || pkg.devDependencies?.[dep]) {
        log.success(`Dependency "${dep}" found`);
        passedChecks++;
      } else {
        log.error(`Dependency "${dep}" missing`);
      }
    }
    
    // Check for invalid packages
    totalChecks++;
    const invalidPackages = [
      'Import from AWS',
      'Import from AZURE',
      'Import from Intune',
      'Import from Meraki',
    ];
    
    const hasInvalidPackages = invalidPackages.some(
      (invalid) => pkg.dependencies?.[invalid] || pkg.devDependencies?.[invalid]
    );
    
    if (!hasInvalidPackages) {
      log.success('No invalid package names found');
      passedChecks++;
    } else {
      log.error('Invalid package names found (must be removed)');
    }
    
    return true;
  } catch (error) {
    log.error(`Failed to parse package.json: ${error.message}`);
    return false;
  }
}

function checkViteConfig() {
  log.title('⚡ Checking Vite configuration');
  
  const vitePath = path.join(process.cwd(), 'vite.config.ts');
  if (!fs.existsSync(vitePath)) {
    log.error('vite.config.ts not found');
    totalChecks++;
    return false;
  }
  
  try {
    const content = fs.readFileSync(vitePath, 'utf8');
    
    // Check for base path
    totalChecks++;
    if (content.includes("base: '/FeatureDocsite/'")) {
      log.success('Base path configured for GitHub Pages');
      passedChecks++;
    } else {
      log.warning('Base path not configured (may need manual setup)');
      warnings++;
    }
    
    // Check for custom content copy plugin
    totalChecks++;
    if (content.includes('copyContentPlugin')) {
      log.success('Custom content copy plugin found');
      passedChecks++;
    } else {
      log.error('Custom content copy plugin missing');
    }
    
    // Check for MDX extension
    totalChecks++;
    if (content.includes('.mdx')) {
      log.success('MDX extension support configured');
      passedChecks++;
    } else {
      log.warning('MDX extension support may be missing');
      warnings++;
    }
    
    return true;
  } catch (error) {
    log.error(`Failed to read vite.config.ts: ${error.message}`);
    totalChecks++;
    return false;
  }
}

function checkContentLoader() {
  log.title('📥 Checking Content Loader');
  
  const loaderPath = path.join(process.cwd(), 'content/contentLoader.ts');
  if (!fs.existsSync(loaderPath)) {
    log.error('contentLoader.ts not found');
    totalChecks++;
    return false;
  }
  
  try {
    const content = fs.readFileSync(loaderPath, 'utf8');
    
    // Check for getBasePath function
    totalChecks++;
    if (content.includes('getBasePath')) {
      log.success('Base path detection function found');
      passedChecks++;
    } else {
      log.error('Base path detection function missing');
    }
    
    // Check for HTML extraction
    totalChecks++;
    if (content.includes('extractMDXFromHTML')) {
      log.success('HTML extraction function found');
      passedChecks++;
    } else {
      log.error('HTML extraction function missing');
    }
    
    // Check for version support
    totalChecks++;
    if (content.includes('currentVersion')) {
      log.success('Version management found');
      passedChecks++;
    } else {
      log.error('Version management missing');
    }
    
    return true;
  } catch (error) {
    log.error(`Failed to read contentLoader.ts: ${error.message}`);
    totalChecks++;
    return false;
  }
}

// Main verification process
async function verify() {
  console.log(`\n${colors.bold}${colors.cyan}========================================`);
  console.log('  Virima Documentation Setup Verification');
  console.log(`========================================${colors.reset}\n`);
  
  // Check required files
  log.title('📄 Checking required files');
  for (const file of requiredFiles) {
    totalChecks++;
    if (checkFileExists(file.path)) {
      log.success(`${file.description} (${file.path})`);
      passedChecks++;
    } else {
      log.error(`${file.description} (${file.path}) - NOT FOUND`);
    }
  }
  
  // Check required directories
  log.title('📁 Checking required directories');
  for (const dir of requiredDirectories) {
    totalChecks++;
    if (checkDirectoryExists(dir.path)) {
      log.success(`${dir.description} (${dir.path})`);
      passedChecks++;
    } else {
      log.error(`${dir.description} (${dir.path}) - NOT FOUND`);
    }
  }
  
  // Check content directories
  log.title('📚 Checking content structure');
  for (const dir of contentDirectories) {
    totalChecks++;
    if (checkDirectoryExists(dir.path)) {
      const mdxCount = countMDXFiles(dir.path);
      log.success(`${dir.description} (${mdxCount} MDX files)`);
      passedChecks++;
    } else {
      log.warning(`${dir.description} - NOT FOUND`);
      warnings++;
    }
  }
  
  // Check module directories
  log.title('🧩 Checking module structure (Version 6.1)');
  for (const dir of moduleDirectories) {
    totalChecks++;
    if (checkDirectoryExists(dir.path)) {
      const mdxCount = countMDXFiles(dir.path);
      log.success(`${dir.description} (${mdxCount} MDX files)`);
      passedChecks++;
    } else {
      log.warning(`${dir.description} - NOT FOUND`);
      warnings++;
    }
  }
  
  // Check critical components
  log.title('⚛️  Checking critical components');
  for (const component of criticalComponents) {
    totalChecks++;
    if (checkFileExists(component.path)) {
      log.success(`${component.description} (${component.path})`);
      passedChecks++;
    } else {
      log.error(`${component.description} (${component.path}) - NOT FOUND`);
    }
  }
  
  // Check package.json
  checkPackageJson();
  
  // Check vite.config.ts
  checkViteConfig();
  
  // Check content loader
  checkContentLoader();
  
  // Check GitHub Actions
  log.title('🚀 Checking GitHub Actions');
  totalChecks++;
  if (checkFileExists('.github/workflows/deploy.yml')) {
    log.success('GitHub Actions deployment workflow configured');
    passedChecks++;
  } else {
    log.warning('GitHub Actions workflow not found (deployment may be manual)');
    warnings++;
  }
  
  // Count total MDX files
  log.title('📊 Content Statistics');
  const totalMDXFiles = countMDXFiles('content');
  log.info(`Total MDX files across all versions: ${totalMDXFiles}`);
  
  if (totalMDXFiles >= 822) {
    log.success('✨ All 822+ registered files present!');
  } else if (totalMDXFiles > 0) {
    log.warning(`Only ${totalMDXFiles} MDX files found (expected 822+)`);
  } else {
    log.error('No MDX files found in content directory');
  }
  
  // Final summary
  log.title('📋 Verification Summary');
  
  const percentage = Math.round((passedChecks / totalChecks) * 100);
  
  console.log(`Total Checks: ${totalChecks}`);
  console.log(`${colors.green}Passed: ${passedChecks}${colors.reset}`);
  console.log(`${colors.red}Failed: ${totalChecks - passedChecks}${colors.reset}`);
  console.log(`${colors.yellow}Warnings: ${warnings}${colors.reset}`);
  console.log(`\nSuccess Rate: ${percentage}%\n`);
  
  if (percentage === 100) {
    console.log(`${colors.bold}${colors.green}🎉 Perfect! All checks passed!${colors.reset}\n`);
    console.log('Your project is ready for development and deployment.\n');
    console.log('Next steps:');
    console.log(`  1. Run ${colors.cyan}npm install${colors.reset}`);
    console.log(`  2. Run ${colors.cyan}npm run dev${colors.reset}`);
    console.log(`  3. Visit ${colors.cyan}http://localhost:3000${colors.reset}\n`);
  } else if (percentage >= 80) {
    console.log(`${colors.bold}${colors.green}✅ Good! Most checks passed.${colors.reset}\n`);
    console.log('Your project is mostly ready. Review warnings above.\n');
  } else if (percentage >= 60) {
    console.log(`${colors.bold}${colors.yellow}⚠️  Attention needed!${colors.reset}\n`);
    console.log('Several issues need to be addressed before proceeding.\n');
  } else {
    console.log(`${colors.bold}${colors.red}❌ Critical issues detected!${colors.reset}\n`);
    console.log('Please review and fix the errors above before proceeding.\n');
  }
  
  console.log(`${colors.cyan}For detailed setup instructions, see:${colors.reset}`);
  console.log(`  - QUICK_START.md`);
  console.log(`  - README.md`);
  console.log(`  - IMPLEMENTATION_APPLIED.md\n`);
}

// Run verification
verify().catch((error) => {
  console.error(`\n${colors.red}Verification failed with error:${colors.reset}`);
  console.error(error);
  process.exit(1);
});
