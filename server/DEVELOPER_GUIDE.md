
# WebToAPK Builder - Developer Guide

This guide provides detailed instructions for setting up the WebToAPK Builder server on different environments.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Installation on Windows](#installation-on-windows)
- [Installation on Linux](#installation-on-linux)
- [Installation on cPanel](#installation-on-cpanel)
- [Configuration](#configuration)
- [Troubleshooting](#troubleshooting)
- [Build Process Flow](#build-process-flow)

## Prerequisites

The WebToAPK Builder requires the following software to be installed:

- Node.js (v14.x or newer)
- NPM (v6.x or newer)
- Java Development Kit (JDK 11 or newer)
- Android SDK with build-tools (minimum API level 26)
- ImageMagick (optional, for icon resizing)

For Android SDK setup, you need:
- Android SDK Platform-tools
- Android SDK Build-tools (latest version)
- Android SDK Command-line Tools
- At least one Android Platform SDK (API level 26 or higher recommended)

## Installation on Windows

### Step 1: Install Node.js and NPM
1. Download Node.js from [nodejs.org](https://nodejs.org/)
2. Run the installer and follow the installation wizard
3. Verify installation by opening Command Prompt and running:
   ```
   node --version
   npm --version
   ```

### Step 2: Install JDK
1. Download JDK from [Adoptium](https://adoptium.net/)
2. Run the installer and follow the wizard
3. Set JAVA_HOME environment variable:
   - Right-click on 'This PC' > Properties > Advanced system settings > Environment Variables
   - Add a new system variable JAVA_HOME pointing to your JDK installation folder (e.g., C:\Program Files\Java\jdk-11)
   - Add %JAVA_HOME%\bin to the PATH variable

### Step 3: Install Android SDK
1. Download Android Studio from [developer.android.com](https://developer.android.com/studio)
2. Install Android Studio and follow the setup wizard
3. Open Android Studio > Tools > SDK Manager
4. Install required SDK components:
   - Android SDK Platform-tools
   - Android SDK Build-tools
   - Android SDK Command-line Tools
   - At least one Android Platform SDK
5. Set ANDROID_HOME environment variable to your Android SDK location (e.g., C:\Users\YourName\AppData\Local\Android\Sdk)

### Step 4: Set up WebToAPK Builder Server
1. Clone the repository or extract source files to your server directory
2. Open Command Prompt and navigate to the server directory
3. Install dependencies:
   ```
   cd server
   npm install
   ```
4. Create a keystore for APK signing (or use an existing one):
   ```
   node generate-keystore.js
   ```
5. Start the server:
   ```
   npm start
   ```
6. The server should now be running on http://localhost:5000

### Step 5: Configure as a Windows Service (Optional)
To run the server as a Windows Service:
1. Install the `node-windows` package:
   ```
   npm install -g node-windows
   npm link node-windows
   ```
2. Create a service installer script (install-service.js):
   ```javascript
   const Service = require('node-windows').Service;
   const svc = new Service({
     name: 'WebToAPK Builder',
     description: 'WebToAPK Builder Server',
     script: 'C:\\path\\to\\your\\server\\server.js'
   });
   svc.on('install', function() {
     svc.start();
   });
   svc.install();
   ```
3. Run the installer:
   ```
   node install-service.js
   ```

## Installation on Linux

### Step 1: Install Node.js and NPM
```bash
# Using Ubuntu/Debian
curl -fsSL https://deb.nodesource.com/setup_16.x | sudo -E bash -
sudo apt-get install -y nodejs

# Using CentOS/RHEL
curl -fsSL https://rpm.nodesource.com/setup_16.x | sudo bash -
sudo yum install -y nodejs

# Verify installation
node --version
npm --version
```

### Step 2: Install JDK
```bash
# Ubuntu/Debian
sudo apt-get update
sudo apt-get install -y openjdk-11-jdk

# CentOS/RHEL
sudo yum install -y java-11-openjdk-devel

# Set JAVA_HOME
echo "export JAVA_HOME=/usr/lib/jvm/java-11-openjdk-amd64" >> ~/.bashrc
echo "export PATH=\$PATH:\$JAVA_HOME/bin" >> ~/.bashrc
source ~/.bashrc
```

### Step 3: Install Android SDK
```bash
# Create directory for Android SDK
mkdir -p ~/Android/Sdk
cd ~/Android/Sdk

# Download Android SDK command line tools
wget https://dl.google.com/android/repository/commandlinetools-linux-7583922_latest.zip
unzip commandlinetools-linux-7583922_latest.zip
mkdir -p cmdline-tools/latest
mv cmdline-tools/* cmdline-tools/latest/
rmdir cmdline-tools/latest/cmdline-tools

# Set Android SDK environment variables
echo "export ANDROID_HOME=$HOME/Android/Sdk" >> ~/.bashrc
echo "export PATH=\$PATH:\$ANDROID_HOME/cmdline-tools/latest/bin:\$ANDROID_HOME/platform-tools:\$ANDROID_HOME/build-tools/33.0.0" >> ~/.bashrc
source ~/.bashrc

# Install required SDK components
sdkmanager "platform-tools" "build-tools;33.0.0" "platforms;android-33"
```

### Step 4: Install ImageMagick (Optional)
```bash
# Ubuntu/Debian
sudo apt-get install -y imagemagick

# CentOS/RHEL
sudo yum install -y ImageMagick
```

### Step 5: Set up WebToAPK Builder Server
```bash
# Clone repository or copy files
git clone <repository-url> webtoapp
cd webtoapp/server

# Install dependencies
npm install

# Create keystore for signing APKs
node generate-keystore.js

# Start the server
npm start
```

### Step 6: Set up as a Systemd Service (Optional)
1. Create a systemd service file:
```bash
sudo nano /etc/systemd/system/webtoapp.service
```

2. Add the following content:
```
[Unit]
Description=WebToAPK Builder Server
After=network.target

[Service]
Type=simple
User=<your-user>
WorkingDirectory=/path/to/webtoapp/server
ExecStart=/usr/bin/node server.js
Restart=on-failure
Environment=NODE_ENV=production

[Install]
WantedBy=multi-user.target
```

3. Enable and start the service:
```bash
sudo systemctl enable webtoapp
sudo systemctl start webtoapp
```

4. Check service status:
```bash
sudo systemctl status webtoapp
```

## Installation on cPanel

### Step 1: Access Your cPanel Account
1. Log in to your cPanel account
2. Navigate to the "Software" section

### Step 2: Set up Node.js
1. In cPanel, look for "Setup Node.js App"
2. Click "Create Application"
3. Select the latest Node.js version
4. Set up your application:
   - Application mode: Production
   - Application root: Path where you want to install (e.g., /home/username/webtoapp)
   - Application URL: Your preferred subdomain or domain
   - Application startup file: server.js

### Step 3: Install Dependencies
1. Access your server using SSH or Terminal in cPanel File Manager
2. Navigate to your application directory
3. Upload your application files to this directory
4. Run the following commands:
```bash
cd server
npm install
node generate-keystore.js
```

### Step 4: Configure Environment
Since cPanel doesn't typically have Android SDK installed, you'll need to:

1. Install Android SDK on a separate machine
2. Pre-compile your APK templates
3. Set up the server to use these templates without requiring full SDK access

Modify your server configuration:
```bash
nano config.js
```
Update the paths to point to your pre-compiled resources.

### Step 5: Start Your Application
1. In cPanel, go back to "Setup Node.js App"
2. Find your application and click "Run JS Script"
3. Your server should now be running

### Using PM2 with cPanel (Recommended)
1. Install PM2 globally:
```bash
npm install -g pm2
```
2. Start your application with PM2:
```bash
pm2 start server.js --name "webtoapp"
pm2 save
```
3. Set up PM2 to start on boot (may require hosting provider support)

## Configuration

### Environment Variables
Create a `.env` file in the server directory with the following variables:

```
PORT=5000
NODE_ENV=production
UPLOAD_DIR=uploads
OUTPUT_DIR=outputs
TEMP_DIR=temp
KEYSTORE_PATH=keystore/appify-release-key.keystore
KEYSTORE_PASS=your_keystore_password
KEY_ALIAS=appify
KEY_PASS=your_key_password

# Google Drive API settings (if using Google Drive uploads)
GOOGLE_DRIVE_CLIENT_ID=your_client_id
GOOGLE_DRIVE_CLIENT_SECRET=your_client_secret
GOOGLE_DRIVE_REDIRECT_URI=your_redirect_uri
GOOGLE_DRIVE_REFRESH_TOKEN=your_refresh_token
```

### Server Configuration
Edit `server/config.js` to adjust server settings:

```javascript
module.exports = {
  port: process.env.PORT || 5000,
  uploadDir: process.env.UPLOAD_DIR || 'uploads',
  outputDir: process.env.OUTPUT_DIR || 'outputs',
  tempDir: process.env.TEMP_DIR || 'temp',
  keystorePath: process.env.KEYSTORE_PATH || 'keystore/appify-release-key.keystore',
  keystorePass: process.env.KEYSTORE_PASS || 'changeit',
  keyAlias: process.env.KEY_ALIAS || 'appify',
  keyPass: process.env.KEY_PASS || 'changeit',
  googleDrive: {
    enabled: !!process.env.GOOGLE_DRIVE_REFRESH_TOKEN,
    clientId: process.env.GOOGLE_DRIVE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_DRIVE_CLIENT_SECRET,
    redirectUri: process.env.GOOGLE_DRIVE_REDIRECT_URI,
    refreshToken: process.env.GOOGLE_DRIVE_REFRESH_TOKEN
  }
};
```

## Troubleshooting

### Common Issues

#### Server Won't Start

**Symptom:** `npm start` fails with errors.

**Solutions:**
- Check Node.js version: `node --version` (should be v14.x or newer)
- Check for port conflicts: Make sure port 5000 (or your configured port) is available
- Check log files: Look at the server logs for detailed error messages
- Verify all dependencies are installed: Run `npm install` again

#### APK Building Fails

**Symptom:** Server starts but APK generation fails.

**Solutions:**
- Check Java installation: `java -version` (should be version 11 or newer)
- Verify Android SDK installation: Check if `ANDROID_HOME` is correctly set
- Check Android SDK components: Ensure all required components are installed
- Look at build logs: Check `temp/<buildId>/build.log` for detailed errors

#### Upload Issues

**Symptom:** File uploads fail.

**Solutions:**
- Check upload directory permissions: Ensure the server has write access to the upload directory
- Check file size limits: Large files might be rejected by default Node.js settings
- Verify multer configuration: Check for any syntax errors in the multer setup

### Checking Logs

Server logs are crucial for troubleshooting:

1. Check Node.js server logs:
   - Default: Console output where you started the server
   - PM2: `pm2 logs webtoapp`
   - Systemd: `journalctl -u webtoapp`

2. Build process logs:
   - Located in `temp/<buildId>/build.log`
   - Contains detailed Android build process output

3. Application error logs:
   - Located in `server/error.log` (if configured)

### Getting Help

If you can't resolve issues using this guide:

1. Check the GitHub repository issues section
2. Join our developer community
3. Contact support with the following information:
   - Server environment (OS, Node.js version)
   - Error logs
   - Steps to reproduce the issue

## Build Process Flow

Understanding the build process can help with troubleshooting:

1. **Client Submits Build Request**
   - Web app sends configuration to `/api/generate-apk` endpoint
   - Files are uploaded via `/api/upload-config` endpoint

2. **Server Processes Request**
   - Creates a unique build directory in `temp/<buildId>/`
   - Copies Android template to build directory
   - Customizes template according to user configuration

3. **Android Build Process**
   - Modifies Android project files based on user preferences
   - Runs Gradle build process to generate APK
   - Signs APK with the configured keystore

4. **Source Code Generation**
   - Creates a ZIP archive of the customized Android project
   - Makes it available for download

5. **Result Delivery**
   - Saves APK to `outputs/<buildId>.apk`
   - Saves source code to `outputs/<buildId>-source.zip`
   - Uploads to Google Drive if configured
   - Returns download links to client

Each step generates logs that can be used for troubleshooting if the build fails.

---

© 2025 WebToAPK Builder | [website.com](https://website.com)
