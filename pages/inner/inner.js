// pages/go/go.js
import { GoController } from "../../go/controller.js"
import { GoJudger } from "../../go/go_judger.js"

var controller = GoController();

var content = '{"title":"title","content":"content","board":{"info":{"clip_pos":9},"answer":[{"x":17,"y":17,"text":""},{"x":16,"y":16,"text":""},{"x":15,"y":18,"text":""},{"x":16,"y":18,"text":""},{"x":14,"y":18,"text":""},{"x":16,"y":17,"text":""},{"x":17,"y":14,"text":""}],"stone":{"black":[{"x":15,"y":17},{"x":15,"y":16},{"x":16,"y":15},{"x":16,"y":14}],"white":[{"x":16,"y":13},{"x":16,"y":11},{"x":15,"y":13},{"x":15,"y":15},{"x":14,"y":15},{"x":14,"y":16},{"x":14,"y":17},{"x":11,"y":16}]},"predict":{"R18":[{"response":{"x":16,"y":16,"text":""},"P19":[{"response":{"x":16,"y":18,"text":""},"O19":[{"response":{"x":16,"y":17,"text":""},"R15":{"correct":true}}]}]},{"response":{"x":16,"y":17,"text":""},"R19":[{"response":{"x":16,"y":18,"text":""},"R17":[{"response":{"x":16,"y":16,"text":""},"R15":[{"response":{"x":17,"y":15,"text":""},"R14":{"correct":true}}]}]}]}],"R17":[{"response":{"x":17,"y":17,"text":""},"S18":[{"response":{"x":16,"y":16,"text":"","correct":false}}]}]}}}';
var cur_page_index = 0;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    right_answer: false,
    show_navigate_panel: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let id = options.id;
    let category_id = options.category_id;
    let index = options.index;

    this.setData({
      "id": id,
      "index": index,
      "category_id": category_id,
    })
    this.loadContent(content);
  },

  fetchData: function(id) {
    wx.request({
      url: "http://39.108.150.51/api/?op=get&id=" + id,
      data: "",
      method: "GET",
      dataType: "json",
      complete: (res) => {
        wx.stopPullDownRefresh();
        console.log(res);
        if (res.statusCode == 200) {
          let data = res.data;
          if (data.state === false) {
            wx.showModal({
              title: "错误",
              content: "获取内容失败，请重试",
            });
          } else {
            this.loadContent(data);
          }
        } else {
          wx.showModal({
            title: "错误",
            content: "获取内容失败，请重试",
          });
        }
      }
    });
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
    controller.onBoardClick(pt.x, pt.y, (text) => {
      this.setData({
        content_text: text,
      })
    });
  },

  loadContent: function(content) {
    try {
      var content_type = content.type;
      var board_info = content.board;
      if (board_info) {
        console.log(board_info.predict);
        controller.init(board_info.info.board_clip_pos || 9, 
          board_info.stone, 
          board_info.info.next_move_color, 
          board_info.answer, board_info.predict, 
          (text) => {
          this.setData({
            "content_text": text,
          });
        });
        
        this.setData({
          "right_answer": false,
          "title": content.title,
          "content": content.content,
        });
      }
      this.setData({
        "content_text":content.content
      });
    } catch (e) {
      wx.showModal({
        title: "错误",
        content: "解析内容出错",
      });
    }
  },

  goNextQuestion: function() {
    let obj = getApp().getNextQuestion(category_id, index);
    if (obj && obj.next_question_id != -1) {

    } else {

    }
  },

  onAnswerRight: function(right) {
    this.setData({"right_answer":right});
    if (right) {
      getApp().onQuestionDone(this.data.category_id, this.data.index, this.data.id);
    }
  },

  onExit: function() {
    wx.navigateBack();
  },

  onRestart: function() {
    this.onHideAnswer();
  },

  onUndo: function () {
    controller.unDo();
  },


  onShare: function () {

  },


  onShowAnswer: function () {
    controller.setAnswerMode(true);
    this.setData({
      show_navigate_panel: true,
    });
  },
  onHideAnswer: function () {
    controller.setAnswerMode(false);
    this.loadContent(content);
    this.setData({
      show_navigate_panel: false,
    });
  },
  onPrevMove: function() {
    let has_prev = controller.prevMove();

  }, 
  onNextMove: function() {
    let has_next = controller.nextMove();
  }
});