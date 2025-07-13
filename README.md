# SharePoint Retrospective Tool

A modern SharePoint Framework (SPFx) webpart for conducting effective Scrum retrospectives in SharePoint Online environments.

## ✨ Features

### 🏗️ Multi-Column Layout
- **Configurable columns** with customizable headers and placeholders
- **Equal-width responsive design** that adapts to different screen sizes
- **Column reordering** with left/right arrow controls
- **Default columns**: Start, Stop, Continue (fully customizable)

### 🔒 Private Entry Areas
- **Private section** for each column with secure entry
- **"Type here… Press Enter to save"** input fields
- **Individual card publishing** with upload button
- **"Publish All"** functionality for batch publishing

### 🎯 Card Management
- **Drag and drop** support for moving cards between columns
- **Card reordering** with up/down arrow controls
- **Card deletion** with confirmation
- **Persistent storage** using localStorage

### ⚙️ Settings & Configuration
- **Settings modal** for column configuration
- **Add/remove columns** dynamically
- **Edit headers and placeholders** in real-time
- **Responsive settings interface**

### 🎨 User Experience
- **Modern SharePoint theme integration**
- **Office UI Fabric styling**
- **Hover effects** and smooth animations
- **Mobile-responsive** design
- **Keyboard shortcuts** (Enter to save cards)
- **Empty state indicators** when no cards exist

## 📸 Screenshots

