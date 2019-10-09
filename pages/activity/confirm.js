// pages/activity/confirm.js
const app = getApp();
import {
  wxAjax,
  debounce
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
      title: '信息填写', //导航栏 中间的标题
      ifHome: 1
    },
    modalData: {
      title: "提示",
      is_show: false,
      content: '',
      btnText: "我知道了",
      ifGoR: ''
    },
    active_detail: {},
    id: '',
    userIfo: {},
    hb: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this
    wx.getStorage({
      key: 'key',
      success(res) {
        console.log(res.data)
        that.setData({
          userIfo: res.data
        })
      }
    })
    that.data.id = options.id;
    that.data.hb = +options.hb;
    wx.getStorage({
      key: 'key',
      success(res) {
        console.log(res.data)
        that.setData({
          userIfo: res.data
        })
      }
    })
    wx.getStorage({
      key: 'active_detail',
      success(res) {
        console.log(res.data)
        that.setData({
          active_detail: res.data
        })
      }
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
  formSubmit: function (e) {
    let formId = e.detail.formId
    if (formId) {
     
      this.sure(formId)
    }
  },
  sure(formId) {
    let a=1
    console.log(a++)
    let parameter = {}
    if (this.data.active_detail.cate_id == 1) {
      parameter = {
        p: 'w',
        Sign: 'RootSign',
        formId: formId,
        // formId: '',
        toi_cardtype_id: 1,
        active_time_id: this.data.id,
        api_token: app.globalData.api_token,
        toi_username: this.data.userIfo.toi_username,
        toi_card_num: this.data.userIfo.toi_card_num,
        invite_code: this.data.userIfo.invite_code,
        contact_phone: this.data.userIfo.contact_phone,
        alternate: this.data.userIfo.alternate,
        spot: this.data.userIfo.spot
      }
    } else {
      parameter = {
        p: 'w',
        Sign: 'RootSign',
        formId: formId,
        toi_cardtype_id: 1,
        active_time_id: this.data.id,
        api_token: app.globalData.api_token,
        toi_username: this.data.userIfo.toi_username,
        toi_card_num: this.data.userIfo.toi_card_num,
        invite_code: this.data.userIfo.invite_code,
        contact_phone: this.data.userIfo.contact_phone,
        children_card_num: this.data.userIfo.children_card_num,
        children_username: this.data.userIfo.children_username,
        children_cardtype_id: 1,
        alternate: this.data.userIfo.alternate,
        spot: this.data.userIfo.spot
      }
    }

    let that = this;
    wxAjax('active_order', parameter, 'post', function (res) {
      let obj = res.data.data;
      if (res.data.status) {
        if (that.data.active_detail.price !== "0.00") {
          let orderData = {
            p: 'w',
            Sign: 'RootSign',
            api_token: app.globalData.api_token,
            cate_id: 6,
            goods_id: obj.titem_id,
            pay_type: 4
          }
          wxAjax('order/create_order', orderData, 'post', function (msg) {
            let orderObj = msg.data.data;
            if (msg.data.status) {
              let wx_pay_data = orderObj.wx_pay_data
              wx.requestPayment({
                timeStamp: wx_pay_data.timeStamp,
                nonceStr: wx_pay_data.nonceStr,
                package: wx_pay_data.package,
                signType: wx_pay_data.signType,
                paySign: wx_pay_data.paySign,
                success(res) {
                  wx.redirectTo({
                    url: 'yyjg?titem_id=' + obj.titem_id + '&cate_id=' + that.data.active_detail.cate_id + '&hb=' + that.data.hb + '&alternate=' + that.data.userIfo.alternate
                  })
                },
                fail(res) {
                  wx.showToast({
                    title: '支付失败，请到“我的订单”完成支付',
                    icon: 'none'
                  })
                }
              })
            }
          }, true)
        } else {
          wx.redirectTo({
            url: 'yyjg?titem_id=' + obj.titem_id + '&hb=' + that.data.hb + '&alternate=' + that.data.userIfo.alternate
          })
        }
      } else {
        that.setData({
          'modalData.title': "提示",
          'modalData.is_show': true,
          'modalData.content': res.data.msg,
          'modalData.btnText': '我知道了',
          'modalData.ifGoR': ''
        })
      }
    }, true)
  }
})