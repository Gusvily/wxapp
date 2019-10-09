// component/modal.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    modalData: {
      type: Object,
      value: {

      },
      observer: function(newVal, oldVal) {
        // console.log(newVal, oldVal)
      }
    }
  },
  observers: {
    'modalData.content,modalData.ifGoR': function(e, r) {
      if (e) {
        this.setData({
          content: e
        })
      }
      if (r) {
        this.setData({
          ifGoR: r
        })
      }
    }
  },
  /**
   * 组件的初始数据
   */
  data: {
    content: '',
    ifGoR: '',
    modalData: {
      is_show: true
    }
  },
  attached: function() {

  },
  /**
   * 组件的方法列表
   */
  methods: {
    close() {
      this.setData({
        'modalData.is_show': false
      })
    },
    goRouter(e) {
      let formId = e.detail.formId
      if (this.properties.modalData.btnFun) {
        if (this.properties.modalData.form_id) {
          this.properties.modalData.btnFun(formId)
        } else {
          this.properties.modalData.btnFun()
        }
        this.setData({
          'modalData.is_show': false
        })
        return false
      } else if (this.properties.modalData.ifGoR) {
        wx.navigateTo({
          url: this.data.ifGoR
        })
      } else {
        this.setData({
          'modalData.is_show': false
        })
      }
    }
  }
})