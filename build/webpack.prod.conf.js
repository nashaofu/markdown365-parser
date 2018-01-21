'use strict'
const _ = require('lodash')
const pkg = require('../package')
const webpack = require('webpack')
const config = require('../config')
const merge = require('webpack-merge')
const baseWebpackConfig = require('./webpack.base.conf')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')

const webpackConfig = merge(baseWebpackConfig, {
  entry: {
    [pkg.name]: './src/index.js'
  },
  output: {
    path: config.build.assetsRoot,
    filename: '[name].js',
    library: _.upperFirst(_.camelCase(pkg.name)),
    libraryExport: 'default',
    libraryTarget: 'umd'
  },
  devtool: config.build.productionSourceMap ? config.build.devtool : false,
  plugins: [
    // http://vuejs.github.io/vue-loader/en/workflow/production.html
    new webpack.DefinePlugin({
      'process.env': require('../config/prod.env')
    }),
    new UglifyJsPlugin({
      uglifyOptions: {
        compress: {
          warnings: false
        }
      },
      sourceMap: config.build.productionSourceMap,
      parallel: true
    })
  ]
})

if (config.build.bundleAnalyzerReport) {
  const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
  webpackConfig.plugins.push(new BundleAnalyzerPlugin())
}

module.exports = webpackConfig
