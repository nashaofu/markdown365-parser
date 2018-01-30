import Lexer, { BlockLexer, InlineLexer } from './lexer'
import Renderer from './renderer'
import h from './vnode'

export default class Parser {
  static vision = process.env.VERSION
  /**
   * Static Parser Method
   */
  static parse (src, options) {
    const parser = new Parser(options)
    return parser.parse(src)
  }

  /**
   * 初始化Parser类
   * @param {Object} options
   */
  constructor ({
    gfm = true,
    tables = true,
    pedantic = false,
    breaks = false,
    smartypants = false,
    base = '',
    $el = null
  } = {}) {
    this.options = {
      gfm,
      tables,
      pedantic,
      breaks,
      smartypants,
      base,
      $el
    }
    // 初始化Lexer
    this.lexer = new Lexer(this.options)
    // 初始化Renderer
    this.renderer = new Renderer(this.options)
    // 初始化vnode
    this.vnode = h({
      $el: $el,
      tag: $el.tagName.toLowerCase(),
      type: 'node',
      children: []
    })
  }

  /**
   * 解析源码并渲染到dom
   * @param {String} src
   * @return {Parser} this
   */
  parse (src) {
    /**
     * 必须创建新的vnode
     * 创建的vnode将和this.vnode进行对比
     * 否则render diff的时候就会失败
     */
    const vnode = h({
      $el: this.vnode.$el,
      tag: this.vnode.tag,
      type: 'node',
      children: this.lex(src)
    })

    this.render(vnode)
    this.vnode = vnode
    return this
  }

  /**
   * 把源码解析为vnode
   * @param {String} src
   * @return {Vnode}
   */
  lex (src) {
    return this.lexer.lex(src)
  }

  /**
   * 把Vnode渲染到dom
   * @param {Vnode} vnode
   */
  render (vnode) {
    try {
      this.renderer.patch(vnode, this.vnode)
    } catch (error) {
      vnode.$el.innerHTML = ''
      this.renderer.patch(vnode, {})
      console.warn(`[markdown365-parser]:${error}`)
    }
  }
}

export {
  Parser,
  Lexer,
  BlockLexer,
  InlineLexer,
  Renderer
}
