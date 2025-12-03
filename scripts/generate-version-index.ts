/**
 * Script to generate comprehensive index.mdx files for all versions
 * Based on the 6_1/index.mdx structure, adapted for each version
 */

import * as fs from 'fs';
import * as path from 'path';

interface VersionConfig {
  version: string;
  versionPath: string;
  versionLabel: string;
}

const versions: VersionConfig[] = [
  { version: '5.13', versionPath: '5_13', versionLabel: '5.13' },
  { version: '6.1.1', versionPath: '6_1_1', versionLabel: '6.1.1' },
  { version: 'NextGen', versionPath: 'NG', versionLabel: 'NextGen' },
];

/**
 * Convert version path to file suffix
 */
function getVersionSuffix(versionPath: string): string {
  return versionPath === 'NG' ? '_ng' : `_${versionPath}`;
}

/**
 * Generate index.mdx content for a version based on 6_1 structure
 */
function generateIndexContent(config: VersionConfig): string {
  const suffix = getVersionSuffix(config.versionPath);
  const contentPath = path.join(process.cwd(), 'src', 'content', config.versionPath);
  
  let content = `# Virima Documentation - Version ${config.versionLabel}\n\n`;
  content += `> This is the master Table of Contents file for version ${config.versionLabel}.\n`;
  content += `> Editing this file automatically updates all navigation, routing, and structure.\n\n`;
  content += `---\n\n`;

  // Check which modules exist
  const modules = [
    { name: 'Application Overview', id: 'application-overview', folder: 'application_overview' },
    { name: 'My Dashboard', id: 'my-dashboard', folder: config.versionPath === 'NG' ? 'my_dashboard_ng' : 'my-dashboard' },
    { name: 'CMDB', id: 'cmdb', folder: `cmdb${suffix}` },
    { name: 'Discovery Scan', id: 'discovery-scan', folder: `discovery${suffix}` },
    { name: 'ITSM', id: 'itsm', folder: `itsm${suffix}` },
    { name: 'ITAM', id: 'itam', folder: `itam${suffix}` },
    { name: 'Vulnerability Management', id: 'vulnerability-management', folder: `vulnerability_managment${suffix}` },
    { name: 'Program/Project Management', id: 'program-project-management', folder: `prog_proj_mngmnt${suffix}` },
    { name: 'Risk Register', id: 'risk-register', folder: `risk_register${suffix}` },
    { name: 'Reports', id: 'reports', folder: `reports${suffix}` },
    { name: 'Admin', id: 'admin', folder: `admin${suffix}` },
  ];

  // Add Self Service for NG
  if (config.versionPath === 'NG') {
    modules.splice(7, 0, { name: 'Self Service', id: 'self-service', folder: 'self_service_ng' });
  }

  for (const module of modules) {
    const modulePath = path.join(contentPath, module.folder);
    
    if (!fs.existsSync(modulePath)) {
      console.log(`⚠️  Module ${module.name} not found at ${modulePath}`);
      continue;
    }

    content += `## ${module.name}\n\n`;

    // Generate module-specific content based on structure
    if (module.id === 'admin') {
      content += generateAdminSection(config.versionPath, suffix);
    } else if (module.id === 'cmdb') {
      content += generateCMDBSection(config.versionPath, suffix);
    } else if (module.id === 'discovery-scan') {
      content += generateDiscoverySection(config.versionPath, suffix);
    } else if (module.id === 'itsm') {
      content += generateITSMSection(config.versionPath, suffix);
    } else if (module.id === 'itam') {
      content += generateITAMSection(config.versionPath, suffix);
    } else {
      // Generic module structure
      content += `### Overview\n\n`;
      const overviewFile = path.join(modulePath, `about_${module.id.replace(/-/g, '_')}${suffix}.mdx`);
      if (fs.existsSync(overviewFile)) {
        const relativePath = `/content/${config.versionPath}/${module.folder}/about_${module.id.replace(/-/g, '_')}${suffix}.mdx`;
        content += `- About ${module.name} → \`${relativePath}\`\n\n`;
      }
    }

    content += `---\n\n`;
  }

  return content;
}

