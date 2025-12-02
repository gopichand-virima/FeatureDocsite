// KB Articles Registry
// Register all KB articles with placeholder content

import { registerContent } from '../mdxContentRegistry';

/**
 * Helper function to create KB article content
 */
function createKBArticleContent(title: string, module: string, category: string, description: string): string {
  return `# ${title}

${description}

## Overview

This knowledge base article provides comprehensive guidance on ${title.toLowerCase()} in the ${module} module.

## Category

${category}

## Key Topics

- Configuration and setup procedures
- Best practices and recommendations
- Common issues and troubleshooting
- Integration with other Virima modules

## Step-by-Step Guide

### Getting Started

1. Navigate to the ${module} module
2. Access the relevant section
3. Follow the configuration steps outlined below

### Configuration

Detailed configuration steps for ${title.toLowerCase()}:

- Initial setup and prerequisites
- Configuration options and settings
- Validation and testing procedures

## Best Practices

- Follow organizational policies and procedures
- Maintain accurate documentation
- Regular review and updates
- Utilize automation where applicable

## Troubleshooting

Common issues and solutions:

- Issue identification and resolution
- Diagnostic steps
- Workarounds and alternatives

## Additional Resources

For more information, refer to:
- Virima Documentation
- Video Tutorials
- Support Knowledge Base
- Community Forum

## Need Help?

If you encounter any issues:
- Contact Virima Support
- Check the Knowledge Base
- Review related articles
`;
}

// Register KB articles
registerContent('/content/kb_articles/cmdb-configuration-guide.mdx', createKBArticleContent(
  'CMDB Configuration Guide',
  'CMDB',
  'Configuration',
  'Comprehensive guide to configuring the CMDB module, including data model setup, relationship mapping, and integration configuration.'
));

registerContent('/content/kb_articles/discovery-setup-guide.mdx', createKBArticleContent(
  'Discovery Setup Guide',
  'Discovery',
  'Setup',
  'Step-by-step guide to setting up discovery scans, configuring credentials, defining scan targets, and optimizing discovery performance.'
));

registerContent('/content/kb_articles/itsm-incident-management.mdx', createKBArticleContent(
  'ITSM Incident Management',
  'ITSM',
  'Incident Management',
  'Complete guide to incident management in ITSM, including incident creation, assignment, resolution workflows, and best practices.'
));

registerContent('/content/kb_articles/vulnerability-management-setup.mdx', createKBArticleContent(
  'Vulnerability Management Setup',
  'Vulnerability Management',
  'Setup',
  'Guide to setting up vulnerability management, configuring scanners, defining vulnerability policies, and managing remediation workflows.'
));

// Export registry for backward compatibility
export const kbArticlesRegistry: Record<string, string> = {};
export const kbArticleIds: string[] = [
  'cmdb-configuration-guide',
  'discovery-setup-guide',
  'itsm-incident-management',
  'vulnerability-management-setup',
];
