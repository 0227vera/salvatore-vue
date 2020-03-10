<template>
  <div class="SlotPropArr">
    <span>slot更多使用的数组的场景，把具体的某一项，抛出去方便做对应的数据操作，eg：element</span>
    <ul>
      <li v-for="(item, index) in list" :key="index">
        <slot name="name" :data="item">
          <span>{{item.name}}</span>
        </slot>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'SlotPropArr',
  components: {

  },
  props: {
    list: {
      type: Array,
      default: () => [],
      required: true
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
