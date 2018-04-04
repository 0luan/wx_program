// pages/go/go.js
import { GoController } from "../../go/controller.js"
import { GoJudger } from "../../go/go_judger.js"

var controller = GoController();

var content = '{"type":"normal","content":"吃子技巧－枷如何吃掉白子","board":{"predict":{"E3":{"respond":{"x":3,"y":2,"text":"好像有点厉害哦"},"next":{"D2":{"respond":{"x":4,"y":3,"text":"看来我要不行了"},"next":{"F4":{"respond":{"x":-1,"y":-1,"text":"恭喜你答对了"}}}}}}},"moves":[{"x":4,"y":2,"color":1,"text":"简单一罩，白棋就跑不了"},{"x":3,"y":2,"color":0,"text":"不管怎么样，白棋都是无法冲出去的"},{"x":3,"y":1,"color":1,"text":"黑棋简单挡住"},{"x":4,"y":3,"color":0,"text":"同样，这边也是冲不出去的"},{"x":5,"y":3,"color":1,"text":"只能被黑棋吃掉"}],"board":{"size":7,"type":"all"},"stone":{"black":[{"x":2,"y":2},{"x":2,"y":3},{"x":3,"y":4},{"x":4,"y":4}],"white":[{"x":3,"y":3},{"x":5,"y":2}]}}}';
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
    console.log(pt);
    
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
      controller.init(board_info.board_size, board_info.stone, board_info.moves, board_info.predict);
      this.setData({
        "enable_answer_mode": !!board_info.moves,
        "enable_battle_mode": !!board_info.predict,
      });
    }
    this.setData({
      "content_text":content.content
    });
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