const app = getApp();
const wxAjax = (url, data, method, fun, ifLogin) => {
  ifLogin ? ifLogin = ifLogin : ifLogin = false
  if (ifLogin && !app.globalData.api_token) {
    console.log("需要登录的接口")
    register(url, data, method, fun)
  } else {
    wxRequest(url, data, method, fun)
  }
}
//登录注册
const register = (url, data, method, fun) => {
  wx.login({
    success: res2 => {
      let code = res2.code;
      let userInfoData = {
        p: 'x',
        code: code,
        Sign: 'RootSign',
        mini: 1
      }
      wxRequest('users/appletlogin', userInfoData, 'post', function(loginrlt) {
        let sessionKey = loginrlt.data.data.sessionKey;
        wx.setStorageSync('sessionKey', sessionKey)
        if (loginrlt.data.data.phone) {
          let api_token = loginrlt.data.data.api_token;
          let phone = loginrlt.data.data.phone;
          let uid = loginrlt.data.data.uid;
          wx.setStorageSync('api_token', api_token)
          wx.setStorageSync('phone', phone)
          wx.setStorageSync('uid', uid)
          app.globalData.api_token = api_token
          app.globalData.uid = uid
          app.globalData.userInfo.phone = phone
          if (!loginrlt.data.data.unionid) {
            wx.navigateTo({
              url: '/pages/index/addunionid'
            })
          }
          data.api_token = api_token
          wxAjax(url, data, method, fun)
        } else {
          wx.getSetting({
            success(scope) {
              if (!scope.authSetting['scope.userInfo']) {
                wx.navigateTo({
                  url: '/pages/index/getSetting'
                })
              } else {
                wx.navigateTo({
                  url: '/pages/index/register',
                })
              }
            }
          })
        }
      })
    }
  })
}
//ajax 请求
const wxRequest = (url, data, method, fun) => {
  data = Object.assign({
    Sign: 'RootSign',
    p: "w",
  }, data);
  wx.request({
    // url: 'http://47.105.71.75/api/' + url,
    url: 'https://applite.muspace.net/api/' + url,
    data: data,
    method: method,
    header: {
      'Accept': 'application/json' // 默认值
    },
    success: function(res) {
      if (res.data.status == 1) {
        fun(res)
      } else if (res.data.status === 405) {
        wx.showModal({
          title: '提示',
          content: '登录已失效，请重新登录',
          showCancel: false,
          success(res) {
            if (res.confirm) {
              wx.navigateTo({
                url: '/pages/index/login'
              })
            }
          }
        })
      } else {
        wx.showToast({
          title: res.data.msg,
          icon: 'none',
          duration: 8000
        })
      }
    }
  })
}
/*函数节流*/
function throttle(fn, interval) {
  var enterTime = 0; //触发的时间
  var gapTime = interval || 300; //间隔时间，如果interval不传，则默认300ms
  return function() {
    var context = this;
    var backTime = new Date(); //第一次函数return即触发的时间
    if (backTime - enterTime > gapTime) {
      fn.call(context, arguments);
      enterTime = backTime; //赋值给第一次触发的时间，这样就保存了第二次触发的时间
    }
  };
}

/*函数防抖*/
var timer;
function debounce(fn, interval) {
  var gapTime = interval || 800; //间隔时间，如果interval不传，则默认1000ms
  return function() {
    if (timer){
      clearTimeout(timer);
    }
    var context = this;
    var args = arguments; //保存此处的arguments，因为setTimeout是全局的，arguments不是防抖函数需要的。
    timer = setTimeout(function() {
      fn.apply(context, args);
    }, gapTime);
  };
}
//时间格式化
const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()
  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}


const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

//1.加密解密方法使用：
// var base = new Base64();
// var result = base.encode(str);

