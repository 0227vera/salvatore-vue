<template>
  <div class="index">
    <div class="index-header">
      <div class="index-header-left" @click="closePlugin" />
      <div class="index-header-title">
      </div>
      <div v-show="isCanEditCanvas" class="index-header-right">
        <button :class="{canBack}" @click="$refs.canvas.goBackStep()">撤销</button>
      </div>
    </div>
    <div class="index-main">
      <div class="index-container" :style="{transform: `matrix( ${scale.x}, 0, 0, ${scale.y}, ${translate.x}, ${translate.y} )`}">
        <img :src="mainSrc">
        <div class="index-container-canvas">
          <canvas-show
            :width="997"
            ref="canvas"
            :height="1202"
            :canBack.sync="canBack"
            :InfoOption="InfoOption"
            :preData="preData"
          />
        </div>
      </div>

    </div>
    <div class="index-footer">
      <div class="index-footer-tool">
        <div @click="togglePen">
          <img :src="toolColor">
        </div>
        <div @click="toggleText">
          <span :class="`color${ isCanUseText ? active : -1 }`">A</span>
        </div>
      </div>
      <div class="index-footer-color">
        <div v-show="isCanEditCanvas">
          <div class="index-footer-color-item"
            v-for="(item,index) in color" :key="item.id"
            :style="{
              borderColor: item.color,
              background: index === active ? item.color : 'none'
            }"
            :class="{active:index === active}"
            @click="changeColor(item, index)"
          >
            <span :style="{ background: item.color }"></span>
          </div>
         </div>
      </div>
      <div class="index-footer-opt">
        <button @click="save">保存</button>
      </div>
    </div>
  </div>
</template>

