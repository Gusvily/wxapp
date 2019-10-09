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
      title: '信息填写', //导航栏 中间的标题
    },
    modalData: {
      title: "提示",
      is_show: false,
      btnText: "",
      content: '',
      btnFun: ''
    },
    pickData: {
      is_paick: true,
      date: '',
      active_start_time: ''
    },
    //场次详情
    sessionData: {},
    //活动场次id
    active_time_id: '',
    //活动id
    active_id: '',
    //1普通，2亲子活动
    cate_id: 1,
    //是否候补
    hb: 0,
    // 是否现场候补
    spot: 0,
    //成年参观人
    is_radio: 0,
    //儿童参观人
    is_radio2: 0,
    person: [],
    child: [],
    toi_username: '',
    toi_card_num: '',
    contact_phone: '',
    children_card_num: '',
    children_username: '',
    orderData: '',
    invite_code: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let active_obj = {
        p: 'x',
        td_id: options.active_time_id,
        api_token: app.globalData.api_token
      },
      that = this;
    that.data.active_id = options.active_id
    that.data.active_time_id = options.active_time_id
    that.data.spot = options.spot
    that.setData({
      cate_id: options.cate_id,
      hb: +options.hb
    })
    this.get_active_detail(active_obj)
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
    this.setData({
      contact_phone: app.globalData.userInfo.phone || wx.getStorageSync('phone')
    })
    this.get_users_contacts()
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
   * 获取活动场次简介
   */
  get_active_detail(active_obj) {
    let that = this
    wxAjax('timeinfo', active_obj, 'get', function(res) {
      let obj = res.data.data;
      that.setData({
        sessionData: obj
      })
      that.data.pickData.date = obj.date
      that.data.pickData.active_start_time = obj.active_start_time
      wx.setStorage({
        key: "active_detail",
        data: obj
      })
    }, true)
  },
  /**
   * 获取常用联系人信息
   */
  get_users_contacts() {
    let that = this
    wxAjax('users/contacts', {
      p: 'x',
      api_token: app.globalData.api_token
    }, 'get', function(res) {
      let obj = res.data.data;
      that.setData({
        person: obj.person,
        child: obj.child
      })
    }, true)
  },
  // 添加/修改联系人api  child->true 是儿童  false 不是儿童
  users_contactssave(child) {
    let that = this
    let data = {}
    if (child) {
      data = {
        p: 'x',
        api_token: app.globalData.api_token,
        id: 0,
        title: that.data.children_username,
        child: 1,
        card: that.data.children_card_num
      }
    } else {
      data = {
        p: 'x',
        api_token: app.globalData.api_token,
        id: 0,
        title: that.data.toi_username,
        child: 0,
        card: that.data.toi_card_num,
        phone: this.data.contact_phone
      }
    }
    wxAjax('users/contactssave', data, 'post', function(res) {
      console.log(res, "添加联系人成功")
    }, true)
  },
  // 删除联系人api
  users_contactsdel(id, i, is_person) {
    let that = this
    wxAjax('users/contactsdel', {
      p: 'x',
      id: id,
      api_token: app.globalData.api_token
    }, 'get', function(res) {

      if (is_person == 1) {
        that.data.person.splice(i, 1)
        that.setData({
          person: that.data.person
        })
      } else {
        that.data.child.splice(i, 1)
        that.setData({
          child: that.data.child
        })
      }
    }, true)
  },
  // 如果有参观人
  //选择成年联系人
  checked_radio: function(e) {
    this.setData({
      is_radio: e.currentTarget.dataset.index
    })
  },
  //选择儿童联系人
  checked_radio2: function(e) {
    this.setData({
      is_radio2: e.currentTarget.dataset.index
    })
  },
  //添加更多成年参观人
  goAddVisitor: function() {
    wx.removeStorage({
      key: 'personData',
      success(res) {
        wx.navigateTo({
          url: 'addVisitors'
        })
      }
    })
  },
  //添加更多儿童参观人
  goAddChildVisitor: function() {
    wx.removeStorage({
      key: 'childData',
      success(res) {
        wx.navigateTo({
          url: 'addChildVisitors'
        })
      }
    })
  },
  // 编辑/删除联系人
  editVisitor: function(e) {
    let that = this
    // type 1 编辑 0 删除 person 1 成人 0 儿童
    let id = e.currentTarget.dataset.id
    let item = e.currentTarget.dataset.item
    let type = e.currentTarget.dataset.type
    let i = e.currentTarget.dataset.i
    let person = e.currentTarget.dataset.person
    if (type == 1) {
      if (person == 1) {
        // 清除之前的 写入新的
        wx.removeStorage({
          key: 'personData',
          success(res) {
            wx.setStorage({
              key: 'personData',
              data: item,
              success: function() {
                wx.navigateTo({
                  url: 'addVisitors?id=' + item.id
                })
              }
            })
          }
        })
      } else {
        wx.removeStorage({
          key: 'childData',
          success(res) {
            wx.setStorage({
              key: 'childData',
              data: item,
              success: function() {
                wx.navigateTo({
                  url: 'addChildVisitors?id=' + item.id
                })
              }
            })
          }
        })
      }
    } else {
      this.setData({
        'modalData.is_show': true,
        'modalData.title': '提示',
        'modalData.btnText': '确定',
        'modalData.content': '确认删除该条参观人信息吗?',
        'modalData.btnFun': function() {
          that.users_contactsdel(id, i, person)
        }
      })
    }
  },
  // 显隐时间选择器  //把数据传给组件
  is_paick() {
    this.setData({
      'pickData.is_paick': false,
      'pickData.date': this.data.pickData.date,
      'pickData.active_start_time': this.data.pickData.active_start_time
    })
  },
  // 选择候补时间 //获取组件返回数据
  candidate: function(e) {
    this.setData({
      'sessionData.date': e.detail.date,
      'sessionData.active_start_time': e.detail.active_start_time
    })
  },
  // 成人姓名
  bind_toi_username(e) {
    this.setData({
      toi_username: e.detail.value
    })
  },
  // 成人身份证号
  bind_toi_card_num(e) {
    this.setData({
      toi_card_num: e.detail.value
    })
  },
  //邀请码
  bind_invite_code(e) {
    this.setData({
      invite_code: e.detail.value
    })
  },
  //手机号
  bind_contact_phone(e) {
    this.setData({
      contact_phone: e.detail.value
    })
  },
  //儿童姓名
  bind_children_username(e) {
    this.setData({
      children_username: e.detail.value
    })
  },
  //儿童身份证号
  bind_children_card_num(e) {
    this.setData({
      children_card_num: e.detail.value
    })
  },
  //改变手机号
  changePhoneNum() {
    wx.navigateTo({
      url: 'addPhone',
    })
  },
  // 点击确认信息按钮
  sub() {
    let that = this
    let toi_username = this.data.toi_username;
    let contact_phone = this.data.contact_phone;
    let toi_card_num = this.data.toi_card_num;
    let children_username = this.data.children_username;
    let children_card_num = this.data.children_card_num;
    let card_num_flag = reg_card_num(toi_card_num);
    let card_num_flag2 = reg_card_num(children_card_num);
    let hb = this.data.hb
    if (!that.data.person.length) {
      if (!toi_username) {
        wx.showToast({
          title: '请输入姓名',
          icon: 'none',
          duration: 2000
        })
        return false
      }
      if (!card_num_flag) {
        wx.showToast({
          title: '请输入正确的身份证号',
          icon: 'none',
          duration: 2000
        })
        return false
      }

      debounce(function() {
        console.log("事件被触发了")
        that.users_contactssave(false)
      })()

    } else {
      contact_phone = this.data.person[this.data.is_radio].phone
      toi_card_num = this.data.person[this.data.is_radio].card
      toi_username = this.data.person[this.data.is_radio].title
    }
    if (this.data.cate_id == 2) {
      if (!that.data.child.length) {
        if (!children_username) {
          wx.showToast({
            title: '请输入儿童姓名',
            icon: 'none',
            duration: 2000
          })
          return false
        }
        if (!card_num_flag2) {
          wx.showToast({
            title: '请输入正确的儿童身份证号',
            icon: 'none',
            duration: 2000
          })
          return false
        }
        debounce(function() {
          console.log("事件被触发了")
          that.users_contactssave(true)
        })()
      } else {
        children_card_num = this.data.child[this.data.is_radio2].card
        children_username = this.data.child[this.data.is_radio2].title
      }
    }
    let parameter = {}
    if (this.data.cate_id == 1) {
      parameter = {
        active_time_id: this.data.active_time_id,
        toi_username: toi_username,
        toi_card_num: toi_card_num,
        contact_phone: contact_phone,
        invite_code: this.data.invite_code
      }
    } else {
      parameter = {
        active_time_id: this.data.active_time_id,
        toi_username: toi_username,
        toi_card_num: toi_card_num,
        invite_code: this.data.invite_code,
        contact_phone: contact_phone,
        children_card_num: children_card_num,
        children_username: children_username
      }
    }
    if (+hb) {
      parameter.alternate = this.data.sessionData.date + ' ' + this.data.sessionData.active_start_time + ':00'
    }
    if (+that.data.spot) {
      parameter.spot = 1
    }
    wx.removeStorage({
      key: 'key',
      success(res) {
        wx.setStorage({
          key: 'key',
          data: parameter,
          success: function() {
            wx.navigateTo({
              url: 'confirm?id=' + that.data.active_time_id + '&hb=' + hb
            })
          }
        })
      }
    })
  }
})