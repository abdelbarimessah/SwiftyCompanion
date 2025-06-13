import type { ConfigContext, ExpoConfig } from '@expo/config';
import type { AppIconBadgeConfig } from 'app-icon-badge/types';

import { ClientEnv, Env } from './env';

const appIconBadgeConfig: AppIconBadgeConfig = {
  enabled: false,
  badges: [
    {
      text: Env.APP_ENV,
      type: 'banner',
      color: 'white',
    },
    {
      text: Env.VERSION.toString(),
      type: 'ribbon',
      color: 'white',
    },
  ],
};

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: Env.NAME,
  description: `${Env.NAME} Mobile App`,
  owner: Env.EXPO_ACCOUNT_OWNER,
  scheme: Env.SCHEME,
  slug: 'swiftycompanion',
  version: Env.VERSION.toString(),
  orientation: 'portrait',
  icon: './assets/icons/ios-dark.png',
  userInterfaceStyle: 'automatic',
  newArchEnabled: true,
  updates: {
    fallbackToCacheTimeout: 0,
  },
  assetBundlePatterns: ['**/*'],
  ios: {
    supportsTablet: true,
    bundleIdentifier: Env.BUNDLE_ID,
    config: {
      usesNonExemptEncryption: false,
    },
    icon: {
      dark: './assets/icons/ios-dark.png',
      light: './assets/icons/ios-light.png',
      tinted: './assets/icons/ios-tinted.png',
    },
  },
  experiments: {
    typedRoutes: true,
  },
  android: {
    adaptiveIcon: {
      foregroundImage: './assets/icons/adaptive-icon.png',
      backgroundColor: '#ffffff',
    },
    package: Env.PACKAGE,
  },
  web: {
    favicon: './assets/favicon.png',
    bundler: 'metro',
  },
  plugins: [
    [
      'expo-splash-screen',
      {
        backgroundColor: '#ffffff',
        image: './assets/icons/splash-icon-dark.png',
        resizeMode: 'contain',
        imageWidth: 200,
      },
    ],
    [
      'expo-font',
      {
        fonts: ['./assets/fonts/Inter.ttf'],
      },
    ],
    'expo-localization',
    'expo-router',
    ['app-icon-badge', appIconBadgeConfig],
    ['react-native-edge-to-edge'],
  ],
  extra: {
    ...ClientEnv,
    eas: {
      projectId: Env.EAS_PROJECT_ID,
    },
  },
});
