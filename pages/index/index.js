Page({

  /**
   * 页面的初始数据
   */
  data: {
    category_id: 0, // 0显示总目录，否则显示对应章节目录
    category_list: [
    ],
    question_list: [
    ],
    // question_list: [
    //   { id: 1, category_id: 1, title: "BBBBBBB", img: "" },
    //   { id: 1, category_id: 1, title: "BBBBBBB", img: "" },
    //   { id: 1, category_id: 1, title: "BBBBBBB", img: "" },
    //   { id: 1, category_id: 1, title: "BBBBBBB", img: "" },
    //   { id: 1, category_id: 1, title: "BBBBBBB", img: "" },
    //   { id: 1, category_id: 1, title: "BBBBBBB", img: "" },
    //   { id: 1, category_id: 1, title: "BBBBBBB", img: "" },
    //   { id: 1, category_id: 1, title: "BBBBBBB", img: "" },
    //   { id: 1, category_id: 1, title: "BBBBBBB", img: "" },
    //   { id: 1, category_id: 1, title: "BBBBBBB", img: "" },
    //   { id: 1, category_id: 1, title: "BBBBBBB", img: "" },
    // ],
    item_list_title: "",
    note_info: "更多题目正在录入中，敬请期待",
    progress_info: "已完成(0/0）",    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    getApp().setQuestionListener(this);
    this.loadCategoryList();
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
    getApp().setQuestionListener(null);
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    if (this.data.category_id == 0) {
      this.loadCategoryList();
    } else {
      this.loadCategory(this.data.category_id);
    }
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  loadCategoryList: function() {
    wx.request({
      url: "https://www.0luan.top/api/?op=list&type=category",
      data: "",
      method: "GET",
      dataType: "json",
      complete: (res) => {
        wx.stopPullDownRefresh();
        console.log(res);
        if (res.statusCode == 200) {
          let data = res.data;
          if (data.state) {
            this.setData({
              category_list: data.category_list,
            });
          } else {
            wx.showModal({
              title: "错误",
              content: "获取目录列表失败，请重试",
            });
          }
        } else {
          wx.showModal({
            title: "错误",
            content: "获取目录列表失败，请重试",
          });
        }
      }
    });
  },
  loadCategory: function(id) {
    wx.request({
      url: "https://www.0luan.top/api/?op=list&type=question&category_id=" + id,
      data: "",
      method: "GET",
      dataType: "json",
      complete: (res) => {
        wx.stopPullDownRefresh();
        console.log(res);
        if (res.statusCode == 200) {
          let data = res.data;
          if (data.state) {
            let done_question_id = getApp().getProgressInfo(id);
            done_question_id = done_question_id ? done_question_id.slice(0) : [];
            let result_list = [];
            let progress_info = "已完成(" + done_question_id.length + "/" + data.question_list.length + ")";
            for (var i = 0; i < data.question_list.length; ++i) {
              let item = data.question_list[i];
              let index = done_question_id.indexOf(item.id);
              if (index != -1) {
                item.done = true;
                done_question_id.splice(index, 1);
              }
              result_list.push(item);
            }
            getApp().setCurCategory(id, result_list);
            this.setData({
              question_list: result_list,
              progress_info: progress_info,
            });
          } else {
            wx.showModal({
              title: "错误",
              content: "获取目录列表失败，请重试",
            });
          }
        } else {
          wx.showModal({
            title: "错误",
            content: "获取目录列表失败，请重试",
          });
        }
      }
    });
  },

  onReturnBtn: function() {
    this.setData({
      category_id: 0,
    });
    wx.setNavigationBarTitle({
      title: "围棋死活宝典",
    })
  },
  onContinueBtn: function() {
    for (let i = 0; i != this.data.question_list.length; ++i) {
      if (this.data.question_list[i].done) continue;
      wx.navigateTo({
        url: '../../pages/inner/inner?category_id=' + this.data.category_id + '&id=' + this.data.question_list[i].id + '&index=' + i,
      })
      break;
    }
  },

  onQuestionDone: function(category_id, index, id) {
    console.log('onQuestionDone', category_id, index, id);
    if (this.data.category_id != category_id)
      return;
    let done_question_id = getApp().getProgressInfo(category_id) || [];
    //let result_list = getApp().getCurCategoryList();
    let progress_info = "已完成(" + done_question_id.length + "/" + this.data.question_list.length + ")";
    let key = "question_list[" + (index) +"]";
    let obj = this.data.question_list[index];
    obj.done = true;
    this.setData({
      [key] : obj,
      progress_info: progress_info,
    });
  },

  onCategorySelect: function(e) {
    let id = e.currentTarget.dataset.categoryId;
    let title = e.currentTarget.dataset.title;
    this.setData({
      category_id: id,
    });
    wx.setNavigationBarTitle({
      title: title//页面标题为路由参数
    })
    this.loadCategory(id);
  },

  onQuestionSelect: function(e) {
    if (this.data.category_id == 0) return;
    let id = e.currentTarget.dataset.questionId;
    let index = e.currentTarget.dataset.questionIndex;
    wx.navigateTo({
      url: '../../pages/inner/inner?category_id=' + this.data.category_id + '&id=' + id + '&index=' + index,
    })
  }
})