/**
 * Base path detection (GitHub Pages /FeatureDocsite)
 *
 * Keep this logic centralized to avoid drift between routing, content fetch,
 * and asset resolution.
 */
export function getBasePath(): string {
  // SSR / build-time: default to base path in production builds
  if (typeof window === 'undefined') {
    return import.meta.env.PROD ? '/FeatureDocsite' : '';
  }

  const { hostname, pathname } = window.location;

  // GitHub Pages host
  if (hostname.includes('github.io')) {
    return '/FeatureDocsite';
  }

  // Local testing where base path is present in the URL
  if (
    pathname === '/FeatureDocsite' ||
    pathname === '/FeatureDocsite/' ||
    pathname.startsWith('/FeatureDocsite/')
  ) {
    return '/FeatureDocsite';
  }

  // Production builds should always assume the configured base
  if (import.meta.env.PROD) {
    return '/FeatureDocsite';
  }

  return '';
}


