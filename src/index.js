import Lexer from './lexer'
import Renderer from './renderer'
import h from './vnode'

export default class Parser {
  static Lexer = Lexer
  static Renderer = Renderer
  static vision = process.env.VERSION
  /**
   * Static Parser Method
   */
  static parse (src, options) {
    const parser = new Parser(options)
    return parser.parse(src)
  }
  constructor ({
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
  } = {}) {
    this.options = {
      gfm,
      tables,
      breaks,
      pedantic,
      sanitize,
      sanitizer,
      smartLists,
      smartypants,
      base,
      $el
    }
    this.lexer = new Lexer(this.options)
    this.renderer = new Renderer(this.options)
    this.vnode = {}
  }

  parse (src) {
    const $el = this.options.$el
    const vnode = h({
      $el: $el,
      tag: $el.tagName.toLowerCase(),
      type: 'node',
      children: this.lex(src)
    })

    this.render(vnode)
    this.vnode = vnode
    return this.vnode
  }

  lex (src) {
    return this.lexer.lex(src)
  }

  render (vnode) {
    try {
      this.renderer.patch(vnode, this.vnode)
    } catch (error) {
      vnode.$el.innerHTML = ''
      this.renderer.patch(vnode, {})
      if (process.env.NODE_ENV === 'development') {
        console.error(error)
      }
    }
  }
}

export {
  Parser,
  Lexer,
  Renderer
}
