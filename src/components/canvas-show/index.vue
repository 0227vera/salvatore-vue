
<template>
  <div class="canvas" :style="{height:`${height}px`}">
    <div class="canvas-canNotEdit" :style="{height:`${height}px`}">
      <!-- 查看面板不可编辑 -->
      <canvas id="canNotEditCanvas" :height="height" :width="width"></canvas>
    </div>
    <div class="canvas-canEdit" :style="{height:`${height}px`}">
      <!-- 可编辑面板 -->
      <canvas id="canEditCanvas" :height="height" :width="width"></canvas>
    </div>
  </div>
</template>

<script>
import { decompression, compress } from '@/utils/json-com-dec'
export default {
  props: {
    width: {
      type: Number,
      default: 970
    },
    height: {
      type: Number,
      default: 800
    },
    InfoOption: {
      type: Object,
      default: () => {
        return {
          color: '#F56C6C',
          shape: 'pen',
          fontSize: 24,
          drawWidth: 5
        }
      }
    },
    preData: {
      type: String,
      default: ''
    },
    canBack: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      canvas: null,
      addData: [],
      isCanEdit: false,
      userName: ''
    }
  },
  mounted () {
    this.loadCanNotEditCanvas()
    this.newCanEditCanvas()
    this.OnChange(this.InfoOption)
  },
  methods: {
    // 上次的编辑重新加入canvas中，并且不让编辑不让拖动
    loadCanNotEditCanvas () {
      if (this.preData) {
        let addCanvas = new fabric.StaticCanvas('canNotEditCanvas', {
          isDrawingMode: false,
          skipTargetFind: true, // 整个画板元素能否被选中 true表示不能被选中
          selectable: false, // 控件能否被选择，能否被操作
          selection: false // 画板是否显示选中
        })
        let data = {}
        try {
          data = JSON.parse(this.preData)
        } catch (error) {
          data = decompression(this.preData)
        }
        this.addData = data.objects
        addCanvas.loadFromJSON(data)
      }
    },
    // 添加新的canvas供当前人使用
    newCanEditCanvas () {
      // 初始化画板
      this.canvas = new fabric.Canvas('canEditCanvas', {
        isDrawingMode: false,
        allowTouchScrolling: false,
        skipTargetFind: true, // 整个画板元素能否被选中 true表示不能被选中
        selectable: false, // 控件能否被选择，能否被操作
        selection: false // 画板是否显示选中
      })
      this.bindEvent()
    },
    // bindEvent  事件绑定 对相应的对象经行操作
    bindEvent () {
      this.canvas.on('object:added', options => {
        let target = options.target
        target.hasBorders = false
        target.hasRotatingPoint = false
        target.hasControls = false
        // 如果是铅笔，需要检测一下是否满足最小的长度，否则是不让加载进入画布的
        if (target.path) {
          if (target.path.length < 5) {
            this.goBackStep()
          }
        }
        this.moveTo()
      })
      this.canvas.on('mouse:up', options => {
        if (!options.target) {
          return
        }
        if (options.target.type === 'textbox') {
          let pointer = options.pointer
          let dis = this.getDistance(this.pointer, pointer)
          // 在移动距离小于20的时候认为是想去修改文本的内容，否则认为是在移动元素
          if (dis > 5) {
            return
          }
          window.fillText = data => {
            data = data.replace(/@|(&_\$)/g, '')
            options.target.text = data
            document.activeElement.blur()
            this.canvas.renderAll()
          }
          window.mCall.textInputPage('编辑内容', options.target.text, 'fillText')
        }
      })
      this.canvas.on('mouse:down', e => {
        this.pointer = e.pointer
      })
    },
    // 将文字移到最上面的图层
    moveTo () {
      let data = this.canvas.getObjects()
      let length = data.length
      if (length) {
        this.$emit('update:canBack', true)
      }
      data.forEach(item => {
        if (!item.path) {
          this.canvas.moveTo(item, length)
          length--
        }
      })
      this.canvas.renderAll()
    },
    // 求两点之间的距离
    getDistance (point1, point2) {
      return Math.sqrt((point1.x - point2.x) ** 2 + (point1.y - point2.y) ** 2)
    },
    // 面板属性的变化会引发相关canvas属性的变化
    OnChange (data) {
      if (data.shape === 'text') {
        if (!this.isCanEdit) {
          return
        }
        this.canvas.isDrawingMode = false
        this.canvas.skipTargetFind = false
        if (!data.text) {
          return
        }
        let textbox = new fabric.Textbox(data.text, {
          left: data.position.left,
          top: data.position.top,
          width: 100,
          fontSize: data.fontSize,
          borderColor: '#409eff',
          fill: data.color,
          hasControls: false,
          hasBorders: false,
          fontFamily: 'STXingkai'
        })
        this.canvas.add(textbox)
      } else if (data.shape === 'pen') {
        this.canvas.skipTargetFind = true
        this.canvas.freeDrawingBrush.color = data.color // 设置自由绘颜色
        this.canvas.freeDrawingBrush.width = data.drawWidth
        this.canvas.isDrawingMode = this.isCanEdit // 笔画自由绘制
      }
    },
    // 是否可编辑
    toggleEdit (val) {
      this.isCanEdit = val
      if (!val) {
        this.canvas.skipTargetFind = true
      }
    },
    // 撤销
    goBackStep () {
      let data = this.canvas.getObjects()
      if (data.length <= 1) {
        this.$emit('update:canBack', false)
      }
      if (!data.length) {
        return
      }
      this.canvas.remove(data[data.length - 1])
    },
    // 获取hover跟随文字
    getText () {
      return `${this.userName}在${this.getCurretTime()}对此处进行修改`
    },
    getCurretTime () {
      let date = new Date()
      let year = date.getFullYear()
      let month = date.getMonth() + 1
      month = this.PatchPosition(month)
      let day = date.getDate()
      day = this.PatchPosition(day)
      let hour = date.getHours()
      hour = this.PatchPosition(hour)
      let minute = date.getMinutes()
      minute = this.PatchPosition(minute)
      let second = date.getSeconds()
      second = this.PatchPosition(second)
      return `${year}-${month}-${day} ${hour}:${minute}:${second}`
    },
    PatchPosition (num) {
      return num <= 9 ? `0${num}` : num
    },
    // 获取数据并储存于canvas
    getCanvasObject () {
      let obj = this.canvas.toDatalessJSON()
      obj.objects = obj.objects.concat(this.addData)
      obj.objects.forEach(item => { if (!item.content) item.content = this.getText() })
      let data = {
        canvasZip: compress(obj),
        canvasJson: JSON.stringify(obj)
      }
      return data
    }
  }
}
</script>

<style lang="scss" scoped>
.canvas {
  overflow: hidden;
  width: 100%;
  &-canEdit,&-canNotEdit {
    width: 100%;
    position: absolute;
    top: 0;
    left: 0;
    z-index: 4;
  }
  &-canNotEdit{
    z-index: 2;
  }
}
</style>
