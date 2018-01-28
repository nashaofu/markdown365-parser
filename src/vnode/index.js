import VNode from './vnode'

export default ({
  $el = null,
  tag = null,
  type = 'node',
  parent = null,
  children = [],
  attributes = {},
  text = '',
  source = null
} = {}) => {
  const vnode = new VNode({
    $el,
    tag,
    type,
    parent,
    children,
    attributes,
    text,
    source
  })
  // 每个子节点都把parent指向当前节点vnode
  vnode.children.forEach(item => {
    item.parent = vnode
  })
  return vnode
}
