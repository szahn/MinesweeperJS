"use strict";

var GameInterface = function(opts){
	this.mineCountEl = opts.mineCountEl;
	this.boardEl = opts.boardEl;
	this.gameEl = opts.gameEl;
	this.resetBtn = opts.resetBtn;
	this.msgEl = opts.msgEl;
}

GameInterface.prototype = {
	disableRightClick: function(el) {
		el.oncontextmenu = function(ev){
			 if (ev.stopPropagation)
	            ev.stopPropagation();

	        ev.cancelBubble = true;
	        return false;
		}	
	},

	resizeBoard: function(width, height){
		this.boardEl.empty().css({
			width: width,
			height: height
		});

		this.gameEl.css({
			width: width
		});		
	},

	updateMineCount: function(count){
		var countVal = Math.max	(0, parseInt(count, 10));
		var countText = countVal > 9 ? countVal : "0" + countVal;
		this.mineCountEl.html(countText);
	},

	reset: function(){
		this.resetBtn.removeClass("fa-frown-o").addClass("fa-smile-o");
		this.msgEl.html("").removeClass("green").removeClass("red");
	},

	onLost: function(){
		this.resetBtn.removeClass("fa-smile-o").addClass("fa-frown-o");
		this.msgEl.addClass("red").html("Game Over!");
	},

	onWon: function(){
		this.msgEl.addClass("green").html("Success");
	}

}