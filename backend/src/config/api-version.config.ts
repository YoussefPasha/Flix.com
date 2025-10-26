/**
 * API Version Configuration
 *
 * This file centralizes API version configuration to make it easier
 * to manage and update versions across the application.
 */

export const API_VERSIONS = {
  V1: 'v1',
  // V2: 'v2', // Uncomment when v2 is ready
} as const;

export const CURRENT_VERSION = API_VERSIONS.V1;
export const DEFAULT_VERSION = API_VERSIONS.V1;

/**
 * Version prefixes for different API segments
 */
export const VERSION_PREFIXES = {
  ADMIN: `${CURRENT_VERSION}/admin`,
  PUBLIC: CURRENT_VERSION,
} as const;

/**
 * Full route paths with version
 */
export const VERSIONED_ROUTES = {
  // Admin routes
  ADMIN_CONTENT: `${VERSION_PREFIXES.ADMIN}/content`,
  ADMIN_GENRES: `${VERSION_PREFIXES.ADMIN}/genres`,
  ADMIN_TAGS: `${VERSION_PREFIXES.ADMIN}/tags`,
  ADMIN_CAST_CREW: `${VERSION_PREFIXES.ADMIN}/cast-crew`,

  // Public routes
  CONTENT: `${VERSION_PREFIXES.PUBLIC}/content`,
  SEARCH: `${VERSION_PREFIXES.PUBLIC}/search`,
  REVIEWS: VERSION_PREFIXES.PUBLIC,
} as const;

/**
 * Version metadata for documentation and tracking
 */
export const VERSION_METADATA = {
  [API_VERSIONS.V1]: {
    version: '1.0.0',
    releaseDate: '2024-10-01',
    status: 'stable',
    description: 'Initial API release with core CMS functionality',
    deprecationDate: null,
    sunsetDate: null,
  },
  // Add metadata for future versions here
} as const;

/**
 * Helper function to get version info
 */
export function getVersionInfo(version: keyof typeof API_VERSIONS) {
  return VERSION_METADATA[API_VERSIONS[version]];
}

/**
 * Helper function to check if a version is deprecated
 */
export function isVersionDeprecated(
  version: keyof typeof API_VERSIONS,
): boolean {
  const info = VERSION_METADATA[API_VERSIONS[version]];
  if (!info.deprecationDate) return false;
  return new Date(info.deprecationDate) <= new Date();
}
