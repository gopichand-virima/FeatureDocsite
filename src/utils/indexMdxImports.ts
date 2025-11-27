/**
 * Static imports for all index.mdx files
 * These files are imported at build time, not fetched at runtime
 */

// Import raw content as strings
// Note: In Figma Make, we need to fetch these as raw text
// We'll use dynamic imports with ?raw suffix if supported, otherwise fetch

/**
 * Loads index.mdx content for a specific version
 * Uses static imports to get the raw file content
 */
export async function loadIndexMdxContent(versionPath: string): Promise<string | null> {
  console.log(`📥 loadIndexMdxContent: Loading for ${versionPath}`);
  
  try {
    let content: string | null = null;
    
    switch (versionPath) {
      case '5_13':
        content = await import('/content/5_13/index.mdx?raw').then(m => m.default);
        break;
      case '6_1':
        content = await import('/content/6_1/index.mdx?raw').then(m => m.default);
        break;
      case '6_1_1':
        content = await import('/content/6_1_1/index.mdx?raw').then(m => m.default);
        break;
      case 'NG':
        // NextGen uses programmatic content
        content = null;
        break;
      default:
        console.warn(`⚠️ Unknown version path: ${versionPath}`);
        content = null;
    }
    
    if (content) {
      console.log(`✅ Loaded index.mdx for ${versionPath}, length: ${content.length}`);
    }
    
    return content;
  } catch (error) {
    console.error(`❌ Failed to import index.mdx for ${versionPath}:`, error);
    return null;
  }
}
