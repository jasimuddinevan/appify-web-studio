
/**
 * Initialize the Android template directory
 * Create and prepare the keystore for signing APKs
 */

const path = require('path');
const fs = require('fs-extra');
const { execSync } = require('child_process');

const TEMPLATE_DIR = path.join(__dirname, 'android-template');
const KEYSTORE_DIR = path.join(TEMPLATE_DIR, 'keystore');

/**
 * Initializes the Android template
 */
async function initAndroidTemplate() {
  console.log('Initializing Android template...');
  
  // Ensure the template directory exists
  fs.ensureDirSync(TEMPLATE_DIR);
  
  // Ensure the keystore directory exists
  fs.ensureDirSync(KEYSTORE_DIR);
  
  // Check if keystore already exists
  const keystorePath = path.join(KEYSTORE_DIR, 'appify-release-key.keystore');
  if (!fs.existsSync(keystorePath)) {
    console.log('Creating keystore file...');
    
    try {
      // Make keystore-gen.sh executable
      const keystoreGenScript = path.join(TEMPLATE_DIR, 'keystore-gen.sh');
      if (fs.existsSync(keystoreGenScript)) {
        execSync(`chmod +x ${keystoreGenScript}`, { stdio: 'pipe' });
        
        // Execute the keystore generation script
        execSync(keystoreGenScript, { cwd: TEMPLATE_DIR, stdio: 'pipe' });
        console.log('Keystore created successfully');
      } else {
        console.warn('Keystore generation script not found');
        
        // Try to generate a real keystore file using keytool
            try {
              const { generateKeystore } = require('./generate-keystore');
              generateKeystore({ keystorePath });
              console.log('Generated real keystore file');
            } catch (err) {
              // Fall back to placeholder if keytool is not available
              fs.writeFileSync(keystorePath, 'PLACEHOLDER KEYSTORE FILE');
              console.log('Created placeholder keystore file - real keystore generation failed');
            }
              generateKeystore({ keystorePath });
              console.log('Generated real keystore file');
            } catch (err) {
              // Fall back to placeholder if keytool is not available
              fs.writeFileSync(keystorePath, 'PLACEHOLDER KEYSTORE FILE');
              console.log('Created placeholder keystore file - real keystore generation failed');
            }
    console.log('Keystore already exists');
  }
  
  console.log('Android template initialization complete!');
}

// Execute if this script is run directly
if (require.main === module) {
  initAndroidTemplate()
    .then(() => {
      console.log('Initialization complete');
    })
    .catch(error => {
      console.error('Initialization failed:', error);
      process.exit(1);
    });
}

module.exports = { initAndroidTemplate };
