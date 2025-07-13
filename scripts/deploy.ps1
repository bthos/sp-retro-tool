# SharePoint Online Deployment Script
# PowerShell version for Windows environments

param(
    [Parameter(Mandatory=$true)]
    [string]$Username,
    
    [Parameter(Mandatory=$true)]
    [SecureString]$Password,
    
    [string]$TenantUrl = "https://[your-tenant].sharepoint.com",
    [string]$AppCatalogUrl = "https://[your-tenant].sharepoint.com/sites/appcatalog"
)

# Convert SecureString to plain text for CLI
$PlainPassword = [Runtime.InteropServices.Marshal]::PtrToStringAuto([Runtime.InteropServices.Marshal]::SecureStringToBSTR($Password))

Write-Host "🚀 Starting SharePoint deployment..." -ForegroundColor Green

try {
    # Find the .sppkg file
    $SolutionDir = Join-Path $PSScriptRoot "../sharepoint/solution"
    if (-not (Test-Path $SolutionDir)) {
        throw "Solution directory not found. Run 'npm run package:production' first."
    }
    
    $PackageFile = Get-ChildItem -Path $SolutionDir -Filter "*.sppkg" | Select-Object -First 1
    if (-not $PackageFile) {
        throw "No .sppkg file found. Run 'npm run package:production' first."
    }
    
    Write-Host "📦 Found package: $($PackageFile.Name)" -ForegroundColor Cyan
    
    # Login to Microsoft 365
    Write-Host "🔐 Logging into Microsoft 365..." -ForegroundColor Yellow
    & npx m365 login --authType password --userName $Username --password $PlainPassword
    
    if ($LASTEXITCODE -ne 0) {
        throw "Failed to login to Microsoft 365"
    }
    
    # Upload to app catalog
    Write-Host "📤 Uploading to App Catalog..." -ForegroundColor Yellow
    & npx m365 spo app add --filePath $PackageFile.FullName --appCatalogUrl $AppCatalogUrl --overwrite
    
    if ($LASTEXITCODE -ne 0) {
        throw "Failed to upload to App Catalog"
    }
    
    # Get app information
    Write-Host "🔍 Getting app information..." -ForegroundColor Yellow
    $AppListJson = & npx m365 spo app list --appCatalogUrl $AppCatalogUrl --output json
    $Apps = $AppListJson | ConvertFrom-Json
    $TargetApp = $Apps | Where-Object { $_.Title -eq "sp-retro-tool-webpart" }
    
    if (-not $TargetApp) {
        throw "App 'sp-retro-tool-webpart' not found in app catalog"
    }
    
    Write-Host "📱 Found app: $($TargetApp.Title) (ID: $($TargetApp.ID))" -ForegroundColor Cyan
    
    # Deploy the app
    Write-Host "🚀 Deploying app tenant-wide..." -ForegroundColor Yellow
    & npx m365 spo app deploy --id $TargetApp.ID --appCatalogUrl $AppCatalogUrl --skipFeatureDeployment
    
    if ($LASTEXITCODE -ne 0) {
        throw "Failed to deploy app"
    }
    
    Write-Host "🎉 Deployment completed successfully!" -ForegroundColor Green
    Write-Host "📝 App is now available at: $TenantUrl" -ForegroundColor Cyan
    Write-Host "💡 You can now add the web part to any modern SharePoint page." -ForegroundColor Cyan
    
} catch {
    Write-Host "💥 Deployment failed: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
} finally {
    # Logout
    Write-Host "🔐 Logging out..." -ForegroundColor Yellow
    & npx m365 logout | Out-Null
}

# Usage example:
# .\deploy.ps1 -Username "admin@[your-tenant].onmicrosoft.com" -Password (ConvertTo-SecureString "password" -AsPlainText -Force)
