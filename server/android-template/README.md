
# Android WebView App Template

This template provides a basic Android WebView app that can be customized to load any website URL.
It's designed to be used with the Appify server to generate Android APKs for websites.

## Features

- WebView configuration with customizable settings
- Support for offline mode
- Customizable navigation styles
- Splash screen support
- Status bar color customization

## Structure

- `app/src/main/java/com/appify/webview/` - Java source files
- `app/src/main/res/` - Resources (layouts, drawables, values)
- `app/src/main/AndroidManifest.xml` - App manifest
- `app/build.gradle` - App build configuration
- `keystore/` - Contains keystore for APK signing

## Customization

The template can be customized using the following parameters:

- `WEB_URL` - The website URL to load
- `APP_NAME` - The name of the app
- `PRIMARY_COLOR` - The primary color for the app
- `NAVIGATION_STYLE` - Style of the navigation (e.g., "immersive", "standard")
- `OFFLINE_SUPPORT` - Whether to enable offline caching
- `PUSH_NOTIFICATIONS` - Whether to enable push notifications
- `SCREEN_ORIENTATION` - The screen orientation ("portrait", "landscape", or "auto")
- `ZOOM_ENABLED` - Whether to enable pinch-to-zoom
- `CACHE_LEVEL` - Level of caching ("none", "minimal", "moderate", "aggressive")
