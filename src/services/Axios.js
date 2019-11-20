import qs from 'qs'
import axios from 'axios'
// axios.defaults.baseURL = window.CONTEXT

let reg = /^[\u0391-\uFFE5%]+$/
axios.interceptors.request.use((request) => {
  // 实际上是没用到下面的这个if
  if (request.data && request.headers['Content-Type'] === 'application/x-www-form-urlencoded') {
    request.data = qs.stringify(request.data, { allowDots: true })
  }
  if (request.data && (request.baseURL === '/multiengine' || request.baseURL === window.CONTEXT)) {
    request.data = qs.stringify(request.data, { allowDots: true })
  }
  // 平台统一处理GET请求参数有中文的情况，可以和后端对接一下，如果不是平台项目，可以删除
  if (request.method === 'get' && request.params) {
    let params = request.params
    for (let key in params) {
      let value = params[key]
      if (typeof value === 'string') {
        let newS = ''
        for (let i = 0; i < value.length; i++) {
          if (reg.test(value.charAt(i))) {
            newS += encodeURI(value.charAt(i))
          } else {
            newS += value.charAt(i)
          }
        }
        params[key] = newS
      }
      params['nocha'] = new Date().getTime()
    }
  }
  return request
})

export default function Axios ({ method = 'get', url, params, data, baseURL = window.CONTEXT }) {
  return new Promise((resolve, reject) => {
    axios({
      method,
      url,
      params, // 不能再这里直接设置headers，会覆盖Authorization
      data,
      baseURL
    }).then(({ data }) => {
      data.success ? resolve(data) : reject(data)
    }, (err) => {
      reject(err)
    }).catch((err) => {
      reject(err)
    })
  })
}
