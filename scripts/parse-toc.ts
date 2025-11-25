import * as fs from 'fs';
import * as path from 'path';
import { XMLParser } from 'fast-xml-parser';

interface TocEntry {
  Title: string;
  Link?: string;
  TocEntry?: TocEntry | TocEntry[];
}

interface CatapultToc {
  TocEntry: TocEntry | TocEntry[];
}

interface ParsedTocItem {
  title: string;
  link?: string;
  children?: ParsedTocItem[];
  level: number;
  path: string[];
}

/**
 * Parse the TOC XML file and extract the hierarchy
 */
interface ParsedXmlEntry {
  '@_Title'?: string;
  '@_Link'?: string;
  TocEntry?: ParsedXmlEntry | ParsedXmlEntry[];
}

function parseTocFile(tocFilePath: string): ParsedTocItem[] {
  const xmlContent = fs.readFileSync(tocFilePath, 'utf-8');
  const parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: '@_',
    textNodeName: '#text',
    parseAttributeValue: false,
  });

  const parsed = parser.parse(xmlContent) as { CatapultToc: { TocEntry: ParsedXmlEntry | ParsedXmlEntry[] } };
  const tocEntries = Array.isArray(parsed.CatapultToc.TocEntry)
    ? parsed.CatapultToc.TocEntry
    : [parsed.CatapultToc.TocEntry];

  function processEntry(
    entry: ParsedXmlEntry,
    level: number = 0,
    parentPath: string[] = []
  ): ParsedTocItem {
    const title = entry['@_Title'] || '';
    const link = entry['@_Link'] || undefined;
    const currentPath = [...parentPath, title];
    const item: ParsedTocItem = {
      title,
      link,
      level,
      path: currentPath,
    };

    if (entry.TocEntry) {
      const children = Array.isArray(entry.TocEntry)
        ? entry.TocEntry
        : [entry.TocEntry];
      item.children = children.map((child) =>
        processEntry(child, level + 1, currentPath)
      );
    }

    return item;
  }

  return tocEntries.map((entry) => processEntry(entry, 0, []));
}

/**
 * Convert TOC link path to file path
 * Example: /Content/All-About-Virima-v6_1.htm -> All-About-Virima-v6_1
 */
