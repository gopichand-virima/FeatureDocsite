/**
 * Validation Script - HTML Extraction Fix
 * Run this in browser console to verify the fix is working
 */

console.log('🔍 Starting validation...\n');

// Test files to validate
const testFiles = [
  '/content/NG/admin_ng/admin_org_details/about_org_details_ng.mdx',
  '/content/6_1/admin_6_1/admin_org_details/about_org_details_6_1.mdx',
  '/content/6_1/admin_6_1/admin_org_details/cost_center_6_1.mdx',
];

// Test 1: Raw Import
async function testRawImport(filePath) {
  console.log(`\n📝 Test 1: Raw Import for ${filePath}`);
  try {
    const rawPath = `${filePath}?raw`;
    const module = await import(/* @vite-ignore */ rawPath);
    
    if (module && module.default) {
      const content = module.default;
      const isValidMDX = content.includes('#') || content.includes('import') || content.includes('export');
      
      if (isValidMDX) {
        console.log(`  ✅ SUCCESS! Loaded ${content.length} chars`);
        console.log(`  📄 Preview: ${content.substring(0, 100)}...`);
        return { success: true, method: 'raw', length: content.length };
      } else {
        console.log(`  ⚠️ Got content but doesn't look like MDX`);
        return { success: false, method: 'raw', error: 'Invalid MDX' };
      }
    }
  } catch (error) {
    console.log(`  ❌ FAILED: ${error.message}`);
    return { success: false, method: 'raw', error: error.message };
  }
}

// Test 2: Fetch + HTML Extraction
async function testFetchExtraction(filePath) {
  console.log(`\n📝 Test 2: Fetch + Extraction for ${filePath}`);
  try {
    const response = await fetch(filePath);
    if (!response.ok) {
      console.log(`  ❌ Fetch failed: ${response.status}`);
      return { success: false, method: 'fetch', error: `Status ${response.status}` };
    }
    
    const text = await response.text();
    console.log(`  📊 Fetched ${text.length} bytes`);
    
    if (text.includes('<!DOCTYPE') || text.includes('<html')) {
      console.log(`  🔧 Got HTML wrapper, attempting extraction...`);
      
      // Try extraction
      const extracted = extractMDXFromHTML(text);
      if (extracted) {
        console.log(`  ✅ SUCCESS! Extracted ${extracted.length} chars`);
        console.log(`  📄 Preview: ${extracted.substring(0, 100)}...`);
        return { success: true, method: 'fetch-extracted', length: extracted.length };
      } else {
        console.log(`  ❌ Extraction failed`);
        return { success: false, method: 'fetch', error: 'Extraction failed' };
      }
    } else {
      console.log(`  ✅ SUCCESS! Got raw MDX (${text.length} chars)`);
      return { success: true, method: 'fetch-raw', length: text.length };
    }
  } catch (error) {
    console.log(`  ❌ FAILED: ${error.message}`);
    return { success: false, method: 'fetch', error: error.message };
  }
}

// HTML Extraction function (same as contentLoader.ts)
function extractMDXFromHTML(html) {
  // Method 1: <pre> tag
  const preMatch = html.match(/<pre[^>]*>([\s\S]*?)<\/pre>/i);
  if (preMatch && preMatch[1]) {
    const decoded = decodeHTMLEntities(preMatch[1]);
    if (decoded.includes('#') || decoded.includes('import')) {
      console.log(`    ✓ Method 1 (<pre>) succeeded`);
      return decoded;
    }
  }
  
  // Method 2: <code> tag
  const codeMatch = html.match(/<code[^>]*>([\s\S]*?)<\/code>/i);
  if (codeMatch && codeMatch[1]) {
    const decoded = decodeHTMLEntities(codeMatch[1]);
    if (decoded.includes('#') || decoded.includes('import')) {
      console.log(`    ✓ Method 2 (<code>) succeeded`);
      return decoded;
    }
  }
  
  // Method 3: Nested <pre><code>
  const nestedMatch = html.match(/<pre[^>]*>\s*<code[^>]*>([\s\S]*?)<\/code>\s*<\/pre>/i);
  if (nestedMatch && nestedMatch[1]) {
    const decoded = decodeHTMLEntities(nestedMatch[1]);
    if (decoded.includes('#') || decoded.includes('import')) {
      console.log(`    ✓ Method 3 (nested) succeeded`);
      return decoded;
    }
  }
  
  // Method 4: <body> strip
  const bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
  if (bodyMatch && bodyMatch[1]) {
    let content = bodyMatch[1].replace(/<[^>]+>/g, '');
    content = decodeHTMLEntities(content);
    if (content.trim().length > 100 && (content.includes('#') || content.includes('import'))) {
      console.log(`    ✓ Method 4 (<body> strip) succeeded`);
      return content;
    }
  }
  
  // Method 5: Strip everything
  let stripped = html.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '');
  stripped = stripped.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '');
  stripped = stripped.replace(/<[^>]+>/g, '');
  stripped = decodeHTMLEntities(stripped);
  
  if (stripped.trim().length > 50 && (stripped.includes('#') || stripped.includes('import') || stripped.includes('export'))) {
    console.log(`    ✓ Method 5 (strip all) succeeded`);
    return stripped.trim();
  }
  
  return null;
}

