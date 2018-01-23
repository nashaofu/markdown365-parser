import {
  isUndef,
  isDef
} from '../utils.js'

export default class Renderer {
  static vision = process.env.VERSION
  static render (vnode, oldVnode) {
    const renderer = new Renderer()
    return renderer.patch(vnode, oldVnode)
  }

  getNamespace (key) {
    return {
      svg: 'http://www.w3.org/2000/svg',
      xhtml: 'http://www.w3.org/1999/xhtml',
      xlink: 'http://www.w3.org/1999/xlink',
      xml: 'http://www.w3.org/XML/1998/namespace',
      xmlns: 'http://www.w3.org/2000/xmlns/',
      math: 'http://www.w3.org/1998/Math/MathML'
    }[key.toLowerCase()]
  }

  isHTML (tag) {
    return (
      'html,body,base,head,link,meta,style,title,' +
      'address,article,aside,footer,header,h1,h2,h3,h4,h5,h6,hgroup,nav,section,' +
      'div,dd,dl,dt,figcaption,figure,picture,hr,img,li,main,ol,p,pre,ul,' +
      'a,b,abbr,bdi,bdo,br,cite,code,data,dfn,em,i,kbd,mark,q,rp,rt,rtc,ruby,' +
      's,samp,small,span,strong,sub,sup,time,u,var,wbr,area,audio,map,track,video,' +
      'embed,object,param,source,canvas,script,noscript,del,ins,' +
      'caption,col,colgroup,table,thead,tbody,td,th,tr,' +
      'button,datalist,fieldset,form,input,label,legend,meter,optgroup,option,' +
      'output,progress,select,textarea,' +
      'details,dialog,menu,menuitem,summary,' +
      'content,element,shadow,template,blockquote,iframe,tfoot'
    ).split(',').indexOf(tag.toLowerCase()) !== -1
  }

  isSVG (tag) {
    return (
      'svg,animate,circle,clippath,cursor,defs,desc,ellipse,filter,font-face,' +
      'foreignObject,g,glyph,image,line,marker,mask,missing-glyph,path,pattern,' +
      'polygon,polyline,rect,switch,symbol,text,textpath,tspan,use,view'
    ).split(',').indexOf(tag.toLowerCase()) !== -1
  }

  patch (vnode, oldVnode) {
    if (isUndef(vnode)) {
      this.removeEl(oldVnode)
      return
    }

    // 没有旧vnode的时候
    // 即创建新的DOM
    if (isUndef(oldVnode)) {
      const vpc = vnode.parent ? vnode.parent.children : []
      for (let i = 0; i < vpc.length; i++) {
        if (vnode.uid === vpc[i].uid) {
          this.insert(vnode.parent, this.create(vnode), vpc[i + 1])
          break
        }
      }
      return
    }

    // 存在vnode与oldVnode的时候
    if (vnode.type === 'node') {
      // 同一类型节点
      if (vnode.tag === oldVnode.tag) {
        vnode.$el = oldVnode.$el
        this.patchAttributes(vnode, oldVnode)
        this.patchChildren(vnode.children, oldVnode.children)
      } else {
        // 标签不相同的时候就直接创建元素
        this.replace(vnode.parent, this.create(vnode), oldVnode)
      }
    } else if (vnode.type === 'html') {
      if (vnode.text === oldVnode.text) {
        vnode.$el = oldVnode.$el
      } else {
        this.replace(vnode.parent, this.create(vnode), oldVnode)
      }
    } else {
      if (vnode.text === oldVnode.text) {
        vnode.$el = oldVnode.$el
      } else {
        this.replace(vnode.parent, this.create(vnode), oldVnode)
      }
    }
  }

  // 对比属性
  patchAttributes (vnode, oldVnode) {
    // 合并属性
    const attributes = {
      ...oldVnode.attributes,
      ...vnode.attributes
    }
    Object.keys(attributes).forEach(key => {
      if (isUndef(vnode.attributes[key])) {
        return vnode.$el.removeAttribute(key)
      }
      // 只有在属性值不相等并且属性值被定义时时才调用
      if (vnode.attributes[key] !== oldVnode.attributes[key] &&
        isDef(vnode.attributes[key])) {
        vnode.$el.setAttribute(key, vnode.attributes[key])
      }
    })
  }

