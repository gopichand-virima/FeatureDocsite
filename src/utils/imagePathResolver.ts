/**
 * Image Path Resolver
 * 
 * Resolves image paths in MDX content to ensure they load correctly
 * regardless of the content file location.
 */

/**
 * Resolves an image source path relative to the content file
 * @param src - The image source path from MDX
 * @param contentPath - The path of the MDX file containing the image
 * @returns Resolved absolute path
 */
export function resolveImagePath(src: string, contentPath?: string): string {
  // If src is already absolute (starts with / or http), return as is
  if (src.startsWith('/') || src.startsWith('http://') || src.startsWith('https://')) {
    return src;
  }

  // If no content path provided, assume image is in public/assets
  if (!contentPath) {
    return `/assets/${src}`;
  }

  // Extract version and module from content path
  // Example: /content/6_1/admin_6_1/admin_org_details/cost_center_6_1.mdx
  const contentMatch = contentPath.match(/\/content\/([^\/]+)\/(.+)\/([^\/]+)\.mdx$/);
  
  if (contentMatch) {
    const [, version, modulePath, fileName] = contentMatch;
    
    // If image path is relative, resolve it relative to the content file's directory
    if (src.startsWith('./') || src.startsWith('../')) {
      // Remove ./ or ../ prefix
      const cleanSrc = src.replace(/^\.\//, '').replace(/^\.\.\//, '');
      
      // Get the directory of the content file
      const contentDir = contentPath.substring(0, contentPath.lastIndexOf('/'));
      
      // Resolve relative path
      if (src.startsWith('../')) {
        // Go up one directory
        const parentDir = contentDir.substring(0, contentDir.lastIndexOf('/'));
        return `${parentDir}/${cleanSrc}`;
      } else {
        // Same directory
        return `${contentDir}/${cleanSrc}`;
      }
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
  return `/assets/${src}`;
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

