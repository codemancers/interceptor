var path = require("path")
var webpack = require('webpack')

module.exports = {
  entry: {
    popup: "./app/popup.js",
    background: "./app/background.js",
    content_script: "./app/content_script.js"
  },
  output: {
    path: path.join(__dirname, 'dist'),
    filename: "[name].js"
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        loaders: ["react-hot", "babel"],
        include: path.join(__dirname, 'app')
      }
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': `"${process.env.NODE_ENV}"`
      }
    })
  ]
};
