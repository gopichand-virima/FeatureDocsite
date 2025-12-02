#!/usr/bin/env node

/**
 * Security Verification Script
 * Verifies that no API keys are hardcoded in source code
 */

const fs = require('fs');
const path = require('path');

console.log('🔐 Virima Documentation - Security Verification\n');

// Patterns that should NOT exist in source code
const DANGEROUS_PATTERNS = [
  /sk-[a-zA-Z0-9_-]{32,}/g,  // OpenAI API keys
  /apiKey\s*[:=]\s*['"`][sk-]/gi,  // Hardcoded API keys
];

// Files/directories to skip
const SKIP_PATTERNS = [
  /node_modules/,
  /\.git/,
  /dist/,
  /build/,
  /\.env\.local/,  // This file SHOULD contain the key
  /\.env$/,
  /verify-security\.js/,
  /\.md$/,  // Skip documentation files
];

let issuesFound = 0;
const issues = [];

/**
 * Check if path should be skipped
 */
function shouldSkip(filePath) {
  return SKIP_PATTERNS.some(pattern => pattern.test(filePath));
}

/**
 * Scan file for dangerous patterns
 */
function scanFile(filePath) {
  if (shouldSkip(filePath)) return;

  try {
    const content = fs.readFileSync(filePath, 'utf8');
    
    DANGEROUS_PATTERNS.forEach((pattern, index) => {
      const matches = content.match(pattern);
      if (matches) {
        issues.push({
          file: filePath,
          pattern: pattern.toString(),
          matches: matches.length
        });
        issuesFound += matches.length;
      }
    });
  } catch (error) {
    // Ignore read errors (binary files, etc.)
  }
}

/**
 * Recursively scan directory
 */
function scanDirectory(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    
    if (entry.isDirectory()) {
      if (!shouldSkip(fullPath)) {
        scanDirectory(fullPath);
      }
    } else {
      scanFile(fullPath);
    }
  }
}

/**
 * Verify .gitignore exists and contains required entries
 */
function verifyGitignore() {
  console.log('📋 Checking .gitignore...');
  
  const gitignorePath = path.join(__dirname, '.gitignore');
  
  if (!fs.existsSync(gitignorePath)) {
    console.log('❌ .gitignore not found!');
    return false;
  }
  
  const content = fs.readFileSync(gitignorePath, 'utf8');
  const required = ['.env.local', '.env', '*.env'];
  const missing = required.filter(entry => !content.includes(entry));
  
  if (missing.length > 0) {
    console.log(`❌ .gitignore missing entries: ${missing.join(', ')}`);
    return false;
  }
  
  console.log('✅ .gitignore configured correctly\n');
  return true;
}

/**
 * Verify .env.local exists
 */
function verifyEnvLocal() {
  console.log('📋 Checking .env.local...');
  
  const envLocalPath = path.join(__dirname, '.env.local');
  
  if (!fs.existsSync(envLocalPath)) {
    console.log('⚠️  .env.local not found (create it for local development)\n');
    return false;
  }
  
  const content = fs.readFileSync(envLocalPath, 'utf8');
  
  if (!content.includes('NEXT_PUBLIC_OPENAI_API_KEY')) {
    console.log('❌ .env.local missing NEXT_PUBLIC_OPENAI_API_KEY\n');
    return false;
  }
  
  if (content.includes('YOUR_NEW_KEY_HERE') || content.includes('your-key-here')) {
    console.log('⚠️  .env.local contains placeholder key - replace with real key\n');
    return false;
  }
  
  console.log('✅ .env.local configured correctly\n');
  return true;
}

/**
 * Verify config files don't have hardcoded keys
 */
function verifyConfigFiles() {
  console.log('📋 Checking configuration files...');
  
  const configPath = path.join(__dirname, 'lib', 'search', 'config.ts');
  
  if (!fs.existsSync(configPath)) {
    console.log('⚠️  config.ts not found\n');
    return false;
  }
  
  const content = fs.readFileSync(configPath, 'utf8');
  
  // Should NOT contain hardcoded keys
  if (content.match(/apiKey\s*[:=]\s*['"`]sk-/)) {
    console.log('❌ config.ts contains hardcoded API key!\n');
    return false;
  }
  
  // SHOULD contain environment variable references
  if (!content.includes("getEnv('NEXT_PUBLIC_OPENAI_API_KEY')")) {
    console.log('⚠️  config.ts missing environment variable reference\n');
    return false;
  }
  
  console.log('✅ Configuration files secure\n');
  return true;
}

// Run verification
console.log('Starting security scan...\n');

const gitignoreOk = verifyGitignore();
const envLocalOk = verifyEnvLocal();
const configOk = verifyConfigFiles();

console.log('📋 Scanning source code for hardcoded secrets...\n');

scanDirectory(__dirname);

// Report results
console.log('\n' + '='.repeat(60));
console.log('Security Verification Results');
console.log('='.repeat(60) + '\n');

if (issuesFound > 0) {
  console.log(`❌ Found ${issuesFound} potential security issue(s):\n`);
  
  issues.forEach(issue => {
    console.log(`  File: ${issue.file}`);
    console.log(`  Pattern: ${issue.pattern}`);
    console.log(`  Matches: ${issue.matches}\n`);
  });
  
  console.log('⚠️  CRITICAL: Remove hardcoded API keys before committing!\n');
  process.exit(1);
} else {
  console.log('✅ No hardcoded API keys found in source code!\n');
}

// Summary
const allChecksPass = gitignoreOk && configOk;

if (allChecksPass) {
  console.log('🎉 All security checks passed!\n');
  console.log('Your repository is safe to push to GitHub.\n');
  
  if (!envLocalOk) {
    console.log('⚠️  Note: Create .env.local for local development');
    console.log('    (See .env.example for template)\n');
  }
  
  process.exit(0);
} else {
  console.log('⚠️  Some security checks failed. Review issues above.\n');
  process.exit(1);
}
