// pages/activity/activityFrom.js
const app = getApp();
import {
  wxAjax,
  reg_card_num,
  reg_phone,
  debounce
} from '../../utils/util.js';
Page({
  data: {
    base_url: app.globalData.base_url,
    nvabarData: {
      showCapsule: 1, //是否显示左上角图标   1表示显示    0表示不显示
      ifBack: 1,
      ifBg: 1,
      ifHome: 1,
      title: '添加参观人'
    },
    array: ["身份证", "良民证", "结婚证"],
    index: 0,
    id:0, //参观人id  添加 0 编辑 !0
    toi_username: '',
    toi_card_num: '',
    contact_phone: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that = this
    if (options.id){
      that.data.id = options.id
      that.setData({
        'nvabarData.title':'编辑参观人'
      })
    }
    wx.getStorage({
      key: 'personData',
      success(res) {
        console.log(res,"4545")
        let personData = res.data
        that.setData({
          toi_username: personData.title,
          toi_card_num: personData.card,
          contact_phone: personData.phone
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

  bind_contact_phone(e) {
    this.setData({
      contact_phone: e.detail.value
    })
  },
  // 添加/修改联系人api 成人
  users_contactssave() {
    let that = this
    let data = {
      p: 'x',
      api_token: app.globalData.api_token,
      id: this.data.id||0,
      title: that.data.toi_username,
      child: 0,
      card: that.data.toi_card_num,
      phone: this.data.contact_phone
    }
    wxAjax('users/contactssave', data, 'post', function(res) {
      console.log(res, "添加联系人成功")
      wx.navigateBack()
    }, true)
  },
  sub() {
    let contact_phone = this.data.contact_phone;
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
        title: '请输入正确的身份证号!',
        icon: 'none',
        duration: 2000
      })
      return false
    }
    if (!reg_phone(contact_phone)) {
      wx.showToast({
        title: '请输入正确的手机号',
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