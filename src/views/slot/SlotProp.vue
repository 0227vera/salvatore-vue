<template>
  <div class="slotProp">
    这个是用来展示slot传值的问题
    <div>
      <slot :user="user">{{user.name}}</slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'slotProp',
  components: {

  },
  props: {
    user: {
      type: Object,
      default: () => {
        return { name: 222 }
      }
    }
  },
  data () {
    return {

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

  }
}
</script>

<style lang="scss" scoped>
</style>
