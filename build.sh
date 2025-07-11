#!/bin/bash

# Build script for SharePoint Retrospective Tool
# This script creates a production-ready version of the tool

echo "Building SharePoint Retrospective Tool..."

# Create build directory
mkdir -p build
mkdir -p build/css
mkdir -p build/js

# Copy HTML file
cp src/index.html build/

# Copy CSS (you can add minification here if needed)
cp src/css/retro-tool.css build/css/

# Copy JavaScript (you can add minification here if needed)
cp src/js/retro-tool.js build/js/

# Create a zip file for easy deployment
cd build
zip -r ../sp-retro-tool-deploy.zip .
cd ..

echo "Build complete! Files are in the 'build' directory."
echo "Deployment package: sp-retro-tool-deploy.zip"
echo ""
echo "To deploy to SharePoint:"
echo "1. Upload the contents of the 'build' directory to your SharePoint document library"
echo "2. Follow the deployment guide in DEPLOYMENT.md"
echo ""
echo "Files included:"
echo "- index.html (main application)"
echo "- css/retro-tool.css (styles)"
echo "- js/retro-tool.js (functionality)"