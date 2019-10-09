const app = getApp()
Component({
  properties: {
    navbarData: { //navbarData   由父页面传递的数据，变量名字自命名
      type: Object,
      value: {

      }
    }
  },
  data: {
    capsuleData: app.globalData.capsuleData,
    navbarData: {
      showCapsule: true, //是否显示左上角图标   1表示显示    0表示不显示
    }
  },
  attached: function() {
    // 获取是否是通过分享进入的小程序
    // let routerInn = getCurrentPages()
    // this.setData({
    //   share: app.globalData.share
    // })
  },
  methods: {
    // 返回上一页面
    _navback(e) {
      let routerInn = getCurrentPages()
      let router = e.currentTarget.dataset.router
      if (router) {
        wx.reLaunch({
          url: router
        })
      } else if (routerInn.length == 1) {
        wx.reLaunch({
          url: '/pages/activity/activity'
        })
      } else {
        wx.navigateBack()
      }
    },
    //返回到首页
    _backhome() {
      wx.reLaunch({
        url: '/pages/activity/activity'
      })
    }
  }
})