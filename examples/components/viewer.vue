<template lang="pug">
.viewer(:class="full && 'viewer-full'")
  .viewer-title Markdown365-parser渲染效果
  .viewer-container.markdown-body(ref="view")
</template>

<script>
import hljs from 'highlight.js'
import Markdown365Parser from '../../src'

export default {
  name: 'viewer',
  props: {
    value: {
      type: String,
      default: ''
    },
    full: {
      type: Boolean,
      default: true
    }
  },
  mounted () {
    this.parser = new Markdown365Parser({
      gfm: true,
      tables: true,
      breaks: false,
      pedantic: false,
      sanitize: false,
      sanitizer: null,
      smartLists: false,
      smartypants: false,
      base: '',
      $el: this.$refs.view
    })
    this.render()
    console.log(this.parser)
  },
  watch: {
    value () {
      this.render()
    }
  },
  methods: {
    render () {
      if (!this.parser) {
        return
      }
      this.parser.parse(this.value)
      this.$refs.view
        .querySelectorAll('pre code')
        .forEach(item => hljs.highlightBlock(item))
    }
  }
}
</script>

<style lang="stylus">
@import 'highlight.js/styles/monokai.css'
@import "github-markdown-css/github-markdown.css"

.viewer
  width 50%
  position absolute
  top 0
  right 0
  bottom 0
  z-index 100
  background-color #fff
  transition width 0.3s ease-in-out
  border-left 1px solid #eee
  &-full
    width 100%
  &-title
    position absolute
    top 0
    right 0
    left 0
    font-size 20px
    text-align center
    height 42px
    line-height 42px
    font-weight 600
    background-color #fff
    border-bottom 1px solid #eee
    box-shadow 0 2px 5px #eee
  &-container
    position absolute
    top 42px
    right 0
    bottom 0
    left 0
    padding 12px
    overflow auto
  img
    max-width 100%
    display block
    margin 0 auto
    &[alt="markdown365"]
      max-width 200px
  .markdown-body pre
    background #272822
    border-radius 3px
    overflow-x auto
    code
      display block
      background #272822
      color #ddd
</style>
