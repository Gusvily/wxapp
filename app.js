//app.js
const mtjwxsdk = require('./utils/mtj-wx-sdk.js');
App({
  onLaunch: function(options) {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    wx.setStorageSync('logs', logs)
    if (options.scene == 1035 && options.query.mid) {
      this.globalData.mid = options.query.mid
      this.globalData.gzhcd = true
    }
    wx.getSystemInfo({
      success: (res) => {
        this.globalData.screenWidth = res.screenWidth;
        this.globalData.screenHeight = res.screenHeight;
      },
    })
    this.globalData.capsuleData = wx.getMenuButtonBoundingClientRect();
    console.log(this.globalData.capsuleData)
  },
  onShow: function(options) {},
  globalData: {
    userInfo: {},
    isLocation: true,
    mid: 0,
    type: 0,
    status: 0,
    individuation: false,
    gzhcd: false,
    scene: false,
    city: '北京市',
    api_token: '',
    base_url: 'https://applite.muspace.net',
    // base_url: 'http://47.105.71.75',
    share: false, // 分享默认为false
    screenWidth: 0,
    screenHeight: 0,
    capsuleData: {}
  }
})