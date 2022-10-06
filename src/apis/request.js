import axios from 'axios'
import { aes_decrypt, toast } from '@/utils/utils'
import { cleanToken, getUserInfo } from '@/utils/authUtils'
import { Dialog, Toast } from 'vant'
import vue from '@/main'
import USER from './user'
import { setToken } from '../utils/authUtils'

// create an axios instance
const request = axios.create({
  baseURL: process.env.VUE_APP_BASE_URL, // url = base url + request url
  timeout: 40000, // request timeout
})

request.interceptors.request.use(
  config => {
    console.log(process.env.VUE_APP_BASE_URL)
    let userInfo = getUserInfo()
    if (userInfo) {
      config.headers['token'] = getUserInfo().token
    }
    return config
  },
  error => {
    // do something with request error
    return Promise.reject(error)
  },
)

// response interceptor
request.interceptors.response.use(
  response => {
    //

    let res = response.data
    if (response.headers['encrypt-key']) {
      const encrypt_text = res.slice(0, -32)
      const iv = res.slice(-32, -16)
      const key = res.slice(-16)
      const responseString = aes_decrypt(encrypt_text, key, iv)
      if (!responseString) {
        toast('系统错误')
        return Promise.reject(new Error('系统错误'))
      }
      res = JSON.parse(responseString)
    }

    if (res.code !== 0) {
      if (res.code === 2000) {
        cleanToken()
        if (process.env.isMiniprogram) {
          wx.login({
            success: (res) => {
              console.log('get code')
              USER.loginMiniApp({
                'code': res.code,
              })
                .then(loginvo => {
                  console.log('get login vo ')
                  // this.loginSuccess(loginvo)
                  console.log('start replace push')
                  const token = loginvo.token
                  const nickname = loginvo.nickname
                  setToken(token, nickname)
                  wx.navigateTo({
                    url: 'index?id=1',
                    events: {
                      // 为指定事件添加一个监听器，获取被打开页面传送到当前页面的数据
                      acceptDataFromOpenedPage: function(data) {
                        console.log(data)
                      },
                      someEvent: function(data) {
                        console.log(data)
                      }
                    },
                    success: function(res) {
                      // 通过 eventChannel 向被打开页面传送数据
                      console.log('nav succes')
                      res.eventChannel.emit('acceptDataFromOpenerPage', { data: 'test' })
                    },
                    fail: function (res) {
                      console.log( res)
                    }
                  })
                  // vue.$router.push({ path: '/shop' , query: {
                  //     date:new Date().getTime()
                  //   }})
                })
            },
          })

        }else {
          vue.$router.push({ path: '/login' })
        }
      }
      toast(res.msg)
      return Promise.reject(new Error(res.msg))
    } else {
      return res.data
    }
  },
  error => {
    Toast(error)
    return Promise.reject(error)
  },
)

export default request
