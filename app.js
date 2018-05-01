//app.js
App({
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })

    // 获取做题进度
    wx.getStorage({
      key: "progress_info",
      complete(res) {
        console.log(res);
      }
    });
  },
  globalData: {
    userInfo: null,
    question_listener: null,
    cur_category_id: 0,
    cur_category_list: [],

    progress_info: {},

  },

  setCurCategory: function(id, list) {

  },
  setQuestionListener: function(listener) {
    this.globalData.question_listener = listener;
  },
  onQuestionDone: function(category_id, id) {
    console.log('app.onQuestionDone', category_id, id);
    if (this.globalData.progress_info[category_id] == undefined)
      this.globalData.progress_info[category_id] = [];

    if (this.globalData.progress_info[category_id].indexOf(id) == -1) {
      this.globalData.progress_info[category_id].push(id);
      if (this.globalData.question_listener) {
        console.log('app.onQuestionDone notify', category_id, id);
        this.globalData.question_listener.onQuestionDone(category_id, id);
      }
      wx.setStorage({
        key:"progress_info",
        data: this.globalData.progress_info,
      });
    }
  },
  getNextQuestion: function(category_id, index) {
    if (this.globalData.cur_category_id != category_id
      || !this.globalData.cur_category_list 
      || ++index >= this.globalData.cur_cagegory_list.length)
      return {
        "category_id": category_id,
        "index": -1,
        "id": -1,
      }
    else 
      return {
        "category_id": category_id,
        "index": index,
        "id": this.globalData.cur_category_list[index],     
      }
  }

})