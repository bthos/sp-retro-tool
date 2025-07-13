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
  packageName: 'sp-retro-tool-webpart-client-side-solution'
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
  
  if (!checkM365CLI()) {
    console.log('');
    console.log('🛠️  Microsoft 365 CLI Setup Required:');
    console.log('   1. Install globally: npm install -g @pnp/cli-microsoft365');
    console.log('   2. Configure: m365 setup');
    console.log('   3. Login: m365 login');
  }
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
      console.log('   Prerequisites:');
      console.log('      npm install -g @pnp/cli-microsoft365');
      console.log('      m365 setup');
      console.log('');
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
      
      // Check if our app exists (try multiple ways)
      let ourApp = apps.find(app => app.Title === config.packageName);
      
      if (!ourApp) {
        // Try finding by partial name match
        ourApp = apps.find(app => app.Title && app.Title.includes('retro-tool'));
      }
      
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

// Handle specific AAD authentication errors
function handleAADError(error) {
  const errorMessage = error.message || error.toString();
  
  if (errorMessage.includes('AADSTS700016')) {
    console.log('');
    console.log('🚨 Microsoft 365 CLI Not Registered in Tenant');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('');
    console.log('The Microsoft 365 CLI application is not registered in your tenant.');
    console.log('This is common in enterprise environments with strict app policies.');
    console.log('');
    console.log('🛠️  Solutions (Choose One):');
    console.log('');
    console.log('1. 💻 Use PowerShell SharePoint Management Shell:');
    console.log('   Install-Module -Name Microsoft.Online.SharePoint.PowerShell');
    console.log('   Connect-SPOService -Url https://[tenant]-admin.sharepoint.com');
    console.log('   Add-SPOApp -Path "sp-retro-tool-webpart.sppkg" -Overwrite');
    console.log('');
    console.log('2. 📁 Manual Upload (Recommended - Works Immediately):');
    console.log('   • Go to: https://[tenant]-admin.sharepoint.com');
    console.log('   • Navigate: More features → Apps → App Catalog');
    console.log('   • Upload the .sppkg file from sharepoint/solution/');
    console.log('   • Deploy with "Make available to all sites" checked');
    console.log('');
    return true;
  }
  
  if (errorMessage.includes('AADSTS50076')) {
    console.log('');
    console.log('🔐 Multi-Factor Authentication Required');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('');
    console.log('Your account requires MFA which blocks programmatic authentication.');
    console.log('');
    console.log('💡 Solutions (Choose One):');
    console.log('');
    console.log('1. 🔐 Use Device Code Authentication (Recommended):');
    console.log('   npx m365 login --authType deviceCode');
    console.log('   # Follow the prompts to authenticate with MFA');
    console.log('   # Then retry: npm run deploy:sharepoint');
    console.log('');
    console.log('2. 🌐 Use Browser Authentication:');
    console.log('   npx m365 login --authType browser');
    console.log('   # Opens browser for MFA authentication');
    console.log('   # Then retry: npm run deploy:sharepoint');
    console.log('');
    console.log('3. 📁 Manual Upload (Always Works):');
    console.log('   # Use SharePoint Admin Center (see detailed instructions below)');
    console.log('');
    return true;
  }
  
  if (errorMessage.includes('AADSTS50020')) {
    console.log('');
    console.log('🚫 User Account Issues');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('');
    console.log('The user account has restrictions or is not properly configured.');
    console.log('');
    console.log('💡 Solutions:');
    console.log('1. Verify account has SharePoint admin permissions');
    console.log('2. Check if account is enabled and not locked');
    console.log('3. Contact your IT administrator');
    console.log('');
    return true;
  }
  
  return false;
}

