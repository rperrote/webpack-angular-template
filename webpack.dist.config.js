const webpack = require('webpack');
const path    = require('path');
const config  = require('./webpack.config');
const CleanWebpackPlugin = require('clean-webpack-plugin')
const CompressionPlugin = require("compression-webpack-plugin");

config.output = {
  filename: '[name].bundle.min.[hash].js',
  publicPath: './',
  path: path.resolve(__dirname, 'dist')
};

config.devtool = "cheap-module-source-map";

config.plugins = config.plugins.concat([

  new webpack.DefinePlugin({
      'process.env.NODE_ENV': '"production"',
  }),

  new webpack.optimize.OccurrenceOrderPlugin(),

  new webpack.optimize.UglifyJsPlugin({
    mangle: {

      // You can specify all variables that should not be mangled.
      // For example if your vendor dependency doesn't use modules
      // and relies on global variables. Most of angular modules relies on
      // angular global variable, so we should keep it unchanged
      except: ['$super', '$', 'exports', 'require', 'angular']
    },
    compress: {
      warnings: false, // Suppress uglification warnings
      pure_getters: true,
      unsafe: true,
      unsafe_comps: true,
      screw_ie8: true
    },
    minimize: true
  }),

  new CleanWebpackPlugin(['dist'])

]);

module.exports = config;
