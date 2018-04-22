const DUMIAO_MODE = 0;
const JIAMIAO_MODE = 1;
const KGS_MODE = 2;

var mode = DUMIAO_MODE;


var black = {
  basic_time_ms:10000,
  variation_time_ms:10000,
  cur_time_ms:10000,
  basic_time_used_up:false,
  moves_num:1,
  moves_total:10,
  timeout_count_remain:3,
  sound:[false, false, false, false, false, false, false, false, false, false]
};
var white = {
  basic_time_ms: 10000,
  variation_time_ms: 10000,
  cur_time_ms: 10000,
  basic_time_used_up: false,
  moves_num: 1,
  moves_total: 10,
  timeout_count_remain: 3,
  sound: [false, false, false, false, false, false, false, false, false, false]
};

var cur_color = 1;
var last_time;
var timer;
var __mode_range = ["读秒规则","加秒规则","定时限步规则"];
var __minute_range = [];
var __second_range = [];
var __count_range = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20];
for (let i = 0; i != 61; ++i) {
  __minute_range.push(i);
  __second_range.push(i);
}

var wav_info = [];
var timeout_wav_info = [];
var setting_cache = {};
const innerAudioContext = wx.createInnerAudioContext();
Page({
  data: {
    showSettings: true,
    minute_range: __minute_range,
    second_range: __second_range, 
    count_range: __count_range,
  },
  onLoad: function () {
    this.loadAudio();
  },

  loadAudio: function() {
    for (let i = 1; i != 11; ++i) {
      wx.downloadFile({
        url: "https://res-1256473329.cos.ap-guangzhou.myqcloud.com/" + i + ".wav",
        success(e) {
          wav_info[i-1] = e.tempFilePath;
          console.log(e);
        }
      })
      wx.downloadFile({
        url: "https://res-1256473329.cos.ap-guangzhou.myqcloud.com/" + i + "_t_remain.wav",
        success(e) {
          timeout_wav_info[i - 1] = e.tempFilePath;
          console.log(e);
        }
      })
    }
  },

  bindChange1: function(e) {
    console.log(e);
    setting_cache.dumiao_setting = e.detail.value;
  },
  onSettingCancel: function() {
    this.setData({ showSettings:false });
    setting_cache = {};
  },
  onSettingConfirm: function() {
    this.setData({ showSettings: false });
    let m = setting_cache.dumiao_setting[0];
    let s = setting_cache.dumiao_setting[1];
    let c = setting_cache.dumiao_setting[2];
    black = {
      basic_time_ms: m * 60000,
      variation_time_ms: s * 1000,
      cur_time_ms: m*60000,
      basic_time_used_up: false,
      moves_num: 1,
      moves_total: 10,
      timeout_count_remain: c,
      sound: [false, false, false, false, false, false, false, false, false, false]
    };
    white = {
      basic_time_ms: m * 60000,
      variation_time_ms: s * 1000,
      cur_time_ms: m * 60000,
      basic_time_used_up: false,
      moves_num: 1,
      moves_total: 10,
      timeout_count_remain: c,
      sound: [false, false, false, false, false, false, false, false, false, false]
    };
    this.updateInfo(0);
    this.updateInfo(1);
  },

  start: function() {
    wx.setKeepScreenOn({
      keepScreenOn: true,
    });
    last_time = new Date();
    // this.setData({
    //   black_time_str: formatTimeMs(cur_time_ms_black),
    //   white_time_str: formatTimeMs(cur_time_ms_white),
    // });
    if (timer) clearInterval(timer);
    timer = setInterval(this.onTimer, 100);
  },

  pause: function() {
    wx.setKeepScreenOn({
      keepScreenOn: false,
    });
  },

  stop: function() {
    wx.setKeepScreenOn({
      keepScreenOn: false,
    });
  },

  checkColor: function(color, diff) {
    if (mode == DUMIAO_MODE) {
      color.cur_time_ms -= diff;
      if (color.cur_time_ms <= 0) {
        color.cur_time_ms = 0;
        if (!color.basic_time_used_up && color.variation_time_ms > 0) {
          color.basic_time_used_up = true;
          color.cur_time_ms = color.variation_time_ms;
          // TODO play sound
        } else {
          if (color.timeout_count_remain-- == 0) {
            // TODO timeout, gameover
            clearInterval(timer);
          } else {
            innerAudioContext.autoplay = true
            innerAudioContext.src = timeout_wav_info[color.timeout_count_remain]
            innerAudioContext.onPlay(() => {
              console.log('开始播放')
            })
            innerAudioContext.onError((res) => {
              console.log(res.errMsg)
              console.log(res.errCode)
            })
            
            color.cur_time_ms = color.variation_time_ms;
            color.sound = [false, false, false, false, false, false, false, false, false, false];
          }
        }
      } else {
        if (color.basic_time_used_up) {
          var sec = color==black?this.data.black_time_sec:this.data.white_time_sec;
          if (sec <= 10) {
            if (!color.sound[sec]) {
              // TODO play sound
              console.log('count ', sec);
              
              innerAudioContext.autoplay = true
              innerAudioContext.src = wav_info[sec-1]
              innerAudioContext.onPlay(() => {
                console.log('开始播放')
              })
              innerAudioContext.onError((res) => {
                console.log(res.errMsg)
                console.log(res.errCode)
              })
              color.sound[sec] = true;
            }
          }
        }
      }
    }   // END DUMIAO_MODE
    else if (mode == JIAMIAO_MODE) {
      color.cur_time_ms -= diff;
      if (color.cur_time_ms <= 0) {
        color.cur_time_ms = 0;
        // TODO game over play sound
        console.log('game over timeout');
      } else {
        var sec = parseInt(color.cur_time_ms / 1000);
        if (sec <= 10) {
          if (!color.sound[sec]) {
            // TODO play sound
            console.log('count ', sec);
            color.sound[sec] = true;
          }
        }
      }
    }   // END JIAMIAO MODE
    else if (mode == KGS_MODE) {
      color.cur_time_ms -= diff;
      if (color.cur_time_ms <= 0) {
        if (color.basic_time_used_up) {
          // TODO game over play sound
          console.log('game over timeout');
        } else {
          color.cur_time_ms = color.variation_time_ms;
          color.basic_time_used_up = true;
          color.moves_num = 1;
        }
      }
    }

    this.updateInfo(cur_color);
  },

  updateInfo: function(color) {
    var state_str;
    switch (mode) {
      case DUMIAO_MODE:
        if (color == 0)
          state_str = "" + white.timeout_count_remain + " times remain/" + (white.variation_time_ms/1000) + "s";
        else
          state_str = "" + black.timeout_count_remain + " times remain/" + (black.variation_time_ms / 1000) + "s";
      break;
      case JIAMIAO_MODE:
          state_str = "";
      break;
      case KGS_MODE:
        if (color == 0) {
          if (white.basic_time_used_up)
            state_str = "" + white.moves_num;
          else
            state_str = "0";
          state_str += "/" + white.moves_total + " " + (white.variation_time_ms / 1000) + "s";
        }
        else {
          if (black.basic_time_used_up)
            state_str = "" + black.moves_num;
          else
            state_str = "0";
          state_str += "/" + black.moves_total + " " + (black.variation_time_ms / 1000) + "s";
        }
      break;
    }

    if (color == 0) {
      var t = new Date(white.cur_time_ms);
      this.setData({
        white_time_hour:t.getUTCHours(),
        white_time_min:t.getUTCMinutes(),
        white_time_sec: t.getUTCMilliseconds() == 0 ? t.getUTCSeconds() : t.getUTCSeconds() + 1,
        white_time_ms: t.getUTCMilliseconds(),
        white_info_str:state_str
      });
    } else {
      var t = new Date(black.cur_time_ms);
      this.setData({
        black_time_hour: t.getUTCHours(),
        black_time_min: t.getUTCMinutes(),
        black_time_sec: t.getUTCMilliseconds() == 0 ? t.getUTCSeconds() : t.getUTCSeconds() + 1,
        black_time_ms: t.getUTCMilliseconds(),
        black_info_str:state_str
      });
    }
  },

  onTimer: function() {
    var tmp = new Date();
    var diff = tmp - last_time;
    last_time = tmp;
    this.checkColor(cur_color==1?black:white, diff);
    //console.log(black.cur_time_ms, white.cur_time_ms);
  },

  onTap: function() {
    switch (mode) {
      case DUMIAO_MODE:
        if (cur_color == 1) {
          black.sound = [false, false, false, false, false, false, false, false, false, false];
          if (black.basic_time_used_up)
            black.cur_time_ms = black.variation_time_ms;
        } else {
          white.sound = [false, false, false, false, false, false, false, false, false, false];
          if (white.basic_time_used_up)
            white.cur_time_ms = white.variation_time_ms;
        }
      break;

      case JIAMIAO_MODE:
        if (cur_color == 1) {
          black.cur_time_ms += black.variation_time_ms;
        } else {
          white.cur_time_ms += white.variation_time_ms;
        }
      break;

      case KGS_MODE:
        if (cur_color == 1) {
          if (black.basic_time_used_up) {
            if (++black.moves_num > black.moves_total) {
              black.moves_num = 1;
              black.cur_time_ms = black.variation_time_ms;
            }
          }
        } else {
          if (white.basic_time_used_up) {
            if (++white.moves_num > white.moves_total) {
              white.moves_num = 1;
              white.cur_time_ms = white.variation_time_ms;
            }
          }
        }
      break;
    }
    this.updateInfo();
    if (cur_color == 1) cur_color = 0;
    else cur_color = 1;

    this.start();

  },

  bindBasicTimeChange: function(e) {
    console.log(e);
  }

})
