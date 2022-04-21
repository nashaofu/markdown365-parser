import inline from './inline-rules'
import { isDef, transformURL } from '../utils'
import h from '../vnode'

/**
 * Inline Lexer & Compiler
 */
export default class InlineLexer {
  static version = process.env.VERSION
  static rules = inline
  /**
   * Static Lexing/Compiling Method
   */
  static lex (vnode, links, options) {
    let inlineLexer = new InlineLexer(options, links)
    return inlineLexer.parser(vnode)
  }

  /**
   * 初始化类
   * @param {Object} options
   * @param {Object} links
   */
  constructor ({
    gfm = true,
    breaks = false,
    pedantic = false,
    smartypants = false,
    base = ''
  } = {}, links = {}) {
    this.options = {
      gfm,
      breaks,
      pedantic,
      smartypants,
      base
    }
    this.rules = inline.normal
    if (this.options.gfm) {
      if (this.options.breaks) {
        this.rules = inline.breaks
      } else {
        this.rules = inline.gfm
      }
    } else if (this.options.pedantic) {
      this.rules = inline.pedantic
    }
    this.setLinks(links)
  }

  /**
   * 设置参考式的链接对象集合
   * @param {Object} links
   */
  setLinks (links) {
    if (typeof links !== 'object') {
      throw new TypeError('`links` isn\'t a object.')
    }
    this.links = links
  }

  /**
   * 解析行内内容
   * @param {Vnode} vnode
   */
  parser (vnode) {
    return this.lex(vnode.source, vnode.parent)
  }

  /**
   * Lexing/Compiling
   * @param {String} src
   * @param {Vnode} parent
   */
  lex (src, parent = null) {
    let vnodes = []
    let link,
      text,
      href,
      token
    let vnode
    while (src) {
      // escape
      if (token = this.rules.escape.exec(src)) {
        src = src.substring(token[0].length)
        vnode = h({
          text: token[1],
          type: 'text'
        })
        vnodes.push(vnode)
        continue
      }

      // autolink
      if (token = this.rules.autolink.exec(src)) {
        src = src.substring(token[0].length)
        if (token[2] === '@') {
          text = token[1].charAt(6) === ':' ? token[1].substring(7) : token[1]
          href = `mailto:${text}`
        } else {
          text = token[1]
          href = transformURL(this.options.base, text)
        }
        const attributes = {}
        if (isDef(href)) {
          attributes['href'] = href
        }
        vnode = h({
          tag: 'a',
          children: [
            h({
              text,
              type: 'text'
            })
          ],
          attributes
        })
        vnodes.push(vnode)
        continue
      }

      // url (gfm)
      if (!this.inLink && (token = this.rules.url.exec(src))) {
        src = src.substring(token[0].length)
        text = token[1]
        href = text
        const attributes = {}
        if (isDef(href)) {
          attributes['href'] = transformURL(this.options.base, href)
        }
        vnode = h({
          tag: 'a',
          children: [
            h({
              text,
              type: 'text'
            })
          ],
          attributes
        })
        vnodes.push(vnode)
        continue
      }

      // tag
      if (token = this.rules.tag.exec(src)) {
        if (!this.inLink && /^<a /i.test(token[0])) {
          this.inLink = true
        } else if (this.inLink && /^<\/a>/i.test(token[0])) {
          this.inLink = false
        }
        src = src.substring(token[0].length)
        vnode = h({
          text: token[0],
          type: 'html'
        })
        vnodes.push(vnode)
        continue
      }

      // link
      if (token = this.rules.link.exec(src)) {
        src = src.substring(token[0].length)
        this.inLink = true
        vnode = this.lexLink(token, {
          href: token[2],
          title: token[3]
        })
        vnodes.push(vnode)
        this.inLink = false
        continue
      }

      // 匹配Task List
      // 必须放在reflink和nolink之前
      // 否者会匹配不到
      // 必须保证这一行没有input，即只能在开始匹配到，中间匹配到都不行
      if (!vnodes.length &&
        parent &&
        parent.tag === 'li' &&
        (token = this.rules.tasklist.exec(src))) {
        src = src.substring(token[0].length)
        const attributes = {
          type: 'checkbox',
          disabled: 'disabled'
        }
        if (token[1] === 'x') {
          attributes['checked'] = 'checked'
        }
        vnode = h({
          tag: 'input',
          attributes
        })
        vnodes.push(vnode)
        continue
      }

      // reflink, nolink
      if ((token = this.rules.reflink.exec(src)) ||
        (token = this.rules.nolink.exec(src))) {
        src = src.substring(token[0].length)
        link = (token[2] || token[1]).replace(/\s+/g, ' ')
        link = this.links[link.toLowerCase()]
        if (!link || !link.href) {
          vnode = h({
            text: token[0].charAt(0),
            type: 'text'
          })
          vnodes.push(vnode)
          src = token[0].substring(1) + src
          continue
        }
        this.inLink = true
        vnode = this.lexLink(token, link)
        vnodes.push(vnode)
        this.inLink = false
        continue
      }

      // strong
      if (token = this.rules.strong.exec(src)) {
        src = src.substring(token[0].length)
        vnode = h({
          tag: 'strong',
          children: this.lex(token[2] || token[1])
        })
        vnodes.push(vnode)
        continue
      }

      // em
      if (token = this.rules.em.exec(src)) {
        src = src.substring(token[0].length)
        vnode = h({
          tag: 'em',
          children: this.lex(token[2] || token[1])
        })
        vnodes.push(vnode)
        continue
      }

      // code
      if (token = this.rules.code.exec(src)) {
        src = src.substring(token[0].length)
        vnode = h({
          tag: 'code',
          children: [
            h({
              text: token[2],
              type: 'text'
            })
          ]
        })
        vnodes.push(vnode)
        continue
      }

      // br
      if (token = this.rules.br.exec(src)) {
        src = src.substring(token[0].length)
        vnode = h({
          tag: 'br'
        })
        vnodes.push(vnode)
        continue
      }

      // del (gfm)
      if (token = this.rules.del.exec(src)) {
        src = src.substring(token[0].length)
        vnode = h({
          tag: 'del',
          children: this.lex(token[1])
        })
        vnodes.push(vnode)
        continue
      }

      // text
      if (token = this.rules.text.exec(src)) {
        src = src.substring(token[0].length)
        vnode = h({
          text: this.smartypants(token[0]),
          type: 'text'
        })
        vnodes.push(vnode)
        continue
      }

      if (src) {
        throw new Error('Infinite loop on byte: ' + src.charCodeAt(0))
      }
    }
    return vnodes
  }

