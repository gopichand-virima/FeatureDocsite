/**
 * Version-Aware Image-to-Content Mapping System
 * 
 * Automatically scans all .mdx content files, detects image references,
 * and maps them to the correct version-specific image paths.
 */

import * as fs from 'fs';
import * as path from 'path';

interface ImageReference {
  originalPath: string;
  resolvedPath: string;
  exists: boolean;
  lineNumber: number;
  context: string;
}

interface MDXFileReport {
  filePath: string;
  version: string;
  imageReferences: ImageReference[];
  totalImages: number;
  validImages: number;
  missingImages: number;
}

interface MappingReport {
  files: MDXFileReport[];
  summary: {
    totalFiles: number;
    totalImageReferences: number;
    totalValidImages: number;
    totalMissingImages: number;
    versions: Record<string, { files: number; images: number; missing: number }>;
  };
}

const CONTENT_DIR = path.join(process.cwd(), 'src', 'content');
const ASSETS_DIR = path.join(process.cwd(), 'src', 'assets', 'images');
const VERSIONS = ['NG', '6_1', '6_1_1', '5_13'];

/**
 * Detect version from MDX file path
 */
function detectVersion(filePath: string): string | null {
  const normalizedPath = filePath.replace(/\\/g, '/');
  
  for (const version of VERSIONS) {
    if (normalizedPath.includes(`/${version}/`) || normalizedPath.startsWith(`${version}/`)) {
      return version;
    }
  }
  
  return null;
}

/**
 * Extract image references from MDX content
 * Supports:
 * - Markdown: ![alt](path)
 * - HTML: <img src="path">
 * - Relative paths: ../Resources/Images/...
 */
function extractImageReferences(content: string): Array<{ path: string; lineNumber: number; context: string }> {
  const references: Array<{ path: string; lineNumber: number; context: string }> = [];
  const lines = content.split('\n');
  
  // Markdown image pattern: ![alt](path) or ![](path)
  const markdownPattern = /!\[([^\]]*)\]\(([^)]+)\)/g;
  
  // HTML img pattern: <img src="path" ...> or <img src='path' ...>
  const htmlPattern = /<img[^>]+src=["']([^"']+)["'][^>]*>/gi;
  
  // Relative path pattern: ../Resources/Images/...
  const relativePattern = /\.\.\/Resources\/Images\/([^\s\)"']+)/g;
  
  lines.forEach((line, index) => {
    const lineNumber = index + 1;
    
    // Match markdown images
    let match;
    while ((match = markdownPattern.exec(line)) !== null) {
      const imagePath = match[2].trim();
      if (imagePath && !imagePath.startsWith('http') && !imagePath.startsWith('data:')) {
        references.push({
          path: imagePath,
          lineNumber,
          context: line.trim().substring(0, 100)
        });
      }
    }
    
    // Reset regex
    markdownPattern.lastIndex = 0;
    
    // Match HTML images
    while ((match = htmlPattern.exec(line)) !== null) {
      const imagePath = match[1].trim();
      if (imagePath && !imagePath.startsWith('http') && !imagePath.startsWith('data:')) {
        references.push({
          path: imagePath,
          lineNumber,
          context: line.trim().substring(0, 100)
        });
      }
    }
    
    // Reset regex
    htmlPattern.lastIndex = 0;
    
    // Match relative paths
    while ((match = relativePattern.exec(line)) !== null) {
      const imagePath = match[1].trim();
      references.push({
        path: imagePath,
        lineNumber,
        context: line.trim().substring(0, 100)
      });
    }
    
    // Reset regex
    relativePattern.lastIndex = 0;
  });
  
  return references;
}

/**
 * Resolve image path to version-specific asset path
 */
