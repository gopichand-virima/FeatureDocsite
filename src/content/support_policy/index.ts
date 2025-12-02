// Support Policy Registry
// Register support policy documents with placeholder content

import { registerContent } from '../mdxContentRegistry';

/**
 * Helper function to create support policy content
 */
function createPolicyContent(title: string, description: string): string {
  return `# ${title}

${description}

## Overview

This document outlines the support policies and procedures for Virima products and services.

## Support Levels

### Standard Support

- Business hours support coverage
- Response time commitments
- Issue resolution procedures
- Escalation processes

### Premium Support

- Extended support hours
- Priority response handling
- Dedicated support resources
- Enhanced service level agreements

## Support Scope

### Included Services

- Product functionality support
- Configuration assistance
- Troubleshooting guidance
- Best practices consultation

### Excluded Services

- Custom development work
- Third-party integrations
- Infrastructure management
- Training and education

## Response Times

### Critical Issues

- Initial response: Within 1 hour
- Resolution target: Within 4 hours
- Escalation: Immediate

### High Priority Issues

- Initial response: Within 4 hours
- Resolution target: Within 1 business day
- Escalation: Within 8 hours

### Medium Priority Issues

- Initial response: Within 1 business day
- Resolution target: Within 3 business days
- Escalation: As needed

### Low Priority Issues

- Initial response: Within 2 business days
- Resolution target: Within 5 business days
- Escalation: As needed

## Support Channels

- Email support
- Phone support
- Online portal
- Knowledge base access
- Community forum

## Maintenance Windows

Scheduled maintenance windows and procedures:

- Planned maintenance notifications
- Emergency maintenance procedures
- Maintenance impact assessment
- Communication protocols

## Service Level Agreements

Detailed SLAs for different support tiers:

- Availability commitments
- Performance guarantees
- Resolution timeframes
- Escalation procedures

## Contact Information

For support inquiries:

- Support email address
- Support phone numbers
- Online support portal
- Emergency contact procedures

## Additional Resources

- Support documentation
- Knowledge base articles
- Video tutorials
- Community resources
`;
}

// Register support policy
registerContent('/content/support_policy/product-support-policies.mdx', createPolicyContent(
  'Product Support Policies',
  'Comprehensive support policies covering support levels, response times, service level agreements, maintenance windows, and support procedures for all Virima products.'
));

// Export registry for backward compatibility
export const supportPolicyRegistry: Record<string, string> = {};
export const supportPolicyIds: string[] = [
  'product-support-policies',
];
