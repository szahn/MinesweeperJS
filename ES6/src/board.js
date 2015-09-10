const CELL_EMPTY = 1;
const CELL_MINE = 2;
const CELL_FLAG = 4;
const CELL_VISIBLE = 8;

class Board{

	constructor(width, height, mineCount){
		this.width = width;
		this.height = height;
		this.numberOfMines = mineCount;
		this.map = [];
		this.mines = []
	}

	getCell(x, y){
		return this.map[this.coordToCellIndex(x, y)];
	}

	setCell(x, y, flags){
		this.map[this.coordToCellIndex(x, y)] = flags;
	}

	coordToCellIndex(x, y){
		return x + (y * (this.width+1));
	}

	clear(){
		this.mines = []
		var map = this.map;
		for (let x = 0;x < this.width;x ++){
			for (let y = 0;y <  this.height;y ++){
				this.setCell(x, y, CELL_EMPTY);				
			}
		}
	}

	haveAllMinesBeenFlagged(){
		for (let i = 0; i < this.mines.lengnth; i++){
			let mine = this.mines[i];
			if ((this.getCell(mine[0], mine[1]) & CELL_FLAG) != CELL_FLAG){
				return false;
			}
		}

		return true;
	}

	revealMines(){
		for (let x = 0;x < this.width;x ++){
			for (let y = 0;y <  this.height;y ++){
				let flags = this.getCell(x,y);
				if ((flags & CELL_MINE) == CELL_MINE)
					this.setCell(x, y, flags | CELL_VISIBLE);				
			}
		}
	}

	floodFill(x, y, checked){
		let flags = this.getCell(x, y);
		if ((flags & CELL_MINE) == CELL_MINE) return;
		if (checked[x] && checked[x][y] == true) return;

		this.setCell(x, y, flags | CELL_VISIBLE);

		if (!checked[x]) checked[x]  = [];
		checked[x][y] = true;

		for (let x1 = Math.max(0, x - 1); x1 < Math.min(x + 1, this.width); x1++){
			for (let y1 = Math.max(0, y - 1); y1 < Math.min(y + 1, this.width); y1++){
				if ((this.getCell(x1, y1) & CELL_MINE) == CELL_MINE) return;
			}
		}

		if (x > 0) this.floodFill(x - 1, y, checked);
		if (x < this.width - 1) this.floodFill(x + 1, y, checked);
		if (y > 0) this.floodFill(x, y - 1, checked);
		if (y < this.height - 1) this.floodFill(x, y + 1, checked);
	}

	hitCell(x, y){
		let flags = this.getCell(x, y);

		if ((flags & CELL_MINE) == CELL_MINE){
			this.revealMines();
			return true;
		}

		if ((flags & CELL_FLAG) == CELL_FLAG){
			this.setCell(x, y, flags ^ CELL_FLAG);
		}

		if ((flags & CELL_EMPTY) == CELL_EMPTY) {
			this.floodFill(x, y, []);			
		}

		return false;
	}

	getUnflaggedMineCount(){
		let count = 0;
		for (let x = 0;x < this.width;x ++){
			for (let y = 0;y <  this.height;y ++){
				let flags = this.getCell(x, y);
				if ((flags & CELL_MINE) == CELL_MINE && !((flags & CELL_FLAG) == CELL_FLAG)){
					count +=1;
				}				
			}
		}

		return count;
	}

	flagCell(x, y){
		let flags = this.getCell(x, y);

		if ((flags & CELL_VISIBLE) == CELL_VISIBLE)
			return 0;

		if ((flags & CELL_FLAG) == CELL_FLAG){
			this.setCell(x, y, flags ^ CELL_FLAG)
			return 1;
		}
		else{
			this.setCell(x, y, flags | CELL_FLAG)
			return -1;
		}
	}

	draw(containerEl){
		for (let y = 0;y < this.height;y ++){
			let rowId = `row${y}`;
			let existingRowEl = $(`#${rowId}`);
			let existingRow = existingRowEl.length == 1 ? existingRowEl : null;
			let row = existingRow || $(`<div id=\"${rowId}\" class=\"row\">`);
			for (let x = 0;x <  this.width;x ++){
				let cellFlags = this.getCell(x, y);
				let cellId = `cell${x}x${y}`;
				let existingCellEl = $(`#${cellId}`);
				let existingCell = existingCellEl.length == 1 ? existingCellEl : null;
				let cell = existingCell || $(`<div id=\"${cellId}\" class=\"cell\">`).attr({x: x, y: y});				
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
						for (let x1 = Math.max(0, x - 1); x1 <= Math.min(x + 1, this.width - 1); x1++){
							for (let y1 = Math.max(0, y - 1); y1 <= Math.min(y + 1, this.height - 1); y1++){
								if ((this.getCell(x1, y1) & CELL_MINE) == CELL_MINE) neighbors += 1;
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

			if (!existingRow) $(containerEl).append(row);
		}
	}

	build(){
		this.buildCluster(0, 6, 3);
		if (this.mines.length < this.numberOfMines){
			this.build();
		}
	}

	getRandomCells(minX, minY, maxX, maxY, flag){
		let points = [];
		for (let x = minX; x <= maxX; x++){
			for (let y = minY; y <= maxY; y++){
				if (this.getCell(x, y) === flag){
					points.push([x, y]);
				}
			}
		}

		if (points.length ==0) return [];
		let index = 0 + Math.round(Math.random() * (points.length - 1));
		return points[index];
	}

	getPossiblePoints(lastPoint, minX, minY, maxX, maxY){
		function oneOrZero(){
			return (Math.random() * 100) > 50 ? 1 : 0;
		}

		let points = [];
		for (let x = Math.max(minX, lastPoint[0] - oneOrZero()); x <= Math.min(maxX, lastPoint[0] + oneOrZero()); x++){
			for (let y = Math.max(minY, lastPoint[1] - oneOrZero()); y <= Math.min(maxY, lastPoint[1] + oneOrZero()); y++){
				if (x != lastPoint[0] && y != lastPoint[1] && this.getCell(x, y) === CELL_EMPTY){
					points.push([x, y]);
				}
			}
		}

		return points;
	}

	traverseCluster(lastPoint, minX, minY, maxX, maxY, minesRemaining){
		if (this.mines.length === this.numberOfMines || minesRemaining < 1) return;

		let points = this.getPossiblePoints(lastPoint, minX, minY, maxX, maxY)
		if (points.length === 0) return;

		let pointIndex = Math.floor(Math.random() * (points.length - 1));
		let nextPoint = points[pointIndex];
		this.placeMine(nextPoint[0], nextPoint[1]);
		this.traverseCluster(nextPoint, minX, minY, maxX, maxY, minesRemaining - 1);
	}

	buildCluster(border, clusterSize, minesPerCluster){
		let clusterSizeHalf = Math.round(clusterSize / 2);
		let maxX = this.width - (1 + border);
		let maxY = this.height - (1 + border);
		let origin = this.getRandomCells(border, border, maxX, maxY, CELL_EMPTY);
		this.placeMine(origin[0], origin[1]);
		this.traverseCluster(origin, Math.max(border, origin[0] - clusterSizeHalf), Math.max(border, origin[1] - clusterSizeHalf),
			Math.min(maxX, origin[0] + clusterSizeHalf), Math.min(maxY, origin[1] + clusterSizeHalf), minesPerCluster - 1);
	}

	placeMine(x, y){
		if (this.getCell(x, y) !== CELL_EMPTY) return;

		this.setCell(x, y, CELL_MINE);	
		this.mines.push([x, y]);
	}


}