#!/usr/bin/env node

/**
 * Environment Variable Checker
 * Verifies that .env.local is properly configured
 */

import { readFileSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log('\n🔍 Checking Environment Configuration...\n');

// Check if .env.local exists
const envPath = join(__dirname, '.env.local');
const envExists = existsSync(envPath);

if (!envExists) {
  console.error('❌ .env.local file NOT FOUND!');
  console.log('\n💡 Create it by running:');
  console.log('   cp .env.example .env.local');
  console.log('\n   Then add your API key to the file.\n');
  process.exit(1);
}

console.log('✅ .env.local file exists');

// Read the file
const envContent = readFileSync(envPath, 'utf-8');
const lines = envContent.split('\n');

// Check for required variables
const requiredVars = ['VITE_OPENAI_API_KEY'];
let allFound = true;

console.log('\n📋 Checking required environment variables:\n');

for (const varName of requiredVars) {
  const found = lines.some(line => {
    const trimmed = line.trim();
    return trimmed.startsWith(varName) && !trimmed.startsWith('#');
  });

  if (found) {
    const value = lines
      .find(line => line.trim().startsWith(varName))
      ?.split('=')[1]
      ?.trim() || '';
    
    const masked = value.length > 20 
      ? `${value.substring(0, 10)}...${value.substring(value.length - 10)}`
      : '(value too short - check if valid)';
    
    console.log(`   ✅ ${varName}: ${masked}`);
  } else {
    console.log(`   ❌ ${varName}: NOT FOUND`);
    allFound = false;
  }
}

console.log('\n');

if (!allFound) {
  console.error('❌ Some required environment variables are missing!');
  console.log('\n💡 Add them to .env.local file:\n');
  console.log('   VITE_OPENAI_API_KEY=your_key_here\n');
  process.exit(1);
}

console.log('✅ All required environment variables are configured!\n');
console.log('📝 Next steps:');
console.log('   1. Make sure you\'ve RESTARTED your dev server');
console.log('   2. Run: npm run dev');
console.log('   3. Test voice input functionality\n');
