import Axios from './Axios'

export default {
  getWho () {
    return Axios({
      name: 'who接口数据',
      url: '/mobile/who'
    })
  }
}
