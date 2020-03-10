<template>
  <main-panel>
    <!-- 走的默认的slot位置 -->
    <div>这是那个抵挡的东西呢</div>
    <div>是不是可以使用两个div，而且没有一个根元素包裹呢</div>
    <div>答案是肯定的</div>
    <div>
      <slot-prop :user="faUser" v-slot="{ user }">
        <!-- 在这个地方显然是访问不到user这个对象的 -->
        <!-- {{user.name}} 这个显然是报错的，子组件指出的变量是sonUser变量 -->
        {{faUser.name}}
        <!--
          注意：v-slot返回的数据一定是一个Object的数据类型
          v-slot="{ user }"使用的就是在es6上面的解构，如果在不支持的环境中，你可不使用解构的方式，多获取一层
        -->
        <div>{{user}}</div>
      </slot-prop>
    </div>
    <div>
      <slot-prop-arr :list="list">
        <!--
          这个地方的几个属性说明一下：
          name：是子组件的具名插槽的名字
          data：是子组件抛出来的的，来源:data="item"中的data，记住不是item，可能会弄混淆的
          这里的v-slot:name在老版本中是:slot-scope，包括在element仍然还是这么用的
        -->
        <template v-slot:name="{data}">
          <div>
            <span @click="itemClick(data)">{{data.name}}</span>
          </div>
        </template>
      </slot-prop-arr>
    </div>
    <!--
      当外部使用的时候可以指定相关的slot，将其内容指定为空，这样还是会引起dom的加载不推荐
      推荐在store里面做相关的全局配置
    -->
    <!-- <div slot="header"></div>
    <div slot="footer"></div>-->
  </main-panel>
</template>

<script>
import MainPanel from './MainPanel'
import SlotProp from './SlotProp'
import SlotPropArr from './SlotPropArr'
export default {
  name: 'index',
  components: {
    MainPanel,
    SlotProp,
    SlotPropArr
  },
  data () {
    return {
      list: [
        {
          name: 'zhangsan',
          id: 11
        },
        {
          name: 'lishi',
          id: 22
        },
        {
          name: 'wangwu',
          id: 33
        }
      ],
      faUser: {
        name: 3333,
        subName: 444
      }
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
    itemClick (item) {
      console.log(item)
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
