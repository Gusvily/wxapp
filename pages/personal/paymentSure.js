// pages/personal/paymentSure.js
const app = getApp();
import { wxAjax } from '../../utils/util.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    nvabarData: {
      showCapsule: 1, //是否显示左上角图标   1表示显示    0表示不显示
      ifBack: 1,
      ifBg: 1,
      title: '支付确认', //导航栏 中间的标题
      ifHome: 1
    },
    titem_id:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let titem_id = options.titem_id
    this.setData({
      titem_id: titem_id
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  fun1(){
    wx.reLaunch({
      url: 'personalCenter',
    })
  },
  fun2(){
    wx.reLaunch({
      url: 'personalCenter',
    })
  }
})