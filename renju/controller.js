import {Board} from "board.js"

export function RenjuController() {


  var board;
  var cur_index = 0;
  var move_list = [];
  var stones;

  var selected_point_x = -1;
  var selected_point_y = -1;

  return {
    init: function(b) {
      board = b;
      stones = new Array(15);
      for(var i = 0; i != 15; ++i) {
        stones[i] = new Array(15);
      }
    },
    getStone: function(x, y) {
      return stones[x][y];
    },
    addStone: function(x, y, color) {
      if (cur_index == 255 || x > 14 || y > 14) {
        return 0;
      }

      if (cur_index < move_list.length) {
        move_list.splice(cur_index, move_list.length - cur_index);
      }

      move_list.push({ "x": x, "y": y });
      ++cur_index;
      stones[x][y] = { "color": color, "note": "" + cur_index, "num": cur_index };
      board.addStone(x, y, color, "" + cur_index);
      console.log(move_list);
    }
  }

  function reset() {
    cur_index = 0;
    move_list = [];
  }

  



}