### Initial State
![Initial State](https://github.com/user-attachments/assets/77cb8115-1b3b-460a-b739-0570fb0ae410)

### With Cards and Custom Columns
![With Cards](https://github.com/user-attachments/assets/0dfdcc61-c563-4fb0-9c30-48078df1ad33)

## 🏗️ Technical Architecture

### Technology Stack
- **SharePoint Framework (SPFx) 1.21.1**
- **React 17** with TypeScript
- **SCSS modules** for maintainable styling
- **Office UI Fabric** components
- **localStorage** for data persistence

### Project Structure
```
├── src/
│   ├── components/
│   │   ├── RetroTool.tsx           # Main React component
│   │   ├── RetroTool.module.scss   # Component styles
│   │   └── IRetroToolProps.ts      # TypeScript interfaces
│   └── RetroToolWebPart.ts         # SPFx webpart class
├── config/                         # SPFx configuration
├── scripts/                        # Deployment scripts
├── sharepoint/solution/            # Package output
└── .github/workflows/              # CI/CD automation
```

## 🚀 Quick Start & Deployment

### Prerequisites
- Node.js 20.0.0 or higher
- SharePoint Online tenant with Site Collection Admin rights
- SharePoint App Catalog created (see setup instructions below)

### Installation & Deployment

#### Option 1: Automated Setup (Recommended)
The project includes an interactive setup script that guides you through configuration:

```bash
# Clone and setup
git clone [repository-url]
cd sp-retro-tool
npm install

# Interactive setup - walks you through tenant configuration
npm run setup

# Build and deploy in one command
npm run deploy:full
```

The `setup` script will:
- Prompt for your SharePoint tenant name
- Ask for admin credentials  
- Generate appropriate URLs automatically
- Create a `.env` file with all configuration
- Validate inputs and provide helpful feedback

#### Option 2: Manual Setup
```bash
# Clone and setup
git clone [repository-url]
cd sp-retro-tool
npm install

# Configure environment manually
cp .env.example .env
# Edit .env with your tenant details:
# M365_USERNAME=admin@[your-tenant].onmicrosoft.com
# M365_PASSWORD=your-password
# SHAREPOINT_TENANT_URL=https://[your-tenant].sharepoint.com
# APP_CATALOG_URL=https://[your-tenant].sharepoint.com/sites/appcatalog

# Build and deploy
npm run deploy:full
```

#### Option 3: Step-by-Step Deployment
```bash
# Build production package
npm run deploy:build

# Deploy to SharePoint (uses credentials from .env)
npm run deploy:sharepoint

# Or do both steps individually:
npm run build:production
npm run package:production
npm run deploy:sharepoint
```

#### Option 4: Manual Upload
```bash
# Build package
npm run build:production
npm run package:production

# Manual steps:
# 1. Go to https://[your-tenant].sharepoint.com/sites/appcatalog
# 2. Upload sharepoint/solution/sp-retro-tool-webpart.sppkg
# 3. Deploy solution tenant-wide
# 4. Add webpart to modern pages
```

#### Option 5: PowerShell Deployment (Windows)
For Windows environments, use the PowerShell script:

```powershell
cd scripts
$SecurePassword = ConvertTo-SecureString "YourPassword" -AsPlainText -Force
.\deploy.ps1 -Username "admin@[your-tenant].onmicrosoft.com" -Password $SecurePassword -TenantUrl "https://[your-tenant].sharepoint.com"
```

### App Catalog Setup
If you don't have an App Catalog:

1. Go to SharePoint Admin Center
2. Navigate to **More features** → **Apps** → **App Catalog**
3. Create new App Catalog site
4. Wait for provisioning (can take 30 minutes)
5. Verify access at `https://[your-tenant].sharepoint.com/sites/appcatalog`

## 🔧 Development

### Local Development
```bash
# Start development server
npm run serve

# Build for production
npm run build:production

# Package solution
npm run package:production
```

### Available Scripts
- `npm run serve` - Local development server
- `npm run build` - Development build
- `npm run build:production` - Production build
- `npm run package:production` - Create .sppkg package
- `npm run deploy:sharepoint` - Deploy to SharePoint
- `npm run deploy:full` - Build + Package + Deploy
- `npm run setup` - Interactive configuration

## 🔐 Security & Configuration

### Environment Variables
Create a `.env` file in the root directory:
```env
M365_USERNAME=admin@[your-tenant].onmicrosoft.com
M365_PASSWORD=your-secure-password
SHAREPOINT_TENANT_URL=https://[your-tenant].sharepoint.com
APP_CATALOG_URL=https://[your-tenant].sharepoint.com/sites/appcatalog
```

### Security Features
- **No hardcoded credentials** - All sensitive data in `.env` (gitignored)
- **Tenant-agnostic** - Works with any SharePoint Online tenant
- **Template-based configuration** - Easy to replicate across environments
- **Production-ready** - Supports Azure App Registration for CI/CD

## 🤖 CI/CD Automation

### GitHub Actions Workflow
The project includes automated CI/CD via GitHub Actions:

1. **Triggers**: Push to main branch or pull requests
2. **Build**: Automated SPFx build and packaging
3. **Deploy**: Automatic deployment to SharePoint Online
4. **Artifacts**: Build artifacts stored for 30 days

### Setup GitHub Actions
1. Add repository secrets:
   - `M365_USERNAME`: Your admin username
   - `M365_PASSWORD`: Your admin password
   - `APP_CATALOG_URL`: Your app catalog URL

2. Push to main branch triggers automatic deployment

## 📋 Usage Instructions

### For End Users
1. **Adding Cards**: Type in the private section and press Enter
2. **Publishing Cards**: Click "Publish" on individual cards or "Publish All"
3. **Reordering**: Use arrow buttons or drag and drop
4. **Configuring**: Click "Settings" to modify columns

### For Site Administrators
1. **Add webpart**: Edit a modern page and add "Retrospective Tool" webpart
2. **Configure**: No additional setup required - works out of the box
3. **Customize**: Users can configure columns through the settings interface

## �️ Troubleshooting

### Common Issues and Solutions

#### Permission Denied
- **Problem**: Can't upload or deploy to App Catalog
- **Solution**: Ensure you have Site Collection Admin rights for the App Catalog site
- **Check**: Verify access to `https://[your-tenant].sharepoint.com/sites/appcatalog`

#### App Not Found After Upload
- **Problem**: Webpart doesn't appear in the webpart gallery
- **Solution**: 
  1. Verify app is uploaded to App Catalog
  2. Ensure app is deployed (not just uploaded)
  3. Check that deployment is tenant-wide or to specific sites
  4. Wait a few minutes for propagation

#### Login Issues
- **Problem**: `npm run deploy:sharepoint` fails with authentication errors
- **Solutions**:
  - Verify credentials in `.env` file are correct
  - If MFA is enabled, use app passwords instead of regular passwords
  - Try different authentication method or service account
  - Check if conditional access policies are blocking the login

#### Build Errors
- **Problem**: `npm run build` or `npm run package:production` fails
- **Solutions**:
  - Ensure Node.js version is 20.0.0 or higher: `node --version`
  - Clear node_modules and reinstall: `rm -rf node_modules package-lock.json && npm install`
  - Check for TypeScript errors: `npm run build` shows detailed error messages
  - Verify all dependencies are installed correctly

#### Missing App Catalog
- **Problem**: App Catalog site doesn't exist
- **Solution**:
  1. Go to SharePoint Admin Center
  2. Navigate to **More features** → **Apps** → **App Catalog**
  3. Create new App Catalog site
  4. Wait for provisioning (can take 30 minutes)
  5. Update `APP_CATALOG_URL` in your `.env` file

#### Package Not Found
- **Problem**: Deploy script can't find `.sppkg` file
- **Solution**: 
  1. Run `npm run build:production` first
  2. Run `npm run package:production` to create the package
  3. Verify file exists at `sharepoint/solution/sp-retro-tool-webpart.sppkg`

### Debug Commands

Test your environment and configuration:

```bash
# Check CLI version and installation
npx m365 --version

# Test authentication (will prompt for login)
npx m365 login

# List apps in your catalog
npx m365 spo app list --appCatalogUrl "https://[your-tenant].sharepoint.com/sites/appcatalog"

# Get specific app details
npx m365 spo app get --name "sp-retro-tool-webpart" --appCatalogUrl "https://[your-tenant].sharepoint.com/sites/appcatalog"

# Test local build
npm run build

# Test package creation
npm run package:production

# Verify environment configuration
node -e "require('dotenv').config(); console.log('Username:', process.env.M365_USERNAME); console.log('Tenant URL:', process.env.SHAREPOINT_TENANT_URL);"
```

### Deployment Verification

After deployment, verify everything works:

1. **Check App Catalog**:
   - Go to `https://[your-tenant].sharepoint.com/sites/appcatalog`
   - Navigate to **Apps for SharePoint** library
   - Verify your app shows status as "Deployed"

2. **Test on a Page**:
   - Go to any modern SharePoint site
   - Edit a page
   - Add web part → Search "Retrospective Tool"
   - Verify the webpart loads and functions correctly

3. **Check Browser Console**:
   - Open browser developer tools (F12)
   - Look for any JavaScript errors in console
   - Verify network requests are successful

### Getting Help

If you continue to have issues:

1. **Check the deployment logs** in your terminal for specific error messages
2. **Verify your SharePoint environment** meets the prerequisites
3. **Test with a different user account** that has admin rights
4. **Try manual upload** as a fallback method
5. **Contact your SharePoint administrator** for tenant-specific issues

### Advanced Troubleshooting

For complex deployment scenarios:

```bash
# Enable verbose logging
DEBUG=* npm run deploy:sharepoint

# Test CLI authentication separately
npx m365 login --authType password --userName "your-username" --password "your-password"

# Check tenant configuration
npx m365 spo tenant get

# Verify app permissions
npx m365 spo app permission list --appId [your-app-id]
```

## 📄 Browser Support
- Chrome 90+
- Edge 90+
- Firefox 88+
- Safari 14+

## 🔮 Future Enhancements
- SharePoint List integration for permanent storage
- Teams integration
- Real-time collaboration features
- Export capabilities (PDF, Excel)
- Advanced analytics and reporting

## 📜 License
This project is licensed under the MIT License - see the LICENSE file for details.

## 🤝 Contributing
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request



## 📞 Support

For issues, questions, or feature requests:
- Create an issue in the repository
- Contact your SharePoint administrator  
- Review the troubleshooting section above
- Check SharePoint Framework documentation
