# SPFx WebPart Deployment Guide

This guide provides step-by-step instructions for deploying the SharePoint Framework (SPFx) Retrospective Tool WebPart to SharePoint Online.

## Overview

The SPFx WebPart is a modern, React-based solution that provides all the functionality of the original retrospective tool but with better integration into SharePoint Online environments. It supports modern SharePoint pages and includes all the features of the original tool:

- Multi-column retrospective layout
- Private and public card areas
- Drag-and-drop functionality
- Settings management
- Responsive design
- Local storage persistence

## Prerequisites

### For Development
- Node.js 18.17.1 or higher
- SharePoint Framework development environment
- SharePoint Online tenant
- Site collection administrator permissions

### For Deployment
- SharePoint Online tenant
- Site collection administrator or global administrator permissions
- Access to SharePoint App Catalog

## Files Created

The SPFx project includes:
- `sp-retro-tool-webpart.sppkg` - The SharePoint solution package
- Source code in TypeScript/React
- SCSS styling modules
- Configuration files

## Deployment Steps

### Step 1: Upload to App Catalog

1. **Access the App Catalog**
   - Navigate to your SharePoint Admin Center
   - Go to More features > Apps > App Catalog
   - If you don't have an App Catalog, create one first

2. **Upload the Solution Package**
   - Click "Upload" or drag and drop the `sp-retro-tool-webpart.sppkg` file
   - The file is located at: `sharepoint/solution/sp-retro-tool-webpart.sppkg`

3. **Deploy the Solution**
   - Click "Deploy" when prompted
   - Choose deployment options:
     - **Make this solution available to all sites**: Check this for tenant-wide deployment
     - **Skip feature deployment**: Check this for easier deployment (recommended)

### Step 2: Add to SharePoint Site

1. **Navigate to Target Site**
   - Go to the SharePoint site where you want to use the retrospective tool

2. **Add the WebPart to a Page**
   - Create a new page or edit an existing page
   - Click the "+" button to add a new web part
   - Search for "Retrospective Tool" in the web part gallery
   - Select and add the web part to your page

3. **Configure the WebPart**
   - Use the property panel to configure any settings
   - Save and publish the page

### Step 3: Grant Permissions (if needed)

1. **Site Collection App Catalog (Alternative)**
   - If you don't have tenant-wide deployment, you can use site collection app catalog
   - Go to Site Contents > New > App
   - Add the retrospective tool app

2. **User Permissions**
   - Users need at least "Edit" permissions to use the tool effectively
   - "Read" permissions allow viewing but not editing cards

## Configuration Options

### WebPart Properties
- **Description**: Customize the web part description
- **Environment**: Automatically detected (SharePoint Online)
- **Theme**: Inherits from SharePoint site theme

### Default Settings
- **Columns**: Start, Stop, Continue (can be customized)
- **Storage**: Uses browser localStorage for persistence
- **Responsive**: Automatically adapts to screen size

## Usage Instructions

### For End Users
1. **Adding Cards**
   - Type in the private section at the bottom of each column
   - Press Enter to save the card privately

2. **Publishing Cards**
   - Click "Publish" on individual cards to make them visible to all users
   - Use "Publish All" to publish all private cards in a column

3. **Managing Cards**
   - Use arrow buttons to reorder cards
   - Click the trash icon to delete cards
   - Drag and drop cards between columns

4. **Settings**
   - Click the Settings button to customize columns
   - Add, remove, or modify column headers and placeholders

### For Administrators
1. **Deployment Management**
   - Monitor app usage through SharePoint admin center
   - Update the solution by uploading new versions

2. **Permissions**
   - Manage who can add the web part to pages
   - Control which sites can use the solution

## Troubleshooting

### Common Issues

1. **WebPart Not Appearing**
   - Verify the solution is deployed in App Catalog
   - Check that the solution is available to your site
   - Ensure you have proper permissions

2. **Data Not Persisting**
   - Check browser localStorage is enabled
   - Verify the site URL is consistent
   - Try clearing browser cache

3. **Styling Issues**
   - Check for conflicts with custom CSS
   - Verify SharePoint theme compatibility
   - Try in different browsers

### Debug Steps

1. **Check App Catalog**
   - Verify solution is deployed and available
   - Check for any error messages during deployment

2. **Browser Console**
   - Open browser developer tools
   - Check for JavaScript errors
   - Verify network requests are successful

3. **SharePoint Logs**
   - Check SharePoint admin center for app deployment logs
   - Look for any permission or configuration issues

## Advanced Configuration

### Custom Branding
- Modify the SCSS files to match your organization's colors
- Update the web part icon and metadata
- Customize default column configurations

### Data Storage Options
- **localStorage**: Default, works offline but data is per-browser
- **SharePoint Lists**: Can be customized to store data in SharePoint lists
- **External APIs**: Can be extended to integrate with other systems

### Integration
- **Microsoft Teams**: Can be added as a Teams app
- **Power Platform**: Can integrate with Power Apps and Power Automate
- **Microsoft Graph**: Can be extended to use Graph API for user data

## Security Considerations

### Data Storage
- By default, data is stored in browser localStorage
- Data is not shared between different browsers or devices
- Consider implementing server-side storage for persistent data

### Permissions
- Web part inherits SharePoint site permissions
- Users need edit permissions to modify cards
- Consider implementing additional security for sensitive retrospectives

### Privacy
- Private cards are only visible to the user who created them
- Published cards are visible to all users with access to the page
- No data is transmitted to external servers by default

## Updating the Solution

### Development Updates
1. Make changes to the source code
2. Build the solution: `gulp bundle --production`
3. Package the solution: `gulp package-solution --production`
4. Upload the new `.sppkg` file to the App Catalog

### Deployment Updates
1. The new version will be automatically available to sites
2. Users may need to refresh their pages to see updates
3. No data loss should occur with updates

## Support and Maintenance

### Regular Tasks
- Monitor solution usage and performance
- Keep the solution updated with SharePoint Framework updates
- Backup important retrospective data if needed

### User Support
- Provide training on how to use the retrospective tool
- Create user guides and documentation
- Establish a support process for issues

## Comparison with Original Tool

### Advantages of SPFx Version
- **Modern Integration**: Native SharePoint Online integration
- **Better Performance**: Optimized for SharePoint environments
- **Security**: Inherits SharePoint security model
- **Maintenance**: Easier updates and management
- **Mobile Support**: Better mobile experience

### Feature Parity
- All original features are available
- Same user interface and experience
- Compatible data storage (localStorage)
- Same responsive design

## File Structure

```
spfx-webpart/
├── config/                 # SPFx configuration files
│   ├── config.json
│   ├── package-solution.json
│   └── serve.json
├── src/                    # Source code
│   ├── components/         # React components
│   │   ├── RetroTool.tsx
│   │   ├── RetroTool.module.scss
│   │   └── IRetroToolProps.ts
│   ├── RetroToolWebPart.ts # Main web part file
│   └── RetroToolWebPart.manifest.json
├── sharepoint/             # SharePoint solution
│   └── solution/
│       └── sp-retro-tool-webpart.sppkg
└── package.json           # Dependencies and scripts
```

## Next Steps

1. **Deploy to Production**
   - Follow the deployment steps above
   - Test in a development environment first

2. **User Training**
   - Provide documentation to end users
   - Consider creating video tutorials

3. **Customization**
   - Modify colors and branding as needed
   - Add additional features if required

4. **Monitor Usage**
   - Track how the tool is being used
   - Gather feedback for improvements

For additional support or customization needs, refer to the SharePoint Framework documentation or contact your SharePoint administrator.