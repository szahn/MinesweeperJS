const CELL_EMPTY = 1;
const CELL_MINE = 2;
const CELL_FLAG = 4;
const CELL_VISIBLE = 8;

class Board{

	constructor(width, height, mineCount){
		this.width = width;
		this.height = height;
		this.rows = this.numToArray(this.height);
		this.columns = this.numToArray(this.width);
		this.numberOfMines = mineCount;
		this.map = [];
		this.mines = []
	}

	forEachCell(callback){
		for (let x of this.columns){
			for (let y of this.rows){
				callback(x, y);
			}
		}
	}

	numToArray(number){
		let numbers = [];
		for(let n = 0; n < number; n++){
			numbers.push(n);
		}
		return numbers;
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
		this.forEachCell((x, y) => {
			this.setCell(x, y, CELL_EMPTY);				
		});
	}

	haveAllMinesBeenFlagged(){
		for (let mine of this.mines){
			if ((this.getCell(mine[0], mine[1]) & CELL_FLAG) != CELL_FLAG){
				return false;
			}
		}

		return true;
	}

	revealMines(){
		this.forEachCell((x, y) => {
			let flags = this.getCell(x,y);
			if ((flags & CELL_MINE) == CELL_MINE)
				this.setCell(x, y, flags | CELL_VISIBLE);				
		});
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
		this.forEachCell((x, y) => {
			let flags = this.getCell(x, y);
			if ((flags & CELL_MINE) == CELL_MINE && !((flags & CELL_FLAG) == CELL_FLAG)){
				count +=1;
			}				
		});

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