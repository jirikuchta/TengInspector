/**
 * Trida vytvarejici HTML strukturu dat
 * @param {obj, array} data Zdrojova data
 */
DOMBuilder = function (data) {
	this.data = data;

	this.wrap = document.createElement('ol');
	this.wrap.className = 'main';

	for (var key in data) {
		this.wrap.appendChild(this._build(key, data[key]));
	}
};

DOMBuilder.prototype._build = function (itemName, itemValue) {
	var li = document.createElement('li');

	var name = document.createElement('span');
	name.className = "name";
	name.innerHTML = itemName;

	var separator = document.createElement('span');
	separator.className = 'separator';
	separator.innerHTML = ': ';

	var value = document.createElement('span');
	value.className = 'value';

	if (itemValue instanceof Array) { // subfragment
		li.className = 'parent';
		var children = document.createElement('ol');
		children.className = "children";
		Utils.addClass(name, 'search');
		li.appendChild(name);
		for (var i = 0; i < itemValue.length; i++) { children.appendChild(this._buildSubfragment(itemName, i, itemValue[i])); }
		li.appendChild(children);
	} else { // promenna
		value.innerHTML = '"'+itemValue+'"';
		li.className = 'prop';
		Utils.addClass(name, 'search');
		Utils.addClass(value, 'search');
		li.appendChild(name);
		li.appendChild(separator);
		li.appendChild(value);
	}

	return li;
};

DOMBuilder.prototype._buildSubfragment = function (itemName, i, itemData) {
	var li = document.createElement('li');
	var name = document.createElement('span');
	name.className = "name";
	name.innerHTML = itemName+'['+i+']';
	li.appendChild(name);

	var wrap = document.createElement('ol');
	for (var key in itemData) {
		wrap.appendChild(this._build(key, itemData[key]))	;
	}
	li.appendChild(wrap);

	return li;
};

DOMBuilder.prototype.getResult = function () {
	return this.wrap;
};

