<template>
  <div class="sync">
    <span>测试sync的用法：</span>
    <input type="textarea" v-model="value" />
  </div>
</template>

<script>
export default {
  name: 'sync',
  props: {
    test: {
      type: String,
      default: 'ssssss'
    }
  },
  components: {

  },
  data () {
    return {
      value: this.test
    }
  },
  computed: {
  },
  watch: {
    value (val) {
      this.$emit('update:test', val)
    }
  },
  created () {

  },
  mouted () {

  },
  methods: {

  }
}
</script>

<style lang="scss" scoped>
</style>
