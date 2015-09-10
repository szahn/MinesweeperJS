"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var BoardConfig = (function () {
	function BoardConfig() {
		_classCallCheck(this, BoardConfig);

		this.configurations = ["beginner", "intermediate"];
	}

	_createClass(BoardConfig, [{
		key: "beginner",
		value: function beginner() {
			return {
				width: 8,
				height: 8,
				mines: 10
			};
		}
	}, {
		key: "intermediate",
		value: function intermediate() {
			return {
				width: 16,
				height: 16,
				mines: 40
			};
		}
	}]);

	return BoardConfig;
})();