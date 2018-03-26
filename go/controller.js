import {Board} from "board.js"

export function RenjuController() {
  //const SHOW_NUM = 0; // 显示全部数字
  //const SHOW_LAST_5 = 1; // 显示最后5步
  //const SHOW_NONE_NUM = 2; // 不显示数字
  var show_num = 0;

  var board;
  var cur_index = 0;
  var move_list = [];  // { x, y }
  var stones; // { "color": color, "note": "" + cur_index, "num":cur_index };

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
    setShowNum: function(value) {
      if (show_num == value) {
        return;
      }
      show_num = value;
      board.reset();
      switch (show_num) {
        case 0:
          for (var i = 0; i != 15; ++i) {
            for (var j = 0; j != 15; ++j) {
              var node = stones[i][j];
              if (node) {
                if (node.num) {
                  board.addStone(i, j, node.color, node.note?node.note:""+node.num);
                }
              }
            }  
          }
        break;
        case 1:
          for (var i = 0; i != 15; ++i) {
            for (var j = 0; j != 15; ++j) {
              var node = stones[i][j];
              if (node) {
                if (node.num) {
                  var num_note = node.num <= (cur_index - 5) ? "" : "" + node.num;
                  board.addStone(i, j, node.color, node.note ? node.note : num_note);
                }
              }
            }
          }
        break;
        case 2:
          for (var i = 0; i != 15; ++i) {
            for (var j = 0; j != 15; ++j) {
              var node = stones[i][j];
              if (node) {
                if (node.num) {
                  board.addStone(i, j, node.color, node.note ? node.note : "");
                }
              }
            }
          }
        break;
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
      stones[x][y] = { "color": color, "note": "", "num":cur_index };
      switch (show_num) {
        case 0:
          board.addStone(x, y, color, "" + stones[x][y].num);
        break;
        case 1:
          var to_remove_index = cur_index - 6;
          if (to_remove_index >= 0) {
            var old_stone = move_list[to_remove_index];
            var tmp = stones[old_stone.x][old_stone.y];
            board.removeStone(old_stone.x, old_stone.y, false);
            board.addStone(old_stone.x, old_stone.y, tmp.color, tmp.note);
          }

          board.addStone(x, y, color, ""+cur_index);
        break;
        case 2:
          board.addStone(x, y, color, "");
        break;
      }
      
      console.log(move_list);
    },

    addText: function(x, y, note) {
      console.log('Controller.addText', x, y, note);
      var stone = stones[x][y];
      if (stone && stone.color != -1) {
        stone.note = note;
        board.addStone(x, y, stone.color, note);
      } else {
        stones[x][y] = {"color":-1, "note":note};
        board.addText(x, y, note);
      }
    },
    removeText: function(x, y) {
      console.log('Controller.removeText', x, y);
      var stone = stones[x][y];
      if (stone) {
        if (stone.color == -1)
          board.removeText(x, y);
        else {
          switch (show_num) {
            case 0:
              board.addStone(x, y, stone.color, ""+stone.num);
            break;
            case 1:

            break;
            case 2:
              board.addStone(x, y, stone.color, "");
            break;
          }
        }
      }

    },

    goPrev: function() {
      if (cur_index == 0 || move_list.length == 0) {
        return;
      }
      --cur_index;
      board.removeStone(move_list[cur_index].x, move_list[cur_index].y);
      
    },

    goNext: function() {
      if (move_list.length == 0 || cur_index == move_list.length) {
        return;
      }

      var stone = stones[move_list[cur_index].x][move_list[cur_index].y];
      if (stone) {
        board.addStone(move_list[cur_index].x, move_list[cur_index].y, stone.color, stone.note);
        ++cur_index;
      }
    },

    goBegin: function() {

    },

    goEnd: function() {

    }
  }

  function reset() {
    cur_index = 0;
    move_list = [];
  }

  



}