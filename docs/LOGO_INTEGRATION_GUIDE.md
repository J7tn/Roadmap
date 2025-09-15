# 🎨 Careering Logo Integration Guide

## 📱 Required Logo Files

Please create these image files from your logo design and place them in the `app-assets` directory:

### App Icons (Android)
- `ic_launcher.png` - 192x192px (main app icon)
- `ic_launcher_foreground.png` - 192x192px (foreground layer - your logo on transparent background)
- `ic_launcher_round.png` - 192x192px (round version)

### Splash Screen
- `splash.png` - 1080x1920px (portrait orientation with your logo centered)

### Web/App Header
- `logo.png` - 200x200px (for app header/navigation)
- `logo-small.png` - 64x64px (for smaller UI elements)

## 🎯 Logo Specifications

### App Icon Requirements:
- **Format**: PNG with transparency
- **Style**: Your logo should be centered on a transparent background
- **Colors**: Keep your black, white, and orange/gold color scheme
- **Size**: 192x192px for all icon variants

### Splash Screen Requirements:
- **Format**: PNG
- **Background**: White or light background that complements your logo
- **Logo Position**: Centered on the screen
- **Size**: 1080x1920px (portrait)

### Web Logo Requirements:
- **Format**: PNG with transparency
- **Background**: Transparent
- **Size**: 200x200px (main), 64x64px (small)

## 🚀 Integration Steps

1. **Create the image files** using your logo design
2. **Place them** in the `app-assets` directory
3. **Run the update script**: `.\update-app-assets.ps1`
4. **Build and test**: `npm run build && npx cap sync && npx cap open android`

## 📝 Notes

- Your logo design is perfect for this app - the upward-reaching figure and star really convey career growth
- The minimalist black/white/orange palette will work great across all platforms
- The dynamic pose suggests movement and progress, which aligns perfectly with "Careering"
