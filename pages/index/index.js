import {Board} from "../../renju/board.js"
import {RenjuController} from "../../renju/controller.js"

const NORMAL_MODE = 0; // 顺序落子
const FREE_MODE = 1; // 自由摆局
const NOTE_MODE = 2; // 标注模式

const SHOW_NUM = 0; // 显示全部数字
const SHOW_LAST_5 = 1; // 显示最后5步
const SHOW_NONE_NUM = 2; // 不显示数字

var setting_cache;
var selected_note;

Page({
  /**
   * 页面的初始数据
   */
  data: {
  
  },


  onLoad: function (options) {

  },
  onReady: function () {},
  onShow: function () {},
  onHide: function () {},
  onUnload: function () {},
  onPullDownRefresh: function () {},
  onReachBottom: function () {},
  onShareAppMessage: function () {},

  onFiveSelected: function() {
    wx.navigateTo({url:'../five/five'});
  },
  onGoSelected: function() {
    wx.navigateTo({});
  }
})