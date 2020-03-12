<template>
  <div class="index">
    <span>测试过滤器的方法</span>
    <input type="text" v-model="value" />
    <span>{{value | capitalize | noXuanLiao}}</span>
  </div>
</template>

<script>
export default {
  name: 'index',
  components: {

  },
  props: {

  },
  data () {
    return {
      value: ''
    }
  },
  computed: {

  },
  watch: {

  },
  created () {

  },
  mouted () {

  },
  methods: {

  },
  filters: {
    capitalize (val) {
      return val && val.slice(0, 1).toUpperCase() + val.slice(1)
    },
    noXuanLiao (val) {
      return val && val.replace(/xuanliao/gi, '')
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
