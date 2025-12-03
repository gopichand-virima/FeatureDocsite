/**
 * TOC Structure Validation Script
 * Validates the navigationData.ts structure for correctness
 */

import {
  adminSections,
  cmdbSections,
  itsmSections,
  itamSections,
  discoveryScanSections,
  getSectionsForModule,
} from '../data/navigationData';

interface ValidationResult {
  passed: boolean;
  errors: string[];
  warnings: string[];
  stats: {
    totalSections: number;
    totalPages: number;
    maxDepth: number;
  };
}

function validateStructure(): ValidationResult {
  const result: ValidationResult = {
    passed: true,
    errors: [],
    warnings: [],
    stats: {
      totalSections: 0,
      totalPages: 0,
      maxDepth: 0,
    },
  };

  // Track IDs for duplicates
  const allIds = new Set<string>();
  
  // Validate Admin structure
  console.log('\n📋 Validating Admin Module Structure...\n');
  
  const adminExpectedSections = [
    'organizational-details',
    'discovery',
    'sacm',
    'users',
    'management-functions',
    'integrations',
    'others',
  ];
  
  const adminSection = adminSections[0];
  if (!adminSection || !adminSection.pages) {
    result.errors.push('❌ Admin section not found or has no pages');
    result.passed = false;
    return result;
  }

  const adminTopLevelIds = adminSection.pages.map((p: any) => p.id);
  
  // Check if all expected sections exist
  adminExpectedSections.forEach(expectedId => {
    if (!adminTopLevelIds.includes(expectedId)) {
      result.errors.push(`❌ Admin missing section: ${expectedId}`);
      result.passed = false;
    } else {
      console.log(`✅ Admin section found: ${expectedId}`);
    }
  });

  // Check for extra sections not in expected list
  adminTopLevelIds.forEach((id: string) => {
    if (!adminExpectedSections.includes(id)) {
      result.warnings.push(`⚠️  Admin has unexpected section: ${id}`);
    }
  });

  // Validate specific subsections
  const discoverySection = adminSection.pages.find((p: any) => p.id === 'discovery');
  if (discoverySection && discoverySection.subPages) {
    const discoveryItems = [
      'application-map',
      'client',
      'correlation',
      'credentials',
      'custom-patterns',
      'download-application',
      'import-templates',
      'ignore-adm-process',
      'ignore-process',
      'major-software',
      'monitoring-profile',
      'port-configuration',
      'probe-workflow',
      'probes',
      'scan-configuration',
      'sensors',
      'graphical-workflows',
    ];
    
    const discoverySubIds = discoverySection.subPages.map((p: any) => p.id);
    discoveryItems.forEach(item => {
      if (!discoverySubIds.includes(item)) {
        result.errors.push(`❌ Admin > Discovery missing: ${item}`);
        result.passed = false;
      }
    });
    
    console.log(`✅ Admin > Discovery has ${discoverySubIds.length} items`);
  }

  // Validate CMDB structure
  console.log('\n📋 Validating CMDB Module Structure...\n');
  
  const cmdbSection = cmdbSections[0];
  if (cmdbSection && cmdbSection.pages) {
    const cmdbTopLevel = cmdbSection.pages.map((p: any) => p.id);
    
    // Check for siblings: view-and-edit-ci and ci-details-and-tabs should be siblings
    const hasViewAndEdit = cmdbTopLevel.includes('view-and-edit-ci');
    const hasCiDetails = cmdbTopLevel.includes('ci-details-and-tabs');
    
    if (hasViewAndEdit && hasCiDetails) {
      console.log('✅ CMDB: "View and Edit a CI" and "CI Details and Tabs" are siblings (CORRECT)');
    } else {
      result.errors.push('❌ CMDB: "View and Edit a CI" and "CI Details and Tabs" should be siblings');
      result.passed = false;
    }
  }

  // Validate ITSM structure
  console.log('\n📋 Validating ITSM Module Structure...\n');
  
  const itsmSection = itsmSections[0];
  if (itsmSection && itsmSection.pages) {
    const hasConfigManagement = itsmSection.pages.some((p: any) => p.id === 'configuration-management');
    
    if (hasConfigManagement) {
      console.log('✅ ITSM has Configuration Management wrapper');
      
      const configMgmt = itsmSection.pages.find((p: any) => p.id === 'configuration-management');
      if (configMgmt && configMgmt.subPages) {
        const hasCMDB = configMgmt.subPages.some((p: any) => p.id === 'cmdb');
        if (hasCMDB) {
          console.log('✅ ITSM > Configuration Management > CMDB structure correct');
        } else {
          result.errors.push('❌ ITSM > Configuration Management missing CMDB');
          result.passed = false;
        }
      }
    } else {
      result.errors.push('❌ ITSM missing Configuration Management wrapper');
      result.passed = false;
    }
  }

  // Validate ITAM structure (should mirror ITSM)
  console.log('\n📋 Validating ITAM Module Structure...\n');
  
  const itamSection = itamSections[0];
  if (itamSection && itamSection.pages) {
    const hasConfigManagement = itamSection.pages.some((p: any) => p.id === 'configuration-management');
    
    if (hasConfigManagement) {
      console.log('✅ ITAM has Configuration Management wrapper');
    } else {
      result.errors.push('❌ ITAM missing Configuration Management wrapper');
      result.passed = false;
    }
    
    // Check for ITAM-specific sections
    const itamExpected = [
      'configuration-management',
      'hardware-assets',
      'software-asset-management',
      'contract-management',
      'vendor-management',
      'procurement',
      'financial-management',
    ];
    
    const itamTopLevel = itamSection.pages.map((p: any) => p.id);
    itamExpected.forEach(item => {
      if (!itamTopLevel.includes(item)) {
        result.errors.push(`❌ ITAM missing section: ${item}`);
        result.passed = false;
      } else {
        console.log(`✅ ITAM section found: ${item}`);
      }
    });
  }

  // Check for duplicate IDs
  console.log('\n📋 Checking for duplicate IDs...\n');
  
  function collectIds(pages: any[], prefix = ''): void {
    pages.forEach((page: any) => {
      const fullId = prefix ? `${prefix}.${page.id}` : page.id;
      
      if (allIds.has(fullId)) {
        result.warnings.push(`⚠️  Duplicate ID found: ${fullId}`);
      } else {
        allIds.add(fullId);
        result.stats.totalPages++;
      }
      
      if (page.subPages) {
        collectIds(page.subPages, fullId);
      }
    });
  }

  [adminSections, cmdbSections, itsmSections, itamSections, discoveryScanSections].forEach(sections => {
    sections.forEach(section => {
      result.stats.totalSections++;
      if (section.pages) {
        collectIds(section.pages, section.id);
      }
    });
  });

  console.log(`\n📊 Total unique pages/items: ${result.stats.totalPages}`);
  console.log(`📊 Total sections: ${result.stats.totalSections}`);

  return result;
}

// Run validation
const result = validateStructure();

console.log('\n' + '='.repeat(60));
console.log('VALIDATION SUMMARY');
console.log('='.repeat(60) + '\n');

if (result.errors.length > 0) {
  console.log('❌ ERRORS:\n');
  result.errors.forEach(err => console.log(err));
  console.log('');
}

if (result.warnings.length > 0) {
  console.log('⚠️  WARNINGS:\n');
  result.warnings.forEach(warn => console.log(warn));
  console.log('');
}

if (result.passed && result.errors.length === 0) {
  console.log('✅ ALL VALIDATIONS PASSED!\n');
  console.log('📊 Statistics:');
  console.log(`   • Total Sections: ${result.stats.totalSections}`);
  console.log(`   • Total Pages: ${result.stats.totalPages}`);
  console.log('');
} else {
  console.log(`❌ VALIDATION FAILED with ${result.errors.length} error(s)\n`);
  process.exit(1);
}

export { validateStructure };
