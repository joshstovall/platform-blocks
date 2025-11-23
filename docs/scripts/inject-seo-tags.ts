#!/usr/bin/env tsx
import fs from 'fs';
import path from 'path';

const webDir = path.join(__dirname, '..', 'web');
const distDir = path.join(__dirname, '..', 'dist');
const webIndexPath = path.join(webDir, 'index.html');
const distIndexPath = path.join(distDir, 'index.html');

console.log('🔧 Injecting SEO meta tags into dist/index.html...\n');

// Read the template and dist files
const webHtml = fs.readFileSync(webIndexPath, 'utf8');
const distHtml = fs.readFileSync(distIndexPath, 'utf8');

// Extract SEO meta tags from web/index.html
const metaTagsMatch = webHtml.match(/<!-- SEO Meta Tags -->[\s\S]*?<!-- Canonical URL -->/);
const ogTagsMatch = webHtml.match(/<!-- Open Graph \/ Facebook -->[\s\S]*?<!-- Twitter -->/);
const twitterTagsMatch = webHtml.match(/<!-- Twitter -->[\s\S]*?<!-- Canonical URL -->/);
const canonicalMatch = webHtml.match(/<!-- Canonical URL -->[\s\S]*?<link rel="canonical"[^>]*>/);

if (!metaTagsMatch || !ogTagsMatch || !twitterTagsMatch) {
  console.error('❌ Could not extract SEO tags from web/index.html');
  process.exit(1);
}

const seoTags = [
  metaTagsMatch[0],
  ogTagsMatch[0],
  twitterTagsMatch[0],
  canonicalMatch ? canonicalMatch[0] : '',
].join('\n  ');

// Inject into dist/index.html after the viewport meta tag
const injected = distHtml.replace(
  /(<meta name="viewport"[^>]*>)/,
  `$1\n  \n  ${seoTags}`
);

// Write back
fs.writeFileSync(distIndexPath, injected, 'utf8');

console.log('✅ SEO meta tags injected successfully!');
console.log('   - SEO meta tags');
console.log('   - Open Graph tags');
console.log('   - Twitter Card tags');
console.log('   - Canonical URL\n');
