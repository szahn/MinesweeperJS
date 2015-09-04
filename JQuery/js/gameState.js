"use strict"

var STATE_OPEN = 1;
var STATE_LOST = 2;
var STATE_WON = 3;

var GameState = function(){
	this.gameState = STATE_OPEN;
}

GameState.prototype = {

	isGameOver: function(){
		return this.gameState !== STATE_OPEN;
	},

	reset: function(){
		this.gameState = STATE_OPEN;
	},

	onLost: function(callback){
		this.lostCallback = callback;
	},

	onWon: function(callback){
		this.wonCallback = callback;
	},

	gameOver: function(didWin){
		this.gameState = didWin ? STATE_WON : STATE_LOST;
		if (didWin && this.wonCallback) this.wonCallback();
		if (!didWin && this.lostCallback) this.lostCallback();
	}
}