  // 对比子节点
  patchChildren (newCh = [], oldCh = []) {
    let oldStartIdx = 0
    let newStartIdx = 0
    let oldEndIdx = oldCh.length - 1
    let oldStartVnode = oldCh[0]
    let oldEndVnode = oldCh[oldEndIdx]
    let newEndIdx = newCh.length - 1
    let newStartVnode = newCh[0]
    let newEndVnode = newCh[newEndIdx]
    while (oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {
      if (isUndef(oldStartVnode)) {
        oldStartVnode = oldCh[++oldStartIdx] // Vnode has been moved left
      } else if (isUndef(oldEndVnode)) {
        oldEndVnode = oldCh[--oldEndIdx]
      } else if (oldStartVnode.tag === newStartVnode.tag) {
        this.patch(newStartVnode, oldStartVnode)
        oldStartVnode = oldCh[++oldStartIdx]
        newStartVnode = newCh[++newStartIdx]
      } else if (oldEndVnode.tag === newEndVnode.tag) {
        this.patch(newEndVnode, oldEndVnode)
        oldEndVnode = oldCh[--oldEndIdx]
        newEndVnode = newCh[--newEndIdx]
      } else if (oldStartVnode.tag === newEndVnode.tag) { // Vnode moved right
        this.patch(newEndVnode, oldStartVnode)
        /**
         * 把旧节点真实dom移动到newEndVnode的位置
         * 假定oldStartIdx和newStaetIdx，oldEndIdx和newEndIdx都相同的情况下进行分析
         * 按照如下方法就可以得到最新的按照newCh排列的真实dom结构
         */
        this.insert(oldEndVnode.parent, oldStartVnode, oldCh[oldEndIdx + 1])
        oldStartVnode = oldCh[++oldStartIdx]
        newEndVnode = newCh[--newEndIdx]
      } else if (oldEndVnode.tag === newStartVnode.tag) { // Vnode moved left
        this.patch(newStartVnode, oldEndVnode)
        // 把旧节点真实dom移动到newEndVnode的位置
        this.insert(oldStartVnode.parent, oldEndVnode, oldStartVnode)
        oldEndVnode = oldCh[--oldEndIdx]
        newStartVnode = newCh[++newStartIdx]
      } else {
        // 这种情况就是一个节点变成了另一个节点的情况
        this.replace(newStartVnode.parent, this.create(newStartVnode), oldStartVnode)
        oldStartVnode = oldCh[++oldStartIdx]
        newStartVnode = newCh[++newStartIdx]
      }
    }
    // 以下情况为节点增加或者减少了的情况
    if (oldStartIdx > oldEndIdx) {
      // 插入新节点的情况
      for (; newStartIdx <= newEndIdx; ++newStartIdx) {
        this.insert(newCh[newStartIdx].parent, this.create(newCh[newStartIdx]), newCh[newEndIdx + 1])
      }
    } else if (newStartIdx > newEndIdx) {
      // 移除就无用的旧节点
      for (; oldStartIdx <= oldEndIdx; ++oldStartIdx) {
        this.removeEl(oldCh[oldStartIdx])
      }
    }
  }

  // 创建元素
  create (vnode) {
    if (vnode.type === 'node') {
      if (!vnode.$el) {
        vnode.$el = document.createElement(vnode.tag)
      }
      Object.keys(vnode.attributes).forEach(key => {
        if (isDef(vnode.attributes[key])) {
          vnode.$el.setAttribute(key, vnode.attributes[key])
        }
      })
      vnode.children.forEach(item => {
        vnode.$el.appendChild(this.create(item).$el)
      })
    } else if (vnode.type === 'html') {
      const node = document.createElement('div')
      node.innerHTML = vnode.text
      vnode.$el = node.children[0]
    } else {
      vnode.$el = document.createTextNode(vnode.text)
    }
    return vnode
  }

  // 追加节点
  append (parent, vnode) {
    parent.$el.appendChild(vnode.$el)
  }

  insert (parent, vnode, before) {
    if (before && before.$el) {
      parent.$el.insertBefore(vnode.$el, before.$el)
    } else {
      this.append(parent, vnode)
    }
  }

  // 移除节点
  removeEl (vnode) {
    // 移除的只可能是旧的节点
    // 所以不用在其父节点中移除节点
    if (vnode.$el.parentElement) {
      vnode.parent.$el.removeChild(vnode.$el)
    }
  }

  // 替换节点
  replace (parent, vnode, oldVnode) {
    if (isDef(parent)) {
      if (oldVnode &&
        isDef(oldVnode.$el) &&
        oldVnode.parent.$el === parent.$el &&
        oldVnode.$el.parentElement) {
        parent.$el.replaceChild(vnode.$el, oldVnode.$el)
      } else {
        parent.$el.appendChild(vnode.$el)
      }
    }
  }
}
