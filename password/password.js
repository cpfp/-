var network = require('../../utils/http.js');
var app = getApp();

Page({
  data: {
    id5: "num_7",
    id6: "num_8",
    id7: "num_9",
    id8: "mul", //乘号
    id9: "num_4",
    id10: "num_5",
    id11: "num_6",
    id12: "sub", //减号
    id13: "num_1",
    id14: "num_2",
    id15: "num_3",
    id16: "reverse",
    id17: "num_0",
    id18: "back", //小于号
    result: "",
    flag: false,
    firstPass: '',
    againPass: '',
    passType: ""
  },
  onLoad(options) {
    console.log(options);
    if (options.type == 'input') {
      this.setData({
        passType: options.type
      })
    }
  },
  clickButton(e) {
    var btnValue = e.target.id; //获取按钮值
    var res = this.data.result; //获取结果值
    // 当数字为1-9，进行字符串切割
    if (btnValue >= "num_0" && btnValue <= "num_9") {
      var num = btnValue.split('_')[1];
      if (res == "0" || res.charAt(res.length - 1) == '∞') {
        res = num;
      } else {
        res = res + num;
      }
    }
    //清空所有数据
    if (btnValue == 'clear') {
      res = " ";
      return;
    } else if (btnValue == 'back') { //回退
      var length = res.length;
      if (length > 1) {
        res = res.substr(0, length - 1); //如果长度大于1舍去最后一个字符
      } else {
        res = "";
      }
    } 
    if (btnValue == 'reverse'){
      res = "";
    }
    //  当长度为4并且是再输一次是的时候
    var strLength = res.length;
    console.log(res);
    if (strLength >= 4 && this.data.flag) {
      this.setData({
        againPass: res
      })
      console.log(this.data.againPass);
      console.log(this.data.firstPass);
      this.setPassword();
    }
    //  第一次输入的值
    if (strLength >= 4) {
      if (this.data.passType == 'input') { //是输入密码而不是设置密码的时候
        this.setData({
          firstPass: res,
          flag:false
        })
        this.enterIndex();
        return
      }

      this.setData({
        flag: true,
        firstPass: res
      })
      res = '';
    }
    this.setData({
      result: res,
    });
  },
  // 通过密码锁屏进入
  enterIndex() {
    const data = {
      'openid': app.globalData.my_openid,
      'screensaver': this.data.firstPass,
      'lock_type': 1
    }
    network.ajax('lock/pass_login', 'GET', data, (res) => {
      if (res.data.code == 0) {
        wx.showModal({
          title: '提示',
          content: res.data.msg,
          success: () => {
            res = '';
            this.setData({
              firstPass: '',
              result:res,
            })
          }
        });
        return;
      }
      wx.switchTab({
        url: '../index/index',
      })
    })
  },
  // 设置密码锁屏
  setPassword() {
    let data = {
      'openid': app.globalData.my_openid,
      'screensaver': this.data.firstPass,
      're_password': this.data.againPass,
      'lock_type': 1
    };
    wx.showLoading();
    network.ajax('lock/index', 'GET', data, (res) => {
      if (res.statusCode == 200) {
        wx.showToast({
          icon: 'none',
          title: '提示：' + res.data.msg,
          success: () => {
            if (res.data.code == 0) {
              this.setData({
                flag: false,
                firstPass: '',
                againPass: ''
              })
              return;
            }
            wx.hideLoading();
            wx.switchTab({
              url: '../ourselfs/ourselfs',
            })
          }
        })
      }
    })
  }
})