function linkToFilePath(link: string): string {
  if (!link) return '';
  
  // Remove leading /Content/ or /content/
  let filePath = link.replace(/^\/[Cc]ontent\//, '');
  
  // Remove .htm extension
  filePath = filePath.replace(/\.htm$/, '');
  
  // Convert to lowercase with underscores for consistency
  // But preserve the structure
  return filePath;
}

/**
 * Convert TOC link to module/section/page structure
 * Uses the TOC hierarchy context to determine correct mapping
 */
function linkToRouteStructure(
  link: string,
  tocPath?: string[]
): {
  module: string;
  section: string;
  page: string;
} | null {
  if (!link) return null;

  const filePath = linkToFilePath(link);
  const parts = filePath.split('/').filter(Boolean);

  // Map folder names to modules based on TOC structure
  const folderToModule: Record<string, string> = {
    'All-About-Virima-v6_1': 'application-overview',
    'Admin': 'admin',
    'CMDB - Left Nav': 'cmdb',
    'Discovery': 'discovery-scan',
    'ITSM': 'itsm',
    'ITAM': 'itam',
    'Vulnerability Managment': 'vulnerability-management',
    'Self Service': 'self-service',
    'Prog-Proj Mngmnt': 'program-project-management',
    'Risk Register': 'risk-register',
    'Reports': 'reports',
    'My Dashboard': 'my-dashboard',
    'Dashboards': 'dashboards',
    'Common Topics': 'application-overview',
    'User-Specific-Functions': 'application-overview',
  };

  // Map folder names to sections
  const folderToSection: Record<string, string> = {
    'Common Topics': 'shared-functions',
    'User-Specific-Functions': 'application-overview',
    'Admin': 'admin',
    'CMDB - Left Nav': 'cmdb',
    'Discovery': 'discovery-scan',
    'ITSM': 'itsm',
    'ITAM': 'itam',
    'Vulnerability Managment': 'vulnerability-management',
    'Self Service': 'self-service',
    'Prog-Proj Mngmnt': 'program-project-management',
    'Risk Register': 'risk-register',
    'Reports': 'reports',
    'My Dashboard': 'my-dashboard',
    'Dashboards': 'dashboards',
  };

  if (parts.length === 0) return null;

  // Use TOC path context if available
  if (tocPath && tocPath.length > 0) {
    const topLevel = tocPath[0];
    let module = folderToModule[topLevel] || topLevel.toLowerCase().replace(/\s+/g, '-');
    let section = module;

    // Determine section from TOC hierarchy
    if (tocPath.length > 1) {
      const secondLevel = tocPath[1];
      // Check if we're under "Shared Functions" in the path (can be at any level)
      const sharedFunctionsIndex = tocPath.indexOf('Shared Functions');
      if (sharedFunctionsIndex >= 0) {
        section = 'shared-functions';
      } else if (secondLevel === 'User Specific Functions' || tocPath.includes('User Specific Functions')) {
        section = 'application-overview';
      } else if (topLevel === 'Dashboards') {
        if (secondLevel === 'My Dashboard') {
          section = 'my-dashboard';
        } else {
          section = 'dashboards';
        }
      } else if (topLevel === 'CMDB') {
        section = 'cmdb';
        if (secondLevel === 'Manage CMDB') {
          section = 'cmdb';
        } else if (secondLevel === 'View and Edit a CI') {
          section = 'cmdb';
        } else if (secondLevel === 'CI Details and Tabs') {
          section = 'cmdb';
        }
      } else if (topLevel === 'Discovery Scan') {
        section = 'discovery-scan';
      } else if (topLevel === 'ITSM') {
        section = 'itsm';
        if (secondLevel === 'Configuration Management') {
          section = 'itsm';
        }
      } else if (topLevel === 'ITAM') {
        section = 'itam';
      } else if (topLevel === 'Admin') {
        section = folderToSection[secondLevel] || 'admin';
        if (secondLevel === 'Organizational Details') {
          section = 'organizational-details';
        } else if (secondLevel === 'Discovery') {
          section = 'discovery';
        } else if (secondLevel === 'SACM') {
          section = 'sacm';
        } else if (secondLevel === 'Users') {
          section = 'users';
        } else if (secondLevel === 'Management Functions') {
          section = 'management-functions';
        } else if (secondLevel === 'Integrations') {
          section = 'integrations';
        } else if (secondLevel === 'Others') {
          section = 'others';
        }
      }
    }

    const fileName = parts[parts.length - 1];
    let pageId = fileName
      .replace(/[-_]/g, '-')
      .toLowerCase()
      .replace(/\.htm$/, '');
    
    // Clean up common patterns but preserve meaningful parts
    pageId = pageId.replace(/^all-about-virima-v6-1$/, 'all-about-virima');
    pageId = pageId.replace(/v6-1$/, '');
    pageId = pageId.replace(/^-+$/, ''); // Remove trailing dashes

    return {
      module,
      section,
      page: pageId,
    };
  }

  // Fallback: use file path structure
  const folder = parts[0];
  const module = folderToModule[folder] || folder.toLowerCase().replace(/\s+/g, '-');
  const section = folderToSection[folder] || module;

  if (parts.length === 1) {
    return {
      module,
      section,
      page: 'overview',
    };
  }

  const fileName = parts[parts.length - 1];
  const pageId = fileName
    .replace(/[-_]/g, '-')
    .toLowerCase()
    .replace(/\.htm$/, '');

  return {
    module,
    section,
    page: pageId,
  };
}

/**
 * Generate a comprehensive mapping from TOC structure
 */
function generateTocMapping(tocItems: ParsedTocItem[]): {
  tocHierarchy: ParsedTocItem[];
  linkToRoute: Record<string, { module: string; section: string; page: string }>;
  routeToLink: Record<string, string>;
} {
  const linkToRoute: Record<string, { module: string; section: string; page: string }> = {};
  const routeToLink: Record<string, string> = {};

  function traverse(items: ParsedTocItem[], parentPath: string[] = []) {
    for (const item of items) {
      const currentPath = [...parentPath, item.title];
      
      if (item.link) {
        const route = linkToRouteStructure(item.link, currentPath);
        if (route) {
          const routeKey = `${route.module}/${route.section}/${route.page}`;
          linkToRoute[item.link] = route;
          routeToLink[routeKey] = item.link;
        }
      }

      if (item.children) {
        traverse(item.children, currentPath);
      }
    }
  }

  traverse(tocItems);

  return {
    tocHierarchy: tocItems,
    linkToRoute,
    routeToLink,
  };
}

/**
 * Main function to parse TOC and generate mapping files
 */
function main() {
  const tocFilePath = process.argv[2] || 
    'C:\\Users\\GopichandY\\Downloads\\Source_Files\\Source_Files\\v6.1 Help Files\\Project\\TOCs\\Virima_v6_1_toc.fltoc';
  
  try {
    if (!fs.existsSync(tocFilePath)) {
      console.error(`TOC file not found: ${tocFilePath}`);
      console.error(`Please provide the correct path to the TOC file.`);
      process.exit(1);
    }
  } catch (error) {
    console.error(`Error checking TOC file: ${error}`);
    process.exit(1);
  }

  try {
    console.log(`Parsing TOC file: ${tocFilePath}`);
    const tocItems = parseTocFile(tocFilePath);
    console.log(`Parsed ${tocItems.length} top-level TOC entries`);
    const mapping = generateTocMapping(tocItems);

  // Write JSON output
  const outputDir = path.join(__dirname, '..', 'src', 'config');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const outputFile = path.join(outputDir, 'toc-mapping.json');
  fs.writeFileSync(
    outputFile,
    JSON.stringify(mapping, null, 2),
    'utf-8'
  );

  console.log(`\n✓ Generated TOC mapping: ${outputFile}`);
  console.log(`\nTotal TOC entries: ${Object.keys(mapping.linkToRoute).length}`);
  console.log(`\nSample mappings:`);
  
  // Show first 10 mappings
  const sampleLinks = Object.keys(mapping.linkToRoute).slice(0, 10);
  for (const link of sampleLinks) {
    const route = mapping.linkToRoute[link];
    console.log(`  ${link}`);
    console.log(`    → ${route.module}/${route.section}/${route.page}`);
  }

  // Generate TypeScript constants file
  const tsOutputFile = path.join(outputDir, 'toc-structure.ts');
  const tsContent = `// Auto-generated from TOC file
// DO NOT EDIT MANUALLY - Regenerate using scripts/parse-toc.ts

export interface TocRouteMapping {
  module: string;
  section: string;
  page: string;
}

export const tocLinkToRoute: Record<string, TocRouteMapping> = ${JSON.stringify(mapping.linkToRoute, null, 2)};

export const tocRouteToLink: Record<string, string> = ${JSON.stringify(mapping.routeToLink, null, 2)};

export const tocHierarchy = ${JSON.stringify(mapping.tocHierarchy, null, 2)};
`;

    fs.writeFileSync(tsOutputFile, tsContent, 'utf-8');
    console.log(`\n✓ Generated TypeScript constants: ${tsOutputFile}`);
  } catch (error) {
    console.error(`Error processing TOC file: ${error}`);
    if (error instanceof Error) {
      console.error(`Stack trace: ${error.stack}`);
    }
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

export { parseTocFile, linkToRouteStructure, generateTocMapping };

