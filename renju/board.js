export function Board() {
  const LINE_COUNT = 15;
  var width, height;
  var unit_size;  // 格子大小
  var stone_size; // 棋子大小
  var show_num = true;  // 是否显示数字

  var canvas_id;
  var ctx;

  var selected_x = -1;
  var selected_y = -1;
  var cached_stone_img; // 选择某个点位时保存棋子图像，取消选择时用来恢复

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

    selectPoint: function(x, y) {
      if (selected_x != -1 && selected_y != -1 && cached_stone_img) {
        wx.canvasPutImageData({
          canvasId: canvas_id,
          data: cached_stone_img.data,
          x: (selected_x + 0.5) * unit_size,
          y: (selected_y + 0.5) * unit_size,
          width: unit_size,
        });
      }

      selected_x = x;
      selected_y = y;

      var rect_x = (x + 0.5) * unit_size;
      var rect_y = (y + 0.5) * unit_size;
      wx.canvasGetImageData({
        canvasId: canvas_id,
        x: rect_x,
        y: rect_y,
        width: unit_size,
        height: unit_size,
        success(res) {
          cached_stone_img = res;
          rect_x = rect_x + 5;
          rect_y = rect_y + 5;
          ctx.setFillStyle('red');
          ctx.fillRect(rect_x, rect_y, unit_size - 10, unit_size - 10);
          ctx.draw(true);
        }
      });
    },

    cancelSelect: function() {
      if (selected_x != -1 && selected_y != -1 && cached_stone_img) {
        wx.canvasPutImageData({
          canvasId: canvas_id,
          data: cached_stone_img.data,
          x: (selected_x + 0.5) * unit_size,
          y: (selected_y + 0.5) * unit_size,
          width: unit_size,
        });
      }
      
      selected_x = -1;
      selected_y = -1;
      cached_stone_img = null;
    },

    moveUp: function() {
    
    },

    moveRight: function() {

    },

    moveDown: function() {

    },

    moveLeft: function() {

    },

    getSelectedPoint: function() {
      return {
        "x":selected_x,
        "y":selected_y
      };
    },

    addStone: function(x, y, color, num) {
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
        ctx.setFontSize(stone_size + 2);
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

    },

    removeText: function(x, y) {

    },

    clear: function() {

    }
  }
}