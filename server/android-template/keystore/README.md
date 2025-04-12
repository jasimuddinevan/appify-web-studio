
# Keystore for APK Signing

This directory contains the keystore file used for signing APKs. The keystore is used to digitally sign the APK file, which is required for installation on Android devices.

## Default Keystore

A default keystore named `appify-release-key.keystore` is provided for convenience. 

**WARNING:** For production use, you should generate your own keystore file and keep it secure.

## Keystore Details

- Keystore file: `appify-release-key.keystore`
- Keystore password: `appifypassword`
- Key alias: `appifykey`
- Key password: `appifypassword`

## How to Generate Your Own Keystore

To generate your own keystore, use the `keytool` command:

```
keytool -genkey -v -keystore your-release-key.keystore -alias your-key-alias -keyalg RSA -keysize 2048 -validity 10000
```

Follow the prompts to enter your details and passwords.

## Integrating Custom Keystore

To use your own keystore for signing APKs, update the `signingConfigs` section in `app/build.gradle` with your keystore details:

```gradle
signingConfigs {
    release {
        storeFile file('path/to/your-release-key.keystore')
        storePassword 'your-store-password'
        keyAlias 'your-key-alias'
        keyPassword 'your-key-password'
    }
}
```
