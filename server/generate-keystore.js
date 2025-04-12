
/**
 * Script to generate a keystore file for APK signing
 */
const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs-extra');

/**
 * Generates a keystore file for signing Android APKs
 * @param {Object} options - Keystore options
 */
function generateKeystore(options = {}) {
  const {
    keystorePath = path.join(__dirname, 'android-template', 'keystore', 'appify-release-key.keystore'),
    keystorePassword = 'appifypassword',
    keyAlias = 'appifykey',
    keyPassword = 'appifypassword',
    validity = 10000
  } = options;
  
  console.log(`Generating keystore at: ${keystorePath}`);
  
  // Ensure directory exists
  fs.ensureDirSync(path.dirname(keystorePath));
  
  try {
    const command = `keytool -genkeypair -v -keystore "${keystorePath}" -keyalg RSA -keysize 2048 -validity ${validity} -alias "${keyAlias}" -keypass "${keyPassword}" -storepass "${keystorePassword}" -dname "CN=Appify, OU=Development, O=Appify Inc, L=City, S=State, C=US"`;
    
    execSync(command, { stdio: 'inherit' });
    console.log('Keystore generated successfully!');
    
    return {
      keystorePath,
      keystorePassword,
      keyAlias,
      keyPassword
    };
  } catch (error) {
    console.error('Failed to generate keystore:', error.message);
    throw error;
  }
}

// If run directly, generate a keystore
if (require.main === module) {
  try {
    generateKeystore();
  } catch (error) {
    process.exit(1);
  }
}

module.exports = { generateKeystore };
