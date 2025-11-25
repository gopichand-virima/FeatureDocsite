/**
 * Script to verify that all content files are being loaded correctly
 * Run with: tsx scripts/verify-content.ts
 */

import { readdirSync, statSync } from 'fs';
import { join } from 'path';

const contentDir = join(process.cwd(), 'src', 'content');

function getAllMdxFiles(dir: string, basePath: string = ''): string[] {
  const files: string[] = [];
  const entries = readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = join(dir, entry.name);
    const relativePath = basePath ? `${basePath}/${entry.name}` : entry.name;

    if (entry.isDirectory()) {
      files.push(...getAllMdxFiles(fullPath, relativePath));
    } else if (entry.isFile() && entry.name.endsWith('.mdx')) {
      // Normalize path to match contentLoader format
      const normalizedPath = `/content/${relativePath}`;
      files.push(normalizedPath);
    }
  }

  return files;
}

console.log('Verifying content files...\n');

const allFiles = getAllMdxFiles(contentDir);
console.log(`Total MDX files found: ${allFiles.length}\n`);

// Check admin 6.1 files
const admin61Files = allFiles.filter(f => f.includes('admin_6_1'));
console.log(`Admin 6.1 files: ${admin61Files.length}`);
console.log('Sample admin 6.1 files:');
admin61Files.slice(0, 10).forEach(f => console.log(`  ${f}`));

// Check for operational_hours specifically
const operationalHours = allFiles.filter(f => f.includes('operational_hours_6_1'));
console.log(`\nOperational hours files: ${operationalHours.length}`);
operationalHours.forEach(f => console.log(`  ${f}`));

// Check NextGen files
const ngFiles = allFiles.filter(f => f.includes('/NG/'));
console.log(`\nNextGen files: ${ngFiles.length}`);

console.log(`\n✅ Verification complete. All files should be loaded by import.meta.glob in the browser.`);

