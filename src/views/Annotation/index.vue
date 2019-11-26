<template>
  <div class="index">
    <div
      class="index-container"
      :style="{
        transform: `matrix( ${scale.x}, 0, 0, ${scale.y}, ${translate.x}, ${translate.y} )`,
        'transform-origin': `${translateOrigin.x}px ${translateOrigin.y}px 0`
      }"
    >
      <img :src="require('@/assets/img/pizhu.png')" alt="">
      <div class="index-canvas">
        <canvas-show :width="997" v-if="showCanvas" :height="1202" :id="'test'" :InfoOption="InfoOption"></canvas-show>
      </div>
    </div>
    <div class="index-footer">
      <div class="index-footer-tool"></div>
      <div class="index-footer-color"></div>
      <div class="index-footer-opt"></div>
    </div>
  </div>
</template>

<script>
import canvasShow from '@/components/canvas-show/index.vue'
import Hammer from 'hammerjs'
const [ bH, bW ] = [window.innerHeight, window.innerWidth]
// 缩放时候的误差值，同时也会在误差范围类直接赋值边界值
const misMove = 0.2
export default {
  name: 'index',
  data () {
    return {
      scale: {
        x: 1,
        y: 1
      },
      translate: {
        x: 0,
        y: 0
      },
      translateOrigin: {
        x: 0,
        y: 0
      },
      InfoOption: {
        color: '#F56C6C',
        shape: 'pen',
        fontSize: 24
      },
      lockScale: {
        x: {
          min: 0.5,
          max: 2
        },
        y: {
          min: 0.5,
          max: 2
        }
      },
      showCanvas: false,
      isCanMove: true,
      timer: null
    }
  },
  mounted () {
    this.scale.x = bW / 997
    this.scale.y = bH / 1202
    this.lockScale.x.min = bW / 997
    this.lockScale.y.min = bH / 1202
    this.lockScale.y.max = 1 + this.lockScale.y.min / this.lockScale.x.min
    this.currentScale = { ...this.scale }
    this.bindEvent()
  },
  methods: {
    bindEvent () {
      let el = document.querySelector('.index-container')
      let options = {
        touchAction: 'auto',
        domEvents: true
      }
      let hammer = new Hammer(el, options)
      hammer.get('pinch').set({ enable: true }) // 会影响到滚动条的滑动
      hammer.on('pinchstart', e => { // 开始放大或者缩小
        // 记录放大前的缩放值
        this.currentScale = { ...this.scale }
        // 记录放大前的位置，随后这个位置将会随着放大的值的变化而变化
        this.currentTranslate = { ...this.translate }
        let position = el.getBoundingClientRect()
        // 赋值当前的位置信息
        this.position = JSON.parse(JSON.stringify(position))
        this.startCenter = { ...e.center }
      })
      hammer.on('pinchmove', e => { // 双指
        if (this.scale.x >= this.lockScale.x.min && this.scale.x <= this.lockScale.x.max) {
          this.scale.x = this.currentScale.x * e.scale
          this.scale.y = this.currentScale.y * e.scale
          // 现在容器的宽高
          let position = {
            width: bW / this.lockScale.x.min * this.scale.x,
            height: bH / this.lockScale.y.min * this.scale.y
          }
          // 容器相对于开始时候改变的宽高
          let change = {
            width: position.width - this.position.width,
            height: position.height - this.position.height
          }
          // 缩放中心，相对于开始时候的占开始时候的比例
          let per = {
            x: (this.startCenter.x - this.position.x) / this.position.width,
            y: (this.startCenter.y - this.position.y) / this.position.height
          }
          let TChange = {
            x: change.width * per.x,
            y: change.height * per.y
          }
          this.translate.x = this.currentTranslate.x - TChange.x
          this.translate.y = this.currentTranslate.y - TChange.y
        }
      })
      hammer.on('pinchend', e => {
        if (this.scale.x - this.lockScale.x.min < this.lockScale.x.min * misMove) {
          this.translate.x = 0
          this.translate.y = 0
          this.scale.x = this.lockScale.x.min
          this.scale.y = this.lockScale.y.min
        }
        if (this.lockScale.x.max < this.scale.x) {
          this.scale.x = this.lockScale.x.max
        }
        if (this.lockScale.y.max < this.scale.x) {
          this.scale.y = this.lockScale.y.max
        }
      })

      hammer.get('pan').set({ direction: Hammer.DIRECTION_ALL }) // 影响到滚动条的滑动

      hammer.on('panstart', e => { // 单指开始
        if (this.scale.x <= this.lockScale.x.min) {
          return
        }
        this.currentTranslate = { ...this.translate }
        this.start = { ...e.center }
        // 在开始的时候需要计算出可拖动的边界
        let position = document.querySelector('.index-container').getBoundingClientRect()
        this.canChange = {
          right: -position.x, // ---> 向右
          left: position.width + position.x - bW, // 向左
          bottom: -position.y, // 向下
          top: position.height + position.y - bH // 向上
        }
      })
      hammer.on('panmove', e => { // 单指移动
        if (this.scale.x <= this.lockScale.x.min) {
          return
        }
        let change = {
          x: e.center.x - this.start.x,
          y: e.center.y - this.start.y
        }
        if (change.x > 0) { // 向右
          if (change.x < this.canChange.right) {
            this.translate.x = this.currentTranslate.x + change.x
          }
        } else {
          if ((-change.x) < this.canChange.left) {
            this.translate.x = this.currentTranslate.x + change.x
          }
        }
        if (change.y > 0) { // 向下
          if (change.y < this.canChange.bottom) {
            this.translate.y = this.currentTranslate.y + change.y
          }
        } else {
          if (-change.y < this.canChange.top) {
            this.translate.y = this.currentTranslate.y + change.y
          }
        }
      })
    }
  },
  components: {
    canvasShow
  }
}
</script>

<style lang="scss" scoped>
.index{
  width: 100%;
  height: 100%;
  overflow: hidden;
  position: relative;
  &-container{
    width: 997px;
    height: 1202px;
    box-sizing: border-box;
    position: absolute;
    top: 0;
    left: 0;
    img{
      width: 850px;
      height: 1202px;
      position: absolute;
      transform:translate(-50%, -50%);
      top: 50%;
      left: 50%;
    }
  }
  &-canvas{
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
  }
  &-footer{
    width: 100%;
    height: 40px;
    box-sizing: border-box;
    padding: 0 10px;
    position: fixed;
    bottom: 0;
    border-top: 1px solid #cccccc;
  }
}
</style>
