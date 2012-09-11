var Utils = {
	hasClass: function (element, className) {
		var arr = element.className.split(" ");
		for (var i=0;i<arr.length;i++) {
			if (arr[i].toLowerCase() == className.toLowerCase()) { return true; }
		}
		return false;
	},

	addClass: function (element, className) {
		if (this.hasClass(element,className)) { return; }
		element.className += " "+className;
	},

	removeClass: function (element, className) {
		var names = element.className.split(" ");
		var newClassArr = [];
		for (var i=0;i<names.length;i++) {
			if (names[i].toLowerCase() != className.toLowerCase()) { newClassArr.push(names[i]); }
		}
		element.className = newClassArr.join(" ");
	},
};
