class Game{

	constructor(opts){
		this.gameState = new GameState();
		this.boardRenderer = new BoardRenderer(opts.boardEl);
		this.boardConfig = new BoardConfig().beginner();
		this.mineCount = this.boardConfig.mines; 
		this.gameInterface = new GameInterface(opts);
		this.boardEl = opts.boardEl;
		this.resetBtn = opts.resetBtn;
		this.configSelect = opts.configSelect; 
	}

	newGame(){
		this.gameState.reset();
		this.board = new Board(this.boardConfig.width, this.boardConfig.height, this.boardConfig.mines);
		this.board.clear();
		this.board.build();
	}

	resetGame(){
		this.gameInterface.resizeBoard(this.boardConfig.width * 34, this.boardConfig.height * 34);
		this.newGame();
		this.boardRenderer.draw(this.board);
		this.mineCount = this.boardConfig.mines; 
		this.gameInterface.updateMineCount(this.mineCount);
		this.gameInterface.reset();
	}

	setupUI(){
		this.gameInterface.disableRightClick(this.boardEl[0]);
		this.gameInterface.updateMineCount(this.mineCount);
		this.gameInterface.reset();

		let configs = new BoardConfig().configurations;
		for (let i = 0; i < configs.length; i++){
			this.configSelect.append(`<option>${configs[i]}</option>`);
		}

		this.configSelect.on("change", () => {
			let boardType = this.configSelect.val();
			this.boardConfig = new BoardConfig()[boardType]();
			this.resetGame();			
		});

		this.resetBtn.click(() => {			
			this.resetGame();
		});

		this.gameState.onWon(() => {			
			this.gameInterface.onWon();
		});

		this.gameState.onLost(() => {			
			this.gameInterface.onLost();
		});

		this.boardEl.on("mousedown", ".cell", ev =>{
			if (this.gameState.isGameOver()) return;
			let cell = $(ev.target);
			cell.addClass("pressed");
		}).on("mouseup", ".cell", ev => {
			if (this.gameState.isGameOver()) return;
			let cell = $(ev.target);
			cell.removeClass("pressed");
			let x = parseInt(cell.attr("x"), 10);
			let y = parseInt(cell.attr("y"), 10);
			if (ev.button === 0){
				if (this.board.hitCell(x, y)){
					this.gameState.gameOver(false);
				}
			}
			else{
				this.mineCount += this.board.flagCell(x, y);
			}
			
			this.boardRenderer.draw(this.board);
			this.gameInterface.updateMineCount(this.mineCount);
			if (this.board.getUnflaggedMineCount() === 0) {
				this.gameState.gameOver(true);
			}
		});
	}
}

$(function(){
	let game = new Game({
		boardEl: $(".board"), 
		mineCountEl: $(".mine-count"), 
		gameEl: $(".game"),
		resetBtn: $(".reset-game"),
		msgEl: $(".msg"),
		configSelect: $(".boardConfigs")});

	game.setupUI();
	game.resetGame();
});