<template>
  <div class="index">
    <div id="index-container" class="index-container" />
  </div>
</template>

<script>
import * as THREE from 'three'
import isWebGl from '@/assets/js/WebGl.js'
THREE.isWebGl = isWebGl
require('three/examples/js/loaders/GLTFLoader')
export default {
  name: 'index',
  data () {
    return {
      scene: null
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    init () {
      const container = document.querySelector('#index-container')
      if (!isWebGl.isWebGL2Available()) {
        let warning = isWebGl.getWebGLErrorMessage()
        container.appendChild(warning)
        return
      }
      // 创建一个舞台，或者说场景
      this.scene = new THREE.Scene()
      // 创建一个相机
      /**
       * PerspectiveCamera：透视摄像机
       * 第一个属性：视野角度
       * 第二个属性：长宽比
       * 第三/四个属性：远剪切面和近剪切面
       *
      */
      let camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000)
      camera.position.set(0, 0, 100)
      camera.lookAt(0, 0, 0)
      // 创建一个渲染器
      let canvas = document.createElement('canvas')
      let context = canvas.getContext('webgl2')
      let renderer = new THREE.WebGLRenderer({ canvas, context })
      /**
       * updateStyle：第三个参数，如果设置为false的时候，分辨率将会以比较低的来渲染
      */
      renderer.setSize(container.clientWidth, container.clientHeight)
      container.appendChild(renderer.domElement)
      let animate = () => {
        requestAnimationFrame(animate)
        renderer.render(this.scene, camera)
      }
      animate()
      // this.$nextTick(() => {
      //   renderer.render(this.scene, camera)
      // })
      this.addSomething()
      /**
       * 以上已经将正方体添加上去了，但是看起来还是平面的，我们让正方体动起来
      */
    },
    addSomething () {
      /**
       * 立方体对象:长宽高
      */
      let geometry = new THREE.BoxGeometry(10, 10, 10)
      /**
       * 材质，three会默认带几种材质MeshMatcapMaterial就是其中一种
      */
      let meterial = new THREE.MeshMatcapMaterial({ color: 0x00ff00 })
      /**
       * 网格，一般网格往舞台上面添加的会比较多
      */
      let cube = new THREE.Mesh(geometry, meterial)
      cube.rotation.set(1, 1, 0)
      cube.position.set(-50, 50, -20)
      /**
       * 在舞台上面添加物体的时候使用add
       * 默认会添加到(0,0,0)的位置，但是相机也是默认放在这个地方，所以需要调整一下相机
       * 注意：默认的(0,0,0)是在中心点的，不是dom里面的左上角
       * requestAnimationFrame:这个是HTML5上面关于动画的新的api
      */
      this.scene.add(cube)

      /**
       * 画线
       * LineBasicMaterial
       * LineDashedMaterial
      */

      let meterialLine = new THREE.LineBasicMaterial({ color: 0xff0000 })
      let geometryLine = new THREE.Geometry()
      geometryLine.vertices.push(new THREE.Vector3(-10, 0, 0))
      geometryLine.vertices.push(new THREE.Vector3(0, 10, 0))
      geometryLine.vertices.push(new THREE.Vector3(10, 0, 0))
      let line = new THREE.Line(geometryLine, meterialLine)
      this.scene.add(line)
      let geometryLine1 = new THREE.Geometry()
      geometryLine1.vertices.push(new THREE.Vector3(0, 10, 0))
      geometryLine1.vertices.push(new THREE.Vector3(0, -50, 0))
      let line1 = new THREE.Line(geometryLine1, meterialLine)
      this.scene.add(line1)

      // let gem = new THREE.TextGeometry('51JOB', {
      //   size: 20, // 字号大小，一般为大写字母的高度
      //   height: 10, // 文字的厚度
      //   weight: 'normal', // 值为'normal'或'bold'，表示是否加粗
      //   font: '我的测试文字', // 字体，默认是'helvetiker'，需对应引用的字体文件
      //   style: 'normal', // 值为'normal'或'italics'，表示是否斜体
      //   bevelThickness: 1, // 倒角厚度
      //   bevelSize: 1, // 倒角宽度
      //   curveSegments: 30, // 弧线分段数，使得文字的曲线更加光滑
      //   bevelEnabled: true // 布尔值，是否使用倒角，意为在边缘处斜切
      // })
      // this.scene.add(gem)
    },
    load () {
      let loader = new THREE.GLTFLoader()
      loader.load()
    }

  },
  components: {

  }
}
</script>

<style lang="scss" scoped>
.index{
  width: 100%;
  height: 100%;
  position: relative;
  &-container{
    width: 80%;
    height: 80%;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);
  }
}
</style>
