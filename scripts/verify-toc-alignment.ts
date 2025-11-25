import * as fs from 'fs';
import * as path from 'path';
import { glob } from 'glob';

/**
 * Verify that file paths align with TOC structure
 * This script checks if MDX files exist for all TOC entries
 */
interface TocMapping {
  tocHierarchy: any[];
  linkToRoute: Record<string, { module: string; section: string; page: string }>;
  routeToLink: Record<string, string>;
}

function loadTocMapping(): TocMapping {
  const mappingPath = path.join(__dirname, '..', 'src', 'config', 'toc-mapping.json');
  if (!fs.existsSync(mappingPath)) {
    throw new Error(`TOC mapping file not found: ${mappingPath}. Run parse:toc first.`);
  }
  return JSON.parse(fs.readFileSync(mappingPath, 'utf-8'));
}

/**
 * Convert route structure to expected file path
 */
function routeToFilePath(
  module: string,
  section: string,
  page: string,
  version: string = '6_1'
): string[] {
  const possiblePaths: string[] = [];

  // Map module to folder structure
  const moduleToFolder: Record<string, string> = {
    'application-overview': 'application_overview_6_1',
    'my-dashboard': 'my_dashboard_6_1',
    'cmdb': 'cmdb_6_1',
    'discovery-scan': 'discovery_scan_6_1',
    'itsm': 'itsm_6_1',
    'itam': 'itam_6_1',
    'vulnerability-management': 'vulnerability_management_6_1',
    'self-service': 'self_service_6_1',
    'program-project-management': 'program-project-management_6_1',
    'risk-register': 'risk_register_6_1',
    'reports': 'reports_6_1',
    'admin': 'admin_6_1',
  };

  const moduleFolder = moduleToFolder[module] || module;

  // Convert page ID to file name formats
  const pageVariations = [
    `${page.replace(/-/g, '_')}_6_1`,
    `${page.replace(/-/g, '-')}-6_1`,
    `${page}_6_1`,
    page,
  ];

  // Handle admin subfolders
  if (module === 'admin') {
    const sectionToSubfolder: Record<string, string> = {
      'organizational-details': 'admin_org_details',
      'discovery': 'admin_discovery',
      'sacm': 'admin_sacm',
      'users': 'admin_users',
      'management-functions': 'admin_change_mngmnt', // Default, may vary
      'integrations': 'admin_integrations',
      'others': 'admin_other',
    };

    const subfolder = sectionToSubfolder[section];
    if (subfolder) {
      for (const pageVar of pageVariations) {
        possiblePaths.push(
          path.join('src', 'content', version, moduleFolder, subfolder, `${pageVar}.mdx`)
        );
      }
    }
  }

  // Handle shared functions
  if (module === 'application-overview' && section === 'shared-functions') {
    for (const pageVar of pageVariations) {
      possiblePaths.push(
        path.join('src', 'content', version, moduleFolder, 'shared_functions_6_1', `${pageVar}.mdx`)
      );
    }
  }

  // Handle CMDB under ITSM/ITAM
  if ((module === 'itsm' || module === 'itam') && section === 'cmdb') {
    for (const pageVar of pageVariations) {
      possiblePaths.push(
        path.join('src', 'content', version, `${module}_6_1`, 'cmdb_6_1', `${pageVar}.mdx`)
      );
    }
  }

  // Default: direct module folder
  for (const pageVar of pageVariations) {
    possiblePaths.push(
      path.join('src', 'content', version, moduleFolder, `${pageVar}.mdx`)
    );
  }

  return possiblePaths;
}

/**
 * Find actual file for a route
 */
function findFileForRoute(
  module: string,
  section: string,
  page: string,
  contentRoot: string = path.join(__dirname, '..', 'src', 'content')
): string | null {
  const possiblePaths = routeToFilePath(module, section, page);
  
  for (const possiblePath of possiblePaths) {
    const fullPath = path.join(contentRoot, possiblePath.replace(/^src\/content\//, ''));
    if (fs.existsSync(fullPath)) {
      return fullPath;
    }
  }

  return null;
}

/**
 * Generate alignment report
 */
function generateAlignmentReport() {
  const mapping = loadTocMapping();
  const report: {
    aligned: Array<{ link: string; route: string; file: string }>;
    missing: Array<{ link: string; route: string; expectedPaths: string[] }>;
    total: number;
  } = {
    aligned: [],
    missing: [],
    total: 0,
  };

  console.log('Verifying TOC alignment with file paths...\n');

  for (const [link, route] of Object.entries(mapping.linkToRoute)) {
    report.total++;
    const file = findFileForRoute(route.module, route.section, route.page);
    
    if (file) {
      report.aligned.push({
        link,
        route: `${route.module}/${route.section}/${route.page}`,
        file: path.relative(process.cwd(), file),
      });
    } else {
      const expectedPaths = routeToFilePath(route.module, route.section, route.page);
      report.missing.push({
        link,
        route: `${route.module}/${route.section}/${route.page}`,
        expectedPaths: expectedPaths.map(p => p.replace(/^src\/content\//, '')),
      });
    }
  }

  console.log(`\n=== Alignment Report ===`);
  console.log(`Total TOC entries: ${report.total}`);
  console.log(`Aligned: ${report.aligned.length} (${((report.aligned.length / report.total) * 100).toFixed(1)}%)`);
  console.log(`Missing: ${report.missing.length} (${((report.missing.length / report.total) * 100).toFixed(1)}%)`);

  if (report.missing.length > 0) {
    console.log(`\n=== Missing Files (first 20) ===`);
    report.missing.slice(0, 20).forEach((item, idx) => {
      console.log(`\n${idx + 1}. ${item.link}`);
      console.log(`   Route: ${item.route}`);
      console.log(`   Expected paths:`);
      item.expectedPaths.slice(0, 3).forEach(p => {
        const exists = fs.existsSync(path.join(process.cwd(), 'src', 'content', p));
        console.log(`     ${exists ? '✓' : '✗'} ${p}`);
      });
    });
  }

  // Write detailed report to file
  const reportPath = path.join(__dirname, '..', 'toc-alignment-report.json');
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2), 'utf-8');
  console.log(`\n✓ Detailed report written to: ${reportPath}`);

  return report;
}

if (require.main === module) {
  generateAlignmentReport();
}

export { generateAlignmentReport, findFileForRoute, routeToFilePath };

