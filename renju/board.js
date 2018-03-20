export function Board() {
  const LINE_COUNT = 15;
  var width, height;
  var unit_size;  // 格子大小
  var stone_size; // 棋子大小

  var node_data; // { color:xx, note:xx }

  var canvas_id;
  var ctx;

  var selected_x = -1;
  var selected_y = -1;

  var show_coordinate = true; // 显示坐标

  return {
    init: function(id) {
      console.log("board.init");
      width = wx.getSystemInfoSync().windowWidth;
      height = width;
      unit_size = width / (LINE_COUNT+1);
      stone_size = (unit_size - 4) / 2;
      canvas_id = id;

      ctx = wx.createCanvasContext(id);
      console.log(unit_size, unit_size, (width - unit_size), (width - unit_size));
      ctx.setStrokeStyle('black');
      ctx.setLineWidth(1);
      ctx.strokeRect(unit_size, unit_size, (width-2*unit_size), (width-2*unit_size));

      node_data = new Array(LINE_COUNT);
      for (var i = 0; i != LINE_COUNT; ++i) {
        node_data[i] = new Array(LINE_COUNT);
      }
      
      for (var i = 2; i != LINE_COUNT; ++i) {
        ctx.moveTo(i*unit_size, unit_size);
        ctx.lineTo(i*unit_size, width-unit_size);
        ctx.stroke();
      }
      for (var i = 2; i != LINE_COUNT; ++i) {
        ctx.moveTo(unit_size, i*unit_size);
        ctx.lineTo(width-unit_size, i*unit_size);
        ctx.stroke();
      }

      ctx.setFillStyle('black');
      ctx.setLineWidth(2);
      ctx.setFontSize(stone_size);
      ctx.setTextBaseline('middle');
      ctx.setTextAlign('right');
      for (var i = 0; i != LINE_COUNT; ++i) {
        var text_rect_x = (i+1) * unit_size;
        ctx.fillText(""+i, 0.5*unit_size, text_rect_x);
      }
      ctx.setTextBaseline('bottom');
      ctx.setTextAlign('center');
      for (var i = 0; i != LINE_COUNT; ++i) {
        var text_rect_x = (i + 1) * unit_size;
        ctx.fillText(String.fromCharCode((65 + i)), text_rect_x, 0.5 * unit_size);
      }
      ctx.draw();
    },

    setShowNum: function(bool) {
      if (bool) {
        ctx.setFillStyle('black');
        ctx.setLineWidth(2);
        ctx.setFontSize(stone_size);
        ctx.setTextBaseline('middle');
        ctx.setTextAlign('right');
        for (var i = 0; i != LINE_COUNT; ++i) {
          var text_rect_x = (i + 1) * unit_size;
          ctx.fillText("" + i, 0.5 * unit_size, text_rect_x);
        }
        ctx.setTextBaseline('bottom');
        ctx.setTextAlign('center');
        for (var i = 0; i != LINE_COUNT; ++i) {
          var text_rect_x = (i + 1) * unit_size;
          ctx.fillText(String.fromCharCode((65 + i)), text_rect_x, 0.5 * unit_size);
        }
        ctx.draw();
      } else {
        ctx.clearRect(0, 0, width, 0.5*unit_size);
        ctx.clearRect(0, 0, 0.5*unit_size, width);
      }
    }, 

    pointToXY: function(x, y) {
      var pt = {
        'x': parseInt(x / unit_size - 0.5),
        'y': parseInt(y / unit_size - 0.5)
      };
      if (pt.x >= LINE_COUNT) {
        --pt.x;
      }
      if (pt.y >= LINE_COUNT) {
        --pt.y;
      }
      return pt;
    },

    selectPoint: function(x, y) {
      if (selected_x != -1 && selected_y != -1) {
        this.cancelSelect();
      }

      selected_x = x;
      selected_y = y;
      var rect_x = (x + 0.5) * unit_size;
      var rect_y = (y + 0.5) * unit_size;

      rect_x = rect_x + 5;
      rect_y = rect_y + 5;
      ctx.setFillStyle('red');
      ctx.fillRect(rect_x, rect_y, unit_size - 10, unit_size - 10);
      ctx.draw(true);
    },

    cancelSelect: function() {
      if (selected_x != -1 && selected_y != -1) {
        var rect_x = (selected_x + 0.5) * unit_size;
        var rect_y = (selected_y + 0.5) * unit_size;
        console.log('clear rect ', rect_x, rect_y);
        ctx.clearRect(rect_x, rect_y, unit_size, unit_size);
        if (node_data[selected_x][selected_y]) {
          this.addStone(selected_x, selected_y, node_data[selected_x][selected_y].color, node_data[selected_x][selected_y].note);
        } else {
          ctx.setLineWidth(1);
          ctx.setStrokeStyle('black');
          ctx.moveTo(rect_x, rect_y + 0.5 * unit_size);
          ctx.lineTo(rect_x + unit_size, rect_y + 0.5 * unit_size);
          ctx.stroke();

          ctx.moveTo(rect_x + 0.5 * unit_size, rect_y);
          ctx.lineTo(rect_x + 0.5 * unit_size, rect_y + unit_size);
          ctx.stroke();
          ctx.draw(true);
        }
      }
      
      selected_x = -1;
      selected_y = -1;
    },

    moveUp: function() {
      if (selected_x == -1 || selected_y == -1) {
        return;
      }

      if (selected_y == 0) {
        return;
      }

      this.selectPoint(selected_x, selected_y - 1);
    },

    moveRight: function() {
      if (selected_x == -1 || selected_y == -1) {
        return;
      }

      if (selected_x == LINE_COUNT - 1) {
        return;
      }

      this.selectPoint(selected_x + 1, selected_y);
    },

    moveDown: function() {
      if (selected_x == -1 || selected_y == -1) {
        return;
      }

      if (selected_y == LINE_COUNT - 1) {
        return;
      }

      this.selectPoint(selected_x, selected_y + 1);
    },

    moveLeft: function() {
      if (selected_x == -1 || selected_y == -1) {
        return;
      }

      if (selected_x == 0) {
        return;
      }

      this.selectPoint(selected_x - 1, selected_y);
    },

    getSelectedPoint: function() {
      return {
        "x":selected_x,
        "y":selected_y
      };
    },

    addStone: function(x, y, color, note) {
      selected_x = -1;
      selected_y = -1;
      node_data[x][y] = { "color": color, "note": note };

      x = (x+1)*unit_size;
      y = (y+1)*unit_size;
      
      ctx.setLineWidth(1);
      ctx.setStrokeStyle('black');
      ctx.beginPath();
      ctx.arc(x, y, stone_size, 0, 2*Math.PI);
      ctx.stroke();
      ctx.setFillStyle(color==1?'black':'white');
      ctx.fill();

      if (note) {
        ctx.setFillStyle(color==1?'white':'black');
        ctx.setLineWidth(2);
        ctx.setFontSize(stone_size + 2);
        ctx.setTextBaseline('middle');
        ctx.setTextAlign('center');
        ctx.fillText(note, x, y);
      }


      ctx.draw(true);
    },

    removeStone: function(x, y) {
      x = (x + 0.5) * unit_size;
      y = (y + 0.5) * unit_size;
      ctx.setFillStyle('white');
      ctx.clearRect(x, y, unit_size, unit_size);

      ctx.setLineWidth(1);
      ctx.setStrokeStyle('black');
      ctx.moveTo(x, y + 0.5*unit_size);
      ctx.lineTo(x + unit_size, y + 0.5*unit_size);
      ctx.stroke();

      ctx.moveTo(x + 0.5 * unit_size, y);
      ctx.lineTo(x + 0.5 * unit_size, y + unit_size);
      ctx.stroke();
      ctx.draw(true);

    },

    addText: function(x, y, text) {
      x = (x + 1) * unit_size;
      y = (y + 1) * unit_size;

      ctx.setFillStyle(color == 1 ? 'white' : 'black');
      ctx.setLineWidth(2);
      ctx.setFontSize(stone_size + 2);
      ctx.setTextBaseline('middle');
      ctx.setTextAlign('center');
      ctx.fillText(text, x, y);

      ctx.draw(true);
    },

    removeText: function(x, y) {
      x = (x + 0.5) * unit_size;
      y = (y + 0.5) * unit_size;
      ctx.setFillStyle('white');
      ctx.clearRect(x, y, unit_size, unit_size);

      ctx.setLineWidth(1);
      ctx.setStrokeStyle('black');
      ctx.moveTo(x, y + 0.5 * unit_size);
      ctx.lineTo(x + unit_size, y + 0.5 * unit_size);
      ctx.stroke();

      ctx.moveTo(x + 0.5 * unit_size, y);
      ctx.lineTo(x + 0.5 * unit_size, y + unit_size);
      ctx.stroke();
      ctx.draw(true);
    },

    clear: function() {

    }
  }
}