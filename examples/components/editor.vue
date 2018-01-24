<template lang="pug">
.editor
  .editor-title 编辑器
  transition(name="fade")
    .editor-container(
      v-show="show",
      ref="editor"
    )
</template>

<script>
import codemirror from 'codemirror'
import debounce from 'lodash/debounce'
import 'codemirror/mode/markdown/markdown'
import 'codemirror/addon/scroll/simplescrollbars'
import 'codemirror/addon/display/placeholder'
import 'codemirror/keymap/sublime'

export default {
  name: 'editor',
  props: {
    value: {
      type: String,
      default: ''
    },
    show: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      editor: null
    }
  },
  mounted () {
    this.init()
    this.setValue()
  },
  watch: {
    value () {
      this.setValue()
    }
  },
  methods: {
    init () {
      this.editor = codemirror(this.$refs.editor, {
        mode: 'text/x-markdown',
        theme: 'xq-light',
        indentUnit: 2,
        smartIndent: true,
        tabSize: 4,
        indentWithTabs: true,
        keyMap: 'sublime',
        lineWrapping: true,
        scrollbarStyle: 'overlay',
        inputStyle: 'contenteditable',
        showCursorWhenSelecting: true,
        placeholder: '输入markdown',
        lineWiseCopyCut: true,
        autofocus: true,
        resetSelectionOnContextMenu: true
      })
      this.editor.on('change', this.change)
    },
    change: debounce(function () {
      const value = this.editor.getValue()
      if (this.value !== value) {
        this.$emit('input', value)
      }
    }, 700),
    setValue () {
      const value = this.editor.getValue()
      if (value !== this.value) {
        this.editor.setValue(this.value)
      }
    }
  }
}
</script>

<style lang="stylus">
@import "codemirror/lib/codemirror.css"
@import "codemirror/theme/xq-light.css"
@import "codemirror/addon/scroll/simplescrollbars.css"

.editor
  width 50%
  position absolute
  top 0
  bottom 0
  left 0
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
    font-size 18px
    .CodeMirror
      width 100%
      height 100%
      padding 7px 12px
      background-color #f8f8f8

.fade-enter-active
.fade-leave-active
  transition: opacity 0.3s ease-in-out
.fade-enter, .fade-leave-to
  opacity: 0
</style>
