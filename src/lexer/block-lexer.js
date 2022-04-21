import block from './block-rules'
import h from '../vnode'
import { isDef } from '../utils'

/**
 * Block Lexer
 */
export default class BlockLexer {
  static version = process.env.VERSION
  static rules = block
  /**
   * Static Lex Method
   */
  static lex (src, options) {
    const blockLexer = new BlockLexer(options)
    return blockLexer.parser(src)
  }

  /**
   * 初始化类
   * @param {Object} options
   */
  constructor ({
    gfm = true,
    tables = true,
    pedantic = false
  } = {}) {
    this.options = {
      gfm,
      tables,
      pedantic
    }

    // 初始化解析规则
    this.rules = block.normal
    // 初始化参考式的链接或图片存储的对象
    this.links = {}
    // 初始化vnode
    this.vnode = []

    if (this.options.gfm) {
      if (this.options.tables) {
        this.rules = block.tables
      } else {
        this.rules = block.gfm
      }
    }
  }
  /**
   * 解析源码
   * @param {String} src
   * @return {Object} vnode links
   */
  parser (src) {
    src = src
      .replace(/\r\n|\r/g, '\n')
      .replace(/\t/g, '    ')
      .replace(/\u00a0/g, ' ')
      .replace(/\u2424/g, '\n')

    this.vnode = this.lex(src, true)
    return {
      vnode: this.vnode,
      links: this.links
    }
  }

