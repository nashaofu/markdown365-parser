<template lang="pug">
.nav-bar
  ul.nav-bar-list
    li
      button.nav-bar-list-button(
        :class="showMarked && 'nav-bar-list-button-active'",
        type="button",
        title="对比",
        @click="retweet"
      )
        i.fa.fa-retweet
    li
      button.nav-bar-list-button(
        :class="showEditor && 'nav-bar-list-button-active'",
        type="button",
        title="源码",
        @click="toggleEditor"
      )
        i.fa.fa-code
</template>

<script>
export default {
  name: 'nav-bar',
  props: {
    showEditor: {
      type: Boolean,
      default: true
    },
    showMarked: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    retweet () {
      this.$emit('toggleMarked', !this.showMarked)
    },
    toggleEditor () {
      this.$emit('toggleEditor', !this.showEditor)
    }
  }
}
</script>

<style lang="stylus">
button()
  position relative
  display block
  width 52px
  height 52px
  line-height 52px
  border 10px
  border-radius 50%
  outline none
  font-size 22px
  transition all 450ms cubic-bezier(0.23, 1, 0.32, 1) 0ms
  text-align center
  padding 0
  margin 0
  color #fff
  cursor pointer
  background-color #00bcd4
  &:hover&:after
  &:active&:after
    content: ""
    display block
    position absolute
    top 0
    right 0
    bottom 0
    left 0
    border-radius 50%
    background-color rgba(255, 255, 255, 0.4)
  &:active
    box-shadow rgba(0, 0, 0, 0.16) 0px 7px 15px, rgba(0, 0, 0, 0.23) 0px 7px 15px

.nav-bar
  position fixed
  z-index 500
  right 30px
  bottom 30px
  &-list
    padding 0
    margin 0
    list-style none
    li
      margin 15px auto
    &-button
      button()
      &-active
        background-color #ff4081
</style>
