export function Board() {
  var LINE_COUNT = 19;
  var width, height;
  var unit_size;  // 格子大小
  var stone_size; // 棋子大小

  var node_data; // { color:xx, note:xx }  pure text if color==-1

  var canvas_id;
  var ctx;

  var selected_x = -1;
  var selected_y = -1;

  var show_background = true; // 显示背景图
  var show_coordinate = false; // 显示坐标

  // 裁剪棋盘，只显示部分(右下角)
  var clip_pos_start = 0; 

  var star_pos = [{x:3, y:3}, {x:3, y:9}, {x:3, y:15}, {x:9, y:3}, {x:9, y:9}, {x:9, y:15}, {x:15, y:3}, {x:15, y:9}, {x:15, y:15}];

  return {
    init: function(clip_pos, id) {
      console.log("board.init");
      clip_pos_start = clip_pos;
      width = wx.getSystemInfoSync().windowWidth;
      height = width;
      if (clip_pos_start > 0)
        unit_size = width / (LINE_COUNT + 2 - clip_pos_start);
      else
        unit_size = width / (LINE_COUNT + 1);
      stone_size = (unit_size - 4) / 2;
      console.log("unit_size:", unit_size, " stone_size:", stone_size);
      canvas_id = id;

      ctx = wx.createCanvasContext(id);
      ctx.clearRect(0, 0, width, width);
      // // draw background
      // if (show_background) {
      //   const pattern = ctx.createPattern('../images/Wood1.png', 'repeat');
      //   ctx.fillStyle = pattern;
      //   ctx.fillRect(0, 0, width, width);
      // }

      ctx.setStrokeStyle('black');
      ctx.setLineWidth(1);

      node_data = new Array(LINE_COUNT);
      for (var i = 0; i != LINE_COUNT; ++i) {
        node_data[i] = new Array(LINE_COUNT);
      }
      
      if (clip_pos_start == 0) {
        ctx.moveTo(unit_size, unit_size);
        ctx.lineTo(unit_size, width - unit_size);
        ctx.stroke();
        ctx.moveTo(unit_size, unit_size);
        ctx.lineTo(width - unit_size, unit_size);
        ctx.stroke();
      }

      if (clip_pos_start > 0) {
        for (let i = 1; i != LINE_COUNT - clip_pos_start + 1; ++i) {
          console.log('draw line');
          ctx.moveTo((i+1) * unit_size, unit_size);
          ctx.lineTo((i+1) * unit_size, width - unit_size);
          ctx.stroke();

          ctx.moveTo(unit_size, (i+1)*unit_size);
          ctx.lineTo(width-unit_size, (i+1)*unit_size);
          ctx.stroke();
        }
      } else {
        for (let i = 1; i != LINE_COUNT; ++i) {
          console.log('draw line');
          ctx.moveTo((i + 1) * unit_size, unit_size);
          ctx.lineTo((i + 1) * unit_size, width - unit_size);
          ctx.stroke();

          ctx.moveTo(unit_size, (i + 1) * unit_size);
          ctx.lineTo(width - unit_size, (i + 1) * unit_size);
          ctx.stroke();
        }
      }

      for (let i = 0; i != star_pos.length; ++i) {
        let x = star_pos[i].x, y = star_pos[i].y;
        if (x < clip_pos || y < clip_pos) continue;
        if (clip_pos_start > 0) {
          x = (x - clip_pos_start + 2) * unit_size;
          y = (y - clip_pos_start + 2) * unit_size;
        } else {
          x = (x + 1) * unit_size;
          y = (y + 1) * unit_size;
        }
        ctx.setLineWidth(1);
        ctx.setStrokeStyle('black');
        ctx.beginPath();
        ctx.arc(x, y, 4, 0, 2 * Math.PI);
        ctx.stroke();
        ctx.setFillStyle('black');
        ctx.fill();
      }

      // for (var i = 2 + clip_pos_start; i != LINE_COUNT; ++i) {
      //   ctx.moveTo(i*unit_size, unit_size);
      //   ctx.lineTo(i*unit_size, width-unit_size);
      //   ctx.stroke();
      // }
      // for (var i = 2 + clip_pos_start; i != LINE_COUNT; ++i) {
      //   ctx.moveTo(unit_size, i*unit_size);
      //   ctx.lineTo(width-unit_size, i*unit_size);
      //   ctx.stroke();
      // }

      if (show_coordinate) {
        ctx.setFillStyle('black');
        ctx.setLineWidth(2);
        ctx.setFontSize(stone_size);
        ctx.setTextBaseline('middle');
        ctx.setTextAlign('right');
        for (var i = 0; i != LINE_COUNT; ++i) {
          var text_rect_x = (i+1) * unit_size;
          ctx.fillText("" + (i + 1), 0.5*unit_size, text_rect_x);
        }
        ctx.setTextBaseline('bottom');
        ctx.setTextAlign('center');
        for (var i = 0; i != LINE_COUNT; ++i) {
          var text_rect_x = (i + 1) * unit_size;
          ctx.fillText(String.fromCharCode((65 + i)), text_rect_x, 0.5 * unit_size);
        }
      }

      ctx.draw();
    },

    saveState: function() {
      let tmp = [];
      for (let i = 0; i != LINE_COUNT; ++i)
        for (let j = 0; j != LINE_COUNT; ++j)
          tmp[i][j] = node_data[i][j];
      return tmp;
    },
    restoreState: function(s) {
      this.reset();
      node_data = s;
      for (let i = 0; i != LINE_COUNT; ++i) {
        for (let j = 0; j != LINE_COUNT; ++j) {
          let node = node_data[i][j];
          if (node) {
            if (node.color != -1)
              this.addStone(i, j, node.color, node.note, false);
            else
              this.addText(i, j, node.note, false);
          }
        }
      }
      ctx.draw(true);
    },

    reset: function() {
      this.init(LINE_COUNT, canvas_id);
    },

    // refresh: function() {
    //   ctx.clearRect(0, 0, width, width);
    //   if (show_background) {
    //     const pattern = ctx.createPattern('../images/Wood1.png', 'repeat');
    //     ctx.fillStyle = pattern;
    //     ctx.fillRect(0, 0, width, width);
    //   }

    //   // draw lines
    //   ctx.setStrokeStyle('black');
    //   ctx.setLineWidth(1);
    //   ctx.strokeRect(unit_size, unit_size, (width - 2 * unit_size), (width - 2 * unit_size));
    //   for (var i = 2; i != LINE_COUNT; ++i) {
    //     ctx.moveTo(i * unit_size, unit_size);
    //     ctx.lineTo(i * unit_size, width - unit_size);
    //     ctx.stroke();
    //   }
    //   for (var i = 2; i != LINE_COUNT; ++i) {
    //     ctx.moveTo(unit_size, i * unit_size);
    //     ctx.lineTo(width - unit_size, i * unit_size);
    //     ctx.stroke();
    //   }

    //   // draw coordinate
    //   ctx.setFillStyle('black');
    //   ctx.setLineWidth(2);
    //   ctx.setFontSize(stone_size);
    //   ctx.setTextBaseline('middle');
    //   ctx.setTextAlign('right');
    //   for (var i = 0; i != LINE_COUNT; ++i) {
    //     var text_rect_x = (i + 1) * unit_size;
    //     ctx.fillText("" + (i + 1), 0.5 * unit_size, text_rect_x);
    //   }
    //   ctx.setTextBaseline('bottom');
    //   ctx.setTextAlign('center');
    //   for (var i = 0; i != LINE_COUNT; ++i) {
    //     var text_rect_x = (i + 1) * unit_size;
    //     ctx.fillText(String.fromCharCode((65 + i)), text_rect_x, 0.5 * unit_size);
    //   }

    //   // draw stone or text
    //   for (var i = 0; i != LINE_COUNT; ++i) {
    //     for (var j = 0; j != LINE_COUNT; ++j) {
    //       var node = node_data[i][j];
    //       if (node) {
    //         if (node.color == -1) { // text

    //         } else {  // stone
    //           var pos_x = (i + 1) * unit_size;
    //           var pos_y = (j + 1) * unit_size;

    //           ctx.setLineWidth(1);
    //           ctx.setStrokeStyle('black');
    //           ctx.beginPath();
    //           ctx.arc(pos_x, pos_y, stone_size, 0, 2 * Math.PI);
    //           ctx.stroke();
    //           ctx.setFillStyle(node.color == 1 ? 'black' : 'white');
    //           ctx.fill();

    //           if (node.note) {
    //             ctx.setFillStyle(node.color == 1 ? 'white' : 'black');
    //             ctx.setLineWidth(2);
    //             ctx.setFontSize(stone_size + 2);
    //             ctx.setTextBaseline('middle');
    //             ctx.setTextAlign('center');
    //             ctx.fillText(node.note, pos_x, pos_y);
    //           }
    //         }
    //       }
    //     }
    //   }

    //   ctx.draw();
    // },

    // setShowBackground: function(bool) {
    //   show_background = bool;
    // },

    // setShowCoordinate: function(bool) {
    //   if (bool == show_coordinate) {
    //     return;
    //   }

    //   show_coordinate = bool;
    //   if (bool) {
    //     ctx.setFillStyle('black');
    //     ctx.setLineWidth(2);
    //     ctx.setFontSize(stone_size);
    //     ctx.setTextBaseline('middle');
    //     ctx.setTextAlign('right');
    //     for (var i = 0; i != LINE_COUNT; ++i) {
    //       var text_rect_x = (i + 1) * unit_size;
    //       ctx.fillText("" + (i + 1), 0.5 * unit_size, text_rect_x);
    //     }
    //     ctx.setTextBaseline('bottom');
    //     ctx.setTextAlign('center');
    //     for (var i = 0; i != LINE_COUNT; ++i) {
    //       var text_rect_x = (i + 1) * unit_size;
    //       ctx.fillText(String.fromCharCode((65 + i)), text_rect_x, 0.5 * unit_size);
    //     }
    //   } else {
    //     ctx.clearRect(0, 0, width, 0.5*unit_size);
    //     ctx.clearRect(0, 0, 0.5*unit_size, width);
    //   }
    //   ctx.draw(true);
    // }, 

    pointToXY: function(x, y) {
      var pt = {
        'x': parseInt(x / unit_size - 0.5),
        'y': parseInt(y / unit_size - 0.5)
      };
      if (clip_pos_start > 0) {
        pt.x = pt.x + clip_pos_start - 1;
        pt.y = pt.y + clip_pos_start - 1;
      }
      if (pt.x >= LINE_COUNT) {
        --pt.x;
      }
      if (pt.y >= LINE_COUNT) {
        --pt.y;
      }
      console.log(pt);
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

    addStone: function(x, y, color, note, refresh = true) {
      if (clip_pos_start > 0) {
        if (x < clip_pos_start || y < clip_pos_start)
          return;
      }
      console.log('addStone', x, y, color);
      selected_x = -1;
      selected_y = -1;
      node_data[x][y] = { "color": color, "note": note };
      console.log(x, y);
      if (clip_pos_start > 0) { 
        x = (x - clip_pos_start + 2) * unit_size;
        y = (y - clip_pos_start + 2) * unit_size;
      } else {
        x = (x + 1) * unit_size;
        y = (y + 1) * unit_size;
      }
      
      ctx.clearRect(x - 0.5 * unit_size, y - 0.5 * unit_size, unit_size, unit_size);
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

      if (refresh)
        ctx.draw(true);
    },

    removeStone: function(x, y, refresh = true) {
      console.log('board.removeStone', x, y);
      let pos_x, pos_y;
      if (clip_pos_start > 0) {
        pos_x = (x - clip_pos_start + 1.5) * unit_size;
        pos_y = (y - clip_pos_start + 1.5) * unit_size;
      } else {
        pos_x = (x + 0.5) * unit_size;
        pos_y = (y + 0.5) * unit_size;
      }

      ctx.setFillStyle('white');
      ctx.clearRect(pos_x, pos_y, unit_size, unit_size);

      ctx.setLineWidth(1);
      ctx.setStrokeStyle('black');
      ctx.moveTo(pos_x, pos_y + 0.5*unit_size);
      ctx.lineTo(pos_x + unit_size, pos_y + 0.5*unit_size);
      ctx.stroke();

      ctx.moveTo(pos_x + 0.5 * unit_size, pos_y);
      ctx.lineTo(pos_x + 0.5 * unit_size, pos_y + unit_size);
      ctx.stroke();

      for (let i = 0; i != star_pos.length; ++i) {
        if (x != star_pos[i].x || y != star_pos[i].y) continue;
        if (clip_pos_start > 0) {
          x = (x - clip_pos_start + 2) * unit_size;
          y = (y - clip_pos_start + 2) * unit_size;
        } else {
          x = (x + 1) * unit_size;
          y = (y + 1) * unit_size;
        }
        ctx.setLineWidth(1);
        ctx.setStrokeStyle('black');
        ctx.beginPath();
        ctx.arc(x, y, 4, 0, 2 * Math.PI);
        ctx.stroke();
        ctx.setFillStyle('black');
        ctx.fill();

      }

      if (refresh)
        ctx.draw(true);
    },

    addText: function(x, y, text, refresh = true) {
      selected_x = -1;
      selected_y = -1;

      var node = node_data[x][y];
      if (node && node.color != -1) {
        this.addStone(x, y, node.color, text);
      } else {
        node_data[x][y] = { "color": -1, "note": text };

        if (clip_pos_start > 0) {
          x = (x - clip_pos_start + 2) * unit_size;
          y = (y - clip_pos_start + 2) * unit_size;
        } else {
          x = (x + 1) * unit_size;
          y = (y + 1) * unit_size;
        }
        ctx.clearRect(x - 0.5 * unit_size, y - 0.5 * unit_size, unit_size, unit_size);

        ctx.setFillStyle('black');
        ctx.setLineWidth(2);
        ctx.setFontSize(stone_size + 2);
        ctx.setTextBaseline('middle');
        ctx.setTextAlign('center');

        switch (text) {
          default: ctx.fillText(text, x, y);
        }
        
        if (refresh)
          ctx.draw(true);
      }
    },

    removeText: function(x, y) {
      if (clip_pos_start > 0) {
        x = (x - clip_pos_start + 1.5) * unit_size;
        y = (y - clip_pos_start + 1.5) * unit_size;
      } else {
        x = (x + 0.5) * unit_size;
        y = (y + 0.5) * unit_size;
      }
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

    },

    // /* {size:xxx, tmp_canvas_id:xxx, callback(res) {}} */
    // generateImage: function(obj) {
    //   const target_size = obj.size;
    //   const target_unit_size = target_size / (LINE_COUNT+1); 
    //   const target_stone_size = (target_unit_size - 4) / 2;
    //   const tmp_canvas_id = obj.tmp_canvas_id;
    //   var page = getCurrentPages();
    //   page = page[page.length-1];
    //   page.setData({ "target_img_size": target_size+'px' });

    //   var target_ctx = wx.createCanvasContext(tmp_canvas_id);
    //   // draw background
    //   if (show_background) {
    //     const pattern = ctx.createPattern('../images/Wood1.png', 'repeat');
    //     target_ctx.fillStyle = pattern;
    //   } else {
    //     target_ctx.setFillStyle('white');
    //   }
    //   target_ctx.fillRect(0, 0, target_size, target_size);
      

    //   // draw lines
    //   target_ctx.setStrokeStyle('black');
    //   target_ctx.setLineWidth(1);
    //   target_ctx.strokeRect(target_unit_size, target_unit_size, (target_size - 2 * target_unit_size), (target_size - 2 * target_unit_size));
    //   for (var i = 2; i != LINE_COUNT; ++i) {
    //     target_ctx.moveTo(i * target_unit_size, target_unit_size);
    //     target_ctx.lineTo(i * target_unit_size, target_size - target_unit_size);
    //     target_ctx.stroke();
    //   }
    //   for (var i = 2; i != LINE_COUNT; ++i) {
    //     target_ctx.moveTo(target_unit_size, i * target_unit_size);
    //     target_ctx.lineTo(target_size - target_unit_size, i * target_unit_size);
    //     target_ctx.stroke();
    //   }

    //   // draw coordinate
    //   target_ctx.setFillStyle('black');
    //   target_ctx.setLineWidth(2);
    //   target_ctx.setFontSize(target_stone_size);
    //   target_ctx.setTextBaseline('middle');
    //   target_ctx.setTextAlign('right');
    //   for (var i = 0; i != LINE_COUNT; ++i) {
    //     var text_rect_x = (i + 1) * target_unit_size;
    //     target_ctx.fillText("" + (i+1), 0.5 * target_unit_size, text_rect_x);
    //   }
    //   target_ctx.setTextBaseline('bottom');
    //   target_ctx.setTextAlign('center');
    //   for (var i = 0; i != LINE_COUNT; ++i) {
    //     var text_rect_x = (i + 1) * target_unit_size;
    //     target_ctx.fillText(String.fromCharCode((65 + i)), text_rect_x, 0.5 * target_unit_size);
    //   }

    //   // draw stone or text
    //   for (var i = 0; i != LINE_COUNT; ++i) {
    //     for (var j = 0; j != LINE_COUNT; ++j) {
    //       var node = node_data[i][j];
    //       if (node) {
    //         if (node.color == -1) { // text
    //           var pos_x = (i + 1) * target_unit_size;
    //           var pos_y = (j + 1) * target_unit_size;

    //           target_ctx.setFillStyle('black');
    //           target_ctx.setLineWidth(2);
    //           target_ctx.setFontSize(stone_size + 2);
    //           target_ctx.setTextBaseline('middle');
    //           target_ctx.setTextAlign('center');

    //           switch (node.note) {
    //             default: target_ctx.fillText(node.note, pos_x, pos_y);
    //           }
    //         } else {  // stone
    //           var pos_x = (i + 1) * target_unit_size;
    //           var pos_y = (j + 1) * target_unit_size;

    //           target_ctx.setLineWidth(1);
    //           target_ctx.setStrokeStyle('black');
    //           target_ctx.beginPath();
    //           target_ctx.arc(pos_x, pos_y, target_stone_size, 0, 2 * Math.PI);
    //           target_ctx.stroke();
    //           target_ctx.setFillStyle(node.color == 1 ? 'black' : 'white');
    //           target_ctx.fill();

    //           if (node.note) {
    //             target_ctx.setFillStyle(node.color == 1 ? 'white' : 'black');
    //             target_ctx.setLineWidth(2);
    //             target_ctx.setFontSize(target_stone_size + 2);
    //             target_ctx.setTextBaseline('middle');
    //             target_ctx.setTextAlign('center');
    //             target_ctx.fillText(node.note, pos_x, pos_y);
    //           }
    //         }
    //       }
    //     }
    //   }

    //   target_ctx.draw(false, (e) => {
    //     var callback = obj.callback;
    //     console.log('draw finished');
    //     wx.canvasToTempFilePath({
    //       x: 0,
    //       y: 0,
    //       width: target_size,
    //       height: target_size,
    //       destWidth: target_size,
    //       destHeight: target_size,
    //       canvasId: tmp_canvas_id,
    //       complete: (res) => {
    //         callback(res);
    //       }
    //     });
    //   });

    // }
  }
}