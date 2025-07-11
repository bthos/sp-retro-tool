# SharePoint Deployment Guide

This guide provides step-by-step instructions for deploying the Retrospective Tool to SharePoint Online.

## Deployment Methods

### Method 1: Script Editor Web Part (Classic SharePoint)

1. **Upload Files**:
   - Navigate to your SharePoint site
   - Go to Site Contents > Documents (or create a new document library)
   - Upload the `src` folder contents to the library
   - Note the URL paths to your files

2. **Add Web Part**:
   - Go to the page where you want to add the tool
   - Edit the page and add a "Script Editor" web part
   - Edit the web part and add the following code:

```html
<div id="retro-tool-container"></div>
<link rel="stylesheet" href="/sites/yoursite/Documents/css/retro-tool.css">
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
<script src="/sites/yoursite/Documents/js/retro-tool.js"></script>
```

3. **Update Paths**:
   - Replace `/sites/yoursite/Documents/` with your actual SharePoint site path
   - Save and publish the page

### Method 2: Embed Web Part (Modern SharePoint)

1. **Upload Files**:
   - Upload files to a document library as described above
   - Ensure files are accessible (not restricted)

2. **Add Embed Web Part**:
   - Edit your SharePoint page
   - Add an "Embed" web part
   - Use the following embed code:

```html
<iframe src="/sites/yoursite/Documents/index.html" 
        width="100%" 
        height="800px" 
        frameborder="0">
</iframe>
```

3. **Configure**:
   - Adjust height as needed
   - Test the embedded tool

### Method 3: Content Editor Web Part (SharePoint 2019/2016)

1. **Upload Files** to document library
2. **Add Content Editor Web Part** to page
3. **Edit Web Part** and set Content Link to your `index.html` file
4. **Apply and save** the page

## File Structure in SharePoint

```
Documents/
├── index.html
├── css/
│   └── retro-tool.css
└── js/
    └── retro-tool.js
```

## Security Considerations

### Permissions
- Ensure users have **Read** access to the document library
- Consider creating a dedicated library for web parts
- Test with different user permission levels

### Content Security Policy
- Some SharePoint tenants have strict CSP policies
- The tool uses inline styles and scripts
- May require admin approval for external CDN resources (Font Awesome)

### Data Storage
- Tool uses localStorage for data persistence
- Data is stored locally in user's browser
- Consider backup/export functionality for important data

## Troubleshooting

### Common Issues

1. **Files Not Loading**:
   - Check file paths in HTML
   - Verify permissions on document library
   - Ensure files are checked in and published

2. **Styling Issues**:
   - Verify CSS file path
   - Check for SharePoint CSS conflicts
   - Test in different browsers

3. **JavaScript Errors**:
   - Open browser developer tools
   - Check console for errors
   - Verify all scripts are loading

4. **Responsive Issues**:
   - Test on different screen sizes
   - Check SharePoint page layout
   - Verify CSS media queries

### Debug Steps

1. **Check Network Tab**:
   - Open browser developer tools
   - Check if all files are loading (200 status)
   - Look for 404 errors

2. **Test File Access**:
   - Try accessing files directly via URL
   - Verify no authentication challenges
   - Check file permissions

3. **Console Errors**:
   - Check browser console for JavaScript errors
   - Verify Font Awesome CDN access
   - Test localStorage functionality

## Customization

### Branding
- Modify `retro-tool.css` for custom colors
- Update header styles for organization branding
- Add custom logos or images

### Features
- Modify default columns in `retro-tool.js`
- Add custom card types or categories
- Implement custom export functionality

### Integration
- Connect to SharePoint lists for data storage
- Add user authentication checks
- Implement team-specific configurations

## Performance Optimization

### Best Practices
- Host CSS and JS files in SharePoint
- Use minified versions for production
- Implement caching strategies
- Optimize images and icons

### Monitoring
- Monitor page load times
- Track user engagement
- Gather feedback for improvements

## Support

### User Training
- Provide user guides and tutorials
- Create video demonstrations
- Offer hands-on training sessions

### Maintenance
- Regular updates for browser compatibility
- Monitor for SharePoint updates
- Backup user data periodically

## Advanced Configuration

### Multiple Teams
- Create separate instances for different teams
- Implement team-specific configurations
- Add team identification features

### Data Export
- Implement export to Excel functionality
- Add PDF report generation
- Create data archiving procedures

### Integration Options
- Connect to Microsoft Teams
- Integrate with Project Online
- Add calendar scheduling features