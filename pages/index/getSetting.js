// pages/index/getSetting.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    nvabarData: {
      showCapsule: 1,
      ifBack: true,
      ifBg: 1,
      ifHome: 1
    }
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

  bindGetUserInfo(e) {
    wx.getUserInfo({
      success: function(res) {
        wx.redirectTo({
          url: '../index/register',
        })
      },
      fail: function(err) {
        wx.reLaunch({
          url: '/pages/activity/activity',
        })
      }
    })
  },
  goback() {
    wx.reLaunch({
      url: '/pages/activity/activity',
    })
  }
})