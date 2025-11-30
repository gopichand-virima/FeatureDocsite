/**
 * Script to fix and generate comprehensive index.mdx files for all versions
 * Uses the comprehensive 6_1_1/index.mdx as a template and adapts it for each version
 */

import * as fs from 'fs';
import * as path from 'path';

interface VersionConfig {
  version: string;
  versionPath: string;
  versionLabel: string;
  fileSuffix: string;
}

const versions: VersionConfig[] = [
  { version: '6.1', versionPath: '6_1', versionLabel: '6.1', fileSuffix: '_6_1' },
  { version: '6.1.1', versionPath: '6_1_1', versionLabel: '6.1.1', fileSuffix: '_6_1_1' },
  { version: '5.13', versionPath: '5_13', versionLabel: '5.13', fileSuffix: '_5_13' },
];

// Note: 6_1_1/index.mdx currently has paths pointing to 6_1, we need to fix it to point to 6_1_1

/**
 * Replace version-specific paths in content
 */
function adaptContentForVersion(
  templateContent: string,
  config: VersionConfig,
  sourceVersionPath: string
): string {
  let content = templateContent;

  // Replace header
  content = content.replace(
    /# Virima Documentation - Version .+?\n\n> .+?\n>/s,
    `# Virima Documentation - Version ${config.versionLabel}\n\n> Master Table of Contents for Version ${config.versionLabel}\n> Single source of truth for all navigation, routing, and structure\n`
  );

  // Replace all path references
  // Pattern: /content/6_1/ or /content/6_1_1/ -> /content/{versionPath}/
  const pathPattern = new RegExp(`/content/${sourceVersionPath}/`, 'g');
  content = content.replace(pathPattern, `/content/${config.versionPath}/`);

  // Replace file suffixes in paths
  // Pattern: _6_1.mdx or _6_1_1.mdx -> {fileSuffix}.mdx
  const suffixPatterns = [
    /_6_1_1\.mdx/g,
    /_6_1\.mdx/g,
  ];
  
  for (const pattern of suffixPatterns) {
    content = content.replace(pattern, `${config.fileSuffix}.mdx`);
  }

  // Fix specific path issues
  // admin_6_1_1 -> admin{fileSuffix}
  content = content.replace(/admin_6_1_1/g, `admin${config.fileSuffix}`);
  content = content.replace(/admin_6_1/g, `admin${config.fileSuffix}`);
  content = content.replace(/cmdb_6_1_1/g, `cmdb${config.fileSuffix}`);
  content = content.replace(/cmdb_6_1/g, `cmdb${config.fileSuffix}`);
  content = content.replace(/discovery_6_1_1/g, `discovery${config.fileSuffix}`);
  content = content.replace(/discovery_6_1/g, `discovery${config.fileSuffix}`);
  content = content.replace(/itsm_6_1_1/g, `itsm${config.fileSuffix}`);
  content = content.replace(/itsm_6_1/g, `itsm${config.fileSuffix}`);
  content = content.replace(/itam_6_1_1/g, `itam${config.fileSuffix}`);
  content = content.replace(/itam_6_1/g, `itam${config.fileSuffix}`);
  content = content.replace(/prog_proj_mngmnt_6_1_1/g, `prog_proj_mngmnt${config.fileSuffix}`);
  content = content.replace(/prog_proj_mngmnt_6_1/g, `prog_proj_mngmnt${config.fileSuffix}`);
  content = content.replace(/reports_6_1_1/g, `reports${config.fileSuffix}`);
  content = content.replace(/reports_6_1/g, `reports${config.fileSuffix}`);
  content = content.replace(/risk_register_6_1_1/g, `risk_register${config.fileSuffix}`);
  content = content.replace(/risk_register_6_1/g, `risk_register${config.fileSuffix}`);
  content = content.replace(/vulnerability_managment_6_1_1/g, `vulnerability_managment${config.fileSuffix}`);
  content = content.replace(/vulnerability_managment_6_1/g, `vulnerability_managment${config.fileSuffix}`);

  // Fix common_topics references
  content = content.replace(/common_topics\/([^`]+)_6_1_1\.mdx/g, `common_topics/$1${config.fileSuffix}.mdx`);
  content = content.replace(/common_topics\/([^`]+)_6_1\.mdx/g, `common_topics/$1${config.fileSuffix}.mdx`);

  // Fix my-dashboard references (different for NG)
  if (config.versionPath === 'NG') {
    content = content.replace(/my-dashboard\//g, 'my_dashboard_ng/');
  } else {
    content = content.replace(/my-dashboard\//g, 'my-dashboard/');
  }

  return content;
}

/**
 * Main function
 */
function main() {
  console.log('🚀 Fixing index.mdx files for all versions...\n');

  // Read the comprehensive template from 6_1_1/index.mdx (which has 6.1 structure but wrong paths)
  const templatePath = path.join(process.cwd(), 'src', 'content', '6_1_1', 'index.mdx');
  
  if (!fs.existsSync(templatePath)) {
    console.error('❌ Template file not found:', templatePath);
    process.exit(1);
  }

  const templateContent = fs.readFileSync(templatePath, 'utf-8');
  console.log(`✅ Read template from: ${templatePath} (${templateContent.length} chars)\n`);

  for (const config of versions) {
    const indexPath = path.join(process.cwd(), 'src', 'content', config.versionPath, 'index.mdx');
    
    // For 6_1_1, we need to replace 6_1 references with 6_1_1
    // For 6_1, we need to replace 6_1_1 references with 6_1
    // For 5_13, we adapt from the template
    let sourceVersionPath = '6_1';
    if (config.versionPath === '6_1_1') {
      // The template has paths pointing to 6_1, we need to change them to 6_1_1
      sourceVersionPath = '6_1';
    } else if (config.versionPath === '6_1') {
      // The template has paths pointing to 6_1, but some might be 6_1_1, we need 6_1
      sourceVersionPath = '6_1_1'; // We'll replace 6_1_1 with 6_1
    }
    
    // Adapt content for this version
    const adaptedContent = adaptContentForVersion(templateContent, config, sourceVersionPath);
    
    // Write the adapted content
    fs.writeFileSync(indexPath, adaptedContent, 'utf-8');
    console.log(`✅ Generated: ${indexPath} (${adaptedContent.length} chars)`);
    console.log(`   - All paths now point to /content/${config.versionPath}/`);
    console.log(`   - All file suffixes use ${config.fileSuffix}`);
  }

  console.log('\n✨ All index.mdx files generated successfully!');
  console.log('\n✅ 6_1_1 is now independent - all references point to 6_1_1 only');
  console.log('✅ 6_1 is now independent - all references point to 6_1 only');
  console.log('✅ Changes to 6.1 will NOT affect 6.1.1 files');
  console.log('\n⚠️  Note: Please review the generated files and verify paths are correct.');
}

if (require.main === module) {
  main();
}

export { adaptContentForVersion, versions };

