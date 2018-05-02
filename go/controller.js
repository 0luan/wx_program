import {Board} from "board.js"
import {GoJudger} from "go_judger.js"

var cache = {};

export function GoController() {
  var board;
  var judger;

  const ANSWER_MODE = 0;  // 查看答案
  const BATTLE_MODE = 1;  // 答题模式
  const TRY_MODE = 2;     // 试下模式

  var mode = BATTLE_MODE;
  var next_move_color = 1;

  // 栈，保存显示答案时每一步的吃子，以便后退时使用
  var dead_moves_stack = []; 

  var init_info = {};

  var answer_moves = []; // 答案
  var cur_answer_index = -1;

  var predict_moves = {}; // 预测用户点击
  var cur_predict_tree;

  //var try_mode_restore_storage = {};

  var undo_info = {
    moves_stack: [],
    deads_stack: [],
    predict_stack: [],
  };

  return {
    ANSWER_MODE: ANSWER_MODE,
    BATTLE_MODE: BATTLE_MODE,
    TRY_MODE: TRY_MODE,
    init: function(board_clip_pos, init, next_move, answer, predict) {
      init_info.board_clip_pos = board_clip_pos;
      init_info.init_stones = init;
      init_info.next_move_color = next_move;

      board = Board();
      board.init(board_clip_pos, "board", false);

      judger = GoJudger();
      judger.init();

      if (init.black) {
        for (let i = 0; i != init.black.length; ++i) {
          judger.addStone(init.black[i].x, init.black[i].y, 1);
          board.addStone(init.black[i].x, init.black[i].y, 1, init.black[i].note, false);
        }
      }
      if (init.white) {
        for (let i = 0; i != init.white.length; ++i) {
          judger.addStone(init.white[i].x, init.white[i].y, 0);
          board.addStone(init.white[i].x, init.white[i].y, 0, init.white[i].note, false);
        }
      }
      board.draw();

      next_move_color = next_move;
      answer_moves = answer;
      predict_moves = predict;
      cur_predict_tree = predict_moves;
      
    },

    pointToXY: function(x, y) {
      return board.pointToXY(x, y);
    },



    // // 试下模式
    // enterTryMode: function() {
    //   try_mode_restore_storage.mode = mode;
    //   try_mode_restore_storage.dead_moves_stack = dead_moves_stack;
    //   try_mode_restore_storage.board_state = board.saveState();
    //   try_mode_restore_storage.judger_state = judger.saveState();
    //   mode = TRY_MODE;
    // },
    // exitTryMode: function() {
    //   board.restoreState(try_mode_restore_storage.board_state);
    //   judger.restoreState(try_mode_restore_storage.judger_state);
    //   dead_moves_stack = try_mode_restore_storage.dead_moves_stack;
    //   mode = try_mode_restore_storage.mode;
    // },

    //wx.showModal({title:'test',content:'content',showCancel:false})
    onBoardClick: function(x, y, settext) {
      switch (mode) {
        // 答题 
        case BATTLE_MODE:
          if (!cur_predict_tree) return;

          let index = String.fromCharCode(65+x) + (y+1);
          console.log(index, cur_predict_tree);
          if (cur_predict_tree[index]) {
            undo_info.predict_stack.push(cur_predict_tree);
            cur_predict_tree = cur_predict_tree[index];
            {
              this.addStone(x, y, next_move_color);
            }
            if (next_move_color == 1) next_move_color = 0; else next_move_color = 1;

            if (cur_predict_tree.correct != undefined) {
              if (cur_predict_tree.correct) {
                settext(cur_predict_tree.text ? cur_predict_tree.text : "恭喜答对");
                getCurrentPages()[getCurrentPages().length - 1].onAnswerRight(true);
              } else {
                settext(cur_predict_tree.text ? cur_predict_tree.text : "失败，重来吧");
              }
              return;
            }

            if (cur_predict_tree.response.x != undefined && cur_predict_tree.response.y != undefined)
            {
              this.addStone(cur_predict_tree.response.x, cur_predict_tree.response.y, next_move_color);
              
            }
            if (cur_predict_tree.response.correct != undefined) {
              if (cur_predict_tree.response.correct) {
                settext(cur_predict_tree.response.text ? cur_predict_tree.response.text : "恭喜答对");
                getCurrentPages()[getCurrentPages().length - 1].onAnswerRight(true);
              } else {
                settext(cur_predict_tree.response.text ? cur_predict_tree.response.text : "失败，重来吧");
              }
            } else {
              settext(cur_predict_tree.response.text);
            }
            
            if (next_move_color == 1) next_move_color = 0; else next_move_color = 1;   
          }
        break;
      }
    },
    unDo: function() {
      if (!undo_info.moves_stack || !undo_info.deads_stack)
        return;

      let to_add = undo_info.deads_stack.pop();
      let to_remove = undo_info.moves_stack.pop();
      
      judger.removeStone(to_remove.x, to_remove.y);
      board.removeStone(to_remove.x, to_remove.y);
      for (let i = 0; i != to_add.length; ++i) {
        judger.addStone(to_add[i].x, to_add[i].y, to_add[i].color);
        board.addStone(to_add[i].x, to_add[i].y, to_add[i].color);
      }
      if (next_move_color == 1) next_move_color = 0; else next_move_color = 1;
      if (next_move_color != init_info.next_move_color) {
        cur_predict_tree = undo_info.predict_stack.pop();
        this.unDo();
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

      if (mode == BATTLE_MODE) {
        undo_info.moves_stack.push({"x":x ,"y":y, "color":color, "note":note});
        undo_info.deads_stack.push(deads);
      }
    },

    hasAnswer: function() {
      return answer_moves.length > 0;
    },
    setAnswerMode: function(val) {
      this.init(init_info.board_clip_pos, init_info.init_stones, init_info.next_move_color, answer_moves, predict_moves)
      mode = val? ANSWER_MODE : BATTLE_MODE;
      cur_answer_index = -1;
      cur_predict_tree = predict_moves;
    },
    prevMove: function(settext) {
      if (mode != ANSWER_MODE) return false;
      if (cur_answer_index < 0 || cur_answer_index >= answer_moves.length) false;
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
          settext(answer_moves[cur_answer_index].text);
        else
          settext("");
      if (next_move_color == 1) next_move_color = 0; else next_move_color = 1;
      return this.hasPrevMove();
    },
    nextMove: function(settext) {
      if (mode != ANSWER_MODE) return false;
      if (cur_answer_index == answer_moves.length-1) return false;

      ++cur_answer_index;
      if (cur_answer_index < answer_moves.length) {
        var to_add_move = answer_moves[cur_answer_index];
        var deads = judger.addStone(to_add_move.x, to_add_move.y, next_move_color);
        if (deads === false) console.error('add stone error');
        else {
          dead_moves_stack.push(deads);
          board.addStone(to_add_move.x, to_add_move.y, next_move_color, ""+(cur_answer_index + 1));
          for(let i = 0; i != deads.length; ++i) {
            board.removeStone(deads[i].x, deads[i].y);
          }
          if (to_add_move.text) settext(to_add_move.text);
          else settext("");
          if (next_move_color == 1) next_move_color = 0; else next_move_color = 1;
        }
      } else {
        console.log('no next move');
      }
      return this.hasNextMove();
    },
    hasPrevMove: function () { return cur_answer_index >= 0 && cur_answer_index < (answer_moves.length - 1); },
    hasNextMove: function () { return cur_answer_index <= (answer_moves - 1); },
  }
}