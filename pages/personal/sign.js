// pages/personal/sign.js
const app = getApp();
import {
  wxAjax
} from '../../utils/util.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    nvabarData: {
      showCapsule: 1, //是否显示左上角图标   1表示显示    0表示不显示
      ifBack: 1,
      ifBg: 1,
      title: '活动签到', //导航栏 中间的标题
      router: '/pages/activity/activity',
      ifHome: 1
    },
    msg: '',
    is_sign: false,
    sign_info: {},
    toi_status: true,
    active_id: '',
    td_id: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(query) {
    var scene;
    // scene 需要使用 decodeURIComponent 才能获取到生成二维码时传入的 scene
    if (query) {
      scene = decodeURIComponent(query.scene).split("&")
    } else {
      wx.showToast({
        title: '请扫描正确的小程序码'
      })
      return false;
    }
    // this.setData({
    //   active_id: scene[0],
    //   td_id: scene[1]
    // })
    this.data.active_id = scene[0];
    this.data.td_id = scene[1];
    let that = this;
    that.getSignInfo()
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

  formSubmit: function(e) {
    let formId = e.detail.formId
    if (formId) {
      this.sign(formId)
    }
  },
  sign(formId) {
    let that = this
    let signData = {
      p: 't',
      Sign: 'RootSign',
      api_token: app.globalData.api_token,
      id: that.data.active_id,
      td_id: that.data.td_id,
      formId: formId
    }
    wxAjax('active/sign', signData, 'get', function(msg) {
      if (msg.data.status) {
        wx.showToast({
          title: '签到成功',
          icon: 'none'
        })
        that.setData({
          toi_status: 3
        })
      } else {
        wx.showToast({
          title: '签到失败',
          icon: 'none'
        })
      }
    }, true)
  },
  getSignInfo() {
    let that = this
    let signData = {
      p: 't',
      Sign: 'RootSign',
      api_token: app.globalData.api_token,
      id: that.data.active_id,
      td_id: that.data.td_id
    }
    wxAjax('active/sign_info', signData, 'get', function(res) {
      let obj = res.data.data;
      if (res.data.status) {
        that.setData({
          sign_info: obj,
          toi_status: obj.toi_status == 1 ? true : false
        })
      } else {
        that.setData({
          'sign_info.wxts': res.data.msg
        })
        wx.showToast({
          title: res.data.msg
        })
      }
      wx.hideLoading()
    }, true)
  }
})