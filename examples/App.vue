<template lang="pug">
#app
  editor(v-model="value")
  Viewer(:value="value")
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
</style>
