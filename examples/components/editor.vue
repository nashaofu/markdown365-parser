<template lang="pug">
.editor
  .editor-container(ref="editor")
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
  &-container
    position absolute
    top 0
    right 0
    bottom 0
    left 0
    font-size 18px
    padding 7px 12px
    .CodeMirror
      width 100%
      height 100%
      background-color #f8f8f8
</style>