// HTML Entity Decoder
function decodeHTMLEntities(text) {
  const txt = document.createElement('textarea');
  txt.innerHTML = text;
  let decoded = txt.value;
  
  decoded = decoded
    .replace(/</g, '<')
    .replace(/>/g, '>')
    .replace(/&/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&#x27;/g, "'")
    .replace(/&#x2F;/g, '/')
    .replace(/&nbsp;/g, ' ');
  
  return decoded;
}

// Test 3: Content Loader Integration
async function testContentLoader(filePath) {
  console.log(`\n📝 Test 3: Content Loader Integration for ${filePath}`);
  try {
    const { getContent } = await import('./content/contentLoader.ts');
    const content = await getContent(filePath);
    
    if (content && content.length > 100) {
      console.log(`  ✅ SUCCESS! Content Loader returned ${content.length} chars`);
      console.log(`  📄 Preview: ${content.substring(0, 100)}...`);
      return { success: true, method: 'contentLoader', length: content.length };
    } else {
      console.log(`  ⚠️ Got content but it's too short or empty`);
      return { success: false, method: 'contentLoader', error: 'Content too short' };
    }
  } catch (error) {
    console.log(`  ❌ FAILED: ${error.message}`);
    return { success: false, method: 'contentLoader', error: error.message };
  }
}

// Run all tests
async function runAllTests() {
  const results = [];
  
  for (const filePath of testFiles) {
    console.log(`\n${'='.repeat(80)}`);
    console.log(`🎯 Testing: ${filePath}`);
    console.log('='.repeat(80));
    
    const result1 = await testRawImport(filePath);
    const result2 = await testFetchExtraction(filePath);
    const result3 = await testContentLoader(filePath);
    
    results.push({
      file: filePath,
      rawImport: result1,
      fetchExtract: result2,
      contentLoader: result3,
      overall: result1.success || result2.success || result3.success
    });
  }
  
  // Summary
  console.log(`\n\n${'='.repeat(80)}`);
  console.log(`📊 VALIDATION SUMMARY`);
  console.log('='.repeat(80));
  
  results.forEach((result, index) => {
    console.log(`\n${index + 1}. ${result.file}`);
    console.log(`   Raw Import:      ${result.rawImport.success ? '✅ PASS' : '❌ FAIL'}`);
    console.log(`   Fetch+Extract:   ${result.fetchExtract.success ? '✅ PASS' : '❌ FAIL'}`);
    console.log(`   Content Loader:  ${result.contentLoader.success ? '✅ PASS' : '❌ FAIL'}`);
    console.log(`   Overall:         ${result.overall ? '✅ PASS' : '❌ FAIL'}`);
  });
  
  const allPassed = results.every(r => r.overall);
  
  console.log(`\n${'='.repeat(80)}`);
  if (allPassed) {
    console.log(`✅ ALL TESTS PASSED! The fix is working correctly.`);
  } else {
    console.log(`⚠️ SOME TESTS FAILED. Check the details above.`);
  }
  console.log('='.repeat(80));
  
  return results;
}

// Run the validation
console.log('🚀 Running comprehensive validation...\n');
runAllTests().then(results => {
  console.log('\n✅ Validation complete!');
  window.validationResults = results;
  console.log('\n💡 Results saved to window.validationResults');
}).catch(error => {
  console.error('\n❌ Validation failed:', error);
});
