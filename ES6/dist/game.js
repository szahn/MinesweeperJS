"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Game = (function () {
	function Game(opts) {
		_classCallCheck(this, Game);

		this.gameState = new GameState();
		this.boardRenderer = new BoardRenderer(opts.boardEl);
		this.boardConfig = new BoardConfig().beginner();
		this.mineCount = this.boardConfig.mines;
		this.gameInterface = new GameInterface(opts);
		this.boardEl = opts.boardEl;
		this.resetBtn = opts.resetBtn;
		this.configSelect = opts.configSelect;
	}

	_createClass(Game, [{
		key: "newGame",
		value: function newGame() {
			this.gameState.reset();
			this.board = new Board(this.boardConfig.width, this.boardConfig.height, this.boardConfig.mines);
			this.board.clear();
			this.board.build();
		}
	}, {
		key: "resetGame",
		value: function resetGame() {
			this.gameInterface.resizeBoard(this.boardConfig.width * 34, this.boardConfig.height * 34);
			this.newGame();
			this.boardRenderer.draw(this.board);
			this.mineCount = this.boardConfig.mines;
			this.gameInterface.updateMineCount(this.mineCount);
			this.gameInterface.reset();
		}
	}, {
		key: "setupUI",
		value: function setupUI() {
			var _this = this;

			this.gameInterface.disableRightClick(this.boardEl[0]);
			this.gameInterface.updateMineCount(this.mineCount);
			this.gameInterface.reset();

			var configs = new BoardConfig().configurations;
			for (var i = 0; i < configs.length; i++) {
				this.configSelect.append("<option>" + configs[i] + "</option>");
			}

			this.configSelect.on("change", function () {
				var boardType = _this.configSelect.val();
				_this.boardConfig = new BoardConfig()[boardType]();
				_this.resetGame();
			});

			this.resetBtn.click(function () {
				_this.resetGame();
			});

			this.gameState.onWon(function () {
				_this.gameInterface.onWon();
			});

			this.gameState.onLost(function () {
				_this.gameInterface.onLost();
			});

			this.boardEl.on("mousedown", ".cell", function (ev) {
				if (_this.gameState.isGameOver()) return;
				var cell = $(ev.target);
				cell.addClass("pressed");
			}).on("mouseup", ".cell", function (ev) {
				if (_this.gameState.isGameOver()) return;
				var cell = $(ev.target);
				cell.removeClass("pressed");
				var x = parseInt(cell.attr("x"), 10);
				var y = parseInt(cell.attr("y"), 10);
				if (ev.button === 0) {
					if (_this.board.hitCell(x, y)) {
						_this.gameState.gameOver(false);
					}
				} else {
					_this.mineCount += _this.board.flagCell(x, y);
				}

				_this.boardRenderer.draw(_this.board);
				_this.gameInterface.updateMineCount(_this.mineCount);
				if (_this.board.getUnflaggedMineCount() === 0) {
					_this.gameState.gameOver(true);
				}
			});
		}
	}]);

	return Game;
})();

$(function () {
	var game = new Game({
		boardEl: $(".board"),
		mineCountEl: $(".mine-count"),
		gameEl: $(".game"),
		resetBtn: $(".reset-game"),
		msgEl: $(".msg"),
		configSelect: $(".boardConfigs") });

	game.setupUI();
	game.resetGame();
});