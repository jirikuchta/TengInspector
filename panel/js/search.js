/**
 * Vyhledavani pres specialni policko
 * Docasne, dokud nezacne fungovat udalost 'onSearch' v chrome API
 * 
 */
Search = function () {
	this._lastSearch = '';
	this._turn = 0;
	this._results = [];
	this._items = document.getElementById('panel').getElementsByClassName('search');
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
	var selected = document.getElementsByClassName('selected');
	for (var i = 0; i < selected.length; i++) { Utils.removeClass(selected[i], 'selected'); }
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

	for (var i = 0; i < this._items.length; i++) {
		var content = this._items[i].innerHTML;
		var patt = new RegExp(this._input.value, "i");
		if (patt.test(content)) { this._results.push(this._items[i]); };
	}

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

	while (!Utils.hasClass(parent, 'main')) {
		if (parent.tagName.toLowerCase() == 'ol' || parent.tagName.toLowerCase() == 'li') {
			parents.push(parent);
		}

		parent = parent.parentNode;
	}

	Utils.addClass(parents[0], 'selected');

	for (var i = 0; i < parents.length; i++) {
		if (!Utils.hasClass(parents[i], 'prop')) {
			Utils.addClass(parents[i], 'expanded');	
			if (Utils.hasClass(parents[i], 'parent')) {
				var children = parents[i].getElementsByClassName('children')[0];
				Utils.addClass(children, 'expanded');
			}
		}
	}
	
	this._results[this._turn].scrollIntoView(false);
	
};

Search.prototype._closeAll = function () {
	var expanded = document.getElementById('panel').getElementsByClassName('expanded');
	var selected = document.getElementById('panel').getElementsByClassName('selected');
	for (var i = expanded.length; i > 0; i--) { Utils.removeClass(expanded[i-1], 'expanded'); }
	for (var i = selected.length; i > 0; i--) { Utils.removeClass(selected[i-1], 'selected'); }
};
