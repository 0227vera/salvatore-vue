<template>
  <div class="father">
    <!--
      外层的v-model会监听里面的input的变化而变化
      也就是说：v-model和@input是一组父子的关系，一旦出发@input，父级的v-model也会跟着改变
     -->
    <PText
      v-model="test"
      label="测试"
      @focus="onFocus"
    />
    <!--
      @focus="onFocus"
      不能添加.native修饰符
      如果加了的话不能被子集的$listeners
    -->
  </div>
</template>

<script>
import PText from './index'
export default {
  name: 'father',
  data () {
    return {
      test: ''
    }
  },
  mounted () {
  },
  methods: {
    onFocus () {
      console.log('------------>focus')
    }
  },
  watch: {
    test (val) {
      console.log(val)
    }
  },
  components: {
    PText
  }
}
</script>

<style lang="scss" scoped>

</style>
