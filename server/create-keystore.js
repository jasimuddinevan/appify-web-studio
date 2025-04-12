
/**
 * Script to create a keystore file for signing Android APKs
 */

const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs-extra');

// Default keystore settings
const DEFAULT_SETTINGS = {
  keystoreFile: 'appify-release-key.keystore',
  keystorePassword: 'appifypassword',
  keyAlias: 'appifykey',
  keyPassword: 'appifypassword',
  validity: 10000, // Validity in days
  keystoreDir: path.join(__dirname, 'android-template', 'keystore')
};

/**
 * Creates a keystore file for signing Android APKs
 * @param {Object} options - Keystore options
 * @returns {Object} - Keystore information
 */
function createKeystore(options = {}) {
  // Merge with default settings
  const settings = { ...DEFAULT_SETTINGS, ...options };
  const keystorePath = path.join(settings.keystoreDir, settings.keystoreFile);
  
  // Create keystore directory if it doesn't exist
  fs.ensureDirSync(settings.keystoreDir);
  
  // Check if keystore already exists
  if (fs.existsSync(keystorePath)) {
    console.log(`Keystore already exists at ${keystorePath}`);
    return {
      keystorePath,
      keystorePassword: settings.keystorePassword,
      keyAlias: settings.keyAlias,
      keyPassword: settings.keyPassword,
      exists: true
    };
  }
  
  // Generate keystore using keytool
  try {
    console.log('Generating new keystore file...');
    
    const command = `keytool -genkey -v \
      -keystore "${keystorePath}" \
      -alias "${settings.keyAlias}" \
      -keyalg RSA \
      -keysize 2048 \
      -validity ${settings.validity} \
      -storepass "${settings.keystorePassword}" \
      -keypass "${settings.keyPassword}" \
      -dname "CN=Appify, OU=Development, O=Appify Inc, L=City, S=State, C=US"`;
    
    execSync(command, { stdio: 'pipe' });
    
    console.log(`Successfully created keystore at ${keystorePath}`);
    return {
      keystorePath,
      keystorePassword: settings.keystorePassword,
      keyAlias: settings.keyAlias,
      keyPassword: settings.keyPassword,
      exists: false
    };
  } catch (error) {
    console.error('Failed to create keystore:', error.message);
    throw new Error('Failed to create keystore: ' + error.message);
  }
}

// Export the function to be used in other modules
module.exports = { createKeystore };

// If called directly, create a keystore with default settings
if (require.main === module) {
  try {
    const keystore = createKeystore();
    console.log('Keystore information:', keystore);
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
}
