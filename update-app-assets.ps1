# Careering - App Assets Update Script
# This script helps you update the app icon and splash screen

Write-Host "🎨 Careering - App Assets Update Script" -ForegroundColor Green
Write-Host ""

# Check if required directories exist
$assetsDir = ".\app-assets"
if (-not (Test-Path $assetsDir)) {
    Write-Host "📁 Creating app-assets directory..." -ForegroundColor Yellow
    New-Item -ItemType Directory -Path $assetsDir
}

Write-Host "📋 Please place your image files in the 'app-assets' directory:" -ForegroundColor Cyan
Write-Host ""
Write-Host "Required files:" -ForegroundColor White
Write-Host "  📱 App Icons:" -ForegroundColor Yellow
Write-Host "    - ic_launcher.png (192x192px)" -ForegroundColor Gray
Write-Host "    - ic_launcher_foreground.png (192x192px)" -ForegroundColor Gray
Write-Host "    - ic_launcher_round.png (192x192px)" -ForegroundColor Gray
Write-Host ""
Write-Host "  🖼️ Splash Screen:" -ForegroundColor Yellow
Write-Host "    - splash.png (1080x1920px for portrait)" -ForegroundColor Gray
Write-Host ""
Write-Host "  🌐 Web/App Logos:" -ForegroundColor Yellow
Write-Host "    - logo.png (200x200px for app header)" -ForegroundColor Gray
Write-Host "    - logo-small.png (64x64px for navigation)" -ForegroundColor Gray
Write-Host ""

# Check if files exist
$requiredFiles = @(
    "ic_launcher.png",
    "ic_launcher_foreground.png", 
    "ic_launcher_round.png",
    "splash.png",
    "logo.png",
    "logo-small.png"
)

$missingFiles = @()
foreach ($file in $requiredFiles) {
    if (-not (Test-Path "$assetsDir\$file")) {
        $missingFiles += $file
    }
}

if ($missingFiles.Count -gt 0) {
    Write-Host "❌ Missing required files:" -ForegroundColor Red
    foreach ($file in $missingFiles) {
        Write-Host "    - $file" -ForegroundColor Red
    }
    Write-Host ""
    Write-Host "Please add these files to the 'app-assets' directory and run this script again." -ForegroundColor Yellow
    Read-Host "Press Enter to continue"
    exit 1
}

Write-Host "✅ All required files found!" -ForegroundColor Green
Write-Host ""

# Function to copy files to Android directories
function Copy-ToAndroid {
    param($sourceFile, $targetDir)
    
    if (Test-Path $sourceFile) {
        Copy-Item $sourceFile $targetDir -Force
        Write-Host "  ✅ Copied to $targetDir" -ForegroundColor Green
    } else {
        Write-Host "  ❌ Source file not found: $sourceFile" -ForegroundColor Red
    }
}

Write-Host "🔄 Updating Android app icons..." -ForegroundColor Yellow

# Copy app icons to all density folders
$densityFolders = @("mipmap-hdpi", "mipmap-mdpi", "mipmap-xhdpi", "mipmap-xxhdpi", "mipmap-xxxhdpi")

foreach ($density in $densityFolders) {
    $targetDir = ".\android\app\src\main\res\$density"
    Write-Host "  📁 Updating $density..." -ForegroundColor Cyan
    
    Copy-ToAndroid "$assetsDir\ic_launcher.png" "$targetDir\ic_launcher.png"
    Copy-ToAndroid "$assetsDir\ic_launcher_foreground.png" "$targetDir\ic_launcher_foreground.png"
    Copy-ToAndroid "$assetsDir\ic_launcher_round.png" "$targetDir\ic_launcher_round.png"
}

Write-Host ""
Write-Host "🖼️ Updating splash screen..." -ForegroundColor Yellow

# Copy splash screen to all orientation and density folders
$splashFolders = @(
    "drawable",
    "drawable-land-hdpi", "drawable-land-mdpi", "drawable-land-xhdpi", "drawable-land-xxhdpi", "drawable-land-xxxhdpi",
    "drawable-port-hdpi", "drawable-port-mdpi", "drawable-port-xhdpi", "drawable-port-xxhdpi", "drawable-port-xxxhdpi"
)

foreach ($folder in $splashFolders) {
    $targetDir = ".\android\app\src\main\res\$folder"
    Write-Host "  📁 Updating $folder..." -ForegroundColor Cyan
    
    Copy-ToAndroid "$assetsDir\splash.png" "$targetDir\splash.png"
}

Write-Host ""
Write-Host "🌐 Updating web logos..." -ForegroundColor Yellow

# Copy web logos to public directory
$publicDir = ".\public"
if (Test-Path $publicDir) {
    Write-Host "  📁 Copying to public directory..." -ForegroundColor Cyan
    
    Copy-ToAndroid "$assetsDir\logo.png" "$publicDir\logo.png"
    Copy-ToAndroid "$assetsDir\logo-small.png" "$publicDir\logo-small.png"
} else {
    Write-Host "  ❌ Public directory not found" -ForegroundColor Red
}

Write-Host ""
Write-Host "🎉 App assets updated successfully!" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "  1. Run: npm run build" -ForegroundColor White
Write-Host "  2. Run: npx cap sync" -ForegroundColor White
Write-Host "  3. Run: npx cap open android" -ForegroundColor White
Write-Host "  4. Build and test your app in Android Studio" -ForegroundColor White
Write-Host ""
Write-Host "💡 Tip: You can also update the app name in:" -ForegroundColor Yellow
Write-Host "  - capacitor.config.json (appName)" -ForegroundColor Gray
Write-Host "  - android/app/src/main/res/values/strings.xml (app_name)" -ForegroundColor Gray
Write-Host ""

Read-Host "Press Enter to continue"
