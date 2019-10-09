//index.js
//获取应用实例
const app = getApp();
import {
  wxAjax
} from '../../utils/util.js';
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
  goback() {
    wx.reLaunch({
      url: '/pages/activity/activity',
    })
  },
  getPhoneNumber: function (e) {
    var that = this;
    var iv = ''
    var encryptedData = ''
    if (e.detail.errMsg !== 'getPhoneNumber:ok') {
      wx.showModal({
        title: '提示',
        content: '未授权您将无法登录',
        success: function (res) {
          if (res.confirm) {
            wx.reLaunch({
              url: '/pages/activity/activity',
            })
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
      return false
    } else {
      iv = e.detail.iv
      encryptedData = e.detail.encryptedData
    }
    if (!this.data.flag) {
      return false
    }
    this.data.flag = false

    var phoneObj = {
      p: 't',
      Sign: 'RootSign',
      encryptedData: encryptedData,
      iv: iv,
      sessionKey: wx.getStorageSync('sessionKey')
    }
    wxAjax('users/decryption', phoneObj, 'post', function (rlt) {
      app.globalData.userInfo.phone = rlt.data.data.phoneNumber;
      wx.setStorageSync('phone', rlt.data.data.phoneNumber)
      wx.getUserInfo({
        withCredentials: true,
        success(res4) {
          const userInfo = res4.userInfo
          const nickName = userInfo.nickName
          const avatarUrl = userInfo.avatarUrl
          const encryptedDataUser = res4.encryptedData
          const ivUser = res4.iv
          let obj2 = {
            p: 't',
            Sign: 'RootSign',
            encryptedData: encryptedDataUser,
            iv: ivUser,
            sessionKey: wx.getStorageSync('sessionKey'),
          }
          wxAjax('users/decryption', obj2, 'post', function (res5) {
            let userData = res5.data.data;
            let obj = {
              p: 'x',
              phone: app.globalData.userInfo.phone,
              Sign: 'RootSign',
              openid: userData.openId,
              unionid: userData.unionId,
              b_from: 'wx',
              b_nickname: userData.nickName,
              b_avatar: userData.avatarUrl,
              smscode: '123456',
              deviceno: Date.now() + ''
            }
            wxAjax('users/bind_phone', obj, 'post', function (res6) {
              that.data.flag = true
              if (res6.data.status) {
                wx.showToast({
                  title: '手机号绑定成功',
                  icon: 'success',
                  duration: 2000
                })
                wx.setStorageSync('api_token', res6.data.data.api_token)
                app.globalData.api_token = res6.data.data.api_token;
                wx.navigateBack()
              } else {
                wx.showToast({
                  title: res6.data.msg,
                  icon: 'none',
                  duration: 2000
                })
              }
            })
          })
        },
        fail(res) {
          wx.reLaunch({
            url: '/pages/activity/activity',
          })
        }
      })
    })
  }
})