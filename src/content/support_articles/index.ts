// Support Articles Registry
// Register all support articles with placeholder content

import { registerContent } from '../mdxContentRegistry';

/**
 * Helper function to create support article content
 */
function createSupportArticleContent(title: string, severity: string, type: string, description: string): string {
  return `# ${title}

${description}

## Severity

${severity}

## Type

${type}

## Overview

This support article addresses ${title.toLowerCase()} issue, providing detailed troubleshooting steps and resolution procedures.

## Symptoms

Common symptoms associated with this issue:

- Issue identification indicators
- Error messages and warnings
- Performance degradation signs
- User experience impacts

## Root Cause

Potential root causes:

- Configuration issues
- System resource constraints
- Integration problems
- Data inconsistencies

## Resolution Steps

### Step 1: Initial Diagnosis

1. Verify system status and logs
2. Check configuration settings
3. Review recent changes
4. Identify error patterns

### Step 2: Troubleshooting

Detailed troubleshooting procedures:

- Diagnostic commands and checks
- Configuration verification steps
- System resource validation
- Integration testing

### Step 3: Resolution

Resolution procedures:

- Configuration corrections
- System adjustments
- Data fixes and updates
- Service restarts if needed

### Step 4: Verification

Post-resolution verification:

- Functionality testing
- Performance validation
- User acceptance confirmation
- Monitoring setup

## Prevention

Best practices to prevent recurrence:

- Regular maintenance procedures
- Configuration best practices
- Monitoring and alerting setup
- Documentation updates

## Additional Resources

For more information:
- Related knowledge base articles
- Support documentation
- Community forum discussions
- Video tutorials

## Escalation

If the issue persists:
- Contact Virima Support
- Provide detailed error logs
- Include system configuration details
- Reference this article ID
`;
}

// Register support articles
registerContent('/content/support_articles/discovery-agent-offline.mdx', createSupportArticleContent(
  'Discovery Agent Offline',
  'High',
  'Problem',
  'Troubleshooting guide for when discovery agents go offline, including connectivity checks, credential validation, and agent restart procedures.'
));

registerContent('/content/support_articles/api-rate-limit-exceeded.mdx', createSupportArticleContent(
  'API Rate Limit Exceeded',
  'Medium',
  'Problem',
  'Resolution steps for API rate limit exceeded errors, including rate limit configuration, request optimization, and throttling strategies.'
));

registerContent('/content/support_articles/cmdb-sync-failure.mdx', createSupportArticleContent(
  'CMDB Sync Failure',
  'High',
  'Problem',
  'Guide to resolving CMDB synchronization failures, including data validation, connection troubleshooting, and sync configuration review.'
));

registerContent('/content/support_articles/license-activation-failed.mdx', createSupportArticleContent(
  'License Activation Failed',
  'Critical',
  'Problem',
  'Troubleshooting steps for license activation failures, including license key validation, server connectivity checks, and activation retry procedures.'
));

registerContent('/content/support_articles/database-performance-slow.mdx', createSupportArticleContent(
  'Database Performance Slow',
  'High',
  'Problem',
  'Performance optimization guide for slow database queries, including index optimization, query tuning, and resource allocation adjustments.'
));

registerContent('/content/support_articles/network-discovery-timeout.mdx', createSupportArticleContent(
  'Network Discovery Timeout',
  'Medium',
  'Problem',
  'Resolution steps for network discovery timeouts, including timeout configuration, network connectivity checks, and scan optimization.'
));

registerContent('/content/support_articles/sso-login-redirect-error.mdx', createSupportArticleContent(
  'SSO Login Redirect Error',
  'High',
  'Problem',
  'Troubleshooting guide for SSO login redirect errors, including SSO configuration validation, certificate checks, and redirect URL verification.'
));

registerContent('/content/support_articles/report-generation-hanging.mdx', createSupportArticleContent(
  'Report Generation Hanging',
  'Medium',
  'Problem',
  'Resolution steps for hanging report generation, including report configuration review, resource allocation checks, and report optimization.'
));

// Export registry for backward compatibility
export const supportArticlesRegistry: Record<string, string> = {};
export const supportArticleIds: string[] = [
  'discovery-agent-offline',
  'api-rate-limit-exceeded',
  'cmdb-sync-failure',
  'license-activation-failed',
  'database-performance-slow',
  'network-discovery-timeout',
  'sso-login-redirect-error',
  'report-generation-hanging',
];
