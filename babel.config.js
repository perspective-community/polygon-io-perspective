module.exports = {
  presets: [
    [
      "@babel/preset-env",
      {
        targets: {
          chrome: "70",
          ios: "13",
        },
      },
    ],
    "@babel/preset-react",
  ],
  sourceType: "unambiguous",
  sourceMaps: true,
};
