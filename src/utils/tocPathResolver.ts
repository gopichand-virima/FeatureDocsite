/**
 * TOC-Driven MDX Path Resolver
 * 
 * This resolver uses the TOC structure from index.mdx files
 * to resolve file paths, replacing the hardcoded mdxPathResolver.
 */

import { loadTocForVersion } from './tocLoader';
import { resolveFilePath } from './tocParser';

interface PathResolverParams {
  version: string;
  module: string;
  section: string;
  page: string;
}

/**
 * Resolve the path to the MDX file using TOC structure
 * This is the new TOC-driven approach
 */
export async function resolveMDXPathFromTOC({
  version,
  module,
  section,
  page,
}: PathResolverParams): Promise<string | null> {
  try {
    console.log('resolveMDXPathFromTOC called with:', { version, module, section, page });
    
    // Load the TOC structure for this version
    const structure = await loadTocForVersion(version);
    
    console.log('TOC structure loaded:', {
      version: structure.version,
      modulesCount: structure.modules.length,
      moduleIds: structure.modules.map(m => m.id),
    });
    
    // Use the TOC parser to resolve the file path
    const filePath = resolveFilePath(structure, module, section, page);
    
    if (filePath) {
      console.log('✅ TOC resolved path:', filePath);
      return filePath;
    }
    
    console.warn('⚠️ Primary resolution failed. Attempting fallback resolution...');
    
    // FALLBACK: Try to find the page in ANY section of the module
    // This handles cases where navigation uses wrong section IDs
    const targetModule = structure.modules.find(m => m.id === module);
    if (targetModule) {
      console.log('Found module:', module, 'with', targetModule.sections.length, 'sections');
      
      for (const sec of targetModule.sections) {
        console.log('Checking section:', sec.id, 'for page:', page);
        
        const findPageInSection = (pages: any[], targetPageId: string): string | null => {
          for (const p of pages) {
            if (p.id === targetPageId) {
              console.log('✅ FOUND page in section:', sec.id, '- File:', p.filePath);
              return p.filePath;
            }
            if (p.subPages) {
              const found = findPageInSection(p.subPages, targetPageId);
              if (found) return found;
            }
          }
          return null;
        };
        
        const foundPath = findPageInSection(sec.pages, page);
        if (foundPath) {
          console.log('✅ Fallback resolution successful! Path:', foundPath);
          return foundPath;
        }
      }
    } else {
      console.error('❌ Module not found in TOC:', module);
      console.log('Available modules:', structure.modules.map(m => m.id));
    }
    
    console.error('❌ No file path found in TOC for:', { module, section, page });
    return null;
  } catch (error) {
    console.error('❌ Error resolving MDX path from TOC:', error);
    return null;
  }
}

/**
 * Synchronous version that attempts to use cached TOC data
 * Falls back to null if TOC is not loaded
 */
export function resolveMDXPathFromTOCSync({
  version,
  module,
  section,
  page,
}: PathResolverParams): string | null {
  // This will be implemented if we need synchronous resolution
  // For now, components should use the async version
  console.warn('Synchronous TOC path resolution not yet implemented');
  return null;
}