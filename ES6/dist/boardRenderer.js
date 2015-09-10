"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var BoardRenderer = (function () {
	function BoardRenderer(containerEl) {
		_classCallCheck(this, BoardRenderer);

		this.containerEl = containerEl;
	}

	_createClass(BoardRenderer, [{
		key: "draw",
		value: function draw(board) {
			var _iteratorNormalCompletion = true;
			var _didIteratorError = false;
			var _iteratorError = undefined;

			try {
				for (var _iterator = board.rows[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
					var y = _step.value;

					this.drawRow(board, y);
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
		key: "drawRow",
		value: function drawRow(board, y) {
			var rowId = "row" + y;
			var existingRowEl = $("#" + rowId);
			var existingRow = existingRowEl.length == 1 ? existingRowEl : null;
			var row = existingRow || $("<div id=\"" + rowId + "\" class=\"row\">");
			var _iteratorNormalCompletion2 = true;
			var _didIteratorError2 = false;
			var _iteratorError2 = undefined;

			try {
				for (var _iterator2 = board.columns[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
					var x = _step2.value;

					this.drawCell(board, row, x, y);
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

			if (!existingRow) $(this.containerEl).append(row);
		}
	}, {
		key: "drawCell",
		value: function drawCell(board, row, x, y) {
			var cellFlags = board.getCell(x, y);
			var cellId = "cell" + x + "x" + y;
			var existingCellEl = $("#" + cellId);
			var existingCell = existingCellEl.length == 1 ? existingCellEl : null;
			var cell = existingCell || $("<div id=\"" + cellId + "\" class=\"cell\">").attr({ x: x, y: y });
			var isVisible = (cellFlags & CELL_VISIBLE) == CELL_VISIBLE;
			var isFlagged = (cellFlags & CELL_FLAG) == CELL_FLAG;
			if (isVisible && !isFlagged) {
				if ((cellFlags & CELL_MINE) == CELL_MINE) {
					cell.removeClass("flag empty fa fa-flag").addClass("mine fa fa-bomb");
				}
				if ((cellFlags & CELL_EMPTY) == CELL_EMPTY) {
					cell.removeClass("mine flag fa-bomb fa-flag fa").addClass("empty");

					var neighbors = 0;
					for (var x1 = Math.max(0, x - 1); x1 <= Math.min(x + 1, board.width - 1); x1++) {
						for (var y1 = Math.max(0, y - 1); y1 <= Math.min(y + 1, board.height - 1); y1++) {
							if ((board.getCell(x1, y1) & CELL_MINE) == CELL_MINE) neighbors += 1;
						}
					}

					cell.attr("count", neighbors);
					if (neighbors > 0) {
						cell.html(neighbors);
					} else {
						cell.empty();
					}
				}
			} else if (!isVisible && !isFlagged) {
				cell.removeClass("flag fa fa-flag empty mine fa-bomb");
			}

			if (isFlagged) {
				cell.removeClass("empty mine fa-bomb").addClass("flag fa fa-flag");
			}

			if (!existingCell) row.append(cell);
		}
	}]);

	return BoardRenderer;
})();