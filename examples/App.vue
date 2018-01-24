<template lang="pug">
#app
  editor(
    v-model="value",
    :show="showEditor"
  )
  marked(
     :value="value",
    :show="showMarked"
  )
  viewer(
    :value="value",
    :full="full"
  )
  github
  navbar(
    :showEditor="showEditor",
    :showMarked="showMarked",
    @toggleEditor="toggleEditor",
    @toggleMarked="toggleMarked"
  )
</template>

<script>
import grammar from '../Grammar.md'
import Editor from './components/editor'
import Viewer from './components/viewer'
import Github from './components/github'
import Navbar from './components/navbar'
import Marked from './components/marked'

export default {
  name: 'App',
  components: {
    Editor,
    Viewer,
    Github,
    Navbar,
    Marked
  },
  data () {
    return {
      value: grammar,
      showEditor: true,
      showMarked: false
    }
  },
  computed: {
    full () {
      return !this.showEditor && !this.showMarked
    }
  },
  methods: {
    toggleEditor (val) {
      this.showEditor = val
      if (val) {
        this.showMarked = false
      }
    },
    toggleMarked (val) {
      this.showMarked = val
      if (val) {
        this.showEditor = false
      }
    }
  }
}
</script>

<style lang="stylus">
@import "normalize.css"
@import "font-awesome/css/font-awesome.css"

*
  box-sizing border-box

html
body
  font-family "Source Sans Pro", "Helvetica Neue", Arial, sans-serif

::-webkit-scrollbar
  width 6px
  height 6px
  &-track
    border-radius 3px
    background-color rgba(231,231,231,0.1)
  &-thumb
    background-color #bcd
    border-radius 3px
</style>
