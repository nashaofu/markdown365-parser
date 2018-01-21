'use strict'
const utils = require('./utils')
const config = require('../config')
const isDocument = process.env.NODE_ENV === 'document'
const sourceMapEnabled = isDocument
  ? config.docs.productionSourceMap
  : config.dev.cssSourceMap

module.exports = {
  loaders: utils.cssLoaders({
    sourceMap: sourceMapEnabled,
    extract: isDocument
  }),
  cssSourceMap: sourceMapEnabled,
  cacheBusting: config.dev.cacheBusting,
  transformToRequire: {
    video: ['src', 'poster'],
    source: 'src',
    img: 'src',
    image: 'xlink:href'
  }
}