function resolveImagePath(imagePath: string, version: string, mdxFilePath: string): string {
  // Remove query strings and fragments
  const cleanPath = imagePath.split('?')[0].split('#')[0];
  
  // If already absolute or version-specific, return as-is
  if (cleanPath.startsWith('/assets/') || cleanPath.startsWith('/images/')) {
    return cleanPath;
  }
  
  // Handle relative paths like ../Resources/Images/...
  if (cleanPath.startsWith('../Resources/Images/')) {
    const imageName = path.basename(cleanPath);
    return `/images/${version}/${imageName}`;
  }
  
  // Handle relative paths from MDX file location
  if (cleanPath.startsWith('./') || cleanPath.startsWith('../')) {
    const mdxDir = path.dirname(mdxFilePath);
    const resolved = path.resolve(mdxDir, cleanPath);
    const relativeToAssets = path.relative(ASSETS_DIR, resolved);
    
    // If resolved to assets directory, use version-specific path
    if (relativeToAssets && !relativeToAssets.startsWith('..')) {
      const imageName = path.basename(cleanPath);
      return `/images/${version}/${imageName}`;
    }
  }
  
  // Extract filename from path
  const imageName = path.basename(cleanPath);
  
  // Map to version-specific path
  return `/images/${version}/${imageName}`;
}

/**
 * Check if image file exists
 */
function imageExists(resolvedPath: string): boolean {
  // Convert web path to filesystem path
  const fsPath = resolvedPath
    .replace(/^\/images\//, '')
    .replace(/^\/assets\/images\//, '');
  
  const fullPath = path.join(ASSETS_DIR, fsPath);
  
  // Check exact path
  if (fs.existsSync(fullPath)) {
    return true;
  }
  
  // Check with different case
  const dir = path.dirname(fullPath);
  const filename = path.basename(fullPath);
  
  if (fs.existsSync(dir)) {
    const files = fs.readdirSync(dir);
    const found = files.find(f => f.toLowerCase() === filename.toLowerCase());
    if (found) {
      return true;
    }
  }
  
  return false;
}

/**
 * Scan a single MDX file
 */
function scanMDXFile(filePath: string): MDXFileReport | null {
  const version = detectVersion(filePath);
  
  if (!version) {
    return null; // Skip files without version context
  }
  
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    const imageRefs = extractImageReferences(content);
    
    const imageReferences: ImageReference[] = imageRefs.map(ref => {
      const resolvedPath = resolveImagePath(ref.path, version, filePath);
      const exists = imageExists(resolvedPath);
      
      return {
        originalPath: ref.path,
        resolvedPath,
        exists,
        lineNumber: ref.lineNumber,
        context: ref.context
      };
    });
    
    const validImages = imageReferences.filter(ref => ref.exists).length;
    const missingImages = imageReferences.filter(ref => !ref.exists).length;
    
    return {
      filePath: path.relative(process.cwd(), filePath),
      version,
      imageReferences,
      totalImages: imageReferences.length,
      validImages,
      missingImages
    };
  } catch (error) {
    console.error(`Error scanning ${filePath}:`, error);
    return null;
  }
}

/**
 * Scan all MDX files recursively
 */
function scanAllMDXFiles(): MDXFileReport[] {
  const reports: MDXFileReport[] = [];
  
  function scanDirectory(dir: string) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      
      if (entry.isDirectory()) {
        scanDirectory(fullPath);
      } else if (entry.isFile() && entry.name.endsWith('.mdx')) {
        const report = scanMDXFile(fullPath);
        if (report) {
          reports.push(report);
        }
      }
    }
  }
  
  scanDirectory(CONTENT_DIR);
  return reports;
}

/**
 * Generate mapping report
 */
function generateReport(reports: MDXFileReport[]): MappingReport {
  const summary = {
    totalFiles: reports.length,
    totalImageReferences: 0,
    totalValidImages: 0,
    totalMissingImages: 0,
    versions: {} as Record<string, { files: number; images: number; missing: number }>
  };
  
  reports.forEach(report => {
    summary.totalImageReferences += report.totalImages;
    summary.totalValidImages += report.validImages;
    summary.totalMissingImages += report.missingImages;
    
    if (!summary.versions[report.version]) {
      summary.versions[report.version] = { files: 0, images: 0, missing: 0 };
    }
    
    summary.versions[report.version].files++;
    summary.versions[report.version].images += report.totalImages;
    summary.versions[report.version].missing += report.missingImages;
  });
  
  return {
    files: reports,
    summary
  };
}

