const { getDefaultConfig } = require("expo/metro-config");

const config = getDefaultConfig(__dirname);

// Add support for SKSL files
config.resolver.sourceExts.push("sksl");
config.transformer.babelTransformerPath = require.resolve(
  "./metro.transformer.js"
);

// Add support for LUT files
config.resolver.assetExts.push("cube");

module.exports = config;
