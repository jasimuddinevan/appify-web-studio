
#!/bin/bash

echo "Setting up Appify Server environment..."

# Install Node.js dependencies
echo "Installing Node.js dependencies..."
npm install

# Check for required tools
echo "Checking for required tools..."

# Check for Java
if command -v java &> /dev/null; then
    echo "✓ Java is installed"
    java -version
else
    echo "✗ Java is not installed. Please install JDK 11 or higher."
    echo "  You can download it from: https://adoptium.net/"
fi

# Check for Android SDK
if [ -z "$ANDROID_HOME" ] && [ -z "$ANDROID_SDK_ROOT" ]; then
    echo "✗ Android SDK environment variables not set."
    echo "  Please set ANDROID_HOME or ANDROID_SDK_ROOT to your Android SDK location."
    echo "  Example: export ANDROID_HOME=~/Android/Sdk"
else
    if [ -n "$ANDROID_HOME" ]; then
        echo "✓ Android SDK found at: $ANDROID_HOME"
    else
        echo "✓ Android SDK found at: $ANDROID_SDK_ROOT"
    fi
    
    # Check for build tools
    if [ -n "$ANDROID_HOME" ] && [ -d "$ANDROID_HOME/build-tools" ]; then
        echo "✓ Android build tools found"
    elif [ -n "$ANDROID_SDK_ROOT" ] && [ -d "$ANDROID_SDK_ROOT/build-tools" ]; then
        echo "✓ Android build tools found"
    else
        echo "✗ Android build tools not found. Please install them using Android Studio."
    fi
fi

# Check for ImageMagick (used for image resizing)
if command -v convert &> /dev/null; then
    echo "✓ ImageMagick is installed"
    convert -version | head -n 1
else
    echo "✗ ImageMagick is not installed (optional, used for icon resizing)."
    echo "  You can install it using your package manager:"
    echo "  - Ubuntu/Debian: sudo apt-get install imagemagick"
    echo "  - macOS: brew install imagemagick"
    echo "  - Windows: Download from https://imagemagick.org/script/download.php"
fi

# Create necessary directories
echo "Creating necessary directories..."
mkdir -p uploads temp outputs

echo "Setup completed!"
echo "You can start the server with: npm start"