/**
 * Format report for console output
 */
function formatReport(report: MappingReport): string {
  let output = '\n📊 IMAGE MAPPING REPORT\n';
  output += '═'.repeat(80) + '\n\n';
  
  // Summary
  output += '📈 SUMMARY\n';
  output += `   Total MDX Files Scanned: ${report.summary.totalFiles}\n`;
  output += `   Total Image References: ${report.summary.totalImageReferences}\n`;
  output += `   ✅ Valid Images: ${report.summary.totalValidImages}\n`;
  output += `   ❌ Missing Images: ${report.summary.totalMissingImages}\n\n`;
  
  // Version breakdown
  output += '📦 VERSION BREAKDOWN\n';
  for (const [version, stats] of Object.entries(report.summary.versions)) {
    output += `   ${version}:\n`;
    output += `      Files: ${stats.files}\n`;
    output += `      Images: ${stats.images}\n`;
    output += `      Missing: ${stats.missing}\n`;
  }
  output += '\n';
  
  // Files with missing images
  const filesWithMissing = report.files.filter(f => f.missingImages > 0);
  if (filesWithMissing.length > 0) {
    output += '⚠️  FILES WITH MISSING IMAGES\n';
    output += '─'.repeat(80) + '\n';
    
    filesWithMissing.forEach(file => {
      output += `\n📄 ${file.filePath}\n`;
      output += `   Version: ${file.version}\n`;
      output += `   Total Images: ${file.totalImages} (✅ ${file.validImages} valid, ❌ ${file.missingImages} missing)\n`;
      
      file.imageReferences
        .filter(ref => !ref.exists)
        .forEach(ref => {
          output += `   ❌ Line ${ref.lineNumber}: ${ref.originalPath}\n`;
          output += `      Expected: ${ref.resolvedPath}\n`;
        });
    });
    output += '\n';
  }
  
  // Sample of valid mappings
  const filesWithImages = report.files.filter(f => f.totalImages > 0).slice(0, 5);
  if (filesWithImages.length > 0) {
    output += '✅ SAMPLE VALID MAPPINGS\n';
    output += '─'.repeat(80) + '\n';
    
    filesWithImages.forEach(file => {
      output += `\n📄 ${file.filePath}\n`;
      output += `   Version: ${file.version}\n`;
      
      file.imageReferences
        .filter(ref => ref.exists)
        .slice(0, 3)
        .forEach(ref => {
          output += `   ✅ ${ref.originalPath} → ${ref.resolvedPath}\n`;
        });
    });
    output += '\n';
  }
  
  output += '═'.repeat(80) + '\n';
  
  return output;
}

/**
 * Main execution
 */
function main() {
  console.log('🔍 Starting image mapping scan...\n');
  console.log(`Content Directory: ${CONTENT_DIR}`);
  console.log(`Assets Directory: ${ASSETS_DIR}\n`);
  
  const reports = scanAllMDXFiles();
  const mappingReport = generateReport(reports);
  
  const reportText = formatReport(mappingReport);
  console.log(reportText);
  
  // Save report to file
  const reportPath = path.join(process.cwd(), 'IMAGE_MAPPING_REPORT.txt');
  fs.writeFileSync(reportPath, reportText, 'utf-8');
  console.log(`\n📝 Full report saved to: ${reportPath}`);
  
  // Save JSON report
  const jsonPath = path.join(process.cwd(), 'IMAGE_MAPPING_REPORT.json');
  fs.writeFileSync(jsonPath, JSON.stringify(mappingReport, null, 2), 'utf-8');
  console.log(`📄 JSON report saved to: ${jsonPath}`);
}

// Run if executed directly
if (require.main === module) {
  main();
}

export { scanMDXFile, scanAllMDXFiles, generateReport, formatReport };

