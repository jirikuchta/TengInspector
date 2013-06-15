/**
 * Vyhledavani pres specialni policko
 * Docasne, dokud nezacne fungovat udalost 'onSearch' v chrome API
 *
 */
Search = function () {
	this._lastSearch = '';
	this._turn = 0;
	this._results = [];
	this._items = TENGINS.dom.panel.querySelectorAll('.search');
	this._build();
};

Search.prototype._build = function () {
	this._wrap = document.createElement('div');
	this._input = document.createElement('input');
	this._count = document.createElement('span');

	this._wrap.id = 'search';
	this._input.setAttribute('placeholder', 'Prohledat teng');

	this._wrap.appendChild(this._input);
	this._wrap.appendChild(this._count);
	TENGINS.dom.sidebar.appendChild(this._wrap);
	this._wrap.style.top = document.body.clientHeight + 'px';

	this._input.addEventListener('keyup', this._keyup.bind(this));
	this._input.addEventListener('blur', this._blur.bind(this));
	TENGINS.dom.sidebar.addEventListener('scroll', this._setBoxPosition.bind(this));
	window.addEventListener('resize', this._setBoxPosition.bind(this));

	this._setBoxPosition();
};

Search.prototype._keyup = function (e) {
	var val = this._input.value;
	if (val.length) {
		if (e.keyCode == 13) {
			this._closeAll();
			if (val == this._lastSearch) {
				this._searchNext();
			} else {
				this._search();
			}
		} else if (e.keyCode == 27) {
			this._cancelSearch();
		}
	} else {
		this._count.innerHTML = '';
	}
};

Search.prototype._blur = function (e) {
	var selected = document.querySelectorAll('.selected');
	[].forEach.call(selected, function (item, i, arr) {
		item.classList.remove('selected');
	});
};

Search.prototype._setBoxPosition = function (e) {
	this._wrap.style.top = TENGINS.dom.sidebar.clientHeight + TENGINS.dom.sidebar.scrollTop - 32 + 'px';
};

Search.prototype._cancelSearch = function () {
	this._input.value = '';
	this._turn = 0;
	this._count.innerHTML = '';
	this._input.blur();
};

Search.prototype._search = function () {
	this._results = [];
	this._lastSearch = this._input.value;
	this._turn = 0;

	[].forEach.call(this._items, function (item, i, arr) {
		var content = item.innerHTML;
		var patt = new RegExp(this._input.value, "i");
		if (patt.test(content)) { this._results.push(item); };
	}, this);

	if (this._results.length) {
		this._searchNext();
	} else {
		this._count.innerHTML = 'Nic nenalezeno';
	}
};

Search.prototype._searchNext = function () {
	this._count.innerHTML = (this._turn + 1) +' z '+this._results.length;
	this._expand();
	this._turn = this._turn + 1;
	if (this._turn == this._results.length) { this._turn = 0; }
};

Search.prototype._expand = function () {
	var parents = [];
	var parent = this._results[this._turn].parentNode;

	while (!parent.classList.contains('main')) {
		if (parent.tagName.toLowerCase() == 'ol' || parent.tagName.toLowerCase() == 'li') {
			parents.push(parent);
		}

		parent = parent.parentNode;
	}

	parents[0].classList.add('selected');

	for (var i = 0; i < parents.length; i++) {
		var p = parents[i];
		if (!p.classList.contains('prop')) {
			p.classList.add('expanded');
			if (p.classList.contains('parent')) {
				p.querySelector('.children').classList.add('expanded');
			}
		}
	}

	this._results[this._turn].scrollIntoView(false);

};

Search.prototype._closeAll = function () {
	var expanded = TENGINS.dom.panel.querySelectorAll('.expanded');
	var selected = TENGINS.dom.panel.querySelectorAll('.selected');
	for (var i = expanded.length; i > 0; i--) { expanded[i-1].classList.remove('expanded'); }
	for (var i = selected.length; i > 0; i--) { selected[i-1].classList.remove('selected'); }
};
