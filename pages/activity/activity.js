// pages/activity/activity.js
const app = getApp();
import {
  wxAjax,
  base64
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
    aaa:'<text style="color:#e8593e">9999</text>',
    base_url: app.globalData.base_url,
    active: app.globalData.mid, //选中的博物馆
    status: app.globalData.status, //选中的预约状态
    type: app.globalData.type,
    // is_show_order: app.globalData.mid == 1 && app.globalData.gzhcd,
    isStatus: false,
    isMuseum: false,
    isType: false,
    is_ref: true,
    statusTxt: "全部预约状态",
    museumTxt: "全部博物馆",
    typeTxt: "全部类别",
    vTxt1: '该城市暂无活动',
    vTxt2: '去其他城市看看吧～',
    capsuleData: app.globalData.capsuleData,
    city: app.globalData.city,
    dateData: {
      is_show: false,
      height: app.globalData.height * 4 + 40,
      activeDate: []
    },
    date: {
      year: '',
      month: '',
      day: '',
      week: '',
      date: ''
    },
    page: 1,
    limit: 10,
    list: [],
    listShow: true,
    status_list: ["全部预约状态", "报名中", "报名结束", "报名已满", "未开始"],
    trye_list: ["全部类别", "活动", "讲座"],
    museum_list: [],
    active_status_color: ['', '#01AD62', '#E8593E', '#A0A0A0', '#DFB406', '#A0A0A0'],
    is_gxh: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that = this
    wx.showLoading({
      title: '加载中',
    })
    setTimeout(function() {
      wx.hideLoading()
    }, 1000)
    if (options.mid || options.scene) {
      if (options.mid) {
        app.globalData.city = options.city;
        app.globalData.mid = options.mid;
        app.globalData.type = options.type;
        app.globalData.status = options.status;
      } else {
        let Base64 = new base64()
        let scene = decodeURIComponent(options.scene).split("&")
        let city = Base64.decode(scene[1]);
        app.globalData.mid = scene[0];
        app.globalData.city = city;
        app.globalData.type = scene[2];
        app.globalData.status = scene[3];
      }
      app.globalData.individuation = true;
      app.globalData.isLocation = false;
      that.museumList(function() {
        that.setData({
          is_gxh: true,
          city: options.city,
          vTxt1: options.type == 2 ? '馆内暂无讲座' : '馆内暂无活动',
          vTxt2: '去其他博物馆看看吧～',
        }, function() {
          that.getAtime(that.getList)
        })
      })
    } else if (app.globalData.isLocation) {
      that.dingwei()
    } else {
      that.getAtime(that.getList)
      that.museumList()
    }
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    this.setData({
      'nvabarData.city': app.globalData.city
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    this.setData({
      city: app.globalData.city
    })
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
      that.setData({
        page: 1,
        limit: 10,
        is_ref: false
      }, function() {
        that.getList()
      })
    }
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    this.setData({
      page: 1,
      limit: ++this.data.page * this.data.limit
    })
    this.getList()
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  //选择预约状态
  is_status_list() {
    this.setData({
      isStatus: !this.data.isStatus
    })
  },
  //选择博物馆
  is_museum_list() {
    if (app.globalData.individuation) {
      return false
    }
    this.setData({
      isMuseum: !this.data.isMuseum
    })
  },
  //选择活动类别
  is_type_list() {
    this.setData({
      isType: !this.data.isType
    })
  },
  checkMuseum(mid) {
    for (let i = 0; i < this.data.museum_list.length; i++) {
      if (this.data.museum_list[i].museum_id == mid) {
        return this.data.museum_list[i].title
      }
    }
  },
  checkMuseumI(mid) {
    for (let i = 0; i < this.data.museum_list.length; i++) {
      if (this.data.museum_list[i].museum_id == mid) {
        return i
      }
    }
  },
  clickStatus(e) {
    let status = e.currentTarget.dataset.status;
    app.globalData.status = status
    this.setData({
      status: status,
      isStatus: false,
    }, function() {
      this.getList()
    })
  },
  ckickAI(e) {
    let ai = e.currentTarget.dataset.ai;
    let mid = e.currentTarget.dataset.mid;
    let that = this;
    var txt = "";
    if (mid != 0) {
      this.data.type == 2 ? txt = '馆内暂无讲座' : txt = '馆内暂无活动'
    } else {
      this.data.type == 2 ? txt = '该城市暂无讲座' : txt = '该城市暂无活动'
    }
    app.globalData.mid = mid
    this.setData({
      active: ai,
      isMuseum: false,
      vTxt1: txt,
      vTxt2: '去其他博物馆看看吧～',
    }, function() {
      that.getList()
    })
  },
  clickTypes(e) {
    let type = e.currentTarget.dataset.type;
    var txt = "";
    if (app.globalData.mid != 0) {
      type == 2 ? txt = '馆内暂无讲座' : txt = '馆内暂无活动'
    } else {
      type == 2 ? txt = '该城市暂无讲座' : txt = '该城市暂无活动'
    }
    app.globalData.type = type
    this.setData({
      type: type,
      isType: false,
      vTxt1: txt
    }, function() {
      this.getList()
    })
  },
  goMyOrder() {
    wx.navigateTo({
      url: '../personal/personalCenter'
    })
  },
  goAddress() {
    wx.navigateTo({
      url: 'getAddress'
    })
  },
  is_show() {
    this.setData({
      'dateData.is_show': !this.data.dateData.is_show
    })
  },
  getAtime(fun) {
    let that = this;
    wxAjax('active_time_list', {
      p: 'w',
      Sign: 'RootSign',
      city: app.globalData.city
    }, 'get', function(res) {

      var d = {
        date: '',
        week: ''
      }
      var weekChArr = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
      d.date = new Date().toLocaleDateString().replace(/\//g, "-")
      d.week = weekChArr[new Date().getDay()]
      var mm = d.date.split("-")
      if (mm[1] < 10) {
        mm[1] = "0" + mm[1]
      }
      if (mm[2] < 10) {
        mm[2] = "0" + mm[2]
      }
      var hmd = mm.join('-')
      var dd = new Date(hmd);
      var year = dd.getFullYear()
      var month = dd.getMonth() + 1
      var day = dd.getDate()
      var week = d.week
      that.setData({
        'date.year': year,
        'date.month': month,
        'date.day': day,
        'date.week': week,
        'date.date': d.date,
        'dateData.activeDate': res.data.data
      }, function() {
        if (fun) {
          fun()
        }
      })
    })
  },
  getDate(e) {
    let that = this
    that.setData({
      date: e.detail,
      'dateData.is_show': true
    })
    that.setData({
      'date.date': e.detail.date
    }, function() {
      that.getList()
    })
  },
  getList() {
    let that = this
    let parameter = {
      p: 'w',
      Sign: 'RootSign',
      api_token: app.globalData.api_token,
      city: app.globalData.city,
      mid: app.globalData.mid,
      status: app.globalData.status,
      type: app.globalData.type,
      date: that.data.date.date,
      page: that.data.page,
      limit: that.data.limit
    };
    wxAjax('active_list', parameter, 'get', function(res) {
      let obj = res.data.data;
      that.setData({
        list: obj,
        is_ref: true,
        listShow: obj.length > 0 ? true : false
      })
      wx.hideLoading()
    })
  },
  museumList(fun) {
    let that = this
    let parameter = {
      p: 'w',
      Sign: 'RootSign',
      city: app.globalData.city,
      skip: 0,
      take: 1000
    }
    wxAjax('active/museum_list', parameter, 'get', function(res) {
      let obj = res.data.data;
      obj.unshift({
        museum_id: 0,
        title: "全部博物馆"
      })
      that.setData({
        museum_list: obj
      }, function() {
        if (app.globalData.individuation) {
          let ai = that.checkMuseumI(app.globalData.mid)
          that.setData({
            is_gxh: true,
            active: ai,
            type: app.globalData.type,
            status: app.globalData.status,
            vTxt1: app.globalData.type == 2 ? '馆内暂无讲座' : '馆内暂无活动'
          })
        }
        if (fun) {
          fun()
        }
      })
    })
  },
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
              that.getAtime(that.getList)
              that.museumList()
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
                    city: address
                  })
                  that.getAtime(function() {
                    that.getList()
                    that.museumList()
                  })
                } else if (res.cancel) {
                  that.getAtime(function() {
                    that.getList()
                    that.museumList()
                  })
                }
              }
            })
          },
          fail: function(error) {
            that.getAtime(function() {
              that.getList()
              that.museumList()
            })
            console.error(error);
          }
        })
      },
      fail(res) {
        if (res.errCode == 404) {
          wx.showModal({
            title: '提示',
            content: '请检查手机定位定位是否开启'
          })
          that.getAtime(function() {
            that.getList()
            that.museumList()
          })
        } else {
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
                            that.dingwei()
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
                      that.getAtime(function() {
                        that.getList()
                        that.museumList()
                      })
                    }
                  }
                })
              } else {
                that.getAtime(function() {
                  that.getList()
                  that.museumList()
                })
              }
            }
          })
        }
      }
    })
  }
})