const PerspectivePlugin = require("@finos/perspective-webpack-plugin");
const HtmlWebPackPlugin = require("html-webpack-plugin");
const path = require("path");

module.exports = {
  mode: "development",
  devtool: "source-map",
  resolve: {
    extensions: [".js", ".jsx"],
    fallback: {
      fs: false,
      path: false,
    },
  },

  plugins: [
    new HtmlWebPackPlugin({
      title: "Perspective React Example",
      template: "./src/html/index.html",
    }),
    new PerspectivePlugin(),
  ],

  module: {
    rules: [
      {
        test: /\.js(x?)$/,
        enforce: "pre",
        loader: "babel-loader",
      },
      {
        test: /\.css$/,
        exclude: /node_modules\/monaco-editor/,
        use: [{loader: "style-loader"}, {loader: "css-loader"}],
      },
    ],
  },
  devServer: {
    static: [{directory: path.join(__dirname, "dist")}, {directory: path.join(__dirname, "./static")}],
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
      "Access-Control-Allow-Headers": "X-Requested-With, content-type, Authorization",
    },
    proxy: {
      "/logos": {
        target: "https://s3.polygon.io",
        changeOrigin: true,
      },
    },
  },
};
