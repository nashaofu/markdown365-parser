<template lang="pug">
.viewer.markdown-body
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
    }
  },
  data () {
    return {
      parser: null
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
      $el: this.$el
    })
    this.render()
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
      this.$el
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
  padding 7px 12px
  overflow auto
  img
    max-width 100%
    &[alt="markdown365"]
      max-width 120px
   pre
    background #272822
    border-radius 3px
    overflow-x auto
    code
      display block
      background #272822
      color #ddd
</style>
