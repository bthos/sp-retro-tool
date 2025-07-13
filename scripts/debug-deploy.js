#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

console.log('🐛 SPFx Deployment Debug Tool');
console.log('================================\n');

// Check environment
console.log('📋 Environment Check:');
console.log(`Node.js version: ${process.version}`);
console.log(`Working directory: ${process.cwd()}`);
console.log(`CLI for Microsoft 365 available: ${checkM365CLI()}`);
console.log('');

// Check package file
console.log('📦 Package Check:');
const packagePath = findPackageFile();
if (packagePath) {
  const stats = fs.statSync(packagePath);
  console.log(`✅ Package found: ${path.basename(packagePath)}`);
  console.log(`   Size: ${Math.round(stats.size / 1024)}KB`);
  console.log(`   Modified: ${stats.mtime.toISOString()}`);
} else {
  console.log('❌ No .sppkg package found');
  console.log('   Run: npm run deploy:build');
}
console.log('');

// Check environment variables
console.log('🔧 Configuration Check:');
const config = {
  tenantUrl: process.env.SHAREPOINT_TENANT_URL || '[not-set]',
  appCatalogUrl: process.env.APP_CATALOG_URL || '[not-set]',
  username: process.env.M365_USERNAME || '[not-set]',
  password: process.env.M365_PASSWORD ? '[***]' : '[not-set]'
};

Object.entries(config).forEach(([key, value]) => {
  const status = value === '[not-set]' ? '❌' : '✅';
  console.log(`   ${status} ${key}: ${value}`);
});
console.log('');

// Check authentication status
console.log('🔐 Authentication Check:');
try {
  const status = execSync('npx m365 status', { encoding: 'utf8' }).trim();
  if (status === '"Logged out"') {
    console.log('❌ Not logged into Microsoft 365');
    console.log('');
    console.log('💡 Authentication Options:');
    console.log('   1. Device Code (recommended for MFA):');
    console.log('      npx m365 login');
    console.log('');
    console.log('   2. Browser authentication:');
    console.log('      npx m365 login --authType browser');
    console.log('');
    console.log('   3. Password (if MFA disabled):');
    console.log('      Set M365_USERNAME and M365_PASSWORD in .env');
  } else {
    console.log('✅ Logged into Microsoft 365');
    try {
      const userInfo = execSync('npx m365 status --output json', { encoding: 'utf8' });
      const user = JSON.parse(userInfo);
      console.log(`   User: ${user.connectedAs || 'Unknown'}`);
    } catch (err) {
      console.log('   (User info not available)');
    }
  }
} catch (error) {
  console.log('❌ Unable to check authentication status');
  console.log(`   Error: ${error.message}`);
}
console.log('');

// Test app catalog access
console.log('🏪 App Catalog Check:');
if (config.appCatalogUrl !== '[not-set]') {
  try {
    console.log(`   Testing access to: ${config.appCatalogUrl}`);
    const result = execSync(`npx m365 spo app list --appCatalogUrl "${config.appCatalogUrl}" --output json`, { 
      encoding: 'utf8',
      timeout: 10000 
    });
    const apps = JSON.parse(result);
    console.log(`   ✅ App Catalog accessible (${apps.length} apps found)`);
    
    // Check if our app exists
    const ourApp = apps.find(app => app.Title === 'sp-retro-tool-webpart');
    if (ourApp) {
      console.log(`   📱 Found existing app: ${ourApp.Title} (Status: ${ourApp.Deployed ? 'Deployed' : 'Not Deployed'})`);
    } else {
      console.log('   📱 App not found in catalog (will be uploaded)');
    }
  } catch (error) {
    console.log('   ❌ Cannot access App Catalog');
    console.log(`   Error: ${error.message.split('\n')[0]}`);
    console.log('   Check: Permissions, URL, authentication');
  }
} else {
  console.log('   ❌ APP_CATALOG_URL not configured');
}
console.log('');

// Recommendations
console.log('🎯 Recommendations:');
const issues = [];

if (!packagePath) {
  issues.push('Build the package: npm run deploy:build');
}

if (config.username === '[not-set]') {
  issues.push('Configure credentials or login: npx m365 login');
}

if (config.appCatalogUrl === '[not-set]') {
  issues.push('Set APP_CATALOG_URL in .env file');
}

if (issues.length === 0) {
  console.log('   ✅ Ready for deployment: npm run deploy:sharepoint');
} else {
  issues.forEach((issue, index) => {
    console.log(`   ${index + 1}. ${issue}`);
  });
}

function checkM365CLI() {
  try {
    execSync('npx m365 --version', { stdio: 'pipe' });
    return true;
  } catch (error) {
    return false;
  }
}

function findPackageFile() {
  const solutionDir = path.join(__dirname, '../sharepoint/solution');
  if (!fs.existsSync(solutionDir)) {
    return null;
  }
  
  const files = fs.readdirSync(solutionDir).filter(file => file.endsWith('.sppkg'));
  return files.length > 0 ? path.join(solutionDir, files[0]) : null;
}
