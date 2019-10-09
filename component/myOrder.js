// component/myOrder.js
const app = getApp();
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    is_show: true,
    x: app.globalData.screenWidth-99,
    y: app.globalData.capsuleData.bottom+10
  },

  /**
   * 组件的方法列表
   */
  methods: {
    goMyOrder() {
      wx.navigateTo({
        url: '../personal/personalCenter'
      })
    },
    move(e){
      console.log(e.detail)
    }
  }
})