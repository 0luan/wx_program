export function Board() {
  const LINE_COUNT = 19;
  var width, height;
  var unit_size;  // 格子大小
  var stone_size; // 棋子大小
  var show_num = true;  // 是否显示数字

  var canvas_id;
  var ctx;

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

      ctx.draw();
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

    setShowNum: function(bool) {

    },

    addStone: function(x, y, color, num) {
      ctx = wx.createCanvasContext(canvas_id);
      x = (x+1)*unit_size;
      y = (y+1)*unit_size;
      
      ctx.setLineWidth(1);
      ctx.setStrokeStyle('black');
      ctx.beginPath();
      ctx.arc(x, y, stone_size, 0, 2*Math.PI);
      ctx.stroke();
      ctx.setFillStyle(color==1?'black':'white');
      ctx.fill();

      if (show_num) {
        ctx.setFillStyle(color==1?'white':'black');
        ctx.setLineWidth(2);
        ctx.setFontSize(stone_size);
        ctx.setTextBaseline('middle');
        ctx.setTextAlign('center');
        ctx.fillText(num, x, y);
      }

      ctx.draw(true);
    },

    removeStone: function(x, y) {
      x = (x + 0.5) * unit_size;
      y = (y + 0.5) * unit_size;
      ctx.setFillStyle('white');
      ctx.fillRect(x, y, unit_size, unit_size);

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

    },

    removeText: function(x, y) {

    },

    clear: function() {

    }
  }
}