// Attempt various authentication methods
async function attemptAuthentication() {
  console.log('🔐 Attempting Microsoft 365 authentication...');
  
  // Method 1: Try device code authentication (most compatible)
  try {
    console.log('');
    console.log('🔄 Trying device code authentication...');
    execSync('npx m365 login --authType deviceCode', { stdio: 'inherit', timeout: 30000 });
    return true;
  } catch (error) {
    if (handleAADError(error)) {
      return false;
    }
    console.log('❌ Device code authentication failed');
  }
  
  // Method 2: Try browser authentication
  try {
    console.log('');
    console.log('🔄 Trying browser authentication...');
    execSync('npx m365 login --authType browser', { stdio: 'inherit', timeout: 30000 });
    return true;
  } catch (error) {
    if (handleAADError(error)) {
      return false;
    }
    console.log('❌ Browser authentication failed');
  }
  
  // Method 3: Try username/password if available
  if (config.username && config.password) {
    try {
      console.log('');
      console.log('🔄 Trying username/password authentication...');
      execSync(`npx m365 login --authType password --userName "${config.username}" --password "${config.password}"`, { stdio: 'inherit' });
      return true;
    } catch (error) {
      if (handleAADError(error)) {
        return false;
      }
      console.log('❌ Username/password authentication failed');
    }
  }
  
  console.log('');
  console.log('❌ All authentication methods failed');
  return false;
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
  console.log('⚠️  Authentication Required');
  console.log('The deployment requires Microsoft 365 authentication.');
  console.log('');

  if (!config.username || !config.password) {
    console.log('🛠️  Authentication Options:');
    console.log('');
    console.log('Prerequisites (one-time setup):');
    console.log('   npm install -g @pnp/cli-microsoft365');
    console.log('   m365 setup');
    console.log('');
    console.log('Option 1: Device Code (Most Compatible):');
    console.log('   npm run deploy:login:device');
    console.log('');
    console.log('Option 2: Browser Authentication:');
    console.log('   npm run deploy:login:browser');
    console.log('');
    console.log('Option 3: Interactive Login:');
    console.log('   npm run deploy:login');
    console.log('');
    console.log('Option 4: Set Environment Variables:');
    console.log('   Create a .env file with:');
    console.log('   M365_USERNAME=admin@[tenant].onmicrosoft.com');
    console.log('   M365_PASSWORD=your-password');
    console.log('');
    console.log('Option 5: Manual Deployment:');
    console.log('   Use SharePoint Admin Center to upload .sppkg file');
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
    
    // Step 1: Check prerequisites
    if (!checkM365CLI()) {
      throw new Error('Microsoft 365 CLI not installed. Run: npm install -g @pnp/cli-microsoft365');
    }

    // Step 2: Find or build package file
    let packagePath;
    try {
      packagePath = findPackageFile();
      console.log(`📦 Found package: ${path.basename(packagePath)}`);
    } catch (error) {
      console.log('📦 Package not found, building solution...');
      exec('npm run build:production', 'Building solution');
      exec('npm run package:production', 'Packaging solution');
      packagePath = findPackageFile();
      console.log(`📦 Created package: ${path.basename(packagePath)}`);
    }
    
    // Step 3: Check authentication
    if (!checkAuthStatus()) {
      console.log('🔐 Not authenticated with Microsoft 365');
      
      // Attempt authentication if credentials are provided
      if (config.username && config.password) {
        console.log('🔄 Attempting password authentication...');
        try {
          exec(
            `npx m365 login --authType password --userName "${config.username}" --password "${config.password}"`,
            'Logging into Microsoft 365'
          );
        } catch (loginError) {
          console.log('');
          console.error('❌ Password authentication failed. This often happens when MFA is enabled.');
          
          // Handle specific authentication errors
          if (handleAADError(loginError)) {
            showManualDeploymentInstructions(packagePath);
            process.exit(1);
          }
          
          console.log('💡 Falling back to manual deployment instructions...');
          showManualDeploymentInstructions(packagePath);
          console.log('');
          console.log('❌ Automated deployment failed - manual intervention required');
          process.exit(1);
        }
      } else {
        // No credentials provided - try other authentication methods
        console.log('');
        console.log('⚠️  No credentials provided, attempting alternative authentication...');
        
        const authSuccess = await attemptAuthentication();
        if (!authSuccess) {
          console.log('');
          console.log('⚠️  No automated deployment possible without authentication');
          showManualDeploymentInstructions(packagePath);
        console.log('');
        console.log('❌ Automated deployment failed - manual intervention required');
          process.exit(1);
        }
      }
    } else {
      console.log('✅ Using existing Microsoft 365 session');
    }
    
    // Step 4: Upload to app catalog
    console.log('');
    exec(
      `npx m365 spo app add --filePath "${packagePath}" --appCatalogUrl "${config.appCatalogUrl}" --overwrite`,
      'Uploading to App Catalog'
    );
    
    // Step 5: Get app information and deploy
    console.log('📱 Getting app information...');
    const appListOutput = execSync(
      `npx m365 spo app list --appCatalogUrl "${config.appCatalogUrl}" --output json`,
      { encoding: 'utf8' }
    );
    
    const apps = JSON.parse(appListOutput);
    
    // Try multiple ways to find the app
    let targetApp = apps.find(app => app.Title === config.packageName);
    
    if (!targetApp) {
      // Try finding by partial name match
      targetApp = apps.find(app => app.Title && app.Title.includes('retro-tool'));
    }
    
    if (!targetApp) {
      // Try finding by filename
      const packageFileName = path.basename(packagePath, '.sppkg');
      targetApp = apps.find(app => app.Title && app.Title.includes(packageFileName));
    }
    
    if (!targetApp) {
      console.log('📋 Available apps in catalog:');
      apps.forEach(app => {
        console.log(`   - ${app.Title} (ID: ${app.ID})`);
      });
      throw new Error(`App "${config.packageName}" not found in app catalog after upload. Check available apps above.`);
    }
    
    console.log(`📱 Found app: ${targetApp.Title} (ID: ${targetApp.ID})`);
    
    // Deploy the app
    exec(
      `npx m365 spo app deploy --id "${targetApp.ID}" --appCatalogUrl "${config.appCatalogUrl}" --skipFeatureDeployment`,
      'Deploying app tenant-wide'
    );
    
    // Step 6: Cleanup and success message
    try {
      exec('npx m365 logout', 'Logging out');
    } catch (logoutError) {
      // Ignore logout errors - not critical
      console.log('⚠️  Note: Could not logout automatically');
    }
    
    console.log('');
    console.log('🎉 Deployment completed successfully!');
    console.log('═══════════════════════════════════════════════');
    console.log('');
    console.log(`� App Name: ${config.packageName}`);
    console.log(`🏪 App Catalog: ${config.appCatalogUrl}`);
    console.log(`🌐 Tenant: ${config.tenantUrl}`);
    console.log('');
    console.log('� Next Steps:');
    console.log('1. Go to your SharePoint site');
    console.log('2. Edit a page or create a new one');
    console.log('3. Add the "Retro Tool" web part');
    console.log('4. Configure and start your retrospective!');
    console.log('');
    console.log('💡 The web part is now available on all sites in your tenant.');
    
  } catch (error) {
    console.log('');
    console.error('💥 Deployment failed:', error.message);
    
    // Show manual deployment instructions as fallback
    try {
      const packagePath = findPackageFile();
      console.log('');
      console.log('🔄 Fallback: Manual Deployment Available');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
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
