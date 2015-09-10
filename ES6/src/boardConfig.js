class BoardConfig {

	constructor(){
		this.configurations = ["beginner", "intermediate"];
	}

	beginner(){
		return {
			width: 8,
			height: 8,
			mines: 10
		}
	}

	intermediate(){
		return {
			width: 16,
			height: 16,
			mines: 40
		}
	}


}
