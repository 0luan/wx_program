// -1－空位, 0－白子, 1－黑子
export function GoJudger() {
  const LINE_COUNT = 19;
  var stones  = [];

  return {
    init: function () {
      stones = this.getEmptyStones();
    },

    getEmptyStones: function() {
      var s = [];
      for (let i = 0; i != LINE_COUNT; ++i) {
        s.push([-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1]);
      }
      return s;
    },

    saveState: function() {
      let tmp = [];
      for (let i = 0; i != LINE_COUNT; ++i)
        for (let j = 0; j != LINE_COUNT; ++j)
          tmp[i][j] = stones[i][j];
      return tmp;
    },
    restoreState: function(s) {
      stones = s;
    },

    /* 如果合法，返回被吃棋子坐标数组 */
    /* 如果不合法，返回false */
    addStone: function (x, y, color) {
      if (x < 0 || x > LINE_COUNT - 1) return false;
      if (y < 0 || y > LINE_COUNT - 1) return false;
      if (stones[x][y] != -1) return false; // 已经有棋子
      stones[x][y] = color;

      // 判断是否使对方棋子没气
      const left_x = x - 1;
      const right_x = x + 1;
      const up_y = y - 1;
      const down_y = y + 1;

      let left_dead = false, right_dead = false, up_dead = false, down_dead = false;
      if (left_x >= 0 && stones[left_x][y] != -1 && stones[left_x][y] != color) {
        //console.log('left liberty ', this.countLiberty(left_x, y));
        left_dead = (this.countLiberty(left_x, y) == 0);
      }
      if (right_x <= LINE_COUNT - 1 && stones[right_x][y] != -1 && stones[right_x][y] != color) {
        //console.log('right liberty ', this.countLiberty(right_x, y));
        right_dead = (this.countLiberty(right_x, y) == 0);
      }
      if (up_y >= 0 && stones[x][up_y] != -1 && stones[x][up_y] != color) {
        //console.log('up liberty ', this.countLiberty(x, up_y));
        up_dead = (this.countLiberty(x, up_y) == 0);
      }
      if (down_y <= LINE_COUNT - 1 && stones[x][down_y] != -1 && stones[x][down_y] != color) {
        //console.log('down liberty ', this.countLiberty(x, down_y));
        down_dead = (this.countLiberty(x, down_y) == 0);
      }
      //console.log(left_dead, right_dead, up_dead, down_dead);

      if (!(left_dead || right_dead || up_dead || down_dead)) {	// 没有吃掉对方棋子
        // 判断自己是否没气
        //console.log('this liberty ', this.countLiberty(x, y));
        if (this.countLiberty(x, y) == 0) {
          stones[x][y] = -1;
          return false;
        } else return [];
      }

      let deads = [];
      if (left_dead && stones[left_x][y] != color) {
        this.removeBlock(left_x, y, deads);
      }
      if (right_dead && stones[right_x][y] != color) {
        this.removeBlock(right_x, y, deads);
      }
      if (up_dead && stones[x][up_y] != color) {
        this.removeBlock(x, up_y, deads);
      }
      if (down_dead && stones[x][down_y] != color) {
        this.removeBlock(x, down_y, deads);
      }
      //console.log(deads);
      return deads;
    },
    removeStone: function(x, y) {
      stones[x][y] = -1;
    },

    // 提掉该坐标所属的一整块棋
    removeBlock: function (x, y, deads, checked) {
      let checked_pos = checked != undefined ? checked : this.getEmptyStones();
      const color = stones[x][y];
      const left_x = x - 1;
      const right_x = x + 1;
      const up_y = y - 1;
      const down_y = y + 1;
      if (checked_pos[x][y] != -1) return;

      if (stones[x][y] != -1) {
        //console.log('remove block push x:', x, ' y:', y);
        deads.push({ "x": x, "y": y, "color":color });
        stones[x][y] = -1;
      }
      checked_pos[x][y] = 1;

      if (left_x >= 0 && stones[left_x][y] == color) {
        this.removeBlock(left_x, y, deads, checked_pos);
      }
      if (right_x <= LINE_COUNT - 1 && stones[right_x][y] == color) {
        this.removeBlock(right_x, y, deads, checked_pos);
      }
      if (up_y >= 0 && stones[x][up_y] == color) {
        this.removeBlock(x, up_y, deads, checked_pos);
      }
      if (down_y <= LINE_COUNT - 1 && stones[x][down_y] == color) {
        this.removeBlock(x, down_y, deads, checked_pos);
      }
    },

    countLiberty: function (x, y, checked) {
      let q = 0;	// 气
      let checked_pos = checked || this.getEmptyStones();
      let color = stones[x][y];

      if (checked_pos[x][y] != -1) return 0;	// 已经遍历过
      checked_pos[x][y] = 1;

      const left_x = x - 1;
      const right_x = x + 1;
      const up_y = y - 1;
      const down_y = y + 1;

      if (left_x >= 0) {
        if (stones[left_x][y] == -1) { // 空位
          ++q;
        } else if (stones[left_x][y] == color) { // 己方棋子
          q += this.countLiberty(left_x, y, checked_pos);
        }
      }

      if (right_x <= LINE_COUNT - 1) {
        if (stones[right_x][y] == -1) { // 空位
          ++q;
        } else if (stones[right_x][y] == color) { // 己方棋子
          q += this.countLiberty(right_x, y, checked_pos);
        }
      }

      if (up_y >= 0) {
        if (stones[x][up_y] == -1) { // 空位
          ++q;
        } else if (stones[x][up_y] == color) { // 己方棋子
          q += this.countLiberty(x, up_y, checked_pos);
        }
      }

      if (down_y <= LINE_COUNT - 1) {
        if (stones[x][down_y] == -1) { // 空位
          ++q;
        } else if (stones[x][down_y] == color) { // 己方棋子
          q += this.countLiberty(x, down_y, checked_pos);
        }
      }

      return q;
    }
  }

}