<script>
import canvasShow from '@/components/canvas-show/index.vue'
import Hammer from 'hammerjs'
// 缩放时候在最小的时候的误差值是最小值的0.2倍
const mixMoveMin = 0.2
// 缩放时候在最大的情况的误差值就是0.01，不是倍数
const mixMoveMax = 0.01
export default {
  name: 'index',
  data () {
    return {
      mainSrc: require('@/assets/img/pizhu.png'),
      scale: {
        x: 1,
        y: 1
      },
      translate: {
        x: 0,
        y: 0
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
      color: [
        {
          id: 'type1',
          color: '#F56C6C'
        },
        {
          id: 'type2',
          color: '#000000'
        },
        {
          id: 'type3',
          color: '#409EFF'
        },
        {
          id: 'type4',
          color: '#67C23A'
        },
        {
          id: 'type5',
          color: '#E6A23C'
        },
        {
          id: 'type6',
          color: '#404AFF'
        }
        // {
        //   id: 'type7',
        //   color: '#A040FF'
        // }
      ],
      bH: 667 - 86,
      bW: 375,
      active: -1,
      canBack: false,
      isCanUsePen: false,
      isCanUseText: false,
      InfoOption: {
        color: '#F56C6C',
        shape: 'pen',
        fontSize: 40,
        drawWidth: 5,
        text: ''
      },
      preData: ''
    }
  },
  computed: {
    toolColor () {
      let index = this.active === -1 ? '' : this.active
      if (!this.isCanUsePen) index = ''
      return require(`@/assets/img/footer/color${index}.png`)
    },
    isCanEditCanvas () {
      return this.isCanUsePen || this.isCanUseText
    }
  },
  watch: {
    isCanEditCanvas (val) {
      this.$refs.canvas.toggleEdit(val)
      this.$refs.canvas.OnChange(this.InfoOption)
    }
  },
  mounted () {
    let info = document.querySelector('.index-main').getBoundingClientRect()
    this.bH = info.height
    this.bW = info.width
    this.scale.x = this.b W / 997
    this.scale.y = this.bH / 1202
    this.lockScale.x.min = this.bW / 997
    this.lockScale.y.min = this.bH / 1202
    this.lockScale.y.max = 1 + this.lockScale.y.min / this.lockScale.x.min
    this.currentScale = { ...this.scale }
    this.bindEvent()
  },
  methods: {
    // 主要负责缩放
    bindEvent () {
      let el = document.querySelector('.index-container')
      let options = {
        touchAction: 'auto',
        domEvents: true
      }
      let hammer = new Hammer(el, options)
      hammer.get('pinch').set({ enable: true }) // 会影响到滚动条的滑动
      hammer.on('pinchstart', e => { // 开始放大或者缩小
        if (this.isCanEditCanvas) {
          return
        }
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
        if (this.isCanEditCanvas) {
          return
        }
        if (this.scale.x >= this.lockScale.x.min && this.scale.x <= this.lockScale.x.max) {
          this.scale.x = this.currentScale.x * e.scale
          this.scale.y = this.currentScale.y * e.scale
          this.baseScaleToTranslate()
        }
      })
      hammer.on('pinchend', e => {
        if (this.isCanEditCanvas) {
          return
        }
        // 判断最小的情况
        if (this.scale.x - this.lockScale.x.min < this.lockScale.x.min * mixMoveMin) {
          this.translate.x = 0
          this.translate.y = 0
          this.scale.x = this.lockScale.x.min
          this.scale.y = this.lockScale.y.min
        }
        // 判断最大的情况
        if (this.scale.x >= this.lockScale.x.max - mixMoveMax) {
          this.scale.x = this.lockScale.x.max - mixMoveMax
          this.scale.y = this.lockScale.y.max - this.lockScale.y.min / this.lockScale.x.min * mixMoveMax
          this.baseScaleToTranslate()
        }
      })

      hammer.get('pan').set({ direction: Hammer.DIRECTION_ALL }) // 影响到滚动条的滑动

      hammer.on('panstart', e => { // 单指开始
        if (this.isCanEditCanvas) {
          return
        }
        if (this.scale.x <= this.lockScale.x.min) {
          return
        }
        this.currentTranslate = { ...this.translate }
        this.start = { ...e.center }
        // 在开始的时候需要计算出可拖动的边界
        let position = document.querySelector('.index-container').getBoundingClientRect()
        this.canChange = {
          right: -position.x, // ---> 向右
          left: position.width + position.x - this.bW, // 向左
          bottom: -position.y, // 向下
          top: position.height + position.y - this.bH // 向上
        }
      })
      hammer.on('panmove', e => { // 单指移动
        if (this.isCanEditCanvas) {
          return
        }
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
    },
    baseScaleToTranslate () {
      // 现在容器的宽高
      let position = {
        width: this.bW / this.lockScale.x.min * this.scale.x,
        height: this.bH / this.lockScale.y.min * this.scale.y
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
    },
    // 是否激活壁画工具
    togglePen () {
      this.isCanUsePen = !this.isCanUsePen
      this.active = this.active === -1 ? 0 : this.active
      if (this.isCanUsePen) {
        this.isCanUseText = false
        this.InfoOption.shape = 'pen'
        this.$refs.canvas.OnChange(this.InfoOption)
      }
    },
    // 是否激活文字工具
    toggleText () {
      this.isCanUseText = !this.isCanUseText
      this.active = this.active === -1 ? 0 : this.active
      if (!this.isCanUseText) {
        return
      }
      this.isCanUsePen = false
      this.InfoOption.text = ''
      window.fillText = data => {
        data = data.replace(/@|(&_\$)/g, '')
        this.InfoOption.shape = 'text'
        this.InfoOption.text = data
        this.InfoOption.position = {
          left: (-this.translate.x) / this.scale.x + 10,
          top: (-this.translate.y) / this.scale.y + 100
        }
        this.$refs.canvas.OnChange(this.InfoOption)
        this.InfoOption.text = ''
      }
      window.mCall.textInputPage('编辑内容', this.InfoOption.text, 'fillText')
    },
    changeColor (item, index) {
      this.active = index
      this.InfoOption.color = item.color
      this.$refs.canvas.OnChange(this.InfoOption)
    },
    closePlugin () {
      document.querySelectorAll('canvas').forEach(item => {
        item.outerHTML = ''
      })
      window.mCall.close()
    },
    // 保存数据并返回给原生
    save () {
      // 获取子组件的数据
      let data = this.$refs.canvas.getCanvasObject()
      console.log(data)
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
  display: flex;
  flex-direction: column;
  position: relative;
  &-header{
    height: 40px;
    width: 100%;
    overflow: hidden;
    display: flex;
    padding: 0 10px;
    box-sizing: border-box;
    &-left{
      width: 46px;
      height: 100%;
      background: url('../../assets/img/footer/close.png') no-repeat left center;
    }
    &-right{
      button{
        height: 30px;
        width: 60px;
        text-align: right;
        border: none;
        outline: none;
        display: block;
        margin-top: 5px;
        font-size: 15px;
        border-radius: 5px;
        color: #aaaaaa;
        background: url('../../assets/img/footer/back.png') no-repeat left center;
      }
      .canBack{
        color: #07c160;
        background: url('../../assets/img/footer/can-back.png') no-repeat left center;
      }
    }
    &-title{
      flex: 1;
      display: flex;
      justify-content: center;
      align-items: center;
      h3{
        color:#666;
      }
    }
  }
  &-main{
    flex: 1;
    overflow: hidden;
  }
  &-container{
    width: 997px;
    height: 1202px;
    box-sizing: border-box;
    position: relative;
    overflow: hidden;
    transform-origin: 0 0 0;
    img{
      width: 850px;
      height: 1202px;
      position: absolute;
      transform:translate(-50%, -50%);
      top: 50%;
      left: 50%;
    }
    &-canvas{
      z-index: 2;
      width: 100%;
      height: 100%;
      position: absolute;
      top: 0;
      left: 0;
    }
  }
  &-footer{
    overflow: hidden;
    width: 100%;
    height: 46px;
    box-sizing: border-box;
    display: flex;
    padding: 3px 10px;
    &-tool{
      overflow: hidden;
      div{
        float: left;
        width: 40px;
        height: 40px;
        display: flex;
        justify-content: center;
        align-items: center;
        &:last-child{
          span{
            color: #cccccc;
            font-size:24px;
            position: relative;
            display: block;
            margin-top: -1px;
            &::after{
              content: "";
              background: #ccc;
              display: block;
              width: 120%;
              height: 2px;
              margin-left: -10%;
              position: absolute;
              bottom: 2px;
            }
          }
          .color0{
            color: #F56C6C;
            &::after{
              background: #F56C6C;
            }
          }
          .color1{
            color: #000000;
            &::after{
              background: #000000;
            }
          }
          .color2{
            color: #409EFF;
             &::after{
              background: #409EFF;
            }
          }
          .color3{
            color: #67C23A;
             &::after{
              background: #67C23A;
            }
          }
          .color4{
            color: #E6A23C;
             &::after{
              background: #E6A23C;
            }
          }
          .color5{
            color: #404AFF;
             &::after{
              background: #404AFF;
            }
          }
        }
      }
    }
    &-color{
      flex: 1;
      overflow: hidden;
      & > div{
        width: 100%;
        height: 100%;
        overflow-y: hidden;
        display: flex;
        align-items: center;
        justify-content: flex-start;
      }
      &-item{
        width: 16px;
        height: 16px;
        margin: 0 8px;
        border: 2px solid #eeeeee;
        border-radius: 50%;
        display: flex;
        justify-content: center;
        align-items: center;
        span{
          width: 10px;
          height: 10px;
          display: block;
          border-radius: 50%;
          margin: 3px;
        }
      }
    }
    &-opt{
      button{
        height: 30px;
        width: 60px;
        border: none;
        background: #07c160;
        color: #ffffff;
        outline: none;
        display: block;
        margin-top: 5px;
        font-size: 15px;
        border-radius: 5px;
      }
    }
  }
}
</style>
