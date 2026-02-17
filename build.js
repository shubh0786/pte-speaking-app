#!/usr/bin/env node

/**
 * Build script for Crack PTE Speaking
 * Optimizes files for production deployment
 */

const fs = require('fs');
const path = require('path');

console.log('🔨 Building Crack PTE Speaking for production...\n');

// Simple minification for JavaScript (removes comments and extra whitespace)
function minifyJS(content) {
  return content
    .replace(/\/\*[\s\S]*?\*\//g, '') // Remove /* */ comments
    .replace(/\/\/.*$/gm, '') // Remove // comments
    .replace(/\s+/g, ' ') // Collapse whitespace
    .replace(/\s*([{}();:,])\s*/g, '$1') // Remove spaces around syntax
    .trim();
}

// Simple minification for CSS
function minifyCSS(content) {
  return content
    .replace(/\/\*[\s\S]*?\*\//g, '') // Remove comments
    .replace(/\s+/g, ' ') // Collapse whitespace
    .replace(/\s*([{}:;,])\s*/g, '$1') // Remove spaces around syntax
    .trim();
}

// Simple minification for HTML
function minifyHTML(content) {
  return content
    .replace(/<!--[\s\S]*?-->/g, '') // Remove comments
    .replace(/\s+/g, ' ') // Collapse whitespace
    .replace(/\s*(<|>)\s*/g, '$1') // Remove spaces around tags
    .trim();
}

function processFile(filePath, minifier) {
  const fullPath = path.join(__dirname, filePath);
  if (!fs.existsSync(fullPath)) {
    console.log(`⚠️  File not found: ${filePath}`);
    return;
  }

  console.log(`📦 Processing ${filePath}...`);
  const content = fs.readFileSync(fullPath, 'utf8');
  const minified = minifier(content);
  const savings = ((content.length - minified.length) / content.length * 100).toFixed(1);

  fs.writeFileSync(fullPath, minified);
  console.log(`✅ Saved ${savings}% (${content.length - minified.length} bytes)`);
}

// Files to minify
const filesToProcess = [
  { path: 'index.html', minifier: minifyHTML },
  { path: 'css/app.css', minifier: minifyCSS }
];

// Minify all JS files
const jsDir = path.join(__dirname, 'js');
if (fs.existsSync(jsDir)) {
  const jsFiles = fs.readdirSync(jsDir).filter(f => f.endsWith('.js'));
  jsFiles.forEach(file => {
    filesToProcess.push({
      path: `js/${file}`,
      minifier: minifyJS
    });
  });
}

// Process all files
filesToProcess.forEach(({ path: filePath, minifier }) => {
  processFile(filePath, minifier);
});

console.log('\n🎉 Build completed successfully!');
console.log('📦 Ready for deployment');
console.log('\nNext steps:');
console.log('1. npm run deploy:netlify  (recommended)');
console.log('2. npm run deploy:vercel');
console.log('3. npm run deploy:github');
console.log('4. Or manually upload files to any web host');