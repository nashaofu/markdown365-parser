export default class VNode {
  static vision = process.env.VERSION
  static uid = 0
  constructor ({
    $el = null,
    tag = null,
    type = 'node', // 可为node/text/html
    parent = null,
    children = [],
    attributes = {},
    text = null,
    source = null
  } = {}) {
    this.uid = VNode.uid++
    this.$el = $el
    this.tag = tag
    this.type = type
    this.parent = parent
    this.children = children
    this.attributes = attributes
    this.text = text
    this.source = source
  }
}
