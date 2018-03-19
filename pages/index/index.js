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
      { name: 'USA', value: '美国' },
      { name: 'CHN', value: '中国', checked: 'true' },
      { name: 'BRA', value: '巴西' },
      { name: 'JPN', value: '日本' },
      { name: 'ENG', value: '英国' },
      { name: 'TUR', value: '法国' },
    ],
    radio_show_num: [
      { name: 'USA', value: '美国' },
      { name: 'CHN', value: '中国', checked: 'true' },
      { name: 'BRA', value: '巴西' },
      { name: 'JPN', value: '日本' },
      { name: 'ENG', value: '英国' },
      { name: 'TUR', value: '法国' },
    ]
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

  onShowSettings: function() {

  },

})