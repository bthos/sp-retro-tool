#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// Configuration
const config = {
  tenantUrl: process.env.SHAREPOINT_TENANT_URL || 'https://[your-tenant].sharepoint.com',
  appCatalogUrl: process.env.APP_CATALOG_URL || 'https://[your-tenant].sharepoint.com/sites/appcatalog',
  username: process.env.M365_USERNAME,
  password: process.env.M365_PASSWORD,
  packageName: 'sp-retro-tool-webpart'
};

// Parse command line arguments
const args = process.argv.slice(2);
const isDebugMode = args.includes('--debug') || args.includes('-d');

// Debug information display
function runDiagnostics() {
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
  const debugConfig = {
    tenantUrl: config.tenantUrl === 'https://[your-tenant].sharepoint.com' ? '[not-set]' : config.tenantUrl,
    appCatalogUrl: config.appCatalogUrl === 'https://[your-tenant].sharepoint.com/sites/appcatalog' ? '[not-set]' : config.appCatalogUrl,
    username: config.username || '[not-set]',
    password: config.password ? '[***]' : '[not-set]'
  };

  Object.entries(debugConfig).forEach(([key, value]) => {
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
  if (debugConfig.appCatalogUrl !== '[not-set]') {
    try {
      console.log(`   Testing access to: ${config.appCatalogUrl}`);
      const result = execSync(`npx m365 spo app list --appCatalogUrl "${config.appCatalogUrl}" --output json`, { 
        encoding: 'utf8',
        timeout: 10000 
      });
      const apps = JSON.parse(result);
      console.log(`   ✅ App Catalog accessible (${apps.length} apps found)`);
      
      // Check if our app exists
      const ourApp = apps.find(app => app.Title === config.packageName);
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

  if (debugConfig.username === '[not-set]') {
    issues.push('Configure credentials or login: npx m365 login');
  }

  if (debugConfig.appCatalogUrl === '[not-set]') {
    issues.push('Set APP_CATALOG_URL in .env file');
  }

  if (issues.length === 0) {
    console.log('   ✅ Ready for deployment: npm run deploy:sharepoint');
  } else {
    issues.forEach((issue, index) => {
      console.log(`   ${index + 1}. ${issue}`);
    });
  }
  console.log('');
}

function checkM365CLI() {
  try {
    execSync('npx m365 --version', { stdio: 'pipe' });
    return true;
  } catch (error) {
    return false;
  }
}

// Check authentication status
function checkAuthStatus() {
  try {
    const status = execSync('npx m365 status --output json', { encoding: 'utf8' });
    const statusObj = JSON.parse(status);
    return statusObj !== "Logged out";
  } catch (error) {
    return false;
  }
}

// Validate configuration and provide fallback instructions
function validateConfig() {
  // Check if already logged in
  if (checkAuthStatus()) {
    console.log('✅ Already logged into Microsoft 365');
    return true;
  }

  console.log('🔐 Not authenticated with Microsoft 365');
  console.log('');
  console.log('⚠️  Authentication Issue Detected');
  console.log('The m365 CLI authentication may be failing in this environment.');
  console.log('');

  if (!config.username || !config.password) {
    console.log('🛠️  Authentication Options:');
    console.log('');
    console.log('Option 1: Use device code authentication (recommended for MFA):');
    console.log('   npx m365 login');
    console.log('   npm run deploy:sharepoint');
    console.log('');
    console.log('Option 2: Set environment variables:');
    console.log('   Create a .env file in the root directory with:');
    console.log('   M365_USERNAME=your-username@[your-tenant].onmicrosoft.com');
    console.log('   M365_PASSWORD=your-password');
    console.log('');
    console.log('Option 3: Manual deployment (if authentication fails):');
    console.log('   The script will provide manual instructions');
    console.log('');
    return false;
  }
  
  return false;
}

// Execute command with error handling
function exec(command, description) {
  console.log(`🔄 ${description}...`);
  try {
    const output = execSync(command, { stdio: 'inherit' });
    console.log(`✅ ${description} completed`);
    return output;
  } catch (error) {
    console.error(`❌ ${description} failed:`, error.message);
    throw error;
  }
}

// Find the .sppkg file
function findPackageFile() {
  const solutionDir = path.join(__dirname, '../sharepoint/solution');
  if (!fs.existsSync(solutionDir)) {
    throw new Error('Solution directory not found. Run "npm run package:production" first.');
  }
  
  const files = fs.readdirSync(solutionDir).filter(file => file.endsWith('.sppkg'));
  if (files.length === 0) {
    throw new Error('No .sppkg file found. Run "npm run package:production" first.');
  }
  
  return path.join(solutionDir, files[0]);
}

// Show manual deployment instructions
function showManualDeploymentInstructions(packagePath) {
  console.log('');
  console.log('🛠️  Manual Deployment Required');
  console.log('Automated deployment failed - please follow these manual steps:');
  console.log('');
  console.log('1. Download the package file:');
  console.log(`   Package location: ${packagePath}`);
  console.log('');
  console.log('2. Manual upload to SharePoint:');
  console.log('   a. Go to your SharePoint Admin Center');
  console.log(`   b. Navigate to: ${config.appCatalogUrl}`);
  console.log('   c. Go to "Apps for SharePoint"');
  console.log('   d. Click "Upload" and select the .sppkg file');
  console.log('   e. Click "Deploy" and check "Make this solution available to all sites"');
  console.log('');
  console.log('3. Alternative - Use SharePoint Online Management Shell:');
  console.log('   Connect-SPOService -Url https://[tenant]-admin.sharepoint.com');
  console.log(`   Add-SPOApp -Path "${path.basename(packagePath)}" -Overwrite`);
  console.log('');
  console.log('📝 The package is ready for deployment at:');
  console.log(`   ${packagePath}`);
}

// Main deployment function
async function deploy() {
  // Run diagnostics if in debug mode
  if (isDebugMode) {
    runDiagnostics();
    return;
  }

  try {
    console.log('🚀 Starting SharePoint deployment...');
    
    // Find package file
    const packagePath = findPackageFile();
    console.log(`📦 Found package: ${path.basename(packagePath)}`);
    
    // Validate configuration and check authentication
    const isAuthenticated = validateConfig();
    
    if (!isAuthenticated) {
      // Try to authenticate if credentials are provided
      if (config.username && config.password) {
        console.log('🔄 Attempting password authentication...');
        try {
          exec(
            `npx m365 login --authType password --userName "${config.username}" --password "${config.password}"`,
            'Logging into Microsoft 365'
          );
        } catch (loginError) {
          console.error('❌ Password authentication failed. This often happens when MFA is enabled.');
          console.log('💡 Falling back to manual deployment instructions...');
          showManualDeploymentInstructions(packagePath);
          console.log('');
          console.log('❌ Automated deployment failed - manual intervention required');
          process.exit(1);
        }
      } else {
        // No credentials provided, show manual instructions
        console.log('');
        console.log('⚠️  No automated deployment possible without authentication');
        showManualDeploymentInstructions(packagePath);
        console.log('');
        console.log('❌ Automated deployment failed - manual intervention required');
        process.exit(1);
      }
    }
    
    console.log('✅ Using existing Microsoft 365 session');
    
    // Upload to app catalog
    exec(
      `npx m365 spo app add --filePath "${packagePath}" --appCatalogUrl "${config.appCatalogUrl}" --overwrite`,
      'Uploading to App Catalog'
    );
    
    // Get app information
    const appListOutput = execSync(
      `npx m365 spo app list --appCatalogUrl "${config.appCatalogUrl}" --output json`,
      { encoding: 'utf8' }
    );
    
    const apps = JSON.parse(appListOutput);
    const targetApp = apps.find(app => app.Title === config.packageName);
    
    if (!targetApp) {
      throw new Error(`App "${config.packageName}" not found in app catalog`);
    }
    
    console.log(`📱 Found app: ${targetApp.Title} (ID: ${targetApp.ID})`);
    
    // Deploy the app
    exec(
      `npx m365 spo app deploy --id "${targetApp.ID}" --appCatalogUrl "${config.appCatalogUrl}" --skipFeatureDeployment`,
      'Deploying app tenant-wide'
    );
    
    // Logout
    exec('npx m365 logout', 'Logging out');
    
    console.log('🎉 Deployment completed successfully!');
    console.log(`📝 App is now available at: ${config.tenantUrl}`);
    console.log('💡 You can now add the web part to any modern SharePoint page.');
    
  } catch (error) {
    console.error('💥 Deployment failed:', error.message);
    
    // Show manual deployment instructions as fallback
    try {
      const packagePath = findPackageFile();
      showManualDeploymentInstructions(packagePath);
      console.log('');
      console.log('❌ Automated deployment failed - manual intervention required');
    } catch (packageError) {
      console.log('');
      console.log('🛠️  Please run the build and package steps first:');
      console.log('   npm run deploy:build');
    }
    
    // Attempt logout on error
    try {
      execSync('npx m365 logout', { stdio: 'ignore' });
    } catch (logoutError) {
      // Ignore logout errors
    }
    
    process.exit(1);
  }
}

// Show usage information
function showUsage() {
  console.log('📖 SharePoint Deployment Tool Usage:');
  console.log('');
  console.log('Normal deployment:');
  console.log('  npm run deploy:sharepoint');
  console.log('  node scripts/deploy.js');
  console.log('');
  console.log('Debug mode (diagnostics only):');
  console.log('  npm run deploy:sharepoint -- --debug');
  console.log('  node scripts/deploy.js --debug');
  console.log('');
  console.log('Options:');
  console.log('  --debug, -d    Run diagnostics without deployment');
  console.log('  --help, -h     Show this help message');
}

// Check for help flag
if (args.includes('--help') || args.includes('-h')) {
  showUsage();
  process.exit(0);
}

// Run deployment
deploy();
