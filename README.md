# # SharePoint Retrospective Tool

A comprehensive web-based retrospective tool designed for SharePoint Online environments to facilitate Scrum retrospectives.

## Features

### ✅ Multi-Column Layout
- **Configurable columns** with customizable headers and placeholders
- **Equal-width responsive design** that adapts to different screen sizes
- **Column reordering** with left/right arrow controls
- **Default columns**: Start, Stop, Continue (customizable)

### ✅ Private Entry Areas
- **Private section** for each column with secure entry
- **"Type here… Press Enter to save"** input fields
- **Individual card publishing** with upload button
- **"Publish All"** functionality for batch publishing

### ✅ Card Management
- **Drag and drop** support for moving cards between columns
- **Card reordering** with up/down arrow controls
- **Card deletion** with confirmation
- **Persistent storage** using localStorage

### ✅ Settings & Configuration
- **Settings modal** for column configuration
- **Add/remove columns** dynamically
- **Edit headers and placeholders** in real-time
- **Responsive settings interface**

### ✅ User Experience
- **Clean, modern interface** with Office UI Fabric styling
- **Hover effects** and smooth animations
- **Mobile-responsive** design
- **Keyboard shortcuts** (Enter to save cards)
- **Empty state indicators** when no cards exist

## Screenshots

### Initial State
![Initial State](https://github.com/user-attachments/assets/77cb8115-1b3b-460a-b739-0570fb0ae410)

### With Cards and Custom Columns
![With Cards](https://github.com/user-attachments/assets/0dfdcc61-c563-4fb0-9c30-48078df1ad33)

## Technical Implementation

### Architecture
- **Pure HTML/CSS/JavaScript** for maximum SharePoint compatibility
- **Modular class-based structure** for maintainability
- **Event delegation** for efficient DOM interaction
- **localStorage persistence** for data retention

### Files Structure
```
src/
├── index.html          # Main HTML structure
├── css/
│   └── retro-tool.css  # Styling and responsive design
└── js/
    └── retro-tool.js   # Core functionality and logic
```

### Key Components
- **RetroTool class**: Main application controller
- **Column management**: Dynamic column creation and configuration
- **Card system**: Private and public card states
- **Settings modal**: Configuration interface
- **Data persistence**: localStorage integration

## Usage Instructions

### For Users
1. **Adding Cards**: Type in the private section and press Enter
2. **Publishing Cards**: Click "Publish" on individual cards or "Publish All"
3. **Reordering**: Use arrow buttons or drag and drop
4. **Configuring**: Click "Settings" to modify columns

### For Administrators
1. **Deployment**: Upload files to SharePoint document library
2. **Integration**: Embed using Script Editor or SPFx
3. **Customization**: Modify CSS for branding
4. **Backup**: Export localStorage data as needed

## SharePoint Integration

### Deployment Options
1. **Script Editor Web Part** (Classic SharePoint)
2. **Embed Web Part** (Modern SharePoint)
3. **Custom SPFx Web Part** (Advanced)

### Permissions Required
- Read/Write to site for file hosting
- No special permissions for localStorage

## Browser Support
- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## Future Enhancements
- Export to Excel/CSV
- Real-time collaboration
- Timer functionality
- Card voting system
- Anonymous mode
- Integration with SharePoint lists
- Email notifications
- Custom themes

## License
This project is licensed under the ISC License.
