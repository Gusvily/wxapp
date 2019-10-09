// pages/activity/addPhone.js
const app = getApp();
import { wxAjax, reg_phone } from '../../utils/util.js';
Page({
  /**
   * 页面的初始数据
   */
  data: {
    nvabarData: {
      showCapsule: 1, //是否显示左上角图标   1表示显示    0表示不显示
      ifBack: 1,
      ifBg:1,
      title: '添加其他手机号', //导航栏 中间的标题
      ifHome:1
    },
    is_send:false,
    time1:0,
    code: '',
    phone: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  bindPhone(e) {
    this.setData({
      phone: e.detail.value
    })
  },
  bindSmscode(e) {
    this.setData({
      code: e.detail.value
    })
  },
  getCode() {
    // 获取验证码
    let that = this;
    let time = new Date().getTime()
    let time1 = this.data.time1
    that.setData({
      is_send: false,
      time1: time
    })
    if (time - time1 < 60000) {
      wx.showToast({
        title: '验证码已发送,60s后可重新发送',
        icon: 'none',
        duration: 2000
      })
      return false
    } else {
      that.setData({
        is_send: true
      })
    }
    if (!reg_phone(that.data.phone)) {
      wx.showToast({
        title: '请输入正确的手机号',
        icon: 'none',
        duration: 2000
      })
      return false
    }
    let obj = {
      p: 't',
      username: that.data.phone,
      Sign: 'RootSign'
    }
    wxAjax('send_sms', obj, 'post', function(res) {
      if (res.data.data) {
        wx.showToast({
          title: '验证码已发送',
          icon: 'success',
          duration: 2000
        })
      }
    })
  },
  addPhone() {
    let codeReg = /^\d{6}$/
    let that = this;
    if (!reg_phone(that.data.phone)) {
      wx.showToast({
        title: '请输入正确的手机号',
        icon: 'none',
        duration: 2000
      })
      return false
    }
    if (!codeReg.test(that.data.code)) {
      wx.showToast({
        title: '请输入6位数字验证码',
        icon: 'none',
        duration: 2000
      })
      return false
    }
    let obj = {
      p: 'x',
      Sign: 'RootSign',
      username: that.data.phone,
      smscode: that.data.code
    }
    wxAjax('users/verifycode', obj, 'post', function(res) {
      if (res.data.status) {
        wx.setStorageSync('phone', that.data.phone)
        app.globalData.userInfo.phone = that.data.phone
        wx.showToast({
          title: '手机号添加成功',
          icon: 'success',
          duration: 2000
        })
        wx.navigateBack()
      } else {
        wx.showToast({
          title: res.data.msg,
          icon: 'none',
          duration: 2000
        })
      }
    })
  }
})