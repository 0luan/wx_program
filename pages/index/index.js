import {Board} from "../../renju/board.js"
import {RenjuController} from "../../renju/controller.js"

const NORMAL_MODE = 0; // 顺序落子
const FREE_MODE = 1; // 自由摆局

Page({
  /**
   * 页面的初始数据
   */
  data: {
    mode: NORMAL_MODE,
    color: 1, // 0-white, 1-black
  },

  b: Board(),
  controller: RenjuController(),

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.b.init("board");
    this.controller.init(this.b);
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
    this.b.selectPoint(pt.x, pt.y);
  },

  onConfirm: function() {
    var pt = this.b.getSelectedPoint();
    this.b.cancelSelect();
    var stone = this.controller.getStone(pt.x, pt.y);
    if (stone) {

    } else {
      this.controller.addStone(pt.x, pt.y, this.data.color);
      if (this.data.color == 1) this.data.color = 0;
      else this.data.color = 1;
    }
  
  },

})