const app = getApp();
import {
  wxAjax
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
      title: '订单详情', //导航栏 中间的标题
      ifHome: 1
    },
    modalData: {
      title: "",
      is_show: false,
      btnText: "",
      content: '',
      btnFun: '',
      form_id: '',
      ifGoR: ""
    },
    countDown: '',
    titem_id: '', //订单id
    order_detail: {},
    // order_status_imgs: ['../../icon/wancheng_icon@2x.png', '../../icon/daizhifu_icon@2x.png','../../icon/yiguoqi_icon@2x.png']
    order_status_imgs: {
      1: '../../icon/wancheng_icon@2x.png',
      2: '../../icon/daizhifu_icon@2x.png',
      5: '../../icon/daizhifu_icon@2x.png',
      6: '../../icon/daizhifu_icon@2x.png',
      7: '../../icon/yiguoqi_icon@2x.png',
      8: '../../icon/yiguoqi_icon.png',
      10: '../../icon/yiguoqi_icon@2x.png'
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log(options, "我进入了onLoad")
    this.data.titem_id = options.titem_id
    this.getDate()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function(options) {

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

  getDate() {
    let parameter = {
        p: 't',
        Sign: 'RootSign',
        api_token: app.globalData.api_token,
        titem_id: this.data.titem_id
      },
      that = this;
    wxAjax('confirm_active_order', parameter, 'get', function(res) {
      let obj = res.data.data;
      let arr = obj.order_info.last_time.split(":")
      let countDown = arr[0]
      let second = arr[1]
      that.setData({
        order_detail: obj
      })
      if (obj.order_info.toi_status == 2) {
        let timer = setInterval(function() {
          if (second > 1) {
            second = --second
          } else if (countDown > 0) {
            second = 60
            countDown = --countDown
          } else {
            that.onLoad({
              titem_id: that.data.titem_id
            })
            clearInterval(timer)
          }
          that.setData({
            countDown: countDown,
            second: second
          })
        }, 1000)
      }
    }, true)
  },
  cancel(form_id) {
    let parameter = {
        p: 't',
        Sign: 'RootSign',
        formId: form_id,
        api_token: app.globalData.api_token,
        titem_id: this.data.order_detail.order_info.titem_id
      },
      that = this;
    wxAjax('active/cancel', parameter, 'get', function(res) {
      let status = res.data.status;
      if (status) {
        wx.showToast({
          title: '取消成功',
          duration: 3000
        })
        wx.reLaunch({
          url: 'personalCenter'
        })
      } else {
        wx.showToast({
          title: res.data.msg,
          icon: 'none',
          duration: 3000
        })
      }
    }, true)
  },
  sureCancel() {
    this.setData({
      'modalData.is_show': true,
      'modalData.title': '提示',
      'modalData.btnText': '确定',
      'modalData.content': '确认取消吗？',
      'modalData.form_id': true,
      'modalData.btnFun': this.cancel
    })
  },
  payment() {
    let titem_id = this.data.order_detail.order_info.titem_id
    let orderData = {
      p: 'w',
      Sign: 'RootSign',
      api_token: app.globalData.api_token,
      cate_id: 6,
      goods_id: titem_id,
      pay_type: 4
    }
    wxAjax('order/create_order', orderData, 'post', function(msg) {
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
              url: 'paymentSure?titem_id=' + titem_id
            })
          },
          fail(res) {
            wx.showToast({
              title: '支付失败',
              icon: 'none',
              duration: 3000
            })
          }
        })
      }
    }, true)
  }
})