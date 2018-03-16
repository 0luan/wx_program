const READ_MODE = 0; // 看谱模式
const WRITE_MODE = 1; // 打谱模式
const TRYING_MODE = 2; // 试下模式

var mode = WRITE_MODE;
var show_foul = false;  // 显示禁手


Page({

  /**
   * 页面的初始数据
   */
  data: {
    cur_index:0,
    move_list:[],
    stones:[],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.initStones();
    this.setStoneStars();
    this.setData(this.data);
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

  initStones: function () {
    for (var i = 0; i != 15; ++i) {
      var row = [];
      for (var j = 0; j != 15; ++j) {
        row.push({
          is_empty: true,
          is_star: false,
          is_move: false,
          is_hide: false,
          is_branch: false,
          is_text: false,
          is_black: false,
          is_white: false,
          text: "",
        });
      }
      this.data.stones.push(row);
    }
  },

  // 设置棋盘的五个星位
  setStoneStars: function() {
    this.data.stones[3][3].is_star = true;
    this.data.stones[3][11].is_star = true;
    this.data.stones[7][7].is_star = true;
    this.data.stones[11][3].is_star = true;
    this.data.stones[11][11].is_star = true;
  },

  addStone: function(x, y) {
    if (this.data.cur_index > 254) {
      return;
    }

    var stone = this.data.stones[y][x];

    if (!stone.is_empty) {
      return;
    }

    stone.is_empty = false;
    stone.is_move = true;
    stone.is_hide = false;
    stone.is_black = (this.data.cur_index % 2 == 0);
    stone.is_white = !stone.is_black;
    stone.text = "" + (this.data.cur_index + 1);


    for (var i = this.data.cur_index; i < this.data.move_list.length; ++i) {
      var point = this.data.move_list[i];
      var reset_stone = this.data.stones[point.y][point.x];
      reset_stone.is_empty = true;
      reset_stone.is_move = false;
      reset_stone.is_hide = false;
      reset_stone.is_black = false;
      reset_stone.is_white = false;
      reset_stone.text = "";
    }
    console.log("before remove");
    console.log(this.data.move_list);
    this.data.move_list.splice(this.data.cur_index, this.data.move_list.length - this.data.cur_index);
    console.log("after remove");
    console.log(this.data.move_list);
    this.data.move_list.push({"x":x, "y":y});
    this.setData({
      //str:stone,
      stones: this.data.stones,
      "cur_index": ++this.data.cur_index,
    });
    console.log("finished add");
    console.log(this.data.move_list);

  },

  goNextMove: function() {
    if (this.data.cur_index == this.data.move_list.length) {
      return;
    }

    var point = this.data.move_list[this.data.cur_index];
    var stone = this.data.stones[point.y][point.x];

    if (stone.is_empty) {
      console.error("trying to hide a empty stone");
      return;
    }

    stone.is_hide = false;
    this.setData({
      stones: this.data.stones,
      "cur_index": ++this.data.cur_index,
    });
  },

  goPrevMove: function() {
    if (this.data.cur_index == 0) {
      return;
    }

    var point = this.data.move_list[--this.data.cur_index];
    var stone = this.data.stones[point.y][point.x];

    if (stone.is_empty) {
      console.error("trying to hide a empty stone");
      return;
    }

    stone.is_hide = true;
    this.setData({
      stones: this.data.stones,
      "cur_index": this.data.cur_index,
    });
  },

  checkStatus: function() {

  },

  onBtnClick: function (event) {
    console.log(event);
    switch (event.target.id) {
      case "btn-gobegin":

        break;
      case "btn-goprev":
        this.goPrevMove();
        break;
      case "btn-gonext":
        this.goNextMove();
        break;
      case "btn-goend":

        break;

    }
  },


  onBoardClick: function(event) {
    var x = event.currentTarget.dataset.x;
    var y = event.currentTarget.dataset.y;
    if (mode == WRITE_MODE) {
      this.addStone(x, y);
    }
  },



})