#!/usr/bin/env node
/**
 * Watch TOC Files - Auto-sync on changes
 * 
 * Watches for changes to index.mdx files and automatically runs sync-toc
 * 
 * Usage: npm run watch-toc
 */

import { watch, existsSync } from 'fs';
import { exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';
import { fileURLToPath } from 'url';

const execAsync = promisify(exec);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const VERSIONS = ['6_1', '6_1_1', '5_13', 'NG'];
const CONTENT_DIR = path.join(__dirname, '../src/content');

let syncTimeout = null;
const DEBOUNCE_MS = 1000; // Wait 1 second after last change before syncing

/**
 * Run sync script
 */
async function runSync() {
  console.log('\n🔄 Detected change in index.mdx, syncing...\n');
  
  try {
    const { stdout, stderr } = await execAsync('node scripts/sync-toc-from-index.mjs');
    console.log(stdout);
    if (stderr) console.error(stderr);
  } catch (error) {
    console.error('❌ Error running sync:', error.message);
  }
}

/**
 * Watch a specific index.mdx file
 */
function watchIndexFile(versionDir) {
  const indexPath = path.join(CONTENT_DIR, versionDir, 'index.mdx');
  
  if (!existsSync(indexPath)) {
    console.log(`⚠️  ${indexPath} not found, skipping...`);
    return;
  }

  console.log(`👀 Watching: ${indexPath}`);

  watch(indexPath, { persistent: true }, (eventType) => {
    if (eventType === 'change') {
      console.log(`\n📝 Change detected in ${versionDir}/index.mdx`);
      
      // Debounce: clear existing timeout and set new one
      if (syncTimeout) {
        clearTimeout(syncTimeout);
      }
      
      syncTimeout = setTimeout(() => {
        runSync();
      }, DEBOUNCE_MS);
    }
  });
}

/**
 * Main execution
 */
function main() {
  console.log('═══════════════════════════════════════════════════════════');
  console.log('  TOC Watcher - Auto-sync on index.mdx changes');
  console.log('═══════════════════════════════════════════════════════════\n');
  console.log('👀 Watching for changes to index.mdx files...\n');

  // Watch all version index files
  VERSIONS.forEach(version => {
    watchIndexFile(version);
  });

  console.log('\n✅ Watcher started. Press Ctrl+C to stop.\n');
  console.log('💡 Tip: Edit any index.mdx file and changes will auto-sync!\n');
}

main();

