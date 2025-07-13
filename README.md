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

## 🚀 Quick Start

### Prerequisites
- Node.js 20.0.0 or higher
- SharePoint Online tenant with Site Collection Admin rights
- SharePoint App Catalog created

### Installation & Deployment

#### Option 1: Automated Setup (Recommended)
```bash
# Clone and setup
git clone [repository-url]
cd sp-retro-tool
npm install

# Interactive setup
npm run setup

# Build and deploy
npm run deploy:full
```

#### Option 2: Manual Setup
```bash
# Clone and setup
git clone [repository-url]
cd sp-retro-tool
npm install

# Configure environment
cp .env.example .env
# Edit .env with your tenant details:
# M365_USERNAME=admin@[your-tenant].onmicrosoft.com
# M365_PASSWORD=your-password
# SHAREPOINT_TENANT_URL=https://[your-tenant].sharepoint.com
# APP_CATALOG_URL=https://[your-tenant].sharepoint.com/sites/appcatalog

# Build and deploy
npm run deploy:full
```

#### Option 3: Manual Upload
```bash
# Build package
npm run build:production
npm run package:production

# Upload sharepoint/solution/sp-retro-tool-webpart.sppkg to App Catalog
# Deploy solution tenant-wide
# Add webpart to modern pages
```

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

## 🔧 Troubleshooting

### Common Issues
- **Build Errors**: Check Node.js version (20.0.0+ required)
- **Deployment Fails**: Verify credentials and app catalog access
- **Webpart Missing**: Ensure solution is deployed tenant-wide

### Debug Steps
1. Check browser developer tools console
2. Verify .env file configuration
3. Test with `npm run serve` locally
4. Confirm SharePoint App Catalog access

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
For issues, questions, or feature requests, please create an issue in the repository or contact your SharePoint administrator.

## Browser Support
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+
- SharePoint Online compatible

## Future Enhancements
- SharePoint List integration
- Real-time collaboration via SignalR
- Export to Excel/CSV
- Microsoft Teams integration
- Card voting system
- Anonymous mode
- Integration with SharePoint lists
- Email notifications
- Custom themes

## License
This project is licensed under the ISC License.
