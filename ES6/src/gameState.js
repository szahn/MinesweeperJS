const STATE_OPEN = 1;
const STATE_LOST = 2;
const STATE_WON = 3;

class GameState{

	constructor(){
		this.gameState = STATE_OPEN;
	}

	isGameOver(){
		return this.gameState !== STATE_OPEN;
	}

	reset(){
		this.gameState = STATE_OPEN;
	}

	onLost(callback){
		this.lostCallback = callback;
	}

	onWon(callback){
		this.wonCallback = callback;
	}

	gameOver(didWin){
		this.gameState = didWin ? STATE_WON : STATE_LOST;
		if (didWin && this.wonCallback) this.wonCallback();
		if (!didWin && this.lostCallback) this.lostCallback();
	}


}
