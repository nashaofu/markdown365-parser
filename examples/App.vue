<template lang="pug">
#app
  editor(v-model="value")
  Viewer(:value="value")
  a(href="https://github.com/markdown365/markdown365-parser")
    img(
      style="position: absolute; top: 0; right: 0; border: 0;",
      src="https://camo.githubusercontent.com/652c5b9acfaddf3a9c326fa6bde407b87f7be0f4/68747470733a2f2f73332e616d617a6f6e6177732e636f6d2f6769746875622f726962626f6e732f666f726b6d655f72696768745f6f72616e67655f6666373630302e706e67",
      alt="Fork me on GitHub",
      data-canonical-src="https://s3.amazonaws.com/github/ribbons/forkme_right_orange_ff7600.png"
    )
</template>

<script>
import Editor from './components/editor'
import Viewer from './components/viewer'
import grammar from '../Grammar.md'

export default {
  name: 'App',
  components: {
    Editor,
    Viewer
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
