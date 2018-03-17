import {Board} from "../../renju/board.js"

Page({
  /**
   * 页面的初始数据
   */
  data: {

  },

  b: Board(),

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.b.init("board");
    this.b.addStone(1, 1, 1, 1);
    this.b.addStone(1, 2, 0, 1);
    this.b.addStone(4, 1, 1, 1);
    this.b.addStone(4, 2, 0, 1);
    this.b.addStone(4, 5, 1, 1);
    this.b.addStone(4, 7, 0, 1);
    this.b.addStone(2, 1, 1, 1);
    this.b.addStone(4, 3, 1, 1);
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

  },

  onBoardClick: function(e) {
    console.log(e);
    var pt = this.b.pointToXY(e.detail.x, e.detail.y);
    console.log(pt);
    //this.b.addStone(pt.x, pt.y, 0, 'A');
    this.b.removeStone(pt.x, pt.y);
  }
})