<template>
  <div class="index">
    <label>
      {{label}}
      <input
        type="text"
        :value="str"
        v-on="inputListeners"
      >
    </label>
  </div>
</template>

<script>
export default {
  name: 'index',
  model: {
    prop: 'str',
    event: 'input'
  },
  props: {
    // 如果props的名字不是value，则需要在上面添加一下model的相关配置
    str: {
      type: String,
      default: ''
    },
    label: {
      type: String,
      default: 'test',
      required: true
    }
  },
  data () {
    return {

    }
  },
  computed: {
    inputListeners: function () {
      var vm = this
      // `Object.assign` 将所有的对象合并为一个新对象
      return Object.assign({},
        // 我们从父级添加所有的监听器
        this.$listeners,
        // 然后我们添加自定义监听器，
        // 或覆写一些监听器的行为
        {
          // 这里确保组件配合 `v-model` 的工作
          input: function (event) {
            vm.$emit('input', event.target.value)
          }
        }
      )
    }
  },
  mounted () {
    console.log(this.inputListeners)
  },
  methods: {

  },
  components: {

  }
}
</script>

<style lang="scss" scoped>

</style>
