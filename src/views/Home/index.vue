<template>
  <div class="Home">
    <h2>element测试</h2>
    <el-button type="primary">测试</el-button>
    <h2>echarts测试</h2>
    <v-chart :options="useStateOption"/>
  </div>
</template>

<script>
export default {
  name: 'Home',
  data () {
    return {
      useStateOption: {
        title: {
          text: 'ECharts 入门示例'
        },
        tooltip: {},
        xAxis: {
          data: ['衬衫', '羊毛衫', '雪纺衫', '裤子', '高跟鞋', '袜子']
        },
        yAxis: {},
        series: [{
          name: '销量',
          type: 'bar',
          data: [5, 20, 36, 10, 10, 20]
        }]
      }
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
