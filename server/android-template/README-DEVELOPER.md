
# Android WebView App Template for Developers

This template provides a starting point for creating Android WebView apps that wrap web content. 
The code is designed to be customizable based on client requirements.

## Setup Instructions

### Prerequisites

- Android Studio 4.0+
- JDK 8 or newer
- Android SDK with Build Tools 30.0.3 or newer

### Getting Started

1. Open the project in Android Studio
2. Configure the app using the gradle.properties or by passing parameters to the gradle build command
3. Build the app using Gradle

## Customization Points

### Main Configuration

The app can be customized using the following Gradle properties:

- `WEB_URL`: The URL to load in the WebView
- `APP_NAME`: The name of the application
- `PRIMARY_COLOR`: The main color for the app (hex format)
- `NAVIGATION_STYLE`: Can be "standard", "immersive", or "transparent"
- `OFFLINE_SUPPORT`: Boolean value for offline caching support
- `PUSH_NOTIFICATIONS`: Boolean value for push notification support
- `SCREEN_ORIENTATION`: Can be "portrait", "landscape", or "auto"
- `ZOOM_ENABLED`: Boolean value to enable/disable pinch zoom
- `CACHE_LEVEL`: Can be "none", "minimal", "moderate", or "aggressive"

### Example Build Command

```bash
./gradlew assembleRelease \
  -PWEB_URL=https://example.com \
  -PAPP_NAME="My Web App" \
  -PPRIMARY_COLOR="#FF5733" \
  -PNAVIGATION_STYLE=immersive \
  -POFFLINE_SUPPORT=true \
  -PPUSH_NOTIFICATIONS=false \
  -PSCREEN_ORIENTATION=portrait \
  -PZOOM_ENABLED=true \
  -PCACHE_LEVEL=moderate
```

## APK Signing

The template includes a default keystore for signing APKs in the release build. For production use, 
you should generate your own keystore using the provided `keystore-gen.sh` script or manually.

### Custom Keystore Configuration

To use a custom keystore, update the `signingConfigs` section in `app/build.gradle`:

```gradle
signingConfigs {
    release {
        storeFile file('/path/to/your/keystore.jks')
        storePassword 'your-store-password'
        keyAlias 'your-key-alias'
        keyPassword 'your-key-password'
    }
}
```

## Implementation Details

### Key Components

- `MainActivity.java`: The main activity with WebView configuration
- `SplashActivity.java`: A splash screen displayed during app startup
- Layout files in `res/layout/`: UI definitions
- Resource files in `res/values/`: Strings, colors, and styles

### WebView Features

- JavaScript enabled
- Local storage enabled
- Custom user agent (optional)
- Error handling for offline mode
- Pull-to-refresh functionality
- External link handling
- File download support

## Advanced Customization

For more advanced customization, consider modifying:

1. `MainActivity.java` for WebView behavior changes
2. `res/values/styles.xml` for UI theme adjustments
3. `AndroidManifest.xml` for permissions and activity declarations
