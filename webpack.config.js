const path = require("path");
const webpack = require("webpack");
const CommonsChunkPlugin = require("webpack/lib/optimize/CommonsChunkPlugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");

module.exports = {
  context: path.join(__dirname, "app"),
  entry: {
    popup: "./containers/app.tsx",
    background: "./background/background.ts",
    redux_bg: "./background/redux_bg.ts",
    content: "./content/content.ts",
    utils: "./utils/utils.ts"
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
    new CommonsChunkPlugin("common.js", ["popup"], "content.js"),
    new CopyWebpackPlugin([
      { from: "manifest.json" },
      { from: "index.html" },
      { from: "./lib/*" },
      { from: 'stylesheets/*' },
      { from: 'images/*' }
    ])
  ]
};
