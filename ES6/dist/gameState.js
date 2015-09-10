"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var STATE_OPEN = 1;
var STATE_LOST = 2;
var STATE_WON = 3;

var GameState = (function () {
	function GameState() {
		_classCallCheck(this, GameState);

		this.gameState = STATE_OPEN;
	}

	_createClass(GameState, [{
		key: "isGameOver",
		value: function isGameOver() {
			return this.gameState !== STATE_OPEN;
		}
	}, {
		key: "reset",
		value: function reset() {
			this.gameState = STATE_OPEN;
		}
	}, {
		key: "onLost",
		value: function onLost(callback) {
			this.lostCallback = callback;
		}
	}, {
		key: "onWon",
		value: function onWon(callback) {
			this.wonCallback = callback;
		}
	}, {
		key: "gameOver",
		value: function gameOver(didWin) {
			this.gameState = didWin ? STATE_WON : STATE_LOST;
			if (didWin && this.wonCallback) this.wonCallback();
			if (!didWin && this.lostCallback) this.lostCallback();
		}
	}]);

	return GameState;
})();