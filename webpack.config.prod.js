const path = require("path");
const webpack = require("webpack");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

let pathsToClean = { cleanOnceBeforeBuildPatterns: ["dist"] };

module.exports = {
  context: path.join(__dirname, "app"),
  entry: {
    popup: "./containers/app.tsx",
    background: "./background/background.ts",
    content: "./content/content.ts",
    utils: "./utils/utils.ts"
  },
  output: {
    path: path.join(__dirname, "dist"),
    filename: "js/[name].js",
    crossOriginLoading: "anonymous"
  },
  mode: "production",
  resolve: {
    extensions: [".ts", ".tsx", ".js", ".jsx"]
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: [{ loader: "ts-loader", options: { transpileOnly: true } }],
        exclude: /node_modules/
      },
      {
        test: /\.css$/,
        use: [
          {
            loader: "css-loader",
            options: {
              minimize: true
            }
          }
        ]
      }
    ]
  },
  plugins: [
    new CleanWebpackPlugin(pathsToClean),
    new CopyWebpackPlugin([
      { from: "manifest.json" },
      { from: "index.html" },
      { from: "./lib/*" },
      { from: "stylesheets/*" },
      { from: "images/*" }
    ])
  ]
};
