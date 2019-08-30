<template>
  <div class="About">
   <van-nav-bar
  title="标题"
  left-text="返回"
  right-text="按钮"
  left-arrow
  @click-left="() => {}"
  @click-right="() => {}"
/>
    测试vant组件是否可以用
    <van-button>按钮处理</van-button>
  </div>
</template>

<script>
export default {
  name: 'About',
  data () {
    return {

    }
  },
  mounted () {
  },
  methods: {

  },
  components: {

  }
}
</script>

<style lang="scss" scoped>

</style>
