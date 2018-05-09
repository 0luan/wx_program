import {Board} from "board.js"
import {GoJudger} from "go_judger.js"

var cache = {};

export function GoController() {
  var board;
  var judger;
  var set_text_callback = null;

  const ANSWER_MODE = 0;  // 查看答案
  const BATTLE_MODE = 1;  // 答题模式
  const TRY_MODE = 2;     // 试下模式

  var mode = BATTLE_MODE;
  var next_move_color = 1;

  var init_info = {};


  var predict_moves = {}; // 预测用户点击
  var cur_predict_tree;

  //var try_mode_restore_storage = {};

  var move_index = 1;
  var undo_info = {
    moves_stack: [],
    deads_stack: [],
    predict_stack: [],
    note_pos_stack: [],
  };

  return {
    ANSWER_MODE: ANSWER_MODE,
    BATTLE_MODE: BATTLE_MODE,
    TRY_MODE: TRY_MODE,
    init: function(board_clip_pos, init, next_move, answer, predict, callback) {
      undo_info = {
        moves_stack: [],
        deads_stack: [],
        predict_stack: [],
        note_pos_stack: [],
      };

      init_info.board_clip_pos = board_clip_pos;
      init_info.init_stones = init;
      init_info.next_move_color = next_move;

      board = Board();
      board.init(board_clip_pos, "board", false);

      judger = GoJudger();
      judger.init();

      set_text_callback = callback;

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

      move_index = 1;
      next_move_color = next_move;
      predict_moves = predict;
      cur_predict_tree = predict_moves;
      
    },

    pointToXY: function(x, y) {
      return board.pointToXY(x, y);
    },

    StrToXY: function(str) {
      let x = str.charCodeAt(0) - 65;
      let y = parseInt(str.substr(1)) - 1;
      return {x:x, y:y};
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

    showAllBranches: function() {
      let branches = [];
      if (move_index % 2) {
        for (var key in cur_predict_tree) {
          if (key == "correct" || key == "response") continue;
          let tmp = this.StrToXY(key)
          board.setMark(tmp.x, tmp.y, next_move_color);
          branches.push({x:tmp.x, y:tmp.y});
        }
      } else {
        for (let i = 0; i != cur_predict_tree.length; ++i) {
          if (cur_predict_tree[i].response) {
            board.setMark(cur_predict_tree[i].response.x, cur_predict_tree[i].response.y, next_move_color);
            branches.push({ x: cur_predict_tree[i].response.x, y: cur_predict_tree[i].response.y });
          }
        }
      }
      undo_info.note_pos_stack.push(branches);
    },
    removeBranchInfo: function(clear = false) {
      if (undo_info.note_pos_stack.length) {
        let to_remove;
        if (clear)
          to_remove = undo_info.note_pos_stack.pop();
        else
          to_remove = undo_info.note_pos_stack[undo_info.note_pos_stack.length - 1];
        for (let i = 0; i != to_remove.length; ++i) {
          board.removeNode(to_remove[i].x, to_remove[i].y);
        }
      }
    },


    onBoardClick: function(x, y) {
      if (!cur_predict_tree) return;

      if (move_index % 2) {
        let index = String.fromCharCode(65 + x) + (y + 1);
        if (cur_predict_tree[index]) {
          undo_info.predict_stack.push(cur_predict_tree);
          cur_predict_tree = cur_predict_tree[index];
          this.removeBranchInfo();
          this.addStone(x, y, next_move_color, "" + move_index);
          ++move_index;
          if (next_move_color == 1) next_move_color = 0; else next_move_color = 1;
          if (cur_predict_tree.correct === true) {
            set_text_callback && set_text_callback(cur_predict_tree.text ? cur_predict_tree.text : "恭喜答对");
            if (mode == BATTLE_MODE)
              getCurrentPages()[getCurrentPages().length - 1].onAnswerRight(true);
            undo_info.note_pos_stack.push([]);
            return;
          }

          if (mode == BATTLE_MODE) {
            let respond_index = cur_predict_tree.length;
            respond_index = Math.floor(Math.random() * respond_index + 1) - 1;
            cur_predict_tree = cur_predict_tree[respond_index];
            if (cur_predict_tree.response.x != undefined && cur_predict_tree.response.y != undefined) {
              this.addStone(cur_predict_tree.response.x, cur_predict_tree.response.y, next_move_color, "" + move_index);
            }
            if (cur_predict_tree.response.correct === false) {
              set_text_callback && set_text_callback(cur_predict_tree.response.text ? cur_predict_tree.response.text : "失败，重来吧");
            }
            undo_info.predict_stack.push(cur_predict_tree);
            ++move_index;
            if (next_move_color == 1) next_move_color = 0; else next_move_color = 1;
          } else {
            this.showAllBranches();
          }
        } else {
          return;
        }
      } else {
        let find = null;
        for (let i = 0; i != cur_predict_tree.length; ++i) {
          if (cur_predict_tree[i].response.x == x && cur_predict_tree[i].response.y == y) {
            find = cur_predict_tree[i];
            break;
          }
        }
        if (!find) return;
        undo_info.predict_stack.push(cur_predict_tree);
        cur_predict_tree = find;
        this.removeBranchInfo();
        this.addStone(x, y, next_move_color, "" + move_index);
        ++move_index;
        if (next_move_color == 1) next_move_color = 0; else next_move_color = 1;

        if (cur_predict_tree.response.correct === false) {
          set_text_callback && set_text_callback(cur_predict_tree.response.text ? cur_predict_tree.response.text : "失败，重来吧");
          undo_info.note_pos_stack.push([]);
          return;
        }

        this.showAllBranches();      
      }

    },
    unDo: function() {
      if (undo_info.moves_stack.length == 0 || undo_info.deads_stack.length == 0)
        return;
      set_text_callback && set_text_callback("");
      console.log(undo_info);
      --move_index;
      let to_add = undo_info.deads_stack.pop();
      let to_remove = undo_info.moves_stack.pop();
            
      judger.removeStone(to_remove.x, to_remove.y);
      board.removeNode(to_remove.x, to_remove.y);
      for (let i = 0; i != to_add.length; ++i) {
        if (!to_add[i]) continue;
        judger.addStone(to_add[i].x, to_add[i].y, to_add[i].color);
        board.addStone(to_add[i].x, to_add[i].y, to_add[i].color, to_add[i].note);
      }
      if (next_move_color == 1) next_move_color = 0; else next_move_color = 1;

      this.removeBranchInfo(true);
      if (undo_info.note_pos_stack.length) {
        let to_add = undo_info.note_pos_stack[undo_info.note_pos_stack.length - 1];
        for (let i = 0; i != to_add.length; ++i) {
          board.setMark(to_add[i].x, to_add[i].y, next_move_color);
        }
      }

      cur_predict_tree = undo_info.predict_stack.pop();

      console.log(undo_info);
      if (mode == BATTLE_MODE && next_move_color != init_info.next_move_color) {
        this.unDo();
      }
    },

    addStone: function(x, y, color, note) {
      let deads = judger.addStone(x, y, color);
      let tmp = [];
      if (deads === false) {
        console.log('add stone error');
        return;
      }
      board.addStone(x, y, color, note);
      for (let i = 0; i != deads.length; ++i)
        tmp.push(board.removeNode(deads[i].x, deads[i].y));

      undo_info.moves_stack.push({"x":x ,"y":y, "color":color, "note":note});
      undo_info.deads_stack.push(tmp);
    },

    setAnswerMode: function(val) {
      this.init(init_info.board_clip_pos, init_info.init_stones, init_info.next_move_color, null, predict_moves, set_text_callback);
      mode = val? ANSWER_MODE : BATTLE_MODE;
      cur_predict_tree = predict_moves;
      move_index = 1;
      undo_info = {
        moves_stack: [],
        deads_stack: [],
        predict_stack: [],
        note_pos_stack: [],
      };

      if (val) this.showAllBranches();
    },

  }
}