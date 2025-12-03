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
 * Maps navigation module IDs to TOC module IDs
 * Handles cases where navigation uses different IDs than TOC
 */
function mapModuleIdToTOC(navModuleId: string, sectionId?: string): string {
  // Special handling for My Dashboard module
  // In navigation, "my-dashboard" has sections like "getting-started", "application-overview", "dashboards"
  // In TOC, these are separate top-level modules
  if (navModuleId === 'my-dashboard' && sectionId) {
    const sectionToModuleMap: Record<string, string> = {
      'getting-started': 'getting-started',
      'application-overview': 'application-overview',
      'dashboards': 'dashboards',
    };
    const mappedModule = sectionToModuleMap[sectionId];
    if (mappedModule) {
      return mappedModule;
    }
  }
  
  const moduleMap: Record<string, string> = {
    'admin': 'admin',
    'my-dashboard': 'dashboards', // Default fallback for my-dashboard
    'application-overview': 'application-overview',
    'cmdb': 'cmdb',
    'discovery-scan': 'discovery-scan',
    'itsm': 'itsm',
    'itam': 'itam',
    'vulnerability-management': 'vulnerability-management',
    'self-service': 'self-service',
    'program-project-management': 'program-project-management',
    'risk-register': 'risk-register',
    'reports': 'reports',
  };
  
  return moduleMap[navModuleId] || navModuleId;
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
    
    // Handle case where only module is specified (empty section and page)
    // This happens when navigating to a module without a specific page
    if (module && !section && !page) {
      const moduleIndexPath = `/content/versions/${version}/${module}/index.mdx`;
      console.log('✅ Returning module index path:', moduleIndexPath);
      return moduleIndexPath;
    }
    
    // Load the TOC structure for this version
    const structure = await loadTocForVersion(version);
    
    // Map navigation module ID to TOC module ID
    const tocModuleId = mapModuleIdToTOC(module);
    
    console.log('TOC structure loaded:', {
      version: structure.version,
      modulesCount: structure.modules.length,
      moduleIds: structure.modules.map(m => m.id),
      navModuleId: module,
      navSectionId: section,
      mappedTocModuleId: tocModuleId,
    });
    
    // Use the TOC parser to resolve the file path
    const filePath = resolveFilePath(structure, tocModuleId, section, page);
    
    if (filePath) {
      console.log('✅ TOC resolved path:', filePath);
      return filePath;
    }
    
    console.warn('⚠️ Primary resolution failed. Attempting fallback resolution...');
    
    // FALLBACK: Try to find the page in ANY section of the module
    // This handles cases where navigation uses wrong section IDs
    const targetModule = structure.modules.find(m => m.id === tocModuleId);
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