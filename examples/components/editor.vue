<template lang="pug">
.editor
  textarea(
    v-model="val"
  )
</template>

<script>
export default {
  name: 'editor',
  props: {
    value: {
      type: String,
      default: ''
    }
  },
  computed: {
    val: {
      get () {
        return this.value
      },
      set (val) {
        this.$emit('input', val)
      }
    }
  }
}
</script>

<style lang="stylus">
.editor
  width 50%
  position absolute
  top 0
  bottom 0
  left 0
  textarea
    display block
    width 100%
    height 100%
    resize none
    outline none
    border none
    padding 6px 10px
</style>