  /**
   * 生成链接或图片vnode对象
   * @param {String} cap 链接中子节点源码
   * @param {Object} link 链接对象
   * @returns {Vnode}
   */
  lexLink (cap, link) {
    let href = link.href
    let title = link.title ? link.title : null
    const attributes = {}
    if (isDef(title)) {
      attributes['title'] = title
    }

    // 判断是否为图片
    if (cap[0].charAt(0) !== '!') {
      if (isDef(href)) {
        attributes['href'] = transformURL(this.options.base, href)
      }
      return h({
        tag: 'a',
        children: this.lex(cap[1]),
        attributes
      })
    } else {
      const alt = cap[1]
      if (isDef(href)) {
        attributes['src'] = transformURL(this.options.base, href)
      }
      if (isDef(alt)) {
        attributes['alt'] = alt
      }
      return h({
        tag: 'img',
        attributes
      })
    }
  }

  /**
   * Smartypants Transformations
   * @param {String} text
   * @return {String}
   */
  smartypants (text) {
    if (!this.options.smartypants) {
      return text
    }
    return text
      // em-dashes
      .replace(/---/g, '\u2014')
      // en-dashes
      .replace(/--/g, '\u2013')
      // opening singles
      .replace(/(^|[-\u2014/([{"\s])'/g, '$1\u2018')
      // closing singles & apostrophes
      .replace(/'/g, '\u2019')
      // opening doubles
      .replace(/(^|[-\u2014/([{\u2018\s])"/g, '$1\u201c')
      // closing doubles
      .replace(/"/g, '\u201d')
      // ellipses
      .replace(/\.{3}/g, '\u2026')
  }
}
