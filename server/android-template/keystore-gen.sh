
#!/bin/bash

# Script to generate a keystore for signing Android APKs

KEYSTORE_DIR="./keystore"
KEYSTORE_FILE="$KEYSTORE_DIR/appify-release-key.keystore"
KEYSTORE_PASS="appifypassword"
KEY_ALIAS="appifykey"
KEY_PASS="appifypassword"

# Create keystore directory if it doesn't exist
mkdir -p $KEYSTORE_DIR

# Check if keystore already exists
if [ -f "$KEYSTORE_FILE" ]; then
    echo "Keystore already exists at $KEYSTORE_FILE"
else
    # Generate the keystore file
    echo "Generating keystore file..."
    
    # Using keytool to generate the keystore
    keytool -genkey -v \
      -keystore "$KEYSTORE_FILE" \
      -alias "$KEY_ALIAS" \
      -keyalg RSA \
      -keysize 2048 \
      -validity 10000 \
      -storepass "$KEYSTORE_PASS" \
      -keypass "$KEY_PASS" \
      -dname "CN=Appify, OU=Development, O=Appify Inc, L=City, S=State, C=US"
      
    if [ $? -eq 0 ]; then
        echo "Successfully created keystore at $KEYSTORE_FILE"
        echo "Keystore password: $KEYSTORE_PASS"
        echo "Key alias: $KEY_ALIAS"
        echo "Key password: $KEY_PASS"
    else
        echo "Failed to create keystore"
        exit 1
    fi
fi

echo "Done."
