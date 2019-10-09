// pages/activity/activityFrom.js
const app = getApp();
import {
  wxAjax,
  reg_card_num,
  debounce
} from '../../utils/util.js';
Page({
  /**
   * 页面的初始数据
   */
  data: {
    base_url: app.globalData.base_url,
    nvabarData: {
      showCapsule: 1, //是否显示左上角图标   1表示显示    0表示不显示
      ifBack: 1,
      ifBg: 1,
      ifHome: 1,
      title: '添加儿童参观人'
    },
    array: ["身份证", "护照", "学生证"],
    index: 0,
    toi_username: '',
    toi_card_num: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that = this
    if (options.id) {
      that.data.id = options.id
      that.setData({
        'nvabarData.title': '编辑儿童参观人'
      })
    }
    wx.getStorage({
      key: 'childData',
      success(res) {
        console.log(res, "儿童参观人")
        let childData = res.data
        that.setData({
          toi_username: childData.title,
          toi_card_num: childData.card
        })
      }
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

  bindPickerChange: function(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      index: e.detail.value
    })
  },
  bind_toi_username(e) {
    this.setData({
      toi_username: e.detail.value
    })
  },
  bind_toi_card_num(e) {
    this.setData({
      toi_card_num: e.detail.value
    })
  },
  // 添加/修改儿童联系人api 
  users_contactssave() {
    let that = this
    let data = {
      p: 'x',
      api_token: app.globalData.api_token,
      id: that.data.id || 0,
      title: that.data.toi_username,
      child: 1,
      card: that.data.toi_card_num
    }
    wxAjax('users/contactssave', data, 'post', function(res) {
      console.log(res, "添加联系人成功")
      wx.navigateBack()
    }, true)
  },
  sub() {;
    let toi_card_num = this.data.toi_card_num;
    if (!this.data.toi_username) {
      wx.showToast({
        title: '请输入姓名',
        icon: 'none',
        duration: 2000
      })
      return false
    }
    let card_num_flag = reg_card_num(toi_card_num);
    if (!card_num_flag) {
      wx.showToast({
        title: '请输入正确的儿童身份证号!',
        icon: 'none',
        duration: 2000
      })
      return false
    }
    let that = this
    debounce(function () {
      console.log("事件被触发了")
      that.users_contactssave()
    })()
  }
})