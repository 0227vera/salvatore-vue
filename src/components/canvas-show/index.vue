
<template>
  <div class="canvas" :style="{height:`${height}px`}">
    <div v-show="hover.show" class="hoverFollow">{{hover.text}} <span></span></div>
      <div class="canvas-edit1" :style="{height:`${height}px`}">
        <!-- 查看面板不可编辑 -->
        <canvas :id="`${id}noEdit`" :height="height" :width="width"></canvas>
    </div>
    <div class="canvas-edit"  :id="`${id}editpanel`" :style="{height:`${height}px`}">
      <!-- 可编辑面板 -->
        <canvas :id="id" :height="height" :width="width"></canvas>
    </div>
  </div>
</template>

<script>
// import { mapState } from 'vuex'
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
          fontSize: 24
        }
      }
    },
    preData: {
      type: String,
      default: ''
    },
    id: {
      type: String,
      default: ''
    },
    index: {
      type: Number,
      default: -1
    }
  },
  // computed: mapState({
  //   semesters: state => state.common.semesters
  // }),
  data () {
    return {
      canvas: null,
      mouseFrom: {}, // 鼠标位置
      mouseTo: {}, // 绘制终点
      drawType: null, // 绘制类型
      canvasObjectIndex: 0, // canvas下标
      textbox: null, // 文本类型
      drawWidth: 10, // 笔画粗细
      color: '#ff0000', // 笔画颜色
      drawingObject: {}, //
      moveCount: 1,
      doDrawing: false,
      config: {
        // canvas配置
        height: 800,
        width: 920
      },
      isDelete: false, // canvas上面的对象是否可以被删除，
      shape: '', //  暂存一个形状 ,在选中转台置空之后在回复时候在使用
      isDrag: false,
      hover: {
        show: false,
        text: '测试文字'
      },
      addData: []
    }
  },
  mounted () {
    this.addObjects()
    this.newCanvas()
    this.OnChange(this.InfoOption)
  },
  watch: {
    InfoOption (val) {
      this.OnChange(val)
    },
    height (val) {
      this.canvas.setHeight(val)
    }
  },
  methods: {
    OnChange (data) {
      this.drawType = data.shape
      this.shape = data.shape
      this.color = data.color
      this.canvas.freeDrawingBrush.color = this.color // 设置自由绘颜色
      this.canvas.freeDrawingBrush.width = this.drawWidth
      this.canvas.isDrawingMode = false
      this.canvas.selection = true
      this.isDelete = false
      if (this.textbox) {
        // 退出文本编辑状态
        this.textbox.exitEditing()
        this.textbox = null
      }
      if (!this.drawType) {
        this.canvas.skipTargetFind = true
      } else if (this.drawType === 'pen') {
        this.canvas.isDrawingMode = true // 笔画自由绘制
      } else if (this.drawType === 'remove') {
        this.canvas.selection = true
        this.canvas.skipTargetFind = false
        this.canvas.selectable = true
        this.isDelete = true
      } else {
        this.canvas.skipTargetFind = false // 画板元素能被选中
        this.canvas.selection = false // 画板不显示选中
      }
    },
    // new Canvas
    newCanvas () {
      // 初始化画板
      let _this = this
      this.canvas = new fabric.Canvas(_this.id, {
        isDrawingMode: true,
        allowTouchScrolling: false,
        skipTargetFind: true, // 整个画板元素能否被选中 true表示不能被选中
        selectable: false, // 控件能否被选择，能否被操作
        selection: false // 画板是否显示选中
      })
      window.canvas = this.canvas
      window.zoom = window.zoom ? window.zoom : 1
      window.zoom = 1
      this.bindEvent()
    },

    // 上次的编辑重新加入canvas中，并且不让编辑不让拖动
    addObjects () {
      let _this = this
      if (this.preData) {
        let addCanvas = new fabric.Canvas(`${_this.id}noEdit`, {
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
    // 设置缩放
    // setZoom () {
    //   let canvasDiv = $(`#${this.config.canvasParentId}`)
    //   let zoom = 1
    //   let eleHeight = canvasDiv.height()
    //   let eleWidth = canvasDiv.width()
    //   let cHeight = this.canvas.height
    //   let cWidth = this.canvas.width
    //   let height = eleHeight > cHeight ? eleHeight : cHeight
    //   let width = eleWidth > cWidth ? eleWidth : cWidth
    //   if (width > height) {
    //     // 横版
    //     width = eleWidth
    //     height = eleHeight
    //     zoom = width / this.config.width
    //   } else {
    //     // 竖版
    //     height = height * eleHeight / this.height * 0.8
    //     zoom = height / this.height
    //   }
    //   window.zoom = zoom || 1
    //   this.canvas.renderAll()
    // },

    // bindEvent  事件绑定
    bindEvent () {
      let _this = this
      this.canvas.on('mouse:down', function (options) {
        // 根据颜色判断在不可编辑的时候只能hover不能标注
        if (!_this.InfoOption.color) {
          return
        }
        let xy = _this.transformMouse(options.pointer.x, options.pointer.y)
        _this.mouseFrom.x = xy.x
        _this.mouseFrom.y = xy.y
        if (_this.drawType === 'text') {
          _this.drawing()
        }
        _this.doDrawing = !options.target // 是否允许画形状
        if (!options.target) {
          _this.drawType = _this.shape
        }
      })
      this.canvas.on('mouse:up', function (options) {
        let xy = _this.transformMouse(options.pointer.x, options.pointer.y)
        _this.mouseTo.x = xy.x
        _this.mouseTo.y = xy.y
        _this.drawingObject = null
        _this.moveCount = 1
        _this.doDrawing = false
        _this.hover.show = false
        _this.getCanvasObject()
      })
      this.canvas.on('mouse:move', function (options) {
        if (!_this.drawType) {
          return
        }
        let xy = _this.transformMouse(options.pointer.x, options.pointer.y)
        let point = { x: xy.x, y: xy.y }
        let length = 0
        _this.addData.forEach(item => {
          let plane = {
            left: item.left,
            top: item.top,
            width: item.width,
            height: item.height
          }
          if (item.type === 'ellipse') {
            plane.top = item.top - item.height / 2
          }

          // TODO: 点在椭圆内的碰撞检测
          if (_this.hitArea(point, plane)) {
            if (item.type === 'line') {
              let judgeDirection = {
                x1: item.x1,
                y1: item.y1
              }
              if (_this.LinehitArea(point, plane, judgeDirection)) {
                length++
                // _this.showText(xy, item)
              }
            } else if (item.path && item.path.length === 5 && item.type !== 'ellipse') {
              if (_this.ArrowHirArea(point, plane, item.path)) {
                length++
                // _this.showText(xy, item)
              }
            } else {
              if (item.type === 'textbox' && !item.text) {
                return
              }
              length++
              // _this.showText(xy, item)
            }
          }
        })
        if (length === 0) {
          _this.hover.show = false
        }

        if (_this.moveCount % 2 && !_this.doDrawing) {
          // 减少绘制频率
          return
        }
        _this.moveCount++

        _this.mouseTo.x = xy.x
        _this.mouseTo.y = xy.y
        _this.drawing()
      })

      this.canvas.on('selection:created', function (e) { //  实际事点击的动作如果点击到元素上面才会触发事件
        if (_this.isDelete) { // 可以删除
          if (e.target._objects) {
          // 多选删除
            let etCount = e.target._objects.length
            for (let etindex = 0; etindex < etCount; etindex++) {
              _this.canvas.remove(e.target._objects[etindex])
            }
          } else {
          // 单选删除
            _this.canvas.remove(e.target)
          }
          _this.canvas.discardActiveObject() // 清楚选中框
        } else { // 不可删除的选中状态
          _this.drawType = '' // 点击选中某个已经存在的元素将不再能够再画板上面进行绘制
        }
      })
    },
    // 坐标转换
    transformMouse (mouseX, mouseY) {
      return { x: mouseX / window.zoom, y: mouseY / window.zoom }
    },

    // 绘制方法
    drawing () {
      let _this = this
      if (_this.drawingObject) {
        _this.canvas.remove(_this.drawingObject)
      }
      let canvasObject = null
      switch (_this.drawType) {
        case 'arrow': // 箭头
          canvasObject = new fabric.Path(
            _this.drawArrow(
              _this.mouseFrom.x,
              _this.mouseFrom.y,
              _this.mouseTo.x,
              _this.mouseTo.y,
              20,
              20
            ),
            {
              stroke: _this.color,
              fill: 'rgba(255,255,255,0)',
              strokeWidth: _this.drawWidth
            }
          )
          break
        case 'line': // 直线
          canvasObject = new fabric.Line(
            [
              _this.mouseFrom.x,
              _this.mouseFrom.y,
              _this.mouseTo.x,
              _this.mouseTo.y
            ],
            {
              stroke: _this.color,
              strokeWidth: _this.drawWidth
            }
          )
          break
        case 'dottedline': // 虚线 可能会用到
          canvasObject = new fabric.Line(
            [
              _this.mouseFrom.x,
              _this.mouseFrom.y,
              _this.mouseTo.x,
              _this.mouseTo.y
            ],
            {
              strokeDashArray: [3, 1],
              stroke: _this.color,
              strokeWidth: _this.drawWidth
            }
          )
          break
        case 'ellipse': // 椭圆   起点是左中 终点是右中 // 实际上还是在长方形的基础上加入了radius
          let left = _this.mouseFrom.x
          let top = _this.mouseFrom.y
          let radius =
            Math.sqrt(
              (_this.mouseTo.x - left) * (_this.mouseTo.x - left) +
                (_this.mouseTo.y - top) * (_this.mouseTo.y - top)
            ) / 2

          canvasObject = new fabric.Ellipse({
            left: left,
            top: top,
            radius,
            stroke: _this.color,
            fill: 'rgba(255, 255, 255, 0)',
            originX: left < _this.mouseTo.x ? 'left' : 'right', // 控制开始的位置 也要允许从右往左的绘制 ，通过控制开始绘制的点来
            originY: 'center',
            rx: Math.abs(left - _this.mouseTo.x) / 2, // 控制结束的位置
            ry: Math.abs(top - _this.mouseTo.y) * 2,
            strokeWidth: _this.drawWidth
          })
          break
        case 'rectangle': // 长方形
          let path =
            `M ${
              _this.mouseFrom.x
            } ${
              _this.mouseFrom.y
            } L ${
              _this.mouseTo.x
            } ${
              _this.mouseFrom.y
            } L ${
              _this.mouseTo.x
            } ${
              _this.mouseTo.y
            } L ${
              _this.mouseFrom.x
            } ${
              _this.mouseTo.y
            } L ${
              _this.mouseFrom.x
            } ${
              _this.mouseFrom.y
            } z`
          canvasObject = new fabric.Path(path, {
            left: left,
            top: top,
            stroke: _this.color,
            strokeWidth: _this.drawWidth,
            fill: 'rgba(255, 255, 255, 0)'
          })
          break
        case 'text':
          _this.textbox = new fabric.Textbox('', {
            left: _this.mouseFrom.x,
            top: _this.mouseFrom.y - 10,
            width: 100,
            fontSize: _this.InfoOption.fontSize,
            borderColor: '#409eff',
            fill: _this.color,
            hasControls: false,
            fontFamily: 'STXingkai'
            // fontFamily: 'STXingkai STLiti KaiTi FangSong'
          })
          _this.canvas.add(_this.textbox)
          _this.textbox.enterEditing()
          _this.textbox.hiddenTextarea.focus()
          _this.canvas.on('text:changed', (e) => {
            // 敏感字符的过滤
            e.target.text = e.target.text.replace(/@|(&_\$)/g, '')
            this.getCanvasObject()
          })
          break
        case 'remove':
          break
        default:
          break
      }
      if (canvasObject) {
        // canvasObject.index = _this.getCanvasObjectIndex()
        canvasObject.content = _this.getText()
        _this.canvas.add(canvasObject)// _this.canvas.setActiveObject(canvasObject)
        canvasObject.hasBorders = false // 拖动线不可见
        // canvasObject.hasControls = false // 拖动点不可见
        _this.drawingObject = canvasObject
      }
    },
    // 绘制箭头方法
    drawArrow (fromX, fromY, toX, toY, theta, headlen) {
      theta = typeof theta !== 'undefined' ? theta : 30
      headlen = typeof theta !== 'undefined' ? headlen : 10
      // 计算各角度和对应的P2,P3坐标
      let angle = Math.atan2(fromY - toY, fromX - toX) * 180 / Math.PI
      let angle1 = (angle + theta) * Math.PI / 180
      let angle2 = (angle - theta) * Math.PI / 180
      let topX = headlen * Math.cos(angle1)
      let topY = headlen * Math.sin(angle1)
      let botX = headlen * Math.cos(angle2)
      let botY = headlen * Math.sin(angle2)
      let arrowX = fromX - topX
      let arrowY = fromY - topY
      let path = ` M ${fromX} ${fromY}`
      path += ` L ${toX} ${toY}`
      arrowX = toX + topX
      arrowY = toY + topY
      path += ` M ${arrowX} ${arrowY}`
      path += ` L ${toX} ${toY}`
      arrowX = toX + botX
      arrowY = toY + botY
      path += ` L ${arrowX} ${arrowY}`
      return path
    },
    // 获取画板对象的下标
    getCanvasObjectIndex () {
      return this.canvasObjectIndex++
    },
    // hover跟随
    showText (xy, item) {
      this.hover = {
        show: true,
        text: item.content
      }
      let point = JSON.parse(JSON.stringify({ x: xy.x - 100, y: xy.y + 30 }))
      if (point.x <= 0) {
        point.x = 0
        $('.hoverFollow span').css({
          left: xy.x
        })
      } else if (point.x >= 760) {
        point.x = 760
        $('.hoverFollow span').css({
          left: xy.x - 760
        })
      } else {
        $('.hoverFollow span').css({
          left: 100
        })
      }
      $('.hoverFollow').css({
        top: point.y,
        left: point.x
      })
    },
    // 获取hover跟随文字
    getText () {
      // return `${this.semesters.userName}在${this.getCurretTime()}对此处进行修改`
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
        index: this.index,
        canvas: compress(obj),
        id: this.id
      }
      this.$emit('get-canvas-json', data)
    },
    // 第二个人查看的hover数据 实际上是一个碰撞检测
    hitArea (point, plane) {
      return !!((point.x > plane.left && point.x < plane.left + plane.width) && (point.y > plane.top && point.y < plane.top + plane.height))
    },

    LinehitArea (point, plane, direction) {
      return this.hitAreaLineAndArrow(point, plane, direction.x1 >= 0)
    },

    ArrowHirArea (point, plane, path) {
      let fromX = path[0][1]
      let fromY = path[0][2]
      let toX = path[1][1]
      let toY = path[1][2]
      let isLeft = false
      if ((fromX < toX && fromY > toY) || (fromX > toX && fromY < toY)) {
        isLeft = true
      }
      return this.hitAreaLineAndArrow(point, plane, isLeft)
    },
    // 针对于直线和箭头之后方向需要判断一下
    hitAreaLineAndArrow (point, plane, disLeft) {
      let tan15 = Math.tan(Math.PI / 180 * 15) // 在15度和75度之间才会经行斜线的判断
      let tan75 = Math.tan(Math.PI / 180 * 75)
      let tanC = plane.height / plane.width
      if (tanC < tan15 || tanC > tan75) {
        return this.hitArea(point, plane)
      }
      let standerH = (point.x - plane.left) * tanC
      let comH
      if (disLeft) { // 从右向左
        comH = plane.top + plane.height - point.y
      } else {
        comH = point.y - plane.top
      }
      let mis = (standerH - comH) / standerH

      // 允许误差范围
      if (Math.abs(mis) < 0.2) {
        return true
      }
      return false
    }

  }
}
</script>

<style lang="scss" scoped>
.canvas {
  width: 100%;
  &-edit {
    width: 100%;
    position: absolute;
    top: 0;
    left: 0;
    z-index: 10;
  }
  &-edit1{
    width: 100%;
    position: absolute;
    top: 0;
    left: 0;
    z-index: 5;
  }
}
 .hoverFollow{
    position: absolute;
    top: 0;
    left: 0;
    width: 200px;
    padding: 5px;
    border-radius: 5px;
    background: rgba(0,0,0,0.6);
    color: #fff;
    font-size: 12px;
    z-index: 999;
    span{
      height: 0;
      width: 0;
      position: absolute;
      border-left: 10px solid transparent;
      border-right: 10px solid transparent;
      border-bottom: 10px solid rgba(0,0,0,0.6);
      left: 100px;
      top: -10px;
      margin-left: -5px;
    }
  }
</style>
