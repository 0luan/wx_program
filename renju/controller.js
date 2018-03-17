import {Board} from "board.js"

export function RenjuController() {
  return {
    init: function() {
      
    }
  }

  var board;
  var cur_index = 0;
  var move_list = [];

  function reset() {
    cur_index = 0;
    move_list = [];
  }

  // 增加棋子，返回序号
  function addStone(x, y, color) {
    if (cur_index == 255) {
      return 0;
    }


  }
}