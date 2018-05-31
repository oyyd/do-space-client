const webpack = require('webpack')
const path = require('path')
const packageJSON = require('./package.json')

module.exports = {
  target: 'node',
  entry: {
    index: path.resolve(__dirname, './index.js'),
  },
  output: {
    path: __dirname,
    publicPath: __dirname,
    filename: '[name].bundle.js',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: [path.resolve(__dirname, './node_modules')],
        use: {
          loader: 'babel-loader',
          options: packageJSON.babel,
        },
      },
    ],
  },
  externals: {
    gui: 'require("gui")',
  },
  plugins: [
    new webpack.DefinePlugin({
      __dirname: '__dirname',
      'process.env.NODE_ENV': `"${process.env.NODE_ENV}"`,
    }),
  ],
}
