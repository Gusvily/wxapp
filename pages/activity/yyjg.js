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
      title: '预约结果', //导航栏 中间的标题
      height: app.globalData.height * 2 + 20,
      router: 'activity',
      ifHome: 1
    },
    order_detail: {},
    hb: 0,
    alternate: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let parameter = {
        p: 't',
        Sign: 'RootSign',
        api_token: app.globalData.api_token,
        titem_id: options.titem_id
      },
      that = this;
    this.data.titem_id = options.titem_id
    this.data.cate_id = options.cate_id
    wxAjax('confirm_active_order', parameter, 'get', function(res) {
      let obj = res.data.data;
      that.setData({
        order_detail: obj,
        hb: +options.hb,
        alternate: options.alternate
      })
    })
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

  goHome() {
    wx.reLaunch({
      url: '/pages/personal/orderDetail?titem_id=' + this.data.titem_id
    })
  },
  goIndex() {
    wx.reLaunch({
      url: '/pages/activity/activity'
    })
  }
})