/**
 * Image Path Resolver
 * 
 * Resolves image paths in MDX content to ensure they load correctly
 * regardless of the content file location.
 */

/**
 * Gets the base path for assets (supports GitHub Pages deployment)
 */
function getBasePath(): string {
  if (typeof window === 'undefined') {
    // Server-side: check if we're in production build
    // In production, always use base path for GitHub Pages
    if (import.meta.env.PROD) {
      return '/FeatureDocsite';
    }
    return '';
  }
  const pathname = window.location.pathname;
  const hostname = window.location.hostname;
  
  // Always use base path for GitHub Pages (gopichand-virima.github.io)
  if (hostname.includes('github.io')) {
    return '/FeatureDocsite';
  }
  
  // Check if pathname starts with /FeatureDocsite (for local testing with base path)
  if (pathname.startsWith('/FeatureDocsite') || pathname === '/FeatureDocsite' || pathname === '/FeatureDocsite/') {
    return '/FeatureDocsite';
  }
  
  // In production builds, always use base path
  if (import.meta.env.PROD) {
    return '/FeatureDocsite';
  }
  
  return '';
}

/**
 * Resolves an image source path relative to the content file
 * @param src - The image source path from MDX
 * @param contentPath - The path of the MDX file containing the image
 * @returns Resolved absolute path
 */
export function resolveImagePath(src: string, contentPath?: string): string {
  // Handle external URLs
  if (src.startsWith('http://') || src.startsWith('https://')) {
    return src;
  }
  
  // Get base path once at the start
  const basePath = getBasePath();
  
  // Handle absolute paths starting with /
  if (src.startsWith('/')) {
    // For paths starting with /assets/, ensure they work with base path
    if (src.startsWith('/assets/')) {
      // Return path with base path if needed
      // Example: /assets/images/6_1/... -> /FeatureDocsite/assets/images/6_1/... (if basePath is /FeatureDocsite)
      return basePath ? `${basePath}${src}` : src;
    }
    // For other absolute paths, add base path if needed
    return basePath ? `${basePath}${src}` : src;
  }

  // If no content path provided, assume image is in public/assets
  if (!contentPath) {
    const assetsPath = `/assets/${src}`;
    return basePath ? `${basePath}${assetsPath}` : assetsPath;
  }

  // Extract version and module from content path
  // Example: /content/6_1/admin_6_1/admin_org_details/cost_center_6_1.mdx
  const contentMatch = contentPath.match(/\/content\/([^\/]+)\/(.+)\/([^\/]+)\.mdx$/);
  
  if (contentMatch) {
    const [, version, modulePath, fileName] = contentMatch;
    
    // If image path is relative, resolve it relative to the content file's directory
    if (src.startsWith('./') || src.startsWith('../')) {
      // Handle paths that go up to assets directory (e.g., ../../../../assets/images/...)
      if (src.includes('/assets/')) {
        // Extract the path after /assets/
        const assetsIndex = src.indexOf('/assets/');
        const pathAfterAssets = src.substring(assetsIndex + '/assets/'.length);
        // Return as absolute path starting with /assets/ with base path
        const assetsPath = `/assets/${pathAfterAssets}`;
        return basePath ? `${basePath}${assetsPath}` : assetsPath;
      }
      
      // Count how many ../ are in the path
      const upLevels = (src.match(/\.\.\//g) || []).length;
      const cleanSrc = src.replace(/^(\.\.\/)+/, '').replace(/^\.\//, '');
      
      // Get the directory of the content file
      let targetDir = contentPath.substring(0, contentPath.lastIndexOf('/'));
      
      // Go up the specified number of levels
      for (let i = 0; i < upLevels; i++) {
        targetDir = targetDir.substring(0, targetDir.lastIndexOf('/'));
      }
      
      return `${targetDir}/${cleanSrc}`;
    }
    
    // Default: assume image is in the same directory as the content file
    const contentDir = contentPath.substring(0, contentPath.lastIndexOf('/'));
    return `${contentDir}/${src}`;
  }

  // Fallback: try to construct path from common patterns
  if (src.includes('_6_1') || src.includes('_ng') || src.includes('_5_13') || src.includes('_6_1_1')) {
    // Image already has version suffix, use as is
    return `/content/${src}`;
  }

  // Last resort: assume it's in assets
  const assetsPath = `/assets/${src}`;
  return basePath ? `${basePath}${assetsPath}` : assetsPath;
}

/**
 * Checks if an image path is valid and accessible
 * @param src - The image source path
 * @returns Promise that resolves to true if image is accessible
 */
export async function checkImageExists(src: string): Promise<boolean> {
  try {
    const response = await fetch(src, { method: 'HEAD' });
    return response.ok;
  } catch {
    return false;
  }
}

