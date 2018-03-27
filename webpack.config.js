const path = require("path");
const webpack = require("webpack");
const CommonsChunkPlugin = require("webpack/lib/optimize/CommonsChunkPlugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");

module.exports = {
  context: path.join(__dirname, "app"),
  entry: {
<<<<<<< HEAD
    popup: "./containers/app.tsx",
    background: "./background/background.ts",
    redux_bg: "./background/redux_bg.ts",
    content: "./content/content.ts"
=======
    popup: "./popup.tsx",
    background: "./background.ts",
    utils: "./utils/utils.ts"
>>>>>>> 56edc20c51e3deaf645c7fbbb31db2facd7c6939
  },
  output: {
    path: path.join(__dirname, "dist"),
    filename: "[name].js",
    crossOriginLoading: "anonymous"
  },
  devtool: "source-map",
  resolve: {
    extensions: ["", ".ts", ".tsx", ".js", ".json"]
  },
  module: {
    loaders: [
      {
        test: /\.tsx?$/,
        loader: "awesome-typescript-loader"
      }
    ],
    preLoaders: [{ test: /\.js$/, loader: "source-map-loader" }]
  },
  plugins: [
    new webpack.DefinePlugin({
      "process.env": {
        NODE_ENV: `"${process.env.NODE_ENV}"`
      }
    }),
<<<<<<< HEAD
    new CommonsChunkPlugin("common.js", ["popup"], "content.js"),
    new CopyWebpackPlugin([
      { from: "manifest.json" },
      { from: "index.html" },
      { from: "styles/styles.css" },
      { from: "./lib/*" }
=======
    new CommonsChunkPlugin("common.js", ["popup"], "utils.js"),
    new CopyWebpackPlugin([
      { from: 'manifest.json' },
      { from: 'index.html' },
      { from: 'stylesheets/*' },
      { from: 'images/*' }
>>>>>>> 56edc20c51e3deaf645c7fbbb31db2facd7c6939
    ])
  ]
};
