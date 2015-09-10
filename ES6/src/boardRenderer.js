class BoardRenderer{
	
	constructor(containerEl){
		this.containerEl = containerEl;
	}

	draw(board){
		for (let y of board.rows){
			this.drawRow(board, y);
		}
	}

	drawRow(board, y){
		let rowId = `row${y}`;
		let existingRowEl = $(`#${rowId}`);
		let existingRow = existingRowEl.length == 1 ? existingRowEl : null;
		let row = existingRow || $(`<div id="${rowId}" class="row">`);
		for (let x of board.columns){
			this.drawCell(board, row, x, y);
		}

		if (!existingRow) $(this.containerEl).append(row);
	}

	drawCell(board, row, x, y){
		let cellFlags = board.getCell(x, y);
		let cellId = `cell${x}x${y}`;
		let existingCellEl = $(`#${cellId}`);
		let existingCell = existingCellEl.length == 1 ? existingCellEl : null;
		let cell = existingCell || $(`<div id="${cellId}" class="cell">`).attr({x: x, y: y});				
		let isVisible = (cellFlags & CELL_VISIBLE) == CELL_VISIBLE; 
		let isFlagged = (cellFlags & CELL_FLAG) == CELL_FLAG; 
		if (isVisible && !isFlagged){
			if ((cellFlags & CELL_MINE) == CELL_MINE)
			{
				cell.removeClass("flag empty fa fa-flag").addClass("mine fa fa-bomb");
			}				
			if ((cellFlags & CELL_EMPTY) == CELL_EMPTY)
			{
				cell.removeClass("mine flag fa-bomb fa-flag fa").addClass("empty");
				
				let neighbors = 0;
				for (let x1 = Math.max(0, x - 1); x1 <= Math.min(x + 1, board.width - 1); x1++){
					for (let y1 = Math.max(0, y - 1); y1 <= Math.min(y + 1, board.height - 1); y1++){
						if ((board.getCell(x1, y1) & CELL_MINE) == CELL_MINE) neighbors += 1;
					}
				}

				cell.attr("count", neighbors);
				if (neighbors > 0){
					cell.html(neighbors)
				}
				else{
					cell.empty();	
				}
			}
		}
		else if (!isVisible && !isFlagged){
			cell.removeClass("flag fa fa-flag empty mine fa-bomb");
		}

		if (isFlagged){
			cell.removeClass("empty mine fa-bomb").addClass("flag fa fa-flag");
		}

		if (!existingCell) row.append(cell);
	}
}