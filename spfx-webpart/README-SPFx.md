# SharePoint Framework Retrospective Tool WebPart

A modern SharePoint Framework (SPFx) web part that provides a comprehensive retrospective tool for teams using SharePoint Online.

## Overview

This SPFx web part is built on the original retrospective tool codebase and provides all the same functionality with modern SharePoint integration. It's built using React, TypeScript, and modern web standards.

## Features

### ✅ Complete Feature Parity
- **Multi-column layout** with configurable headers and placeholders
- **Private and public card areas** for secure entry and publishing
- **Drag-and-drop functionality** for organizing cards
- **Settings management** for customizing columns
- **Responsive design** that works on all devices
- **Local storage persistence** for data retention

### ✅ Modern SharePoint Integration
- **Native SPFx WebPart** for SharePoint Online
- **SharePoint theme support** with automatic styling
- **Modern page compatibility** 
- **Microsoft Teams integration** ready
- **Secure deployment** through App Catalog

### ✅ Enhanced User Experience
- **React-based UI** for better performance
- **TypeScript** for better code quality
- **SCSS modules** for maintainable styling
- **Accessibility support** built-in
- **Mobile-optimized** interface

## Quick Start

### Prerequisites
- Node.js 18.17.1 or higher
- SharePoint Online tenant
- Site collection administrator permissions

### Installation

1. **Download the Solution Package**
   - Get the `sp-retro-tool-webpart.sppkg` file from the `sharepoint/solution` directory

2. **Deploy to SharePoint**
   - Upload to your SharePoint App Catalog
   - Deploy the solution tenant-wide or to specific sites

3. **Add to Page**
   - Edit any modern SharePoint page
   - Add the "Retrospective Tool" web part
   - Configure and publish

### Development Setup

```bash
# Clone the repository
git clone [repository-url]

# Navigate to SPFx directory
cd sp-retro-tool/spfx-webpart

# Install dependencies
npm install

# Build the solution
npm run build

# Package for deployment
npm run package-solution
```

## Architecture

### Technology Stack
- **SPFx Framework**: Version 1.21.1
- **React**: Version 17.0.2
- **TypeScript**: Version 4.5.5
- **SCSS**: For styling
- **Office UI Fabric**: For SharePoint theming

### Component Structure
```
src/
├── RetroToolWebPart.ts          # Main web part class
├── RetroToolWebPart.manifest.json # Web part manifest
└── components/
    ├── RetroTool.tsx            # Main React component
    ├── RetroTool.module.scss    # Component styles
    └── IRetroToolProps.ts       # TypeScript interfaces
```

## Configuration

### Web Part Properties
- **Description**: Configurable web part description
- **Environment Detection**: Automatically detects SharePoint/Teams context
- **Theme Integration**: Inherits SharePoint site theme colors

### Default Settings
- **Columns**: Start, Stop, Continue (customizable)
- **Storage**: Browser localStorage
- **Responsive**: Automatic screen size adaptation

## Usage

### For End Users
1. **Adding Cards**: Type in private section, press Enter to save
2. **Publishing**: Click "Publish" on cards or "Publish All" for entire column
3. **Managing**: Use arrow buttons to reorder, drag-and-drop between columns
4. **Settings**: Click Settings to customize columns

### For Administrators
1. **Deployment**: Upload .sppkg to App Catalog
2. **Permissions**: Control through SharePoint permissions
3. **Updates**: Upload new versions through App Catalog

## Development

### Building
```bash
# Debug build
npm run build

# Production build
gulp bundle --production
gulp package-solution --production
```

### Testing
```bash
# Run in local workbench
npm run serve

# Test in SharePoint workbench
# Navigate to https://[tenant].sharepoint.com/_layouts/15/workbench.aspx
```

### Customization
- **Styling**: Modify `RetroTool.module.scss`
- **Functionality**: Update `RetroTool.tsx` component
- **Configuration**: Edit web part properties in `RetroToolWebPart.ts`

## Deployment

### Production Deployment
1. Build production package
2. Upload to SharePoint App Catalog
3. Deploy to tenant or specific sites
4. Add to pages as needed

### Development Deployment
1. Use local workbench for testing
2. Test in SharePoint online workbench
3. Deploy to development tenant

For detailed deployment instructions, see [SPFx-DEPLOYMENT.md](../SPFx-DEPLOYMENT.md).

## File Structure

```
spfx-webpart/
├── config/                     # SPFx configuration
│   ├── config.json            # Bundle configuration
│   ├── package-solution.json  # Solution package config
│   └── serve.json             # Development server config
├── src/                       # Source code
│   ├── components/            # React components
│   ├── RetroToolWebPart.ts   # Main web part
│   └── *.manifest.json       # Web part manifest
├── sharepoint/                # SharePoint assets
│   └── solution/              # Solution package
│       └── *.sppkg           # Deployment package
├── lib/                       # Compiled JavaScript
├── dist/                      # Bundled assets
├── package.json              # Dependencies
├── tsconfig.json             # TypeScript config
└── gulpfile.js               # Build configuration
```

## Browser Support

- **Modern Browsers**: Chrome, Firefox, Safari, Edge
- **SharePoint Online**: Full compatibility
- **Microsoft Teams**: Supported
- **Mobile Browsers**: Responsive design

## Security

### Data Storage
- **localStorage**: Default storage mechanism
- **No External Calls**: No data sent to external servers
- **SharePoint Security**: Inherits SharePoint permissions

### Permissions
- **Read**: View published cards
- **Edit**: Create, edit, and manage cards
- **Design**: Add web part to pages

## Contributing

### Development Guidelines
1. Follow TypeScript best practices
2. Use React hooks and modern patterns
3. Maintain SCSS module structure
4. Add appropriate error handling

### Code Quality
- TypeScript strict mode enabled
- ESLint configuration included
- SCSS linting rules applied
- React component patterns followed

## Troubleshooting

### Common Issues
1. **Build Errors**: Check Node.js version and dependencies
2. **Deployment Fails**: Verify App Catalog permissions
3. **Web Part Not Found**: Check solution deployment status
4. **Data Not Saving**: Verify localStorage is enabled

### Debug Steps
1. Check browser developer tools console
2. Verify SharePoint app catalog deployment
3. Test in different browsers
4. Check SharePoint permissions

## Support

### Getting Help
- Check the [deployment guide](../SPFx-DEPLOYMENT.md)
- Review SharePoint Framework documentation
- Contact your SharePoint administrator

### Reporting Issues
- Provide browser and SharePoint version
- Include error messages and steps to reproduce
- Check browser console for JavaScript errors

## License

This project is licensed under the ISC License - see the [LICENSE](../LICENSE) file for details.

## Changelog

### Version 1.0.0
- Initial SPFx web part implementation
- Full feature parity with original tool
- React/TypeScript architecture
- SharePoint Online integration
- Modern responsive design

## Roadmap

### Future Enhancements
- **SharePoint List Integration**: Store data in SharePoint lists
- **Microsoft Graph Integration**: User profile integration
- **Power Platform Integration**: Connect with Power Apps
- **Advanced Analytics**: Usage tracking and reporting
- **Multi-language Support**: Localization capabilities
- **Real-time Collaboration**: Live updates between users

### Performance Improvements
- **Lazy Loading**: Optimize initial load time
- **Caching**: Implement intelligent caching
- **Bundle Optimization**: Reduce bundle size
- **CDN Integration**: Use SharePoint CDN for assets