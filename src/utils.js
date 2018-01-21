/**
 * Utils
 */

export const replace = function replace (regex, opt) {
  regex = regex.source
  opt = opt || ''
  return function self (name, val) {
    if (!name) return new RegExp(regex, opt)
    val = val.source || val
    val = val.replace(/(^|[^[])\^/g, '$1')
    regex = regex.replace(name, val)
    return self
  }
}

export const noop = () => { }
noop.exec = noop

export const isUndef = val => {
  return val === undefined || val === null
}

export const isDef = val => {
  return val !== undefined && val !== null
}

export const transformURL = (base, url) => {
  if (url.indexOf('/') &&
    url.indexOf('http://') &&
    url.indexOf('https://')) {
    return base + url
  }
  return url
}
