const {getDefaultConfig, mergeConfig} = require('@react-native/metro-config');

const config = {
  transformer: {
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: false,
        inlineRequires: false,
      },
    }),
  },
  resolver: {
    sourceExts: ['jsx', 'js', 'ts', 'tsx', 'cjs', 'json', 'mjs'],
    extraNodeModules: {
      '@aztec/bb.js': require.resolve('@aztec/bb.js'),
    },
  },
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
