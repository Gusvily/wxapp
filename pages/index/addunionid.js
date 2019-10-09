//index.js
//获取应用实例
const app = getApp();
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
  addunionid() {
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
          var sessionKey = res3.data.data.sessionKey;
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
                sessionKey: sessionKey,
              }
              wxAjax('users/decryption', obj2, 'post', function (res5) {
                let userData = res5.data.data;
                let obj = {
                  p: 't',
                  Sign: 'RootSign',
                  openid: userData.openId,
                  unionid: userData.unionId,
                }
                wxAjax('users/addunionid', obj, 'get', function (res6) {
                  that.data.flag = true
                  if (res6.data.status) {
                    wx.showToast({
                      title: '添加unionid成功',
                      icon: 'success',
                      duration: 2000
                    })
                    wx.reLaunch({
                      url: '/pages/home/index'
                    })
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
              wx.showModal({
                title: '提示',
                content: '未授权您将不能登录',
                success(res) {
                  if (res.confirm) {
                    console.log('用户点击确定')
                    wx.reLaunch({
                      url: '/pages/activity/activity',
                    })
                  } else if (res.cancel) {
                    console.log('用户点击取消')
                  }
                }
              })
            }
          })
        })
      }
    })
  }
})