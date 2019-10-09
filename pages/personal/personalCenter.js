// pages/personal/personalCenter.js
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
    is_ref: true,
    nvabarData: {
      showCapsule: 1, //是否显示左上角图标   1表示显示    0表示不显示
      ifBack: 1,
      ifBg: 1,
      title: '个人中心', //导航栏 中间的标题
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
    active_status: {
      1: '#01AD62',
      2: '#DFB406',
      3: '#01AD62',
      4: '#A0A0A0',
      5: '#A0A0A0',
      6: '#A0A0A0',
      7: '#A0A0A0',
      8: '#008FF7',
      10: '#A0A0A0'
    },
    order_list: [],
    titem_id: '',
    page: 1,
    limit: 10
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
    this.getList()
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
    let that = this;
    wx.stopPullDownRefresh()
    wx.showLoading({
      title: '加载中',
    })
    if (that.data.is_ref) {
      this.setData({
        page: 1,
        limit: 10,
        is_ref: false
      })
      this.getList()
    }
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    this.setData({
      page: ++this.data.page
    })
    this.getList()
  },

  getList() {
    let parameter = {
        p: 't',
        Sign: 'RootSign',
        api_token: app.globalData.api_token,
        // api_token: wx.getStorageSync('api_token'),
        page: 1,
        limit: this.data.page * this.data.limit
      },
      that = this;
    wxAjax('active/order_log', parameter, 'get', function(res) {
      let obj = res.data.data;
      that.setData({
        order_list: obj,
        is_ref: true
      })
      wx.hideLoading()
    }, true)
  },
  goOrderDetail(e) {
    let titem_id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: 'orderDetail?titem_id=' + titem_id
    })
  },
  cancel(form_id) {
    let parameter = {
        p: 't',
        Sign: 'RootSign',
        api_token: app.globalData.api_token,
        titem_id: this.data.titem_id,
        formId: form_id
      },
      that = this;
    wxAjax('active/cancel', parameter, 'get', function(res) {
      let status = res.data.status;
      if (status) {
        wx.showToast({
          title: '取消成功',
          duration: 3000
        })
        that.setData({
          page: 1,
          limit: 10
        }, function() {
          that.getList()
        })
      } else {
        wx.showToast({
          title: res.data.msg,
          icon: 'none'
        })
      }
    }, true)
  },
  fun(e) {
    let titem_id = e.currentTarget.dataset.titem_id
    this.setData({
      titem_id: titem_id
    })
    this.setData({
      'modalData.is_show': true,
      'modalData.title': '提示',
      'modalData.btnText': '确定',
      'modalData.content': '确认取消吗？',
      'modalData.form_id': true,
      'modalData.btnFun': this.cancel
    })
  },
  fun2(e) {
    let titem_id = e.currentTarget.dataset.titem_id
    this.setData({
      titem_id: titem_id
    })
    this.setData({
      'modalData.is_show': true,
      'modalData.title': '提示',
      'modalData.btnText': '确定',
      'modalData.content': '确认支付订单吗？',
      'modalData.btnFun': this.payment
    })
  },
  payment() {
    let orderData = {
      p: 't',
      Sign: 'RootSign',
      api_token: app.globalData.api_token,
      cate_id: 6,
      goods_id: this.data.titem_id,
      pay_type: 4
    };
    let that = this;
    wxAjax('order/create_order', orderData, 'post', function(msg) {
      let orderObj = msg.data.data;
      if (msg.data.status) {
        let wx_pay_data = orderObj.wx_pay_data
        console.log(wx_pay_data)
        wx.requestPayment({
          timeStamp: wx_pay_data.timeStamp,
          nonceStr: wx_pay_data.nonceStr,
          package: wx_pay_data.package,
          signType: wx_pay_data.signType,
          paySign: wx_pay_data.paySign,
          success(res) {
            that.getList()
          },
          fail(res) {
            wx.showToast({
              title: '支付失败,继续支付',
              icon: 'none',
              duration: 3000
            })
          }
        })
      }
    }, true)
  }
})