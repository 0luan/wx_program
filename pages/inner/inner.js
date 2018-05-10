// pages/go/go.js
import { GoController } from "../../go/controller.js"
import { GoJudger } from "../../go/go_judger.js"

var controller = GoController();

var cached_content;
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
    let id = parseInt(options.id);
    let category_id = parseInt(options.category_id);
    let index = parseInt(options.index);

    this.setData({
      "id": id,
      "index": index,
      "category_id": category_id,
    });
    this.fetchData(id);
  },

  fetchData: function(id) {
    cached_content = {};
    console.log('fetchData, id:', id);
    wx.request({
      url: "https://www.0luan.top/api/?op=get&id=" + id,
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
    return {
      title: '围棋死活宝典',
      desc: cached_content.content,
      path: 'pages/inner/inner?category_id=' + this.data.category_id + '&id=' + this.id + '&index=' + this.data.index,
    }
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
    cached_content = content;
    try {
      var content_type = content.type;
      var board_info = content.board;
      if (board_info) {
        console.log(board_info.predict);
        controller.init(board_info.info.clip_pos || 9, 
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
    let obj = getApp().getNextQuestion(this.data.category_id, this.data.index);
    if (obj && obj.next_question_id != -1) {
      this.setData({
        "id": obj.next_question_id,
        "index": obj.index,
        "category_id": obj.category_id,
      });
      this.fetchData(obj.next_question_id);
    } else {
      wx.showModal({
        title: "提示",
        content: "这已经是最后一题了！",
      });
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
    this.loadContent(cached_content);
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