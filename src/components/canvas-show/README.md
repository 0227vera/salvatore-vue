# 手端标注中展示的说明

手端批注主要使用了fabric.js，查找了一些资料，如果你的英文能力还可以，建议直接读[英文文档](http://fabricjs.com/docs/)

## npm和git地址

[npm](https://www.npmjs.com/package/fabric)
[git](https://github.com/fabricjs/fabric.js)

## 本项目为什么没有使用npm去下载？

主要原因是：再web端的时候使用的就是cdn的方式，所以为了保持数据的一致，就直接也使用了cdn，后期如果你需要使用npm的方式，确保不会影响数据和效果的前提，可以换成npm

## 除了npm、git和官方文档之外，你需要去了解一些什么，我能为你提供哪些资料？

1. 最直接，我觉得你可以试着去看一下源码，不多，方法也比较好和多

2. 你需要了解一些基本的数学知识，eg:基本的碰撞检测，坐标系的基本关系

3. 我在网上资料和自己觉得好用的选择给你份文档，希望对你有帮助，如果其中有什么不对的，理解不到位的，你发现，偷偷修改就好，方便后人

### 常用属性

canvas.isDrawingMode = true; 可以自由绘制 （铅笔功能主要依靠这个属性去实现的）

canvas.selectable = false; 控件不能被选择，不会被操作

canvas.selection = true; 画板显示选中

canvas.skipTargetFind = true; 整个画板元素不能被选中（是否可以去编辑，也就是否可以去拖动元素）

canvas.freeDrawingBrush.color = "#E34F51" 设置自由绘画笔的颜色

freeDrawingBrush.width 自由绘笔触宽度

canvas.setZoom(2); 设置画板缩放比例（这个属性当时有去做，但最后以失败告终）

### 方法

add(object) 添加

insertAt(object,index) 添加（可以在第几笔的时候添加一个元素）

remove(object) 移除 （撤销功能主要依赖这个属性）

forEachObject 循环遍历

getObjects() 获取所有对象 （撤销功能主要依赖这个属性）

item(int) 获取子项

isEmpty() 判断是否空画板

size() 画板元素个数

contains(object) 查询是否包含某个元素

fabric.util.cos

fabric.util.sin

fabric.util.drawDashedLine 绘制虚线

getWidth() setWidth()

getHeight()?

clear() 清空

renderAll() 重绘

requestRenderAll() 请求重新渲染

rendercanvas() 重绘画板?

getCenter().top/left 获取中心坐标

toDatalessJSON() 画板信息序列化成最小的json

toJSON() 画板信息序列化成json

moveTo(object,index) 移动?

dispose() 释放?

setCursor() 设置手势图标

getSelectionContext()获取选中的context

getSelectionElement()获取选中的元素

getActiveObject() 获取选中的对象

getActiveObjects() 获取选中的多个对象

discardActiveObject()取消当前选中对象

isType() 图片的类型?

setColor(color) = canvas.set("full","");

rotate() 设置旋转角度

setCoords() 设置坐标

## 事件

object:added

object:removed

object:modified

object:rotating

object:scaling

object:moving

object:selected 这个方法v2已经废弃，使用selection:created替代，多选不会触发

before:selection:cleared

selection:cleared

selection:updated

selection:created

path:created

mouse:down

mouse:move

mouse:up

mouse:over

mouse:out

mouse:dblclick

## Textbox上面的方法

selectAll() 选择全部

getSelectedText() 获取选中的文本

exitEditing() 退出编辑模式?

## 自带可绘制对象

fabric.Circle 圆

fabric.Ellipse 椭圆

fabric.Line 直线

fabric.Polygon

fabric.Polyline

fabric.Rect 矩形

fabric.Triangle 三角形