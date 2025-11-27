/**
 * Debug helpers for the documentation system
 * Expose these to window object for easy debugging in browser console
 */

import { loadTocForVersion, clearTocCache, clearTocCacheForVersion } from './tocLoader';
import { resolveMDXPathFromTOC } from './tocPathResolver';
import { clearContentCache, getCacheStats } from '../content/contentLoader';

/**
 * Debug helper to check if a page can be resolved
 */
export async function debugResolvePath(
  version: string,
  module: string,
  section: string,
  page: string
) {
  console.group(`🔍 Debug: Resolving path for ${version}/${module}/${section}/${page}`);
  
  try {
    const path = await resolveMDXPathFromTOC({ version, module, section, page });
    
    if (path) {
      console.log('✅ Path resolved:', path);
      console.log('   Has backticks:', path.includes('`'));
      
      // Try to fetch the file
      console.log('🔍 Testing file access...');
      const response = await fetch(path);
      
      if (response.ok) {
        const content = await response.text();
        console.log('✅ File accessible, content length:', content.length);
        console.log('   First 200 chars:', content.substring(0, 200));
      } else {
        console.error('❌ File not accessible:', response.status, response.statusText);
      }
    } else {
      console.error('❌ Path resolution failed - returned null');
    }
  } catch (error) {
    console.error('❌ Error during resolution:', error);
  }
  
  console.groupEnd();
}

/**
 * Debug helper to inspect TOC structure
 */
export async function debugTocStructure(version: string) {
  console.group(`🔍 Debug: TOC Structure for ${version}`);
  
  try {
    const toc = await loadTocForVersion(version);
    
    console.log('Version:', toc.version);
    console.log('Modules count:', toc.modules.length);
    console.log('Validation errors:', toc.validationErrors);
    console.log('Missing files:', toc.missingFiles);
    
    toc.modules.forEach(module => {
      console.group(`📁 Module: ${module.label} (${module.id})`);
      console.log('Sections:', module.sections.length);
      
      module.sections.forEach(section => {
        console.group(`📂 Section: ${section.label} (${section.id})`);
        console.log('Pages:', section.pages.length);
        
        section.pages.forEach(page => {
          console.log(`  📄 ${page.label} (${page.id})`);
          console.log(`     Path: ${page.filePath}`);
          console.log(`     Has backticks: ${page.filePath?.includes('`')}`);
          
          if (page.subPages) {
            page.subPages.forEach(subPage => {
              console.log(`    ↳ ${subPage.label} (${subPage.id})`);
              console.log(`       Path: ${subPage.filePath}`);
              console.log(`       Has backticks: ${subPage.filePath?.includes('`')}`);
            });
          }
        });
        
        console.groupEnd();
      });
      
      console.groupEnd();
    });
  } catch (error) {
    console.error('❌ Error loading TOC:', error);
  }
  
  console.groupEnd();
}

/**
 * Clear all caches
 */
export function debugClearAllCaches() {
  console.log('🧹 Clearing all caches...');
  clearTocCache();
  clearContentCache();
  console.log('✅ All caches cleared - reload the page to fetch fresh data');
}

/**
 * Get cache statistics
 */
export function debugCacheStats() {
  console.group('📊 Cache Statistics');
  
  const contentStats = getCacheStats();
  console.log('Content cache size:', contentStats.size);
  console.log('Cached paths:', contentStats.paths);
  
  console.groupEnd();
}

/**
 * Test a specific file path
 */
export async function debugTestFilePath(filePath: string) {
  console.group(`🔍 Debug: Testing file path ${filePath}`);
  
  console.log('Path:', filePath);
  console.log('Has backticks:', filePath.includes('`'));
  console.log('Path length:', filePath.length);
  
  try {
    const response = await fetch(filePath);
    
    if (response.ok) {
      const content = await response.text();
      console.log('✅ File accessible');
      console.log('Content length:', content.length);
      console.log('First 200 chars:', content.substring(0, 200));
    } else {
      console.error('❌ HTTP Error:', response.status, response.statusText);
    }
  } catch (error) {
    console.error('❌ Fetch error:', error);
  }
  
  console.groupEnd();
}

// Expose to window for browser console access
if (typeof window !== 'undefined') {
  (window as any).virimaDebug = {
    resolvePath: debugResolvePath,
    tocStructure: debugTocStructure,
    clearCaches: debugClearAllCaches,
    cacheStats: debugCacheStats,
    testFilePath: debugTestFilePath,
  };
  
  console.log('🔧 Virima Debug Tools Available:');
  console.log('  window.virimaDebug.resolvePath(version, module, section, page)');
  console.log('  window.virimaDebug.tocStructure(version)');
  console.log('  window.virimaDebug.clearCaches()');
  console.log('  window.virimaDebug.cacheStats()');
  console.log('  window.virimaDebug.testFilePath(path)');
  console.log('');
  console.log('Example: window.virimaDebug.resolvePath("6.1", "admin", "organizational-details", "members")');
}