  /**
   * 解析源码
   * @param {String} src
   * @param {Boolean} top 是否是顶级的标签
   * @param {Boolean} bq 是否为blockquote便签中的元素
   * @return {Vnode}
   */
  lex (src, top, bq) {
    src = src.replace(/^ +$/gm, '')

    const vnodes = []
    let token
    let vnode
    while (src) {
      // newline
      if (token = this.rules.newline.exec(src)) {
        src = src.substring(token[0].length)
      }

      // code
      if (token = this.rules.code.exec(src)) {
        src = src.substring(token[0].length)
        token = token[0].replace(/^ {4}/gm, '')
        vnode = h({
          tag: 'pre',
          children: [
            h({
              tag: 'code',
              children: [
                h({
                  type: '',
                  text: !this.options.pedantic
                    ? token.replace(/\n+$/, '')
                    : token
                })
              ]
            })
          ]
        })
        vnodes.push(vnode)
        continue
      }

      // fences (gfm)
      if (token = this.rules.fences.exec(src)) {
        src = src.substring(token[0].length)
        const attributes = {}
        if (isDef(token[2])) {
          attributes['class'] = `lang-${token[2]}`
        }
        vnode = h({
          tag: 'pre',
          children: [
            h({
              tag: 'code',
              children: [
                h({
                  type: 'text',
                  text: token[3] || ''
                })
              ],
              attributes
            })
          ]
        })
        vnodes.push(vnode)
        continue
      }

      // heading
      if (token = this.rules.heading.exec(src)) {
        src = src.substring(token[0].length)
        vnode = h({
          tag: `h${token[1].length}`,
          source: token[2]
        })
        vnodes.push(vnode)
        continue
      }

      // table no leading pipe (gfm)
      if (top && (token = this.rules.nptable.exec(src))) {
        src = src.substring(token[0].length)
        const thead = token[1]
          .replace(/^ *| *\| *$/g, '')
          .split(/ *\| */)

        const align = token[2]
          .replace(/^ *|\| *$/g, '')
          .split(/ *\| */)
          .map(al => {
            if (/^ *-+: *$/.test(al)) {
              return 'right'
            } else if (/^ *:-+: *$/.test(al)) {
              return 'center'
            } else if (/^ *:-+ *$/.test(al)) {
              return 'left'
            } else {
              return null
            }
          })

        const tbody = token[3]
          .replace(/\n$/, '')
          .split('\n')
          .map(tr => {
            return tr.split(/ *\| */)
          })

        vnodes.push(this.lexTable(thead, tbody, align))
        continue
      }

      // lheading
      if (token = this.rules.lheading.exec(src)) {
        src = src.substring(token[0].length)
        vnode = h({
          tag: `h${token[2] === '=' ? 1 : 2}`,
          source: token[1]
        })
        vnodes.push(vnode)
        continue
      }

      // hr
      if (token = this.rules.hr.exec(src)) {
        src = src.substring(token[0].length)
        vnode = h({
          tag: 'hr'
        })
        vnodes.push(vnode)
        continue
      }

      // blockquote
      if (token = this.rules.blockquote.exec(src)) {
        src = src.substring(token[0].length)

        token = token[0].replace(/^ *> ?/gm, '')

        // Pass `top` to keep the current
        // "toplevel" state. This is exactly
        // how markdown.pl works.
        vnode = h({
          tag: 'blockquote',
          children: this.lex(token, top, true)
        })
        vnodes.push(vnode)
        continue
      }

      // list
      if (token = this.rules.list.exec(src)) {
        src = src.substring(token[0].length)
        let bull = token[2]
        // Get each top-level item.
        token = token[0].match(this.rules.item)

        let i = 0
        let l = token.length
        const list = []
        for (; i < l; i++) {
          let item = token[i]

          // Remove the list item's bullet
          // so it is seen as the next token.
          let space = item.length
          item = item.replace(/^ *([*+-]|\d+\.) +/, '')

          // Outdent whatever the
          // list item contains. Hacky.
          if (~item.indexOf('\n ')) {
            space -= item.length
            item = !this.options.pedantic
              ? item.replace(new RegExp('^ {1,' + space + '}', 'gm'), '')
              : item.replace(/^ {1,4}/gm, '')
          }

          // Determine whether the next list item belongs here.
          // Backpedal if it does not belong in this list.
          if (i !== l - 1) {
            let b = block.bullet.exec(token[i + 1])[0]
            if (bull !== b && !(bull.length > 1 && b.length > 1)) {
              src = token.slice(i + 1).join('\n') + src
              i = l - 1
            }
          }
          // Recurse.
          list.push(this.lex(item, false, bq))
        }
        vnode = h({
          tag: bull.length > 1 ? 'ol' : 'ul',
          children: list.map(li => {
            return h({
              tag: 'li',
              children: li
            })
          })
        })
        vnodes.push(vnode)
        continue
      }

      // html
      if (token = this.rules.html.exec(src)) {
        src = src.substring(token[0].length)

        vnode = h({
          type: 'html',
          text: token[0]
        })
        vnodes.push(vnode)
        continue
      }

      // def
      if ((!bq && top) && (token = this.rules.def.exec(src))) {
        src = src.substring(token[0].length)
        this.links[token[1].toLowerCase()] = {
          href: token[2],
          title: token[3]
        }
        continue
      }

      // table (gfm)
      if (top && (token = this.rules.table.exec(src))) {
        src = src.substring(token[0].length)

        const thead = token[1]
          .replace(/^ *| *\| *$/g, '')
          .split(/ *\| */)
        const align = token[2]
          .replace(/^ *|\| *$/g, '')
          .split(/ *\| */)
          .map(al => {
            if (/^ *-+: *$/.test(al)) {
              return 'right'
            } else if (/^ *:-+: *$/.test(al)) {
              return 'center'
            } else if (/^ *:-+ *$/.test(al)) {
              return 'left'
            } else {
              return null
            }
          })
        const tbody = token[3]
          .replace(/(?: *\| *)?\n$/, '')
          .split('\n')
          .map(tr => {
            return tr
              .replace(/^ *\| *| *\| *$/g, '')
              .split(/ *\| */)
          })
        vnodes.push(this.lexTable(thead, tbody, align))
        continue
      }

      // top-level paragraph
      if (top && (token = this.rules.paragraph.exec(src))) {
        src = src.substring(token[0].length)
        vnode = h({
          tag: 'p',
          source: token[1].charAt(token[1].length - 1) === '\n'
            ? token[1].slice(0, -1)
            : token[1]
        })
        vnodes.push(vnode)
        continue
      }

      // text
      if (token = this.rules.text.exec(src)) {
        // Top-level should never reach here.
        src = src.substring(token[0].length)
        vnode = h({
          type: top ? 'node' : 'text',
          tag: top ? 'p' : null,
          source: token[0]
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
   * 解析table
   * @param {Array} thead 表头每一列
   * @param {Array} tbody 表格每一行
   * @param {Array} align 表格每一列对齐方式
   * @return {Vnode}
   */
  lexTable (thead, tbody, align) {
    return h({
      tag: 'table',
      children: [
        h({
          tag: 'thead',
          children: [
            h({
              tag: 'tr',
              children: thead.map((th, index) => {
                const attributes = {}
                if (isDef(align[index])) {
                  attributes['align'] = align[index]
                }
                return h({
                  tag: 'th',
                  attributes,
                  source: th
                })
              })
            })
          ]
        }),
        h({
          tag: 'tbody',
          children: tbody.map(tr => {
            return h({
              tag: 'tr',
              children: tr.map((td, index) => {
                const attributes = {}
                if (isDef(align[index])) {
                  attributes['align'] = align[index]
                }
                return h({
                  tag: 'td',
                  attributes,
                  source: td
                })
              })
            })
          })
        })
      ]
    })
  }
}