function generateAdminSection(versionPath: string, suffix: string): string {
  let content = `### Overview\n\n`;
  content += `- Admin Functions → \`/content/${versionPath}/admin${suffix}/admin/admin_functions_new${suffix}.mdx\`\n\n`;
  content += `### Organizational Details\n\n`;
  content += `- About Organizational Details → \`/content/${versionPath}/admin${suffix}/admin_org_details/about_org_details${suffix}.mdx\`\n`;
  content += `- Cost Center → \`/content/${versionPath}/admin${suffix}/admin_org_details/cost_center${suffix}.mdx\`\n`;
  content += `- Departments → \`/content/${versionPath}/admin${suffix}/admin_org_details/departments${suffix}.mdx\`\n`;
  content += `- Designations → \`/content/${versionPath}/admin${suffix}/admin_org_details/designations${suffix}.mdx\`\n`;
  content += `- Holidays → \`/content/${versionPath}/admin${suffix}/admin_org_details/holidays${suffix}.mdx\`\n`;
  content += `- Locations → \`/content/${versionPath}/admin${suffix}/admin_org_details/locations${suffix}.mdx\`\n`;
  content += `- Operational Hours → \`/content/${versionPath}/admin${suffix}/admin_org_details/operational_hours${suffix}.mdx\`\n\n`;
  return content;
}

function generateCMDBSection(versionPath: string, suffix: string): string {
  let content = `### Getting Started\n\n`;
  content += `- CMDB Overview → \`/content/${versionPath}/cmdb${suffix}/cmdb_overview${suffix}.mdx\`\n`;
  content += `- Access CMDB → \`/content/${versionPath}/cmdb${suffix}/access_cmdb${suffix}.mdx\`\n\n`;
  content += `### Manage CMDB\n\n`;
  content += `- Manage CMDB → \`/content/${versionPath}/cmdb${suffix}/manage_cmdb${suffix}.mdx\`\n`;
  content += `  - New → \`/content/${versionPath}/cmdb${suffix}/new${suffix}.mdx\`\n`;
  content += `  - Delete → \`/content/${versionPath}/cmdb${suffix}/delete${suffix}.mdx\`\n`;
  content += `  - Export → \`/content/${versionPath}/cmdb${suffix}/export${suffix}.mdx\`\n\n`;
  return content;
}

function generateDiscoverySection(versionPath: string, suffix: string): string {
  let content = `### Overview\n\n`;
  content += `- About Discovery Scan → \`/content/${versionPath}/discovery${suffix}/about_discovery_scan${suffix}.mdx\`\n\n`;
  content += `### Dashboard\n\n`;
  content += `- Dashboard → \`/content/${versionPath}/discovery${suffix}/dashboard/dashboard_discovery_scan_new${suffix}.mdx\`\n\n`;
  return content;
}

function generateITSMSection(versionPath: string, suffix: string): string {
  let content = `### Overview\n\n`;
  content += `- About ITSM → \`/content/${versionPath}/itsm${suffix}/about_itsm${suffix}.mdx\`\n\n`;
  content += `### Configuration Management\n\n`;
  content += `- About Configuration Management → \`/content/${versionPath}/itsm${suffix}/config_mngmt/about_conf_mngt${suffix}.mdx\`\n\n`;
  return content;
}

function generateITAMSection(versionPath: string, suffix: string): string {
  let content = `### Overview\n\n`;
  content += `- About ITAM → \`/content/${versionPath}/itam${suffix}/about_itam${suffix}.mdx\`\n\n`;
  return content;
}

/**
 * Main function to generate index files for all versions
 */
function main() {
  console.log('🚀 Generating index.mdx files for all versions...\n');

  for (const config of versions) {
    const indexPath = path.join(process.cwd(), 'src', 'content', config.versionPath, 'index.mdx');
    const content = generateIndexContent(config);
    
    fs.writeFileSync(indexPath, content, 'utf-8');
    console.log(`✅ Generated: ${indexPath}`);
  }

  console.log('\n✨ All index.mdx files generated successfully!');
  console.log('\n⚠️  Note: These are template files. Please review and update with actual file paths.');
}

if (require.main === module) {
  main();
}

export { generateIndexContent, versions };

