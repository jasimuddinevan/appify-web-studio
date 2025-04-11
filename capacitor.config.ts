
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.69e9f24a50eb4d16b9171cf3b2513217',
  appName: 'appify-web-studio',
  webDir: 'dist',
  server: {
    url: 'https://69e9f24a-50eb-4d16-b917-1cf3b2513217.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  // Additional configuration for WebView
  android: {
    buildOptions: {
      keystorePath: null,
      keystorePassword: null,
      keystoreAlias: null,
      keystoreAliasPassword: null,
    }
  },
  ios: {
    // iOS specific config
  }
};

export default config;
