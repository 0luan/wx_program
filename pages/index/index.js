Page({

  /**
   * 页面的初始数据
   */
  data: {
    category_id: 1, // 0显示总目录，否则显示对应章节目录
    category_list: [
      { id: 1, title: "AAAAA" },
      { id: 1, title: "AAAAA" },
      { id: 1, title: "AAAAA" },
      { id: 1, title: "AAAAA" },
    ],
    question_list: [
      { id: 1, category_id: 1, title: "BBBBBBB", img: "" },
      { id: 1, category_id: 1, title: "BBBBBBB", img: "" },
      { id: 1, category_id: 1, title: "BBBBBBB", img: "" },
      { id: 1, category_id: 1, title: "BBBBBBB", img: "" },
      { id: 1, category_id: 1, title: "BBBBBBB", img: "" },
      { id: 1, category_id: 1, title: "BBBBBBB", img: "" },
      { id: 1, category_id: 1, title: "BBBBBBB", img: "" },
      { id: 1, category_id: 1, title: "BBBBBBB", img: "" },
      { id: 1, category_id: 1, title: "BBBBBBB", img: "" },
      { id: 1, category_id: 1, title: "BBBBBBB", img: "" },
      { id: 1, category_id: 1, title: "BBBBBBB", img: "" },
    ],
    progress_info: "TESTTESTTEST",
    
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
      url: "http://127.0.0.1:8080/api/",
      data: "",
      method: "GET",
      dataType: "json",
      complete(res) {
        console.log(res);
        if (res.statusCode == 200) {

        } else {

        }
      }
    });
  },
  loadCategory: function(id) {
    wx.request({
      url: "http://127.0.0.1:8080/api/",
      data: "",
      method: "GET",
      dataType: "json",
      complete(res) {
        console.log(res);
        if (res.statusCode == 200) {

        } else {

        }
      }
    });
  },

  onQuestionDone: function(id) {

  },

  onCategorySelect: function(e) {
    let id = 1;
    this.setData({
      category_id: id,
    })
  },

  onQuestionSelect: function(e) {
    let id = 1;
    wx.navigateTo({
      url: '../../pages/inner/inner?id=' + id
    })
  }
})