#!/usr/bin/env node

/**
 * Simple deployment script for Crack PTE Speaking
 * Usage: node deploy.js [platform]
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const platform = process.argv[2] || 'netlify';

console.log('🚀 Deploying Crack PTE Speaking...\n');

function runCommand(command, description) {
  console.log(`📦 ${description}...`);
  try {
    execSync(command, { stdio: 'inherit' });
    console.log(`✅ ${description} completed\n`);
  } catch (error) {
    console.error(`❌ ${description} failed:`, error.message);
    process.exit(1);
  }
}

function checkFiles() {
  console.log('🔍 Checking deployment files...');
  const requiredFiles = [
    'index.html',
    'js/app.js',
    'js/accents.js',
    'css/app.css',
    'img/logo.png'
  ];

  const missingFiles = requiredFiles.filter(file => !fs.existsSync(file));

  if (missingFiles.length > 0) {
    console.error('❌ Missing required files:', missingFiles);
    process.exit(1);
  }

  console.log('✅ All required files present\n');
}

switch (platform) {
  case 'netlify':
    console.log('🌐 Deploying to Netlify...\n');

    checkFiles();

    // Install Netlify CLI if not present
    try {
      execSync('npx netlify-cli --version', { stdio: 'pipe' });
    } catch {
      console.log('📦 Installing Netlify CLI...');
      runCommand('npm install -g netlify-cli', 'Install Netlify CLI');
    }

    // Deploy to Netlify
    runCommand('npx netlify-cli deploy --prod --dir=.', 'Deploy to Netlify');

    console.log('🎉 Deployment successful!');
    console.log('🌐 Your site should be live at the URL shown above');
    break;

  case 'vercel':
    console.log('⚡ Deploying to Vercel...\n');

    checkFiles();

    // Install Vercel CLI if not present
    try {
      execSync('npx vercel --version', { stdio: 'pipe' });
    } catch {
      console.log('📦 Installing Vercel CLI...');
      runCommand('npm install -g vercel', 'Install Vercel CLI');
    }

    // Deploy to Vercel
    runCommand('npx vercel --prod', 'Deploy to Vercel');

    console.log('🎉 Deployment successful!');
    console.log('⚡ Your site should be live at the URL shown above');
    break;

  case 'github':
    console.log('🐙 Preparing for GitHub Pages...\n');

    // Check if git is initialized
    try {
      execSync('git status', { stdio: 'pipe' });
    } catch {
      console.log('📦 Initializing git repository...');
      runCommand('git init', 'Initialize git');
      runCommand('git add .', 'Add files to git');
      runCommand('git commit -m "Initial commit - Crack PTE Speaking v2.0"', 'Initial commit');
    }

    console.log('📝 Next steps for GitHub Pages:');
    console.log('1. Create a new repository on GitHub');
    console.log('2. Run: git remote add origin https://github.com/yourusername/your-repo.git');
    console.log('3. Run: git push -u origin main');
    console.log('4. Go to repository Settings → Pages');
    console.log('5. Select "Deploy from a branch" and choose main branch');
    console.log('6. Your site will be at: https://yourusername.github.io/your-repo/');
    break;

  default:
    console.log('📋 Available platforms:');
    console.log('  netlify  - Deploy to Netlify (recommended)');
    console.log('  vercel   - Deploy to Vercel');
    console.log('  github   - Prepare for GitHub Pages');
    console.log('\nUsage: node deploy.js [platform]');
    break;
}