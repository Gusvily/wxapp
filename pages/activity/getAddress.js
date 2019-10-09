// pages/activity/getAddress.js
const app = getApp();
import {
  wxAjax
} from '../../utils/util.js';
const QQMapWX = require('../../utils/qqmap-wx-jssdk.min.js');
const qqmapsdk = new QQMapWX({
  key: 'XRDBZ-T6LR4-RCVUD-DZDZI-UOP57-TOFKS' // 必填
});
Page({

  /**
   * 页面的初始数据
   */
  data: {
    city_list: [],
    hot_city: [],
    topGroup: [],
    input: '',
    history_city: [],
    search_city: [],
    is_search: false,
    listIndex: 0,
    jumpNum: '',
    activeObj: {
      city_id: '',
      city: ''
    },
    nvabarData: {
      showCapsule: 1, //是否显示左上角图标   1表示显示    0表示不显示
      ifBack: 1,
      ifBg: 1,
      ifHome: 1,
      title: '信息确认', //导航栏 中间的标题
    },
    address: '',
    floor: '',
    height: 0,
    is_modelFloor: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let cityData = {
      p: 'a',
      Sign: 'RootSign',
      kind: 1
    }
    let that = this;
    wxAjax('guide/city_list', cityData, 'get', function(res) {
      let city_list = res.data.data.city_list;
      let hot_city = res.data.data.hot_city;
      that.setData({
        city_list: city_list,
        hot_city: hot_city
      })
      that.queryMultipleNodes();
    })
    let pageHeight = wx.getSystemInfoSync().windowHeight
    wx.createSelectorQuery().select('.search').boundingClientRect(function(rect) {
      that.setData({
        height: pageHeight - rect.bottom
      })
    }).exec()

    wx.getStorage({
      key: 'history_city',
      success: function(res) {
        that.setData({
          history_city: res.data ? res.data : []
        })
      }
    })
    this.setData({
      address: app.globalData.city
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
    wx.navigateTo({
      url: 'searchCity?keyname=' + e.detail.value
    })
    // that.sousuo(e.detail.value);
  },
  sousuo(keyname) {
    let that = this;
    let obj = {
      p: 'a',
      Sign: 'RootSign',
      kind: 1,
      keyname: keyname
    }
    wxAjax('guide/city_select', obj, 'get', function(res) {
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
    this.setData({
      is_search: true
    });
  },
  // 删除某一条记录
  detRecord: function(e) {
    var i = e.currentTarget.dataset.record;
    this.data.keywords.splice(i, 1);
    this.setData({
      keywords: this.data.keywords
    });
    wx.setStorage({
      key: "keywords",
      data: this.data.keywords
    })
  },
  // 点击城市
  getCity(e) {
    this.setData({
      'activeObj.city_id': e.target.dataset.city_id,
      'activeObj.city': e.target.dataset.city
    })
    let arr = this.data.history_city;
    let activeObj = {
      city_id: e.target.dataset.city_id,
      city: e.target.dataset.city
    };
    app.globalData.city = activeObj.city;
    app.globalData.isLocation = false;
    wx.reLaunch({
      url: 'activity'
    })
    let keys = e.target.dataset.city;
    let lng = arr.length;
    for (let i = 0; i < lng; i++) {
      // 检索本地是否存在
      if (arr[i].city == keys) {
        return false;
      }
    }
    arr.push(activeObj);
    this.setData({
      history_city: arr
    })
    wx.setStorage({
      key: "history_city",
      data: arr
    })
  },
  /**
   * 获取当前滚动索引
   */
  currentIndex(y) {
    let listHeight = this.data.topGroup
    for (let i = 0; i < listHeight.length; i++) {
      let height1 = listHeight[i]
      let height2 = listHeight[i + 1]
      if (!height2 || (y >= height1 && y < height2)) {
        return i
      }
    }
    return 0
  },
  jumpMt(e) {
    let jumpNum = e.currentTarget.dataset.id;
    let t = e.currentTarget.dataset.floor;
    this.setData({
      jumpNum,
      floor: t,
      is_modelFloor: true
    });
  },
  jumpMt2(e) {
    this.setData({
      is_modelFloor: false
    });
  },
  scroll(e) {
    let top = e.detail.scrollTop
    let index = this.currentIndex(top)
    let list = this.data.topGroup
    // let distance = top - list[this.data.listIndex]
    // let num = -(list[this.data.listIndex + 1] - top - 40)
    // console.log(top, index, list, distance, num)
    // 渲染滚动索引
    if (index !== this.data.listIndex) {
      // console.log(index)
      this.setData({
        // 'pos.oldIndex': index,
        listIndex: index,
        // moveDistance: 40,
      })
      // 如果监听到 index 的变化 ，一定要return ，否则吸顶会先变化文字后运动，会闪烁
      return
    }
    // if (num < 0) num = 0
    // if (num !== this.data.moveDistance) {
    //   this.setData({
    //     moveDistance: num,
    //   })
    // }
  },
  queryMultipleNodes() {
    let that = this
    const query = wx.createSelectorQuery().in(this);
    query.selectAll('.floor').boundingClientRect((res) => {
      res.forEach(function(rect) {
        // console.log(rect.top)
      })
    }).exec((e) => {
      let arr = []
      e[0].forEach((rect) => {
        let num = 0
        if (rect.top !== 0) {
          num = rect.top - that.data.nvabarData.height - 66
        }
        arr.push(num)
      })
      this.setData({
        topGroup: arr
      })
    })
  },
  // 定位
  dingwei() {
    let that = this
    wx.getLocation({
      type: 'wgs84',
      success(res) {
        const latitude = res.latitude
        const longitude = res.longitude
        const speed = res.speed
        const accuracy = res.accuracy
        qqmapsdk.reverseGeocoder({
          location: {
            latitude: latitude,
            longitude: longitude
          },
          success: function(msg) {
            let address = msg.result.address_component.city
            if (address.indexOf(app.globalData.city) != -1) {
              return false
            }
            wx.showModal({
              content: '定位到您在 ' + address + '，是否切换至该城市？',
              confirmColor: '#E8593E',
              success(res) {
                if (res.confirm) {
                  app.globalData.isLocation = false
                  app.globalData.city = address
                  that.setData({
                    address: address
                  }, function() {
                    wx.reLaunch({
                      url: 'activity'
                    })
                  })
                }
              }
            })
          },
          fail: function(error) {
            console.error(error);
          }
        })
      },
      fail(res) {
        if (res.errMsg == 'getLocation:fail:ERROR_SERVER_NOT_LOCATION') {
          wx.showModal({
            title: '提示',
            content: '请检查手机定位定位是否开启'
          })
        } else {
          app.globalData.isLocation = false
          wx.getSetting({
            success: function(res) {
              var statu = res.authSetting;
              if (!statu['scope.userLocation']) {
                wx.showModal({
                  title: '是否授权当前位置',
                  content: '需要获取您的地理位置，请确认授权，否则定位功能将无法使用',
                  success: function(tip) {
                    if (tip.confirm) {
                      wx.openSetting({
                        success: function(data) {
                          if (data.authSetting["scope.userLocation"] === true) {
                            app.globalData.isLocation = true
                            wx.showToast({
                              title: '授权成功',
                              icon: 'success',
                              duration: 1000
                            })
                          } else {
                            wx.showToast({
                              title: '授权失败',
                              icon: 'success',
                              duration: 1000
                            })
                          }
                        }
                      })
                    } else {
                      app.globalData.isLocation = false
                    }
                  }
                })
              }
            }
          })
        }
      }
    })
  }
})