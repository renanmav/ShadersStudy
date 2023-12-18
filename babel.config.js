module.exports = function (api) {
  api.cache(true);
  return {
    plugins: [
      [
        "babel-plugin-inline-import",
        {
          extensions: [".sksl"],
        },
      ],
    ],
    presets: ["babel-preset-expo"],
  };
};
