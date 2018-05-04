Page({

  /**
   * 页面的初始数据
   */
  data: {
    category_id: 0, // 0显示总目录，否则显示对应章节目录
    category_list: [
      { id: 1, title: "角上死活" },
      { id: 1, title: "进攻部分" },
      { id: 1, title: "防守部分" },
      { id: 1, title: "边上死活" },
    ],
    question_list: [
      { id: 5, category_id: 1, img: "base64,iVBORw0KGgoAAAANSUhEUgAAAGwAAABsCAYAAACPZlfNAAAFjElEQVR4Xu1duXLUQBBtAwZq1wEJZBw5BZkjB14+AttVDkidExBRUERQFKHtT6Bg/4HSgr8Acq4PIKG8HAZEzTICIc/RmmqNZnafMlu9rZ5+0z2v55CWCFdWHljKyloYSwAss04AwABYZh7IzFxEGADLzAOZmYsIA2CZeSAzc6Ui7BfRrERw6ctR5icRnfC067uWOeXA/pOWOeeQeaFlRq4+BMDcnQyAZRaFAAyAWRMeUqJA50CECTgxJnkBYACs/5T4moiuaTPeENF1i0kxI0PiWdx2JUnrlQNsV7M0KD2yrvvqp0pfCjJ9tOslEYnUYT4HZjZfkKy5EynAXC3kpg6JNKXsiKWH264kU6KvS8ZyYkzA1LPAEsES+2eJsXt9zGhGhCHCEGEmD0hFISIMERYnwlyFc2VBKgVvzvagcPbVI4ndj1I4gyX+2UaALQIJTCKDdIB0xCEdvlQvRaNT04MISyDCDohojYiOiGhZ98SCiG4YeiUA6xmwCixTxjCBBsB6Bsy3rtdctMwWsHkpnF0bZ1WK3CaiZ43wizkhgMLZx5Zq9yvAnrf4jbQoCueGRxcmJfp6Ump03GYPSIdGMhfAlLmg9RE3xkjOWz7Rne22I31kyxLnJSUiwjJLiRjDMgNsYVgiCmf3oCBVXKNw9g2+KJztHkqB+i9MSvR11BTAqNuIwtmDWC6AgdZnxhLr/e6m/mMcoXD+rN/BMXQ8K41D6Ts7Owebm5trq6urR8PhcLkoCtrb2yvG4/HfFV6OTK2hnUdzS3usx41a6ukfMGXw/v6+Wo4/dm1sbMxA48g0ftwpYAH2GAEL0NM/YEVRlOvr68YsMJlMaDQaLXFkYgIWYI8RsAA9ooAFFc5lWVpXeA8PD49WVla2y7K0LhhWMjFXgTk2c+wJ1NNv4VyW9rJnOp2qMc0JWCVDRNFWgTk2c+wJ1NPvijMnLXBkkBL/eaDTt7lxBl6OTEzAAuyZH9KhHK0csLW1NaP1g8FgWZGN3d3dY7TeJxOb1rewx0nrW+gRJR0SU1OcQpUj0ymtbzSUYw/ntQ8cPckBFtPRrmdhT0dGezqw4pzZXOLCLK8EFc6GgU9qZTZUD7Zq+9hIRvexVTtm/cR81sKkRF+gpMIAKzux4owVZ6sHOHUYPjQgcDAQW7UFnBgjtaJwRuGc14tVuK9ajRE9PtLRhiVy25XkGPbDMuSqQlS9tqd+KWBMjqm+EqSO8NiuLmVMttbtqOqwpzq199EusRVnidegV7MMvtekKyd2JdNmpoP7GnSpdql2iwHmYvXc1IGUSITvh1l6EgpnFM4onE0eiJk2OavAOOOcSXFddSYABsCsqRV7OgQ6R7YRNvWQjrPaOV8ccpAhcvnntH7pi8jnqL56ADuj739zyC2yjAJDFdgu/6iXbb6K8TkqhVFMdhfzWdmmxHlZcW7Oefq+7g7ABIgAIswXPoz7MZ0Y81mcCFOz/Gpm/6TDT5wtAuqDr0rPVZe/Oz29Ylh28aWgmGBwnmUFrOX5ZStgLfXMmIvExWl8jjJGwAKOJBkBC9ADwDxjqhGwgEOIRsAC9LABe+sJwyu64e8ccvMiMyzL8oKtnbVz2Y9qMpe0fz7U/sfV8997RLgp8b0HsMv6ft2g5k/mRWZQluV5mz9q57If12QuasA+1v7H1RMEmG+cy3F84ticbUoEYDUPBJAFkI5IBbiT1rc4v+yk9S30sEkHIszuAc7KNadw5ugBYCG0voFdkhtJEWF2DwCwSONTMEvMIcLueUJM3Vc13X2H3LzK3NVtf+Bo+x0t89Ahc4uIVJ0msuLsAsKXLnGf7wGvn7kzHfxHQrJTDwCwTt0rrxyAyfu0U40ArFP3yisHYPI+7VQjAOvUvfLKAZi8TzvVCMA6da+88t8WQQe4wa/1QwAAAABJRU5ErkJggg==" , done: true},
       { id: 4, category_id: 1, img: "" },
       { id: 3, category_id: 1, img: "" },
       { id: 2, category_id: 1, img: "" },
       { id: 1, category_id: 1, img: "" },
    ],
    // question_list: [
    //   { id: 1, category_id: 1, title: "BBBBBBB", img: "" },
    //   { id: 1, category_id: 1, title: "BBBBBBB", img: "" },
    //   { id: 1, category_id: 1, title: "BBBBBBB", img: "" },
    //   { id: 1, category_id: 1, title: "BBBBBBB", img: "" },
    //   { id: 1, category_id: 1, title: "BBBBBBB", img: "" },
    //   { id: 1, category_id: 1, title: "BBBBBBB", img: "" },
    //   { id: 1, category_id: 1, title: "BBBBBBB", img: "" },
    //   { id: 1, category_id: 1, title: "BBBBBBB", img: "" },
    //   { id: 1, category_id: 1, title: "BBBBBBB", img: "" },
    //   { id: 1, category_id: 1, title: "BBBBBBB", img: "" },
    //   { id: 1, category_id: 1, title: "BBBBBBB", img: "" },
    // ],
    item_list_title: "",
    note_info: "更多题目正在录入中，敬请期待",
    progress_info: "已完成(0/0）",
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    getApp().setQuestionListener(this);
    this.loadCategoryList();
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
    getApp().setQuestionListener(null);
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

  loadCategoryList: function() {
    wx.request({
      url: "http://127.0.0.1:8080/api/",
      data: "",
      method: "GET",
      dataType: "json",
      complete(res) {
        console.log(res);
        if (res.statusCode == 200) {
          let data = {};
          if (data.state) {
            this.setData({
              category_list: data.category_list,
            });
          } else {

          }
        } else {

        }
      }
    });
  },
  loadCategory: function(id) {
    wx.request({
      url: "http://127.0.0.1:8080/api/",
      data: "",
      method: "GET",
      dataType: "json",
      complete(res) {
        console.log(res);
        if (res.statusCode == 200) {
          let data = {};
          if (data.state) {
            let done_question_id = getApp().getProgressInfo(id).slice(0);
            let result_list = [];
            let progress_info = "已完成(" + done_question_id.length + "/" + data.question_list.length + ")";
            for (var i = 0; i < data.question_list.length; ++i) {
              let item = data.question_list[i];
              let index = done_question_id.indexOf(item.id);
              if (index != -1) {
                item.done = true;
                data_question_id.splice(index, 1);
              }
              result_list.push(item);
            }
            getApp().setCurCategory(id, result_list);
            this.setData({
              item_list_title: data.title,
              question_list: result_list
            });
          } else {

          }
        } else {

        }
      }
    });
  },

  onReturnBtn: function() {
    this.setData({
      category_id: 0,
    });
  },
  onContinueBtn: function() {
    for (let i = 0; i != this.data.question_list.length; ++i) {
      if (this.data.question_list[i].done) continue;
      wx.navigateTo({
        url: '../../pages/inner/inner?category_id=' + this.data.category_id + '&id=' + this.data.question_list[i].id + '&index=' + i,
      })
    }
  },

  onQuestionDone: function(category_id, index, id) {
    console.log('onQuestionDone', category_id, index, id);
    if (this.data.category_id != category_id)
      return;
    let done_question_id = getApp().getProgressInfo(id);
    let result_list = getApp().getCurCategoryList();
    let progress_info = "已完成(" + done_question_id.length + "/" + data.question_list.length + ")";
    let key = "question_list[" + (index) +"]";
    let obj = this.data.question_list[index];
    obj.done = true;
    this.setData({
      [key] : obj,
      progress_info: progress_info,
    });
  },

  onCategorySelect: function(e) {
    let id = e.currentTarget.dataset.categoryId;
    this.setData({
      category_id: id,
    })
  },

  onQuestionSelect: function(e) {
    if (this.data.category_id == 0) return;
    let id = e.currentTarget.dataset.questionId;
    let index = e.currentTarget.dataset.questionIndex;
    wx.navigateTo({
      url: '../../pages/inner/inner?category_id=' + this.data.category_id + '&id=' + id + '&index=' + index,
    })
  }
})