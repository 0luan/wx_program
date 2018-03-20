import {Board} from "../../renju/board.js"
import {RenjuController} from "../../renju/controller.js"

const NORMAL_MODE = 0; // 顺序落子
const FREE_MODE = 1; // 自由摆局
const NOTE_MODE = 2; // 标注模式

const SHOW_NUM = 0; // 显示全部数字
const SHOW_LAST_5 = 1; // 显示最后5步
const SHOW_NONE_NUM = 2; // 不显示数字

Page({
  /**
   * 页面的初始数据
   */
  data: {
    mode: NORMAL_MODE,
    mode_text:"打谱模式",
    color: 1, // 0-white, 1-black
    showSettings: true,
    radio_modes: [
      { name: NORMAL_MODE, value: '顺序落子', checked: 'true' },
      { name: FREE_MODE, value: '自由摆局'},
      { name: NOTE_MODE, value: '标注模式' },
    ],
    radio_show_num: [
      { name: SHOW_NUM, value: '显示全部数字', checked: 'true' },
      { name: SHOW_LAST_5, value: '显示最后5步'},
      { name: SHOW_NONE_NUM, value: '不显示数字' },
    ],
    show_coordinate: true,
    selected_point: false,
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

  onMoveUpClick: function (e) {
    this.b.moveUp();
  },
  onMoveRightClick: function (e) {
    this.b.moveRight();
  },
  onMoveLeftClick: function (e) {
    this.b.moveLeft();
  },
  onMoveDownClick: function (e) {
    this.b.moveDown();
  },

  onGoBeginClick: function() {
    this.controller.goBegin();
  },
  onGoPrevClick: function () {
    this.controller.goPrev();
  },
  onGoNextClick: function () {
    this.controller.goNext();
  },
  onGoEndClick: function () {
    this.controller.goEnd();
  },

  onConfirm: function() {
    var pt = this.b.getSelectedPoint();
    //this.b.cancelSelect();
    var stone = this.controller.getStone(pt.x, pt.y);
    if (stone) {

    } else {
      this.controller.addStone(pt.x, pt.y, this.data.color);
      if (this.data.color == 1) this.data.color = 0;
      else this.data.color = 1;
    }
  
  },

  onGenerateImage: function() {
    var win_width = wx.getSystemInfoSync().windowWidth;
    wx.canvasToTempFilePath({
      x: 0,
      y: 0,
      width: win_width,
      height: win_width,
      destWidth: win_width,
      destHeight: win_width,
      canvasId: 'board',
      success: function (res) {
        console.log(res);
      }
    });
  },

  onShowSettings: function() {
    this.setData({"showSettings":true});
  },

  onSettingsConfirm: function() {

  },

  onSettingsCancel: function() {
    this.setData({ "showSettings": false });
  }

})