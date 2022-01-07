module.exports = {
  assets: ['./src/assets/fonts'],
  dependencies: {
    '@react-native-community/picker': {
      platforms: {
        android: null, // disable Android platform, other platforms will still autolink if provided
      },
    },
  },
};
