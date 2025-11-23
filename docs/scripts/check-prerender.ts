#!/usr/bin/env tsx
import fs from 'fs';
import path from 'path';
import { glob } from 'glob';

const distDir = path.join(__dirname, '..', 'dist');

interface CheckResult {
  file: string;
  hasRoot: boolean;
  hasContent: boolean;
  hasMetaTags: boolean;
  hasTitle: boolean;
  titleText?: string;
  contentLength: number;
  errors: string[];
  warnings: string[];
}

async function checkHtmlFiles(): Promise<void> {
  console.log('🔍 Checking prerendered HTML files...\n');

  const htmlFiles = await glob('**/*.html', { cwd: distDir });
  
  if (htmlFiles.length === 0) {
    console.error('❌ No HTML files found in dist/ directory.');
    console.error('   Run "npm run build-web" first.');
    process.exit(1);
  }

  const results: CheckResult[] = [];
  let passed = 0;
  let failed = 0;
  let warnings = 0;

  for (const file of htmlFiles) {
    const filePath = path.join(distDir, file);
    const html = fs.readFileSync(filePath, 'utf8');
    
    const result: CheckResult = {
      file,
      hasRoot: html.includes('<div id="root">'),
      hasContent: false,
      hasMetaTags: false,
      hasTitle: false,
      contentLength: 0,
      errors: [],
      warnings: [],
    };

    // Check for root div
    if (!result.hasRoot) {
      result.errors.push('Missing <div id="root">');
    }

    // Check if root has content (not empty)
    const rootMatch = html.match(/<div id="root">([\s\S]*?)<\/div>/);
    if (rootMatch && rootMatch[1]) {
      const content = rootMatch[1].trim();
      result.hasContent = content.length > 0;
      result.contentLength = content.length;
      
      if (!result.hasContent) {
        result.warnings.push('Root div is empty - no prerendered content');
      }
    }

    // Check for meta tags
    result.hasMetaTags = 
      html.includes('<meta name="description"') ||
      html.includes('<meta property="og:') ||
      html.includes('<meta name="twitter:');
    
    if (!result.hasMetaTags) {
      result.warnings.push('Missing SEO meta tags');
    }

    // Check for title
    const titleMatch = html.match(/<title>(.*?)<\/title>/);
    if (titleMatch) {
      result.hasTitle = true;
      result.titleText = titleMatch[1];
      
      if (result.titleText === 'Platform Blocks - Documentation' && file !== 'index.html') {
        result.warnings.push('Using default title instead of page-specific title');
      }
    } else {
      result.errors.push('Missing <title> tag');
    }

    results.push(result);

    // Print result for this file
    const status = result.errors.length > 0 ? '❌' : result.warnings.length > 0 ? '⚠️ ' : '✅';
    const label = file.length > 50 ? `...${file.slice(-47)}` : file;
    
    console.log(`${status} ${label.padEnd(52)} (${result.contentLength.toLocaleString()} chars)`);
    
    if (result.titleText && result.titleText !== 'Platform Blocks - Documentation') {
      console.log(`   📄 Title: ${result.titleText}`);
    }
    
    if (result.errors.length > 0) {
      result.errors.forEach(err => console.log(`      ❌ ${err}`));
      failed++;
    } else if (result.warnings.length > 0) {
      result.warnings.forEach(warn => console.log(`      ⚠️  ${warn}`));
      warnings++;
    } else {
      passed++;
    }
  }

  // Summary
  console.log('\n' + '─'.repeat(80));
  console.log('📊 Summary:');
  console.log(`   Total files:  ${htmlFiles.length}`);
  console.log(`   ✅ Passed:    ${passed}`);
  console.log(`   ⚠️  Warnings:  ${warnings}`);
  console.log(`   ❌ Failed:    ${failed}`);
  
  const totalContent = results.reduce((sum, r) => sum + r.contentLength, 0);
  const avgContent = Math.round(totalContent / results.length);
  console.log(`   📝 Avg size:  ${avgContent.toLocaleString()} chars`);

  // Files without content
  const emptyFiles = results.filter(r => !r.hasContent);
  if (emptyFiles.length > 0) {
    console.log(`\n⚠️  ${emptyFiles.length} files have no prerendered content:`);
    emptyFiles.forEach(r => console.log(`   • ${r.file}`));
  }

  console.log('\n💡 Tips:');
  console.log('   • Expo Metro bundler does not support true SSG/prerendering');
  console.log('   • Meta tags from web/index.html are NOT copied to dist/index.html');
  console.log('   • Content will be rendered client-side via JavaScript');
  console.log('   • For SEO, ensure robots.txt, sitemap.xml, and structured data are present');
  console.log('   • Modern crawlers (Google, Bing) execute JavaScript and index content');
  console.log('   • To serve locally: npm run serve-dist');
  
  console.log('\n📋 Current limitations:');
  console.log('   • No server-side rendering (SSR)');
  console.log('   • No static site generation (SSG)');
  console.log('   • Meta tags are hardcoded in generated HTML');
  console.log('   • Each route uses the same HTML shell');
  
  console.log('\n✅ What works for SEO:');
  console.log('   • Modern search engines execute JS and index dynamic content');
  console.log('   • sitemap.xml guides crawlers to all pages');
  console.log('   • robots.txt controls crawler access');
  console.log('   • llms.txt provides AI-readable documentation');
  console.log('   • Structured data can be added via Helmet/expo-router Head');
  
  if (failed > 0) {
    console.log('\n❌ Some files have errors. Fix them before deploying.\n');
    process.exit(1);
  } else if (warnings > 0) {
    console.log('\n⚠️  Some files have warnings. Review them for better SEO.\n');
  } else {
    console.log('\n✅ All HTML files look good!\n');
  }
}

checkHtmlFiles().catch(error => {
  console.error('Error checking HTML files:', error);
  process.exit(1);
});
