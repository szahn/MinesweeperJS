"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var CELL_EMPTY = 1;
var CELL_MINE = 2;
var CELL_FLAG = 4;
var CELL_VISIBLE = 8;

var Board = (function () {
	function Board(width, height, mineCount) {
		_classCallCheck(this, Board);

		this.width = width;
		this.height = height;
		this.rows = this.numToArray(this.height);
		this.columns = this.numToArray(this.width);
		this.numberOfMines = mineCount;
		this.map = [];
		this.mines = [];
	}

	_createClass(Board, [{
		key: "forEachCell",
		value: function forEachCell(callback) {
			var _iteratorNormalCompletion = true;
			var _didIteratorError = false;
			var _iteratorError = undefined;

			try {
				for (var _iterator = this.columns[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
					var x = _step.value;
					var _iteratorNormalCompletion2 = true;
					var _didIteratorError2 = false;
					var _iteratorError2 = undefined;

					try {
						for (var _iterator2 = this.rows[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
							var y = _step2.value;

							callback(x, y);
						}
					} catch (err) {
						_didIteratorError2 = true;
						_iteratorError2 = err;
					} finally {
						try {
							if (!_iteratorNormalCompletion2 && _iterator2["return"]) {
								_iterator2["return"]();
							}
						} finally {
							if (_didIteratorError2) {
								throw _iteratorError2;
							}
						}
					}
				}
			} catch (err) {
				_didIteratorError = true;
				_iteratorError = err;
			} finally {
				try {
					if (!_iteratorNormalCompletion && _iterator["return"]) {
						_iterator["return"]();
					}
				} finally {
					if (_didIteratorError) {
						throw _iteratorError;
					}
				}
			}
		}
	}, {
		key: "numToArray",
		value: function numToArray(number) {
			var numbers = [];
			for (var n = 0; n < number; n++) {
				numbers.push(n);
			}
			return numbers;
		}
	}, {
		key: "getCell",
		value: function getCell(x, y) {
			return this.map[this.coordToCellIndex(x, y)];
		}
	}, {
		key: "setCell",
		value: function setCell(x, y, flags) {
			this.map[this.coordToCellIndex(x, y)] = flags;
		}
	}, {
		key: "coordToCellIndex",
		value: function coordToCellIndex(x, y) {
			return x + y * (this.width + 1);
		}
	}, {
		key: "clear",
		value: function clear() {
			var _this = this;

			this.mines = [];
			this.forEachCell(function (x, y) {
				_this.setCell(x, y, CELL_EMPTY);
			});
		}
	}, {
		key: "haveAllMinesBeenFlagged",
		value: function haveAllMinesBeenFlagged() {
			var _iteratorNormalCompletion3 = true;
			var _didIteratorError3 = false;
			var _iteratorError3 = undefined;

			try {
				for (var _iterator3 = this.mines[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
					var mine = _step3.value;

					if ((this.getCell(mine[0], mine[1]) & CELL_FLAG) != CELL_FLAG) {
						return false;
					}
				}
			} catch (err) {
				_didIteratorError3 = true;
				_iteratorError3 = err;
			} finally {
				try {
					if (!_iteratorNormalCompletion3 && _iterator3["return"]) {
						_iterator3["return"]();
					}
				} finally {
					if (_didIteratorError3) {
						throw _iteratorError3;
					}
				}
			}

			return true;
		}
	}, {
		key: "revealMines",
		value: function revealMines() {
			var _this2 = this;

			this.forEachCell(function (x, y) {
				var flags = _this2.getCell(x, y);
				if ((flags & CELL_MINE) == CELL_MINE) _this2.setCell(x, y, flags | CELL_VISIBLE);
			});
		}
	}, {
		key: "floodFill",
		value: function floodFill(x, y, checked) {
			var flags = this.getCell(x, y);
			if ((flags & CELL_MINE) == CELL_MINE) return;
			if (checked[x] && checked[x][y] == true) return;

			this.setCell(x, y, flags | CELL_VISIBLE);

			if (!checked[x]) checked[x] = [];
			checked[x][y] = true;

			for (var x1 = Math.max(0, x - 1); x1 < Math.min(x + 1, this.width); x1++) {
				for (var y1 = Math.max(0, y - 1); y1 < Math.min(y + 1, this.width); y1++) {
					if ((this.getCell(x1, y1) & CELL_MINE) == CELL_MINE) return;
				}
			}

			if (x > 0) this.floodFill(x - 1, y, checked);
			if (x < this.width - 1) this.floodFill(x + 1, y, checked);
			if (y > 0) this.floodFill(x, y - 1, checked);
			if (y < this.height - 1) this.floodFill(x, y + 1, checked);
		}
	}, {
		key: "hitCell",
		value: function hitCell(x, y) {
			var flags = this.getCell(x, y);

			if ((flags & CELL_MINE) == CELL_MINE) {
				this.revealMines();
				return true;
			}

			if ((flags & CELL_FLAG) == CELL_FLAG) {
				this.setCell(x, y, flags ^ CELL_FLAG);
			}

			if ((flags & CELL_EMPTY) == CELL_EMPTY) {
				this.floodFill(x, y, []);
			}

			return false;
		}
	}, {
		key: "getUnflaggedMineCount",
		value: function getUnflaggedMineCount() {
			var _this3 = this;

			var count = 0;
			this.forEachCell(function (x, y) {
				var flags = _this3.getCell(x, y);
				if ((flags & CELL_MINE) == CELL_MINE && !((flags & CELL_FLAG) == CELL_FLAG)) {
					count += 1;
				}
			});

			return count;
		}
	}, {
		key: "flagCell",
		value: function flagCell(x, y) {
			var flags = this.getCell(x, y);

			if ((flags & CELL_VISIBLE) == CELL_VISIBLE) return 0;

			if ((flags & CELL_FLAG) == CELL_FLAG) {
				this.setCell(x, y, flags ^ CELL_FLAG);
				return 1;
			} else {
				this.setCell(x, y, flags | CELL_FLAG);
				return -1;
			}
		}
	}, {
		key: "build",
		value: function build() {
			this.buildCluster(0, 6, 3);
			if (this.mines.length < this.numberOfMines) {
				this.build();
			}
		}
	}, {
		key: "getRandomCells",
		value: function getRandomCells(minX, minY, maxX, maxY, flag) {
			var points = [];
			for (var x = minX; x <= maxX; x++) {
				for (var y = minY; y <= maxY; y++) {
					if (this.getCell(x, y) === flag) {
						points.push([x, y]);
					}
				}
			}

			if (points.length == 0) return [];
			var index = 0 + Math.round(Math.random() * (points.length - 1));
			return points[index];
		}
	}, {
		key: "getPossiblePoints",
		value: function getPossiblePoints(lastPoint, minX, minY, maxX, maxY) {
			function oneOrZero() {
				return Math.random() * 100 > 50 ? 1 : 0;
			}

			var points = [];
			for (var x = Math.max(minX, lastPoint[0] - oneOrZero()); x <= Math.min(maxX, lastPoint[0] + oneOrZero()); x++) {
				for (var y = Math.max(minY, lastPoint[1] - oneOrZero()); y <= Math.min(maxY, lastPoint[1] + oneOrZero()); y++) {
					if (x != lastPoint[0] && y != lastPoint[1] && this.getCell(x, y) === CELL_EMPTY) {
						points.push([x, y]);
					}
				}
			}

			return points;
		}
	}, {
		key: "traverseCluster",
		value: function traverseCluster(lastPoint, minX, minY, maxX, maxY, minesRemaining) {
			if (this.mines.length === this.numberOfMines || minesRemaining < 1) return;

			var points = this.getPossiblePoints(lastPoint, minX, minY, maxX, maxY);
			if (points.length === 0) return;

			var pointIndex = Math.floor(Math.random() * (points.length - 1));
			var nextPoint = points[pointIndex];
			this.placeMine(nextPoint[0], nextPoint[1]);
			this.traverseCluster(nextPoint, minX, minY, maxX, maxY, minesRemaining - 1);
		}
	}, {
		key: "buildCluster",
		value: function buildCluster(border, clusterSize, minesPerCluster) {
			var clusterSizeHalf = Math.round(clusterSize / 2);
			var maxX = this.width - (1 + border);
			var maxY = this.height - (1 + border);
			var origin = this.getRandomCells(border, border, maxX, maxY, CELL_EMPTY);
			this.placeMine(origin[0], origin[1]);
			this.traverseCluster(origin, Math.max(border, origin[0] - clusterSizeHalf), Math.max(border, origin[1] - clusterSizeHalf), Math.min(maxX, origin[0] + clusterSizeHalf), Math.min(maxY, origin[1] + clusterSizeHalf), minesPerCluster - 1);
		}
	}, {
		key: "placeMine",
		value: function placeMine(x, y) {
			if (this.getCell(x, y) !== CELL_EMPTY) return;

			this.setCell(x, y, CELL_MINE);
			this.mines.push([x, y]);
		}
	}]);

	return Board;
})();