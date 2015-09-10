"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var GameInterface = (function () {
	function GameInterface(opts) {
		_classCallCheck(this, GameInterface);

		this.mineCountEl = opts.mineCountEl;
		this.boardEl = opts.boardEl;
		this.gameEl = opts.gameEl;
		this.resetBtn = opts.resetBtn;
		this.msgEl = opts.msgEl;
	}

	_createClass(GameInterface, [{
		key: "disableRightClick",
		value: function disableRightClick(el) {
			el.oncontextmenu = function (ev) {
				if (ev.stopPropagation) ev.stopPropagation();

				ev.cancelBubble = true;
				return false;
			};
		}
	}, {
		key: "resizeBoard",
		value: function resizeBoard(width, height) {
			this.boardEl.empty().css({
				width: width,
				height: height
			});

			this.gameEl.css({
				width: width
			});
		}
	}, {
		key: "updateMineCount",
		value: function updateMineCount(count) {
			var countVal = Math.max(0, parseInt(count, 10));
			var countText = countVal > 9 ? countVal : "0" + countVal;
			this.mineCountEl.html(countText);
		}
	}, {
		key: "reset",
		value: function reset() {
			this.resetBtn.removeClass("fa-frown-o").addClass("fa-smile-o");
			this.msgEl.html("").removeClass("green").removeClass("red");
		}
	}, {
		key: "onLost",
		value: function onLost() {
			this.resetBtn.removeClass("fa-smile-o").addClass("fa-frown-o");
			this.msgEl.addClass("red").html("Game Over!");
		}
	}, {
		key: "onWon",
		value: function onWon() {
			this.msgEl.addClass("green").html("Success");
		}
	}]);

	return GameInterface;
})();