//2.解密  
// var result2 = base.decode(result);
//解密传参
function base64() {
  var _keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";

  // public method for encoding  
  this.encode = function(input) {
    var output = "";
    var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
    var i = 0;
    input = _utf8_encode(input);
    while (i < input.length) {
      chr1 = input.charCodeAt(i++);
      chr2 = input.charCodeAt(i++);
      chr3 = input.charCodeAt(i++);
      enc1 = chr1 >> 2;
      enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
      enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
      enc4 = chr3 & 63;
      if (isNaN(chr2)) {
        enc3 = enc4 = 64;
      } else if (isNaN(chr3)) {
        enc4 = 64;
      }
      output = output +
        _keyStr.charAt(enc1) + _keyStr.charAt(enc2) +
        _keyStr.charAt(enc3) + _keyStr.charAt(enc4);
    }
    return output;
  }

  // public method for decoding  
  this.decode = function(input) {
    var output = "";
    var chr1, chr2, chr3;
    var enc1, enc2, enc3, enc4;
    var i = 0;
    input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
    while (i < input.length) {
      enc1 = _keyStr.indexOf(input.charAt(i++));
      enc2 = _keyStr.indexOf(input.charAt(i++));
      enc3 = _keyStr.indexOf(input.charAt(i++));
      enc4 = _keyStr.indexOf(input.charAt(i++));
      chr1 = (enc1 << 2) | (enc2 >> 4);
      chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
      chr3 = ((enc3 & 3) << 6) | enc4;
      output = output + String.fromCharCode(chr1);
      if (enc3 != 64) {
        output = output + String.fromCharCode(chr2);
      }
      if (enc4 != 64) {
        output = output + String.fromCharCode(chr3);
      }
    }
    output = _utf8_decode(output);
    return output;
  }

  // private method for UTF-8 encoding  
  var _utf8_encode = function(string) {
    string = string.replace(/\r\n/g, "\n");
    var utftext = "";
    for (var n = 0; n < string.length; n++) {
      var c = string.charCodeAt(n);
      if (c < 128) {
        utftext += String.fromCharCode(c);
      } else if ((c > 127) && (c < 2048)) {
        utftext += String.fromCharCode((c >> 6) | 192);
        utftext += String.fromCharCode((c & 63) | 128);
      } else {
        utftext += String.fromCharCode((c >> 12) | 224);
        utftext += String.fromCharCode(((c >> 6) & 63) | 128);
        utftext += String.fromCharCode((c & 63) | 128);
      }

    }
    return utftext;
  }

  // private method for UTF-8 decoding  
  var _utf8_decode = function(utftext) {
    var string = "";
    var i = 0;
    var c2 = 0;
    var c3 = 0
    var c = 0;
    while (i < utftext.length) {
      c = utftext.charCodeAt(i);
      if (c < 128) {
        string += String.fromCharCode(c);
        i++;
      } else if ((c > 191) && (c < 224)) {
        c2 = utftext.charCodeAt(i + 1);
        string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
        i += 2;
      } else {
        c2 = utftext.charCodeAt(i + 1);
        c3 = utftext.charCodeAt(i + 2);
        string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
        i += 3;
      }
    }
    return string;
  }
}
//身份证号正则
function reg_card_num(id_num) {
  let reg = /^(^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$)|(^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[Xx])$)$/;
  if (reg.test(id_num)) {
    if (id_num.length == 18) {
      var idCardWi = new Array(7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2); //将前17位加权因子保存在数组里
      var idCardY = new Array(1, 0, 10, 9, 8, 7, 6, 5, 4, 3, 2); //这是除以11后，可能产生的11位余数、验证码，也保存成数组
      var idCardWiSum = 0; //用来保存前17位各自乖以加权因子后的总和
      for (var i = 0; i < 17; i++) {
        idCardWiSum += id_num.substring(i, i + 1) * idCardWi[i];
      }
      var idCardMod = idCardWiSum % 11; //计算出校验码所在数组的位置
      var idCardLast = id_num.substring(17); //得到最后一位身份证号码

      //如果等于2，则说明校验码是10，身份证号码最后一位应该是X
      if (idCardMod == 2) {
        if (idCardLast == "X" || idCardLast == "x") {
          return true
        } else {
          return false;
        }
      } else {
        //用计算出的验证码与最后一位身份证号码匹配，如果一致，说明通过，否则是无效的身份证号码
        if (idCardLast == idCardY[idCardMod]) {
          return true
        } else {
          return false;
        }
      }
    }
  } else {
    return false;
  }
}
//手机号正则
function reg_phone(phone) {
  let phongReg = /^1[23456789]\d{9}$/;
  let result = phongReg.test(phone)
  return result
}
module.exports = {
  formatTime,
  wxAjax,
  base64,
  reg_card_num,
  reg_phone,
  throttle,
  debounce
}