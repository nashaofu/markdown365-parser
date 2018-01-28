<template lang="pug">
.marked(:style="getStyle")
  .marked-title Marked渲染效果
  transition(name="fade")
    .marked-container.markdown-body(
      v-if="show",
      ref="view",
      v-html="html"
    )
</template>

<script>
import marked from 'marked'
import hljs from 'highlight.js'

export default {
  name: 'marked',
  props: {
    value: {
      tyep: String,
      default: ''
    },
    show: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    html () {
      return marked(this.value)
    },
    getStyle () {
      return this.show ? '' : 'visibility: hidden;'
    }
  },
  watch: {
    value: 'highlight',
    show: 'highlight'
  },
  methods: {
    highlight () {
      this.$nextTick(() => {
        if (this.$refs.view) {
          this.$refs.view
            .querySelectorAll('pre code')
            .forEach(item => hljs.highlightBlock(item))
        }
      })
    }
  }
}
</script>

<style lang="stylus">
.marked
  width 50%
  position absolute
  top 0
  bottom 0
  left 0
  z-index 90
  background-color #fff
  border-right 1px solid #eee
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

.fade-enter-active
.fade-leave-active
  transition: opacity 0.3s ease-in-out
.fade-enter, .fade-leave-to
  opacity: 0
</style>
