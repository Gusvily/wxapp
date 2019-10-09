// pages/activity/activityDetail.js
const app = getApp();
import {
  wxAjax
} from '../../utils/util.js';
const WxParse = require('../../wxParse/wxParse.js');
Page({
  /**
   * 页面的初始数据
   */
  data: {
    base_url: app.globalData.base_url,
    active_status: ['', '#01AD62', '#E8593E', '#A0A0A0', '#DFB406', '#A0A0A0'],
    nvabarData: {
      showCapsule: 1, //是否显示左上角图标   1表示显示    0表示不显示
      ifBack: 1,
      ifBg: 0,
      ifHome: 1
    },
    modalData: {
      title: "报名须知",
      is_show: false,
      content: '',
      btnText: "确认并继续",
      ifGoR: 0
    },
    active_id: 0, //活动id
    td_id: "", //场次id
    active_detail: {},
    spot: 0 //1现场报名 0非现场报名
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log(options)
    var that = this;
    var active_id = '';
    var spot = 0;
    var scene;
    if (options.id) {
      active_id = options.id;
    } else if (options.scene) {
      scene = decodeURIComponent(options.scene).split("&")
      active_id = scene[0]
      spot = scene[1]
    }
    this.data.active_id = active_id
    this.data.td_id = spot
    wx.showLoading({
      title: '加载中...',
    })
    that.getDetail(active_id)
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

  /**s
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

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  getDetail(id) {
    let that = this;
    let active_obj = {
      active_id: id,
      api_token: app.globalData.api_token
    }
    if (that.data.td_id) {
      active_obj.td_id = that.data.td_id
    }
    wxAjax('active_detail', active_obj, 'get', function(res) {
      let obj = res.data.data;
      wx.hideLoading();
      let cate_id = obj.cate_id == 2 ? 2 : 1;
      that.setData({
        active_detail: obj,
        'modalData.content': obj.notice,
        'modalData.ifGoR': 'activityFrom?cate_id=' + cate_id
      })
      WxParse.wxParse('activilySyn', 'html', res.data.data.content, that);
      WxParse.wxParse('entrance', 'html', res.data.data.entrance, that);
    }, true)
  },
  showMd(e) {
    let stauts = e.currentTarget.dataset.status
    let id = e.currentTarget.dataset.id
    let that = this
    if (stauts != 1 && stauts !=2) {
      return false
    }
    let parameter = {
      p: 't',
      Sign: 'RootSign',
      td_id: id,
      api_token: app.globalData.api_token
    }
    wxAjax('order_limit', parameter, 'get', function(res) {
      let obj = res.data;
      let spot = that.data.td_id ? 1 : 0
      let hb = stauts == 2 ? 1 : 0
      if (res.data.status) {
        that.setData({
          'modalData.is_show': true,
          'modalData.ifGoR': that.data.modalData.ifGoR + '&active_time_id=' + id + '&spot=' + spot + '&hb=' + hb
        })
      } else {
        that.setData({
          'modalData.title': "提示",
          'modalData.is_show': true,
          'modalData.content': res.data.msg,
          'modalData.btnText': '我知道了',
          'modalData.ifGoR': ''
        })
      }
    })
  }
})