// pages/go/go.js
import { GoController } from "../../go/controller.js"
import { GoJudger } from "../../go/go_judger.js"

var controller = GoController();

var content = '{"content":"content","board":{"info":{},"answer":[{"x":17,"y":18,"text":""},{"x":16,"y":18,"text":""},{"x":14,"y":18,"text":""},{"x":13,"y":18,"text":""},{"x":13,"y":17,"text":""}],"stone":{"black":[{"x":18,"y":17},{"x":17,"y":17},{"x":16,"y":17},{"x":15,"y":17},{"x":14,"y":17}],"white":[{"x":17,"y":14},{"x":17,"y":16},{"x":16,"y":16},{"x":15,"y":16},{"x":14,"y":16},{"x":13,"y":16},{"x":11,"y":17},{"x":11,"y":16},{"x":12,"y":17}]},"predict":{"R19":{"response":{"x":16,"y":18,"text":""},"O19":{"response":{"x":13,"y":18,"text":""},"N18":{"correct":true}}},"O19":{"response":{"x":15,"y":18,"text":""},"R19":{"response":{"x":13,"y":17,"text":""},"N19":{"response":{"x":12,"y":18,"text":""}}}},"N18":{"response":{"x":14,"y":18,"text":"","correct":false}}}}}';
var cur_page_index = 0;
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
    let id = options.id;
    this.loadContent(content);
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

  updateMode: function() {

  },

  onBoardClick: function (e) {
    console.log(e);
    let pt = controller.pointToXY(e.detail.x - e.target.offsetLeft, e.detail.y - e.target.offsetTop);
    
    // let result = r.addStone(pt.x, pt.y, color);
    // console.log(result);
    // if (result === false) {
    //   console.log('add stone error');
    // } else {
    //   b.addStone(pt.x, pt.y, color, "");
    //   for (let i = 0; i != result.length; ++i) {
    //     b.removeStone(result[i].x, result[i].y);
    //   }
    // }
    // if (color == 0) color = 1;
    // else color = 0;
    controller.onBoardClick(pt.x, pt.y);
  },

  loadContent: function(content) {
    content = JSON.parse(content);
    var content_type = content.type;
    var board_info = content.board;
    if (board_info) {
      console.log(board_info.predict);
      controller.init(board_info.board_clip_pos || 9, board_info.stone, board_info.next_move_color, board_info.answer, board_info.predict);
      this.setData({
        "enable_answer_mode": !!board_info.moves,
        "enable_battle_mode": !!board_info.predict,
      });
    }
    this.setData({
      "content_text":content.content
    });
  },

  onExit: function() {
    wx.navigateBack();
  },

  onRestart: function() {

  },

  onUndo: function () {

  },

  onShowAnswer: function () {

  },

  onShare: function () {

  },

  onTryMove: function() {

  },

  onPrevMove: function() {
    let text = controller.prevMove();
    this.setData({
      "content_text": text == null ? JSON.parse(content).content : text,
    });
  }, 
  onNextMove: function() {
    let text = controller.nextMove();
    this.setData({
      "content_text": text == null ? content.content : text,
    });
  }
});