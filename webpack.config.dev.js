const path = require("path");
const webpack = require("webpack");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

let pathsToClean = [
  'dist',
]

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
    filename: "js/[name].js",
    crossOriginLoading: "anonymous"
  },
  devtool: "source-map",
  mode: 'development',
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx']
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: [
          { loader: 'ts-loader', options: { transpileOnly: true } }
        ],
        exclude: /node_modules/
      },
      {
        test: /\.css$/,
        use: [
          {
            loader: 'css-loader',
            options: {
              minimize : true
            }
          }
        ],
        exclude: /node_modules/
       }
    ]
},
  plugins: [
    new CleanWebpackPlugin(pathsToClean),
    new CopyWebpackPlugin([
      { from: "manifest.json" },
      { from: "index.html" },
      { from: "./lib/*" },
      { from: 'stylesheets/*' },
      { from: 'images/*' }
    ]),
    new ForkTsCheckerWebpackPlugin({
      tsconfig: path.resolve("tsconfig.json"),
      memoryLimit: 512,
       diagnosticFormatter: "ts-loader",
       watch: ['./app'] // optional but improves performance (fewer stat calls)
    }),
  ]
};
