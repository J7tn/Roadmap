# 🎨 Careering - App Assets Customization Guide

This guide will help you customize your app's logo and splash screen.

## 📱 Required Image Files

### App Icons (Android)
Place these files in the `app-assets` directory:

| File | Size | Description |
|------|------|-------------|
| `ic_launcher.png` | 192x192px | Main app icon (square) |
| `ic_launcher_foreground.png` | 192x192px | Foreground layer (transparent background) |
| `ic_launcher_round.png` | 192x192px | Round app icon version |

### Splash Screen
| File | Size | Description |
|------|------|-------------|
| `splash.png` | 1080x1920px | Portrait splash screen (recommended) |

## 🚀 Quick Setup

1. **Create your images** using the specifications above
2. **Place them** in the `app-assets` directory
3. **Run the update script**:
   ```powershell
   .\update-app-assets.ps1
   ```
4. **Build and sync**:
   ```bash
   npm run build
   npx cap sync
   npx cap open android
   ```

## 🎨 Design Guidelines

### App Icon Design
- **Keep it simple**: Icons should be recognizable at small sizes
- **Use high contrast**: Ensure visibility on various backgrounds
- **Follow Material Design**: Use the foreground/background layer system
- **Test on device**: Icons look different on actual devices

### Splash Screen Design
- **Match your brand**: Use your app's color scheme and logo
- **Keep it clean**: Avoid too much text or complex graphics
- **Consider loading time**: 2-second duration (configurable)
- **Test orientations**: Ensure it looks good in both portrait and landscape

## ⚙️ Advanced Configuration

### Splash Screen Settings
Edit `capacitor.config.json` to customize:

```json
{
  "plugins": {
    "SplashScreen": {
      "launchShowDuration": 2000,        // Duration in milliseconds
      "backgroundColor": "#ffffff",      // Background color
      "showSpinner": true,               // Show loading spinner
      "spinnerColor": "#3b82f6",        // Spinner color
      "androidSplashResourceName": "splash",
      "splashFullScreen": true,
      "splashImmersive": true
    }
  }
}
```

### App Name
Update the app name in:
- `capacitor.config.json` → `appName`
- `android/app/src/main/res/values/strings.xml` → `app_name`

## 🔧 Manual Installation

If you prefer to manually replace the files:

### App Icons
Copy your icon files to these directories:
```
android/app/src/main/res/mipmap-hdpi/
android/app/src/main/res/mipmap-mdpi/
android/app/src/main/res/mipmap-xhdpi/
android/app/src/main/res/mipmap-xxhdpi/
android/app/src/main/res/mipmap-xxxhdpi/
```

### Splash Screen
Copy your splash screen to these directories:
```
android/app/src/main/res/drawable/
android/app/src/main/res/drawable-land-hdpi/
android/app/src/main/res/drawable-land-mdpi/
android/app/src/main/res/drawable-land-xhdpi/
android/app/src/main/res/drawable-land-xxhdpi/
android/app/src/main/res/drawable-land-xxxhdpi/
android/app/src/main/res/drawable-port-hdpi/
android/app/src/main/res/drawable-port-mdpi/
android/app/src/main/res/drawable-port-xhdpi/
android/app/src/main/res/drawable-port-xxhdpi/
android/app/src/main/res/drawable-port-xxxhdpi/
```

## 🎯 Pro Tips

1. **Use vector graphics** when possible for crisp icons at all sizes
2. **Test on multiple devices** to ensure your assets look good everywhere
3. **Keep file sizes small** for faster app loading
4. **Use PNG format** for best compatibility
5. **Consider dark mode** - test your assets on both light and dark themes

## 🐛 Troubleshooting

### Icons not updating?
- Clear Android Studio cache: `Build` → `Clean Project`
- Delete `android/app/build` folder and rebuild
- Ensure file names match exactly (case-sensitive)

### Splash screen issues?
- Check image dimensions match requirements
- Verify file is in all required directories
- Test on actual device, not just emulator

### Build errors?
- Ensure all required files are present
- Check file permissions
- Run `npx cap sync` after making changes

## 📞 Support

If you encounter issues:
1. Check the console for error messages
2. Verify all file paths and names are correct
3. Ensure images meet size requirements
4. Try cleaning and rebuilding the project

Happy customizing! 🎨
