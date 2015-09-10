class GameInterface {

	constructor(opts){
		this.mineCountEl = opts.mineCountEl;
		this.boardEl = opts.boardEl;
		this.gameEl = opts.gameEl;
		this.resetBtn = opts.resetBtn;
		this.msgEl = opts.msgEl;
	}

	disableRightClick(el) {
		el.oncontextmenu = (ev) => {
			 if (ev.stopPropagation)
	            ev.stopPropagation();

	        ev.cancelBubble = true;
	        return false;
		}	
	}

	resizeBoard(width, height){
		this.boardEl.empty().css({
			width: width,
			height: height
		});

		this.gameEl.css({
			width: width
		});		
	}

	updateMineCount(count){
		let countVal = Math.max	(0, parseInt(count, 10));
		let countText = countVal > 9 ? countVal : "0" + countVal;
		this.mineCountEl.html(countText);
	}

	reset(){
		this.resetBtn.removeClass("fa-frown-o").addClass("fa-smile-o");
		this.msgEl.html("").removeClass("green").removeClass("red");
	}

	onLost(){
		this.resetBtn.removeClass("fa-smile-o").addClass("fa-frown-o");
		this.msgEl.addClass("red").html("Game Over!");
	}

	onWon(){
		this.msgEl.addClass("green").html("Success");
	}


}