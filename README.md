# markdown365-parser
A markdown parser library base vnode

> 基于vnode的markdown解析器。markdown语法解析由[marked](https://github.com/chjj/marked)扩展而来，示例地址[Github Pages](https://markdown365.github.io/markdown365-parser/)

## Install

[![NPM](https://nodei.co/npm/markdown365-parser.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/markdown365-parser/)

## Usage

### ESM
```js
import Markdown365Parser from 'markdown365-parser'
const markdwon = '## markdown365-parser'
const $el = document.querySelector('#prevview')

const parser = new Markdown365Parser({
  gfm: true,
  tables: true,
  breaks: false,
  pedantic: false,
  sanitize: false,
  sanitizer: null,
  smartLists: false,
  smartypants: false,
  base: '',
  $el: $el
})

// 解析并渲染到真实dom中去
parser.parse(markdown)
```

### Browser
```html
<!doctype html>
<html>
<head>
  <meta charset="utf-8"/>
  <title>markdown365-parser</title>
  <script src="dist/markdown365-parser.js"></script>
</head>
<body>
  <div id="previiew"></div>
  <script>
    const markdwon = '## markdown365-parser'
    const parser = new Markdown365Parser({
      gfm = true,
      tables = true,
      breaks = false,
      pedantic = false,
      sanitize = false,
      sanitizer = null,
      smartLists = false,
      smartypants = false,
      base = '',
      $el = null
      $el: document.querySelector('#previiew')
    })
    parser.parse(markdown)
  </script>
</body>
</html>
```

## 支持语法

支持语法请查看[Grammar](./Grammar.md)或者[Github Pages](https://markdown365.github.io/markdown365-parser/)


## Options

* **gfm**: Enable GitHub flavored markdown. Default: true

* **tables**: Enable GFM tables. This option requires the gfm option to be true. Default: true

* **breaks**: Enable GFM line breaks. This option requires the gfm option to be true. Default: false

* **pedantic**: Conform to obscure parts of markdown.pl as much as possible. Don't fix any of the original markdown bugs or poor behavior. Default: false

* **sanitize**: Sanitize the output. Ignore any HTML that has been input.

* **smartLists**: Use smarter list behavior than the original markdown. May eventually be default with the old behavior moved into pedantic. Default: true

* **smartypants**: Use "smart" typographic punctuation for things like quotes and dashes. Default: false

## Licences

[MIT](./LICENSE)
