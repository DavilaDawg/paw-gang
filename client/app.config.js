import 'dotenv/config';

export default {
  expo: {
    name: 'paw-gang',
    slug: 'paw-gang',
    version: '1.0.0',
    extra: {
      googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY
    },
    orientation: 'portrait',
    icon: './assets/icon.png',
    userInterfaceStyle: 'light',
    splash: {
      image: './assets/logo.jpg',
      resizeMode: 'contain',
      backgroundColor: '#cfcec9'
    },
    ios: {
      supportsTablet: true,
      simulator: true
    },
    android: {
      package: 'com.anonymous.pawgang',
      adaptiveIcon: {
        foregroundImage: './assets/icon.png',
        backgroundColor: '#ffffff'
      }
    },
    web: {
      favicon: './assets/icon.png'
    }
  }
};
