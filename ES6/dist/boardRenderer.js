"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var BoardRenderer = (function () {
	function BoardRenderer(containerEl) {
		_classCallCheck(this, BoardRenderer);

		this.containerEl = containerEl;
	}

	_createClass(BoardRenderer, [{
		key: "build",
		value: function build(board) {
			$(this.containerEl).empty();
			var _iteratorNormalCompletion = true;
			var _didIteratorError = false;
			var _iteratorError = undefined;

			try {
				for (var _iterator = board.rows[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
					var y = _step.value;

					var row = this.buildRow(y);
					var _iteratorNormalCompletion2 = true;
					var _didIteratorError2 = false;
					var _iteratorError2 = undefined;

					try {
						for (var _iterator2 = board.columns[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
							var x = _step2.value;

							this.buildCell(row, x, y);
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
		key: "buildRow",
		value: function buildRow(y) {
			var row = $("<div id=\"row" + y + "\" class=\"row\">");
			$(this.containerEl).append(row);
			return row;
		}
	}, {
		key: "buildCell",
		value: function buildCell(row, x, y) {
			var cell = $("<div id=\"cell" + x + "x" + y + "\" class=\"cell\">").attr({ x: x, y: y });
			var faces = $("<div class=\"faces\">");
			var front = $("<div class=\"front face\"></div>");
			var behind = $("<div class=\"back face\"></div>");
			faces.append(front).append(behind);
			cell.append(faces);
			row.append(cell);
			return cell;
		}
	}, {
		key: "countNeighbors",
		value: function countNeighbors(board, x, y) {
			var neighbors = 0;
			for (var x1 = Math.max(0, x - 1); x1 <= Math.min(x + 1, board.width - 1); x1++) {
				for (var y1 = Math.max(0, y - 1); y1 <= Math.min(y + 1, board.height - 1); y1++) {
					if ((board.getCell(x1, y1) & CELL_MINE) == CELL_MINE) neighbors += 1;
				}
			}

			return neighbors;
		}
	}, {
		key: "update",
		value: function update(board) {
			var _iteratorNormalCompletion3 = true;
			var _didIteratorError3 = false;
			var _iteratorError3 = undefined;

			try {
				for (var _iterator3 = board.rows[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
					var y = _step3.value;
					var _iteratorNormalCompletion4 = true;
					var _didIteratorError4 = false;
					var _iteratorError4 = undefined;

					try {
						for (var _iterator4 = board.columns[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
							var x = _step4.value;

							this.updateCell(board, x, y);
						}
					} catch (err) {
						_didIteratorError4 = true;
						_iteratorError4 = err;
					} finally {
						try {
							if (!_iteratorNormalCompletion4 && _iterator4["return"]) {
								_iterator4["return"]();
							}
						} finally {
							if (_didIteratorError4) {
								throw _iteratorError4;
							}
						}
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
		}
	}, {
		key: "updateCell",
		value: function updateCell(board, x, y) {
			var cell = $("#cell" + x + "x" + y);
			var faces = $(cell.find(".faces"));
			var front = $(faces.find(".front"));
			var back = $(faces.find(".back"));

			var cellFlags = board.getCell(x, y);
			var isVisible = (cellFlags & CELL_VISIBLE) == CELL_VISIBLE;
			var isFlagged = (cellFlags & CELL_FLAG) == CELL_FLAG;

			var frontClasses = [];
			var backClasses = [];

			if (isVisible && !isFlagged) {
				if ((cellFlags & CELL_MINE) == CELL_MINE) {
					backClasses.push("mine");
					backClasses.push("fa");
					backClasses.push("fa-bomb");
				}
				if ((cellFlags & CELL_EMPTY) == CELL_EMPTY) {
					frontClasses.push("empty");
					var neighbors = this.countNeighbors(board, x, y);
					var cellCurrentCount = parseInt(front.html(), 10);
					if (cellCurrentCount !== neighbors) {
						front.attr("count", neighbors);
						front.html(neighbors > 0 ? neighbors : "");
					}
				}
			}

			if (isFlagged) {
				backClasses.push("fa");
				backClasses.push("flag");
				backClasses.push("fa-flag");
			}

			var frontFaceClasses = front.attr("class").split(" ");
			var _iteratorNormalCompletion5 = true;
			var _didIteratorError5 = false;
			var _iteratorError5 = undefined;

			try {
				for (var _iterator5 = frontFaceClasses[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
					var c = _step5.value;

					if (c === "front" || c === "face") continue;
					if (frontClasses.indexOf(c) < 0) {
						front.removeClass(c);
					}
				}
			} catch (err) {
				_didIteratorError5 = true;
				_iteratorError5 = err;
			} finally {
				try {
					if (!_iteratorNormalCompletion5 && _iterator5["return"]) {
						_iterator5["return"]();
					}
				} finally {
					if (_didIteratorError5) {
						throw _iteratorError5;
					}
				}
			}

			var _iteratorNormalCompletion6 = true;
			var _didIteratorError6 = false;
			var _iteratorError6 = undefined;

			try {
				for (var _iterator6 = frontClasses[Symbol.iterator](), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
					var c = _step6.value;

					if (frontFaceClasses.indexOf(c) < 0) {
						front.addClass(c);
					}
				}
			} catch (err) {
				_didIteratorError6 = true;
				_iteratorError6 = err;
			} finally {
				try {
					if (!_iteratorNormalCompletion6 && _iterator6["return"]) {
						_iterator6["return"]();
					}
				} finally {
					if (_didIteratorError6) {
						throw _iteratorError6;
					}
				}
			}

			var classesAdded = 0;
			if (backClasses.length > 0) {
				var _iteratorNormalCompletion7 = true;
				var _didIteratorError7 = false;
				var _iteratorError7 = undefined;

				try {
					for (var _iterator7 = backClasses[Symbol.iterator](), _step7; !(_iteratorNormalCompletion7 = (_step7 = _iterator7.next()).done); _iteratorNormalCompletion7 = true) {
						var c = _step7.value;

						back.addClass(c);
						classesAdded += 1;
					}
				} catch (err) {
					_didIteratorError7 = true;
					_iteratorError7 = err;
				} finally {
					try {
						if (!_iteratorNormalCompletion7 && _iterator7["return"]) {
							_iterator7["return"]();
						}
					} finally {
						if (_didIteratorError7) {
							throw _iteratorError7;
						}
					}
				}
			}

			if (classesAdded > 0) faces.addClass("flipped");

			var classesRemoved = 0;
			var backFaceClasses = back.attr("class").split(" ");
			var _iteratorNormalCompletion8 = true;
			var _didIteratorError8 = false;
			var _iteratorError8 = undefined;

			try {
				for (var _iterator8 = backFaceClasses[Symbol.iterator](), _step8; !(_iteratorNormalCompletion8 = (_step8 = _iterator8.next()).done); _iteratorNormalCompletion8 = true) {
					var c = _step8.value;

					if (c === "back" || c === "face") continue;
					if (backClasses.indexOf(c) < 0) {
						back.removeClass(c);
						classesRemoved += 1;
					}
				}
			} catch (err) {
				_didIteratorError8 = true;
				_iteratorError8 = err;
			} finally {
				try {
					if (!_iteratorNormalCompletion8 && _iterator8["return"]) {
						_iterator8["return"]();
					}
				} finally {
					if (_didIteratorError8) {
						throw _iteratorError8;
					}
				}
			}

			if (classesRemoved > 0) {
				faces.removeClass("flipped");
			}
		}
	}]);

	return BoardRenderer;
})();