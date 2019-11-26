
const keys = [
  [0, 'type'],
  [1, 'originX'],
  [2, 'originY'],
  [3, 'left'],
  [4, 'top'],
  [5, 'width'],
  [6, 'height'],
  [7, 'fill'],
  [8, 'stroke'],
  [9, 'strokeWidth'],
  [10, 'strokeDashArray'],
  [11, 'strokeLineCap'],
  [12, 'strokeLineJoin'],
  [13, 'strokeMiterLimit'],
  [14, 'scaleX'],
  [15, 'scaleY'],
  [16, 'angle'],
  [17, 'flipX'],
  [18, 'flipY'],
  [19, 'opacity'],
  [20, 'shadow'],
  [21, 'visible'],
  [22, 'clipTo'],
  [23, 'backgroundColor'],
  [24, 'fillRule'],
  [25, 'paintFirst'],
  [26, 'globalCompositeOperation'],
  [27, 'transformMatrix'],
  [28, 'skewX'],
  [29, 'skewY'],
  [30, 'content'],
  [31, {
    path: ['path'], // 当为矩形，箭头，铅笔的时候type
    ellipse: ['rx', 'ry'], // 椭圆
    line: ['x1', 'x2', 'y1', 'y2'], // 直线
    textbox: ['text', 'fontSize', 'fontWeight', 'fontFamily', 'fontStyle', 'lineHeight', 'underline', 'overline', 'linethrough', 'textAlign', 'textBackgroundColor', 'charSpacing', 'minWidth', 'styles'] // 文字
  }]
]
const transNum = [16, 6, 3, 19, 14, 15, 28, 29, 13, 9, 4, 5]
const map = new Map(keys)
const values = [
  [false, '_0'],
  [true, '_1'],
  ['top', '_t'],
  ['bottom', '_b'],
  ['left', '_l'],
  ['right', '_r'],
  ['center', '_c'],
  [null, '_n'],
  ['path', '_p'],
  ['ellipse', '_e'],
  ['line', '_li'],
  ['textbox', '_te'],
  ['source-over', '_O'],
  ['fill', '_F'],
  ['nonzero', '_E'],
  ['miter', '_M'],
  ['butt', '_B'],
  ['round', '_R'],
  ['STXingkai', '_S'],
  ['normal', '_N']

]
const valueMap = new Map(values) // 前面的map可以用数组代替的，但是这个地方的valueMap一定要是Map类型的数据结构
const segSymbol = '@'
const segSymbolFirst = '&_$'
// 压缩函数
export function compress (data) {
  // 常规的31种key值，这是每一个类型都会有的基础数据类型
  let result = data.version
  let arr = []
  // 提取主题数据并将根据映射关系简写
  data.objects.forEach((item, index) => {
    arr[index] = []
    for (let [key, value] of map) {
      if (key <= 30) { // 常规数据的改变
        arr[index][key] = valueMap.get(item[value]) || item[value]
      } else {
        arr[index][key] = []
        value[item.type].forEach(vauleKey => {
          arr[index][key].push(valueMap.get(item[vauleKey]) || item[vauleKey])
        })
      }
    }
  })

  // 不要让常规数据是数组的形式，可以把[]两个字符的控件，转化为@一个字符，省下空间
  arr.forEach((item, index) => {
    let pop = item.pop()
    if (item[0] === '_p') { // 找出所有为path类型的数据，还可以再优化一次
      pop.forEach((item, index) => {
        pop[index] = item.join(segSymbol)
      })
    }
    arr[index] = [item.join(segSymbol)]
    arr[index].push(pop)
  })
  return `${data.version}${segSymbolFirst}${JSON.stringify(arr)}`
}

// 解压函数
const deValues = values.map(item => [item[1], item[0]])
const deValueMap = new Map(deValues)
export function decompression (data) {
  let arr = data.split(segSymbolFirst)
  const version = arr[0]
  const objectsOrigin = JSON.parse(arr[1])
  const objects = []
  objectsOrigin.forEach((item, index) => {
    let objItem = {}
    objItem.version = version
    let base = item[0].split(segSymbol) // 基础数据
    base.forEach((obj, index) => {
      let value = deValueMap.get(obj) === undefined ? obj : deValueMap.get(obj)
      objItem[map.get(index)] = !~transNum.indexOf(index) ? value : +value
    })
    let special = item[1] // 每个类型特有的数据
    if (objItem.type === 'path') {
      let path = special[0].split(segSymbol).map(item => {
        return item.split(',').map(num => isNaN(+num) ? num : +num)
      })
      objItem.path = path
    } else if (objItem.type === 'ellipse') {
      objItem.rx = +special[0]
      objItem.ry = +special[1]
    } else if (objItem.type === 'line') {
      objItem.x1 = +special[0]
      objItem.x2 = +special[1]
      objItem.y1 = +special[2]
      objItem.y2 = +special[3]
    } else if (objItem.type === 'textbox') {
      let keys = map.get(31).textbox
      keys.forEach((item, index) => {
        objItem[item] = deValueMap.get(special[index]) === undefined ? special[index] : deValueMap.get(special[index])
      })
    }
    objects.push(objItem)
  })

  return {version, objects}
}
