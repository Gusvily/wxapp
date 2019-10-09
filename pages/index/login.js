// pages/index/login.js
const app = getApp()
import { wxAjax } from '../../utils/util.js';
Page({
  data: {
    flag: true,
    nvabarData: {
      showCapsule: 1,
      ifBack: true,
      ifBg: 1,
      ifHome: 1
    }
  },
  onLoad: function () {

  },
  login() {
    if (!this.data.flag) {
      return false
    }
    this.data.flag = false
    wx.login({
      success: res2 => {
        let code = res2.code;
        let that = this;
        let userInfoData = {
          p: 'x',
          code: code,
          Sign: 'RootSign'
        }
        wxAjax('users/appletlogin', userInfoData, 'post', function (res3) {
          that.data.flag = true
          if (res3.data.data.phone) {
            wx.setStorageSync('api_token', res3.data.data.api_token)
            app.globalData.api_token = res3.data.data.api_token
            wx.navigateBack()
          } else {
            console.log("不是新用户")
          }
        })
      }
    })
  }
})