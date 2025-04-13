const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs-extra');
const { v4: uuidv4 } = require('uuid');
const archiver = require('archiver');
const { exec, execSync } = require('child_process');

// Initialize Express
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Set up storage for uploaded files
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, 'uploads');
    fs.ensureDirSync(uploadDir);
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${uuidv4()}-${file.originalname}`);
  }
});

const upload = multer({ storage });

// Create temporary build directory
const TEMP_DIR = path.join(__dirname, 'temp');
fs.ensureDirSync(TEMP_DIR);

// Create outputs directory for generated APKs
const OUTPUT_DIR = path.join(__dirname, 'outputs');
fs.ensureDirSync(OUTPUT_DIR);

// Routes
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Server is running' });
});

// Handle app configuration upload
app.post(
  '/api/upload-config', 
  upload.fields([
    { name: 'appIcon', maxCount: 1 }, 
    { name: 'splashScreen', maxCount: 1 }
  ]), 
  (req, res) => {
    try {
      const files = req.files;
      const appIconPath = files.appIcon ? files.appIcon[0].path : null;
      const splashScreenPath = files.splashScreen ? files.splashScreen[0].path : null;
      
      res.status(200).json({
        message: 'Files uploaded successfully',
        appIcon: appIconPath ? path.basename(appIconPath) : null,
        splashScreen: splashScreenPath ? path.basename(splashScreenPath) : null
      });
    } catch (error) {
      console.error('Upload error:', error);
      res.status(500).json({ error: 'Failed to upload files' });
    }
  }
);

// Generate APK endpoint
app.post('/api/generate-apk', async (req, res) => {
  try {
    const {
      webUrl,
      appName,
      companyName,
      packageName,
      appIconId,
      splashScreenId,
      primaryColor,
      navigationStyle,
      offlineSupport,
      pushNotifications,
      screenOrientation,
      zoomEnabled,
      cacheLevel,
      navButtons
    } = req.body;

    if (!webUrl || !appName) {
      return res.status(400).json({ error: 'Missing required parameters' });
    }

    // Create a unique build ID for this request
    const buildId = uuidv4();
    const buildDir = path.join(TEMP_DIR, buildId);
    fs.ensureDirSync(buildDir);
    
    // Get paths for uploaded files if they exist
    let appIconPath = null;
    let splashScreenPath = null;
    
    if (appIconId) {
      const files = fs.readdirSync(path.join(__dirname, 'uploads'));
      const appIconFile = files.find(file => file.startsWith(appIconId));
      if (appIconFile) {
        appIconPath = path.join(__dirname, 'uploads', appIconFile);
      }
    }
    
    if (splashScreenId) {
      const files = fs.readdirSync(path.join(__dirname, 'uploads'));
      const splashScreenFile = files.find(file => file.startsWith(splashScreenId));
      if (splashScreenFile) {
        splashScreenPath = path.join(__dirname, 'uploads', splashScreenFile);
      }
    }

    // Launch the APK build process
    const apkResult = await buildApk({
      buildDir,
      webUrl,
      appName,
      companyName,
      packageName,
      appIconPath,
      splashScreenPath,
      primaryColor,
      navigationStyle,
      offlineSupport,
      pushNotifications,
      screenOrientation,
      zoomEnabled,
      cacheLevel,
      navButtons,
      buildId
    });

    if (apkResult.success) {
      // Build response object
      const response = {
        message: 'APK generated successfully',
        buildId: buildId,
        apkPath: apkResult.apkPath
      };
      
      // Add source code path if available
      if (apkResult.sourceCodePath) {
        response.sourceCodePath = apkResult.sourceCodePath;
      }
      
      // Include Google Drive information in the response if available
      if (apkResult.googleDriveInfo) {
        response.googleDriveLink = apkResult.googleDriveInfo.webContentLink;
        response.googleDriveViewLink = apkResult.googleDriveInfo.webViewLink;
        response.message = 'APK generated and uploaded to Google Drive successfully';
      }
      
      // Include source code Google Drive info if available
      if (apkResult.sourceCodeDriveInfo) {
        response.sourceCodeDriveLink = apkResult.sourceCodeDriveInfo.webContentLink;
        response.sourceCodeDriveViewLink = apkResult.sourceCodeDriveInfo.webViewLink;
      }
      
      res.status(200).json(response);
    } else {
      res.status(500).json({
        error: 'Failed to generate APK',
        details: apkResult.error
      });
    }
  } catch (error) {
    console.error('APK generation error:', error);
    res.status(500).json({ 
      error: 'Failed to generate APK',
      details: error.message
    });
  }
});

// Download the generated APK
app.get('/api/download-apk/:buildId', (req, res) => {
  try {
    const { buildId } = req.params;
    const apkPath = path.join(OUTPUT_DIR, `${buildId}.apk`);
    
    if (!fs.existsSync(apkPath)) {
      return res.status(404).json({ error: 'APK file not found' });
    }
    
    const appName = req.query.appName || 'web-app';
    const sanitizedAppName = appName.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase();
    
    res.download(apkPath, `${sanitizedAppName}.apk`);
  } catch (error) {
    console.error('Download error:', error);
    res.status(500).json({ error: 'Failed to download APK' });
  }
});

// Download the source code ZIP
app.get('/api/download-source/:buildId', (req, res) => {
  try {
    const { buildId } = req.params;
    const sourceCodePath = path.join(OUTPUT_DIR, `${buildId}-source.zip`);
    
    if (!fs.existsSync(sourceCodePath)) {
      return res.status(404).json({ error: 'Source code file not found' });
    }
    
    const appName = req.query.appName || 'web-app';
    const sanitizedAppName = appName.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase();
    
    res.download(sourceCodePath, `${sanitizedAppName}-source.zip`);
  } catch (error) {
    console.error('Download error:', error);
    res.status(500).json({ error: 'Failed to download source code' });
  }
});

// Check build status
app.get('/api/build-status/:buildId', (req, res) => {
  try {
    const { buildId } = req.params;
    const logPath = path.join(TEMP_DIR, buildId, 'build.log');
    
    if (!fs.existsSync(logPath)) {
      return res.status(404).json({ error: 'Build not found' });
    }
    
    const log = fs.readFileSync(logPath, 'utf8');
    const apkPath = path.join(OUTPUT_DIR, `${buildId}.apk`);
    const isComplete = fs.existsSync(apkPath);
    
    res.status(200).json({
      buildId,
      status: isComplete ? 'complete' : 'in_progress',
      log: log
    });
  } catch (error) {
    console.error('Status check error:', error);
    res.status(500).json({ error: 'Failed to check build status' });
  }
});

// Import the build-apk function
const { buildApk } = require('./build-apk');

// Initialize Android template
const { initAndroidTemplate } = require('./init-android-template');

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  
  // Check for Android SDK and tools
  try {
    // Check for Java
    try {
      const javaVersion = execSync('java -version 2>&1').toString();
      console.log('Java detected:', javaVersion.split('\n')[0]);
    } catch (error) {
      console.warn('Warning: Java not found. This is required for Android builds.');
    }
    
    // Check for Android SDK
    const androidHome = process.env.ANDROID_HOME || process.env.ANDROID_SDK_ROOT;
    if (androidHome) {
      console.log('Android SDK found at:', androidHome);
    } else {
      console.warn('Warning: ANDROID_HOME environment variable not set. Android SDK required for builds.');
    }
    
  } catch (error) {
    console.warn('Warning: Could not check for Android SDK:', error.message);
  }
  
  // Ensure directories exist
  fs.ensureDirSync(path.join(__dirname, 'uploads'));
  fs.ensureDirSync(TEMP_DIR);
  fs.ensureDirSync(OUTPUT_DIR);
  
  // Initialize Android template
  initAndroidTemplate()
    .then(() => console.log('Android template initialized successfully'))
    .catch(err => console.error('Failed to initialize Android template:', err));
});
