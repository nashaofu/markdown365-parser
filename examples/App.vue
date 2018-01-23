<template lang="pug">
#app
  editor(v-model="value")
  viewer(:value="value")
  github
  navbar
</template>

<script>
import grammar from '../Grammar.md'
import Editor from './components/editor'
import Viewer from './components/viewer'
import Github from './components/github'
import Navbar from './components/navbar'

export default {
  name: 'App',
  components: {
    Editor,
    Viewer,
    Github,
    Navbar
  },
  data () {
    return {
      value: grammar
    }
  }
}
</script>

<style lang="stylus">
@import "normalize.css"
@import "font-awesome/css/font-awesome.css"

*
  box-sizing border-box

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
