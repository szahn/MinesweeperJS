"use strict";

var Game = function(opts){
	this.gameState = new GameState();
	this.boardConfig = new BoardConfig().beginner();
	this.mineCount = this.boardConfig.mines; 
	this.gameInterface = new GameInterface(opts);
	this.boardEl = opts.boardEl;
	this.resetBtn = opts.resetBtn;
	this.configSelect = opts.configSelect; 
}

Game.prototype = {
	newGame: function(){
		this.gameState.reset();
		this.board = new Board(this.boardConfig.width, this.boardConfig.height, this.boardConfig.mines);
		this.board.clear();
		this.board.build();
	},

	resetGame: function(){
		this.gameInterface.resizeBoard(this.boardConfig.width * 34, this.boardConfig.height * 34);
		this.newGame();
		this.board.draw(this.boardEl);
		this.mineCount = this.boardConfig.mines; 
		this.gameInterface.updateMineCount(this.mineCount);
		this.gameInterface.reset();
	},

	setupUI: function(){
		var that = this;
		this.gameInterface.disableRightClick(this.boardEl[0]);
		this.gameInterface.updateMineCount(this.mineCount);
		this.gameInterface.reset();

		var configs = new BoardConfig().configurations;
		for (var i = 0; i < configs.length; i++){
			this.configSelect.append("<option>" + configs[i] + "</option>");
		}

		this.configSelect.on("change", function(){
			var boardType = that.configSelect.val();
			that.boardConfig = new BoardConfig()[boardType]();
			that.resetGame();			
		});

		this.resetBtn.click(function(){			
			that.resetGame();
		});

		this.gameState.onWon(function(){			
			that.gameInterface.onWon();
		});

		this.gameState.onLost(function(){			
			that.gameInterface.onLost();
		});

		this.boardEl.on("mousedown", ".cell", function(ev){
			if (that.gameState.isGameOver()) return;
			var cell = $(ev.target);
			cell.addClass("pressed");
		}).on("mouseup", ".cell", function(ev){
			if (that.gameState.isGameOver()) return;
			var cell = $(ev.target);
			cell.removeClass("pressed");
			var x = parseInt(cell.attr("x"), 10);
			var y = parseInt(cell.attr("y"), 10);
			if (ev.button === 0){
				if (that.board.hitCell(x, y)){
					that.gameState.gameOver(false);
				}
			}
			else{
				that.mineCount += that.board.flagCell(x, y);
			}
			
			that.board.draw(that.boardEl);
			that.gameInterface.updateMineCount(that.mineCount);
			if (that.board.getUnflaggedMineCount() === 0) {
				that.gameState.gameOver(true);
			}
		});


	}
}

$(function(){
	var game = new Game({
		boardEl: $(".board"), 
		mineCountEl: $(".mine-count"), 
		gameEl: $(".game"),
		resetBtn: $(".reset-game"),
		msgEl: $(".msg"),
		configSelect: $(".boardConfigs")});

	game.setupUI();
	game.resetGame();
});