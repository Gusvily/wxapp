// component/pickDate.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    pickData: {
      type: Object,
      value: {

      }
    }
  },
  observers: {
    'pickData.is_paick': function(newVal) {
      if (newVal) {
        this.data.is_paick = newVal
        console.log(newVal, 'newVal')
      }
    },
    'pickData.date,pickData.active_start_time': function(a, b) {
      console.log(a, 'a', b, 'b')
      if (a) {
        this.data.pickData.data = a
        this.data.pickData.active_start_time = b
        this.data.paickDate = a
        this.data.paickTime = b
        this.getEndTime()
      }
    },
    'dayI': function(dayI) {
      console.log(dayI, 'dayI')
      if (dayI > 0 && dayI < this.data.days.length - 1) {
        this.getHoursData(0, 23)
        this.getMinutesData(0, 59)
      }
      // 到第一天
      if (dayI == 0) {
        this.getHoursData(this.data.currentTime.starHour, 23)
        this.getMinutesData(this.data.currentTime.starMinute, 59)
      }
      //到最后一天
      if (dayI == this.data.days.length - 1) {
        this.getHoursData(0, this.data.endTime.endHour)
        // this.getMinutesData(0, this.data.endTime.endMinute)
      }
    },
    'hourI': function(hourI) {
      console.log(hourI, 'hourI')
      if (hourI > 0 && hourI < this.data.hours.length - 1) {
        this.getMinutesData(0, 59)
      }
      // 到第一个
      if (hourI == 0 && this.data.dayI == 0) {
        this.getMinutesData(this.data.currentTime.starMinute, 59)
      }
      //到最后一个
      if (hourI == this.data.hours.length - 1 && this.data.dayI == this.data.days.length - 1) {
        this.getMinutesData(0, this.data.endTime.endMinute)
      }
    }
  },
  /**
   * 组件的初始数据
   */
  data: {
    // 候补时间选择器数据容器
    days: [],
    hours: [],
    minutes: [],
    dayI: 0,
    hourI: 0,
    minuteI: 0,
    paickValue: [1, 1, 1],
    paickDate: '',
    paickTime: '',
    startDate: '',
    currentTime: {},
    endTime: {}
  },
  lifetimes: {
    attached: function() {

    },
    detached: function() {
      // 在组件实例被从页面节点树移除时执行
    },
  },
  /**
   * 组件的方法列表
   */
  created: function() {
    // 在组件实例进入页面节点树时执行
    this.getStartTime()
  },
  ready: function() {

  },
  methods: {
    bindChange(e) {
      const val = e.detail.value
      this.setData({
        dayI: val[0],
        hourI: val[1]
      })
      this.data.paickDate = this.data.days[val[0]]
      this.data.paickTime = this.data.hours[val[1]] + ":" + this.data.minutes[val[2]]
    },
    //计算开始时间
    getStartTime() {
      let dateObj = new Date();
      // 候补开始时间
      let starYear = dateObj.getFullYear()
      let starMonth = dateObj.getMonth() + 1
      let starDay = dateObj.getDate()
      let starHour = dateObj.getHours()
      let starMinute = dateObj.getMinutes()
      // 初始化日期信息
      this.data.startDate = starYear + "-" + this.formatNumber(starMonth) + "-" + this.formatNumber(starDay)
      this.data.currentTime.starYear = starYear
      this.data.currentTime.starMonth = starMonth
      this.data.currentTime.starDay = starDay
      this.data.currentTime.starHour = starHour
      this.data.currentTime.starMinute = starMinute
    },
    //计算结束时间
    getEndTime() {
      //候补结束时间
      let endDate = this.data.pickData.date + ' ' + this.data.pickData.active_start_time + ":00"
      // 为兼容ios转成字符串
      endDate = Date.parse(endDate.replace(/-/g, "/"));
      let dateObj = new Date(endDate)
      let endYear = dateObj.getFullYear()
      let endMonth = dateObj.getMonth() + 1
      let endDay = dateObj.getDate()
      let endHour = dateObj.getHours()
      let endMinute = dateObj.getMinutes()
      this.data.endTime.endYear = endYear
      this.data.endTime.endMonth = endMonth
      this.data.endTime.endDay = endDay
      this.data.endTime.endHour = endHour
      this.data.endTime.endMinute = endMinute
      // 填充列表
      this.getDaysData()
      this.getHoursData(this.data.currentTime.starHour, 23)
      this.getMinutesData(this.data.currentTime.starMinute, 59)
    },
    //时间格式化
    formatNumber(n) {
      n = n.toString()
      return n[1] ? n : '0' + n
    },
    formatTime(date) {
      var date = new Date(date)
      const year = date.getFullYear()
      const month = date.getMonth() + 1
      const day = date.getDate()
      return [year, month, day].map(this.formatNumber).join('-')
    },
    // 计算日期列数据
    getDaysData(h, h1, m, m1) {
      let startDate = new Date(this.data.startDate)
      let endDate = new Date(this.data.pickData.date)
      let a = startDate.getTime()
      let b = endDate.getTime()
      let c = Math.floor((b - a) / 86400000) > 0 ? Math.floor((b - a) / 86400000) + 1 : 1
      let day = ''
      let days = []
      // b-a == 0 同一天 （按最后一天处理）
      for (let i = 0; i < c; i++) {
        day = this.formatTime(a)
        a = a + 86400000
        days.push(day)
      }
      this.setData({
        days: days
      })
    },
    // 计算小时列数据
    getHoursData(startHour, endHour) {
      let hours = []
      // 当只有一天的差值时
      if (this.data.days.length == 1) {
        startHour = this.data.currentTime.starHour
        endHour = this.data.endTime.endHour
      }
      if (this.data.dayI == this.data.days.length - 1) {
        endHour = this.data.endTime.endHour
      }
      for (let i = startHour; i <= endHour; i++) {
        if (i < 10) {
          hours.push('0' + i)
        } else {
          hours.push('' + i)
        }
      }
      this.setData({
        hours: hours
      })
    },
    // 计算分钟列数据
    getMinutesData(starMinute, endMinute) {
      let minutes = []
      // 只有一天的时候
      // if (this.data.days.length == 1) {
      //   starMinute = this.data.currentTime.starMinute
      //   endMinute = this.data.endTime.endMinute
      // } 
      // 小时滑到最后一个
      if (this.data.hourI == this.data.hours.length - 1) {
        endMinute = this.data.endTime.endMinute
      }
      for (let i = starMinute; i <= endMinute; i++) {
        if (i < 10) {
          minutes.push('0' + i)
        } else {
          minutes.push('' + i)
        }
      }
      this.setData({
        minutes: minutes
      })
    },
    //点击确定
    sure() {
      const myEventDetail = {
        date: this.data.paickDate,
        active_start_time: this.data.paickTime
      } // detail对象，提供给事件监听函数

      const myEventOption = {} // 触发事件的选项
      this.triggerEvent('getDate', myEventDetail, myEventOption)
      this.setData({
        'pickData.is_paick': true
      })
    },
    //点击取消
    cacle() {
      this.setData({
        'pickData.is_paick': true
      })
    }
  }
})