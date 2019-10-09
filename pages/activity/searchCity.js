// pages/activity/searchCity.js
const app = getApp();
import { wxAjax } from '../../utils/util.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    input: '',
    search_city: [],
    nvabarData: {
      showCapsule: 1, //是否显示左上角图标  1表示显示  0表示不显示
      ifBack: 1,
      ifBg:1,
      title: '信息确认', //导航栏 中间的标题
      ifHome:1
    },
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let cityData = {
      p: 'a',
      Sign: 'RootSign',
      kind: 1
    }
    let that = this;
    that.setData({
      input: decodeURIComponent(options.keyname)
    })
    that.sousuo(decodeURIComponent(options.keyname))
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

  goBack(){
    wx.navigateBack()
  },
  // 存入一条记录
  search(e) {
    let that = this;
    if (!e.detail.value) {
      wx.showToast({
        title: "请输入...",
        icon: "none"
      })
      return false;
    }
    that.setData({
      input: e.detail.value
    });
    that.sousuo(e.detail.value);
  },
  sousuo(keyname) {
    let that = this;
    let obj = {
      p: 'a',
      Sign: 'RootSign',
      kind: 1,
      keyname: keyname
    }
    wxAjax('guide/city_select', obj, 'get', function (res) {
      if (res.data.data.length) {
        that.setData({
          search_city: res.data.data
        })
      } else {
        wx.showToast({
          title: '没有搜索到匹配的内容',
          icon: 'none',
          duration: 2000
        })
      }
    })
  },

  // 点击城市
  getCity(e) {
    let activeObj = {
      city_id: e.target.dataset.city_id,
      city: e.target.dataset.city
    };
    app.globalData.city = activeObj.city;
    app.globalData.isLocation = false;
    wx.getStorage({
      key: 'history_city',
      success: function (res) {
        let arr = res.data ? res.data : []
        let keys = e.target.dataset.city;
        let lng = arr.length;
        for (let i = 0; i < lng; i++) {
          // 检索本地是否存在
          if (arr[i].city == keys) {
            wx.reLaunch({
              url: 'activity'
            })
            return false;
          }
        }
        arr.push(activeObj);
        wx.setStorage({
          key: "history_city",
          data: arr
        })
        wx.reLaunch({
          url: 'activity'
        })
      },
      fail:function(res){
        let arr = []
        arr.push(activeObj);
        wx.setStorage({
          key: "history_city",
          data: arr
        })
        wx.reLaunch({
          url: 'activity'
        })
      }
    })
  }
})