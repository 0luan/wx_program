// pages/go/go.js
import { Board } from "../../go/board.js"
import { GoJudger } from "../../go/go_judger.js"

var b = Board();
var r = GoJudger();
var color = 1;

Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    b.init("board");
    r.init();
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

  onBoardClick: function (e) {
    console.log(e);
    let pt = b.pointToXY(e.detail.x - e.target.offsetLeft, e.detail.y - e.target.offsetTop);
    console.log(pt);
    
    let result = r.addStone(pt.x, pt.y, color);
    console.log(result);
    if (result === false) {
      console.log('add stone error');
    } else {
      b.addStone(pt.x, pt.y, color, "");
      for (let i = 0; i != result.length; ++i) {
        b.removeStone(result[i].x, result[i].y);
      }
    }
    if (color == 0) color = 1;
    else color = 0;
  },
})