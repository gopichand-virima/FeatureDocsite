/**
 * Support Policy Module - Static MDX Imports
 * 
 * Static imports for actual MDX content (Strategy 1 - Highest Priority)
 * This ensures Support Policy content loads instantly from bundled assets
 */

// Import all Support Policy MDX files
import productSupportPolicies from '../../content/support_policy/product-support-policies.mdx?raw';
import compatibilityMatrix from '../../content/NG/compatibility_matrix/compatibility-matrix.mdx?raw';

/**
 * Support Policy MDX Content Map
 * Maps file paths to actual MDX content (static imports)
 * This is used by contentLoader Strategy 1 for instant loading
 */
export const supportPolicyMDXContent: Record<string, string> = {
  '/content/support_policy/product-support-policies.mdx': productSupportPolicies,
  '/content/NG/compatibility_matrix/compatibility-matrix.mdx': compatibilityMatrix,
};

console.log(`✅ [Support Policy MDX Content] Loaded ${Object.keys(supportPolicyMDXContent).length} files`);

