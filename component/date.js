// component/date.js
const app = getApp();
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    dateData: {
      type: Object,
      value: {

      },
      // observer: function (newVal, oldVal) {
      //   let that = this;
      //   console.log(newVal.activeDate, "1111")
      //   console.log(newVal.activeDate, "2222")
      //   if (newVal.activeDate.length) {
      //     if (newVal.activeDate.length != oldVal.activeDate.length) {
      //       that.setData({
      //         activeDate: newVal.activeDate
      //       }, function () {
      //         that.getDate();
      //       })
      //     }
      //   } else {
      //     // that.setDate();
      //     that.getDate();
      //   }
      // }
    }
  },
  observers: {
    'dateData.activeDate': function (newVal) {
      let that = this;
      if (newVal.length) {
        that.setData({
          activeDate: newVal
        }, function () {
          that.getDate();
        })
      } else {
        that.getDate();
      }
    }
  },
  /**
   * 组件的初始数据
   */
  data: {
    currentI: null,
    ifPrev: false,
    currMonth: '',
    currYear: '',
    currDay: '',
    currWeek: '',
    year: '',
    month: '',
    day: '',
    weekArr: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    weekChArr: ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'],
    activeDate: [],
    dateArr: [],
    firstDay: '',
    lastDay: ''
  },
  /**
   * 组件的生命周期
   */
  // 获取有活动的日期
  attached: function () {
    // console.log(this.properties.dateData,"3333")
    // that.data.dateArr = [];
  },
  /**
   * 组件的方法列表
   */
  methods: {
    getDate: function () { //获取当月日期
      var that = this;
      var mydate = new Date();
      let weekI = mydate.getDay();
      var year = mydate.getFullYear();
      var month = mydate.getMonth();
      var months = month + 1;
      this.data.year = year;
      this.data.month = months;
      this.data.day = mydate.getDate();
      var fist = new Date(year, month, 1);
      this.data.firstDay = fist.getDay();
      var last = new Date(year, months, 0);
      this.data.lastDay = last.getDate();
      this.setData({
        year: this.data.year,
        currYear: this.data.year,
        month: this.data.month,
        currMonth: this.data.month,
        currWeek: this.data.weekChArr[weekI],
        day: this.data.day,
        firstDay: this.data.firstDay,
        lastDay: this.data.lastDay
      }, function () {
        that.setDate()
      })
    },
    setDate: function () {
      this.data.dateArr = [];
      for (var i = 1; i <= this.data.lastDay; i++) {
        if (i == this.data.day && this.data.month == this.data.currMonth && this.data.year == this.data.currYear) {
          this.data.dateArr.push({
            day: "今",
            isAtiveDate: this.isAtiveDate(i)
          });
        } else {
          this.data.dateArr.push({
            day: i,
            isAtiveDate: this.isAtiveDate(i)
          });
        }
      }
      this.setData({
        dateArr: this.data.dateArr,
        firstDay: this.data.firstDay
      })
    },
    // 判断是否是活动日期
    isAtiveDate: function (d) {
      let de = d
      let currdate = this.data.year + '-' + this.data.month + '-' + de;
      let lng = this.data.activeDate.length;
      let flag;
      for (let i = 0; i < lng; i++) {
        if (this.data.activeDate[i].date == currdate) {
          return true
        }
      }
      return false
    },
    // 判断在活动日期数组的下标
    isAtiveI: function (d) {
      let lng = this.data.activeDate.length;
      for (let i = 0; i < lng; i++) {
        if (this.data.activeDate[i].date == d) {
          return i
        }
      }
    },
    prevMonth: function () { //上一月
      var months = "";
      var years = "";
      var month = +this.data.month;
      if (this.data.month == 1) {
        years = this.data.year - 1
        months = '12';
      } else {
        years = this.data.year;
        months = month - 1;
      }

      var first = new Date(years, months - 1, 1);
      this.data.firstDay = first.getDay();
      var last = new Date(years, months, 0);
      this.data.lastDay = last.getDate();
      if (+months > this.data.currMonth || years > this.data.currYear) {
        this.setData({
          ifPrev: true
        })
      } else {
        this.setData({
          ifPrev: false
        })
      }
      this.setData({
        month: months,
        year: years,
        firstDay: this.data.firstDay,
        lastDay: this.data.lastDay
      })

      this.data.dateArr = [];
      for (var i = 1; i < this.data.lastDay + 1; i++) {
        if (i == this.data.day && this.data.month == this.data.currMonth && this.data.year == this.data.currYear) {
          this.data.dateArr.push({
            day: "今",
            isAtiveDate: this.isAtiveDate(i)
          });
        } else {
          this.data.dateArr.push({
            day: i,
            isAtiveDate: this.isAtiveDate(i)
          });
        }
      }
      this.setData({
        dateArr: this.data.dateArr
      })
    },
    nextMonth: function () { //下一月
      var months = "";
      var years = "";
      var month = +this.data.month;
      if (month == 12) {
        months = '1';
        years = this.data.year + 1;
      } else {
        months = month + 1;
        years = this.data.year;
      }
      var first = new Date(years, months - 1, 1);
      this.data.firstDay = first.getDay();
      var last = new Date(years, months, 0);
      this.data.lastDay = last.getDate();
      if (+months > this.data.currMonth || years > this.data.currYear) {
        this.setData({
          ifPrev: true
        })
      } else {
        this.setData({
          ifPrev: false
        })
      }
      this.setData({
        month: months,
        year: years,
        firstDay: this.data.firstDay,
        lastDay: this.data.lastDay
      })
      this.data.dateArr = [];
      for (var i = 1; i < this.data.lastDay + 1; i++) {
        if (i == this.data.day && this.data.month == this.data.currMonth && this.data.year == this.data.currYear) {
          this.data.dateArr.push({
            day: "今",
            isAtiveDate: this.isAtiveDate(i)
          });
        } else {
          this.data.dateArr.push({
            day: i,
            isAtiveDate: this.isAtiveDate(i)
          });
        }
      }
      this.setData({
        dateArr: this.data.dateArr
      })
    },
    // 选择日期
    choiceDate(e) {
      let obj = e.currentTarget.dataset;
      let d = (obj.i + 1)
      let a = this.data.year + '-' + this.data.month + '-' + d;
      let weekDay = new Date(a).getDay();
      let i = this.isAtiveI(a)
      if (obj.ativedate) {
        this.setData({
          currentI: i,
          currDay: (obj.i + 1),
          currWeek: this.data.weekChArr[weekDay]
        })
      }
    },
    is_show() {
      this.setData({
        'dateData.is_show': false
      })
    },
    sure() {
      if (this.data.currentI === null) {
        wx.showToast({
          title: '请选择活动时间',
          icon: 'none',
          duration: 1000
        })
        return false
      }
      let d = this.data.activeDate[this.data.currentI].date
      const myEventDetail = {
        date: d,
        year: this.data.year,
        month: this.data.month,
        day: this.data.currDay ? this.data.currDay : this.data.day,
        week: this.data.currWeek
      } // detail对象，提供给事件监听函数
      const myEventOption = {} // 触发事件的选项
      this.triggerEvent('sureDate', myEventDetail, myEventOption)
      this.setData({
        'dateData.is_show': false
      })
    }
  }
})