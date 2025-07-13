# SPFx Deployment Guide for SharePoint Online

## Quick Start

### 1. Prerequisites
- Node.js 20.0.0 or higher installed
- Access to your SharePoint Online tenant with Site Collection Admin rights
- SharePoint App Catalog created

### 2. Local Setup
```bash
cd sp-retro-tool
npm install

# Interactive setup (recommended)
npm run setup

# OR manually create .env file from template
cp .env.example .env
# Edit .env with your tenant details
```

### 3. Build and Deploy
```bash
# Build production package
npm run deploy:build

# Deploy to SharePoint (interactive)
npm run deploy:sharepoint

# Or do both in one command
npm run deploy:full
```

## Detailed Deployment Options

### Option 1: Automated Deployment (Recommended)

1. **Setup credentials**:
   ```bash
   cp .env.example .env
   # Edit .env with your credentials
   ```

2. **Deploy**:
   ```bash
   npm run deploy:full
   ```

### Option 2: Manual Deployment

1. **Build package**:
   ```bash
   npm run build:production
   npm run package:production
   ```

2. **Upload manually**:
   - Go to https://[your-tenant].sharepoint.com/sites/appcatalog
   - Upload `sharepoint/solution/sp-retro-tool-webpart.sppkg`
   - Deploy tenant-wide

### Option 3: PowerShell Deployment (Windows)

```powershell
cd scripts
$SecurePassword = ConvertTo-SecureString "YourPassword" -AsPlainText -Force
.\deploy.ps1 -Username "admin@[your-tenant].onmicrosoft.com" -Password $SecurePassword
```

## CI/CD with GitHub Actions

The repository includes GitHub Actions workflow for automated deployment:

### Setup GitHub Secrets:
- `M365_USERNAME`: Your admin username
- `M365_PASSWORD`: Your password  
- `APP_CATALOG_URL`: https://[your-tenant].sharepoint.com/sites/appcatalog

### Automatic Deployment:
- Push to `main` branch triggers deployment
- Build artifacts are stored for 30 days
- Production environment protection available

## App Catalog Setup

If you don't have an App Catalog:

1. Go to SharePoint Admin Center
2. Navigate to **More features** → **Apps** → **App Catalog**
3. Create new App Catalog site
4. Wait for provisioning (can take 30 minutes)

## Testing the Deployment

1. **Verify in App Catalog**:
   - Go to https://[your-tenant].sharepoint.com/sites/appcatalog
   - Check "Apps for SharePoint" library
   - Ensure app shows as "Deployed"

2. **Add to a page**:
   - Go to any modern SharePoint site
   - Edit a page
   - Add web part → Search "Retrospective Tool"
   - Configure and publish

## Troubleshooting

### Common Issues:

**Permission Denied**:
- Ensure you have Site Collection Admin rights
- Check App Catalog permissions

**App Not Found**:
- Verify app is uploaded and deployed
- Check app title matches exactly

**Login Issues**:
- Verify credentials in .env file
- Check if MFA is enabled (use app passwords)
- Try different authentication method

### Debug Commands:

```bash
# Check CLI version
npx m365 --version

# List apps in catalog
npx m365 spo app list --appCatalogUrl "https://[your-tenant].sharepoint.com/sites/appcatalog"

# Get app details
npx m365 spo app get --name "sp-retro-tool-webpart"
```

## Security Considerations

### For Production:
- Use Azure App Registration instead of user credentials
- Implement certificate-based authentication
- Use Azure Key Vault for secrets
- Enable conditional access policies

### For Development:
- Use dedicated service account
- Rotate passwords regularly
- Limit permissions to minimum required
- Monitor deployment logs

## Next Steps

After successful deployment:
1. Test the web part functionality
2. Train users on the retrospective tool
3. Set up monitoring and feedback collection
4. Plan for regular updates and maintenance

For support, check the main [README.md](../README.md) and [SPFx documentation](../SPFx-DEPLOYMENT.md).
