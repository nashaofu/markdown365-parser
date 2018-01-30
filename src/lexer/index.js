import BlockLexer from './block-lexer'
import InlineLexer from './inline-lexer'
export default class Lexer {
  static vision = process.env.VERSION

  /**
   * Static Lex Method
   */
  static lex (src, options) {
    const lexer = new Lexer(options)
    return lexer.lex(src)
  }

  /**
   * 初始化Lexer类
   * @param {Object} options
   */
  constructor ({
    gfm = true,
    tables = true,
    pedantic = false,
    breaks = false,
    smartypants = false,
    base = ''
  } = {}) {
    this.options = {
      gfm,
      tables,
      pedantic,
      breaks,
      smartypants,
      base
    }
    // 初始化块级语法解析
    this.blockLexer = new BlockLexer(this.options)
    // 初始化行内语法解析
    this.inlineLexer = new InlineLexer(this.options)
    // 定义vnode
    this.vnode = []
  }

  /**
   * 把源码解析为vnode
   * @param {String} src
   * @return {Vnode}
   */
  lex (src) {
    const { vnode, links } = this.lexBlock(src)
    // 设置参考式的链接或者图片
    this.inlineLexer.setLinks(links)
    this.vnode = this.lexInline(vnode)
    return this.vnode
  }

  /**
   * 解析源码的块级语法
   * @param {String} src
   * @return {Vnode}
   */
  lexBlock (src) {
    return this.blockLexer.parser(src)
  }

  /**
   * 解析经过块级语法解析的vnode对象
   * 解析对象中未被解析的行内语法
   * @param {Vnode} vnodes
   * @return {Vnode}
   */
  lexInline (vnodes) {
    let i = 0
    let vnode = vnodes[i]
    while (vnode) {
      // 需要进行行内解析的情况
      if (vnode.source) {
        if (vnode.type === 'text') { // 为text的时候
          // 把text从text node移动到text node的父节点上
          const children = this.inlineLexer.parser(vnode)
          // 记录原来位置的元素下标
          let oi = i
          // 把节点加入到父节点中对应的位置(相同下标处)
          while (children.length) {
            const vn = children.shift()
            /**
             * 合并text节点
             * 如果前一个是text，并且当前vn也是text
             * 就合并成一段文字，减少节点个数
             */
            if (oi !== i && vnodes[i].type === 'text' && vn.type === 'text') {
              vnodes[i].text += vn.text
            } else {
              vn.parent = vnode.parent
              // 在原来的位置后面插入新的值
              vnodes.splice(++i, 0, vn)
            }
          }
          // 从父节点上移除被解析的节点
          i--
          vnodes.splice(oi, 1)
        } else { // 为node或者html类型的时候
          vnode.children = this.inlineLexer.parser(vnode)
            .map(item => {
              item.parent = vnode
              return item
            })
        }
        vnode.source = null
      } else {
        this.lexInline(vnode.children)
      }
      i++
      vnode = vnodes[i]
    }
    return vnodes
  }
}

export {
  Lexer,
  BlockLexer,
  InlineLexer
}
