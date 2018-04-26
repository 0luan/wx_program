Page({

  /**
   * 页面的初始数据
   */
  data: {
    category_id: 0, // 0显示总目录，否则显示对应章节目录
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
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
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

  }
})