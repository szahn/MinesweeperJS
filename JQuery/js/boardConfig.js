"use strict";

var BoardConfig = function(){

}

BoardConfig.prototype = {

	configurations: ["beginner", "intermediate"],

	beginner: function(){
		return {
			width: 8,
			height: 8,
			mines: 10
		}
	},

	intermediate: function(){
		return {
			width: 16,
			height: 16,
			mines: 40
		}
	}

}