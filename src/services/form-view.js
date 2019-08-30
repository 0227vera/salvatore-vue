import Axios from './Axios.js'

export default {
  getFrom (params) {
    return Axios({
      url: '/mobile/detail.do',
      name: '获取表单数据',
      params
    })
  }
}
