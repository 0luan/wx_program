node = [];
for (let i = 0; i != 19; ++i)
	node.push(new Array(19));

result = {};
unit_size = 40;
stone_size = 18;
window.onload=function() {
	result.title = "title";
	result.content = "content";
	result.board = {};
	result.board.info = {};
	result.board.answer = [];
	result.board.stone = {black:[], white:[]};
	result.board.predict = {};

	var c=document.getElementById("board");
	var ctx=c.getContext("2d");
	var cache = [];
	
	xyToStr = function(x, y) {
		return String.fromCharCode(65+x) + (y+1);
	}
	
	$('#add_correct').click(function() {
		addCacheToPredict(true);
	});
	$('#add_error').click(function() {
		addCacheToPredict(false);
	});
	
	$('clear_cache').click(function() {
		cache = [];
		$('#cache_predict').text(JSON.stringify(cache));
	});
	
	$("#board").click(function(event){
		var mode = parseInt($('input:radio[name="mode_sel"]:checked').val());	

        //标准的获取鼠标点击相对于canvas画布的坐标公式
        var x = event.pageX - c.getBoundingClientRect().left;
        var y = event.pageY - c.getBoundingClientRect().top;
		var text = $('#text').val();
		var color = $('input:radio[name="color_sel"]:checked').val();		
		x = parseInt((x-20) / 40);
		y = parseInt((y-20) / 40);
		switch (mode) {
			case 0:
				if (color == 0) 
					result.board.stone.white.push({"x":x, "y":y});
				else
					result.board.stone.black.push({"x":x, "y":y});
			break;
			case 1:
				result.board.answer.push({"x":x, "y":y, "color":color, "text":text});
				if (color == 0)
					$('input[name="color_sel"]')[0].checked = true;
				else
					$('input[name="color_sel"]')[1].checked = true;
			break;
			case 2:
				let node = {"x":x, "y":y, "color":color, "text":text};
				let dom = $('<li class="predict_node"></li>');
				dom.text(JSON.stringify(node));
				dom.data('node', node);
				
				cache.push(node);
				if (color == 0)
					$('input[name="color_sel"]')[0].checked = true;
				else
					$('input[name="color_sel"]')[1].checked = true;
				$('#cache_predict').append(dom);
			break;
		}


        console.log(x, y);
		addStone(x, y, color, mode==2?''+cache.length:'');

		$('#result').text(JSON.stringify(result));
		$('#text').val('');
    });
	
	$('#cache_predict').on('click', 'li', function() {
		if ($(this).hasClass('selected')) $(this).removeClass('selected');
		$(this).addClass('selected').siblings().removeClass('selected');
	});	
	$('#set_text').click(function() {
		let node = $('li.selected');
		if (node.length == 0) {
			result.content = $('#text').val();
			$('#result').text(JSON.stringify(result));
		} else {
			let d = node.data('node');
			d.text = $('#text').val();
			node.text(JSON.stringify(d));
		}
		$('#text').val('');
	});
	
	addCacheToPredict = function(is_correct) {
		let cur = result.board.predict;
		for (let i = 0; i != cache.length; ++i) {
			let pos = xyToStr(cache[i].x, cache[i].y);
			let is_input = !!!(i%2);
			if (is_input) {
				if (!cur[pos]) {
					let tmp = {};
					if (cache[i].text) tmp.text = cache[i].text;
					if (i == (cache.length - 1) && is_correct)
						tmp.correct = true;
					cur[pos] = tmp;
				}
				cur = cur[pos];
			} else {
				let tmp = {x: cache[i].x, y: cache[i].y, text: cache[i].text};
				if (i == (cache.length - 1) && !is_correct)
					tmp.correct = false;
				cur.response = tmp;
			}
		}
		
		if (is_correct && result.board.answer.length == 0) {
			for (let i = 0; i != cache.length; ++i)
				result.board.answer.push({x:cache[i].x, y:cache[i].y, text:cache[i].text});
		}
		
		cache = [];
		$('#cache_predict').text(JSON.stringify(cache));
		$('#result').text(JSON.stringify(result));
	}
	
	addStone = function(x, y, color, note) {
      x = (x+1)*unit_size+2;
      y = (y+1)*unit_size+2;
      console.log(x, y);

      ctx.lineWidth=1;
      ctx.strokeStyle = '#ffffff';

	  ctx.fillStyle = color==1?'black':'white';
      ctx.beginPath();
      ctx.arc(x, y, stone_size, 0, 2*Math.PI);
      ctx.fill();
      ctx.fill();
	  ctx.closePath();

      if (note) {
        ctx.fillStyle = (color==1?'white':'black');
        ctx.lineWidth = 2;
        ctx.fontSize = 22;
        ctx.textBaseLine = 'middle';
        ctx.textAlign = 'center';
        ctx.fillText(note, x, y);
      }
    }
	
	restoreBoard = function() {
		node = [];
		for (let i = 0; i != 19; ++i)
			node.push(new Array(19));
	
		ctx.clearRect(0,0,800,800);
		for (let i = 0; i != result.board.stone.black.length; ++i) {
			addStone(result.board.stone.black[i].x, result.board.stone.black[i].y, 1, '');
		}
		for (let i = 0; i != result.board.stone.white.length; ++i) {
			addStone(result.board.stone.white[i].x, result.board.stone.white[i].y, 1, '');
		}
		
	}
	
}