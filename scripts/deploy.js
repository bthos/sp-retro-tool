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

// Validate configuration
function validateConfig() {
  // Check if already logged in
  try {
    execSync('npx m365 status', { stdio: 'pipe' });
    console.log('✅ Already logged into Microsoft 365');
    return true;
  } catch (error) {
    // Not logged in, continue with validation
  }

  if (!config.username || !config.password) {
    console.error('❌ Missing credentials. Please choose one of the following options:');
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
    console.log('Option 3: Use app password if MFA is enabled');
    process.exit(1);
  }
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

// Main deployment function
async function deploy() {
  try {
    console.log('🚀 Starting SharePoint deployment...');
    
    validateConfig();
    
    // Find package file
    const packagePath = findPackageFile();
    console.log(`📦 Found package: ${path.basename(packagePath)}`);
    
    // Check if already logged in, if not attempt login
    try {
      execSync('npx m365 status', { stdio: 'pipe' });
      console.log('✅ Using existing Microsoft 365 session');
    } catch (error) {
      // Not logged in, attempt to login
      if (config.username && config.password) {
        console.log('🔄 Attempting password authentication...');
        try {
          exec(
            `npx m365 login --authType password --userName "${config.username}" --password "${config.password}"`,
            'Logging into Microsoft 365'
          );
        } catch (loginError) {
          console.error('❌ Password authentication failed. This often happens when MFA is enabled.');
          console.log('💡 Please try device code authentication instead:');
          console.log('   npx m365 login');
          console.log('   npm run deploy:sharepoint');
          throw loginError;
        }
      } else {
        console.error('❌ Not logged into Microsoft 365 and no credentials provided.');
        console.log('💡 Please login first using device code:');
        console.log('   npx m365 login');
        throw new Error('Authentication required');
      }
    }
    
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
    
    // Attempt logout on error
    try {
      execSync('npx m365 logout', { stdio: 'ignore' });
    } catch (logoutError) {
      // Ignore logout errors
    }
    
    process.exit(1);
  }
}

// Run deployment
deploy();
