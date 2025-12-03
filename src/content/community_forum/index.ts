// Community Forum Posts Registry
// Register all community posts with placeholder content

import { registerContent } from '../mdxContentRegistry';

/**
 * Helper function to create community forum post content
 */
function createPostContent(title: string, category: string, description: string): string {
  return `# ${title}

${description}

## Overview

This community forum post discusses ${title.toLowerCase()} in the ${category} category.

## Discussion

Community members share insights, best practices, and solutions related to ${title.toLowerCase()}.

## Key Points

- Community-driven insights and solutions
- Real-world implementation examples
- Best practices and recommendations
- Troubleshooting tips and workarounds

## Additional Resources

For more information, refer to:
- Virima Documentation
- Knowledge Base Articles
- Video Tutorials
- Support Resources

## Community Engagement

Join the discussion and share your experiences with ${title.toLowerCase()}.
`;
}

// Register community forum posts
registerContent('/content/community_forum/virima-6-2-release.mdx', createPostContent(
  'Virima 6.2 Release',
  'Releases',
  'Discussion about the latest Virima 6.2 release, new features, improvements, and community feedback.'
));

registerContent('/content/community_forum/cmdb-migration-best-practices.mdx', createPostContent(
  'CMDB Migration Best Practices',
  'CMDB',
  'Best practices and tips for migrating CMDB data, ensuring data integrity, and minimizing downtime during migration processes.'
));

registerContent('/content/community_forum/discovery-optimization-guide.mdx', createPostContent(
  'Discovery Optimization Guide',
  'Discovery',
  'Guide to optimizing discovery scans, improving performance, reducing scan times, and maximizing discovery efficiency.'
));

// Export registry for backward compatibility
export const communityPostsRegistry: Record<string, string> = {};
export const communityPostIds: string[] = [
  'virima-6-2-release',
  'cmdb-migration-best-practices',
  'discovery-optimization-guide',
];
