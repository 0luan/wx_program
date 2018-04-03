import {Board} from "board.js"
import {GoJudger} from "go_judger.js"

export function GoController() {
  var board;
  var judger;

  const ANSWER_MODE = 0;  // 查看答案
  const BATTLE_MODE = 1;  // 答题模式
  const TRY_MODE = 2;     // 试下模式

  var mode = BATTLE_MODE;
  var next_move_color = 1;

  // 栈，保存每一步的吃子，以便后退时使用
  var dead_moves_stack = []; 

  var init_stones = {}; // 初始固定的棋子

  var answer_moves = []; // 答案
  var cur_answer_index = -1;

  var predict_moves = {}; // 预测用户点击
  var cur_predict_tree;


  return {
    init: function(board_size, init, answer, predict) {
      board = Board();
      board.init(9, "board");

      judger = GoJudger();
      judger.init();

      init_stones = init;
      if (init.black) {
        for (let i = 0; i != init.black.length; ++i) {
          judger.addStone(init.black[i].x, init.black[i].y, 1);
          board.addStone(init.black[i].x, init.black[i].y, 1, init.black[i].note);
        }
      }
      if (init.white) {
        for (let i = 0; i != init.white.length; ++i) {
          judger.addStone(init.white[i].x, init.white[i].y, 0);
          board.addStone(init.white[i].x, init.white[i].y, 0, init.white[i].note);
        }
      }

      answer_moves = answer;
      predict_moves = predict;
      cur_predict_tree = predict_moves;
      
    },

    pointToXY: function(x, y) {
      return board.pointToXY(x, y);
    },



    // 进入试下模式
    enterTryMode: function() {

    },
    //wx.showModal({title:'test',content:'content',showCancel:false})
    onBoardClick: function(x, y) {
      switch (mode) {
        case BATTLE_MODE:
          if (!cur_predict_tree) return;
          
          let index = String.fromCharCode(65+x) + (y+1);
          console.log(index, cur_predict_tree);
          if (cur_predict_tree[index]) {
            cur_predict_tree = cur_predict_tree[index];
            {
              this.addStone(x, y, next_move_color);
            }
            if (next_move_color == 1) next_move_color = 0; else next_move_color = 1;
            if (cur_predict_tree.respond.x != -1)
            {
              this.addStone(cur_predict_tree.respond.x, cur_predict_tree.respond.y, next_move_color);
            }
            if (next_move_color == 1) next_move_color = 0; else next_move_color = 1;

            if (cur_predict_tree.respond.text)
              wx.showModal({ title: 'test', content: cur_predict_tree.respond.text, showCancel: false });
            cur_predict_tree = cur_predict_tree.next;
          } else {
            wx.showModal({ title: 'test', content: "wrong answer", showCancel: false });
          }
        break;
      }
    },

    addStone: function(x, y, color, note) {
      let deads = judger.addStone(x, y, color);
      if (deads === false) {
        console.log('add stone error');
        return;
      }
      board.addStone(x, y, color, note);
      for (let i = 0; i != deads.length; ++i)
        board.removeStone(deads[i].x, deads[i].y);
    },

    prevMove: function() {
      if (cur_answer_index < 0 || cur_answer_index >= answer_moves.length) return;
      let deads = dead_moves_stack.pop();
      let to_remove_move = answer_moves[cur_answer_index];
      board.removeStone(to_remove_move.x, to_remove_move.y);
      judger.removeStone(to_remove_move.x, to_remove_move.y);
      for (let i = 0; i != deads.length; ++i) {
        judger.addStone(deads[i].x, deads[i].y, deads[i].color);
        board.addStone(deads[i].x, deads[i].y, deads[i].color);
      }
      --cur_answer_index;
      if (cur_answer_index >= 0)
        if (answer_moves[cur_answer_index].text)
          return answer_moves[cur_answer_index].text;
        else
          return "";
      else return null;
    },
    nextMove: function() {
      if (cur_answer_index == answer_moves.length-1) return;

      ++cur_answer_index;
      if (cur_answer_index < answer_moves.length) {
        var to_add_move = answer_moves[cur_answer_index];
        var deads = judger.addStone(to_add_move.x, to_add_move.y, to_add_move.color);
        if (deads === false) console.error('add stone error');
        else {
          dead_moves_stack.push(deads);
          board.addStone(to_add_move.x, to_add_move.y, to_add_move.color, "");
          for(let i = 0; i != deads.length; ++i) {
            board.removeStone(deads[i].x, deads[i].y);
          }
          if (to_add_move.text) return to_add_move.text;
          else return "";
        }
      } else {
        console.log('no next move');
      }
      return null;
    }

  }
}