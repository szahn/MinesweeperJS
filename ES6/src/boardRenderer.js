class BoardRenderer{
	
	constructor(containerEl){
		this.containerEl = containerEl;
	}

	build(board){
		$(this.containerEl).empty();
		for (let y of board.rows){
			const row = this.buildRow(y);
			for (let x of board.columns){
				this.buildCell(row, x, y);
			}
		}
	}

	buildRow(y){
		const row = $(`<div id="row${y}" class="row">`);	
		$(this.containerEl).append(row);
		return row;
	}

	buildCell(row, x, y){
		let cell = $(`<div id="cell${x}x${y}" class="cell">`).attr({x: x, y: y});				
		const faces = $(`<div class="faces">`);
		const front = $(`<div class="front face"></div>`);
		const behind = $(`<div class="back face"></div>`);
		faces.append(front).append(behind);
		cell.append(faces);
		row.append(cell);
		return cell;
	}
	
	countNeighbors(board, x, y){
		let neighbors = 0;
		for (let x1 = Math.max(0, x - 1); x1 <= Math.min(x + 1, board.width - 1); x1++){
			for (let y1 = Math.max(0, y - 1); y1 <= Math.min(y + 1, board.height - 1); y1++){
				if ((board.getCell(x1, y1) & CELL_MINE) == CELL_MINE) neighbors += 1;
			}
		}
		
		return neighbors;
	}

	update(board){
		for (let y of board.rows){
			for (let x of board.columns){				
				this.updateCell(board, x, y);
			}
		}
	}
	
	updateCell(board, x, y){
		const cell = $(`#cell${x}x${y}`);
		const faces = $(cell.find(".faces"));
		const front = $(faces.find(".front"));
		const back = $(faces.find(".back"));
	
		const cellFlags = board.getCell(x, y);
		const isVisible = (cellFlags & CELL_VISIBLE) == CELL_VISIBLE; 
		const isFlagged = (cellFlags & CELL_FLAG) == CELL_FLAG; 
		
		let frontClasses = [];
		let backClasses = [];
		
		if (isVisible && !isFlagged){
			if ((cellFlags & CELL_MINE) == CELL_MINE)
			{
				backClasses.push("mine");
				backClasses.push("fa");
				backClasses.push("fa-bomb");
			}
			if ((cellFlags & CELL_EMPTY) == CELL_EMPTY)
			{
				frontClasses.push("empty");
				const neighbors = this.countNeighbors(board, x, y);
				const cellCurrentCount = parseInt(front.html(), 10); 
				if (cellCurrentCount !== neighbors){
					front.attr("count", neighbors);
					front.html(neighbors > 0 ? neighbors : "");
				}					
			}
		}
		
		if (isFlagged){
			backClasses.push("fa");
			backClasses.push("flag");
			backClasses.push("fa-flag");
		}
		
		let frontFaceClasses = front.attr("class").split(" ");
		for (let c of frontFaceClasses){
			if (c === "front" || c === "face") continue;
			if (frontClasses.indexOf(c) < 0){
				front.removeClass(c);
			}
		}				
	
		for (let c of frontClasses){
			if (frontFaceClasses.indexOf(c) < 0){
				front.addClass(c);
			}
		}				
	
	
		let classesAdded = 0;
		if (backClasses.length > 0){
			for (let c of backClasses){
				back.addClass(c);
				classesAdded += 1;
			}				
		}	
		
		if (classesAdded > 0) faces.addClass("flipped");
		
		let classesRemoved = 0;
		let backFaceClasses = back.attr("class").split(" ");
		for (let c of backFaceClasses){
			if (c === "back" || c === "face") continue;
			if (backClasses.indexOf(c) < 0){
				back.removeClass(c);
				classesRemoved += 1;
			}
		}	
		
		if (classesRemoved > 0){
			faces.removeClass("flipped");
		}
		
		
	}

}